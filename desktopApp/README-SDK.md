# KuiklyDesktopRenderSdk 使用说明

## 概述

`KuiklyDesktopRenderSdk` 是一个完全自包含的桌面渲染 SDK，支持将 Kuikly 页面渲染到桌面应用中。SDK 内部包含所有必要的 HTML 和 JavaScript 资源，无需外部文件依赖。

## 主要特性

- **完全自包含**：所有 HTML 和 JavaScript 资源都内嵌在 SDK 中
- **抽象接口设计**：不直接依赖 CEF 具体类型，支持适配器模式
- **运行时资源管理**：动态生成 HTML 文件到临时目录
- **线程安全**：内部使用线程池处理异步任务
- **易于扩展**：支持适配器模式，可轻松扩展到其他浏览器引擎

## 构建 JAR 包

### 构建轻量级 JAR 包（推荐）

```bash
./gradlew :desktopApp:desktopRenderSdkLightJar
```

生成文件：`desktopApp/build/libs/desktop-render-sdk-1.0.0-light.jar`

### 构建完整 JAR 包（包含所有依赖）

```bash
./gradlew :desktopApp:desktopRenderSdkJar
```

## 使用方法

### 1. 基本使用

```kotlin
// 创建 SDK 实例
val sdk = KuiklyDesktopRenderSdk("MyPage")

// 设置浏览器适配器
val browserAdapter = CefBrowserAdapter(cefBrowser)
sdk.setBrowser(browserAdapter)

// 初始化渲染层
sdk.initRenderLayer()

// 处理 CEF 查询
val callbackAdapter = CefQueryCallbackAdapter(cefQueryCallback)
sdk.handleCefQuery(browserAdapter, frame, requestId, request, persistent, callbackAdapter)
```

### 2. 依赖管理

如果使用轻量级 JAR 包，需要添加以下依赖：

```kotlin
dependencies {
    // 核心依赖
    implementation("com.tencent.kuikly:core:1.0.0")
    implementation("com.tencent.kuikly:compose:1.0.0")
    
    // JCEF 依赖
    implementation("me.friwi:jcefmaven:122.1.10")
    
    // JSON 解析
    implementation("com.google.code.gson:gson:2.10.1")
    
    // 协程支持
    implementation("com.tencent.kuiklyx-open:coroutines:1.5.0-2.0.21")
}
```

## API 参考

### KuiklyDesktopRenderSdk

主要的 SDK 类，包含所有核心功能。

#### 构造函数
```kotlin
KuiklyDesktopRenderSdk(pageName: String = "Unknown")
```

#### 主要方法

- `setBrowser(browser: Browser)` - 设置浏览器实例
- `initRenderLayer()` - 初始化渲染层
- `handleCefQuery(...)` - 处理 CEF 查询
- `generateHtmlFile(): String` - 生成 HTML 文件
- `getInstanceId(): String` - 获取实例 ID
- `destroy()` - 清理资源

### 内部接口

#### Browser 接口
```kotlin
interface Browser {
    fun executeJavaScript(script: String, scriptUrl: String, startLine: Int)
}
```

#### QueryCallback 接口
```kotlin
interface QueryCallback {
    fun success(response: String)
    fun failure(errorCode: Int, errorMessage: String)
}
```

### 适配器类

#### CefBrowserAdapter
```kotlin
class CefBrowserAdapter(private val cefBrowser: CefBrowser) : KuiklyDesktopRenderSdk.Browser
```

#### CefQueryCallbackAdapter
```kotlin
class CefQueryCallbackAdapter(private val cefQueryCallback: CefQueryCallback) : KuiklyDesktopRenderSdk.QueryCallback
```

## 架构设计

### 1. 接口抽象
- 使用内部接口 `Browser` 和 `QueryCallback` 抽象浏览器操作
- 通过适配器模式支持不同的浏览器引擎
- 避免直接依赖 CEF 具体类型

### 2. 资源管理
- HTML 和 JavaScript 资源内嵌在 SDK 中
- 运行时动态生成到系统临时目录
- 自动管理 `instanceId` 和资源清理

### 3. 线程安全
- 使用独立线程池处理异步任务
- 避免阻塞 CEF UI 线程
- 支持并发访问

## 注意事项

1. **JVM 参数**：使用 CEF 时需要添加特定的 JVM 参数
2. **资源清理**：使用完毕后调用 `destroy()` 方法清理资源
3. **内存管理**：建议设置合适的 JVM 内存参数
4. **依赖版本**：确保使用兼容的依赖版本

## 示例项目

参考 `desktopApp` 模块中的 `Main.kt` 文件，了解完整的使用示例。

## 版本信息

- **版本**：1.0.0
- **作者**：Kuikly Team
- **许可证**：请参考项目许可证文件
