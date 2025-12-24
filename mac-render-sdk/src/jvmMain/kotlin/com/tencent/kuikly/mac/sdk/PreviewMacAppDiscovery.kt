package com.tencent.kuikly.mac.sdk

import com.google.gson.Gson
import com.google.gson.JsonObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

/**
 * PreviewMacApp 端口发现器
 * 
 * 用于发现 PreviewMacApp 的实际 TCP 端口，支持多种发现方式：
 * 1. 从配置文件读取服务发现端口，然后通过 HTTP 端点获取 TCP 端口
 * 2. 扫描端口范围（8765-8775）找到服务发现端点
 * 3. 回退到默认端口（向后兼容）
 */
class PreviewMacAppDiscovery {
    companion object {
        // 服务发现端口范围
        private const val DISCOVERY_PORT_START = 8765
        private const val DISCOVERY_PORT_END = 8775
        
        // 默认 TCP 端口（向后兼容）
        private const val DEFAULT_TCP_PORT = 9528
        
        // 配置文件路径
        private val configDir = File(System.getProperty("user.home"), "Library/Application Support/Kuikly")
        private val discoveryPortConfigFile = File(configDir, "discovery-port")
    }
    
    private val gson = Gson()
    
    /**
     * 发现 TCP 端口
     * 
     * @return TCP 端口，如果失败返回 null
     */
    fun discoverTcpPort(): Int? {
        // 1. 优先从配置文件读取服务发现端口
        val configDiscoveryPort = readDiscoveryPortFromConfig()
        if (configDiscoveryPort != null) {
            val tcpPort = tryDiscoveryEndpoint(configDiscoveryPort)
            if (tcpPort != null) {
                println("[Discovery] ✅ 通过配置文件发现端口: discovery=$configDiscoveryPort, tcp=$tcpPort")
                return tcpPort
            }
        }
        
        // 2. 扫描端口范围（8765-8775）
        println("[Discovery] 🔍 扫描端口范围 ($DISCOVERY_PORT_START-$DISCOVERY_PORT_END)...")
        for (port in DISCOVERY_PORT_START..DISCOVERY_PORT_END) {
            val tcpPort = tryDiscoveryEndpoint(port)
            if (tcpPort != null) {
                // 保存找到的端口到配置文件
                saveDiscoveryPort(port)
                println("[Discovery] ✅ 通过端口扫描发现端口: discovery=$port, tcp=$tcpPort")
                return tcpPort
            }
        }
        
        // 3. 回退到默认端口（向后兼容）
        println("[Discovery] ⚠️ 未找到服务发现端点，使用默认 TCP 端口: $DEFAULT_TCP_PORT")
        return DEFAULT_TCP_PORT
    }
    
    /**
     * 尝试通过服务发现端点获取 TCP 端口
     */
    private fun tryDiscoveryEndpoint(discoveryPort: Int): Int? {
        return try {
            val url = URL("http://localhost:$discoveryPort/discover")
            val connection = url.openConnection() as HttpURLConnection
            
            connection.requestMethod = "GET"
            connection.connectTimeout = 500  // 短超时，快速失败
            connection.readTimeout = 500
            
            val responseCode = connection.responseCode
            if (responseCode == 200) {
                val response = connection.inputStream.bufferedReader().use { it.readText() }
                val json = gson.fromJson(response, JsonObject::class.java)
                
                if (json.has("tcpPort") && json["tcpPort"].isJsonPrimitive) {
                    json["tcpPort"].asInt
                } else {
                    null
                }
            } else {
                null
            }
        } catch (e: Exception) {
            // 端口不可用或连接失败，返回 null
            null
        }
    }
    
    /**
     * 从配置文件读取服务发现端口
     */
    private fun readDiscoveryPortFromConfig(): Int? {
        return try {
            if (discoveryPortConfigFile.exists()) {
                val content = discoveryPortConfigFile.readText().trim()
                content.toIntOrNull()
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }
    
    /**
     * 保存服务发现端口到配置文件
     */
    private fun saveDiscoveryPort(port: Int) {
        try {
            if (!configDir.exists()) {
                configDir.mkdirs()
            }
            discoveryPortConfigFile.writeText(port.toString())
        } catch (e: Exception) {
            println("[Discovery] ⚠️ 保存服务发现端口失败: ${e.message}")
        }
    }
}

