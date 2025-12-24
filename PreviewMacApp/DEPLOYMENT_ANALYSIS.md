# PreviewMacApp 打包部署方案分析

## 方案概述

将 PreviewMacApp 打包到 `mac-render-sdk` 中，通过 IDE Plugin 集成，在首次启动时安装 PreviewMacApp，然后发起 TCP 连接进行渲染。

## 当前架构

### PreviewMacApp
- **类型**: macOS 原生应用（.app bundle）
- **构建工具**: Xcode + CocoaPods
- **依赖**:
  - `OpenKuiklyIOSRender` (CocoaPods, 本地路径)
  - `SDWebImage` (CocoaPods)
- **通信**: TCP Server (端口 9528)
- **大小**: 约 297MB（包含 build 产物和 Pods）

### mac-render-sdk
- **类型**: Kotlin Multiplatform JVM 库
- **打包**: JAR 文件
- **依赖**: Kotlin 标准库、Gson、Coroutines
- **通信**: TCP Client

## 方案弊端分析

### 1. ❌ 技术架构不匹配

**问题**:
- PreviewMacApp 是 macOS 原生应用（.app），无法直接打包到 JAR
- mac-render-sdk 是纯 JVM 库，不包含原生代码
- 两者属于不同的技术栈和打包格式

**影响**:
- 无法将 .app bundle 嵌入到 JAR 中
- 需要单独分发机制

### 2. ❌ 依赖管理复杂

**问题**:
- PreviewMacApp 依赖 `OpenKuiklyIOSRender`（CocoaPods）
- 需要 Xcode 构建环境
- CocoaPods 依赖需要 `pod install`
- 依赖链：`OpenKuiklyIOSRender` → `core-render-ios` → 其他原生依赖

**影响**:
- IDE Plugin 需要管理原生依赖
- 需要处理 CocoaPods 版本兼容
- 构建环境要求高（Xcode、CocoaPods）

### 3. ❌ 代码签名和分发

**问题**:
- macOS 应用需要代码签名（Code Signing）
- 需要 Apple Developer 证书
- 未签名的应用可能被 Gatekeeper 阻止
- 需要处理公证（Notarization）流程

**影响**:
- 首次运行可能被系统阻止
- 需要用户手动允许（"系统偏好设置" → "安全性与隐私"）
- 企业分发需要特殊配置

### 4. ❌ 版本管理困难

**问题**:
- PreviewMacApp 和 mac-render-sdk 版本需要同步
- 协议变更需要同时更新两端
- 依赖更新（如 OpenKuiklyIOSRender）需要重新构建

**影响**:
- 版本不匹配可能导致通信失败
- 更新流程复杂（需要重新构建和分发 .app）

### 5. ❌ 安装和更新流程

**问题**:
- 首次安装需要：
  1. 下载 .app bundle
  2. 解压到应用目录（如 `~/Library/Application Support/`）
  3. 处理代码签名验证
  4. 可能需要用户授权
- 更新需要：
  1. 检测新版本
  2. 下载新版本
  3. 替换旧版本
  4. 重启 PreviewMacApp

**影响**:
- 安装流程复杂，用户体验差
- 更新可能中断正在进行的预览
- 需要处理并发安装/更新

### 6. ❌ 资源占用

**问题**:
- PreviewMacApp 体积较大（约 297MB，包含 build 产物）
- 需要独立进程运行
- 内存占用（SwiftUI + 渲染引擎）

**影响**:
- SDK 体积增大
- 系统资源占用增加
- 可能影响 IDE 性能

### 7. ❌ 跨平台兼容性

**问题**:
- PreviewMacApp 仅支持 macOS
- Windows/Linux 用户无法使用
- IDE Plugin 需要平台检测

**影响**:
- 需要平台特定的安装逻辑
- 非 macOS 用户无法使用预览功能

### 8. ❌ 调试和维护

**问题**:
- PreviewMacApp 崩溃需要独立调试
- 日志分散（IDE Plugin + PreviewMacApp）
- 问题定位困难

**影响**:
- 调试成本高
- 用户反馈问题难以复现

## 推荐方案

### 方案 1: 独立应用 + 自动启动（推荐）⭐

**架构**:
```
IDE Plugin
  ├─ 检测 PreviewMacApp 是否安装
  ├─ 未安装 → 引导用户下载安装
  ├─ 已安装 → 自动启动 PreviewMacApp
  └─ 通过 TCP 连接进行通信
```

**实现**:
1. **PreviewMacApp 独立分发**:
   - 通过 GitHub Releases 或 CDN 分发
   - 提供 `.dmg` 或 `.zip` 安装包
   - 包含代码签名和版本信息

2. **IDE Plugin 集成**:
   ```kotlin
   class PreviewMacAppManager {
       fun ensureInstalled(): Boolean {
           // 检查是否已安装
           if (isInstalled()) return true
           
           // 引导用户安装
           showInstallDialog()
           return false
       }
       
       fun startIfNeeded(): Boolean {
           if (!isRunning()) {
               // 启动 PreviewMacApp
               ProcessBuilder("open", "-a", "PreviewMacApp").start()
               // 等待启动
               waitForServer(port = 9528, timeout = 5)
           }
           return isRunning()
       }
   }
   ```

3. **版本管理**:
   - PreviewMacApp 内置版本号
   - IDE Plugin 检查版本兼容性
   - 不兼容时提示用户更新

