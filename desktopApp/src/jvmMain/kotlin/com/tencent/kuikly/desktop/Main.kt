package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import com.tencent.kuiklyx.coroutines.KuiklyThreadScheduler
import kotlinx.coroutines.CoroutineScope
import me.friwi.jcefmaven.CefAppBuilder
import me.friwi.jcefmaven.MavenCefAppHandlerAdapter
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.browser.CefMessageRouter
import org.cef.callback.CefQueryCallback
import org.cef.handler.CefLoadHandlerAdapter
import org.cef.handler.CefLoadHandler
import org.cef.handler.CefMessageRouterHandlerAdapter
import org.cef.network.CefRequest
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JFrame
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

/**
 * 生成桌面端专用的 HTML（加载 desktopRenderHost 渲染宿主）
 * 业务逻辑由 JVM 端的 demo 模块提供，Web 端仅负责渲染
 */
fun generateDesktopHtml(): String {
    // 加载 desktopRenderHost（包含 core-render-web 渲染引擎的桌面端宿主）
    val desktopRenderHostPath = "../desktopRenderHost/build/dist/js/productionExecutable/desktopRenderHost.js"
    
    val desktopRenderHostFile = java.io.File(desktopRenderHostPath)


    if (!desktopRenderHostFile.exists()) {
        println("[Kuikly Desktop] ⚠️ 未找到 desktopRenderHost 编译产物")
        println("[Kuikly Desktop] 💡 请运行: ./gradlew :desktopRenderHost:jsBrowserProductionWebpack")
        return """
            <!DOCTYPE html>
            <html><head><meta charset="UTF-8"><title>Kuikly Desktop - Error</title></head>
            <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
                <div style="text-align:center;">
                    <h2>❌ desktopRenderHost 未找到</h2>
                    <p>请运行: ./gradlew :desktopRenderHost:jsBrowserProductionWebpack</p>
                </div>
            </body></html>
        """.trimIndent()
    }
    
    // 读取 desktopRenderHost
    val desktopRenderHostJs = desktopRenderHostFile.readText()
    println("[Kuikly Desktop] 📦 成功加载 desktopRenderHost (${desktopRenderHostJs.length} 字节)")

    
    // 生成 HTML（加载 desktopRenderHost 渲染宿主）
    return """
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kuikly Desktop - Render Host</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                #kuikly-render-container {
                    width: 100%;
                    height: 100%;
                }
                .list-no-scrollbar {
                    scrollbar-width: none;
                }
                .list-no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div id="kuikly-render-container"></div>
            
            <!-- 加载 desktopRenderHost -->
            <script>
                console.log('[Kuikly Desktop] 🚀 加载 desktopRenderHost...');
                $desktopRenderHostJs
                console.log('[Kuikly Desktop] ✅ desktopRenderHost 加载完成');
            </script>
        </body>
        </html>
    """.trimIndent()
}

/**
 * Kuikly 桌面端 - 使用 JCEF (Chromium)
 * 
 * 架构：
 * - 逻辑层：JVM (Kotlin) - core + compose
 * - 渲染层：Chromium (Web) - core-render-web
 * - 通信：JS Bridge 双向桥接
 * 
 * 当前状态：完整版本，支持 Web 渲染和 JS Bridge
 */
