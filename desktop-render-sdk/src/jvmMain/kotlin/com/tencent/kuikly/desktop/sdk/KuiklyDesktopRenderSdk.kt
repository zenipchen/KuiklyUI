@file:OptIn(ExperimentalAtomicApi::class)

package com.tencent.kuikly.desktop.sdk

import com.google.gson.Gson
import com.tencent.kuikly.compose.animation.Animatable
import com.tencent.kuikly.core.IKuiklyCoreEntry
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.nvi.NativeBridge
import java.io.File
import java.io.FileWriter
import java.io.InputStream
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference
import kotlin.concurrent.atomics.AtomicLong
import kotlin.concurrent.atomics.ExperimentalAtomicApi
import kotlin.concurrent.atomics.incrementAndFetch

/**
 * Kuikly 桌面渲染 SDK
 * 
 * 这是一个完全自包含的桌面渲染 SDK，支持将 Kuikly 页面渲染到桌面应用中。
 * SDK 内部包含所有必要的 HTML 和 JavaScript 资源，无需外部文件依赖。
 * 
 * 主要特性：
 * - 完全自包含：所有资源都内嵌在 SDK 中
 * - 抽象接口设计：不直接依赖 CEF 具体类型
 * - 运行时资源管理：动态生成 HTML 文件到临时目录
 * - 线程安全：内部使用线程池处理异步任务
 * - 灵活的类加载：支持外部传入 ClassLoader
 * 
 * @param pageName 页面名称，用于标识不同的渲染实例
 * @param classLoader 用于加载 KuiklyCoreEntry 的 ClassLoader，如果为 null 则使用默认的 Class.forName
 * 
 * @author Kuikly Team
 * @version 1.0.0
 */
