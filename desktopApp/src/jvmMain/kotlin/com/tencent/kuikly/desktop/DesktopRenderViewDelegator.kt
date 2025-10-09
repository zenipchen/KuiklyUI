package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.tencent.kuikly.core.IKuiklyCoreEntry
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.pager.Pager
// import com.tencent.kuikly.core.render.web.ktx.SizeI
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.callback.CefQueryCallback
import org.cef.handler.CefLoadHandlerAdapter
import org.cef.handler.CefMessageRouterHandlerAdapter
import org.cef.network.CefRequest

/**
 * 桌面端渲染视图委托器
 * 负责管理 JVM 逻辑层和 JS 渲染层之间的通信
 */
class DesktopRenderViewDelegator : IKuiklyCoreEntry.Delegate {
    
    private var browser: CefBrowser? = null
    private val gson = Gson()
    // private val bridgeManager = BridgeManager()
    
    // 页面实例管理
    private val pageInstances = mutableMapOf<String, Pager>()
    
    /**
     * 设置浏览器实例
     */
    fun setBrowser(browser: CefBrowser) {
        this.browser = browser
    }
    
    /**
     * 初始化渲染层
     */
    fun initRenderLayer() {
        val browser = this.browser ?: return
        
        // 注入 JS Bridge
        injectJSBridge(browser)
        
        // 初始化渲染容器
        val initScript = """
            console.log('[Desktop Render] 🚀 初始化渲染层...');
            
            // 检查 desktop-render-layer 是否已加载
            if (typeof window.createRenderViewDelegator === 'function') {
                console.log('[Desktop Render] ✅ desktop-render-layer 已加载');
                
                // 创建渲染视图委托器
                const renderView = window.createRenderViewDelegator();
                if (renderView) {
                    console.log('[Desktop Render] ✅ 渲染视图委托器创建成功');
                    
                    // 初始化渲染视图
                    const container = document.getElementById('kuikly-render-container');
                    const pageName = 'HelloWorldPage';
                    const pageData = {
                        statusBarHeight: 0,
                        activityWidth: window.innerWidth,
                        activityHeight: window.innerHeight,
                        param: {}
                    };
                    const size = [window.innerWidth, window.innerHeight];
                    
                    renderView.init(container, pageName, pageData, size);
                    renderView.resume();
                    
                    console.log('[Desktop Render] ✅ 渲染层初始化完成');
                    
                    // 通知 JVM 端渲染层已就绪
                    if (window.cefQuery) {
                        window.cefQuery({
                            request: JSON.stringify({
                                type: 'renderReady',
                                pageId: 'HelloWorldPage'
                            }),
                            onSuccess: function(response) {
                                console.log('[Desktop Render] ✅ 已通知 JVM 端渲染层就绪');
                            },
                            onFailure: function(error_code, error_message) {
                                console.error('[Desktop Render] ❌ 通知 JVM 失败:', error_message);
                            }
                        });
                    }
                } else {
                    console.error('[Desktop Render] ❌ 无法创建渲染视图委托器');
                }
            } else {
                console.error('[Desktop Render] ❌ desktop-render-layer 未加载');
            }
        """.trimIndent()
        
        browser.executeJavaScript(initScript, "", 0)
    }
    
    /**
     * 注入 JS Bridge
     */
    private fun injectJSBridge(browser: CefBrowser) {
        val bridgeScript = """
            console.log('[Desktop Render] 🔗 注入 JS Bridge...');
            
            // 提供 callKotlinMethod 函数，供 JS 渲染层调用 JVM 逻辑层
            window.callKotlinMethod = function(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
                console.log('[Desktop Render] 📞 callKotlinMethod 调用: methodId=' + methodId);
                
                // 通过 cefQuery 调用 JVM 逻辑层
                var result = null;
                var request = JSON.stringify({
                    type: 'callKotlinMethod',
                    methodId: methodId,
                    args: [arg0, arg1, arg2, arg3, arg4, arg5]
                });
                
                if (window.cefQuery) {
                    window.cefQuery({
                        request: request,
                        onSuccess: function(response) {
                            result = response;
                        },
                        onFailure: function(error_code, error_message) {
                            console.error('[Desktop Render] ❌ callKotlinMethod 调用失败:', error_message);
                            result = null;
                        }
                    });
                } else {
                    console.warn('[Desktop Render] ⚠️ cefQuery 未找到');
                }
                
                return result;
            };
            
            // 提供 callNative 函数，供 JVM 调用 JS 渲染层
            window.callNative = function(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
                console.log('[Desktop Render] 🌐 callNative 调用: methodId=' + methodId);
                
                // 这里应该调用 core-render-web 的 callNative 实现
                // 暂时返回 null，实际实现需要调用 core-render-web 的 callNative
                return null;
            };
            
            // 注册 registerCallNative 函数，供 core-render-web 注册回调
            window.com = window.com || {};
            window.com.tencent = window.com.tencent || {};
            window.com.tencent.kuikly = window.com.tencent.kuikly || {};
            window.com.tencent.kuikly.core = window.com.tencent.kuikly.core || {};
            window.com.tencent.kuikly.core.nvi = window.com.tencent.kuikly.core.nvi || {};
            
            window.com.tencent.kuikly.core.nvi.registerCallNative = function(pagerId, callback) {
                console.log('[Desktop Render] 📝 注册 callNative 回调: pagerId=' + pagerId);
                // 存储回调，用于后续的 callNative 调用
                window.desktopCallNativeCallback = callback;
            };
            
            console.log('[Desktop Render] ✅ JS Bridge 注入完成');
        """.trimIndent()
        
        browser.executeJavaScript(bridgeScript, "", 0)
    }
    
