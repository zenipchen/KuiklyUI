# Mac Render SDK 接入文档

## 简介

`mac-render-sdk` 是 KuiklyUI 框架提供的 Mac 渲染 SDK，用于在 JVM 端与 Mac 原生渲染应用（PreviewMacApp）之间建立通信桥梁。通过该 SDK，你可以在 JVM 端运行业务逻辑层（core + compose），而在 Mac 端运行渲染层（core-render-ios），实现跨进程的原生渲染预览。

### 核心特性

- ✅ **跨进程通信**：JVM 端业务逻辑与 Mac 端渲染分离
- ✅ **原生渲染**：使用 Mac 原生渲染引擎，提供最佳渲染质量
- ✅ **TCP 长连接**：支持高效的 TCP 长连接通信
- ✅ **自动端口发现**：自动发现 PreviewMacApp 的 TCP 端口
- ✅ **预览配置**：支持丰富的预览配置参数（尺寸、密度、方向等）
- ✅ **触摸事件**：支持触摸事件传递和交互
- ✅ **截图功能**：支持获取渲染视图截图
- ✅ **刷新功能**：支持从 Mac 端通过 TCP NOTIFICATION 触发刷新

### 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                    JVM 端 (你的应用)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               业务逻辑层                               │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │ Logic Layer │    │    mac-render-sdk             │  │  │
│  │  │(core+compose)│◄──►│ (TCP 长连接通信层)            │  │  │
│  │  └─────────────┘    └──────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ TCP 长连接（双向通信）
                       │ - REQUEST: JVM → Mac (callNative, initRender)
                       │ - RESPONSE: Mac → JVM (响应)
                       │ - NOTIFICATION: Mac → JVM (callKotlinMethod, refresh)
                       │ 端口：自动发现（默认 9528）
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  PreviewMacApp (macOS)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               渲染层                                    │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │Render Layer │    │    TCP Server                │  │  │
│  │  │(core-render-│◄──►│    (自动端口分配)             │  │  │
│  │  │   ios)      │    └──────────────────────────────┘  │  │
│  │  └─────────────┘                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**通信方式**：
- ✅ **TCP 长连接**：所有通信都通过 TCP 长连接实现
- ✅ **双向通信**：支持 JVM → Mac 和 Mac → JVM 的双向通信
- ✅ **自动端口发现**：SDK 自动发现 PreviewMacApp 的实际 TCP 端口
- ✅ **统一协议**：包括 refresh 在内的所有功能都通过 TCP NOTIFICATION 实现

## 环境要求

- **JDK**: 11 或更高版本
- **Kotlin**: 1.3.10 或更高版本
- **macOS**: 10.14 或更高版本（用于运行 PreviewMacApp）
- **PreviewMacApp**: 需要先启动 PreviewMacApp 应用

## 依赖配置

### Gradle 配置

在你的 `build.gradle.kts` 中添加依赖：

```kotlin
dependencies {
    // mac-render-sdk
    implementation(project(":mac-render-sdk"))
    
    // 或者如果已发布到 Maven 仓库
    // implementation("com.tencent.kuikly:mac-render-sdk:1.0.0")
    
    // 必需依赖
    implementation(project(":core"))
    implementation(project(":compose"))
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
}
```

### 模块依赖

确保你的项目包含以下模块：

- `core` - Kuikly 核心逻辑
- `compose` - Kuikly 组件库
- `mac-render-sdk` - Mac 渲染 SDK

## 快速开始

### 1. 启动 PreviewMacApp

首先需要启动 Mac 渲染端应用：

```bash
# 方式 1: 使用脚本启动
./run_preview_mac.sh

# 方式 2: 在 Xcode 中打开并运行 PreviewMacApp
open PreviewMacApp/PreviewMacApp.xcodeproj
```

### 2. 基本使用

最简单的使用方式（服务器配置由 SDK 内部自动管理）：

