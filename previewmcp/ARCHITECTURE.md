---
description: 
alwaysApply: false
enabled: true
updatedAt: 2026-03-04T02:44:38.509Z
provider: 
---

# Kuikly DSL Preview 架构与流程

## 系统架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              前端 (浏览器)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Monaco Editor  ←──→  编译触发 (Ctrl+S/点击运行)  ←──→  iframe 预览面板       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ POST /compile
┌─────────────────────────────────────────────────────────────────────────────┐
│                              服务端 (Node.js)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  server.js 接收请求 → writeKotlinFile() → runGradleBuild() → 返回结果        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ 写入文件 & 调用 Gradle
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Gradle 编译链                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  :demo:compileKotlinJs → jsBrowserDevelopmentWebpack → packLocalJSBundleDebug│
│       (Kotlin→JS)           (Webpack打包27MB)          (生成zip产物)         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ 提供静态资源
┌─────────────────────────────────────────────────────────────────────────────┐
│                              前端 (iframe)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  加载 /preview → 获取 HTML → 加载 nativevue2.js + h5App.js → 渲染预览        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 完整预览流程

### 1. 代码编辑阶段
- **位置**: 浏览器端 (`app.js`)
- **编辑器**: Monaco Editor (VS Code 同款)
- **触发编译**: 
  - 手动: 点击"运行"按钮 或 `Ctrl+S`
  - 自动: 开启"自动编译"后，停止输入 1.5 秒自动触发

### 2. 编译请求阶段
- **API**: `POST /compile`
- **请求体**: `{code: "DSL代码", type: "dsl|compose", pageName: "PreviewPage"}`
- **服务端处理** (`server.js`):
  ```javascript
  async function handleCompile(code, type, pageName) {
      writeKotlinFile(code, type);        // 写入 .kt 文件
      const result = await runGradleBuild(); // Gradle 编译
      return { success: true, elapsed: result.elapsed };
  }
  ```

### 3. 代码写入阶段
- **目标文件**: `demo/src/commonMain/kotlin/com/tencent/kuikly/demo/pages/preview/PreviewPage.kt`
- **自动包装**: 如果代码中没有 package/import，自动添加:
  ```kotlin
  package com.tencent.kuikly.demo.pages.preview
  
  import com.tencent.kuikly.core.annotations.Page
  import com.tencent.kuikly.core.base.*
  // ... 其他 import
  
  @Page("PreviewPage")
  // 用户代码插入这里
  ```

### 4. Gradle 编译阶段 (~20秒)
- **命令**:
  ```bash
  ./gradlew :demo:packLocalJsBundleDebug \
      -PpageName=PreviewPage \
      -Pkuikly.useLocalKsp=false \
      --parallel --build-cache
  ```
- **任务链**:
  1. `:demo:compileKotlinJs` - Kotlin 编译为 JS (~8-10秒)
  2. `:demo:jsBrowserDevelopmentWebpack` - Webpack 打包 (~5秒)
  3. `:demo:packLocalJSBundleDebug` - 打包为 zip 产物

### 5. 预览加载阶段
- **入口**: `/preview` 路由
- **HTML 生成**: 动态修改 `h5App/build/processedResources/js/main/index.html`
  - 替换 `nativevue2.js` 路径为带时间戳的版本 (防缓存)
  - 替换 `h5App.js` 路径
- **资源加载**:
  ```html
  <script src="/nativevue2.js?t=123456"></script>
  <script src="/h5App.js?t=123456"></script>
  ```
- **渲染**: h5App.js 解析 `page_name=PreviewPage` 参数，加载对应页面

## 核心文件映射

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| 编辑器页面 | `previewmcp/index.html` | Monaco Editor 界面 |
| 前端逻辑 | `previewmcp/app.js` | 编辑器初始化、编译触发 |
| 服务端 | `previewmcp/server.js` | HTTP 服务、编译调度 |
| DSL 源文件 | `demo/src/commonMain/kotlin/.../PreviewPage.kt` | 用户代码写入位置 |
| 编译产物 | `demo/build/dist/js/developmentExecutable/nativevue2.js` | 27MB JS bundle |
| H5 入口 | `h5App/build/processedResources/js/main/index.html` | 预览页面模板 |

## 性能瓶颈分析

### 1. Kotlin 编译 (~8-10秒)
**原因**:
- demo 模块有 266 个 Kotlin 文件
- Kotlin/JS 需要完整类型检查和 IR 生成
- 虽然只改 1 个文件，但需重新验证整个模块

### 2. Webpack 打包 (~5秒 + 任务链开销)
**原因**:
- 产物大小 27MB
- 需要打包整个 Kuikly 框架代码

### 3. Gradle 配置 (~3-5秒)
**原因**:
- 多模块项目 (core, compose, demo 等)
- 每次都要解析依赖图

**总计**: ~20秒/次编译

## 优化建议

| 方案 | 效果 | 难度 |
|------|------|------|
| Continuous Build | 后台持续编译，减少启动开销 | ⭐⭐ |
| 跳过 Webpack | 直接加载未打包 JS，省 ~5秒 | ⭐⭐⭐ |
| 预编译框架 | 框架代码预编译，只编用户代码 | ⭐⭐⭐⭐ |
| DSL 解释执行 | 前端直接解析 DSL，无需编译 | ⭐⭐⭐⭐⭐ |

## 调试技巧

### 查看编译日志
```bash
tail -f /data/workspace/kuikly-ui/previewmcp/server.log
```

### 手动触发编译测试
```bash
cd /data/workspace/kuikly-ui
./gradlew :demo:packLocalJsBundleDebug -PpageName=PreviewPage --parallel
```

### 检查产物是否生成
```bash
ls -lh demo/build/dist/js/developmentExecutable/nativevue2.js
ls -lh demo/build/outputs/kuikly/js/debug/local/nativevue2.zip
```

## 常见问题

### Q: 为什么命令行编译只要 1-2 秒？
**A**: 代码未变更时，Gradle 显示 UP-TO-DATE，跳过实际编译。修改代码后仍需 ~20秒。

### Q: 如何减少编译时间？
**A**: 当前架构下 20秒是 Kotlin/JS 编译的物理极限。如需更快，需改用 DSL 解释执行或预编译方案。

### Q: 编译失败如何排查？
**A**: 
1. 查看 `server.log` 中的 Gradle 错误输出
2. 检查 PreviewPage.kt 语法是否正确
3. 手动运行 Gradle 命令查看详细错误