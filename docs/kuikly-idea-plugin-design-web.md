# Kuikly IDEA Plugin 实时预览设计方案（基于 Web 渲染）

## 1. 方案概述

### 1.1 核心思路
使用 **JCEF (Java Chromium Embedded Framework)** 在 IDEA Plugin 中嵌入浏览器，直接复用项目现有的 **core-render-web** 渲染能力，无需新增任何渲染模块。

### 1.2 方案优势

✅ **零新增模块** - 直接复用 `core-render-web` 和 `h5App`  
✅ **真实渲染** - 100% 还原 Web/H5 端的真实效果  
✅ **开发快速** - 无需实现复杂的 DSL 转换  
✅ **易于调试** - 可以使用 Chrome DevTools  
✅ **热重载简单** - 编译 JS -> 刷新浏览器  
✅ **性能优秀** - 现代浏览器引擎性能强大  

### 1.3 与 Desktop 方案对比

| 特性 | Web 渲染方案 | Desktop 方案 |
|------|------------|------------|
| 新增模块 | ❌ 不需要 | ✅ 需要 core-render-desktop |
| 渲染真实性 | ⭐⭐⭐⭐⭐ 100%真实 | ⭐⭐⭐ 需要转换 |
| 开发周期 | 🚀 4-6 周 | 🐢 9-14 周 |
| DSL 支持 | ✅ 自动支持 | ⚠️ 需要手动转换 |
| 调试工具 | ✅ Chrome DevTools | ⚠️ 需要自己实现 |
| 热重载难度 | ⭐⭐ 简单 | ⭐⭐⭐⭐⭐ 复杂 |

**结论**：**Web 渲染方案是更优的选择** 🎯

## 2. 整体架构设计

### 2.1 架构图

```
┌──────────────────────────────────────────────────────────┐
│                    IDEA Plugin                            │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         UI Layer (Tool Window)                      │  │
│  │  ┌──────────┐  ┌─────────┐  ┌──────────────────┐  │  │
│  │  │ JCEF     │  │ Device  │  │ Page Selector    │  │  │
│  │  │ Browser  │  │ Toolbar │  │ + Refresh Button │  │  │
│  │  └──────────┘  └─────────┘  └──────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│           ↕ Load URL                                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │     Local Dev Server (Embedded HTTP Server)        │  │
│  │  • Serve h5App.js + index.html                     │  │
│  │  • WebSocket for Hot Reload                        │  │
│  │  • Static Assets Proxy                             │  │
│  └────────────────────────────────────────────────────┘  │
│           ↑                                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │     Hot Reload Watcher                             │  │
│  │  • File System Watcher                             │  │
│  │  • Kotlin -> JS Incremental Compiler               │  │
│  │  • Change Detector                                 │  │
│  └────────────────────────────────────────────────────┘  │
│           ↑                                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │     Page Annotation Scanner                        │  │
│  │  • @Page Scanner                                   │  │
│  │  • @HotPreview Scanner                             │  │
│  │  • PSI Tree Analyzer                               │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│           Kuikly Project (User Code)                      │
│  • demo/src/commonMain/kotlin/pages/                     │
│  • @Page Annotated Classes                               │
│  • @HotPreview Composables                               │
└──────────────────────────────────────────────────────────┘
                         ↓
                   Gradle Build
                         ↓
┌──────────────────────────────────────────────────────────┐
│           Build Output                                    │
│  • build/dist/js/productionExecutable/h5App.js           │
│  • Kotlin Code -> JavaScript                             │
└──────────────────────────────────────────────────────────┘
```

### 2.2 工作流程

```
1. 开发者编写/修改 Kotlin 代码
       ↓
2. File Watcher 检测到变化
       ↓
3. 触发增量编译 Kotlin -> JS
       ↓
4. 编译完成，生成新的 h5App.js
       ↓
5. WebSocket 通知浏览器刷新
       ↓
6. JCEF 浏览器重新加载页面
       ↓
7. 显示最新的 UI 效果
```

## 3. 核心技术实现

### 3.1 JCEF 浏览器集成

JCEF 是 IntelliJ Platform 内置的浏览器组件，基于 Chromium。

