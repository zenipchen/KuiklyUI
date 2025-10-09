package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.tencent.kuikly.core.IKuiklyCoreEntry
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.pager.Pager
// import com.tencent.kuikly.demo.pages.HelloWorldPage  // HelloWorldPage 是 internal 的，无法直接访问
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
                    
                    // 存储 renderView 实例到全局，供后续调用
                    window.desktopRenderView = renderView;
                    
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
                                
                                // 触发 HelloWorldPage 创建
                                setTimeout(function() {
                                    console.log('[Desktop Render] 🚀 开始创建 HelloWorldPage...');
                                    if (window.callKotlinMethod) {
                                        const result = window.callKotlinMethod(1, 'HelloWorldPage', null, null, null, null, null);
                                        console.log('[Desktop Render] 📄 HelloWorldPage 创建结果:', result);
                                        
                                        // 获取页面数据
                                        setTimeout(function() {
                                            console.log('[Desktop Render] 📊 获取页面数据...');
                                            const pageData = window.callKotlinMethod(2, 'HelloWorldPage', null, null, null, null, null);
                                            console.log('[Desktop Render] 📊 页面数据:', pageData);
                                        }, 100);
                                    }
                                }, 500);
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
                println("[Desktop Render] 📄 创建页面: $pageName")
                try {
                    // 使用反射创建 HelloWorldPage 实例
                    val helloWorldClass = Class.forName("com.tencent.kuikly.demo.pages.HelloWorldPage")
                    val page = helloWorldClass.newInstance() as Pager
                    pageInstances[pageName] = page
                    println("[Desktop Render] ✅ HelloWorldPage 创建成功")
                    page
                } catch (e: Exception) {
                    println("[Desktop Render] ❌ HelloWorldPage 创建失败: ${e.message}")
                    e.printStackTrace()
                    null
                }
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
                    
                    // 触发页面渲染
                    try {
                        val renderData = mapOf(
                            "type" to "renderPage",
                            "pageId" to pageName,
                            "pageName" to pageName,
                            "pageData" to mapOf(
                                "statusBarHeight" to 0,
                                "activityWidth" to 1200,
                                "activityHeight" to 800,
                                "param" to emptyMap<String, Any>()
                            ),
                            "width" to 1200,
                            "height" to 800
                        )
                        
                        // 通知 JS 端开始渲染
                        callNative(1, gson.toJson(renderData), null, null, null, null, null)
                        "OK"
                    } catch (e: Exception) {
                        println("[Desktop Render] ❌ 页面渲染失败: ${e.message}")
                        e.printStackTrace()
                        "ERROR: Render failed"
                    }
                } else {
                    println("[Desktop Render] ❌ 页面创建失败: $pageName")
                    "ERROR: Page creation failed"
                }
            }
            2 -> {
                // 获取页面数据
                val pageName = arg0 as? String ?: "HelloWorldPage"
                val page = pageInstances[pageName]
                if (page != null) {
                    try {
                        // 获取页面的渲染数据
                        val event = page.createEvent()
                        val viewBuilder = page.body()
                        
                        // 这里应该将 ViewBuilder 转换为渲染数据
                        // 暂时返回 HelloWorldPage 的富文本数据
                        val richTextData = mapOf(
                            "type" to "RichText",
                            "attr" to mapOf(
                                "marginTop" to 30.0,
                                "lines" to 3,
                                "textOverFlowTail" to true,
                                "color" to "#000000",
                                "fontSize" to 16.0
                            ),
                            "children" to listOf(
                                mapOf(
                                    "type" to "Span",
                                    "text" to "我是第一个文本我是第一个文本"
                                ),
                                mapOf(
                                    "type" to "Span",
                                    "color" to "#FF0000",
                                    "fontSize" to 16.0,
                                    "text" to "这是第二个文本",
                                    "fontWeightBold" to true,
                                    "textDecorationLineThrough" to true
                                ),
                                mapOf(
                                    "type" to "Span",
                                    "color" to "#FF0000",
                                    "fontSize" to 16.0,
                                    "text" to "这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个这是第三个文这是第三个",
                                    "fontWeightMedium" to true,
                                    "fontStyleItalic" to true,
                                    "textDecorationUnderLine" to true
                                )
                            )
                        )
                        
                        gson.toJson(richTextData)
                    } catch (e: Exception) {
                        println("[Desktop Render] ❌ 获取页面数据失败: ${e.message}")
                        e.printStackTrace()
                        "ERROR: Failed to get page data"
                    }
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
            console.log('[Desktop Render] 🌐 执行 callNative: methodId=$methodId');
            
            // 优先使用 desktopRenderView 实例
            if (window.desktopRenderView && typeof window.desktopRenderView.sendEvent === 'function') {
                console.log('[Desktop Render] ✅ 使用 desktopRenderView 发送事件');
                
                // 解析参数
                var eventData = null;
                try {
                    if (arg0) {
                        eventData = JSON.parse(arg0);
                    }
                } catch (e) {
                    console.warn('[Desktop Render] ⚠️ 无法解析事件数据:', e);
                }
                
                // 发送事件到 JS 渲染层
                if (eventData && eventData.type) {
                    window.desktopRenderView.sendEvent(eventData.type, eventData);
                }
            } else if (typeof window.desktopCallNativeCallback === 'function') {
                console.log('[Desktop Render] ✅ 使用 desktopCallNativeCallback');
                window.desktopCallNativeCallback($methodId, $arg0, $arg1, $arg2, $arg3, $arg4, $arg5);
            } else {
                console.warn('[Desktop Render] ⚠️ callNative 回调未注册，desktopRenderView 不可用');
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