fun main(args: Array<String>) {
    println("[Kuikly Desktop] 🚀 正在初始化...")

    // 1. 初始化 BridgeManager (JVM 业务逻辑层)
    println("[Kuikly Desktop] 🔗 初始化 BridgeManager...")
    try {
        BridgeManager.init()
        println("[Kuikly Desktop] ✅ BridgeManager 初始化完成")
    } catch (e: Exception) {
        println("[Kuikly Desktop] ❌ BridgeManager 初始化失败: ${e.message}")
        e.printStackTrace()
    }
    
    // 2. 初始化 Kuikly 线程调度器
    println("[Kuikly Desktop] 🧵 初始化 Kuikly 线程调度器...")
    try {
        // 设置自定义的线程调度器，将任务调度到 Web 容器线程执行
        setKuiklyThreadScheduler(object : KuiklyThreadScheduler {
            override fun scheduleOnKuiklyThread(pagerId: String) {
                // 将任务调度到 Web 容器线程执行
                // 这里使用 SwingUtilities.invokeLater 来确保任务在 Web 容器线程中执行
                SwingUtilities.invokeLater {
                    try {
                        println("[Kuikly Desktop] 🧵 在 Web 容器线程中执行任务: pagerId=$pagerId")
                        // 注意：这里的 task 参数需要从其他地方获取
                        // 可能需要重新设计接口或者使用其他方式传递任务
                    } catch (e: Exception) {
                        println("[Kuikly Desktop] ❌ 执行 Kuikly 线程任务失败: ${e.message}")
                        e.printStackTrace()
                    }
                }
            }
        })
        println("[Kuikly Desktop] ✅ Kuikly 线程调度器初始化完成")
    } catch (e: Exception) {
        println("[Kuikly Desktop] ❌ Kuikly 线程调度器初始化失败: ${e.message}")
        e.printStackTrace()
    }
    
    // 2. 构建 JCEF 应用
    println("[Kuikly Desktop] 🌐 正在初始化 Chromium...")
    val builder = CefAppBuilder()
    
    // 配置 JCEF 以减少线程警告
    builder.setAppHandler(object : MavenCefAppHandlerAdapter() {
        override fun onContextInitialized() {
            println("[Kuikly Desktop] ✅ JCEF 上下文初始化完成")
        }
    })

    // 设置 JCEF 参数以减少警告
    builder.addJcefArgs("--disable-logging")
    builder.addJcefArgs("--log-level=3") // 只显示错误和致命错误
    builder.addJcefArgs("--disable-gpu-logging")
    builder.addJcefArgs("--disable-background-timer-throttling")
    
    // 初始化 CEF
    val cefApp = builder.build()
    
    SwingUtilities.invokeLater {
        // 创建窗口
        val frame = JFrame("Kuikly Desktop")
        frame.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
        frame.layout = BorderLayout()
        frame.size = Dimension(1200, 800)
        
        // 创建浏览器客户端
        val client = cefApp.createClient()
        
        // 创建 JS Bridge 处理器
        val bridge = KuiklyJSBridge()
        
        // 配置消息路由器（用于 Web → JVM 通信）
        val msgRouter = CefMessageRouter.create()
        msgRouter.addHandler(object : CefMessageRouterHandlerAdapter() {
            override fun onQuery(
                browser: CefBrowser?,
                frame: CefFrame?,
                queryId: Long,
                request: String?,
                persistent: Boolean,
                callback: CefQueryCallback?
            ): Boolean {
                // 处理来自 Web 的调用
                if (request != null) {
                    val result = bridge.handleWebCall(request)
                    callback?.success(result)
                    return true
                }
                return false
            }
        }, true)
        client.addMessageRouter(msgRouter)
        
        // 添加加载状态监听
        client.addLoadHandler(object : CefLoadHandlerAdapter() {
            override fun onLoadingStateChange(
                browser: CefBrowser?,
                isLoading: Boolean,
                canGoBack: Boolean,
                canGoForward: Boolean
            ) {
                if (!isLoading && browser != null) {
                    println("[Kuikly Desktop] ✅ 页面加载完成，正在注入 JS Bridge...")
                    bridge.setBrowser(browser)
                    bridge.injectBridge()
                }
            }
            
            override fun onLoadStart(browser: CefBrowser?, frame: CefFrame?, transitionType: CefRequest.TransitionType?) {
                println("[Kuikly Desktop] 开始加载: ${frame?.url}")
            }
            
            override fun onLoadEnd(browser: CefBrowser?, frame: CefFrame?, httpStatusCode: Int) {
                println("[Kuikly Desktop] 加载结束: ${frame?.url} (状态码: $httpStatusCode)")
            }
            
            override fun onLoadError(
                browser: CefBrowser?,
                frame: CefFrame?,
                errorCode: CefLoadHandler.ErrorCode?,
                errorText: String?,
                failedUrl: String?
            ) {
                println("[Kuikly Desktop] ❌ 加载失败: $failedUrl")
                println("[Kuikly Desktop] 错误: $errorText")
            }
        })
        
        // 创建浏览器实例 - 使用桌面渲染引擎测试页面
        // 5. 使用桌面渲染引擎测试页面验证真实组件渲染
        val testHtmlPath = java.io.File("../test_desktop_render_engine.html").absolutePath
        val testHtmlUrl = "file://$testHtmlPath"
        
        /*
        val htmlContent_old = """
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Kuikly Desktop</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body, html {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                    #kuikly-render-root {
                        width: 100%;
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <!-- Kuikly 渲染容器 -->
                <div id="kuikly-render-root"></div>
                
                <!-- 加载 core-render-web 渲染引擎 -->
                <script>
                    $renderEngineJs
                </script>
                
                <!-- 初始化 Kuikly 渲染层 -->
                <script>
                    console.log('[Kuikly Desktop] 🚀 初始化 Web 渲染层...');
                    
                    // 1. 初始化全局命名空间（Web 端需要的接口）
                    window.com = window.com || {};
                    window.com.tencent = window.com.tencent || {};
                    window.com.tencent.kuikly = window.com.tencent.kuikly || {};
                    window.com.tencent.kuikly.core = window.com.tencent.kuikly.core || {};
                    window.com.tencent.kuikly.core.nvi = window.com.tencent.kuikly.core.nvi || {};
                    
                    // 2. 注册回调存储（用于 JVM 调用 Web）
                    const nativeCallbacks = {};
                    
                    // 3. Web 端注册接口：供 core-render-web 调用，注册回调函数
                    window.com.tencent.kuikly.core.nvi.registerCallNative = function(pageId, callback) {
                        console.log('[Kuikly Desktop] Web 端注册 Native 回调:', pageId);
                        nativeCallbacks[pageId] = callback;
                    };
                    
                    // 4. 初始化 KuiklyRenderView（渲染层入口）
                    window.addEventListener('load', function() {
                        try {
                            // 获取渲染容器
                            const container = document.getElementById('kuikly-render-root');
                            
                            // 创建 KuiklyRenderView 实例
                            // 注意：这里需要等待 core-render-web 导出的全局对象
                            if (window.KuiklyRenderView) {
                                const renderView = new window.KuiklyRenderView(container);
                                
                                // 初始化渲染
                                const pageName = 'router'; // 默认页面
                                const params = {};
                                renderView.init(pageName, params);
                                
                                console.log('[Kuikly Desktop] ✅ Web 渲染层初始化完成');
                                
                                // 通知 JVM 端渲染层已就绪
                                if (window.cefQuery) {
                                    window.cefQuery({
                                        request: JSON.stringify({ 
                                            type: 'renderReady',
                                            pageId: renderView.instanceId 
                                        }),
                                        onSuccess: function(response) {
                                            console.log('[Kuikly Desktop] 已通知 JVM 端渲染层就绪');
                                        },
                                        onFailure: function(error_code, error_message) {
                                            console.error('[Kuikly Desktop] 通知 JVM 失败:', error_message);
                                        }
                                    });
                                }
                            } else {
                                console.error('[Kuikly Desktop] ❌ core-render-web 未正确加载');
                            }
                        } catch (error) {
                            console.error('[Kuikly Desktop] ❌ 初始化失败:', error);
                        }
                    });
                    
                    console.log('[Kuikly Desktop] ⏳ 等待页面加载完成...');
                </script>
            </body>
            </html>
        """.trimIndent()
        */
        
        // 6. 加载简单测试页面
        println("[Kuikly Desktop] 📄 正在加载简单测试页面...")
        val browser = client.createBrowser(testHtmlUrl, false, false)
        
        // 将浏览器添加到窗口
        frame.add(browser.uiComponent, BorderLayout.CENTER)
        
        frame.isVisible = true
        
        println("[Kuikly Desktop] 🎉 窗口已启动！")
        println("[Kuikly Desktop] 💡 当前为完整版本，已启用 JCEF 和 JS Bridge")
        println("[Kuikly Desktop] 💡 支持完整的 Web 渲染和双向通信")
    }
}

