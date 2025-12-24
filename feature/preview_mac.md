目前查看preview.md文件，是当前方案。

现在想把预览用WebView渲染的方案换成，Mac应用进程渲染的方案，我能想到的方案步骤。

1、新建一个MacDesktopSdk模块，提供Java接驳层，底层用Http实现于远程Mac应用进程的的通信。
2、基于远程通信实现callKotlinMethod和callNative的远程交互，并完成远程渲染和驱动

其中macApp为Mac应用进程，我要你基于它复刻一个PreviewMacApp，并且该App内置一个Http服务，该Http服与MacDesktopSdk进行通信。
该服务通过离屏渲染的方式，接受指令 使用 @core-render-ios驱动进行UI的渲染



🎯 KuiklyUI Mac 预览功能开发 Prompt
项目背景
我正在开发 KuiklyUI 的 Mac 原生预览功能，实现跨进程渲染架构：
JVM 进程：运行 Kotlin 业务逻辑层 (core + compose)
Mac 进程：运行原生渲染层 (core-render-ios)，提供真实的 iOS/Mac 渲染效果
通信方式：HTTP 协议
架构设计
┌─────────────────────────────┐       HTTP        ┌─────────────────────────────┐│  desktopApp (JVM)           │◄─────────────────►│       PreviewMacApp         ││                             │                   │       (Mac Native)          ││  • Kotlin 逻辑层 (core)      │   /render         │  • core-render-ios 渲染层   ││  • KuiklyMacRenderSdk       │   /callNative     │  • PreviewHttpServer        ││  • PreviewWindow (Swing)    │   /callKotlinMethod│  • PreviewRenderViewController││    ↳ 显示截图               │   /screenshot     │    ↳ 实际 UI 渲染           │└─────────────────────────────┘                   └─────────────────────────────┘
已完成模块
Mac 端 (PreviewMacApp)
PreviewMacApp.swift - SwiftUI 应用入口
PreviewHttpServer.swift - HTTP 服务器（端口 9527/9528）
PreviewRenderCoreManager.swift - 渲染核心管理
PreviewRenderViewController.m/h - 渲染视图控制器
/screenshot 端点 - 截图功能
JVM 端 (desktopApp)
KuiklyMacRenderSdk.kt - Mac 渲染 SDK
callNative/callKotlinMethod 的 HTTP 远程调用
轮询机制获取渲染层回调
PreviewWindow.kt - Swing 预览窗口（显示 Mac 端截图）
当前状态
基础架构已完成
HTTP 通信已打通
截图功能已实现
用户上次反馈：Kuikly Preview 窗口没有显示视图，需要进一步调试
关键文件路径
Mac App: PreviewMacApp/ 目录
JVM SDK: desktopApp/src/jvmMain/kotlin/com/tencent/kuikly/
版本配置: buildSrc/src/main/java/KuiklyKotlinBuildVar.kt
DEFAULT_KUIKLY_VERSION = "2.0.0"
DEFAULT_KOTLIN_VERSION = "2.0.21"
已解决问题 ✅
1. 预览窗口显示 - 已修复截图尺寸和 Retina 2x 缩放问题
2. 多实例渲染 - 支持同时预览多个页面（双屏预览模式）
3. 事件系统 - 完整实现触摸事件从 JVM 端传递到 Mac 端

## 事件系统架构

```
JVM (desktopAppWithMacRender)          Mac (PreviewMacApp)
        │                                      │
   ImagePanel                                  │
   (捕获鼠标事件)                               │
        │                                      │
        ▼                                      │
   PreviewWindow                               │
   (调用 runner.sendTouchEvent)                │
        │                                      │
        ▼                                      │
   KuiklyMacRenderSdk                          │
   (HTTP POST /touch)  ─────────────────────►  PreviewHttpServer
        │                                      (接收并解析请求)
        │                                      │
        │                                      ▼
        │                              PreviewRenderCoreManager
        │                              (分发到对应的 ViewController)
        │                                      │
        │                                      ▼
        │                              PreviewRenderViewController
        │                              (调用 KRView 的 css_touchDown/Up 回调)
        │                                      │
        │                                      ▼
        │                              Compose 层
        │                              (处理点击事件，触发导航等)
```

### HTTP 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/ping` | GET | 检查服务是否可用 |
| `/render` | POST | 初始化页面渲染 |
| `/screenshot` | GET | 获取渲染视图截图 |
| `/touch` | POST | 发送触摸事件 |
| `/callNative` | POST | 调用原生方法 |
| `/callKotlinMethod` | GET | 获取 Kotlin 方法调用 |
| `/destroy` | POST | 销毁渲染实例 |

### 触摸事件格式

```json
{
  "instanceId": "0",
  "type": "down|move|up|cancel",
  "x": 200.0,
  "y": 300.0,
  "timestamp": 1234567890
}
```

### 路由处理

已注册 `PreviewRouterHandler` 处理页面导航：
- `openPageWithName:pageData:controller:` - 打开页面（记录日志）
- `closePage:` - 关闭页面

相关代码修改
KuiklyRenderView.kt: 添加了 instanceId 参数支持
KuiklyRenderCore: 支持 instanceId 构造函数
ComposeContainer.kt: 修复了 forceRefresh() 使用 kotlin.random.Random
PreviewWindow.kt: 添加鼠标事件监听和 Retina 图像缩放
KuiklyMacRenderSdk.kt: 添加 sendTouchEvent 方法
PreviewHttpServer.swift: 添加 /touch 端点
PreviewRenderViewController.m: 实现触摸事件注入到 KRView