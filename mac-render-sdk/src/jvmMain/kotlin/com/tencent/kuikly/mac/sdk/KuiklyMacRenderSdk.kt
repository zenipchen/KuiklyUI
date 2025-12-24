@file:OptIn(ExperimentalAtomicApi::class)

package com.tencent.kuikly.mac.sdk

import com.google.gson.Gson
import com.tencent.kuikly.core.IKuiklyCoreEntry
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.nvi.NativeBridge
import com.tencent.kuikly.mac.sdk.transport.Transport
import com.tencent.kuikly.mac.sdk.transport.TcpTransport
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.concurrent.atomics.AtomicLong
import kotlin.concurrent.atomics.ExperimentalAtomicApi
import kotlin.concurrent.atomics.incrementAndFetch

/**
 * Kuikly Mac 渲染 SDK
 * 
 * 该 SDK 提供 JVM 端与 Mac 渲染应用的 HTTP 通信能力。
 * 通过 HTTP 协议实现 callKotlinMethod 和 callNative 的远程交互。
 * 
 * 架构说明：
 * - JVM 端运行业务逻辑层 (core + compose)
 * - Mac 端运行渲染层 (core-render-ios)
 * - 两端通过 HTTP 协议通信
 * 
 * @param pageName 页面名称
 * @param serverHost 服务器地址，默认 localhost
 * @param serverPort 服务器端口，默认 9527
 * @param classLoader 用于加载 KuiklyCoreEntry 的 ClassLoader
 */
