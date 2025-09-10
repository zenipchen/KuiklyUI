# 项目结构说明

## 📁 目录结构

```
kuikly-idea-plugin/
├── build.gradle.kts                    # Gradle 构建配置
├── settings.gradle.kts                 # Gradle 设置
├── gradle.properties                   # Gradle 属性
├── gradlew                            # Gradle Wrapper (Unix)
├── gradlew.bat                        # Gradle Wrapper (Windows)
├── gradle/                            # Gradle Wrapper 文件
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── README.md                          # 项目说明
├── USAGE.md                           # 使用手册
├── CHANGELOG.md                       # 更新日志
├── PROJECT_STRUCTURE.md               # 本文件
├── quick-start.sh                     # 快速开始脚本
├── .gitignore                         # Git 忽略配置
└── src/
    └── main/
        ├── kotlin/
        │   └── com/tencent/kuikly/plugin/
        │       ├── KuiklyPluginService.kt       # Plugin 服务（核心）
        │       ├── ui/
        │       │   ├── DeviceConfig.kt          # 设备配置
        │       │   ├── KuiklyBrowserPanel.kt    # JCEF 浏览器面板
        │       │   └── KuiklyPreviewToolWindow.kt # 工具窗口
        │       ├── server/
        │       │   └── KuiklyDevServer.kt       # HTTP + WebSocket 服务器
        │       ├── watcher/
        │       │   └── KuiklyFileWatcher.kt     # 文件监听器
        │       ├── compiler/
        │       │   └── KotlinJsCompiler.kt      # Kotlin -> JS 编译器
        │       ├── scanner/
        │       │   └── PageScanner.kt           # @Page 注解扫描器
        │       └── actions/
        │           ├── OpenPreviewAction.kt      # 打开预览动作
        │           ├── RefreshPreviewAction.kt   # 刷新预览动作
        │           └── PreviewCurrentPageAction.kt # 预览当前页面动作
        └── resources/
            ├── META-INF/
            │   └── plugin.xml                    # Plugin 配置文件
            └── icons/
                └── kuikly.svg                    # Plugin 图标
```

## 🔧 核心组件说明

### 1. KuiklyPluginService
**文件**: `KuiklyPluginService.kt`

**职责**:
- Plugin 的生命周期管理
- 初始化开发服务器
- 启动文件监听器
- 单例服务，每个项目一个实例

**关键方法**:
```kotlin
fun initialize()  // 初始化服务
fun shutdown()    // 关闭服务
companion object {
    fun getInstance(project: Project): KuiklyPluginService
}
```

### 2. KuiklyBrowserPanel
**文件**: `ui/KuiklyBrowserPanel.kt`

**职责**:
- 嵌入 JCEF (Chromium) 浏览器
- 加载和显示预览页面
- 提供刷新、DevTools 等功能
- 处理加载状态回调

**关键方法**:
```kotlin
fun getComponent(): JComponent          // 获取 UI 组件
fun loadPage(pageName, device)          // 加载页面
fun reload()                            // 刷新
fun openDevTools()                      // 打开 DevTools
```

### 3. KuiklyDevServer
**文件**: `server/KuiklyDevServer.kt`

**职责**:
- 启动本地 HTTP 服务器（端口 8765）
- 提供 h5App.js 静态文件服务
- 提供 WebSocket 端点（热重载通信）
- 生成预览 HTML 页面

**技术栈**:
- Ktor Server (Netty)
- WebSocket
- 协程

**关键方法**:
```kotlin
fun start()                             // 启动服务器
fun stop()                              // 停止服务器
suspend fun notifyReload()              // 通知浏览器刷新
```

### 4. KuiklyFileWatcher
**文件**: `watcher/KuiklyFileWatcher.kt`

**职责**:
- 监听 Kotlin 文件变化
- 防抖处理（1秒）
- 触发增量编译
- 编译成功后通知刷新