class KuiklyDesktopRenderSdk(
    private val pageName: String = "Unknown",
    private val classLoader: ClassLoader? = null
) : IKuiklyCoreEntry.Delegate {
    
    /**
     * 浏览器抽象接口
     * 
     * 用于抽象浏览器操作，避免直接依赖 CEF 具体类型。
     * 支持适配器模式，可以轻松扩展到其他浏览器引擎。
     */
    interface Browser {
        /**
         * 执行 JavaScript 代码
         * 
         * @param script JavaScript 代码
         * @param scriptUrl 脚本 URL（用于调试）
         * @param startLine 起始行号（用于调试）
         */
        fun executeJavaScript(script: String, scriptUrl: String, startLine: Int)
    }
    
    /**
     * 查询回调抽象接口
     * 
     * 用于处理来自 Web 的查询请求，避免直接依赖 CEF 具体类型。
     */
    interface QueryCallback {
        /**
         * 成功回调
         * 
         * @param response 响应内容
         */
        fun success(response: String)
        
        /**
         * 失败回调
         * 
         * @param errorCode 错误代码
         * @param errorMessage 错误消息
         */
        fun failure(errorCode: Int, errorMessage: String)
    }
    
    // 私有字段
    private var browser: Browser? = null
    private val gson = Gson()
    private val kuiklyCoreEntry = newKuiklyCoreEntryInstance(classLoader)
    private val instanceId: String = instanceIdProducer++.toString()
    
    // NativeBridge 用于 Pager 调用 callNative
    private val nativeBridge = NativeBridge()
    
    // 用于执行 callKotlinMethod 的线程池

    private val waitingCallNativeResults = mutableMapOf<String, Pair<CountDownLatch, AtomicReference<String?>>>()

    var onFirstFramePaintCallback: Runnable ?= null

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
                println("[Kuikly Desktop][$pageName] 🌉 NativeBridge.callNative 被调用: methodId=$methodId, arg0=$arg0")
                return this@KuiklyDesktopRenderSdk.callNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
            }
        }
        BridgeManager.registerNativeBridge(instanceId, nativeBridge)
        println("[Kuikly Desktop][$pageName] ✅ NativeBridge 已注册 ${instanceId}")
    }
    
    /**
     * 设置浏览器实例
     * 
     * @param browser 浏览器适配器实例
     */
    fun setBrowser(browser: Browser) {
        this.browser = browser
    }

    /**
     * 处理来自 JS 的调用
     * 
     * 将任务提交到独立线程执行，避免阻塞 CEF UI 线程。
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
        // 将任务提交到独立线程执行，避免阻塞 CEF UI 线程
        kotlinMethodExecutor.submit {
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
                println("[Kuikly Desktop][$pageName] ❌ callKotlinMethod 异常: ${t.message}")
                t.printStackTrace()
                // TODO: 实现异常通知机制，类似 Android 的 notifyException(t, ErrorReason.CALL_KOTLIN)
            }
        }
    }
    
    /**
     * 处理来自 JVM 的调用
     * 
     * 使用同步轮询机制确保 JavaScript 真正执行完成并返回结果。
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
            println("[Kuikly Desktop] ❌ browser 为 null，无法调用 JS")
            return null
        }

        // 生成唯一的请求 ID
        val requestIdLong = requestIdProducer.incrementAndFetch()
        if (requestIdLong > (Long.MAX_VALUE - 2)) {
            requestIdProducer = AtomicLong(0L)
        }

        val requestId = requestIdLong.toString()

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
                var result = window.callNative($methodId, ${arg0.toJsString()}, ${arg1.toJsString()}, ${arg2.toJsString()}, ${arg3.toJsString()}, ${arg4.toJsString()}, ${arg5.toJsString()});
                window.cefQuerySendResult('${requestId}', result);
            })();
        """.trimIndent()

        // println("[Kuikly Desktop] 🌐 正在执行 callNative: wait=${waitingCallNativeResults.hashCode()} methodId=$methodId, arg0=$arg0, requestId=$requestId instanceId=${instanceId}" )

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
            println("[Kuikly Desktop] ❌ JavaScript 执行失败: ${e.message}")
            e.printStackTrace()
        } finally {

        }

        // 使用轮询机制等待结果，避免阻塞 CEF UI 线程
        var attempts = 0
        val maxAttempts = Integer.MAX_VALUE // 5秒超时，每100ms检查一次


        while (attempts < maxAttempts) {
            val result = resultRef.get()
            if (result != null) {
                // 清理等待记录
                synchronized(waitingCallNativeResults) {
                    waitingCallNativeResults.remove(requestId)
                }

                // println("[Kuikly Desktop] ✅ callNative 执行完成，结果: $result ${requestId} ${instanceId}")
                return result
            }
            attempts++
        }

        // 清理等待记录
        synchronized(waitingCallNativeResults) {
            waitingCallNativeResults.remove(requestId)
        }

        println("[Kuikly Desktop] ⚠️ callNative 执行超时，返回空字符串 ${requestId} ${attempts} ${instanceId}")
        return ""
    }

    /**
     * 处理 CEF 查询
     *
     * @param browser 浏览器实例
     * @param frame 框架实例
     * @param requestId 请求 ID
     * @param request 请求内容
     * @param persistent 是否持久化
     * @param callback 回调接口
     * @return 是否处理成功
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
            // 检查请求是否为空或无效
            if (request.isBlank() || request == "null") {
                println("[Kuikly Desktop] ⚠️ 收到空请求")
                callback?.failure(-1, "Empty request")
                return true
            }

            val requestData = gson.fromJson(request, com.google.gson.JsonObject::class.java)
            val type = requestData.get("type")?.asString

            when (type) {
                "callKotlinMethod" -> {
                    val methodId = requestData.get("methodId")?.asInt ?: 0
                    val args = requestData.getAsJsonArray("args")

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
                    println("[Kuikly Desktop] 🎉 JS 渲染层已就绪！")
                    callback?.success("OK")
                    return true
                }
                "callNativeResult" -> {
                    val requestId = requestData.get("requestId")?.asString
                    val result = requestData.get("result")?.asString
                    // println("[Kuikly Desktop] 📨 收到 callNative 结果: requestId=$requestId, result=$result")

                    // 将结果传递给等待的线程
                    if (requestId != null) {
                        synchronized(waitingCallNativeResults) {
                            val waitingResult = waitingCallNativeResults[requestId]
                            if (waitingResult != null) {
                                val (_, resultRef) = waitingResult // 不再使用 latch
                                resultRef.set(result ?: "")
                                // println("[Kuikly Desktop] ✅ callNative 结果已传递给等待线程: requestId=$requestId, result=$result ${instanceId}")
                            } else {
                                println("[Kuikly Desktop] ⚠️ 未找到对应的等待线程: requestId=$requestId ${instanceId}")
                            }
                        }
                    }

                    callback?.success("OK")
                    return true
                }
                "onFirstFramePaint" -> {
                    onFirstFramePaintCallback?.run()
                    callback?.success("OK")
                    return true;
                }
                else -> {
                    println("[Kuikly Desktop] ⚠️ 未知请求类型: $type")
                    callback?.failure(-1, "Unknown request type: $type")
                    return true
                }
            }
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 处理 CEF 查询失败: ${e.message}")
            e.printStackTrace()
            callback?.failure(-1, e.message ?: "Internal error")
            return true
        }
    }

    /**
     * 生成 HTML 文件到临时目录
     * 
     * 从 resources 加载 HTML 和 JavaScript 资源，动态生成完整的 HTML 文件。
     * 
     * @return 生成的 HTML 文件路径
     */
    fun generateHtmlFile(): String {
        val tempDir = System.getProperty("java.io.tmpdir")
        val tempFile = File(tempDir, "kuikly-desktop-${instanceId}.html")
        
        try {
            // 从 resources 加载 HTML 模板
            val htmlResourcePath = "/com/tencent/kuikly/desktop/sdk/desktop-render.html"
            val htmlInputStream: InputStream? = javaClass.getResourceAsStream(htmlResourcePath)
            
            if (htmlInputStream == null) {
                throw RuntimeException("无法找到 HTML 资源文件: $htmlResourcePath")
            }
            
            // 读取 HTML 内容
            val htmlContent = htmlInputStream.bufferedReader().use { it.readText() }
            
            // 从 resources 加载 JavaScript 文件
            val jsResourcePath = "/com/tencent/kuikly/desktop/sdk/desktopRenderLayer.js"
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
            
            println("[Kuikly Desktop] ✅ HTML 文件已生成: ${tempFile.absolutePath}")
            return tempFile.absolutePath
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 生成 HTML 文件失败: ${e.message}")
            throw e
        }
    }
    
    /**
     * 获取当前实例的 instanceId
     * 
     * @return 实例 ID
     */
    fun getInstanceId(): String = instanceId
    
    /**
     * 清理资源
     * 
     * 关闭线程池并清理相关资源。
     */
    fun destroy() {
        println("[Kuikly Desktop] 🧹 正在清理资源...")
        
        // 关闭 Kotlin 方法执行线程池
//        kotlinMethodExecutor.shutdown()
//        try {
//            if (!kotlinMethodExecutor.awaitTermination(3, TimeUnit.SECONDS)) {
//                kotlinMethodExecutor.shutdownNow()
//            }
//        } catch (e: InterruptedException) {
//            kotlinMethodExecutor.shutdownNow()
//        }
//
        println("[Kuikly Desktop] ✅ 资源清理完成")
    }
    
    companion object {

        val kotlinMethodExecutor = java.util.concurrent.Executors.newSingleThreadExecutor { r ->
            Thread(r, "KuiklyMethod-Executor").apply { isDaemon = true }
        }

        // 全局递增的 instanceIdProducer，确保每个实例都有唯一的 pageId
        private var instanceIdProducer = 0L

        private var requestIdProducer = AtomicLong(0L)

        fun newKuiklyCoreEntryInstance(classLoader: ClassLoader? = null): IKuiklyCoreEntry {
            val kuiklyClass = if (classLoader != null) {
                classLoader.loadClass("com.tencent.kuikly.core.android.KuiklyCoreEntry")
            } else {
                Class.forName("com.tencent.kuikly.core.android.KuiklyCoreEntry")
            }
            return kuiklyClass.newInstance() as IKuiklyCoreEntry
        }
        
        fun isPageExist(pageName: String, classLoader: ClassLoader? = null): Boolean {
            newKuiklyCoreEntryInstance(classLoader).triggerRegisterPages()
            return BridgeManager.isPageExist(pageName)
        }
    }
}
