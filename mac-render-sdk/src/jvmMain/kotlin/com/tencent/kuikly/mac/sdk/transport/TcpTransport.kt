package com.tencent.kuikly.mac.sdk.transport

import com.google.gson.Gson
import com.google.gson.JsonObject
import java.io.DataInputStream
import java.io.DataOutputStream
import java.net.Socket
import java.nio.ByteBuffer
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicLong
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

/**
 * TCP 传输层实现
 * 
 * 使用 TCP Socket 实现二进制协议通信
 * 
 * 协议设计：
 * - 消息格式：长度(4字节) + 类型(1字节) + 数据(JSON/二进制)
 * - 消息类型：REQUEST(0), RESPONSE(1), NOTIFICATION(2)
 * - 支持请求/响应配对（通过 requestId）
 * 
 * 特性：
 * - 支持 server 不存在时的自动重连
 * - 连接失败时缓存请求，连接成功后按顺序发送
 * - 定时检查 server 是否可用
 */
class TcpTransport(
    private val config: Transport.Config
) : Transport {
    
    private val gson = Gson()
    private var instanceId: String = ""
    
    // TCP 连接
    private var socket: Socket? = null
    private var inputStream: DataInputStream? = null
    private var outputStream: DataOutputStream? = null
    
    // 连接状态标志
    @Volatile
    private var isConnected: Boolean = false
    
    // 请求/响应映射
    private val pendingRequests = ConcurrentHashMap<Long, ResponseCallback>()
    private val pendingBinaryRequests = ConcurrentHashMap<Long, BinaryResponseCallback>()
    private val requestIdGenerator = AtomicLong(0)
    
    // 接收线程
    private val receiveExecutor = Executors.newSingleThreadExecutor { r ->
        Thread(r, "TcpTransport-Receive-$instanceId").apply { isDaemon = true }
    }
    
    // 连接重试定时器
    private var reconnectScheduler: ScheduledExecutorService? = null
    private var reconnectTask: ScheduledFuture<*>? = null
    
    // 请求缓存队列（连接失败时缓存请求）
    private data class CachedRequest(
        val requestId: Long,
        val type: MessageType,
        val data: Map<String, Any?>,
        val isBinary: Boolean = false
    )
    
    private val requestCache = mutableListOf<CachedRequest>()
    private val cacheLock = ReentrantLock()
    
    // 连接检查间隔（毫秒）
    private val reconnectIntervalMs = 1000L
    
    // 是否正在尝试连接（避免并发连接）
    @Volatile
    private var isConnecting: Boolean = false
    
    // 连续失败次数（用于触发端口重新发现）
    @Volatile
    private var consecutiveFailures: Int = 0
    
    // 触发端口重新发现的失败次数阈值
    private val rediscoveryThreshold = 3
    
    // callKotlinMethod 通知回调（Mac → JVM）
    var onCallKotlinMethodNotification: ((String, Long, Int, List<Any?>) -> Unit)? = null
    
    // refresh 通知回调（Mac → JVM）
    var onRefreshNotification: ((String?) -> Unit)? = null
    
    // 连接成功回调
    var onConnected: (() -> Unit)? = null
    
    // 连接断开回调
    var onDisconnected: (() -> Unit)? = null
    
    // 缓存请求已发送回调（通知上层哪些请求已经通过缓存发送）
    var onCachedRequestsFlushed: ((List<String>) -> Unit)? = null
    
    // 端口重新发现回调（连接多次失败后触发，返回新的端口号，如果返回 null 则继续使用原端口）
    var onPortRediscoveryNeeded: (() -> Int?)? = null
    
    // 消息类型
    private enum class MessageType(val value: Byte) {
        REQUEST(0),
        RESPONSE(1),
        NOTIFICATION(2),
        BINARY_RESPONSE(3)  // 二进制响应
    }
    
    // 响应回调
    private data class ResponseCallback(
        val requestId: Long,
        val callback: (JsonObject?) -> Unit
    )
    
    // 二进制响应回调
    private data class BinaryResponseCallback(
        val requestId: Long,
        val callback: (ByteArray?) -> Unit
    )
    
    override fun init(instanceId: String) {
        this.instanceId = instanceId
        
        // 尝试建立 TCP 连接
        if (!tryConnect()) {
            // 连接失败，启动定时重连机制
            startReconnectScheduler()
        }
    }
    
    /**
     * 尝试建立 TCP 连接
     * @return 是否连接成功
     */
    private fun tryConnect(): Boolean {
        if (isConnecting) {
            return false
        }
        
        isConnecting = true
        try {
            println("[TcpTransport] 🔗 正在尝试连接: $instanceId -> ${config.serverHost}:${config.serverPort}")
            
            socket = Socket()
            socket?.connect(
                java.net.InetSocketAddress(config.serverHost, config.serverPort),
                config.connectTimeout.toInt()
            )
            socket?.soTimeout = config.readTimeout.toInt()
            inputStream = DataInputStream(socket?.getInputStream())
            outputStream = DataOutputStream(socket?.getOutputStream())
            isConnected = true
            
            // 连接成功，重置失败计数
            consecutiveFailures = 0
            
            // 停止重连定时器
            stopReconnectScheduler()
            
            // 启动接收线程
            receiveExecutor.submit {
                receiveLoop()
            }
            
            println("[TcpTransport] ✅ TCP 连接已建立: $instanceId -> ${config.serverHost}:${config.serverPort}")
            
            // 连接成功后，先发送缓存的数据（会触发 onCachedRequestsFlushed 回调）
            flushCachedRequests()
            
            // 然后触发连接成功回调（此时缓存请求已发送完成）
            onConnected?.invoke()
            
            return true
        } catch (e: Exception) {
            isConnected = false
            consecutiveFailures++
            println("[TcpTransport] ❌ TCP 连接失败 (第 $consecutiveFailures 次): ${e.message}")
            
            // 如果连续失败次数达到阈值，尝试重新发现端口
            if (consecutiveFailures >= rediscoveryThreshold) {
                println("[TcpTransport] 🔍 连续失败 $consecutiveFailures 次，尝试重新发现端口...")
                val newPort = onPortRediscoveryNeeded?.invoke()
                if (newPort != null && newPort != config.serverPort) {
                    println("[TcpTransport] ✅ 发现新端口: $newPort (旧端口: ${config.serverPort})")
                    config.serverPort = newPort
                    consecutiveFailures = 0  // 重置失败计数，使用新端口重试
                } else {
                    println("[TcpTransport] ⚠️ 端口重新发现失败或端口未变化，继续使用原端口")
                }
            }
            
            // 清理失败的连接
            closeConnection()
            
            return false
        } finally {
            isConnecting = false
        }
    }
    
    /**
     * 关闭连接（不清理状态）
     */
    private fun closeConnection() {
        try {
            inputStream?.close()
            outputStream?.close()
            socket?.close()
        } catch (e: Exception) {
            // 忽略关闭异常
        }
        inputStream = null
        outputStream = null
        socket = null
    }
    
    /**
     * 启动重连定时器
     */
    private fun startReconnectScheduler() {
        if (reconnectScheduler != null) {
            return // 已经启动
        }
        
        reconnectScheduler = Executors.newSingleThreadScheduledExecutor { r ->
            Thread(r, "TcpTransport-Reconnect-$instanceId").apply { isDaemon = true }
        }
        
        reconnectTask = reconnectScheduler?.scheduleWithFixedDelay(
            {
                if (!isConnected && !isConnecting) {
                    if (tryConnect()) {
                        // 连接成功，定时器会在 tryConnect 中停止
                    }
                }
            },
            reconnectIntervalMs,
            reconnectIntervalMs,
            TimeUnit.MILLISECONDS
        )
        
        println("[TcpTransport] 🔄 已启动连接重试定时器: 每 ${reconnectIntervalMs}ms 检查一次")
    }
    
    /**
     * 停止重连定时器
     */
    private fun stopReconnectScheduler() {
        reconnectTask?.cancel(false)
        reconnectTask = null
        reconnectScheduler?.shutdown()
        reconnectScheduler = null
    }
    
    /**
     * 发送缓存的所有请求（连接成功后调用）
     */
    private fun flushCachedRequests() {
        cacheLock.withLock {
            if (requestCache.isEmpty()) {
                return
            }
            
            println("[TcpTransport] 📤 开始发送缓存的请求，共 ${requestCache.size} 个")
            
            val cached = requestCache.toList() // 复制一份，避免并发修改
            requestCache.clear()
            
            // 记录已发送的请求路径（用于通知上层）
            val flushedPaths = mutableListOf<String>()
            
            // 按顺序发送缓存的数据
            for (cachedRequest in cached) {
                try {
                    // 提取请求路径（用于通知上层）
                    val path = cachedRequest.data["path"] as? String
                    if (path != null) {
                        flushedPaths.add(path)
                    }
                    
                    // 直接发送消息（不等待响应，因为响应会在 receiveLoop 中处理）
                    sendMessage(cachedRequest.type, cachedRequest.data)
                    println("[TcpTransport] ✅ 已发送缓存请求: requestId=${cachedRequest.requestId}, path=$path")
                } catch (e: Exception) {
                    println("[TcpTransport] ⚠️ 发送缓存请求失败: requestId=${cachedRequest.requestId}, error=${e.message}")
                    // 如果发送失败，重新缓存（连接可能又断开了）
                    requestCache.add(cachedRequest)
                    // 如果连接又断开了，停止发送后续请求
                    if (!isConnected) {
                        println("[TcpTransport] ⚠️ 连接再次断开，停止发送剩余缓存请求")
                        break
                    }
                }
            }
            
            val remaining = requestCache.size
            if (remaining > 0) {
                println("[TcpTransport] ⚠️ 仍有 $remaining 个请求未发送，等待下次连接")
            } else {
                println("[TcpTransport] ✅ 所有缓存请求发送完成")
            }
            
            // 通知上层哪些请求已经通过缓存发送（避免重复发送）
            if (flushedPaths.isNotEmpty()) {
                onCachedRequestsFlushed?.invoke(flushedPaths)
            }
        }
    }
    
    override fun get(path: String, requestType: Transport.RequestType): JsonObject? {
        val requestId = requestIdGenerator.incrementAndGet()
        val request = mapOf(
            "type" to "GET",
            "path" to path,
            "requestId" to requestId,
            "requestType" to requestType.name
        )
        
        // 判断是否应该缓存（ping, render 等可以缓存，callNative 等需要立即响应的不缓存）
        val shouldCache = shouldCacheRequest(path, requestType)
        return sendRequest(requestId, request, shouldCache)
    }
    
    override fun post(path: String, body: Map<String, Any?>, requestType: Transport.RequestType): JsonObject? {
        val requestId = requestIdGenerator.incrementAndGet()
        val request = mapOf(
            "type" to "POST",
            "path" to path,
            "body" to body,
            "requestId" to requestId,
            "requestType" to requestType.name
        )
        
        // 判断是否应该缓存
        val shouldCache = shouldCacheRequest(path, requestType)
        return sendRequest(requestId, request, shouldCache)
    }
    
    /**
     * 判断请求是否应该被缓存（连接失败时）
     * @param path 请求路径
     * @param requestType 请求类型
     * @return 是否应该缓存
     */
    private fun shouldCacheRequest(path: String, requestType: Transport.RequestType): Boolean {
        // callNative 需要立即响应，不缓存
        if (requestType == Transport.RequestType.CALL_NATIVE) {
            return false
        }
        
        // 以下请求可以缓存（连接成功后自动发送）
        // - /ping: 连接检查
        // - /render: 初始化渲染
        // - /sendEvent: 发送事件
        // - /touch: 触摸事件
        // - /updatePreviewConfig: 更新配置
        // - /destroy: 销毁（虽然可能不需要，但缓存也无妨）
        return when (path) {
            "/ping", "/render", "/sendEvent", "/touch", "/updatePreviewConfig", "/destroy" -> true
            else -> false  // 其他请求默认不缓存
        }
    }
    
    override fun getBytes(path: String): ByteArray? {
        val requestId = requestIdGenerator.incrementAndGet()
        val request = mapOf(
            "type" to "GET",
            "path" to path,
            "requestId" to requestId,
            "requestType" to Transport.RequestType.GENERAL.name,
            "binaryResponse" to true  // 标记需要二进制响应
        )
        
        return sendBinaryRequest(requestId, request)
    }
    
    /**
     * 发送二进制请求并等待响应
     * 注意：二进制请求（如截图）需要立即响应，不缓存
     */
    private fun sendBinaryRequest(requestId: Long, request: Map<String, Any?>): ByteArray? {
        val latch = java.util.concurrent.CountDownLatch(1)
        var response: ByteArray? = null
        
        // 注册二进制响应回调
        pendingBinaryRequests[requestId] = BinaryResponseCallback(requestId) { result ->
            response = result
            latch.countDown()
        }
        
        // 发送请求
        try {
            sendMessage(MessageType.REQUEST, request)
        } catch (e: java.io.IOException) {
            println("[TcpTransport] ❌ 发送二进制请求失败（连接断开）: ${e.message}")
            // 二进制请求不缓存（需要立即响应）
            // 启动重连（如果还没启动）
            if (!isConnected && reconnectScheduler == null) {
                startReconnectScheduler()
            }
            pendingBinaryRequests.remove(requestId)
            return null
        } catch (e: Exception) {
            println("[TcpTransport] ❌ 发送二进制请求失败: ${e.message}")
            pendingBinaryRequests.remove(requestId)
            return null
        }
        
        // 等待响应（超时 10 秒，因为图片可能较大）
        try {
            if (latch.await(10, TimeUnit.SECONDS)) {
                return response
            } else {
                println("[TcpTransport] ⚠️ 二进制请求超时: requestId=$requestId")
                pendingBinaryRequests.remove(requestId)
                return null
            }
        } catch (e: InterruptedException) {
            println("[TcpTransport] ❌ 等待二进制响应中断: ${e.message}")
            pendingBinaryRequests.remove(requestId)
            return null
        }
    }
    
    /**
     * 发送请求并等待响应
     * @param requestId 请求 ID
     * @param request 请求数据
     * @param shouldCache 连接失败时是否缓存请求
     */
    private fun sendRequest(requestId: Long, request: Map<String, Any?>, shouldCache: Boolean = false): JsonObject? {
        val latch = java.util.concurrent.CountDownLatch(1)
        var response: JsonObject? = null
        
        // 注册响应回调
        pendingRequests[requestId] = ResponseCallback(requestId) { result ->
            response = result
            latch.countDown()
        }
        
        // 发送请求
        try {
            sendMessage(MessageType.REQUEST, request)
        } catch (e: java.io.IOException) {
            println("[TcpTransport] ❌ 发送请求失败（连接断开）: ${e.message}")
            
            // 根据 shouldCache 决定是否缓存
            if (shouldCache) {
                cacheRequest(requestId, MessageType.REQUEST, request, isBinary = false)
                println("[TcpTransport] 💾 请求已缓存: requestId=$requestId")
            } else {
                println("[TcpTransport] ⚠️ 请求未缓存（需要立即响应）: requestId=$requestId")
            }
            
            // 启动重连（如果还没启动）
            if (!isConnected && reconnectScheduler == null) {
                startReconnectScheduler()
            }
            
            // 清理响应回调（因为连接断开，不会收到响应）
            pendingRequests.remove(requestId)
            return null
        } catch (e: Exception) {
            println("[TcpTransport] ❌ 发送请求失败: ${e.message}")
            pendingRequests.remove(requestId)
            return null
        }
        
        // 等待响应（超时 5 秒）
        try {
            if (latch.await(5, TimeUnit.SECONDS)) {
                return response
            } else {
                println("[TcpTransport] ⚠️ 请求超时: requestId=$requestId")
                pendingRequests.remove(requestId)
                return null
            }
        } catch (e: InterruptedException) {
            println("[TcpTransport] ❌ 等待响应中断: ${e.message}")
            pendingRequests.remove(requestId)
            return null
        }
    }
    
    /**
     * 缓存请求（连接失败时）
     */
    private fun cacheRequest(requestId: Long, type: MessageType, data: Map<String, Any?>, isBinary: Boolean) {
        cacheLock.withLock {
            requestCache.add(CachedRequest(requestId, type, data, isBinary))
            println("[TcpTransport] 💾 已缓存请求: requestId=$requestId, 当前缓存数量=${requestCache.size}")
        }
    }
    
    /**
     * 发送消息
     */
    private fun sendMessage(type: MessageType, data: Map<String, Any?>) {
        // 检查连接状态
        if (!isConnected || socket == null || !socket!!.isConnected || outputStream == null) {
            throw java.io.IOException("连接已断开，无法发送消息")
        }
        
        val json = gson.toJson(data)
        val bytes = json.toByteArray(Charsets.UTF_8)
        
        try {
            val out = outputStream!!
            // 写入长度（4字节）
            out.writeInt(bytes.size)
            // 写入类型（1字节）
            out.writeByte(type.value.toInt())
            // 写入数据
            out.write(bytes)
            out.flush()
        } catch (e: java.io.IOException) {
            // 连接断开，更新状态
            isConnected = false
            println("[TcpTransport] 🔌 发送时检测到连接断开: ${e.message}")
            throw e
        }
    }
    
    /**
     * 接收循环（长连接，持续接收消息）
     */
    private fun receiveLoop() {
        while (isConnected && socket?.isConnected == true) {
            try {
                val input = inputStream
                if (input == null) {
                    Thread.sleep(10)
                    continue
                }
                
                // 读取长度（4字节）
                val length = input.readInt()
                if (length <= 0 || length > 10 * 1024 * 1024) { // 限制最大 10MB
                    println("[TcpTransport] ⚠️ 消息长度异常: $length (十六进制: 0x${length.toString(16)})")
                    println("[TcpTransport] ⚠️ 可能是消息边界错位，连接可能已损坏，建议重连")
                    // 如果长度异常，可能是消息边界错位，无法恢复，退出接收循环
                    handleConnectionLost()
                    break
                }
                
                // 读取类型（1字节）
                val typeValue = input.readByte()
                val type = MessageType.values().find { it.value == typeValue }
                if (type == null) {
                    println("[TcpTransport] ⚠️ 未知消息类型: $typeValue")
                    continue
                }
                
                // 处理消息
                when (type) {
                    MessageType.RESPONSE -> {
                        // 读取 JSON 数据
                        val bytes = ByteArray(length)
                        input.readFully(bytes)
                        val json = String(bytes, Charsets.UTF_8)
                        val data = gson.fromJson(json, JsonObject::class.java)
                        
                        val requestId = data.get("requestId")?.asLong
                        if (requestId != null) {
                            val callback = pendingRequests.remove(requestId)
                            callback?.callback(data)
                        }
                    }
                    MessageType.BINARY_RESPONSE -> {
                        // 读取二进制数据
                        val bytes = ByteArray(length)
                        input.readFully(bytes)
                        
                        // 解析响应头（前几个字节包含 requestId）
                        // 格式：requestId(8字节，大端序) + 二进制数据
                        if (length >= 8) {
                            val requestIdBytes = ByteArray(8)
                            System.arraycopy(bytes, 0, requestIdBytes, 0, 8)
                            val requestId = ByteBuffer.wrap(requestIdBytes).getLong()
                            
                            // 提取实际的二进制数据（跳过 requestId）
                            val binaryData = ByteArray(length - 8)
                            System.arraycopy(bytes, 8, binaryData, 0, length - 8)
                            
                            val callback = pendingBinaryRequests.remove(requestId)
                            callback?.callback(binaryData)
                        } else {
                            println("[TcpTransport] ⚠️ 二进制响应格式错误: 长度不足 8 字节")
                        }
                    }
                    MessageType.NOTIFICATION -> {
                        // 读取 JSON 数据
                        val bytes = ByteArray(length)
                        input.readFully(bytes)
                        val json = String(bytes, Charsets.UTF_8)
                        val data = gson.fromJson(json, JsonObject::class.java)
                        
                        // 处理通知消息（Mac → JVM，如 callKotlinMethod）
                        handleNotification(data)
                    }
                    MessageType.REQUEST -> {
                        // 客户端不应收到请求消息
                        println("[TcpTransport] ⚠️ 收到意外的请求消息")
                        // 跳过数据
                        val bytes = ByteArray(length)
                        input.readFully(bytes)
                    }
                }
            } catch (e: java.net.SocketTimeoutException) {
                // 读取超时，继续循环（长连接保持）
                continue
            } catch (e: java.io.EOFException) {
                // 连接关闭
                handleConnectionLost()
                break
            } catch (e: Exception) {
                if (socket?.isConnected == true) {
                    println("[TcpTransport] ❌ 接收消息异常: ${e.message}")
                    Thread.sleep(10)
                } else {
                    // 连接已断开
                    handleConnectionLost()
                    break
                }
            }
        }
        
        println("[TcpTransport] 🛑 接收循环已退出: instanceId=$instanceId")
    }
    
    /**
     * 处理连接丢失
     */
    private fun handleConnectionLost() {
        isConnected = false
        closeConnection()
        println("[TcpTransport] 🔌 连接已断开: instanceId=$instanceId")
        
        // 触发断开回调
        onDisconnected?.invoke()
        
        // 启动重连（如果还没启动）
        if (reconnectScheduler == null) {
            startReconnectScheduler()
        }
    }
    
    /**
     * 处理通知消息（Mac → JVM）
     */
    private fun handleNotification(data: JsonObject) {
        val type = data.get("type")?.asString
        when (type) {
            "callKotlinMethod" -> {
                val requestId = data.get("requestId")?.asString ?: ""
                val sequence = data.get("sequence")?.asLong ?: -1L
                val methodId = data.get("methodId")?.asInt ?: 0
                val argsArray = data.getAsJsonArray("args")
                val args = argsArray?.map { element ->
                    when {
                        element.isJsonNull -> null
                        element.isJsonObject -> element.toString()
                        else -> element.asString
                    }
                } ?: emptyList()
                // 调用回调
                onCallKotlinMethodNotification?.invoke(requestId, sequence, methodId, args)
            }
            "refresh" -> {
                val instanceId = data.get("instanceId")?.asString
                println("[TcpTransport] 🔄 收到 refresh 通知: instanceId=$instanceId")
                // 调用回调
                onRefreshNotification?.invoke(instanceId)
            }
            else -> {
                println("[TcpTransport] 📨 收到未知类型的通知: $type")
            }
        }
    }
    
    override fun destroy() {
        // 停止重连定时器
        stopReconnectScheduler()
        
        // 停止接收线程
        receiveExecutor.shutdown()
        try {
            if (!receiveExecutor.awaitTermination(2, TimeUnit.SECONDS)) {
                receiveExecutor.shutdownNow()
            }
        } catch (e: Exception) {
            println("[TcpTransport] ⚠️ 关闭接收线程失败: ${e.message}")
        }
        
        isConnected = false
        
        // 关闭连接
        closeConnection()
        
        // 清理所有状态
        pendingRequests.clear()
        pendingBinaryRequests.clear()
        cacheLock.withLock {
            requestCache.clear()
        }
        
        onCallKotlinMethodNotification = null
        onRefreshNotification = null
        onConnected = null
        onDisconnected = null
        onCachedRequestsFlushed = null
        
        println("[TcpTransport] 🧹 已销毁 TCP 传输层: instanceId=$instanceId")
    }
}