**优点**:
- ✅ 架构清晰，职责分离
- ✅ 安装流程简单（用户手动安装一次）
- ✅ 版本管理灵活
- ✅ 易于调试和维护
- ✅ 支持独立更新

**缺点**:
- ⚠️ 需要用户手动安装（首次）
- ⚠️ 需要处理版本兼容性

### 方案 2: 嵌入资源 + 首次安装

**架构**:
```
mac-render-sdk JAR
  └─ resources/
      └─ PreviewMacApp.app.zip (压缩包)
      
IDE Plugin
  ├─ 首次启动时解压到 ~/Library/Application Support/
  ├─ 设置执行权限
  └─ 启动 PreviewMacApp
```

**实现**:
1. **打包**:
   ```kotlin
   // build.gradle.kts
   tasks.register<Copy>("embedPreviewMacApp") {
       from("../../PreviewMacApp/build/Build/Products/Release/PreviewMacApp.app")
       into("$buildDir/resources/main/preview-mac-app")
       // 压缩为 zip
   }
   ```

2. **安装逻辑**:
   ```kotlin
   class PreviewMacAppInstaller {
       fun install(): File? {
           val appDir = File(System.getProperty("user.home"), 
                            "Library/Application Support/Kuikly/PreviewMacApp.app")
           
           if (appDir.exists()) return appDir
           
           // 从 JAR 资源中提取
           val zipStream = javaClass.getResourceAsStream("/preview-mac-app/PreviewMacApp.app.zip")
           extractZip(zipStream, appDir.parentFile)
           
           // 设置执行权限
           setExecutable(appDir)
           
           return appDir
       }
   }
   ```

**优点**:
- ✅ 无需用户手动安装
- ✅ 版本与 SDK 同步
- ✅ 自动化程度高

**缺点**:
- ❌ JAR 体积大幅增加（~300MB）
- ❌ 需要处理代码签名
- ❌ 首次启动较慢（解压）
- ❌ 更新需要重新下载整个 JAR

### 方案 3: 混合方案（推荐）⭐⭐

**架构**:
```
mac-render-sdk JAR
  └─ resources/
      └─ preview-mac-app-installer.sh (安装脚本)
      
IDE Plugin
  ├─ 检测是否已安装
  ├─ 未安装 → 执行安装脚本（下载最新版本）
  └─ 已安装 → 检查版本，必要时更新
```

**实现**:
1. **安装脚本**:
   ```bash
   #!/bin/bash
   # preview-mac-app-installer.sh
   
   VERSION="1.0.0"
   DOWNLOAD_URL="https://github.com/your-org/kuikly/releases/download/v${VERSION}/PreviewMacApp.dmg"
   INSTALL_DIR="$HOME/Library/Application Support/Kuikly"
   
   # 下载并安装
   curl -L "$DOWNLOAD_URL" -o /tmp/PreviewMacApp.dmg
   hdiutil attach /tmp/PreviewMacApp.dmg
   cp -R /Volumes/PreviewMacApp/PreviewMacApp.app "$INSTALL_DIR/"
   hdiutil detach /Volumes/PreviewMacApp
   ```

2. **IDE Plugin 集成**:
   ```kotlin
   class PreviewMacAppManager {
       fun ensureInstalled(): Boolean {
           val installer = loadInstallerScript()
           if (!isInstalled()) {
               installer.install()
           }
           return isInstalled()
       }
   }
   ```

**优点**:
- ✅ JAR 体积小（只包含安装脚本）
- ✅ 自动安装，用户体验好
- ✅ 版本管理灵活（从 CDN 下载）
- ✅ 支持增量更新

**缺点**:
- ⚠️ 需要网络连接（首次安装）
- ⚠️ 需要处理下载失败的情况

## 最终推荐

### 🏆 推荐方案：方案 3（混合方案）

**理由**:
1. **平衡了用户体验和复杂度**
   - 自动安装，无需用户手动操作
   - JAR 体积小，不影响 SDK 分发

2. **灵活的版本管理**
   - 可以从 CDN 下载最新版本
   - 支持版本检查和更新
   - SDK 和 PreviewMacApp 可以独立版本

3. **易于维护**
   - 安装脚本简单，易于调试
   - 问题定位清晰
   - 支持回滚

### 实施步骤

1. **准备 PreviewMacApp 分发**:
   - 构建 Release 版本
   - 代码签名
   - 打包为 .dmg 或 .zip
   - 上传到 CDN/GitHub Releases

2. **创建安装脚本**:
   - 下载最新版本
   - 解压到应用目录
   - 设置权限
   - 验证安装

3. **IDE Plugin 集成**:
   - 检测安装状态
   - 执行安装脚本（如需要）
   - 启动 PreviewMacApp
   - 建立 TCP 连接

4. **版本管理**:
   - PreviewMacApp 内置版本号
   - IDE Plugin 检查版本兼容性
   - 支持自动更新

## 注意事项

1. **代码签名**: PreviewMacApp 必须正确签名，否则可能被 Gatekeeper 阻止
2. **权限**: 需要用户授权才能安装到系统目录
3. **网络**: 首次安装需要网络连接
4. **回退**: 如果安装失败，需要有回退机制
5. **日志**: 记录安装和启动日志，便于问题排查