**KuiklyBrowserPanel.kt**:
```kotlin
package com.tencent.kuikly.plugin.ui

import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.jcef.JBCefClient
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.handler.CefLoadHandlerAdapter
import javax.swing.JComponent

/**
 * Kuikly 浏览器面板
 * 使用 JCEF 嵌入浏览器
 */
class KuiklyBrowserPanel(
    private val devServerUrl: String
) {
    
    private val browser: JBCefBrowser = JBCefBrowser()
    
    init {
        // 配置浏览器
        setupBrowser()
        
        // 启用 Chrome DevTools
        browser.setOpenDevToolsVisible(true)
    }
    
    /**
     * 获取 UI 组件
     */
    fun getComponent(): JComponent {
        return browser.component
    }
    
    /**
     * 加载页面
     */
    fun loadPage(pageName: String, device: DeviceConfig) {
        val url = buildUrl(pageName, device)
        browser.loadURL(url)
    }
    
    /**
     * 刷新页面
     */
    fun reload() {
        browser.cefBrowser.reload()
    }
    
    /**
     * 构建 URL
     */
    private fun buildUrl(pageName: String, device: DeviceConfig): String {
        return "$devServerUrl/index.html?page_name=$pageName&width=${device.width}&height=${device.height}"
    }
    
    /**
     * 配置浏览器
     */
    private fun setupBrowser() {
        val client = browser.jbCefClient
        
        // 监听页面加载
        client.addLoadHandler(object : CefLoadHandlerAdapter() {
            override fun onLoadStart(
                browser: CefBrowser?,
                frame: CefFrame?,
                transitionType: CefRequest.TransitionType?
            ) {
                println("Kuikly Preview: Loading started")
            }
            
            override fun onLoadEnd(
                browser: CefBrowser?,
                frame: CefFrame?,
                httpStatusCode: Int
            ) {
                println("Kuikly Preview: Loading finished (status: $httpStatusCode)")
            }
            
            override fun onLoadError(
                browser: CefBrowser?,
                frame: CefFrame?,
                errorCode: CefLoadHandler.ErrorCode?,
                errorText: String?,
                failedUrl: String?
            ) {
                println("Kuikly Preview: Loading error - $errorText ($failedUrl)")
            }
        }, browser.cefBrowser)
    }
    
    /**
     * 打开 DevTools
     */
    fun openDevTools() {
        browser.openDevTools()
    }
    
    /**
     * 销毁浏览器
     */
    fun dispose() {
        browser.dispose()
    }
}
```

### 3.2 本地开发服务器

使用 **NanoHTTPD** 或 **Ktor Embedded Server** 提供 HTTP 服务。

**KuiklyDevServer.kt**:
```kotlin
package com.tencent.kuikly.plugin.server

import com.intellij.openapi.project.Project
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.http.content.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.io.File
import java.time.Duration

/**
 * Kuikly 本地开发服务器
 * 提供 HTTP 服务和 WebSocket 热重载
 */
class KuiklyDevServer(
    private val project: Project,
    private val port: Int = 8765
) {
    
    private var server: ApplicationEngine? = null
    private val wsConnections = mutableSetOf<DefaultWebSocketSession>()
    
    /**
     * 启动服务器
     */
    fun start() {
        server = embeddedServer(Netty, port = port) {
            install(WebSockets) {
                pingPeriod = Duration.ofSeconds(15)
                timeout = Duration.ofSeconds(15)
                maxFrameSize = Long.MAX_VALUE
                masking = false
            }
            
            routing {
                // 静态文件服务
                static("/") {
                    files(getH5AppBuildDir())
                }
                
                // 主页面
                get("/") {
                    call.respondFile(File(getH5AppBuildDir(), "index.html"))
                }
                
                // 自定义 index.html（支持预览参数）
                get("/index.html") {
                    val pageName = call.parameters["page_name"] ?: "HelloWorldPage"
                    val width = call.parameters["width"]?.toIntOrNull() ?: 390
                    val height = call.parameters["height"]?.toIntOrNull() ?: 844
                    
                    val html = generatePreviewHtml(pageName, width, height)
                    call.respondText(html, contentType = io.ktor.http.ContentType.Text.Html)
                }
                
                // WebSocket 端点（用于热重载）
                webSocket("/ws/reload") {
                    wsConnections.add(this)
                    try {
                        for (frame in incoming) {
                            // 保持连接
                        }
                    } finally {
                        wsConnections.remove(this)
                    }
                }
                
                // 健康检查
                get("/health") {
                    call.respondText("OK")
                }
            }
        }.start(wait = false)
        
        println("Kuikly Dev Server started at http://localhost:$port")
    }
    
    /**
     * 停止服务器
     */
    fun stop() {
        server?.stop(1000, 2000)
        println("Kuikly Dev Server stopped")
    }
    
    /**
     * 通知浏览器重新加载
     */
    suspend fun notifyReload() {
        wsConnections.forEach { session ->
            try {
                session.send(Frame.Text("reload"))
            } catch (e: Exception) {
                println("Failed to notify reload: ${e.message}")
            }
        }
    }
    
    /**
     * 获取 h5App 构建目录
     */
    private fun getH5AppBuildDir(): String {
        // 优先使用 productionExecutable（优化过的）
        val productionDir = File(project.basePath, "h5App/build/dist/js/productionExecutable")
        if (productionDir.exists()) {
            return productionDir.absolutePath
        }
        
        // 降级到 developmentExecutable
        val developmentDir = File(project.basePath, "h5App/build/dist/js/developmentExecutable")
        if (developmentDir.exists()) {
            return developmentDir.absolutePath
        }
        
        throw IllegalStateException(
            "h5App build output not found. Please build the project first:\n" +
            "./gradlew :h5App:jsBrowserDevelopmentWebpack"
        )
    }
    
    /**
     * 生成预览 HTML
     */
    private fun generatePreviewHtml(pageName: String, width: Int, height: Int): String {
        return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Kuikly Preview - $pageName</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<style>
    * {
        margin: 0;
        padding: 0;
    }
    body {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f0f0f0;
        height: 100vh;
    }
    #preview-container {
        width: ${width}px;
        height: ${height}px;
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        overflow: hidden;
        position: relative;
    }
    #root {
        width: 100%;
        height: 100%;
    }
    input:focus {
        outline: none;
    }
    .list-no-scrollbar {
        scrollbar-width: none;
    }
    .list-no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    @keyframes activityIndicatorRotate {
        0% { transform: rotate(0deg) }
        100% { transform: rotate(360deg) }
    }
    /* 热重载提示 */
    #reload-indicator {
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        background: #4CAF50;
        color: white;
        border-radius: 4px;
        font-size: 12px;
        font-family: sans-serif;
        display: none;
        z-index: 10000;
    }
</style>
<body>
    <div id="reload-indicator">🔄 Reloading...</div>
    <div id="preview-container">
        <div id="root"></div>
    </div>
    
    <!-- Kuikly Web Render JS -->
    <script type="text/javascript" src="/h5App.js"></script>
    
    <!-- WebSocket 热重载客户端 -->
    <script>
        (function() {
            const ws = new WebSocket('ws://localhost:${port}/ws/reload');
            const indicator = document.getElementById('reload-indicator');
            
            ws.onopen = function() {
                console.log('✅ Hot reload connected');
            };
            
            ws.onmessage = function(event) {
                if (event.data === 'reload') {
                    console.log('🔄 Reloading...');
                    indicator.style.display = 'block';
                    setTimeout(() => {
                        location.reload();
                    }, 300);
                }
            };
            
            ws.onerror = function(error) {
                console.error('❌ WebSocket error:', error);
            };
            
            ws.onclose = function() {
                console.log('⚠️ Hot reload disconnected');
                // 3秒后尝试重连
                setTimeout(() => location.reload(), 3000);
            };
        })();
    </script>
</body>
</html>
        """.trimIndent()
    }
}
```