class KuiklyMacRenderSdk(
    private val pageName: String,
    private val serverHost: String = "localhost",
    private val serverPort: Int = 9528,  // TCP 端口
    private var classLoader: ClassLoader? = null
) : IKuiklyCoreEntry.Delegate {

    var isRunning: Boolean = true
    
    private val gson = Gson()
    private var kuiklyCoreEntry: IKuiklyCoreEntry? = null
    private val sdkInstanceId: String = sdkInstanceIdProducer++.toString()
    
    // NativeBridge 用于 Pager 调用 callNative
    private val nativeBridge = NativeBridge()
    
    // TCP 传输层（长连接，一个 instanceId 独享一个连接）
    private val transportImpl: Transport = TcpTransport(
        Transport.Config(
            serverHost = serverHost,
            serverPort = serverPort,
            connectTimeout = 1000,
            readTimeout = 1000
        )
    )

    // 回调
    var onFirstFramePaintCallback: Runnable? = null
    var onConnectionErrorCallback: ((Exception) -> Unit)? = null
    var onConnectedCallback: (() -> Unit)? = null
    var onCallKotlinMethodErrorCallback: ((Throwable) -> Unit)? = null
    
    // 记录是否已经尝试过初始化渲染（用于连接成功后自动重试）
    @Volatile
    private var hasTriedInitRender = false
    private var pendingInitRenderParams: Triple<Map<String, Any>, Int, Int>? = null
    private var pendingInitRenderConfig: PreviewConfig? = null

    /**
     * 当前Kuikly真实的Pagerid
     */
    private var currentKuiklyPagerId = ""
    
    init {

        
        // 初始化 TCP 传输层（建立长连接，如果 server 不存在会自动重试）
        transportImpl.init(sdkInstanceId)
        
        // 设置 callKotlinMethod 通知回调（Mac → JVM，通过 TCP NOTIFICATION 消息）
        if (transportImpl is TcpTransport) {
            transportImpl.onCallKotlinMethodNotification = { requestId, sequence, methodId, args ->
                // 在单线程执行器中按顺序处理
                kotlinMethodExecutor.submit {
                    try {
                        var pageId = args.getOrNull(0)
                        if (methodId == 1) {
                            currentKuiklyPagerId = pageId as String
                            kuiklyCoreEntry = reInitCoreEntry()
                        }
//                        println("[Mac SDK][$pageName] 📨 收到 callKotlinMethod 通知: requestId=$requestId, sequence=$sequence, methodId=$methodId pageId=${pageId}")
                        kuiklyCoreEntry!!.callKotlinMethod(
                            methodId,
                            args.getOrNull(0),
                            args.getOrNull(1),
                            args.getOrNull(2),
                            args.getOrNull(3),
                            args.getOrNull(4),
                            args.getOrNull(5)
                        )
                    } catch (t: Throwable) {
                        println("[Mac SDK][$pageName] ❌ callKotlinMethod 异常: ${t.message}")
                        t.printStackTrace()
                        // 通知 SDK 异常回调
                        onCallKotlinMethodErrorCallback?.invoke(t)
                    }
                }
            }
            
            // 设置端口重新发现回调（连接多次失败后触发）
            transportImpl.onPortRediscoveryNeeded = {
                println("[Mac SDK][$pageName] 🔍 开始端口重新发现...")
                val discovery = PreviewMacAppDiscovery()
                val newPort = discovery.discoverTcpPort()
                if (newPort != null) {
                    println("[Mac SDK][$pageName] ✅ 发现新端口: $newPort")
                    // 清除端口缓存，下次重新发现
                    MacRenderSdkConfig.clearCachedPort()
                    newPort
                } else {
                    println("[Mac SDK][$pageName] ⚠️ 端口重新发现失败")
                    null
                }
            }
            
            // 设置 refresh 通知回调（Mac → JVM，通过 TCP NOTIFICATION 消息）
            transportImpl.onRefreshNotification = { notifiedInstanceId ->
                // 检查 instanceId 是否匹配
                if (notifiedInstanceId == sdkInstanceId || notifiedInstanceId == null) {
                    println("[Mac SDK][$pageName] 🔄 收到 refresh 通知，触发刷新")
                    refresh()
                } else {
                    println("[Mac SDK][$pageName] ⚠️ 收到 refresh 通知，但 instanceId 不匹配: $notifiedInstanceId != $sdkInstanceId")
                }
            }
            
            // 设置连接成功回调
            transportImpl.onConnected = {
                println("[Mac SDK][$pageName] ✅ TCP 连接已建立，缓存的数据将自动发送")
                
                // 触发连接成功回调（注意：此时缓存请求可能还未发送完成）
                onConnectedCallback?.invoke()
            }
            
            // 设置缓存请求已发送回调（避免重复发送）
            transportImpl.onCachedRequestsFlushed = { flushedPaths ->
                println("[Mac SDK][$pageName] 📤 缓存请求已发送: $flushedPaths")
                
                // 如果 /render 请求已经通过缓存发送，清除待重试参数，避免重复发送
                if (flushedPaths.contains("/render")) {
                    println("[Mac SDK][$pageName] ✅ /render 请求已通过缓存发送，清除待重试参数")
                    pendingInitRenderParams = null
                    pendingInitRenderConfig = null
                }
                // 注意：如果 /render 不在缓存中，说明：
                // 1. 要么之前没有调用过 initRender（pendingInitRenderParams 为 null）
                // 2. 要么 initRender 在连接成功后立即调用并成功发送（pendingInitRenderParams 会被清除）
                // 所以不需要在这里重试，避免重复发送
            }
            
            // 设置连接断开回调
            transportImpl.onDisconnected = {
                println("[Mac SDK][$pageName] 🔌 TCP 连接已断开，正在尝试重连...")
            }
        }
        
        // 注册 NativeBridge
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
                var result =  this@KuiklyMacRenderSdk.callNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
//                println("KuiklyMacRenderSdk callNative ← methodId=$methodId, args=[$arg0, $arg1, $arg2, $arg3, $arg4, $arg5], result=$result")
                return result
            }
        }
        println("[Mac SDK][$pageName] ✅ NativeBridge 已注册 $sdkInstanceId")
    }
    
    /**
     * 检查服务器连接
     * @return 是否连接成功（如果 server 不存在，返回 false，但会自动重试）
     */
    fun ping(): Boolean {
        return try {
            val response = transportImpl.get("/ping", Transport.RequestType.GENERAL)
            if (response != null) {
                response.get("status")?.asString == "ok"
            } else {
                // 请求被缓存（server 不存在），返回 false
                println("[Mac SDK] ⏳ Ping 请求已缓存，等待 server 连接")
                false
            }
        } catch (e: Exception) {
            println("[Mac SDK] ❌ Ping 失败: ${e.message}")
            false
        }
    }
    
    /**
     * 初始化渲染
     * @param pageData 页面数据
     * @param width 渲染视图宽度，默认 400
     * @param height 渲染视图高度，默认 800
     * @param config 预览配置参数（可选）
     * @return 是否成功（如果 server 不存在，请求会被缓存，返回 false，但会在连接成功后自动发送）
     */
    fun initRender(
        pageData: Map<String, Any> = emptyMap(),
        width: Int = 400,
        height: Int = 800,
        config: PreviewConfig? = null
    ): Boolean {
        kuiklyCoreEntry = reInitCoreEntry()
        println("[Mac SDK] 📱 初始化渲染: pageName=$pageName, size=${width}x${height}")
        
        // 记录参数，用于连接成功后重试
        hasTriedInitRender = true
        pendingInitRenderParams = Triple(pageData, width, height)
        pendingInitRenderConfig = config
        
        // 优先使用 config 中的宽高，如果没有则使用参数中的宽高
        val actualWidth = config?.width ?: width
        val actualHeight = config?.height ?: height
        
        val requestBody = mutableMapOf<String, Any>(
            "pageName" to pageName,
            "pageData" to pageData,
            "instanceId" to sdkInstanceId,
            "width" to actualWidth,
            "height" to actualHeight
        )
        
        // 如果提供了配置，合并配置参数（config 中的 width 和 height 会覆盖上面的值，确保一致性）
        config?.let {
            requestBody.putAll(it.toMap())
            println("[Mac SDK] 📋 使用预览配置: width=${it.width}, height=${it.height}, device=${it.device}, density=${it.density}, orientation=${it.orientation}")
        }
        
        return try {
            val response = transportImpl.post("/render", requestBody, Transport.RequestType.GENERAL)
            if (response != null) {
                println("[Mac SDK] 📱 渲染响应: $response")
                val result = response.get("status")?.asString == "ok"
                println("[Mac SDK] 📱 渲染结果: $result")
                if (result) {
                    // 成功，清除待重试参数
                    pendingInitRenderParams = null
                    pendingInitRenderConfig = null
                }
                result
            } else {
                // 请求被缓存（server 不存在），返回 false，但会在连接成功后自动发送
                println("[Mac SDK] ⏳ 渲染请求已缓存，等待 server 连接后自动发送")
                false
            }
        } catch (e: Exception) {
            println("[Mac SDK] ❌ 初始化渲染失败: ${e.message}")
            e.printStackTrace()
            onConnectionErrorCallback?.invoke(e)
            false
        }
    }

    fun reInitCoreEntry(): IKuiklyCoreEntry {
        var kuiklyCoreEntry = newKuiklyCoreEntryInstance(classLoader)
        kuiklyCoreEntry.delegate = this
        kuiklyCoreEntry.triggerRegisterPages()
        return kuiklyCoreEntry
    }
    
    /**
     * 处理来自外部的 callKotlinMethod 调用
     * 
     * 将任务提交到实例级别的单线程执行器，确保按顺序执行
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
        kotlinMethodExecutor.submit {
            try {
                kuiklyCoreEntry!!.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
            } catch (t: Throwable) {
                println("[Mac SDK][$pageName] ❌ callKotlinMethod 异常: ${t.message}")
                t.printStackTrace()
                // 通知 SDK 异常回调
                onCallKotlinMethodErrorCallback?.invoke(t)
            }
        }
    }
    
    /**
     * 处理来自 JVM 的 callNative 调用
     * 
     * 通过 HTTP 发送到 Mac 渲染端，同步等待结果返回
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
        if (!isRunning) {
            return ""
        }

        // 生成唯一的请求 ID
        val requestIdLong = requestIdProducer.incrementAndFetch()
        if (requestIdLong > (Long.MAX_VALUE - 2)) {
            requestIdProducer = AtomicLong(0L)
        }
        val requestId = requestIdLong.toString()


        var pageId = arg0 as String

        if (pageId != currentKuiklyPagerId) {
            // 如果callNative的额不是当前Pager 请求全过滤掉
            return ""
        }

//        println("[Mac SDK][$pageName] callNative methodId=$methodId requestId=${requestId}")
        
        // 构建请求体
        val requestBody = mapOf(
            "type" to "callNative",
            "requestId" to requestId,
            "methodId" to methodId,
            "args" to listOf(arg0, arg1, arg2, arg3, arg4, arg5),
            "instanceId" to sdkInstanceId
        )

        // 通过 TCP 长连接发送请求并直接获取结果（同步请求）
        try {
            val response = transportImpl.post("/callNative", requestBody, Transport.RequestType.CALL_NATIVE)
            
            if (response != null) {
                val status = response.get("status")?.asString
                
                if (status == "ok" && response.has("result")) {
                    val result = response.get("result")?.asString ?: ""
//                    println("[Mac SDK][$pageName] callNative methodId=$methodId requestId=${requestId} 获取到结果: $result")
                    return result
                } else if (status == "error") {
                    val message = response.get("message")?.asString ?: "Unknown error"
                    println("[Mac SDK] ⚠️ callNative 执行失败: requestId=$requestId, message=$message")
                    return ""
                }
            }
            
            println("[Mac SDK] ⚠️ callNative 响应无效: requestId=$requestId")
            return ""
        } catch (e: Exception) {
            println("[Mac SDK] ❌ callNative TCP 请求失败: ${e.message}")
            return ""
        }
    }

    /**
     * 销毁 SDK
     */
    fun destroy() {
        println("[Mac SDK] 🧹 正在销毁实例: instanceId=$sdkInstanceId")
        
        // 标记为停止运行，停止接收新请求
        isRunning = false
        
        // 先发送销毁请求到 Mac 端，确保服务器端也销毁实例
        try {
            val response = transportImpl.post("/destroy", mapOf("instanceId" to sdkInstanceId), Transport.RequestType.GENERAL)
            if (response != null) {
                println("[Mac SDK] ✅ 服务器端销毁请求已发送: $response")
            } else {
                println("[Mac SDK] ⚠️ 服务器端销毁请求无响应")
            }
        } catch (e: Exception) {
            println("[Mac SDK] ❌ 服务器端销毁请求失败: ${e.message}")
            e.printStackTrace()
        }
        
        // 关闭 TCP 连接（会触发服务器端清理资源）
        transportImpl.destroy()

        // 注意：BridgeManager 目前没有 unregisterNativeBridge 方法
        // 这里只标记 SDK 已停止运行
        
        println("[Mac SDK] ✅ 销毁完成")
    }
    
    /**
     * 获取渲染视图截图
     * @return 截图的 PNG 字节数组，如果失败返回 null
     */
    fun captureScreenshot(): ByteArray? {
        return try {
            transportImpl.getBytes("/screenshot?instanceId=$sdkInstanceId")
        } catch (e: Exception) {
            println("[Mac SDK] ❌ 获取截图失败: ${e.message}")
            null
        }
    }
    
    /**
     * 发送触摸事件到 Mac 端
     * @param type 事件类型: "down", "move", "up", "cancel"
     * @param x X 坐标
     * @param y Y 坐标
     * @param timestamp 时间戳
     */
    fun sendTouchEvent(type: String, x: Float, y: Float, timestamp: Long) {
        if (!isRunning) return
        
        try {
            val requestBody = mapOf(
                "instanceId" to sdkInstanceId,
                "type" to type,
                "x" to x,
                "y" to y,
                "timestamp" to timestamp
            )
            transportImpl.post("/touch", requestBody, Transport.RequestType.GENERAL)
        } catch (e: Exception) {
            // 忽略触摸事件发送失败，避免频繁打印日志
        }
    }
    
    /**
     * 发送页面事件到 Kuikly 容器
     * 
     * 该方法用于从外部（Native 端）向 Kuikly 页面发送事件，类似于 Android 的
     * `KuiklyRenderViewDelegator.sendEvent` 和 iOS 的 `KuiklyRenderViewControllerDelegator.sendWithEvent`。
     * 
     * 事件会被发送到 Mac 渲染端，然后转发给 Kuikly 渲染核心，最终触发 Pager 的
     * `onReceivePagerEvent` 方法。
     * 
     * @param event 事件名称
     * @param data 事件数据，默认为空 Map
     * @return 是否发送成功
     */
    fun sendEvent(event: String, data: Map<String, Any> = emptyMap()): Boolean {
        if (!isRunning) {
            println("[Mac SDK] ⚠️ sendEvent 失败: SDK 已停止运行")
            return false
        }
        
        try {
            val requestBody = mapOf(
                "instanceId" to sdkInstanceId,
                "event" to event,
                "data" to data
            )
            val response = transportImpl.post("/sendEvent", requestBody, Transport.RequestType.GENERAL)
            val result = response?.get("status")?.asString == "ok"
            if (result) {
                println("[Mac SDK] ✅ sendEvent 成功: event=$event, data=$data")
            } else {
                println("[Mac SDK] ⚠️ sendEvent 失败: event=$event, response=$response")
            }
            return result
        } catch (e: Exception) {
            println("[Mac SDK] ❌ sendEvent 异常: event=$event, error=${e.message}")
            e.printStackTrace()
            return false
        }
    }
    
    /**
     * 刷新方法
     * 
     * 通过发送带有随机数据的 "refresh" 事件来触发页面刷新。
     * 每次调用都会生成新的随机数据，确保刷新事件能够被正确识别和处理。
     */
    fun refresh() {
        println("[Mac SDK] 🔄 刷新调用")
        
        // 生成随机刷新数据
        val randomValue = kotlin.random.Random.nextDouble()
        val randomKey = "refresh_${randomValue.toString().replace(".", "")}"
        
        val kotlinData = mapOf(
            "refreshKey" to randomKey,
            "forceRefresh" to true,
            "randomValue" to randomValue
        )
        
        println("[Mac SDK] 🔄 使用随机刷新数据: $kotlinData")
        sendEvent("refresh", kotlinData)
    }
    
    /**
     * 更新预览大小
     * 
     * 动态调整 Mac 渲染端的预览视图大小。
     * 
     * @param width 新的宽度
     * @param height 新的高度
     * @return 是否更新成功
     * @deprecated 使用 updatePreviewConfig 替代
     */
    @Deprecated("使用 updatePreviewConfig 替代", ReplaceWith("updatePreviewConfig(config.copy(width = width, height = height))"))
    fun updateSize(width: Int, height: Int): Boolean {
        return updatePreviewConfig(PreviewConfig(width = width, height = height))
    }
    
    /**
     * 更新预览配置
     * 
     * 动态更新 Mac 渲染端的预览配置参数，包括尺寸、密度、方向等。
     * 
     * @param config 预览配置（只需要包含要更新的字段）
     * @return 是否更新成功
     */
    fun updatePreviewConfig(config: PreviewConfig): Boolean {
        if (!isRunning) {
            println("[Mac SDK] ⚠️ updatePreviewConfig 失败: SDK 已停止运行")
            return false
        }
        
        println("[Mac SDK] 📋 更新预览配置: width=${config.width}, height=${config.height}, density=${config.density}, orientation=${config.orientation}")
        println("[Mac SDK] 📋 完整配置: $config")
        
        try {
            val requestBody = mutableMapOf<String, Any>(
                "instanceId" to sdkInstanceId
            )
            // 添加配置参数
            val configMap = config.toMap()
            println("[Mac SDK] 📋 配置 Map: $configMap")
            requestBody.putAll(configMap)
            
            println("[Mac SDK] 📤 发送请求到 /updatePreviewConfig, requestBody=$requestBody")
            val response = transportImpl.post("/updatePreviewConfig", requestBody, Transport.RequestType.GENERAL)
            println("[Mac SDK] 📥 收到响应: $response")
            
            val result = response?.get("status")?.asString == "ok"
            if (result) {
                println("[Mac SDK] ✅ 预览配置更新成功")
            } else {
                println("[Mac SDK] ⚠️ 预览配置更新失败: response=$response")
            }
            return result
        } catch (e: Exception) {
            println("[Mac SDK] ❌ updatePreviewConfig 异常: error=${e.message}")
            e.printStackTrace()
            return false
        }


    }

    fun updateClassLoader(newClassLoader: ClassLoader) {
        classLoader = newClassLoader
    }

    companion object {
        // Kotlin 方法执行线程池
        val kotlinMethodExecutor = Executors.newSingleThreadExecutor { r ->
            Thread(r, "KuiklyMac-Method-Executor").apply { isDaemon = true }
        }
        
        // 全局递增的 instanceIdProducer
        private var sdkInstanceIdProducer = 0L
        
        private var requestIdProducer = AtomicLong(0L)
        
        /**
         * 创建 KuiklyCoreEntry 实例
         */
        fun newKuiklyCoreEntryInstance(classLoader: ClassLoader? = null): IKuiklyCoreEntry {
            val kuiklyClass = if (classLoader != null) {
                classLoader.loadClass("com.tencent.kuikly.core.android.KuiklyCoreEntry")
            } else {
                Class.forName("com.tencent.kuikly.core.android.KuiklyCoreEntry")
            }
            return kuiklyClass.getDeclaredConstructor().newInstance() as IKuiklyCoreEntry
        }
        
        /**
         * 检查页面是否存在
         */
        fun isPageExist(pageName: String, classLoader: ClassLoader? = null): Boolean {
            newKuiklyCoreEntryInstance(classLoader).triggerRegisterPages()
            return BridgeManager.isPageExist(pageName)
        }
    }
}

