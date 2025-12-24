# Kuikly Desktop with Mac Render

该应用使用 Mac 原生渲染器进行 UI 渲染，通过 HTTP 与 PreviewMacApp 通信。

## 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│           desktopAppWithMacRender (JVM)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               业务逻辑层                                │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │  Logic Layer│    │    mac-render-sdk            │  │  │
│  │  │(core+compose)│◄──►│ (HTTP 通信层)               │  │  │
│  │  └─────────────┘    └──────────────────────────────┘  │  │
│  │                              │                        │  │
│  │                    Swing UI (控制面板)                 │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (端口 9527)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  PreviewMacApp (macOS)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               渲染层                                    │  │
│  │  ┌─────────────┐    ┌──────────────────────────────┐  │  │
│  │  │Render Layer │    │    HTTP Server               │  │  │
│  │  │(core-render-│◄──►│    (端口 9527)               │  │  │
│  │  │   ios)      │    └──────────────────────────────┘  │  │
│  │  └─────────────┘                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 与 desktopApp 的区别

| 特性 | desktopApp | desktopAppWithMacRender |
|------|------------|-------------------------|
| 渲染引擎 | JCEF (Chromium) | Mac 原生 (core-render-ios) |
| 依赖 | desktop-render-sdk + JCEF | mac-render-sdk |
| 渲染进程 | 同进程 (WebView) | 跨进程 (PreviewMacApp) |
| 通信方式 | JS Bridge | HTTP |
| 渲染质量 | Web 渲染 | 原生渲染 |
| 平台限制 | 跨平台 | 仅 macOS |

## 使用方法

### 1. 启动 PreviewMacApp

首先需要启动 Mac 渲染端：

```bash
./run_preview_mac.sh
```

或者手动在 Xcode 中打开并运行 `PreviewMacApp`。

### 2. 启动 desktopAppWithMacRender

```bash
./run_desktopAppWithMacRender.sh
```

### 3. 在 GUI 中操作

1. 点击 "检查连接" 确认与 PreviewMacApp 的连接
2. 输入页面名称或使用快速启动按钮
3. 查看日志区域了解运行状态

## 命令行参数

```bash
./gradlew :desktopAppWithMacRender:run --args="<serverHost> <serverPort>"
```

- `serverHost`: PreviewMacApp 服务器地址，默认 `localhost`
- `serverPort`: PreviewMacApp 服务器端口，默认 `9527`

## 项目结构

```
desktopAppWithMacRender/
├── build.gradle.kts                 # Gradle 构建配置
├── README.md                        # 本文档
└── src/jvmMain/kotlin/com/tencent/kuikly/desktop/mac/
    └── Main.kt                      # 主程序入口
```

## 依赖

- `core` - Kuikly 核心逻辑
- `compose` - Kuikly 组件库
- `demo` - 示例页面
- `mac-render-sdk` - Mac 渲染 SDK

