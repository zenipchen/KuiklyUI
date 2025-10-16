package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.tencent.kuikly.core.IKuiklyCoreEntry
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.nvi.NativeBridge
import java.io.File
import java.io.FileWriter
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference

/**
 * 浏览器抽象接口，用于替代 CEF 具体类型
 */
interface Browser {
    fun executeJavaScript(script: String, scriptUrl: String, startLine: Int)
}

/**
 * 查询回调抽象接口，用于替代 CEF 具体类型
 */
interface QueryCallback {
    fun success(response: String)
    fun failure(errorCode: Int, errorMessage: String)
}

/**
 * CEF 浏览器适配器，将 CefBrowser 适配为 Browser 接口
 */
class CefBrowserAdapter(private val cefBrowser: org.cef.browser.CefBrowser) : Browser {
    override fun executeJavaScript(script: String, scriptUrl: String, startLine: Int) {
        cefBrowser.executeJavaScript(script, scriptUrl, startLine)
    }
}

/**
 * CEF 查询回调适配器，将 CefQueryCallback 适配为 QueryCallback 接口
 */
class CefQueryCallbackAdapter(private val cefQueryCallback: org.cef.callback.CefQueryCallback) : QueryCallback {
    override fun success(response: String) {
        cefQueryCallback.success(response)
    }
    
    override fun failure(errorCode: Int, errorMessage: String) {
        cefQueryCallback.failure(errorCode, errorMessage)
    }
}

/**
 * 用于桌面渲染的 SDK，理论上不依赖任何 IDE 相关代码内。
 */
class DesktopRenderViewSdk(private val pageName: String = "Unknown") : IKuiklyCoreEntry.Delegate {
    private var browser: Browser? = null
    private val gson = Gson()
    private val kuiklyCoreEntry = newKuiklyCoreEntryInstance()
    private val instanceId: String = instanceIdProducer++.toString()
    
    companion object {

        private val kuiklyClass = Class.forName("com.tencent.kuikly.core.android.KuiklyCoreEntry")

        // 对齐 Android 的全局 pageId 分配机制
        // 全局递增的 instanceIdProducer，确保每个实例都有唯一的 pageId
        private var instanceIdProducer = 0L

        fun newKuiklyCoreEntryInstance(): IKuiklyCoreEntry {
            return kuiklyClass.newInstance() as IKuiklyCoreEntry
        }

        fun isPageExist(pageName: String): Boolean {
            newKuiklyCoreEntryInstance().triggerRegisterPages()
            return BridgeManager.isPageExist(pageName)
        }
    }

    // NativeBridge 用于 Pager 调用 callNative
    private val nativeBridge = NativeBridge()
    
    // 新增：用于执行 callKotlinMethod 的线程池
    private val kotlinMethodExecutor = java.util.concurrent.Executors.newSingleThreadExecutor { r ->
        Thread(r, "KotlinMethod-Executor").apply { isDaemon = true }
    }
    private val waitingCallNativeResults = mutableMapOf<String, Pair<CountDownLatch, AtomicReference<String?>>>()
    
    init {
        kuiklyCoreEntry.delegate = this
        // 确保页面注册被触发
        kuiklyCoreEntry.triggerRegisterPages()
        
        // 注册 NativeBridge，这样 Pager 才能调用 callNative
        nativeBridge.delegate = object : NativeBridge.NativeBridgeDelegate {
            override fun callNative(
                methodId: Int,
                arg0: Any?,
                arg1: Any?,
                arg2: Any?,
                arg3: Any?,
                arg4: Any?,
                arg5: Any?
            ): Any? {
                println("[Desktop Render][$pageName] 🌉 NativeBridge.callNative 被调用: methodId=$methodId, arg0=$arg0")
                return this@DesktopRenderViewSdk.callNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
            }
        }
        BridgeManager.registerNativeBridge(instanceId, nativeBridge)
        println("[Desktop Render][$pageName] ✅ NativeBridge 已注册")
    }
    
    /**
     * 设置浏览器实例
     */
    fun setBrowser(browser: Browser) {
        this.browser = browser
    }
    
    /**
     * 初始化渲染层
     */
    fun initRenderLayer() {
        val browser = this.browser ?: return
        
        // 注入 JS Bridge
        injectJSBridge(browser)
    }
    
