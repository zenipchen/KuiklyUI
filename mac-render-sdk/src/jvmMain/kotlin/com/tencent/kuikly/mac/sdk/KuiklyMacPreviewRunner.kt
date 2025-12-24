package com.tencent.kuikly.mac.sdk

/**
 * Kuikly Mac 预览运行器
 * 
 * 这是一个便捷类，用于简化预览模式的启动流程。
 * 它封装了 SDK 的初始化、连接检查和轮询启动等逻辑。
 * 
 * 使用示例：
 * ```kotlin
 * val runner = KuiklyMacPreviewRunner(
 *     pageName = "HelloWorld",
 *     serverPort = 9527,
 *     classLoader = MyClass::class.java.classLoader
 * )
 * 
 * runner.onConnected = {
 *     println("已连接到 Mac 渲染端")
 * }
 * 
 * runner.onError = { error ->
 *     println("连接错误: $error")
 * }
 * 
 * runner.start()
 * ```
 */
class KuiklyMacPreviewRunner(
    private val pageName: String,
    private val pageData: Map<String, Any> = emptyMap(),
    private val serverHost: String? = null,  // null 表示使用全局配置
    private val serverPort: Int? = null,    // null 表示使用全局配置（会自动发现）
    private val classLoader: ClassLoader? = null,
    private val width: Int = 400,
    private val height: Int = 800,
    private val config: PreviewConfig? = null,
    // RefreshServer 已废弃，refresh 功能通过 TCP NOTIFICATION 实现
) {

    fun updateClassLoader(newClassLoader: ClassLoader) {
        sdk?.updateClassLoader(newClassLoader)
    }
    
    private var sdk: KuiklyMacRenderSdk? = null
    private var instanceId: String? = null
    
    // 保存当前配置（用于 reload 时使用最新配置）
    private var currentConfig: PreviewConfig? = config
    
    // 回调
    var onConnected: (() -> Unit)? = null
    var onError: ((Exception) -> Unit)? = null
    var onFirstFramePaint: (() -> Unit)? = null
    var onDisconnected: (() -> Unit)? = null
    var onCallKotlinMethodError: ((Throwable) -> Unit)? = null
    
    // 状态
    var isConnected: Boolean = false
        private set
    
    /**
     * 启动预览（异步执行，内部使用线程池）
     * 
     * 该方法会在后台线程中执行所有阻塞操作（网络连接、端口发现等），
     * 不会阻塞调用线程。结果通过回调通知。
     * 
     * @return 无返回值（异步执行）
     */
    fun start() {
        // 在后台线程中执行启动逻辑
        startExecutor.submit {
            startInternal()
        }
    }
    
    /**
     * 内部启动方法（同步执行）
     * 
     * @return 是否成功启动
     */
    private fun startInternal(): Boolean {
        println("[MacPreviewRunner] 🚀 正在启动预览...")
        println("[MacPreviewRunner] 📄 页面: $pageName")
        
        try {
            // 从全局配置或实例参数获取服务器配置
            val actualHost = serverHost ?: MacRenderSdkConfig.getServerHost()
            val actualPort = serverPort ?: MacRenderSdkConfig.getServerPort()
            
            println("[MacPreviewRunner] 📍 服务器: $actualHost:$actualPort")
            
            // 创建 SDK 实例
            sdk = KuiklyMacRenderSdk(
                pageName = pageName,
                serverHost = actualHost,
                serverPort = actualPort,
                classLoader = classLoader
            )
            
            // 获取并存储 instanceId（通过反射，因为 instanceId 是私有属性）
            instanceId = try {
                val instanceIdField = sdk!!::class.java.getDeclaredField("instanceId")
                instanceIdField.isAccessible = true
                instanceIdField.get(sdk) as? String
            } catch (e: Exception) {
                null
            }
            
            // 设置回调
            sdk?.onFirstFramePaintCallback = Runnable {
                println("[MacPreviewRunner] 🎨 首帧渲染完成")
                onFirstFramePaint?.invoke()
            }
            
            sdk?.onConnectionErrorCallback = { error ->
                println("[MacPreviewRunner] ❌ 连接错误: ${error.message}")
                isConnected = false
                onError?.invoke(error)
            }
            
            sdk?.onCallKotlinMethodErrorCallback = { throwable ->
                println("[MacPreviewRunner] ❌ callKotlinMethod 异常: ${throwable.message}")
                onCallKotlinMethodError?.invoke(throwable)
            }
            
            // 检查连接（如果 server 不存在，会自动重试）
            println("[MacPreviewRunner] 🔗 正在检查连接...")
            val pingResult = sdk!!.ping()
            
            if (pingResult) {
                println("[MacPreviewRunner] ✅ 连接成功")
                isConnected = true
            } else {
                // server 不存在，但会自动重试
                println("[MacPreviewRunner] ⏳ Server 暂不可用，正在等待连接...")
                println("[MacPreviewRunner] 💡 SDK 会自动重试连接，连接成功后会自动发送缓存的请求")
            }
            
            // 设置连接成功回调
            sdk?.onConnectedCallback = {
                if (!isConnected) {
                    println("[MacPreviewRunner] ✅ Server 已连接")
                    isConnected = true
                    onConnected?.invoke()
                }
            }
            
            // 初始化渲染（如果 server 不存在，请求会被缓存）
            println("[MacPreviewRunner] 📱 正在初始化渲染... (尺寸: ${width}x${height})")
            val initResult = sdk!!.initRender(pageData, width, height, config)
            
            if (initResult) {
                println("[MacPreviewRunner] ✅ 渲染初始化成功")
                // 如果连接成功且渲染成功，触发回调
                if (isConnected) {
                    onConnected?.invoke()
                }
                return true
            } else {
                // 初始化失败，可能是 server 不存在（请求已缓存）
                if (pingResult) {
                    // 连接成功但渲染失败，返回错误
                    println("[MacPreviewRunner] ❌ 初始化渲染失败")
                    onError?.invoke(Exception("初始化渲染失败"))
                    return false
                } else {
                    // server 不存在，请求已缓存，等待连接成功后自动发送
                    println("[MacPreviewRunner] ⏳ 渲染请求已缓存，等待 server 连接后自动发送")
                    // 不返回 false，允许继续运行（连接成功后会自动完成初始化）
                    // 注意：此时 isConnected 为 false，但 SDK 会继续尝试连接
                    return true  // 返回 true 表示启动流程成功（虽然还没真正连接）
                }
            }
            
        } catch (e: Exception) {
            println("[MacPreviewRunner] ❌ 启动失败: ${e.message}")
            e.printStackTrace()
            onError?.invoke(e)
            return false
        }
    }
    
    /**
     * 停止预览
     */
    fun stop() {
        println("[MacPreviewRunner] 🛑 正在停止预览...")
        
        // RefreshServer 已废弃，无需注销
        
        sdk?.destroy()
        sdk = null
        isConnected = false
        
        onDisconnected?.invoke()
        
        println("[MacPreviewRunner] ✅ 预览已停止")
    }
    
    /**
     * 重新加载页面
     * 
     * 使用当前保存的配置（包括通过 updatePreviewConfig 更新的配置）重新初始化渲染。
     * 如果 config 中有 width 和 height，优先使用 config 中的值。
     */
    fun reload() {
        println("[MacPreviewRunner] 🔄 正在重新加载...")
        
        // 优先使用 config 中的宽高，如果没有则使用构造函数中的宽高
        val actualWidth = currentConfig?.width ?: width
        val actualHeight = currentConfig?.height ?: height
        
        println("[MacPreviewRunner] 🔄 重新加载尺寸: ${actualWidth}x${actualHeight}, config=${currentConfig}")
        sdk?.initRender(pageData, actualWidth, actualHeight, currentConfig)
    }
    
    /**
     * 获取 SDK 实例
     */
    fun getSdk(): KuiklyMacRenderSdk? = sdk
    
    /**
     * 获取实例 ID
     */
    fun getInstanceId(): String? = instanceId
    
    /**
     * 获取渲染视图截图
     * @return 截图的 PNG 字节数组，如果失败返回 null
     */
    fun captureScreenshot(): ByteArray? {
        return sdk?.captureScreenshot()
    }
    
    /**
     * 发送触摸事件到 Mac 端
     * @param type 事件类型: "down", "move", "up", "cancel"
     * @param x X 坐标
     * @param y Y 坐标
     * @param timestamp 时间戳
     */
    fun sendTouchEvent(type: String, x: Float, y: Float, timestamp: Long) {
        sdk?.sendTouchEvent(type, x, y, timestamp)
    }
    
    /**
     * 发送页面事件到 Kuikly 容器
     * 
     * 该方法用于从外部向 Kuikly 页面发送事件，类似于 Android 的
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
        return sdk?.sendEvent(event, data) ?: false
    }
    
    /**
     * 更新预览配置
     * @param config 预览配置（只需要包含要更新的字段）
     * @return 是否更新成功
     */
    fun updatePreviewConfig(config: PreviewConfig): Boolean {
        val result = sdk?.updatePreviewConfig(config) ?: false
        
        // 如果更新成功，合并配置到 currentConfig 中，以便 reload 时使用
        if (result) {
            currentConfig = mergeConfig(currentConfig, config)
            println("[MacPreviewRunner] ✅ 配置已更新并保存: $currentConfig")
        }
        return result
    }
    
    /**
     * 合并配置，将新配置的值合并到旧配置中
     * 新配置中的非默认值会覆盖旧配置，默认值会被忽略
     */
    private fun mergeConfig(oldConfig: PreviewConfig?, newConfig: PreviewConfig): PreviewConfig {
        return if (oldConfig == null) {
            newConfig
        } else {
            // 从旧配置创建 Map，然后用新配置的 Map 覆盖
            val oldMap = oldConfig.toMap()
            val newMap = newConfig.toMap()
            
            // 合并 Map（新配置覆盖旧配置）
            val mergedMap = oldMap.toMutableMap()
            mergedMap.putAll(newMap)
            
            // 从合并后的 Map 创建新配置
            PreviewConfig.fromMap(mergedMap)
        }
    }
    
    companion object {
        // 启动线程池（用于异步执行 start 方法）
        private val startExecutor = java.util.concurrent.Executors.newCachedThreadPool { r ->
            Thread(r, "KuiklyMac-Start-Executor").apply { isDaemon = true }
        }
        
        /**
         * 获取 Kotlin 方法执行线程池
         * 用于初始化 Kuikly 线程调度器
         */
        @JvmStatic
        fun getKotlinMethodExecutor() = KuiklyMacRenderSdk.kotlinMethodExecutor
        
        /**
         * 获取当前服务器地址（由 SDK 内部管理）
         */
        @JvmStatic
        fun getServerHost(): String {
            return MacRenderSdkConfig.getServerHost()
        }
        
        /**
         * 获取当前服务器端口（由 SDK 内部管理，自动发现）
         */
        @JvmStatic
        fun getServerPort(): Int {
            return MacRenderSdkConfig.getServerPort()
        }
        
        /**
         * 检查与 Mac 渲染端的连接
         * @return 是否连接成功
         */
        @JvmStatic
        fun ping(): Boolean {
            return try {
                val actualHost = MacRenderSdkConfig.getServerHost()
                val actualPort = MacRenderSdkConfig.getServerPort()
                
                val sdk = KuiklyMacRenderSdk(
                    pageName = "_ping_test_",
                    serverHost = actualHost,
                    serverPort = actualPort
                )
                val result = sdk.ping()
                sdk.destroy()
                result
            } catch (e: Exception) {
                false
            }
        }
    }
}

/**
 * 快速启动预览的扩展函数
 */
fun startMacPreview(
    pageName: String,
    pageData: Map<String, Any> = emptyMap(),
    serverHost: String? = null,  // null 表示使用全局配置
    serverPort: Int? = null,      // null 表示使用全局配置（会自动发现）
    classLoader: ClassLoader? = null,
    width: Int = 400,
    height: Int = 800,
    config: PreviewConfig? = null,
    onConnected: (() -> Unit)? = null,
    onError: ((Exception) -> Unit)? = null,
    onCallKotlinMethodError: ((Throwable) -> Unit)? = null
): KuiklyMacPreviewRunner {
    val runner = KuiklyMacPreviewRunner(
        pageName = pageName,
        pageData = pageData,
        serverHost = serverHost,
        serverPort = serverPort,
        classLoader = classLoader,
        width = width,
        height = height,
        config = config
    )
    classLoader?.apply {
        runner.updateClassLoader(classLoader)
    }
    runner.onConnected = onConnected
    runner.onError = onError
    runner.onCallKotlinMethodError = onCallKotlinMethodError
    
    // start() 现在是异步的，不需要等待
    runner.start()
    
    return runner
}