```kotlin
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner
import com.tencent.kuikly.mac.sdk.PreviewConfig

fun main() {
    // 创建预览运行器（服务器地址和端口由 SDK 内部自动管理）
    val runner = KuiklyMacPreviewRunner(
        pageName = "HelloWorldPage",
        classLoader = Thread.currentThread().contextClassLoader,
        width = 400,
        height = 800
    )
    
    // 设置回调
    runner.onConnected = {
        println("✅ 已连接到 Mac 渲染端")
    }
    
    runner.onError = { error ->
        println("❌ 连接错误: ${error.message}")
    }
    
    runner.onCallKotlinMethodError = { throwable ->
        println("❌ callKotlinMethod 执行异常: ${throwable.message}")
        throwable.printStackTrace()
        // 可以在这里进行异常上报、日志记录等操作
    }
    
    runner.onFirstFramePaint = {
        println("🎨 首帧渲染完成")
    }
    
    // 启动预览（异步执行，通过回调通知结果）
    runner.start()
    
    // 保持程序运行
    Thread.sleep(Long.MAX_VALUE)
}
```

### 3. 使用预览配置

```kotlin
import com.tencent.kuikly.mac.sdk.PreviewConfig

val config = PreviewConfig.PIXEL_5.copy(
    name = "我的预览配置",
    locale = "zh-CN",
    fontScale = 1.2f,
    showSystemUi = false
)

val runner = KuiklyMacPreviewRunner(
    pageName = "HelloWorldPage",
    classLoader = Thread.currentThread().contextClassLoader,
    width = config.width,
    height = config.height,
    config = config
)

// 启动预览（异步执行）
runner.start()
```

### 4. 快速启动（扩展函数）

使用便捷的扩展函数：

```kotlin
import com.tencent.kuikly.mac.sdk.startMacPreview

val runner = startMacPreview(
    pageName = "HelloWorldPage",
    classLoader = Thread.currentThread().contextClassLoader,
    onConnected = {
        println("✅ 已连接")
    },
    onError = { error ->
        println("❌ 错误: ${error.message}")
    },
    onCallKotlinMethodError = { throwable ->
        println("❌ callKotlinMethod 异常: ${throwable.message}")
    }
)
```

## API 文档

### KuiklyMacPreviewRunner

预览运行器，封装了 SDK 的初始化、连接检查和启动逻辑。

#### 构造函数

```kotlin
class KuiklyMacPreviewRunner(
    pageName: String,                    // 页面名称（必需）
    pageData: Map<String, Any> = emptyMap(),  // 页面数据
    serverHost: String? = null,          // 服务器地址（null 表示使用全局配置，自动发现）
    serverPort: Int? = null,             // TCP 端口（null 表示使用全局配置，自动发现）
    classLoader: ClassLoader? = null,     // 类加载器
    width: Int = 400,                    // 预览宽度（像素）
    height: Int = 800,                   // 预览高度（像素）
    config: PreviewConfig? = null        // 预览配置
)
```

**注意**：
- `serverHost` 和 `serverPort` 为 `null` 时，SDK 会自动使用全局配置
- 全局配置会自动发现 PreviewMacApp 的实际 TCP 端口
- 建议不传这两个参数，让 SDK 自动管理

#### 主要方法

##### start()

启动预览（异步执行）。

**注意**: 该方法现在是异步的，不会阻塞调用线程。结果通过回调通知：
- 成功：`onConnected` 回调会被调用
- 失败：`onError` 回调会被调用

**示例**:
```kotlin
runner.onConnected = {
    println("启动成功，已连接到 Mac 渲染端")
}

runner.onError = { error ->
    println("启动失败: ${error.message}")
    // 请检查 PreviewMacApp 是否已启动
}

// 异步启动，不会阻塞
runner.start()
```

##### stop()

停止预览并释放资源。

**示例**:
```kotlin
runner.stop()
```

##### reload()

重新加载页面，使用构造函数中指定的 `pageData`、`width`、`height` 和 `config` 参数重新初始化渲染。

