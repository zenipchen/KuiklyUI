# Kuikly Preview 性能测试报告

## 测试环境
- 项目: KuiklyUI (zenipchen/previewmcp 分支)
- 机器: Linux 服务器
- Gradle: 7.6.3
- Java: 17 (Kona JDK)

## 测试结果汇总

| 阶段 | 首次编译 (--rerun-tasks) | 增量编译 (--build-cache) |
|------|------------------------|------------------------|
| Gradle 配置 | ~9秒 | ~1-2秒 |
| Kotlin 编译 (:demo:compileKotlinJs) | **33秒** | ~1-2秒 |
| Webpack 打包 (:demo:jsBrowserDevelopmentWebpack) | **53秒** | ~1-2秒 |
| 完整打包 (:demo:packLocalJsBundleDebug) | **52秒** | **~2秒** |

## 关键发现

### 1. 首次编译非常慢 (52秒)
当代码真正需要重新编译时（例如修改了 import、类结构等），需要：
- Kotlin 编译: 33秒
- Webpack 打包: 53秒
- 总计: ~52-60秒

### 2. 增量编译非常快 (2秒)
当代码变更不影响依赖关系时：
- 66个任务中 64个是 UP-TO-DATE
- 只有 2个任务需要执行
- 总计: ~2秒

### 3. Gradle 配置是瓶颈之一
每次启动 Gradle 都需要 8-9秒的配置时间，即使只是检查 UP-TO-DATE。

## 瓶颈分析

```
完整编译流程 (52秒)
├── Gradle 配置阶段: ~8秒 (15%)
├── Kotlin 编译: ~33秒 (63%)
│   ├── 解析依赖图
│   ├── 类型检查 (266个文件)
│   └── IR 生成 + JS 输出
├── Webpack 打包: ~10秒 (19%) (实际webpack时间)
│   └── 处理 27MB 产物
└── 其他任务: ~1秒 (3%)
```

## 优化建议

### 立即可做的优化 (简单有效)

#### 1. 保持 Gradle Daemon 运行
```bash
./gradlew --stop  # 先停止
./gradlew --status # 检查状态
```
Daemon 已经在运行，但每次 spawn 新进程仍有开销。

#### 2. 使用 Continuous Build 模式 (推荐)
启动后台进程持续监听文件变化：
```bash
./gradlew :demo:packLocalJsBundleDebug --continuous -PpageName=PreviewPage
```
这样配置阶段只执行一次，后续编译只需处理变更。

#### 3. 启用 Configuration Cache
```bash
./gradlew :demo:packLocalJsBundleDebug --configuration-cache
```
可以跳过 8秒的配置阶段。

### 架构级优化 (需要改动)

#### 方案A: 跳过 Webpack (节省 ~10秒)
直接加载 Kotlin 编译输出的 JS，不经过 Webpack 打包。
- 产物路径: `demo/build/kotlin-js-min/js/developmentExecutable/`
- 需要修改 H5 加载逻辑

#### 方案B: 预编译框架 (节省 ~30秒)
将 Kuikly 框架代码预编译为 npm 包，只编译用户代码。
- 需要修改 build.gradle 配置
- 将 `:core`, `:compose` 改为 npm 依赖

#### 方案C: Kotlin/JS IR 编译器优化
```groovy
// gradle.properties
kotlin.incremental.js=true
kotlin.js.compiler=ir
```

#### 方案D: 使用 webpack-dev-server (推荐)
启动 webpack dev server，利用热更新 (HMR) 只更新变更模块。
```bash
./gradlew :demo:jsBrowserDevelopmentRun
```

## 预期效果

| 优化方案 | 预期耗时 | 实现难度 |
|---------|---------|---------|
| 当前 (增量) | ~2秒 | - |
| 当前 (完整) | ~52秒 | - |
| + Continuous Build | ~10秒 | ⭐ |
| + Configuration Cache | ~44秒 | ⭐ |
| + 跳过 Webpack | ~35秒 | ⭐⭐ |
| + 预编译框架 | ~5秒 | ⭐⭐⭐⭐ |
| + webpack-dev-server | ~2-3秒 | ⭐⭐ |

## 推荐方案

对于预览场景，**最佳方案是 webpack-dev-server + Continuous Build**：
1. 启动时预编译一次 (52秒，可接受)
2. 后续修改利用 HMR 热更新 (2-3秒)
3. 用户几乎感受不到延迟

需要实现：
1. 修改 server.js 启动 webpack dev server
2. 前端通过 WebSocket 接收更新通知
3. iframe 自动刷新或 HMR 更新