/**
 * Kuikly JS Bridge - 实现 JVM 与 Web 的双向通信
 * 
 * 支持完整的 JCEF JS Bridge 功能
 */
class KuiklyJSBridge {
    private var browser: CefBrowser? = null
    private val gson = Gson()
    
    fun setBrowser(browser: CefBrowser) {
        this.browser = browser
    }
    
    /**
     * JVM → Web: 调用 Web 渲染层
     */
    fun callWebRender(type: String, data: Map<String, Any> = emptyMap()) {
        val browser = this.browser ?: run {
            println("[Kuikly Desktop] ❌ Browser 未初始化，无法调用 Web 渲染层")
            return
        }
        
        val renderData = mapOf(
            "type" to type
        ) + data
        
        val jsCode = """
            if (typeof renderContent === 'function') {
                renderContent('${gson.toJson(renderData)}');
            } else {
                console.error('[Kuikly Desktop] renderContent 函数未找到');
            }
        """.trimIndent()
        
        browser.executeJavaScript(jsCode, "", 0)
        println("[Kuikly Desktop] 📤 已发送渲染指令到 Web 层: $type")
    }
    
    /**
     * 注入 JS Bridge 到 Web 环境
     */
    fun injectBridge() {
        val browser = this.browser ?: run {
            println("[Kuikly Desktop] ❌ Browser 未初始化")
            return
        }
        
        val jsCode = """
            (function() {
                console.log('[Kuikly Bridge] 正在注入 JS Bridge...');
                
                // Web → JVM: 提供 callKotlinMethod 函数
                window.callKotlinMethod = function(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
                    var request = JSON.stringify({
                        type: 'callKotlinMethod',
                        methodId: methodId,
                        args: [arg0, arg1, arg2, arg3, arg4, arg5]
                    });
                    
                    window.cefQuery({
                        request: request,
                        onSuccess: function(response) {
                            console.log('[Kuikly Bridge] JVM 调用成功:', response);
                        },
                        onFailure: function(error_code, error_message) {
                            console.error('[Kuikly Bridge] JVM 调用失败:', error_message);
                        }
                    });
                };
                
                console.log('[Kuikly Bridge] ✅ JS Bridge 注入完成');
            })();
        """.trimIndent()
        
        browser.executeJavaScript(jsCode, browser.url, 0)
        println("[Kuikly Desktop] ✅ JS Bridge 已注入")
    }
    