**功能说明**:
- 重新发送渲染请求到 Mac 端
- 使用创建 `KuiklyMacPreviewRunner` 时指定的页面数据、尺寸和配置
- 适用于页面数据更新后需要重新渲染的场景

**注意**:
- 该方法会使用构造函数中的 `pageData`、`width`、`height` 和 `config` 参数
- 如果需要更新这些参数，应该创建新的 `KuiklyMacPreviewRunner` 实例
- 确保在连接成功后调用（建议在 `onConnected` 回调中调用）

**示例**:
```kotlin
// 基本用法：重新加载当前页面
runner.reload()

// 在连接成功后重新加载
runner.onConnected = {
    println("已连接，重新加载页面")
    runner.reload()
}

// 在首帧渲染完成后重新加载（用于测试）
runner.onFirstFramePaint = {
    println("首帧渲染完成，重新加载页面")
    runner.reload()
}
```

##### captureScreenshot(): ByteArray?

获取渲染视图截图。

**返回值**: PNG 格式的字节数组，失败返回 `null`

**示例**:
```kotlin
val screenshot = runner.captureScreenshot()
if (screenshot != null) {
    // 保存截图
    File("screenshot.png").writeBytes(screenshot)
}
```

##### sendTouchEvent(type: String, x: Float, y: Float, timestamp: Long)

发送触摸事件到 Mac 端。

**参数**:
- `type`: 事件类型，可选值：`"down"`, `"move"`, `"up"`, `"cancel"`
- `x`: X 坐标（像素）
- `y`: Y 坐标（像素）
- `timestamp`: 时间戳（毫秒）

**示例**:
```kotlin
// 按下事件
runner.sendTouchEvent("down", 100f, 200f, System.currentTimeMillis())

// 移动事件
runner.sendTouchEvent("move", 150f, 250f, System.currentTimeMillis())

// 抬起事件
runner.sendTouchEvent("up", 150f, 250f, System.currentTimeMillis())
```

##### sendEvent(event: String, data: Map<String, Any> = emptyMap()): Boolean

发送页面事件到 Kuikly 容器。

该方法用于从外部向 Kuikly 页面发送事件，类似于 Android 的 `KuiklyRenderViewDelegator.sendEvent` 和 iOS 的 `KuiklyRenderViewControllerDelegator.sendWithEvent`。

事件会被发送到 Mac 渲染端，然后转发给 Kuikly 渲染核心，最终触发 Pager 的 `onReceivePagerEvent` 方法。

**参数**:
- `event`: 事件名称
- `data`: 事件数据，默认为空 Map

**返回值**: `true` 表示成功，`false` 表示失败

**示例**:
```kotlin
// 发送简单事件
val success = runner.sendEvent("buttonClick")

// 发送带数据的事件
val success = runner.sendEvent(
    event = "userAction",
    data = mapOf(
        "action" to "login",
        "userId" to "12345",
        "timestamp" to System.currentTimeMillis()
    )
)

if (success) {
    println("事件发送成功")
} else {
    println("事件发送失败")
}
```

##### updatePreviewConfig(config: PreviewConfig): Boolean

更新预览配置。

**参数**:
- `config`: 预览配置（只需要包含要更新的字段）

**返回值**: `true` 表示成功，`false` 表示失败

**示例**:
```kotlin
// 更新尺寸
val success = runner.updatePreviewConfig(
    PreviewConfig(width = 500, height = 1000)
)

// 更新多个参数
val success = runner.updatePreviewConfig(
    PreviewConfig(
        width = 600,
        height = 1200,
        density = 3.0f,
        orientation = "landscape",
        locale = "zh-CN"
    )
)
```

#### 回调属性

##### onConnected: (() -> Unit)?

连接成功回调。

**示例**:
```kotlin
runner.onConnected = {
    println("已连接到 Mac 渲染端")
}
```

##### onError: ((Exception) -> Unit)?

错误回调。

**示例**:
```kotlin
runner.onError = { error ->
    println("错误: ${error.message}")
    error.printStackTrace()
}
```

