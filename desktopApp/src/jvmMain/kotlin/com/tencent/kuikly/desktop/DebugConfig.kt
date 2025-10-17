package com.tencent.kuikly.desktop

/**
 * 桌面端调试配置
 * 用于控制调试日志和性能参数
 */
object DebugConfig {
    
    // 调试日志开关
    var DEBUG_ENABLED = System.getProperty("kuikly.debug", "false").toBoolean()
    
    /**
     * 调试日志输出
     */
    fun debug(tag: String, message: String) {
        if (DEBUG_ENABLED) {
            println("[$tag] $message")
        }
    }
    

    /**
     * 错误日志输出（始终输出）
     */
    fun error(tag: String, message: String, throwable: Throwable? = null) {
        println("[$tag] ❌ $message")
        throwable?.printStackTrace()
    }

    /**
     * 信息日志输出（始终输出）
     */
    fun info(tag: String, message: String) {
        println("[$tag] ℹ️ $message")
    }
    
    /**
     * 成功日志输出（始终输出）
     */
    fun success(tag: String, message: String) {
        println("[$tag] ✅ $message")
    }
    
}
