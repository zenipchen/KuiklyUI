# Kuikly 桌面端渲染实现需求文档

## 背景
Kuikly 当前已支持多端渲染：
- **Android**: `core` + `compose` (JVM 逻辑层) + `core-render-android` (原生渲染层)
- **iOS**: `core` + `compose` (Native 逻辑层) + `core-render-ios` (原生渲染层)  
- **H5**: `core` + `compose` (JS 逻辑层) + `core-render-web/h5` (Web 渲染层)
- **小程序**: `core` + `compose` (JS 逻辑层) + `core-render-web/miniapp` (小程序渲染层)

## 需求目标
实现 **桌面端 (Desktop)** 的渲染支持，架构设计如下：
- **逻辑层**: `core` + `compose` 运行在 **JVM** 环境（类似 Android）
- **渲染层**: 复用 `core-render-web` 的 Web 渲染能力
- **宿主容器**: JVM 桌面应用，使用 **WebView/浏览器引擎** 承载渲染
- **通信机制**: 逻辑层（JVM）与渲染层（WebView）通过 **JS Bridge** 双向通信

## 核心架构

### 1. 分层设计
```
┌─────────────────────────────────────────┐
│          Desktop Application (JVM)       │
│  ┌───────────────┐    ┌──────────────┐  │
│  │  Logic Layer  │◄──►│ Render Layer │  │
│  │  (JVM/Kotlin) │    │  (WebView)   │  │
│  │               │    │              │  │
│  │ core + compose│    │core-render-  │  │
│  │               │    │   web        │  │
│  └───────────────┘    └──────────────┘  │
│         ▲                     ▲          │
│         │    JS Bridge        │          │
│         └─────────────────────┘          │
└─────────────────────────────────────────┘
```

### 2. 模块职责

#### 2.1 desktopApp (新增模块)
- **类型**: JVM 应用 (kotlin-jvm plugin)
- **职责**:
  1. 创建桌面窗口（使用 JavaFX / Swing / JCEF）
  2. 嵌入 WebView 组件
  3. 初始化 `core` 和 `compose` 逻辑层（JVM 版本）
  4. 实现 JS Bridge，桥接 JVM 逻辑层与 Web 渲染层
  5. 注入全局 JS 函数供 Web 调用（如 `window.callKotlinMethod`）
  6. 注册 Native 回调供 JVM 调用（如 `registerCallNative`）

#### 2.2 core + compose (复用 JVM 目标)
- **依赖**: 确保 `demo` 模块已启用 `jvm()` 目标并配置 `kspJvm`
- **职责**: 
  1. 提供业务逻辑和状态管理（JVM 版本）
  2. 通过 `BridgeManager` 处理来自渲染层的方法调用
  3. 通过 `NativeBridge` 向渲染层发送指令

#### 2.3 core-render-web (复用)
- **依赖**: `core-render-web/h5` 或 `core-render-web/base`
- **职责**:
  1. 在 WebView 中执行，负责 DOM 渲染
  2. 通过 `KuiklyRenderContextHandler` 初始化并注册回调
  3. 监听来自 JVM 的指令并更新 UI

### 3. 通信协议

#### 3.1 Web → JVM (渲染层调用逻辑层)
```kotlin
// 在 desktopApp 中注入到 WebView
window.callKotlinMethod = function(methodId, ...args) {
    // 通过 JNI / JavaFX JSBridge 调用 JVM 的 BridgeManager
    BridgeManager.performNativeMethodWithMethod(methodId, args)
}
```

#### 3.2 JVM → Web (逻辑层调用渲染层)
```kotlin
// 在 desktopApp 中注入，供 NativeBridge 使用
com.tencent.kuikly.core.nvi.registerCallNative = function(pagerId, callback) {
    // 保存 callback，JVM 通过 WebEngine.executeScript 调用
    nativeCallbacks[pagerId] = callback
}
```

## 实现步骤

### 阶段一：基础框架搭建
1. **创建 desktopApp 模块**
   - 在 `settings.gradle.kts` 中 include `:desktopApp`
   - 创建 `desktopApp/build.gradle.kts`（使用 `kotlin("jvm")` 和 `application` 插件）
   - 添加依赖：
     ```kotlin
     dependencies {
         implementation(project(":core"))
         implementation(project(":compose"))
         implementation(project(":demo")) // 用于业务逻辑
         // WebView 方案选择：
         // 方案1: JavaFX (轻量，适合简单场景)
         implementation("org.openjfx:javafx-web:21+")
         // 方案2: JCEF (Chromium内核，性能强，支持大文件)
         implementation("me.friwi:jcefmaven:122.1.10")
     }
     ```

2. **启用 demo 的 JVM 目标**
   - 在 `demo/build.gradle.kts` 中添加 `jvm()` 目标
   - 配置 `kspJvm` 以生成 `KuiklyCoreEntry`
   - 确保 `jvmMain` sourceSet 依赖 `commonMain`

