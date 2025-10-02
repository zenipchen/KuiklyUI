package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.tencent.kuikly.core.manager.BridgeManager
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
 * Kuikly 桌面端 - 使用 JCEF (Chromium)
 * 
 * 架构：
 * - 逻辑层：JVM (Kotlin) - core + compose
 * - 渲染层：Chromium (Web) - desktopWebRender
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
    
    // 2. 构建 JCEF 应用
    println("[Kuikly Desktop] 🌐 正在初始化 Chromium...")
    val builder = CefAppBuilder()
    builder.setAppHandler(object : MavenCefAppHandlerAdapter() {})
    
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
        
        // 创建浏览器实例 - 使用 desktopWebRender 作为渲染层
        val url = "http://localhost:8080/desktopWebRender.html"
        println("[Kuikly Desktop] 正在加载桌面端 Web 渲染层: $url")
        println("[Kuikly Desktop] 💡 业务逻辑运行在 JVM 中，Web 层仅负责渲染")
        val browser = client.createBrowser(url, false, false)
        
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
                    
                    val arg0 = if (argsArray.size() > 0) argsArray[0]?.asString else null
                    val arg1 = if (argsArray.size() > 1) argsArray[1]?.asString else null
                    val arg2 = if (argsArray.size() > 2) argsArray[2]?.asString else null
                    val arg3 = if (argsArray.size() > 3) argsArray[3]?.asString else null
                    val arg4 = if (argsArray.size() > 4) argsArray[4]?.asString else null
                    val arg5 = if (argsArray.size() > 5) argsArray[5]?.asString else null
                    
                    BridgeManager.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                    
                    println("[Kuikly Desktop] ✅ BridgeManager.callKotlinMethod 调用成功")
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

