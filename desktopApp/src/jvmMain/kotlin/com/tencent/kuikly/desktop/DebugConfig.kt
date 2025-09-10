package com.tencent.kuikly.desktop

/**
 * 桌面端调试配置
 * 用于控制调试日志和性能参数
 */
object DebugConfig {
    
    // 调试日志开关
    var DEBUG_ENABLED = System.getProperty("kuikly.debug", "false").toBoolean()
    
    // 性能日志开关（更详细的性能信息）
    var PERFORMANCE_DEBUG_ENABLED = System.getProperty("kuikly.performance.debug", "false").toBoolean()
    
    // 渲染日志开关
    var RENDER_DEBUG_ENABLED = System.getProperty("kuikly.render.debug", "false").toBoolean()
    
    // Bridge 通信日志开关
    var BRIDGE_DEBUG_ENABLED = System.getProperty("kuikly.bridge.debug", "false").toBoolean()
    
    // 页面生命周期日志开关
    var LIFECYCLE_DEBUG_ENABLED = System.getProperty("kuikly.lifecycle.debug", "false").toBoolean()
    
    // 线程调试日志开关
    var THREAD_DEBUG_ENABLED = System.getProperty("kuikly.thread.debug", "false").toBoolean()
    
    // 性能优化开关
    var PERFORMANCE_OPTIMIZATION_ENABLED = System.getProperty("kuikly.performance.optimization", "true").toBoolean()
    
    // 内存优化开关
    var MEMORY_OPTIMIZATION_ENABLED = System.getProperty("kuikly.memory.optimization", "true").toBoolean()
    
    // GPU 加速开关
    var GPU_ACCELERATION_ENABLED = System.getProperty("kuikly.gpu.acceleration", "true").toBoolean()
    
    /**
     * 调试日志输出
     */
    fun debug(tag: String, message: String) {
        if (DEBUG_ENABLED) {
            println("[$tag] $message")
        }
    }
    
    /**
     * 性能调试日志输出
     */
    fun performanceDebug(tag: String, message: String) {
        if (PERFORMANCE_DEBUG_ENABLED) {
            println("[$tag] ⚡ $message")
        }
    }
    
    /**
     * 渲染调试日志输出
     */
    fun renderDebug(tag: String, message: String) {
        if (RENDER_DEBUG_ENABLED) {
            println("[$tag] 🎨 $message")
        }
    }
    
    /**
     * Bridge 调试日志输出
     */
    fun bridgeDebug(tag: String, message: String) {
        if (BRIDGE_DEBUG_ENABLED) {
            println("[$tag] 🌉 $message")
        }
    }
    
    /**
     * 生命周期调试日志输出
     */
    fun lifecycleDebug(tag: String, message: String) {
        if (LIFECYCLE_DEBUG_ENABLED) {
            println("[$tag] 🔄 $message")
        }
    }
    
    /**
     * 线程调试日志输出
     */
    fun threadDebug(tag: String, message: String) {
        if (THREAD_DEBUG_ENABLED) {
            println("[$tag] 🧵 $message")
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
     * 警告日志输出（始终输出）
     */
    fun warning(tag: String, message: String) {
        println("[$tag] ⚠️ $message")
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
    
    /**
     * 获取性能优化参数
     */
    fun getPerformanceArgs(): List<String> {
        val args = mutableListOf<String>()
        
        if (PERFORMANCE_OPTIMIZATION_ENABLED) {
            // 基础性能优化
            args.addAll(listOf(
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding", 
                "--disable-backgrounding-occluded-windows",
                "--disable-ipc-flooding-protection",
                "--disable-hang-monitor",
                "--disable-prompt-on-repost",
                "--disable-domain-reliability",
                "--disable-features=TranslateUI",
                "--disable-features=BlinkGenPropertyTrees",
                "--disable-features=CalculateNativeWinOcclusion"
            ))
            
            // 内存优化
            if (MEMORY_OPTIMIZATION_ENABLED) {
                args.addAll(listOf(
                    "--memory-pressure-off",
                    "--max_old_space_size=512",
                    "--disable-background-networking",
                    "--disable-sync",
                    "--disable-default-apps"
                ))
            }
            
            // GPU 加速
            if (GPU_ACCELERATION_ENABLED) {
                args.addAll(listOf(
                    "--enable-gpu",
                    "--enable-gpu-rasterization",
                    "--enable-zero-copy",
                    "--enable-hardware-overlays",
                    "--enable-accelerated-2d-canvas",
                    "--enable-accelerated-video-decode"
                ))
            }
        }
        
        return args
    }
    
    /**
     * 获取调试参数
     */
    fun getDebugArgs(): List<String> {
        val args = mutableListOf<String>()
        
        if (!DEBUG_ENABLED) {
            // 生产环境：减少日志输出
            args.addAll(listOf(
                "--disable-logging",
                "--log-level=3", // 只显示错误和致命错误
                "--disable-gpu-logging",
                "--silent"
            ))
        } else {
            // 调试环境：启用详细日志
            args.addAll(listOf(
                "--enable-logging",
                "--log-level=0", // 显示所有日志
                "--v=1"
            ))
        }
        
        return args
    }
}