**依赖配置（build.gradle.kts）**:
```kotlin
dependencies {
    // Ktor Server
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-websockets:2.3.7")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
    
    // JCEF (IntelliJ Platform 内置)
    // 无需额外依赖
}
```

### 3.3 文件监听与热重载

**KuiklyFileWatcher.kt**:
```kotlin
package com.tencent.kuikly.plugin.watcher

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFileManager
import com.intellij.openapi.vfs.newvfs.BulkFileListener
import com.intellij.openapi.vfs.newvfs.events.VFileEvent
import com.tencent.kuikly.plugin.compiler.KotlinJsCompiler
import com.tencent.kuikly.plugin.server.KuiklyDevServer
import kotlinx.coroutines.*

/**
 * Kuikly 文件监听器
 * 监听 Kotlin 文件变化并触发热重载
 */
class KuiklyFileWatcher(
    private val project: Project,
    private val devServer: KuiklyDevServer
) {
    
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val compiler = KotlinJsCompiler(project)
    
    // 防抖：避免频繁编译
    private var compileJob: Job? = null
    private val debounceDelay = 500L // 500ms
    
    /**
     * 启动监听
     */
    fun start() {
        val connection = project.messageBus.connect()
        
        connection.subscribe(VirtualFileManager.VFS_CHANGES, object : BulkFileListener {
            override fun after(events: List<VFileEvent>) {
                // 过滤 Kotlin 文件变化
                val kotlinFileChanged = events.any { event ->
                    event.file?.name?.endsWith(".kt") == true &&
                    event.file?.path?.contains("/demo/src/") == true
                }
                
                if (kotlinFileChanged) {
                    onKotlinFileChanged()
                }
            }
        })
        
        println("Kuikly File Watcher started")
    }
    
    /**
     * Kotlin 文件变化
     */
    private fun onKotlinFileChanged() {
        // 取消之前的编译任务（防抖）
        compileJob?.cancel()
        
        // 延迟执行编译
        compileJob = scope.launch {
            delay(debounceDelay)
            
            println("🔨 Kotlin file changed, recompiling...")
            
            val success = compiler.incrementalCompile()
            
            if (success) {
                println("✅ Compilation successful, notifying browser...")
                devServer.notifyReload()
            } else {
                println("❌ Compilation failed")
            }
        }
    }
    
    /**
     * 停止监听
     */
    fun stop() {
        scope.cancel()
        println("Kuikly File Watcher stopped")
    }
}
```