##### onFirstFramePaint: (() -> Unit)?

首帧渲染完成回调。

**示例**:
```kotlin
runner.onFirstFramePaint = {
    println("首帧渲染完成")
}
```

##### onDisconnected: (() -> Unit)?

断开连接回调。

**示例**:
```kotlin
runner.onDisconnected = {
    println("已断开连接")
}
```

##### onCallKotlinMethodError: ((Throwable) -> Unit)?

`callKotlinMethod` 执行异常回调。

当从 Mac 端调用 Kotlin 方法（`callKotlinMethod`）时，如果方法执行过程中抛出异常，会触发此回调。

**注意**：
- 此回调用于捕获业务代码执行时的异常，不会影响 SDK 的正常运行
- 建议在此回调中进行异常上报、日志记录等操作
- 异常类型为 `Throwable`，可以捕获所有类型的异常（包括 `Exception` 和 `Error`）

**示例**:
```kotlin
runner.onCallKotlinMethodError = { throwable ->
    println("callKotlinMethod 执行异常: ${throwable.message}")
    throwable.printStackTrace()
    
    // 可以进行异常上报
    // reportException(throwable)
    
    // 或者记录日志
    // logger.error("callKotlinMethod 异常", throwable)
}
```

#### 状态属性

##### isConnected: Boolean

是否已连接（只读）。

**示例**:
```kotlin
if (runner.isConnected) {
    println("已连接")
}
```

#### 工具方法

##### getSdk(): KuiklyMacRenderSdk?

获取底层 SDK 实例。

##### getInstanceId(): String?

获取实例 ID。

### PreviewConfig

预览配置参数，用于配置预览的各种参数。

#### 属性

```kotlin
data class PreviewConfig(
    // General Configuration
    val name: String? = null,              // 配置名称
    val group: String? = null,             // 配置组
    
    // Hardware Configuration
    val device: String? = null,            // 设备名称，如 "Pixel 5"
    val width: Int = 400,                  // 宽度（像素）
    val height: Int = 800,                 // 高度（像素）
    val density: Float = 2.0f,             // 屏幕密度（dpi），如 440dpi = 2.75f
    val orientation: String = "portrait",  // 方向: "portrait" 或 "landscape"
    val isRound: Boolean = false,          // 是否为圆角屏幕
    val chinSize: Int = 0,                 // 下巴尺寸（像素）
    val cutout: String = "none",           // 刘海类型: "none", "notch", "punch", etc.
    val navigation: String = "gesture",    // 导航方式: "gesture", "button", etc.
    
    // Display Configuration
    val apiLevel: Int? = null,             // API 级别，如 35
    val locale: String? = null,            // 语言环境，如 "en-US"
    val fontScale: Float = 1.0f,           // 字体缩放比例
    val showSystemUi: Boolean = false,     // 是否显示系统 UI
    val showBackground: Boolean = false,  // 是否显示背景
    val backgroundColor: String? = null,   // 背景颜色（十六进制，如 "#FFFFFF"）
    val uiMode: String? = null,            // UI 模式: "Undefined", "Normal", "Night", etc.
    val wallpaper: String? = null          // 壁纸: "None", "Default", etc.
)
```

#### 预设配置

SDK 提供了多个预设配置：

```kotlin
// 默认配置
PreviewConfig.DEFAULT

// Pixel 5 配置
PreviewConfig.PIXEL_5

// Pixel 6 配置
PreviewConfig.PIXEL_6

// Pixel 7 配置
PreviewConfig.PIXEL_7

// Pixel 8 配置
PreviewConfig.PIXEL_8

// Galaxy S21 配置
PreviewConfig.GALAXY_S21
```

#### 使用示例

