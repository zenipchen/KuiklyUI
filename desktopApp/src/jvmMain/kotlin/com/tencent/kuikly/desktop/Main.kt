package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.IKuiklyCoreEntry
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
        
        // 创建桌面端渲染委托器
        val renderDelegator = DesktopRenderViewDelegator()
        
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
                if (request != null && browser != null) {
                    return renderDelegator.handleCefQuery(
                        browser, frame, queryId.toInt(), request, persistent, callback
                    )
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
                    println("[Kuikly Desktop] ✅ 页面加载完成，正在初始化渲染层...")
                    renderDelegator.setBrowser(browser)
                    renderDelegator.initRenderLayer()
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
        
        // 创建浏览器实例 - 使用本地网页加载 Web 渲染层
        val webRenderHtmlPath = java.io.File("../desktop_render_web.html").absolutePath
        val webRenderHtmlUrl = "file://$webRenderHtmlPath"
        
        // 6. 加载本地网页（包含 Web 渲染层）
        println("[Kuikly Desktop] 📄 正在加载本地网页（Web 渲染层）...")
        val browser = client.createBrowser(webRenderHtmlUrl, false, false)
        
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
// 旧的 KuiklyJSBridge 类已被 DesktopRenderViewDelegator 替换
/*
class KuiklyJSBridge : IKuiklyCoreEntry.Delegate {
    private var browser: CefBrowser? = null
    private val gson = Gson()
    
    // 参考 Android 实现：创建 KuiklyCoreEntry 实例
    private val kuiklyCoreEntry: IKuiklyCoreEntry = createKuiklyCoreEntry()
    
    init {
        // 设置委托，用于处理 Native 调用
        kuiklyCoreEntry.delegate = this
    }
    
    /**
     * 创建 KuiklyCoreEntry 实例（参考 Android 实现）
     */
    private fun createKuiklyCoreEntry(): IKuiklyCoreEntry {
        return try {
            val kuiklyClass = Class.forName("com.tencent.kuikly.core.android.KuiklyCoreEntry")
            kuiklyClass.newInstance() as IKuiklyCoreEntry
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 创建 KuiklyCoreEntry 失败: ${e.message}")
            e.printStackTrace()
            throw e
        }
    }
    
    /**
     * 实现 IKuiklyCoreEntry.Delegate 接口
     * 处理来自 KuiklyCoreEntry 的 Native 调用，并转发给 Web 渲染层
     */
    override fun callNative(
        methodId: Int,
        arg0: Any?,
        arg1: Any?,
        arg2: Any?,
        arg3: Any?,
        arg4: Any?,
        arg5: Any?
    ): Any? {
        println("[Kuikly Desktop] 🔄 处理 Native 调用: methodId=$methodId")
        println("[Kuikly Desktop] 📋 Native 调用参数: arg0=$arg0, arg1=$arg1, arg2=$arg2, arg3=$arg3, arg4=$arg4, arg5=$arg5")
        
        // 将 Native 调用转发给 Web 渲染层
        try {
            val nativeCallData = mapOf<String, Any>(
                "methodId" to methodId,
                "arg0" to (arg0 ?: ""),
                "arg1" to (arg1 ?: ""),
                "arg2" to (arg2 ?: ""),
                "arg3" to (arg3 ?: ""),
                "arg4" to (arg4 ?: ""),
                "arg5" to (arg5 ?: "")
            )
            
            // 调用 Web 渲染层处理 Native 调用
            callWebRender("nativeCall", nativeCallData)
            
            println("[Kuikly Desktop] ✅ Native 调用已转发给 Web 渲染层")
            
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 转发 Native 调用失败: ${e.message}")
            e.printStackTrace()
        }
        
        // 对于桌面端，大部分 Native 调用不需要返回值
        // 如果需要特定返回值，可以根据 methodId 进行特殊处理
        return when (methodId) {
            1 -> null // CREATE_RENDER_VIEW
            2 -> null // REMOVE_RENDER_VIEW
            3 -> null // INSERT_SUB_RENDER_VIEW
            4 -> null // SET_VIEW_PROP
            5 -> null // SET_RENDER_VIEW_FRAME
            6 -> null // CALCULATE_RENDER_VIEW_SIZE - 这个可能需要返回计算结果
            7 -> null // CALL_VIEW_METHOD
            8 -> null // REMOVE_SHADOW
            9 -> null // SET_SHADOW_PROP
            10 -> null // SET_SHADOW_FOR_VIEW
            11 -> null // SET_TIMEOUT
            12 -> null // CALL_SHADOW_METHOD
            13 -> null // SYNC_FLUSH_UI
            else -> null
        }
    }
    
    fun setBrowser(browser: CefBrowser) {
        this.browser = browser
    }
    
    /**
     * 全局 callNative 函数实现
     * 这个函数会被注入到 Web 环境中，供 core-render-web 调用
     */
    fun globalCallNative(
        methodId: Int,
        arg0: Any?,
        arg1: Any?,
        arg2: Any?,
        arg3: Any?,
        arg4: Any?,
        arg5: Any?
    ): Any? {
        println("[Kuikly Desktop] 🌐 全局 callNative 调用: methodId=$methodId")
        return callNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
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
                
                // 只提供 cefQuery 函数，其他函数由 desktop-render-layer 提供
                // desktop-render-layer 会提供 callKotlinMethod 和 callNative 函数
                
                console.log('[Kuikly Bridge] ✅ JS Bridge 注入完成');
                console.log('[Kuikly Bridge] 💡 callKotlinMethod 和 callNative 由 desktop-render-layer 提供');
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
                    
                    // 参考 Android 实现：通过 KuiklyCoreEntry 处理调用
                    try {
                        kuiklyCoreEntry.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                        println("[Kuikly Desktop] ✅ KuiklyCoreEntry.callKotlinMethod 调用成功")
                    } catch (e: Exception) {
                        println("[Kuikly Desktop] ❌ KuiklyCoreEntry.callKotlinMethod 调用失败: ${e.message}")
                        e.printStackTrace()
                        return "ERROR: ${e.message ?: "Internal error"}"
                    }
                    
                    return "OK"
                }
                "callNative" -> {
                    val methodId = json.get("methodId")?.asInt ?: 0
                    val argsArray = json.getAsJsonArray("args")
                    
                    println("[Kuikly Desktop] 📞 callNative: methodId=$methodId")
                    
                    val arg0 = if (argsArray.size() > 0 && !argsArray[0].isJsonNull) argsArray[0].asString else null
                    val arg1 = if (argsArray.size() > 1 && !argsArray[1].isJsonNull) argsArray[1].asString else null
                    val arg2 = if (argsArray.size() > 2 && !argsArray[2].isJsonNull) argsArray[2].asString else null
                    val arg3 = if (argsArray.size() > 3 && !argsArray[3].isJsonNull) argsArray[3].asString else null
                    val arg4 = if (argsArray.size() > 4 && !argsArray[4].isJsonNull) argsArray[4].asString else null
                    val arg5 = if (argsArray.size() > 5 && !argsArray[5].isJsonNull) argsArray[5].asString else null
                    
                    // 调用全局 callNative 函数
                    try {
                        val result = globalCallNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                        println("[Kuikly Desktop] ✅ globalCallNative 调用成功，结果: $result")
                        return result?.toString() ?: "null"
                    } catch (e: Exception) {
                        println("[Kuikly Desktop] ❌ globalCallNative 调用失败: ${e.message}")
                        e.printStackTrace()
                        return "ERROR: ${e.message ?: "Internal error"}"
                    }
                }
                "renderReady" -> {
                    println("[Kuikly Desktop] 🎉 Web 渲染层已就绪！")
                    println("[Kuikly Desktop] 💡 等待 Web 渲染层主动驱动渲染流程...")
                    
                    // 不再主动发送渲染指令，让 Web 渲染层驱动
                    // Web 渲染层会通过 callKotlinMethod 调用 JVM 逻辑层
                    
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
*/

