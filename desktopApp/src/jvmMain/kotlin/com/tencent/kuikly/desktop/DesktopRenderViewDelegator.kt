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
 * 参考 Android 的 KuiklyRenderJvmContextHandler 实现
 */
class DesktopRenderViewDelegator : IKuiklyCoreEntry.Delegate {
    
    private var browser: CefBrowser? = null
    private val gson = Gson()
    
    // 使用 KuiklyCoreEntry 处理 JVM 逻辑层调用
    private val kuiklyCoreEntry = newKuiklyCoreEntryInstance()
    
    // 页面实例管理
    private val pageInstances = mutableMapOf<String, Pager>()
    
    init {
        kuiklyCoreEntry.delegate = this
    }
    
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
     * 直接委托给 KuiklyCoreEntry 处理，就像 Android 的 KuiklyRenderJvmContextHandler
     */
    fun callKotlinMethod(
        methodId: Int,
        arg0: Any?,
        arg1: Any?,
        arg2: Any?,
        arg3: Any?,
        arg4: Any?,
        arg5: Any?
    ) {
        println("[Desktop Render] 📞 处理 callKotlinMethod: methodId=$methodId")
        
        try {
            // 直接委托给 KuiklyCoreEntry 处理，这是正确的架构
            kuiklyCoreEntry.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
        } catch (t: Throwable) {
            // 这里catch的异常类型是故意设置成Throwable的，因为callKotlinMethod运行的是KTV业务代码
            // 因此需要catch顶层的类型异常，保证能catch到业务异常.
            // 在catch到异常后, debug包下抛出异常, release模式下打印error日志并且做上报
            // 为啥不用Thread.UncaughtExceptionHandler来捕获线程异常：
            // 使用UncaughtExceptionHandler来捕获的话，当异常发生时，KTV线程已经挂掉了，因此所有KTV页面都使用不了
            // 使用try-catch的话，能保证KTV线程一直存活，KTV页面之间的异常不会影响到彼此
            println("[Desktop Render] ❌ callKotlinMethod 异常: ${t.message}")
            t.printStackTrace()
            // TODO: 实现异常通知机制，类似 Android 的 notifyException(t, ErrorReason.CALL_KOTLIN)
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
                    
                    // callKotlinMethod 现在返回 Unit，不需要处理返回值
                    callKotlinMethod(
                        methodId,
                        if (args.size() > 0) args[0].asString else null,
                        if (args.size() > 1) args[1].asString else null,
                        if (args.size() > 2) args[2].asString else null,
                        if (args.size() > 3) args[3].asString else null,
                        if (args.size() > 4) args[4].asString else null,
                        if (args.size() > 5) args[5].asString else null
                    )
                    
                    callback?.success("OK")
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
    
    companion object {
        
        private val kuiklyClass = Class.forName("com.tencent.kuikly.core.android.KuiklyCoreEntry")
        
        fun newKuiklyCoreEntryInstance(): IKuiklyCoreEntry {
            return kuiklyClass.newInstance() as IKuiklyCoreEntry
        }
        
        fun isPageExist(pageName: String): Boolean {
            newKuiklyCoreEntryInstance().triggerRegisterPages()
            return BridgeManager.isPageExist(pageName)
        }
    }
}
