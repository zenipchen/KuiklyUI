package com.tencent.kuikly.mac.sdk.transport

import com.google.gson.Gson
import com.google.gson.JsonObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * HTTP 传输层实现
 * 
 * 使用 HttpURLConnection 实现 HTTP 通信
 */
class HttpTransport(
    private val config: Transport.Config
) : Transport {
    
    private val gson = Gson()
    private var instanceId: String = ""
    
    override fun init(instanceId: String) {
        this.instanceId = instanceId
    }
    
    override fun get(path: String, requestType: Transport.RequestType): JsonObject? {
        val url = URL("http://${config.serverHost}:${config.serverPort}$path")
        val connection = url.openConnection() as HttpURLConnection
        
        return try {
            connection.requestMethod = "GET"
            connection.connectTimeout = config.connectTimeout.toInt()
            connection.readTimeout = config.readTimeout.toInt()
            
            if (connection.responseCode == 200) {
                val response = connection.inputStream.bufferedReader().readText()
                gson.fromJson(response, JsonObject::class.java)
            } else {
                println("[HttpTransport] ⚠️ HTTP GET 失败: $path, status=${connection.responseCode}")
                null
            }
        } catch (e: Exception) {
            println("[HttpTransport] ❌ HTTP GET 异常: $path, error=${e.message}")
            null
        } finally {
            connection.disconnect()
        }
    }
    
    override fun post(path: String, body: Map<String, Any?>, requestType: Transport.RequestType): JsonObject? {
        val url = URL("http://${config.serverHost}:${config.serverPort}$path")
        val connection = url.openConnection() as HttpURLConnection
        
        return try {
            connection.requestMethod = "POST"
            connection.doOutput = true
            connection.setRequestProperty("Content-Type", "application/json")
            connection.connectTimeout = config.connectTimeout.toInt()
            connection.readTimeout = config.readTimeout.toInt()
            
            val jsonBody = gson.toJson(body)
            connection.outputStream.bufferedWriter().use { it.write(jsonBody) }
            
            if (connection.responseCode == 200) {
                val response = connection.inputStream.bufferedReader().readText()
                gson.fromJson(response, JsonObject::class.java)
            } else {
                println("[HttpTransport] ⚠️ HTTP POST 失败: $path, status=${connection.responseCode}")
                null
            }
        } catch (e: Exception) {
            println("[HttpTransport] ❌ HTTP POST 异常: $path, error=${e.message}")
            null
        } finally {
            connection.disconnect()
        }
    }
    
    override fun getBytes(path: String): ByteArray? {
        val url = URL("http://${config.serverHost}:${config.serverPort}$path")
        val connection = url.openConnection() as HttpURLConnection
        
        return try {
            connection.requestMethod = "GET"
            connection.connectTimeout = config.connectTimeout.toInt()
            connection.readTimeout = config.readTimeout.toInt()
            
            val responseCode = connection.responseCode
            if (responseCode == 200) {
                connection.inputStream.readBytes()
            } else {
                val errorBody = connection.errorStream?.bufferedReader()?.readText() ?: "无响应体"
                println("[HttpTransport] ⚠️ HTTP GET Bytes 失败: $path, status=$responseCode, body=$errorBody")
                null
            }
        } catch (e: Exception) {
            println("[HttpTransport] ❌ HTTP GET Bytes 异常: $path, error=${e.message}")
            null
        } finally {
            connection.disconnect()
        }
    }
    
    override fun destroy() {
        // HTTP 传输层无需特殊清理，连接已通过 disconnect() 关闭
        println("[HttpTransport] 🧹 已销毁 HTTP 传输层: instanceId=$instanceId")
    }
}