### 3.4 Kotlin -> JS 增量编译

**KotlinJsCompiler.kt**:
```kotlin
package com.tencent.kuikly.plugin.compiler

import com.intellij.openapi.project.Project
import java.io.File

/**
 * Kotlin to JS 编译器
 */
class KotlinJsCompiler(
    private val project: Project
) {
    
    /**
     * 增量编译
     */
    fun incrementalCompile(): Boolean {
        return try {
            // 方式1：调用 Gradle 任务（推荐）
            compileViaGradle()
            
            // 方式2：直接调用 Kotlin Compiler API（更快，但更复杂）
            // compileViaCompilerApi()
            
        } catch (e: Exception) {
            println("Compilation error: ${e.message}")
            false
        }
    }
    
    /**
     * 通过 Gradle 编译（推荐方式）
     */
    private fun compileViaGradle(): Boolean {
        val projectDir = File(project.basePath ?: return false)
        
        // 使用 Gradle Wrapper
        val gradlew = if (System.getProperty("os.name").lowercase().contains("win")) {
            "gradlew.bat"
        } else {
            "./gradlew"
        }
        
        val gradlewFile = File(projectDir, gradlew)
        if (!gradlewFile.exists()) {
            println("❌ Gradlew not found: ${gradlewFile.absolutePath}")
            return false
        }
        
        // 执行增量编译（只编译 h5App 模块）
        val command = listOf(
            gradlewFile.absolutePath,
            ":h5App:jsBrowserDevelopmentWebpack",
            "--continuous",  // 启用增量编译
            "--quiet"        // 减少输出
        )
        
        println("🔨 Running: ${command.joinToString(" ")}")
        
        val process = ProcessBuilder(command)
            .directory(projectDir)
            .redirectOutput(ProcessBuilder.Redirect.PIPE)
            .redirectError(ProcessBuilder.Redirect.PIPE)
            .start()
        
        // 等待编译完成（最多 30 秒）
        val completed = process.waitFor(30, java.util.concurrent.TimeUnit.SECONDS)
        
        if (!completed) {
            process.destroy()
            println("⚠️ Compilation timeout")
            return false
        }
        
        val exitCode = process.exitValue()
        if (exitCode != 0) {
            val error = process.errorStream.bufferedReader().readText()
            println("❌ Compilation failed with exit code $exitCode:\n$error")
            return false
        }
        
        println("✅ Compilation successful")
        return true
    }
    
    /**
     * 通过 Kotlin Compiler API 编译（更快但更复杂）
     */
    private fun compileViaCompilerApi(): Boolean {
        // TODO: 实现直接调用 Kotlin Compiler
        // 参考: https://github.com/JetBrains/kotlin/tree/master/compiler
        
        // 这种方式可以做到真正的增量编译，但需要：
        // 1. 解析 PSI 树找到变化的文件
        // 2. 构建依赖图
        // 3. 只编译受影响的文件
        // 4. 更新输出
        
        // 对于 MVP 版本，使用 Gradle 方式即可
        return false
    }
}
```

**优化方案**：使用 Gradle 的 **Continuous Build** 模式：

```kotlin
/**
 * 更好的方案：启动 Gradle 持续构建进程
 */
class GradleContinuousBuilder(
    private val project: Project
) {
    private var gradleProcess: Process? = null
    
    fun startContinuousBuild() {
        val projectDir = File(project.basePath ?: return)
        val gradlew = if (isWindows) "gradlew.bat" else "./gradlew"
        
        // 使用 --continuous 模式，Gradle 会自动监听文件变化
        val command = listOf(
            File(projectDir, gradlew).absolutePath,
            ":h5App:jsBrowserDevelopmentWebpack",
            "--continuous",  // 🔥 关键：持续构建模式
            "--quiet"
        )
        
        gradleProcess = ProcessBuilder(command)
            .directory(projectDir)
            .redirectOutput(ProcessBuilder.Redirect.INHERIT)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .start()
        
        println("🔥 Gradle continuous build started")
    }
    
    fun stop() {
        gradleProcess?.destroy()
        println("⏹️ Gradle continuous build stopped")
    }
}
```

### 3.5 页面扫描与选择