```kotlin
// 使用预设配置
val config = PreviewConfig.PIXEL_5

// 基于预设配置修改
val customConfig = PreviewConfig.PIXEL_5.copy(
    name = "我的配置",
    locale = "zh-CN",
    fontScale = 1.2f
)

// 创建自定义配置
val myConfig = PreviewConfig(
    width = 1080,
    height = 2340,
    density = 2.75f,
    orientation = "portrait",
    locale = "zh-CN",
    apiLevel = 35
)
```

### Refresh 功能

refresh 功能已通过 **TCP NOTIFICATION** 实现，无需额外的 HTTP 服务器。

#### 工作原理

1. **Mac 端**：用户点击刷新按钮时，PreviewMacApp 通过 TCP 长连接发送 `refresh` 类型的 NOTIFICATION 消息
2. **JVM 端**：SDK 自动接收并处理 refresh 通知，调用 `refresh()` 方法重新渲染页面

#### 使用方式

**无需任何额外配置**，refresh 功能已自动集成：

```kotlin
val runner = KuiklyMacPreviewRunner(
    pageName = "HelloWorldPage",
    classLoader = Thread.currentThread().contextClassLoader
)

// refresh 功能已自动启用，无需手动配置
runner.start()

// 当用户在 PreviewMacApp 中点击刷新按钮时，
// SDK 会自动接收 refresh 通知并重新渲染页面
```

#### 优势

- ✅ **统一通信**：所有通信都通过 TCP 长连接，无需额外的 HTTP 服务器
- ✅ **自动管理**：无需手动注册/注销，SDK 自动处理
- ✅ **更高效**：减少一次 HTTP 请求开销
- ✅ **更安全**：复用已有的 TCP 连接，无需额外端口

#### 已废弃的 RefreshServer

> ⚠️ **注意**：`RefreshServer` 类已废弃，不再需要手动创建和管理。refresh 功能现在完全通过 TCP NOTIFICATION 实现。

### PreviewMacAppDiscovery

端口发现器，用于自动发现 PreviewMacApp 的 TCP 端口。

#### 主要方法

##### discoverTcpPort(): Int?

发现 TCP 端口。

**返回值**: TCP 端口，如果失败返回 `null`

**示例**:
```kotlin
val discovery = PreviewMacAppDiscovery()
val tcpPort = discovery.discoverTcpPort()
if (tcpPort != null) {
    println("发现 TCP 端口: $tcpPort")
} else {
    println("未找到 TCP 端口，使用默认端口")
}
```

## 高级用法

### 1. 自动端口发现（推荐）

SDK 会自动发现 PreviewMacApp 的实际 TCP 端口，无需手动配置：

```kotlin
// 不传 serverHost 和 serverPort，SDK 会自动发现
val runner = KuiklyMacPreviewRunner(
    pageName = "HelloWorldPage",
    classLoader = Thread.currentThread().contextClassLoader
)

runner.start()  // SDK 会自动发现端口并连接
```

### 2. 手动端口发现

如果需要手动发现端口：

```kotlin
import com.tencent.kuikly.mac.sdk.PreviewMacAppDiscovery

val discovery = PreviewMacAppDiscovery()
val tcpPort = discovery.discoverTcpPort()

if (tcpPort != null) {
    val runner = KuiklyMacPreviewRunner(
        pageName = "HelloWorldPage",
        serverPort = tcpPort,  // 手动指定端口
        classLoader = Thread.currentThread().contextClassLoader
    )
    runner.start()
}
```

### 3. 查询当前服务器配置

如果需要查询当前使用的服务器配置：

```kotlin
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner

val host = KuiklyMacPreviewRunner.getServerHost()  // 获取服务器地址
val port = KuiklyMacPreviewRunner.getServerPort()  // 获取服务器端口（自动发现）
println("服务器: $host:$port")
```

### 3. 多实例预览

可以同时创建多个预览实例：

```kotlin
val runner1 = KuiklyMacPreviewRunner(
    pageName = "Page1",
    classLoader = Thread.currentThread().contextClassLoader
)

val runner2 = KuiklyMacPreviewRunner(
    pageName = "Page2",
    classLoader = Thread.currentThread().contextClassLoader
)

runner1.start()
runner2.start()
```

