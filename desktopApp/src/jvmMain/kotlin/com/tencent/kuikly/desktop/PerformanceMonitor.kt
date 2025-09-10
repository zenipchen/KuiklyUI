package com.tencent.kuikly.desktop

import java.lang.management.ManagementFactory
import java.lang.management.MemoryMXBean
import java.lang.management.MemoryUsage
import java.lang.management.ThreadMXBean
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

/**
 * 性能监控工具
 * 用于监控内存使用、CPU 使用率、GC 情况等
 */
object PerformanceMonitor {
    
    private var isMonitoring = false
    private var scheduler: ScheduledExecutorService? = null
    private val memoryBean: MemoryMXBean = ManagementFactory.getMemoryMXBean()
    private val threadBean: ThreadMXBean = ManagementFactory.getThreadMXBean()
    
    // 性能统计
    private var startTime = 0L
    private var lastGcTime = 0L
    private var gcCount = 0L
    
    /**
     * 开始性能监控
     */
    fun startMonitoring(intervalSeconds: Long = 5) {
        if (isMonitoring) {
            DebugConfig.warning("PerformanceMonitor", "性能监控已在运行")
            return
        }
        
        if (!DebugConfig.PERFORMANCE_DEBUG_ENABLED) {
            DebugConfig.debug("PerformanceMonitor", "性能调试未启用，跳过监控")
            return
        }
        
        isMonitoring = true
        startTime = System.currentTimeMillis()
        scheduler = Executors.newSingleThreadScheduledExecutor { r ->
            Thread(r, "PerformanceMonitor").apply { isDaemon = true }
        }
        
        DebugConfig.info("PerformanceMonitor", "开始性能监控，间隔: ${intervalSeconds}秒")
        
        scheduler?.scheduleAtFixedRate({
            try {
                logPerformanceMetrics()
            } catch (e: Exception) {
                DebugConfig.error("PerformanceMonitor", "性能监控异常", e)
            }
        }, 0, intervalSeconds, TimeUnit.SECONDS)
    }
    
    /**
     * 停止性能监控
     */
    fun stopMonitoring() {
        if (!isMonitoring) {
            return
        }
        
        isMonitoring = false
        scheduler?.shutdown()
        scheduler = null
        
        val totalTime = System.currentTimeMillis() - startTime
        DebugConfig.info("PerformanceMonitor", "性能监控已停止，总运行时间: ${totalTime}ms")
    }
    
    /**
     * 记录性能指标
     */
    private fun logPerformanceMetrics() {
        val runtime = Runtime.getRuntime()
        val memoryUsage = memoryBean.heapMemoryUsage
        val nonHeapUsage = memoryBean.nonHeapMemoryUsage
        
        // 内存使用情况
        val usedMemory = memoryUsage.used / 1024 / 1024 // MB
        val maxMemory = memoryUsage.max / 1024 / 1024 // MB
        val memoryUsagePercent = (usedMemory.toDouble() / maxMemory * 100).toInt()
        
        // GC 情况
        val currentGcCount = getGcCount()
        val gcDelta = currentGcCount - gcCount
        gcCount = currentGcCount
        
        // 线程情况
        val threadCount = threadBean.threadCount
        val peakThreadCount = threadBean.peakThreadCount
        
        // 运行时间
        val uptime = System.currentTimeMillis() - startTime
        
        DebugConfig.performanceDebug("PerformanceMonitor", """
            📊 性能指标 (运行时间: ${uptime}ms):
            💾 内存使用: ${usedMemory}MB / ${maxMemory}MB (${memoryUsagePercent}%)
            🗑️  GC 次数: +${gcDelta} (总计: ${gcCount})
            🧵 线程数: ${threadCount} (峰值: ${peakThreadCount})
            📈 堆内存: ${formatBytes(memoryUsage.used)} / ${formatBytes(memoryUsage.max)}
            📉 非堆内存: ${formatBytes(nonHeapUsage.used)} / ${formatBytes(nonHeapUsage.max)}
        """.trimIndent())
        
        // 内存警告
        if (memoryUsagePercent > 80) {
            DebugConfig.warning("PerformanceMonitor", "内存使用率过高: ${memoryUsagePercent}%")
        }
        
        if (memoryUsagePercent > 90) {
            DebugConfig.error("PerformanceMonitor", "内存使用率严重过高: ${memoryUsagePercent}%，建议优化")
        }
    }
    
    /**
     * 获取 GC 次数
     */
    private fun getGcCount(): Long {
        return try {
            ManagementFactory.getGarbageCollectorMXBeans().sumOf { it.collectionCount }
        } catch (e: Exception) {
            DebugConfig.debug("PerformanceMonitor", "无法获取 GC 统计: ${e.message}")
            0L
        }
    }
    
    /**
     * 格式化字节数
     */
    private fun formatBytes(bytes: Long): String {
        val kb = bytes / 1024
        val mb = kb / 1024
        val gb = mb / 1024
        
        return when {
            gb > 0 -> "${gb}GB"
            mb > 0 -> "${mb}MB"
            kb > 0 -> "${kb}KB"
            else -> "${bytes}B"
        }
    }
    
    /**
     * 获取当前内存使用情况
     */
    fun getCurrentMemoryUsage(): String {
        val memoryUsage = memoryBean.heapMemoryUsage
        val used = memoryUsage.used / 1024 / 1024
        val max = memoryUsage.max / 1024 / 1024
        val percent = (used.toDouble() / max * 100).toInt()
        
        return "内存使用: ${used}MB / ${max}MB (${percent}%)"
    }
    
    /**
     * 获取当前线程数
     */
    fun getCurrentThreadCount(): String {
        val count = threadBean.threadCount
        val peak = threadBean.peakThreadCount
        return "线程数: ${count} (峰值: ${peak})"
    }
    
    /**
     * 强制垃圾回收
     */
    fun forceGc() {
        DebugConfig.debug("PerformanceMonitor", "执行强制垃圾回收...")
        System.gc()
        Thread.sleep(100) // 等待 GC 完成
        DebugConfig.debug("PerformanceMonitor", "垃圾回收完成")
    }
    
    /**
     * 获取性能摘要
     */
    fun getPerformanceSummary(): String {
        val uptime = System.currentTimeMillis() - startTime
        val memoryUsage = getCurrentMemoryUsage()
        val threadCount = getCurrentThreadCount()
        
        return """
            🚀 Kuikly Desktop 性能摘要:
            ⏱️  运行时间: ${uptime}ms
            💾 $memoryUsage
            🧵 $threadCount
            🗑️  GC 次数: ${gcCount}
        """.trimIndent()
    }
}