**PageScanner.kt**:
```kotlin
package com.tencent.kuikly.plugin.scanner

import com.intellij.openapi.project.Project
import com.intellij.psi.PsiManager
import com.intellij.psi.search.FileTypeIndex
import com.intellij.psi.search.GlobalSearchScope
import org.jetbrains.kotlin.idea.KotlinFileType
import org.jetbrains.kotlin.psi.KtClass
import org.jetbrains.kotlin.psi.KtFile

/**
 * 扫描项目中的 Kuikly 页面
 */
class PageScanner(
    private val project: Project
) {
    
    /**
     * 扫描所有 @Page 注解的类
     */
    fun scanAllPages(): List<PageInfo> {
        val pages = mutableListOf<PageInfo>()
        val psiManager = PsiManager.getInstance(project)
        
        // 只扫描 demo 目录
        val demoScope = GlobalSearchScope.projectScope(project).let { scope ->
            // TODO: 进一步限制到 demo/src/commonMain/kotlin
            scope
        }
        
        val kotlinFiles = FileTypeIndex.getFiles(
            KotlinFileType.INSTANCE,
            demoScope
        )
        
        kotlinFiles.forEach { virtualFile ->
            val psiFile = psiManager.findFile(virtualFile) as? KtFile ?: return@forEach
            
            // 查找 @Page 注解
            psiFile.classes.forEach { ktClass ->
                val pageAnnotation = findPageAnnotation(ktClass)
                if (pageAnnotation != null) {
                    val pageName = extractPageName(ktClass, pageAnnotation)
                    pages.add(
                        PageInfo(
                            name = pageName,
                            className = ktClass.name ?: "",
                            fqName = ktClass.fqName?.asString() ?: "",
                            file = virtualFile,
                            isPager = isPagerSubclass(ktClass),
                            isComposeContainer = isComposeContainerSubclass(ktClass)
                        )
                    )
                }
            }
        }
        
        return pages.sortedBy { it.name }
    }
    
    private fun findPageAnnotation(ktClass: KtClass): KtAnnotationEntry? {
        return ktClass.annotationEntries.find { 
            it.shortName?.asString() == "Page"
        }
    }
    
    private fun extractPageName(ktClass: KtClass, annotation: KtAnnotationEntry): String {
        // 从注解中提取 name 参数
        val nameArg = annotation.valueArguments.find { 
            it.getArgumentName()?.asName?.asString() == "name" 
        }
        
        return nameArg?.getArgumentExpression()?.text?.removeSurrounding("\"") 
            ?: ktClass.name 
            ?: "Unknown"
    }
    
    private fun isPagerSubclass(ktClass: KtClass): Boolean {
        // TODO: 检查是否继承 Pager
        return true
    }
    
    private fun isComposeContainerSubclass(ktClass: KtClass): Boolean {
        // TODO: 检查是否继承 ComposeContainer
        return false
    }
}

data class PageInfo(
    val name: String,
    val className: String,
    val fqName: String,
    val file: VirtualFile,
    val isPager: Boolean,
    val isComposeContainer: Boolean
)
```

### 3.6 Tool Window UI