### 阶段二：WebView 容器实现
3. **创建桌面窗口与 WebView**
   ```kotlin
   // desktopApp/src/main/kotlin/Main.kt
   fun main() {
       // 方案1: JavaFX
       Application.launch(DesktopApp::class.java)
       
       // 方案2: JCEF
       val cefApp = CefAppBuilder().build()
       val browser = cefApp.createClient().createBrowser(url, false, false)
   }
   ```

4. **加载 Web 渲染资源**
   - 从 `h5App` dev server 加载：`http://localhost:8080/?page_name=router`
   - 或打包生产版本到本地文件并加载

### 阶段三：JS Bridge 实现
5. **注入 JVM → Web 桥接**
   ```kotlin
   webEngine.executeScript("""
       window.com = window.com || {};
       window.com.tencent = window.com.tencent || {};
       window.com.tencent.kuikly = window.com.tencent.kuikly || {};
       window.com.tencent.kuikly.core = window.com.tencent.kuikly.core || {};
       window.com.tencent.kuikly.core.nvi = window.com.tencent.kuikly.core.nvi || {};
       
       window.com.tencent.kuikly.core.nvi.registerCallNative = function(pagerId, callback) {
           nativeCallbacks[pagerId] = callback;
       };
   """)
   ```

6. **注入 Web → JVM 桥接**
   ```kotlin
   // JavaFX: 使用 JSObject
   val window = webEngine.executeScript("window") as JSObject
   window.setMember("nativeBridge", NativeBridgeAdapter())
   
   class NativeBridgeAdapter {
       fun callKotlinMethod(methodId: Int, vararg args: Any?) {
           BridgeManager.performNativeMethodWithMethod(methodId, args)
       }
   }
   ```

### 阶段四：业务逻辑集成
7. **初始化 KuiklyCoreEntry**
   ```kotlin
   val coreEntry = KuiklyCoreEntry() // 由 KSP 生成
   coreEntry.init()
   ```

8. **处理页面路由**
   - 监听 URL 参数 `page_name`
   - 初始化对应页面的 PageManager

### 阶段五：测试与优化
9. **功能测试**
   - 验证双向通信是否正常
   - 测试 UI 渲染是否正确
   - 检查性能和内存占用

10. **性能优化**
    - 使用生产版本 h5App.js（251KB vs 3.69MB）
    - 启用 WebView 硬件加速
    - 优化 JS Bridge 调用频率

## 关键注意事项

### 技术选型
- **JavaFX WebView**: 
  - ✅ 轻量，集成简单
  - ❌ 基于 WebKit，对大文件支持较弱，不支持某些现代 Web 特性
  - **适用场景**: 简单 UI，资源文件较小

- **JCEF (Chromium)**:
  - ✅ 完整 Chromium 内核，完美支持现代 Web 特性
  - ✅ 支持大文件、WebGL、复杂 JS
  - ❌ 首次下载约 200MB
  - **适用场景**: 复杂 UI，需要完整浏览器能力

### 依赖配置
- 确保 `core` 模块有 `jvmMain` sourceSet 并产出 JVM 变体
- `core-render-web` 只需编译为 JS，不需要 JVM 版本（在 WebView 中执行）

### 调试建议
1. 启动 dev server: `npm run serve` (端口 8083)
2. 启动 h5App: `./gradlew :h5App:jsBrowserDevelopmentRun -t` (端口 8080)
3. 运行桌面应用: `./gradlew :desktopApp:run`
4. 使用 WebView 的开发者工具查看 JS 错误

### 已知问题与解决方案
- **问题**: JavaFX WebView 加载 3.69MB 的 h5App.js 超时
  - **解决**: 使用生产版本 (`./gradlew :h5App:jsBrowserProductionWebpack`) 或切换到 JCEF

- **问题**: 跨域限制导致本地 HTML 无法加载外部资源
  - **解决**: 直接从 dev server 加载完整页面，或使用 `file://` 协议配置 CORS

## 预期成果
完成后，桌面应用应具备以下能力：
1. ✅ 以独立窗口形式运行（Windows/macOS/Linux）
2. ✅ 复用现有的 `core` + `compose` 业务逻辑（无需重写）
3. ✅ 复用 `core-render-web` 的 Web 渲染能力（无需重写）
4. ✅ 支持完整的 Kuikly DSL 和组件库
5. ✅ 性能接近原生（得益于 JVM 和 Chromium）
6. ✅ 开发体验与其他平台一致

## 参考代码路径
- Android 桥接实现: `core-render-android/src/main/java/com/tencent/kuikly/core/render/android/context/KuiklyRenderJvmContextHandler.kt`
- Web 渲染初始化: `core-render-web/base/src/jsMain/kotlin/com/tencent/kuikly/core/render/web/context/KuiklyRenderContextHandler.kt`
- NativeBridge 定义: `core/src/commonMain/kotlin/com/tencent/kuikly/core/nvi/NativeBridge.kt`
- BridgeManager: `core/src/commonMain/kotlin/com/tencent/kuikly/core/manager/BridgeManager.kt`