    /**
     * 注入 JS Bridge
     */
    private fun injectJSBridge(browser: Browser) {
        val bridgeScript = """
            console.log('[Desktop Render] 🔗 注入 JS Bridge...');
            
            // 提供 callKotlinMethod 函数，供 JS 渲染层调用 JVM 逻辑层
            window.callKotlinMethod = function(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
                 // console.log('[Desktop Render] 📞 callKotlinMethod 调用: methodId=' + methodId);
                
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
            
            // 存储所有页面的 callNative 回调
            // key: pagerId, value: callNative function from KuiklyRenderContextHandler
            window.callNativeRegistry = window.callNativeRegistry || {};
            
            // 提供 callNative 函数，供 core 的 jsMain 使用
            // 这个函数会被 core 调用，需要根据当前的 pagerId 分发到对应的 KuiklyRenderContextHandler.callNative
            window.callNative = function(methodId, arg0, arg1, arg2, arg3, arg4, arg5) {
                // console.log('[Desktop Render] 🌐 callNative 被调用: methodId=' + methodId);
                // console.log('[Desktop Render] 🌐 callNative 参数: arg0=' + arg0 + ', arg1=' + arg1 + ', arg2=' + arg2);
                
                // 从 arg0 中提取 pageId（通常是 instanceId）
                // 根据 KuiklyRenderCore 的实现，第一个参数通常是 instanceId
                var pageId = arg0;
                
                //console.log('[Desktop Render] 🔍 查找 pageId=' + pageId + ' 的 callNative 回调');
                //console.log('[Desktop Render] 🔍 当前注册的 callNative 回调:', Object.keys(window.callNativeRegistry));
                //console.log('[Desktop Render] 🔍 注册表内容:', window.callNativeRegistry);
                
                // 查找对应的 callNative 回调（来自 KuiklyRenderContextHandler）
                var callback = window.callNativeRegistry[pageId];
//                console.log('[Desktop Render] 🔍 找到的 callback:', callback);
//                console.log('[Desktop Render] 🔍 callback 类型:', typeof callback);
                
//                if (callback) {
//                    console.log('[Desktop Render] ✅ 找到 pageId=' + pageId + ' 的 callNative 回调');
                    try {
                        var result = callback(methodId, arg0, arg1, arg2, arg3, arg4, arg5);
                        console.log('[Desktop Render] ✅ callNative 回调执行成功，结果:', result);
                        
                        // 确保返回值是字符串类型，避免返回 undefined
                        if (result === null || result === undefined) {
                            console.log('[Desktop Render] 🔧 回调返回 null/undefined，转换为空字符串');
                            return "";
                        } else if (typeof result === 'string') {
                            return result;
                        } else {
                            console.log('[Desktop Render] 🔧 回调返回非字符串类型，转换为字符串:', result);
                            return String(result);
                        }
                    } catch (e) {
                        console.error('[Desktop Render] ❌ callNative 回调执行失败:', e);
                        console.error('[Desktop Render] ❌ 错误堆栈:', e.stack);
                        return "";
                    }
//                } else {
//                    console.warn('[Desktop Render] ⚠️ 没有找到 pageId=' + pageId + ' 的 callNative 回调');
//                    console.warn('[Desktop Render] ⚠️ callback 值:', callback);
//                    console.warn('[Desktop Render] ⚠️ callback 类型:', typeof callback);
//                    return "";
//                }
            };
            
            // 注册 registerCallNative 函数，供 core-render-web 的 KuiklyRenderContextHandler 注册回调
            // 这个函数会在 KuiklyRenderContextHandler.init() 中被调用
            window.com = window.com || {};
            window.com.tencent = window.com.tencent || {};
            window.com.tencent.kuikly = window.com.tencent.kuikly || {};
            window.com.tencent.kuikly.core = window.com.tencent.kuikly.core || {};
            window.com.tencent.kuikly.core.nvi = window.com.tencent.kuikly.core.nvi || {};
            
            window.com.tencent.kuikly.core.nvi.registerCallNative = function(pagerId, callback) {
                console.log('[Desktop Render] 📝 注册 callNative 回调: pagerId=' + pagerId);
                console.log('[Desktop Render] 📝 回调函数类型:', typeof callback);
                
                // 将回调存储到注册表中，按 pagerId 分类
                // 这个 callback 实际上是 KuiklyRenderContextHandler::callNative
                window.callNativeRegistry[pagerId] = callback;
                
                //console.log('[Desktop Render] ✅ callNative 回调已注册到 registry，pagerId=' + pagerId);
                //console.log('[Desktop Render] 📋 当前注册的 pageId 列表:', Object.keys(window.callNativeRegistry));
            };
            
            console.log('[Desktop Render] ✅ JS Bridge 注入完成');
            console.log('[Desktop Render] ✅ callNative 函数已导出到 window');
            console.log('[Desktop Render] ✅ registerCallNative 函数已导出到 window.com.tencent.kuikly.core.nvi');
        """.trimIndent()
        
        browser.executeJavaScript(bridgeScript, "", 0)
    }
    