**KuiklyPreviewToolWindow.kt**:
```kotlin
package com.tencent.kuikly.plugin.ui

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import com.tencent.kuikly.plugin.scanner.PageScanner
import com.tencent.kuikly.plugin.server.KuiklyDevServer
import com.tencent.kuikly.plugin.watcher.KuiklyFileWatcher
import java.awt.BorderLayout
import java.awt.FlowLayout
import javax.swing.*

/**
 * Kuikly 预览工具窗口
 */
class KuiklyPreviewToolWindowFactory : ToolWindowFactory {
    
    override fun createToolWindowContent(
        project: Project,
        toolWindow: ToolWindow
    ) {
        val panel = KuiklyPreviewPanel(project)
        val content = ContentFactory.getInstance()
            .createContent(panel, "", false)
        toolWindow.contentManager.addContent(content)
    }
}

/**
 * Kuikly 预览面板
 */
class KuiklyPreviewPanel(
    private val project: Project
) : JPanel(BorderLayout()) {
    
    private val devServer = KuiklyDevServer(project, port = 8765)
    private val fileWatcher = KuiklyFileWatcher(project, devServer)
    private val pageScanner = PageScanner(project)
    
    private val browserPanel = KuiklyBrowserPanel("http://localhost:8765")
    private val pageSelector = JComboBox<String>()
    private val deviceSelector = JComboBox<DeviceConfig>()
    private val statusLabel = JLabel("Ready")
    
    init {
        // 启动服务器
        try {
            devServer.start()
            fileWatcher.start()
            statusLabel.text = "✅ Server running at http://localhost:8765"
        } catch (e: Exception) {
            statusLabel.text = "❌ Failed to start server: ${e.message}"
            JOptionPane.showMessageDialog(
                this,
                "Failed to start Kuikly Dev Server:\n${e.message}\n\n" +
                "Please ensure:\n" +
                "1. Port 8765 is not occupied\n" +
                "2. h5App is built: ./gradlew :h5App:jsBrowserDevelopmentWebpack",
                "Error",
                JOptionPane.ERROR_MESSAGE
            )
        }
        
        // 构建 UI
        setupUI()
        
        // 扫描页面
        refreshPages()
    }
    
    private fun setupUI() {
        // 顶部工具栏
        val toolbar = JPanel(FlowLayout(FlowLayout.LEFT)).apply {
            add(JLabel("Page:"))
            add(pageSelector.apply {
                preferredSize = java.awt.Dimension(200, 25)
                addActionListener { onPageSelected() }
            })
            
            add(JLabel("Device:"))
            add(deviceSelector.apply {
                DeviceConfig.getAllDevices().forEach { addItem(it) }
                selectedItem = DeviceConfig.PHONE_MEDIUM
                renderer = object : DefaultListCellRenderer() {
                    override fun getListCellRendererComponent(
                        list: JList<*>?,
                        value: Any?,
                        index: Int,
                        isSelected: Boolean,
                        cellHasFocus: Boolean
                    ): java.awt.Component {
                        val component = super.getListCellRendererComponent(
                            list, value, index, isSelected, cellHasFocus
                        )
                        if (value is DeviceConfig) {
                            text = "${value.name} (${value.width}×${value.height})"
                        }
                        return component
                    }
                }
                addActionListener { onDeviceChanged() }
            })
            
            add(JButton("🔄 Refresh").apply {
                addActionListener { onRefresh() }
            })
            
            add(JButton("🔧 DevTools").apply {
                addActionListener { browserPanel.openDevTools() }
            })
            
            add(JButton("📋 Pages").apply {
                addActionListener { refreshPages() }
            })
        }
        add(toolbar, BorderLayout.NORTH)
        
        // 中间浏览器区域
        add(browserPanel.getComponent(), BorderLayout.CENTER)
        
        // 底部状态栏
        val statusBar = JPanel(FlowLayout(FlowLayout.LEFT)).apply {
            add(statusLabel)
        }
        add(statusBar, BorderLayout.SOUTH)
    }
    
    /**
     * 刷新页面列表
     */
    private fun refreshPages() {
        SwingUtilities.invokeLater {
            pageSelector.removeAllItems()
            val pages = pageScanner.scanAllPages()
            
            if (pages.isEmpty()) {
                pageSelector.addItem("(No pages found)")
                statusLabel.text = "⚠️ No @Page found. Please create a Kuikly page first."
            } else {
                pages.forEach { page ->
                    pageSelector.addItem(page.name)
                }
                statusLabel.text = "✅ Found ${pages.size} page(s)"
                
                // 自动加载第一个页面
                if (pageSelector.itemCount > 0) {
                    pageSelector.selectedIndex = 0
                    onPageSelected()
                }
            }
        }
    }
    
    /**
     * 页面选择变化
     */
    private fun onPageSelected() {
        val pageName = pageSelector.selectedItem as? String ?: return
        if (pageName.startsWith("(")) return // 跳过提示信息
        
        val device = deviceSelector.selectedItem as DeviceConfig
        browserPanel.loadPage(pageName, device)
        statusLabel.text = "Loading page: $pageName"
    }
    
    /**
     * 设备选择变化
     */
    private fun onDeviceChanged() {
        onPageSelected() // 重新加载
    }
    
    /**
     * 刷新按钮点击
     */
    private fun onRefresh() {
        browserPanel.reload()
        statusLabel.text = "Refreshing..."
    }
}

/**
 * 设备配置
 */
data class DeviceConfig(
    val name: String,
    val width: Int,
    val height: Int
) {
    companion object {
        val PHONE_SMALL = DeviceConfig("手机 (小)", 360, 640)
        val PHONE_MEDIUM = DeviceConfig("手机 (中)", 390, 844)
        val PHONE_LARGE = DeviceConfig("手机 (大)", 414, 896)
        val TABLET_7 = DeviceConfig("平板 7\"", 600, 960)
        val TABLET_10 = DeviceConfig("平板 10\"", 800, 1280)
        
        fun getAllDevices() = listOf(
            PHONE_SMALL,
            PHONE_MEDIUM,
            PHONE_LARGE,
            TABLET_7,
            TABLET_10
        )
    }
}
```

## 4. 项目结构

```
kuikly-idea-plugin/
├── build.gradle.kts
├── src/
│   └── main/
│       ├── kotlin/
│       │   └── com/tencent/kuikly/plugin/
│       │       ├── KuiklyPlugin.kt                  # Plugin 入口
│       │       ├── ui/
│       │       │   ├── KuiklyPreviewToolWindow.kt   # 工具窗口
│       │       │   ├── KuiklyBrowserPanel.kt        # JCEF 浏览器
│       │       │   └── DeviceConfig.kt              # 设备配置
│       │       ├── server/
│       │       │   └── KuiklyDevServer.kt           # HTTP + WebSocket 服务器
│       │       ├── watcher/
│       │       │   └── KuiklyFileWatcher.kt         # 文件监听
│       │       ├── compiler/
│       │       │   └── KotlinJsCompiler.kt          # Kotlin -> JS 编译
│       │       ├── scanner/
│       │       │   └── PageScanner.kt               # @Page 扫描
│       │       └── actions/
│       │           ├── OpenPreviewAction.kt         # 打开预览
│       │           └── RefreshPreviewAction.kt      # 刷新预览
│       └── resources/
│           ├── META-INF/
│           │   └── plugin.xml                       # Plugin 配置
│           └── icons/
│               └── kuikly.svg                       # 图标
├── README.md
└── CHANGELOG.md
```

