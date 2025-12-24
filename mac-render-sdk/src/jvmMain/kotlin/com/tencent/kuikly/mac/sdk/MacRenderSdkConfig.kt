package com.tencent.kuikly.mac.sdk

/**
 * Mac 渲染 SDK 全局配置管理器
 * 
 * 用于管理 SDK 的全局配置，包括服务器地址和端口。
 * 所有配置由 SDK 内部自动管理，无需外部设置。
 */
internal object MacRenderSdkConfig {
    /**
     * 默认服务器地址
     */
    private const val DEFAULT_HOST = "localhost"
    
    /**
     * 默认服务器端口
     */
    private const val DEFAULT_PORT = 9528
    
    // 缓存发现的端口，避免重复发现
    @Volatile
    private var cachedPort: Int? = null
    
    /**
     * 获取服务器地址（始终返回默认值，由 SDK 内部管理）
     */
    @JvmStatic
    fun getServerHost(): String {
        return DEFAULT_HOST
    }
    
    /**
     * 获取服务器端口（自动发现并缓存）
     */
    @JvmStatic
    fun getServerPort(): Int {
        // 如果已缓存，直接返回
        cachedPort?.let { return it }
        
        // 尝试自动发现端口
        val discovery = PreviewMacAppDiscovery()
        val discoveredPort = discovery.discoverTcpPort()
        
        if (discoveredPort != null && discoveredPort != DEFAULT_PORT) {
            println("[MacRenderSdkConfig] 🔍 自动发现 TCP 端口: $discoveredPort")
            cachedPort = discoveredPort
            return discoveredPort
        }
        
        // 使用默认端口
        cachedPort = DEFAULT_PORT
        return DEFAULT_PORT
    }
    
    /**
     * 清除缓存的端口（用于重新发现）
     */
    @JvmStatic
    fun clearCachedPort() {
        cachedPort = null
        println("[MacRenderSdkConfig] 🔄 已清除缓存的端口")
    }
    
    /**
     * 清除所有缓存（主要用于测试）
     */
    @JvmStatic
    internal fun clearCache() {
        cachedPort = null
    }
}