           /**
            * 处理来自 JS 的调用
            * 将任务提交到独立线程执行，避免阻塞 CEF UI 线程
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
//               println("[Desktop Render] 📞 处理 callKotlinMethod: methodId=$methodId")
//               println("[Desktop Render] 📞 callKotlinMethod 参数: arg0=$arg0, arg1=$arg1, arg2=$arg2, arg3=$arg3, arg4=$arg4, arg5=$arg5")
               
               // 将任务提交到独立线程执行，避免阻塞 CEF UI 线程
               kotlinMethodExecutor.submit {
                   try {
//                       println("[Desktop Render] 📞 在独立线程中开始调用 kuiklyCoreEntry.callKotlinMethod...")
                       // 直接委托给 KuiklyCoreEntry 处理，这是正确的架构
                       kuiklyCoreEntry.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
//                       println("[Desktop Render] 📞 kuiklyCoreEntry.callKotlinMethod 调用完成")
                   } catch (t: Throwable) {
                       // 这里catch的异常类型是故意设置成Throwable的，因为callKotlinMethod运行的是KTV业务代码
                       // 因此需要catch顶层的类型异常，保证能catch到业务异常.
                       // 在catch到异常后, debug包下抛出异常, release模式下打印error日志并且做上报
                       // 为啥不用Thread.UncaughtExceptionHandler来捕获线程异常：
                       // 使用UncaughtExceptionHandler来捕获的话，当异常发生时，KTV线程已经挂掉了，因此所有KTV页面都使用不了
                       // 使用try-catch的话，能保证KTV线程一直存活，KTV页面之间的异常不会影响到彼此
                       println("[Desktop Render][$pageName] ❌ callKotlinMethod 异常: ${t.message}")
                       t.printStackTrace()
                       // TODO: 实现异常通知机制，类似 Android 的 notifyException(t, ErrorReason.CALL_KOTLIN)
                   }
               }
               
//               println("[Desktop Render] 📞 callKotlinMethod 任务已提交到独立线程")
           }
    
           /**
            * 处理来自 JVM 的调用
            * 使用同步轮询机制确保 JavaScript 真正执行完成并返回结果
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
               val browser = this.browser ?: run {
                   println("[Desktop Render] ❌ browser 为 null，无法调用 JS")
                   return null
               }
               
               // 生成唯一的请求 ID
               val requestId = System.currentTimeMillis().toString()
               
               // 将 Kotlin 参数转换为 JavaScript 字符串表示
               fun Any?.toJsString(): String = when (this) {
                   null -> "null"
                   is String -> "'${this.replace("'", "\\'")}'" // 确保字符串被正确引用和转义
                   is Number -> this.toString()
                   is Boolean -> this.toString()
                   else -> "'${this.toString().replace("'", "\\'")}'" // 默认转换为字符串
               }
               
               // 构建 JavaScript 代码，通过 cefQuery 返回结果
               val jsCode = """
                   (function(){
                       // console.log('[Desktop Render] 🌐 开始执行 callNative: methodId=$methodId, requestId=$requestId');

                       var result = window.callNative($methodId, ${arg0.toJsString()}, ${arg1.toJsString()}, ${arg2.toJsString()}, ${arg3.toJsString()}, ${arg4.toJsString()}, ${arg5.toJsString()});
                       //console.log('[Desktop Render] ✅ window.callNative 执行完成，返回值:', result);
                       
                       // 确保返回值是字符串类型
                       var finalResult = "";
                       if (result === null || result === undefined) {
                           finalResult = "";
                       } else if (typeof result === 'string') {
                           finalResult = result;
                       } else {
                           finalResult = String(result);
                       }
                       
                       // 通过 cefQuery 返回结果
                       if (window.cefQuery) {
                           window.cefQuery({
                               request: JSON.stringify({
                                   type: 'callNativeResult',
                                   requestId: '$requestId',
                                   result: finalResult
                               }),
                               onSuccess: function(response) {
                                   //console.log('[Desktop Render] ✅ callNative 结果已返回: requestId=$requestId, result=' + finalResult);
                               },
                               onFailure: function(error_code, error_message) {
                                   console.error('[Desktop Render] ❌ callNative 结果返回失败:', error_message);
                               }
                           });
                       } else {
                           console.warn('[Desktop Render] ⚠️ cefQuery 未找到，无法返回结果');
                       }
                   })();
               """.trimIndent()

                println("[Desktop Render] 🌐 正在执行 callNative: methodId=$methodId, arg0=$arg0, requestId=$requestId")
               
               // 使用 CountDownLatch 等待结果
               val latch = CountDownLatch(1)
               val resultRef = AtomicReference<String?>(null)
               
               // 将等待线程存储到 Map 中
               synchronized(waitingCallNativeResults) {
                   waitingCallNativeResults[requestId] = Pair(latch, resultRef)
               }
               
               // 在独立的JavaScript执行线程中执行，避免阻塞 CEF UI线程
               try {
                   // 执行 JavaScript 代码
                   browser.executeJavaScript(jsCode, "", 0)
               } catch (e: Exception) {
                   println("[Desktop Render] ❌ JavaScript 执行失败: ${e.message}")
                   e.printStackTrace()
               } finally {

               }

                // 使用轮询机制等待结果，避免阻塞 CEF UI 线程
                var attempts = 0
                val maxAttempts = 50 // 5秒超时，每100ms检查一次
                
                while (attempts < maxAttempts) {
                    val result = resultRef.get()
                    if (result != null) {
                        // 清理等待记录
                        synchronized(waitingCallNativeResults) {
                            waitingCallNativeResults.remove(requestId)
                        }
                        println("[Desktop Render] ✅ callNative 执行完成，结果: $result ${requestId}")
                        return result
                    }

                    Thread.sleep(1) // 等待100ms
                    attempts++
                }

               // 清理等待记录
               synchronized(waitingCallNativeResults) {
                   waitingCallNativeResults.remove(requestId)
               }
                
                println("[Desktop Render] ⚠️ callNative 执行超时，返回空字符串 ${requestId}")
                return ""
           }
    
    /**
     * 处理 CEF 查询
     */
    fun handleCefQuery(
        browser: Browser,
        frame: Any?,
        requestId: Int,
        request: String,
        persistent: Boolean,
        callback: QueryCallback?
    ): Boolean {
        try {
            // println("[Desktop Render] 📨 收到 CEF 查询: $request")
            
            // 检查请求是否为空或无效
            if (request.isBlank() || request == "null") {
                println("[Desktop Render] ⚠️ 收到空请求")
                callback?.failure(-1, "Empty request")
                return true
            }
            
            val requestData = gson.fromJson(request, com.google.gson.JsonObject::class.java)
            val type = requestData.get("type")?.asString
            
            when (type) {
                "callKotlinMethod" -> {
                    val methodId = requestData.get("methodId")?.asInt ?: 0
                    val args = requestData.getAsJsonArray("args")
                    
                    // println("[Desktop Render] 📞 处理 callKotlinMethod: methodId=$methodId, argsCount=${args?.size() ?: 0}")
                    
                    // 安全地解析参数，处理 JsonNull
                    val safeArgs = mutableListOf<Any?>()
                    if (args != null) {
                        for (i in 0 until args.size()) {
                            val arg = args[i]
                            safeArgs.add(
                                when {
                                    arg.isJsonNull -> null
                                    arg.isJsonPrimitive -> {
                                        val primitive = arg.asJsonPrimitive
                                        when {
                                            primitive.isString -> primitive.asString
                                            primitive.isNumber -> primitive.asString // 保持为字符串
                                            primitive.isBoolean -> primitive.asString
                                            else -> primitive.asString
                                        }
                                    }
                                    else -> arg.toString()
                                }
                            )
                        }
                    }
                    
                    // callKotlinMethod 现在返回 Unit，不需要处理返回值
                    callKotlinMethod(
                        methodId,
                        safeArgs.getOrNull(0),
                        safeArgs.getOrNull(1),
                        safeArgs.getOrNull(2),
                        safeArgs.getOrNull(3),
                        safeArgs.getOrNull(4),
                        safeArgs.getOrNull(5)
                    )
                    
                    callback?.success("OK")
                    return true
                }
                       "renderReady" -> {
                           println("[Desktop Render] 🎉 JS 渲染层已就绪！")
                           callback?.success("OK")
                           return true
                       }
                       "callNativeResult" -> {
                           val requestId = requestData.get("requestId")?.asString
                           val result = requestData.get("result")?.asString
                           println("[Desktop Render] 📨 收到 callNative 结果: requestId=$requestId, result=$result")
                           
                           // 将结果传递给等待的线程
                           if (requestId != null) {
                               synchronized(waitingCallNativeResults) {
                                   val waitingResult = waitingCallNativeResults[requestId]
                                   if (waitingResult != null) {
                                       val (_, resultRef) = waitingResult // 不再使用 latch
                                       resultRef.set(result ?: "")
                                       println("[Desktop Render] ✅ callNative 结果已传递给等待线程: requestId=$requestId, result=$result")
                                   } else {
                                       println("[Desktop Render] ⚠️ 未找到对应的等待线程: requestId=$requestId")
                                   }
                               }
                           }
                           
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
            e.printStackTrace()
            callback?.failure(-1, e.message ?: "Internal error")
            return true
        }
    }
    
    /**
     * 生成 HTML 文件到临时目录
     */
    fun generateHtmlFile(): String {
        val tempDir = System.getProperty("java.io.tmpdir")
        val tempFile = File(tempDir, "kuikly-desktop-${instanceId}.html")
        
        try {
            // 从 resources 加载 HTML 模板
            val htmlResourcePath = "/com/tencent/kuikly/desktop/desktop-render.html"
            val htmlInputStream: InputStream? = javaClass.getResourceAsStream(htmlResourcePath)
            
            if (htmlInputStream == null) {
                throw RuntimeException("无法找到 HTML 资源文件: $htmlResourcePath")
            }
            
            // 读取 HTML 内容
            val htmlContent = htmlInputStream.bufferedReader().use { it.readText() }
            
            // 从 resources 加载 JavaScript 文件
            val jsResourcePath = "/com/tencent/kuikly/desktop/desktopRenderLayer.js"
            val jsInputStream: InputStream? = javaClass.getResourceAsStream(jsResourcePath)
            
            if (jsInputStream == null) {
                throw RuntimeException("无法找到 JavaScript 资源文件: $jsResourcePath")
            }
            
            // 读取 JavaScript 内容
            val jsContent = jsInputStream.bufferedReader().use { it.readText() }
            
            // 将 JavaScript 内容注入到 HTML 中
            val finalHtmlContent = htmlContent.replace(
                "<!-- desktopRenderLayer.js 将通过 DesktopRenderViewSdk 动态注入 -->",
                "<script>$jsContent</script>"
            )
            
            // 将最终内容写入临时文件
            FileWriter(tempFile).use { writer ->
                writer.write(finalHtmlContent)
            }
            
            println("[Desktop Render] ✅ HTML 文件已生成: ${tempFile.absolutePath}")
            return tempFile.absolutePath
        } catch (e: Exception) {
            println("[Desktop Render] ❌ 生成 HTML 文件失败: ${e.message}")
            throw e
        }
    }
    
    /**
     * 获取当前实例的 instanceId
     */
    fun getInstanceId(): String = instanceId
    
    /**
     * 清理资源
     */
    fun destroy() {
        println("[Desktop Render] 🧹 正在清理资源...")
        
        // 关闭 Kotlin 方法执行线程池
        kotlinMethodExecutor.shutdown()
        try {
            if (!kotlinMethodExecutor.awaitTermination(3, TimeUnit.SECONDS)) {
                kotlinMethodExecutor.shutdownNow()
            }
        } catch (e: InterruptedException) {
            kotlinMethodExecutor.shutdownNow()
        }
        
        println("[Desktop Render] ✅ 资源清理完成")
    }

}