## 5. 构建配置

### 5.1 build.gradle.kts

```kotlin
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij") version "1.17.4"
}

group = "com.tencent.kuikly"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    
    // Ktor Server (嵌入式 HTTP + WebSocket)
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-websockets:2.3.7")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-swing:1.7.3")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
}

intellij {
    version.set("2024.2")
    type.set("IC") // IntelliJ IDEA Community
    plugins.set(listOf("org.jetbrains.kotlin"))
    
    // 启用 JCEF
    downloadSources.set(true)
}

tasks {
    patchPluginXml {
        sinceBuild.set("232")
        untilBuild.set("242.*")
        
        changeNotes.set("""
            <h3>1.0.0</h3>
            <ul>
                <li>Initial release</li>
                <li>Real-time preview for Kuikly pages</li>
                <li>Hot reload support</li>
                <li>Multiple device sizes</li>
                <li>Chrome DevTools integration</li>
            </ul>
        """.trimIndent())
    }
    
    runIde {
        jvmArgs = listOf(
            "-Xmx2048m",
            "-Djdk.module.illegalAccess.silent=true"
        )
    }
    
    buildSearchableOptions {
        enabled = false // 加快构建速度
    }
}
```

## 6. 使用指南

### 6.1 首次设置

**步骤 1**: 构建 h5App
```bash
cd /path/to/KuiklyUI
./gradlew :h5App:jsBrowserDevelopmentWebpack
```

**步骤 2**: 安装 Plugin
```
IDEA -> File -> Settings -> Plugins -> ⚙️ -> Install Plugin from Disk
选择构建好的 kuikly-idea-plugin-1.0.0.zip
```

**步骤 3**: 重启 IDEA

### 6.2 日常使用

**打开预览窗口**:
```
View -> Tool Windows -> Kuikly Preview
或快捷键: Ctrl+Alt+P (Win/Linux) / Cmd+Option+P (Mac)
```

**选择页面**:
```
在预览窗口的 Page 下拉框中选择要预览的页面
```

**实时编码**:
```
1. 修改 Kotlin 代码
2. 保存文件 (Ctrl+S / Cmd+S)
3. 等待 2-3 秒（自动编译）
4. 预览窗口自动刷新 ✨
```

**调试**:
```
点击 "🔧 DevTools" 按钮打开 Chrome DevTools
可以查看 Console、Network、Elements 等
```

### 6.3 快捷键

| 功能 | Windows/Linux | Mac |
|------|--------------|-----|
| 打开预览 | Ctrl+Alt+P | Cmd+Option+P |
| 刷新预览 | Ctrl+Alt+R | Cmd+Option+R |
| 打开 DevTools | Ctrl+Alt+D | Cmd+Option+D |

## 7. 实施计划

### 阶段一：基础设施（1 周）
- [x] 项目脚手架搭建
- [ ] JCEF 浏览器集成
- [ ] 嵌入式 HTTP 服务器
- [ ] 基础 Tool Window UI

**里程碑**: 能够在 Plugin 中显示静态 HTML 页面

### 阶段二：预览功能（1-2 周）
- [ ] h5App 构建输出集成
- [ ] 页面扫描（@Page）
- [ ] 页面选择和加载
- [ ] 设备尺寸切换

**里程碑**: 能够在 Plugin 中预览 Kuikly 页面

### 阶段三：热重载（1-2 周）
- [ ] 文件监听器
- [ ] Gradle 增量编译集成
- [ ] WebSocket 通信
- [ ] 自动刷新

**里程碑**: 代码修改后自动刷新预览

### 阶段四：优化与发布（1 周）
- [ ] 性能优化（防抖、缓存）
- [ ] 错误处理和提示
- [ ] 用户文档
- [ ] 发布到 JetBrains Marketplace

**总计**: 4-6 周 🚀

## 8. 技术难点与解决方案

### 8.1 难点一：h5App 构建输出路径

**问题**: 不同的构建模式（development/production）输出路径不同

**解决方案**:
```kotlin
fun findH5AppOutput(): File {
    // 优先级：production > development
    val candidates = listOf(
        "h5App/build/dist/js/productionExecutable",
        "h5App/build/dist/js/developmentExecutable"
    )
    
    for (path in candidates) {
        val dir = File(project.basePath, path)
        if (dir.exists()) return dir
    }
    
    throw IllegalStateException("h5App not built")
}
```

### 8.2 难点二：Gradle 编译性能

**问题**: 每次修改都重新编译整个项目太慢

