# Kuikly PreviewMacApp

基于 Mac 原生渲染的 Kuikly 预览应用。该应用内置 HTTP 服务，用于接收来自 IDE 的渲染指令，实现实时预览功能。

## 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                    IDE / JVM 端                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               mac-render-sdk                           │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │  Logic Layer│    │    HTTP Client              │  │  │
│  │  │(core+compose)│◄──►│ (callKotlinMethod/callNative)│  │  │
│  │  └─────────────┘    └──────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP (端口 9527)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  PreviewMacApp                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               HTTP Server                              │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │Render Layer │    │    API Endpoints             │  │  │
│  │  │(core-render-│◄──►│ /render, /callNative, etc.   │  │  │
│  │  │   ios)      │    └──────────────────────────────┘  │  │
│  │  └─────────────┘                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 通信协议

### 1. 健康检查
```
GET /ping
Response: {"status": "ok", "message": "pong"}
```

### 2. 初始化渲染
```
POST /render
Body: {
    "pageName": "页面名称",
    "pageData": {},
    "instanceId": "实例ID"
}
Response: {"status": "ok"}
```

### 3. callNative (SDK -> 渲染端)
```
POST /callNative
Body: {
    "type": "callNative",
    "requestId": "请求ID",
    "methodId": 123,
    "args": [arg0, arg1, ...],
    "instanceId": "实例ID"
}
Response: {"status": "ok"}
```

### 4. 轮询 callNative 结果
```
GET /pollCallNativeResult?requestId=xxx
Response: {
    "status": "ok",
    "requestId": "xxx",
    "result": "结果"
}
```

### 5. 轮询 callKotlinMethod 请求
```
GET /pollCallKotlinMethod?instanceId=xxx
Response: {
    "status": "ok",
    "requests": [
        {"requestId": "xxx", "methodId": 123, "args": [...]}
    ]
}
```

### 6. 销毁渲染
```
POST /destroy
Body: {"instanceId": "实例ID"}
Response: {"status": "ok", "message": "Destroyed"}
```

## 使用方法

### 1. 启动 PreviewMacApp

1. 打开 Xcode 项目 `PreviewMacApp.xcworkspace`
2. 构建并运行应用
3. 应用启动后会自动在端口 9527 启动 HTTP 服务

### 2. 在 IDE 中使用 mac-render-sdk

```kotlin
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner

// 创建预览运行器
val runner = KuiklyMacPreviewRunner(
    pageName = "HelloWorld",
    serverPort = 9527,
    classLoader = MyClass::class.java.classLoader
)

// 设置回调
runner.onConnected = {
    println("已连接到 Mac 渲染端")
}

runner.onError = { error ->
    println("连接错误: $error")
}

runner.onFirstFramePaint = {
    println("首帧渲染完成")
}

// 启动预览
runner.start()

// 停止预览
runner.stop()
```

## 项目结构

```
PreviewMacApp/
├── PreviewMacApp/
│   ├── PreviewMacApp.swift          # 应用入口
│   ├── PreviewContentView.swift     # 主视图
│   ├── PreviewRenderViewPage.swift  # 渲染视图包装器
│   ├── Server/
│   │   ├── PreviewHttpServer.swift       # HTTP 服务
│   │   └── PreviewRenderCoreManager.swift # 渲染核心管理器
│   ├── KuiklyRenderAddons/
│   │   └── Controllers/
│   │       ├── PreviewRenderViewController.h
│   │       └── PreviewRenderViewController.m
│   └── Assets.xcassets/
├── Podfile
└── README.md
```

## 依赖

- OpenKuiklyIOSRender (core-render-ios)
- SDWebImage

## 构建

```bash
cd PreviewMacApp
pod install
open PreviewMacApp.xcworkspace
```

## 注意事项

1. 确保 PreviewMacApp 和 IDE 在同一局域网内
2. 默认端口为 9527，可在代码中修改
3. 应用需要网络权限才能启动 HTTP 服务
4. 预览模式下禁用了 TurboDisplay 以确保实时渲染