**技术栈**:
- IntelliJ VFS (Virtual File System)
- Kotlin Coroutines

**关键方法**:
```kotlin
fun start()                             // 启动监听
fun stop()                              // 停止监听
private fun onKotlinFileChanged()       // 文件变化处理
```

### 5. KotlinJsCompiler
**文件**: `compiler/KotlinJsCompiler.kt`

**职责**:
- 调用 Gradle 编译 Kotlin -> JS
- 超时控制（60秒）
- 错误处理和日志

**关键方法**:
```kotlin
fun incrementalCompile(): Boolean       // 增量编译
private fun compileViaGradle(): Boolean // 通过 Gradle 编译
```

### 6. PageScanner
**文件**: `scanner/PageScanner.kt`

**职责**:
- 扫描项目中的 @Page 注解
- 提取页面名称
- 过滤非 demo 目录的文件

**关键方法**:
```kotlin
fun scanAllPages(): List<PageInfo>      // 扫描所有页面
```

### 7. KuiklyPreviewToolWindow
**文件**: `ui/KuiklyPreviewToolWindow.kt`

**职责**:
- 创建预览工具窗口
- 管理 UI 组件（浏览器、工具栏、状态栏）
- 处理用户交互（选择页面、切换设备等）

**UI 组件**:
- 页面选择下拉框
- 设备选择下拉框
- 刷新按钮
- DevTools 按钮
- 扫描按钮
- 浏览器显示区域
- 状态栏

## 🔄 工作流程

### 启动流程

```
1. IDEA 启动，加载 Plugin
   ↓
2. 用户打开 Kuikly Preview 窗口
   ↓
3. KuiklyPreviewToolWindowFactory.createToolWindowContent()
   ↓
4. KuiklyPreviewPanel 初始化
   ↓
5. KuiklyPluginService.initialize()
   ├─ 启动 KuiklyDevServer (端口 8765)
   └─ 启动 KuiklyFileWatcher
   ↓
6. PageScanner 扫描 @Page 注解
   ↓
7. 显示页面列表，等待用户选择
```

### 预览流程

```
1. 用户选择页面
   ↓
2. KuiklyBrowserPanel.loadPage()
   ↓
3. JCEF 加载 URL: http://localhost:8765/index.html?page_name=XXX
   ↓
4. KuiklyDevServer 生成 HTML
   ├─ 引入 h5App.js
   ├─ 设置设备尺寸
   └─ WebSocket 客户端代码
   ↓
5. 浏览器渲染 Kuikly 页面
   ↓
6. WebSocket 连接建立，等待热重载消息
```

### 热重载流程

```
1. 开发者修改 Kotlin 文件并保存
   ↓
2. KuiklyFileWatcher 检测到变化
   ↓
3. 防抖处理（等待 1 秒）
   ↓
4. KotlinJsCompiler.incrementalCompile()
   ├─ 执行: ./gradlew :h5App:jsBrowserDevelopmentWebpack
   └─ 等待编译完成（最多 60 秒）
   ↓
5. 编译成功
   ↓
6. KuiklyDevServer.notifyReload()
   ├─ 通过 WebSocket 发送 "reload" 消息
   └─ 所有连接的浏览器接收消息
   ↓
7. 浏览器执行 location.reload()
   ↓
8. 重新加载页面，显示最新效果 ✨
```

## 📦 依赖说明

