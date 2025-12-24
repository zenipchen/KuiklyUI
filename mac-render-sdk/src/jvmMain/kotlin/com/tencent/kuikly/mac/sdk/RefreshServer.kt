package com.tencent.kuikly.mac.sdk

import com.google.gson.Gson
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStream
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ConcurrentHashMap

/**
 * 刷新服务器 - 接收来自 PreviewMacApp 的刷新请求
 * 
 * @deprecated 已废弃。refresh 功能已通过 TCP NOTIFICATION 实现，不再需要独立的 HTTP 服务器。
 * 请使用 TCP 长连接发送 refresh 通知。
 * 
 * 该服务器监听来自 Mac 端的刷新请求，并调用对应的 runner.refresh() 方法
 * 
 * 设计说明：
 * - 支持多个实例（不同端口），但共享全局 runner 映射表
 * - 当有 runner 注册到全局映射表时，自动启动默认实例
 * - 可以创建多个 RefreshServer 实例监听不同端口
 * - 所有实例共享同一个 runner 映射表，确保任何实例都能处理刷新请求
 */
@Deprecated(
    message = "refresh 功能已通过 TCP NOTIFICATION 实现，不再需要 RefreshServer",
    replaceWith = ReplaceWith("使用 PreviewTcpServer.sendRefreshNotification() 通过 TCP 发送 refresh 通知")
)
class RefreshServer(
    private val port: Int = 8766
) {
    private val gson = Gson()
    private var serverSocket: ServerSocket? = null
    private var isRunning = false
    
    companion object {
        private const val DEFAULT_PORT = 8766
        
        // 全局共享的 runner 映射表（所有 RefreshServer 实例共享）
        private val globalInstanceIdToRunner: MutableMap<String, KuiklyMacPreviewRunner> = ConcurrentHashMap()
        
        // 全局默认实例（懒加载）
        @Volatile
        private var defaultInstance: RefreshServer? = null
        
        /**
         * 获取全局默认实例（懒加载，首次调用时创建）
         * @param port 服务器端口，仅在首次调用时生效
         */
        @JvmStatic
        fun getDefaultInstance(port: Int = DEFAULT_PORT): RefreshServer {
            return defaultInstance ?: synchronized(this) {
                defaultInstance ?: RefreshServer(port).also { 
                    defaultInstance = it
                }
            }
        }
        
        /**
         * 获取全局 runner 映射表（供所有实例共享）
         */
        @JvmStatic
        internal fun getGlobalRunnerMap(): MutableMap<String, KuiklyMacPreviewRunner> {
            return globalInstanceIdToRunner
        }
        
        /**
         * 重置全局状态（主要用于测试）
         */
        @JvmStatic
        internal fun reset() {
            defaultInstance?.stop()
            defaultInstance = null
            globalInstanceIdToRunner.clear()
        }
    }
    
    /**
     * 注册 runner（当创建新的预览窗口时调用）
     * 首次注册到全局映射表时，自动启动默认实例
     */
    fun registerRunner(instanceId: String, runner: KuiklyMacPreviewRunner) {
        val wasEmpty = globalInstanceIdToRunner.isEmpty()
        globalInstanceIdToRunner[instanceId] = runner
        println("[RefreshServer] ✅ 注册 runner: instanceId=$instanceId (总数: ${globalInstanceIdToRunner.size})")
        
        // 首次注册时，自动启动默认实例（如果还没有启动）
        if (wasEmpty) {
            val default = getDefaultInstance()
            if (!default.isServerRunning) {
                default.start()
            }
        }
    }
    
    /**
     * 注销 runner（当关闭预览窗口时调用）
     */
    fun unregisterRunner(instanceId: String) {
        if (globalInstanceIdToRunner.remove(instanceId) != null) {
            println("[RefreshServer] 🧹 注销 runner: instanceId=$instanceId (剩余: ${globalInstanceIdToRunner.size})")
        }
    }
    
    /**
     * 检查服务器是否正在运行
     */
    val isServerRunning: Boolean
        get() = isRunning
    
    /**
     * 启动服务器
     */
    fun start() {
        if (isRunning) {
            println("[RefreshServer] ⚠️ 服务器已在运行")
            return
        }
        
        Thread {
            try {
                serverSocket = ServerSocket(port)
                isRunning = true
                println("[RefreshServer] ✅ 刷新服务器已启动，端口: $port")
                
                while (isRunning) {
                    try {
                        val clientSocket = serverSocket?.accept()
                        if (clientSocket != null) {
                            Thread {
                                handleRequest(clientSocket)
                            }.start()
                        }
                    } catch (e: Exception) {
                        if (isRunning) {
                            println("[RefreshServer] ❌ 接受连接失败: ${e.message}")
                        }
                    }
                }
            } catch (e: Exception) {
                println("[RefreshServer] ❌ 启动服务器失败: ${e.message}")
                e.printStackTrace()
            }
        }.start()
    }
    
    /**
     * 停止服务器
     */
    fun stop() {
        isRunning = false
        try {
            serverSocket?.close()
            println("[RefreshServer] 🛑 刷新服务器已停止")
        } catch (e: Exception) {
            println("[RefreshServer] ⚠️ 停止服务器失败: ${e.message}")
        }
    }
    
    /**
     * 处理请求
     */
    private fun handleRequest(clientSocket: Socket) {
        try {
            val reader = BufferedReader(InputStreamReader(clientSocket.getInputStream()))
            val output: OutputStream = clientSocket.getOutputStream()
            
            // 读取请求行
            val requestLine = reader.readLine() ?: return
            println("[RefreshServer] 📥 收到请求: $requestLine")
            
            // 解析请求
            if (requestLine.startsWith("POST /refresh")) {
                // 读取请求头
                var contentLength = 0
                var line: String?
                while (reader.readLine().also { line = it } != null && line!!.isNotEmpty()) {
                    if (line!!.startsWith("Content-Length:")) {
                        contentLength = line!!.substringAfter(":").trim().toIntOrNull() ?: 0
                    }
                }
                
                // 读取请求体
                val body = if (contentLength > 0) {
                    val buffer = CharArray(contentLength)
                    reader.read(buffer, 0, contentLength)
                    String(buffer)
                } else {
                    ""
                }
                
                // 解析 JSON
                val requestData = gson.fromJson(body, Map::class.java) as? Map<*, *>
                val instanceId = requestData?.get("instanceId") as? String
                
                if (instanceId != null) {
                    // 从全局映射表查找 runner（所有实例共享）
                    val runner = globalInstanceIdToRunner[instanceId]
                    if (runner != null) {
                        // 调用 refresh
                        val sdk = runner.getSdk()
                        if (sdk != null) {
                            sdk.refresh()
                            println("[RefreshServer] ✅ 已触发刷新: instanceId=$instanceId")
                            
                            // 发送成功响应
                            val response = """HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 25

{"status":"ok","message":"refreshed"}"""
                            output.write(response.toByteArray())
                        } else {
                            println("[RefreshServer] ⚠️ SDK 为 null: instanceId=$instanceId")
                            sendErrorResponse(output, "SDK not available")
                        }
                    } else {
                        println("[RefreshServer] ⚠️ 未找到 runner: instanceId=$instanceId")
                        sendErrorResponse(output, "Runner not found for instanceId: $instanceId")
                    }
                } else {
                    println("[RefreshServer] ⚠️ 缺少 instanceId")
                    sendErrorResponse(output, "Missing instanceId")
                }
            } else {
                sendErrorResponse(output, "Invalid request")
            }
            
            output.flush()
            clientSocket.close()
        } catch (e: Exception) {
            println("[RefreshServer] ❌ 处理请求失败: ${e.message}")
            e.printStackTrace()
        }
    }
    
    /**
     * 发送错误响应
     */
    private fun sendErrorResponse(output: OutputStream, message: String) {
        val response = """HTTP/1.1 400 Bad Request
Content-Type: application/json
Content-Length: ${message.length + 20}

{"status":"error","message":"$message"}"""
        output.write(response.toByteArray())
    }
}