### 4. 动态更新配置

在运行时动态更新预览配置：

```kotlin
runner.onConnected = {
    // 等待一段时间后更新配置
    Thread {
        Thread.sleep(2000)
        
        // 更新尺寸
        runner.updatePreviewConfig(
            PreviewConfig(width = 500, height = 1000)
        )
        
        Thread.sleep(2000)
        
        // 更新方向
        runner.updatePreviewConfig(
            PreviewConfig(orientation = "landscape")
        )
    }.start()
}
```

### 5. 截图轮询

定期获取截图：

```kotlin
Thread {
    while (runner.isConnected) {
        val screenshot = runner.captureScreenshot()
        if (screenshot != null) {
            // 处理截图
            println("截图大小: ${screenshot.size} 字节")
        }
        Thread.sleep(1000) // 每秒截图一次
    }
}.start()
```

### 6. 触摸事件处理

处理鼠标/触摸事件并发送到 Mac 端：

```kotlin
// 模拟触摸事件
fun simulateTouch(x: Float, y: Float) {
    val timestamp = System.currentTimeMillis()
    
    // 按下
    runner.sendTouchEvent("down", x, y, timestamp)
    
    Thread.sleep(100)
    
    // 移动
    runner.sendTouchEvent("move", x + 10, y + 10, timestamp + 100)
    
    Thread.sleep(100)
    
    // 抬起
    runner.sendTouchEvent("up", x + 10, y + 10, timestamp + 200)
}
```

### 7. 发送页面事件

向 Kuikly 页面发送自定义事件：

```kotlin
// 发送简单事件
runner.sendEvent("buttonClick")

// 发送带数据的事件
runner.sendEvent(
    event = "userAction",
    data = mapOf(
        "action" to "login",
        "userId" to "12345",
        "timestamp" to System.currentTimeMillis()
    )
)

// 在页面中接收事件（需要在 Pager 中实现）
// class MyPage : Pager() {
//     override fun onReceivePagerEvent(event: String, data: Map<String, Any>?) {
//         when (event) {
//             "buttonClick" -> {
//                 println("按钮被点击")
//             }
//             "userAction" -> {
//                 val action = data?.get("action") as? String
//                 println("用户操作: $action")
//             }
//         }
//     }
// }
```

## 常见问题

### Q1: 连接失败，提示"无法连接到 Mac 渲染端"

**原因**: PreviewMacApp 未启动或端口不正确。

**解决方案**:
1. 确保 PreviewMacApp 已启动
2. 检查端口是否正确（默认 9528）
3. 使用端口发现功能自动发现端口

```kotlin
val discovery = PreviewMacAppDiscovery()
val tcpPort = discovery.discoverTcpPort()
println("发现的端口: $tcpPort")
```

### Q2: 预览窗口不显示

**原因**: 可能的原因包括：
- PreviewMacApp 未启动
- 页面名称不正确
- 连接失败

**解决方案**:
1. 检查 PreviewMacApp 是否已启动
2. 确认页面名称是否正确（需要与 `@Page` 注解中的名称一致）
3. 检查 `onError` 回调中的错误信息

### Q3: 截图返回 null

**原因**: 可能的原因包括：
- 渲染视图尚未准备好
- 连接已断开

**解决方案**:
1. 等待 `onFirstFramePaint` 回调后再截图
2. 检查 `isConnected` 状态

```kotlin
runner.onFirstFramePaint = {
    // 首帧渲染完成后再截图
    val screenshot = runner.captureScreenshot()
    if (screenshot != null) {
        println("截图成功")
    }
}
```

### Q4: 如何调试连接问题？

**解决方案**:
1. 启用详细日志输出
2. 检查 PreviewMacApp 的控制台日志
3. 使用 `ping()` 方法测试连接

```kotlin
val sdk = runner.getSdk()
if (sdk != null) {
    val isConnected = sdk.ping()
    println("连接状态: $isConnected")
}
```