### Gradle Plugin 依赖

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.21"        // Kotlin JVM
    id("org.jetbrains.intellij") version "1.17.4"  // IntelliJ Plugin SDK
}
```

### 运行时依赖

```kotlin
dependencies {
    // Kotlin 标准库
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    
    // Ktor 服务器
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-websockets:2.3.7")
    
    // 协程
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-swing:1.7.3")
}
```

### IntelliJ Platform API

```kotlin
// 自动由 intellij plugin 提供
- com.intellij.openapi.project.Project
- com.intellij.openapi.wm.ToolWindow
- com.intellij.psi.*
- com.intellij.ui.jcef.*
- org.jetbrains.kotlin.psi.*
```

## 🔌 Plugin 配置

### plugin.xml

```xml
<idea-plugin>
    <id>com.tencent.kuikly.plugin</id>
    <name>Kuikly Preview</name>
    
    <!-- 依赖 -->
    <depends>com.intellij.modules.platform</depends>
    <depends>org.jetbrains.kotlin</depends>
    
    <!-- 扩展点 -->
    <extensions defaultExtensionNs="com.intellij">
        <!-- Tool Window -->
        <toolWindow id="Kuikly Preview"
                    anchor="right"
                    factoryClass="...KuiklyPreviewToolWindowFactory"/>
        
        <!-- Project Service -->
        <projectService serviceImplementation="...KuiklyPluginService"/>
    </extensions>
    
    <!-- 动作 -->
    <actions>
        <action id="Kuikly.OpenPreview" .../>
        <action id="Kuikly.RefreshPreview" .../>
        <action id="Kuikly.PreviewThisPage" .../>
    </actions>
</idea-plugin>
```

## 🛠️ 构建流程

### 本地开发

```bash
# 1. 运行测试实例
./gradlew runIde

# 2. 构建 Plugin
./gradlew buildPlugin

# 3. 验证 Plugin
./gradlew verifyPlugin
```

### 发布流程

```bash
# 1. 更新版本号
# 编辑 build.gradle.kts: version = "1.0.1"

# 2. 更新 CHANGELOG.md

# 3. 构建
./gradlew buildPlugin

# 4. 发布到 JetBrains Marketplace
./gradlew publishPlugin
```

## 🐛 调试技巧

### 查看日志

**IDEA 控制台**:
- `Help` -> `Show Log in Finder` (Mac) / `Show Log in Explorer` (Windows)
- 查找 `idea.log`

**Plugin 输出**:
```
所有 println() 输出会显示在 IDEA 的 "Run" 面板
```

### 断点调试

1. 在代码中设置断点
2. 使用 "Plugin" Run Configuration
3. 选择 "Debug" 而不是 "Run"

### 热重载 Plugin 代码

不支持，必须重启 IDEA。

## 📊 性能优化

### 编译优化

```properties
# gradle.properties
kotlin.incremental.js=true
kotlin.incremental.js.ir=true
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
```

### 防抖优化

```kotlin
// KuiklyFileWatcher.kt
private val debounceDelay = 1000L  // 可调整
```

### 缓存策略

目前没有实现缓存，可以考虑：
- 编译结果缓存
- 页面扫描结果缓存
- 依赖分析缓存

## 🔮 未来扩展

### 计划功能

1. **@HotPreview 支持**
   - 扫描 @HotPreview Composable
   - 自动生成预览 Pager

2. **多页面并排预览**
   - Split View
   - 对比不同设备的效果

3. **主题切换**
   - 亮色/暗色主题
   - 自定义主题

4. **点击定位代码**
   - 点击预览中的元素
   - 自动跳转到源码

5. **性能分析**
   - 集成 Performance API
   - 显示帧率、内存使用

### 扩展点

可以通过以下方式扩展：

1. **自定义渲染器**
   - 实现 `IKuiklyRenderer` 接口
   - 注册到 Extension Point

2. **自定义设备**
   - 修改 `DeviceConfig.getAllDevices()`
   - 添加自定义尺寸

3. **自定义编译器**
   - 实现 `IKuiklyCompiler` 接口
   - 支持其他编译方式

## 📞 联系方式

- 📧 Email: kuikly@tencent.com
- 🐛 Issues: https://github.com/Tencent/KuiklyUI/issues
- 📚 Docs: https://kuikly.tds.qq.com

---

**版本**: 1.0.0  
**更新时间**: 2025-10-01  
**维护者**: Tencent Kuikly Team