**解决方案**:
1. 使用 Gradle 的 `--continuous` 模式
2. 只编译 `h5App` 模块
3. 启用 Kotlin 编译缓存
4. 使用 `developmentExecutable`（无压缩）

```bash
./gradlew :h5App:jsBrowserDevelopmentWebpack --continuous
```

### 8.3 难点三：WebSocket 连接管理

**问题**: 页面刷新后 WebSocket 连接断开

**解决方案**:
```javascript
// 客户端自动重连
function connectWebSocket() {
    const ws = new WebSocket('ws://localhost:8765/ws/reload');
    
    ws.onclose = function() {
        console.log('Reconnecting in 3s...');
        setTimeout(connectWebSocket, 3000);
    };
    
    ws.onmessage = function(event) {
        if (event.data === 'reload') {
            location.reload();
        }
    };
}

connectWebSocket();
```

### 8.4 难点四：JCEF 兼容性

**问题**: 旧版本 IDEA 可能不支持 JCEF

**解决方案**:
```kotlin
// 检测 JCEF 可用性
if (!JBCefApp.isSupported()) {
    JOptionPane.showMessageDialog(
        null,
        "Kuikly Preview requires JCEF support.\n" +
        "Please upgrade to IDEA 2020.2 or later.",
        "Not Supported",
        JOptionPane.ERROR_MESSAGE
    )
    return
}
```

## 9. 优化建议

### 9.1 性能优化

**1. 编译缓存**
```bash
# gradle.properties
kotlin.incremental.js=true
kotlin.incremental.js.ir=true
```

**2. 并行编译**
```bash
# gradle.properties
org.gradle.parallel=true
org.gradle.caching=true
```

**3. 防抖优化**
```kotlin
// 避免频繁编译
private val debouncer = Debouncer(500L)

fun onFileChanged() {
    debouncer.debounce {
        compile()
    }
}
```

### 9.2 用户体验优化

**1. 编译进度提示**
```kotlin
statusLabel.text = "🔨 Compiling... (10s)"
progressBar.isIndeterminate = true
```

**2. 错误提示**
```kotlin
if (compilationFailed) {
    showErrorNotification(
        "Compilation Failed",
        errorMessage,
        NotificationType.ERROR
    )
}
```

**3. 首次使用引导**
```kotlin
if (isFirstTime) {
    showGettingStartedDialog()
}
```

## 10. 未来扩展

### 10.1 短期（3 个月）
- [ ] 支持 @HotPreview Composable 预览
- [ ] 支持多页面并排预览
- [ ] 支持横屏/竖屏切换
- [ ] 支持自定义设备尺寸
- [ ] 支持主题切换（亮色/暗色）

### 10.2 中期（6 个月）
- [ ] 点击预览定位代码
- [ ] 代码高亮对应 UI 元素
- [ ] 组件库可视化浏览
- [ ] 性能分析面板
- [ ] 截图和录制功能

### 10.3 长期（12 个月）
- [ ] AI 辅助 UI 生成
- [ ] 拖拽式可视化编辑
- [ ] 多人协同预览
- [ ] 云端预览（无需本地构建）
- [ ] 集成自动化测试

## 11. 对比总结

| 维度 | Web 渲染方案 ⭐ | Desktop 渲染方案 |
|------|--------------|---------------|
| **实现难度** | ⭐⭐ 简单 | ⭐⭐⭐⭐⭐ 复杂 |
| **开发周期** | 4-6 周 | 9-14 周 |
| **新增模块** | 0 | 1 (core-render-desktop) |
| **DSL 转换** | 不需要 | 需要实现 |
| **渲染真实性** | 100% 真实 | 需要适配 |
| **调试工具** | Chrome DevTools | 需要自己实现 |
| **热重载** | 简单（刷新浏览器） | 复杂（ClassLoader） |
| **性能** | 优秀（V8 引擎） | 依赖 JVM |
| **维护成本** | 低 | 高 |

**推荐**: **Web 渲染方案** 🎯

## 12. 快速开始

### 12.1 克隆 Plugin 项目
```bash
git clone https://github.com/tencent/kuikly-idea-plugin.git
cd kuikly-idea-plugin
```

### 12.2 构建 Plugin
```bash
./gradlew buildPlugin
```

### 12.3 运行 Plugin（开发模式）
```bash
./gradlew runIde
```

### 12.4 安装 Plugin
```
构建产物: build/distributions/kuikly-idea-plugin-1.0.0.zip
安装: IDEA -> Settings -> Plugins -> ⚙️ -> Install Plugin from Disk
```

---

**文档维护者**: Kuikly 团队  
**创建时间**: 2025-10-01  
**文档版本**: v2.0 (Web Rendering)  

📧 联系我们: kuikly@tencent.com  
🌐 项目主页: https://kuikly.tds.qq.com