    /**
     * 创建页面实例
     */
    fun createPage(pageName: String): Pager? {
        return when (pageName) {
            "HelloWorldPage" -> {
                // 暂时返回 null，因为 HelloWorldPage 是 internal 的
                // 在实际应用中，这里应该通过反射或其他方式创建页面实例
                println("[Desktop Render] 📄 创建页面: $pageName")
                null
            }
            else -> {
                println("[Desktop Render] ❌ 未知页面: $pageName")
                null
            }
        }
    }
    
    /**
     * 处理来自 JS 的调用
     */
    fun callKotlinMethod(
        methodId: Int,
        arg0: Any?,
        arg1: Any?,
        arg2: Any?,
        arg3: Any?,
        arg4: Any?,
        arg5: Any?
    ): Any? {
        println("[Desktop Render] 📞 处理 callKotlinMethod: methodId=$methodId")
        
        return when (methodId) {
            1 -> {
                // 创建页面
                val pageName = arg0 as? String ?: "HelloWorldPage"
                val page = createPage(pageName)
                if (page != null) {
                    println("[Desktop Render] ✅ 页面创建成功: $pageName")
                    "OK"
                } else {
                    println("[Desktop Render] ❌ 页面创建失败: $pageName")
                    "ERROR"
                }
            }
            2 -> {
                // 获取页面数据
                val pageName = arg0 as? String ?: "HelloWorldPage"
                val page = pageInstances[pageName]
                if (page != null) {
                    // 这里应该返回页面的渲染数据
                    // 暂时返回简单的测试数据
                    val testData = mapOf(
                        "type" to "RichText",
                        "text" to "Hello World from Desktop!",
                        "color" to "#000000",
                        "fontSize" to 16
                    )
                    gson.toJson(testData)
                } else {
                    "ERROR: Page not found"
                }
            }
            else -> {
                println("[Desktop Render] ⚠️ 未知方法 ID: $methodId")
                "ERROR: Unknown method"
            }
        }
    }
    
    /**
     * 处理来自 JVM 的调用
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
        println("[Desktop Render] 🌐 处理 callNative: methodId=$methodId")
        
        val browser = this.browser ?: return null
        
        val jsCode = """
            if (typeof window.desktopCallNativeCallback === 'function') {
                window.desktopCallNativeCallback($methodId, $arg0, $arg1, $arg2, $arg3, $arg4, $arg5);
            } else {
                console.warn('[Desktop Render] ⚠️ callNative 回调未注册');
            }
        """.trimIndent()
        
        browser.executeJavaScript(jsCode, "", 0)
        return null
    }
    
    /**
     * 处理 CEF 查询
     */
    fun handleCefQuery(
        browser: CefBrowser,
        frame: CefFrame?,
        requestId: Int,
        request: String,
        persistent: Boolean,
        callback: CefQueryCallback?
    ): Boolean {
        try {
            val requestData = gson.fromJson(request, com.google.gson.JsonObject::class.java)
            val type = requestData.get("type")?.asString
            
            when (type) {
                "callKotlinMethod" -> {
                    val methodId = requestData.get("methodId")?.asInt ?: 0
                    val args = requestData.getAsJsonArray("args")
                    
                    val result = callKotlinMethod(
                        methodId,
                        if (args.size() > 0) args[0].asString else null,
                        if (args.size() > 1) args[1].asString else null,
                        if (args.size() > 2) args[2].asString else null,
                        if (args.size() > 3) args[3].asString else null,
                        if (args.size() > 4) args[4].asString else null,
                        if (args.size() > 5) args[5].asString else null
                    )
                    
                    callback?.success(result?.toString() ?: "null")
                    return true
                }
                "renderReady" -> {
                    println("[Desktop Render] 🎉 JS 渲染层已就绪！")
                    callback?.success("OK")
                    return true
                }
                else -> {
                    println("[Desktop Render] ⚠️ 未知请求类型: $type")
                    callback?.failure(-1, "Unknown request type: $type")
                    return true
                }
            }
        } catch (e: Exception) {
            println("[Desktop Render] ❌ 处理 CEF 查询失败: ${e.message}")
            callback?.failure(-1, e.message ?: "Internal error")
            return true
        }
    }
}
