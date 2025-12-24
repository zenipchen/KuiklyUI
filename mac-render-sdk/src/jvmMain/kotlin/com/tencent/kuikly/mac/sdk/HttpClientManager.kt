package com.tencent.kuikly.mac.sdk

import java.net.http.HttpClient
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors

/**
 * HTTP 客户端连接池管理器
 * 
 * 为每个 instanceId 和请求类型创建独立的连接池，实现：
 * 1. 不同 instanceId 使用不同的连接池
 * 2. callKotlinMethod 和 callNative 使用不同的连接池
 */
object HttpClientManager {
    
    /**
     * 请求类型枚举
     */
    enum class RequestType {
        /** callKotlinMethod 轮询专用 */
        CALL_KOTLIN_METHOD,
        /** callNative 请求专用 */
        CALL_NATIVE,
        /** 其他通用请求（ping, render, destroy, touch, screenshot） */
        GENERAL
    }
    
    /**
     * 连接池存储：instanceId -> RequestType -> HttpClient
     */
    private val clientPools = ConcurrentHashMap<String, ConcurrentHashMap<RequestType, HttpClient>>()
    
    /**
     * 获取或创建 HTTP 客户端
     * 
     * @param instanceId 实例 ID
     * @param requestType 请求类型
     * @param serverHost 服务器地址
     * @param serverPort 服务器端口
     * @return HTTP 客户端实例
     */
    fun getOrCreateClient(
        instanceId: String,
        requestType: RequestType,
        serverHost: String,
        serverPort: Int
    ): HttpClient {
        return clientPools.computeIfAbsent(instanceId) {
            ConcurrentHashMap()
        }.computeIfAbsent(requestType) {
            createHttpClient(instanceId, requestType, serverHost, serverPort)
        }
    }
    
    /**
     * 创建 HTTP 客户端（带连接池配置）
     */
    private fun createHttpClient(
        instanceId: String,
        requestType: RequestType,
        serverHost: String,
        serverPort: Int
    ): HttpClient {
        val poolName = when (requestType) {
            RequestType.CALL_KOTLIN_METHOD -> "callKotlinMethod"
            RequestType.CALL_NATIVE -> "callNative"
            RequestType.GENERAL -> "general"
        }
        
        println("[HttpClientManager] 🔧 创建 HTTP 客户端: instanceId=$instanceId, type=$poolName")
        
        // 创建连接池配置
        // 注意：Java HttpClient 的连接池是自动管理的，我们通过不同的 HttpClient 实例来实现隔离
        // 使用共享的线程池，避免创建过多线程
        return HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(1))
            // 不设置 executor，使用默认的共享线程池，减少线程数
            // 连接池大小由系统自动管理，支持 Keep-Alive 和连接复用
            .build()
    }
    
    /**
     * 移除指定 instanceId 的所有连接池
     */
    fun removeClients(instanceId: String) {
        val clients = clientPools.remove(instanceId)
        if (clients != null) {
            println("[HttpClientManager] 🧹 已清理 instanceId=$instanceId 的连接池 (${clients.size} 个)")
        }
    }
    
    /**
     * 获取连接池统计信息
     */
    fun getPoolStats(): Map<String, Int> {
        return clientPools.mapValues { it.value.size }
    }
}

