package com.tencent.kuikly.plugin.server

import com.intellij.openapi.project.Project
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.content.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.ClosedSendChannelException
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
                // h5App.js 文件服务
                get("/h5App.js") {
                    val file = java.io.File(getH5AppBuildDir(), "h5App.js")
                    if (file.exists()) {
                        call.respondFile(file)
                    } else {
                        call.respond(HttpStatusCode.NotFound, "h5App.js not found")
                    }
                }
                
                // 主页面（支持预览参数）
                get("/") {
                    val html = generateIndexHtml()
                    call.respondText(html, contentType = ContentType.Text.Html)
                }
                
                get("/index.html") {
                    val pageName = call.parameters["page_name"] ?: "HelloWorldPage"
                    val width = call.parameters["width"]?.toIntOrNull() ?: 390
                    val height = call.parameters["height"]?.toIntOrNull() ?: 844
                    
                    val html = generatePreviewHtml(pageName, width, height)
                    call.respondText(html, contentType = ContentType.Text.Html)
                }
                
                // WebSocket 端点（用于热重载）
                webSocket("/ws/reload") {
                    wsConnections.add(this)
                    println("✅ WebSocket client connected (total: ${wsConnections.size})")
                    
                    try {
                        for (frame in incoming) {
                            // 保持连接，不需要处理消息
                        }
                    } catch (e: Exception) {
                        println("⚠️ WebSocket error: ${e.message}")
                    } finally {
                        wsConnections.remove(this)
                        println("🔌 WebSocket client disconnected (remaining: ${wsConnections.size})")
                    }
                }
                
                // 健康检查
                get("/health") {
                    call.respondText("OK")
                }
            }
        }.start(wait = false)
        
        println("🚀 Kuikly Dev Server started at http://localhost:$port")
    }
    
    /**
     * 停止服务器
     */
    fun stop() {
        try {
            server?.stop(1000, 2000)
            wsConnections.clear()
            println("⏹️ Kuikly Dev Server stopped")
        } catch (e: Exception) {
            println("⚠️ Error stopping server: ${e.message}")
        }
    }
    
    /**
     * 通知浏览器重新加载
     */
    suspend fun notifyReload() {
        val deadConnections = mutableSetOf<DefaultWebSocketSession>()
        
        wsConnections.forEach { session ->
            try {
                session.send(Frame.Text("reload"))
                println("📤 Reload notification sent")
            } catch (e: ClosedSendChannelException) {
                deadConnections.add(session)
            } catch (e: Exception) {
                println("⚠️ Failed to notify reload: ${e.message}")
                deadConnections.add(session)
            }
        }
        
        // 清理断开的连接
        wsConnections.removeAll(deadConnections)
    }
    
    /**
     * 获取 h5App 构建目录
     */
    private fun getH5AppBuildDir(): String {
        val basePath = project.basePath ?: throw IllegalStateException("Project basePath is null")
        
        // 优先使用 productionExecutable（优化过的）
        val productionDir = File(basePath, "h5App/build/dist/js/productionExecutable")
        if (productionDir.exists() && productionDir.isDirectory) {
            println("📁 Using production build: ${productionDir.absolutePath}")
            return productionDir.absolutePath
        }
        
        // 降级到 developmentExecutable
        val developmentDir = File(basePath, "h5App/build/dist/js/developmentExecutable")
        if (developmentDir.exists() && developmentDir.isDirectory) {
            println("📁 Using development build: ${developmentDir.absolutePath}")
            return developmentDir.absolutePath
        }
        
        throw IllegalStateException(
            "❌ h5App build output not found!\n" +
            "Please build the project first:\n" +
            "  ./gradlew :h5App:jsBrowserDevelopmentWebpack"
        )
    }
    
    /**
     * 生成基础 index.html
     */
    private fun generateIndexHtml(): String {
        return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Kuikly Preview</title>
</head>
<body>
    <h1>Kuikly Preview Server</h1>
    <p>Server is running on port $port</p>
    <p>Use the IDEA plugin to preview pages.</p>
</body>
</html>
        """.trimIndent()
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
        background: #f5f5f5;
        height: 100vh;
    }
    #preview-container {
        width: ${width}px;
        height: ${height}px;
        background: white;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        overflow: hidden;
        position: relative;
        border-radius: 8px;
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
        top: 16px;
        right: 16px;
        padding: 8px 16px;
        background: #4CAF50;
        color: white;
        border-radius: 4px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: none;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    /* 页面信息 */
    #page-info {
        position: fixed;
        top: 16px;
        left: 16px;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        z-index: 10000;
    }
</style>
<body>
    <div id="reload-indicator">🔄 正在重新加载...</div>
    <div id="page-info">📱 $pageName | ${width}×${height}</div>
    <div id="preview-container">
        <div id="root"></div>
    </div>
    
    <!-- Kuikly Web Render JS -->
    <script type="text/javascript" src="/h5App.js"></script>
    
    <!-- WebSocket 热重载客户端 -->
    <script>
        (function() {
            let ws = null;
            const indicator = document.getElementById('reload-indicator');
            
            function connect() {
                try {
                    ws = new WebSocket('ws://localhost:${port}/ws/reload');
                    
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
                        console.log('⚠️ Hot reload disconnected, reconnecting in 3s...');
                        setTimeout(connect, 3000);
                    };
                } catch (e) {
                    console.error('Failed to create WebSocket:', e);
                    setTimeout(connect, 3000);
                }
            }
            
            connect();
        })();
    </script>
</body>
</html>
        """.trimIndent()
    }
}