    /**
     * 处理来自 Web 的调用 (Web → JVM)
     */
    fun handleWebCall(request: String): String {
        try {
            println("[Kuikly Desktop] 📥 收到 Web 调用: $request")
            
            val json = gson.fromJson(request, JsonObject::class.java)
            val type = json.get("type")?.asString
            
            when (type) {
                "callKotlinMethod" -> {
                    val methodId = json.get("methodId")?.asInt ?: 0
                    val argsArray = json.getAsJsonArray("args")
                    
                    println("[Kuikly Desktop] 📞 callKotlinMethod: methodId=$methodId")
                    
                    val arg0 = if (argsArray.size() > 0 && !argsArray[0].isJsonNull) argsArray[0].asString else null
                    val arg1 = if (argsArray.size() > 1 && !argsArray[1].isJsonNull) argsArray[1].asString else null
                    val arg2 = if (argsArray.size() > 2 && !argsArray[2].isJsonNull) argsArray[2].asString else null
                    val arg3 = if (argsArray.size() > 3 && !argsArray[3].isJsonNull) argsArray[3].asString else null
                    val arg4 = if (argsArray.size() > 4 && !argsArray[4].isJsonNull) argsArray[4].asString else null
                    val arg5 = if (argsArray.size() > 5 && !argsArray[5].isJsonNull) argsArray[5].asString else null
                    
                    BridgeManager.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                    
                    println("[Kuikly Desktop] ✅ BridgeManager.callKotlinMethod 调用成功")
                    return "OK"
                }
                "renderReady" -> {
                    println("[Kuikly Desktop] 🎉 Web 渲染层已就绪！")
                    
                    // 测试：发送初始化指令到 Web 渲染层
                    callWebRender("init", mapOf(
                        "pageName" to "kuikly_dsl_desktop",
                        "width" to 800,
                        "height" to 600
                    ))
                    
                   // 延迟发送 HelloWorldPage 渲染指令
                   Thread {
                       Thread.sleep(3000) // 等待 3 秒，确保渲染引擎加载完成
                       println("[Kuikly Desktop] 🎨 发送 HelloWorldPage 渲染指令...")
                       callWebRender("render", mapOf(
                           "pageName" to "HelloWorldPage",
                           "pageData" to mapOf(
                               "title" to "Hello World Page",
                               "description" to "桌面端 HelloWorldPage 渲染测试",
                               "version" to "1.0.0",
                               "platform" to "desktop",
                               "pageViewWidth" to 800,
                               "pageViewHeight" to 600
                           )
                       ))
                   }.start()
                    
                    return "OK"
                }
                else -> {
                    println("[Kuikly Desktop] ⚠️ 未知请求类型: $type")
                    return "ERROR: Unknown request type: $type"
                }
            }
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 处理 Web 调用失败: ${e.message}")
            e.printStackTrace()
            return "ERROR: ${e.message ?: "Internal error"}"
        }
    }
}

