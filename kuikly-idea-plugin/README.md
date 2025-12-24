# Kuikly IDEA Plugin

为 Kuikly 跨平台 UI 框架提供实时预览功能的 IntelliJ IDEA 插件。

## ✨ 功能特性

- 🎯 **实时预览** - 在 IDEA 中直接预览 Kuikly 页面
- 🔥 **热重载** - 代码修改自动更新预览
- 📱 **多设备支持** - 模拟不同尺寸的手机和平板
- 🔧 **Chrome DevTools** - 集成完整的浏览器开发工具
- 🚀 **基于 Web 渲染** - 100% 真实的渲染效果

## 📦 安装

### 方式一：从源码构建

```bash
cd kuikly-idea-plugin
./gradlew buildPlugin

# 安装产物：build/distributions/kuikly-idea-plugin-1.0.0.zip
```

在 IDEA 中安装：
1. `File` -> `Settings` -> `Plugins`
2. 点击 `⚙️` -> `Install Plugin from Disk...`
3. 选择构建好的 zip 文件
4. 重启 IDEA

### 方式二：从 JetBrains Marketplace（即将推出）

搜索 "Kuikly Preview" 并安装。

## 🚀 快速开始

### 1. 前置条件

确保您的 Kuikly 项目已经构建了 h5App：

```bash
cd /path/to/KuiklyUI
./gradlew :h5App:jsBrowserDevelopmentWebpack
```

### 2. 打开预览窗口

- **菜单**: `View` -> `Tool Windows` -> `Kuikly Preview`
- **快捷键**: `Ctrl+Alt+P` (Windows/Linux) 或 `Cmd+Option+P` (Mac)

### 3. 选择页面

在预览窗口的下拉框中选择要预览的页面。

### 4. 开始编码

修改 Kotlin 代码 -> 保存 -> 等待 2-3 秒 -> 预览自动更新 ✨

## 📖 使用指南

### 工具栏按钮

| 按钮 | 功能 | 快捷键 |
|------|------|--------|
| 📄 页面 | 选择要预览的页面 | - |
| 📱 设备 | 切换设备尺寸 | - |
| 🔄 刷新 | 手动刷新预览 | Ctrl+Alt+R |
| 🔧 DevTools | 打开 Chrome DevTools | - |
| 📋 扫描 | 重新扫描项目中的页面 | - |

### 设备尺寸

- **手机 (小)** - 360×640 (2.0x)
- **手机 (中)** - 390×844 (3.0x) *默认*
- **手机 (大)** - 414×896 (3.0x)
- **平板 7"** - 600×960 (1.5x)
- **平板 10"** - 800×1280 (1.5x)

### 热重载

文件保存后，插件会自动：
1. 检测 Kotlin 文件变化
2. 触发增量编译（防抖 1 秒）
3. 编译完成后通过 WebSocket 通知浏览器
4. 浏览器自动刷新显示最新效果

### Chrome DevTools

点击 "🔧 DevTools" 按钮可以打开完整的 Chrome 开发者工具，支持：
- Console - 查看日志
- Network - 监控网络请求
- Elements - 检查 DOM 结构
- Sources - 调试 JavaScript
- Performance - 性能分析

## 🛠️ 技术架构

```
IDEA Plugin
    ↓
JCEF Browser (Chromium)
    ↓
Local HTTP Server (Ktor)
    ↓
h5App.js (Kuikly Web Render)
    ↓
WebSocket (Hot Reload)
```

### 核心组件

1. **KuiklyBrowserPanel** - JCEF 浏览器组件
2. **KuiklyDevServer** - 本地 HTTP 服务器 + WebSocket
3. **KuiklyFileWatcher** - 文件变化监听
4. **KotlinJsCompiler** - Kotlin -> JS 编译
5. **PageScanner** - @Page 注解扫描

## 🐛 常见问题

### 问题：预览窗口显示 "JCEF 不支持"

**原因**: 您的 IDEA 版本过旧，不支持 JCEF。

**解决**: 升级到 IntelliJ IDEA 2020.2 或更高版本。

### 问题：提示 "h5App build output not found"

**原因**: h5App 未构建。

**解决**: 运行构建命令：
```bash
./gradlew :h5App:jsBrowserDevelopmentWebpack
```

### 问题：端口 8765 被占用

**原因**: 该端口已被其他程序使用。

**解决**: 
1. 查找占用端口的进程：`lsof -i :8765` (Mac/Linux) 或 `netstat -ano | findstr :8765` (Windows)
2. 关闭占用端口的程序
3. 重启 IDEA

### 问题：热重载不工作

**可能原因**:
1. Gradle 编译失败 - 检查 IDEA 的 Build 输出
2. WebSocket 连接断开 - 刷新浏览器
3. 文件监听器未启动 - 重启 Plugin

**调试**:
- 打开 IDEA 的控制台查看日志
- 打开 DevTools 的 Console 查看 WebSocket 状态

### 问题：页面列表为空

**原因**: 项目中没有带 @Page 注解的类。

**解决**: 
1. 确保在 `demo/src/commonMain/kotlin` 目录下创建页面
2. 确保页面类使用了 `@Page` 注解
3. 点击 "📋 扫描" 按钮重新扫描

## 🔧 开发

### 构建 Plugin

```bash
./gradlew buildPlugin
```

### 运行测试实例

```bash
./gradlew runIde
```

这会启动一个带有 Plugin 的 IDEA 实例，用于开发和测试。

### 调试

在 IDEA 中打开 Plugin 项目，使用 "Plugin" Run Configuration 启动调试。

## 📝 更新日志

### v1.0.0 (2025-10-01)

- 🎉 首个版本发布
- ✨ 实时预览功能
- 🔥 热重载支持
- 📱 多设备尺寸
- 🔧 Chrome DevTools 集成

## 🤝 贡献

欢迎贡献代码！请查看 [CONTRIBUTING.md](../CONTRIBUTING.md)。

## 📄 许可证

与 KuiklyUI 项目使用相同的许可证。

## 🔗 相关链接

- [KuiklyUI 主项目](https://github.com/Tencent/KuiklyUI)
- [设计文档](../docs/kuikly-idea-plugin-design-web.md)
- [问题反馈](https://github.com/Tencent/KuiklyUI/issues)

## 👥 作者

Tencent Kuikly Team

---

如有问题，请联系：kuikly@tencent.com

