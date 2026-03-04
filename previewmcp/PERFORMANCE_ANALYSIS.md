# Kuikly DSL Preview 编译性能分析报告

## 📊 测试环境

| 项目 | 配置 |
|------|------|
| CPU | 32 核心 |
| 内存 | 61GB |
| Java | OpenJDK 17.0.17 |
| Gradle | 7.6.3 (Daemon 模式) |
| Kotlin | Multiplatform + JS(IR) |

## ⏱️ 各阶段耗时分析

### 完整编译流程（代码有变更时）

| 阶段 | 耗时 | 占比 | 说明 |
|------|------|------|------|
| Gradle 启动 | ~1s | 5% | Daemon 热启动 |
| KSP 处理 | ~1.6s | 8% | 注解处理器 |
| **Kotlin 编译** | **~8-9s** | **45%** | 🔴 **瓶颈1**: 编译 266 个 .kt 文件 |
| **Webpack 打包** | **~5s** | **25%** | 🔴 **瓶颈2**: 打包 27MB JS 文件 |
| Gradle 任务调度 | ~3-4s | 17% | 任务依赖解析、NPM 处理 |
| **总计** | **~19-20s** | 100% | |

### 无代码变更时（全部 UP-TO-DATE）

| 阶段 | 耗时 |
|------|------|
| 完整流程 | ~1.6s |

## 🔴 瓶颈详细分析

### 瓶颈1: Kotlin/JS 编译 (~8-9秒)

**问题根源**:
- demo 模块有 **266 个 Kotlin 文件**
- 虽然只修改了 1 个文件（PreviewPage.kt），但 Kotlin 编译器需要：
  1. 分析整个模块的依赖图
  2. 重新验证类型系统
  3. 生成 IR 中间表示
  4. 输出 JavaScript 代码

**数据**:
```
commonMain: 254 个 .kt 文件
jsMain: 3 个 .kt 文件
总计: 266 个文件
```

**为什么增量编译帮助有限**:
- Kotlin/JS IR 后端的增量编译支持不如 JVM 完善
- 每次修改都需要重新生成整个模块的 JS 代码

### 瓶颈2: Webpack 打包 (~5秒实际执行 + ~15秒 Gradle 任务链)

**问题根源**:
- 产物大小: **27MB** (nativevue2.js)
- 虽然 webpack 本身只需要 5 秒，但整个任务链需要 20 秒

**产物分析**:
```
nativevue2.js:              10.9 MiB (主模块)
KuiklyCore-core:             1.66 MiB
kotlin-stdlib:               1.03 MiB
kuikly-ui-compose:           8.13 MiB
compose-runtime:             1.64 MiB
kotlinx-coroutines-core:     712 KiB
其他依赖:                    3+ MiB
总计:                        27 MiB
```

### 核心问题总结

1. **demo 模块太庞大**: 包含 266 个页面文件，每次编译都要处理所有代码
2. **JS 产物太大**: 27MB 的 JS 文件每次都要完整打包
3. **无法真正增量**: Kotlin/JS 的增量编译效果有限

## ✅ 可行的优化方案

### 方案1: Gradle Continuous Build + 文件监听（推荐 ⭐⭐⭐⭐⭐）

**原理**: 启动持续构建模式，让 Gradle JVM 保持运行并监听文件变化

**优势**:
- Gradle 配置只执行一次（节省 ~3秒）
- Kotlin Daemon 完全热启动（节省 ~2-3秒）
- 增量编译效果更好
- **预计编译时间: 10-12秒**

**实现方式**:

```javascript
// server.js 添加 Continuous Build 支持
let continuousBuildProcess = null;
let buildCompleteCallback = null;

function startContinuousBuild() {
    const args = [
        ':demo:jsBrowserDevelopmentWebpack',
        '--continuous',
        '-PpageName=PreviewPage',
        '-Pkuikly.useLocalKsp=false'
    ];
    
    continuousBuildProcess = spawn('./gradlew', args, {
        cwd: PROJECT_ROOT,
        env: { ...process.env, JAVA_HOME: '/usr/lib/jvm/java-17-konajdk' }
    });
    
    continuousBuildProcess.stdout.on('data', (data) => {
        if (data.includes('BUILD SUCCESSFUL')) {
            buildCompleteCallback && buildCompleteCallback(true);
        }
    });
}

// 编译时只需写入文件，等待 continuous build 检测
async function compile(code) {
    writeKotlinFile(code);
    return new Promise((resolve) => {
        buildCompleteCallback = resolve;
        // continuous build 会自动检测文件变化并编译
    });
}
```

---