### Q5: 如何自定义预览配置？

**解决方案**: 使用 `PreviewConfig` 创建自定义配置：

```kotlin
val customConfig = PreviewConfig(
    width = 1080,
    height = 2340,
    density = 2.75f,
    orientation = "portrait",
    locale = "zh-CN",
    fontScale = 1.2f,
    showSystemUi = false,
    backgroundColor = "#FFFFFF"
)

val runner = KuiklyMacPreviewRunner(
    pageName = "HelloWorldPage",
    config = customConfig,
    classLoader = Thread.currentThread().contextClassLoader
)
```

### Q6: refresh 功能如何工作？

**答案**: refresh 功能已通过 TCP NOTIFICATION 实现，无需额外配置。

**工作原理**:
1. PreviewMacApp 通过 TCP 长连接发送 `refresh` 类型的 NOTIFICATION 消息
2. SDK 自动接收并处理，调用 `refresh()` 方法重新渲染页面

**无需任何额外配置**，refresh 功能已自动集成到 TCP 连接中。

### Q7: 如何处理 callKotlinMethod 执行时的异常？

**答案**: SDK 提供了 `onCallKotlinMethodError` 回调来捕获 `callKotlinMethod` 执行时的异常。

**使用方式**:
```kotlin
runner.onCallKotlinMethodError = { throwable ->
    println("callKotlinMethod 执行异常: ${throwable.message}")
    throwable.printStackTrace()
    
    // 可以进行异常上报
    // reportException(throwable)
    
    // 或者记录日志
    // logger.error("callKotlinMethod 异常", throwable)
}
```

**注意事项**:
- 此回调用于捕获业务代码执行时的异常，不会影响 SDK 的正常运行
- 异常类型为 `Throwable`，可以捕获所有类型的异常（包括 `Exception` 和 `Error`）
- 建议在此回调中进行异常上报、日志记录等操作，便于问题排查
- 即使不设置此回调，SDK 也会在控制台打印异常日志，但不会中断执行流程

### 1. 资源管理

确保在应用退出时正确释放资源：

```kotlin
fun cleanup() {
    runner.stop()  // 停止预览并释放资源
    // refresh 功能已集成到 TCP 连接中，无需额外清理
}
```

### 2. 错误处理

始终设置错误回调：

```kotlin
runner.onError = { error ->
    println("错误: ${error.message}")
    error.printStackTrace()
    // 处理错误，如重试或通知用户
}

// 设置 callKotlinMethod 异常回调
runner.onCallKotlinMethodError = { throwable ->
    println("callKotlinMethod 执行异常: ${throwable.message}")
    throwable.printStackTrace()
    // 可以进行异常上报、日志记录等操作
}
```

### 3. 连接状态检查

在操作前检查连接状态：

```kotlin
if (runner.isConnected) {
    val screenshot = runner.captureScreenshot()
    // 处理截图
} else {
    println("未连接，无法截图")
}
```

### 4. 线程安全

注意 SDK 的线程安全：

- `start()`、`stop()`、`reload()` 等方法可以在任何线程调用
- `start()` 方法是异步的，不会阻塞调用线程
- 回调函数可能在后台线程执行，如果涉及 UI 操作，需要切换到 UI 线程

```kotlin
runner.onFirstFramePaint = {
    // 如果涉及 UI 操作，需要切换到 UI 线程
    SwingUtilities.invokeLater {
        // UI 操作
    }
}

// start() 是异步的，不会阻塞
runner.start()  // 立即返回，结果通过回调通知
```

## 示例项目

参考 `desktopAppWithMacRender` 模块中的示例代码：

- `Main.kt` - 主程序入口
- `PreviewWindow.kt` - 预览窗口 UI
- `PreviewConfigEditor.kt` - 配置编辑器

## 相关文档

- [通信层架构文档](./TRANSPORT_LAYER.md)
- [KuiklyUI 主文档](../README.md)

## 技术支持

如有问题，请提交 Issue 或联系技术支持团队。

