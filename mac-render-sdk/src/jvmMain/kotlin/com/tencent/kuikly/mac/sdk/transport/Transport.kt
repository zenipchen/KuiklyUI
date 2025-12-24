package com.tencent.kuikly.mac.sdk.transport

import com.google.gson.JsonObject

/**
 * 通信传输层接口
 * 
 * 定义统一的通信接口，支持不同的底层实现（HTTP、TCP 等）
 * 
 * @param serverHost 服务器地址
 * @param serverPort 服务器端口
 */
interface Transport {
    
    /**
     * 连接配置
     */
    data class Config(
        val serverHost: String,
        var serverPort: Int,  // 改为 var，允许动态更新端口
        val connectTimeout: Long = 1000, // 连接超时（毫秒）
        val readTimeout: Long = 1000     // 读取超时（毫秒）
    )
    
    /**
     * 请求类型
     */
    enum class RequestType {
        /** callKotlinMethod 轮询 */
        CALL_KOTLIN_METHOD,
        /** callNative 请求 */
        CALL_NATIVE,
        /** 其他通用请求 */
        GENERAL
    }
    
    /**
     * 初始化传输层
     * @param instanceId 实例 ID
     */
    fun init(instanceId: String)
    
    /**
     * 发送 GET 请求
     * @param path 请求路径
     * @param requestType 请求类型（用于连接池选择）
     * @return 响应 JSON 对象，失败返回 null
     */
    fun get(path: String, requestType: RequestType = RequestType.GENERAL): JsonObject?
    
    /**
     * 发送 POST 请求
     * @param path 请求路径
     * @param body 请求体
     * @param requestType 请求类型（用于连接池选择）
     * @return 响应 JSON 对象，失败返回 null
     */
    fun post(path: String, body: Map<String, Any?>, requestType: RequestType = RequestType.GENERAL): JsonObject?
    
    /**
     * 发送 GET 请求（返回字节数组）
     * @param path 请求路径
     * @return 响应字节数组，失败返回 null
     */
    fun getBytes(path: String): ByteArray?
    
    /**
     * 销毁传输层，释放资源
     */
    fun destroy()
}