### 方案2: 跳过 Bundle 打包，直接使用 Webpack 产物（推荐 ⭐⭐⭐⭐）

**原理**: 使用 `:demo:jsBrowserDevelopmentWebpack` 任务替代 `:demo:packLocalJsBundleDebug`

**当前任务链**:
```
compileKotlinJs → jsBrowserDevelopmentWebpack → packJsLocalAssetsDebug → packLocalJSBundleDebug
```

**优化后任务链**:
```
compileKotlinJs → jsBrowserDevelopmentWebpack
```

**节省时间**: ~2-3秒（跳过 zip 打包步骤）

**实现**:
```javascript
// server.js 修改 COMPILE_TASK
COMPILE_TASK: ':demo:jsBrowserDevelopmentWebpack',  // 原来是 packLocalJsBundleDebug
```

**H5 预览直接加载**:
```javascript
// 产物路径
const JS_PATH = 'demo/build/dist/js/developmentExecutable/nativevue2.js';
```

---

### 方案3: 并行度优化（推荐 ⭐⭐⭐）

**当前配置**:
```properties
org.gradle.workers.max=8
org.gradle.parallel=true
```

**进一步优化**:
```properties
# gradle.properties
org.gradle.workers.max=16  # 机器有 32 核心，可以更激进
kotlin.compiler.execution.strategy=in-process  # Kotlin 编译器在进程内执行
```

**预期效果**: 编译时间减少 10-15%

---

### 方案4: 禁用 Source Map（快速开发模式）（推荐 ⭐⭐⭐）

**原理**: Source Map 生成需要额外时间

**实现**:
```kotlin
// demo/build.gradle.kts
commonWebpackConfig {
    devtool = if (isQuickBuild) "false" else "source-map"
}
```

**预期效果**: Webpack 时间减少 ~1秒

---

### 方案5: 分离预览模块（长期方案 ⭐⭐⭐⭐⭐）

**原理**: 创建独立的轻量预览模块，只包含必要依赖

**优势**:
- 只编译预览代码，不编译 demo 的 254 个页面
- 产物大小从 27MB 降低到 ~10MB
- **预计编译时间: 3-5秒**

**挑战**:
- 需要正确配置 KuiklyPlugin
- 需要处理代码生成（KSP）

**这是最有效的优化方案，但需要一定的开发工作量**

---

### 方案6: HMR 热模块替换（终极方案 ⭐⭐⭐⭐⭐）

**原理**: 使用 Webpack Dev Server 的热更新功能

**启动命令**:
```bash
./gradlew :demo:jsBrowserDevelopmentRun
```

**优势**:
- 代码变更后 **几乎即时刷新**（<1秒）
- 保留页面状态
- 最佳开发体验

**挑战**:
- 需要改变预览架构
- 需要在 Dev Server 启动后再进行代码注入

---

## 📋 优化方案对比

| 方案 | 预期耗时 | 改动量 | 风险 | 推荐度 |
|------|----------|--------|------|--------|
| 方案1: Continuous Build | 10-12秒 | 小 | 低 | ⭐⭐⭐⭐⭐ |
| 方案2: 跳过 Bundle | 16-17秒 | 极小 | 低 | ⭐⭐⭐⭐ |
| 方案3: 并行度优化 | 17-18秒 | 极小 | 低 | ⭐⭐⭐ |
| 方案4: 禁用 Source Map | 18-19秒 | 小 | 低 | ⭐⭐⭐ |
| 方案5: 分离预览模块 | 3-5秒 | 大 | 中 | ⭐⭐⭐⭐⭐ |
| 方案6: HMR 热更新 | <1秒 | 大 | 中 | ⭐⭐⭐⭐⭐ |

## 🚀 立即实施的优化

### 已完成的优化
1. ✅ 启用 Kotlin/JS 增量编译 (`kotlin.incremental.js=true`)
2. ✅ 增加并行 worker 数量 (`org.gradle.workers.max=8`)

### 建议立即实施
1. **方案2**: 修改编译任务为 `jsBrowserDevelopmentWebpack`
2. **方案1**: 实现 Continuous Build 模式

---

## 📝 结论

当前编译耗时 **19-20秒** 的主要原因：

| 原因 | 耗时占比 |
|------|----------|
| Kotlin 编译 266 个文件 | 45% |
| Webpack 打包 27MB JS | 25% |
| Gradle 任务调度 | 20% |
| 其他 | 10% |

**短期优化**（可将时间降至 10-12秒）：
- 使用 Continuous Build 模式
- 跳过 Bundle 打包步骤

**长期优化**（可将时间降至 3-5秒）：
- 创建独立的轻量预览模块
- 实现 HMR 热更新
