package com.tencent.kuikly.desktop

import java.lang.management.ManagementFactory
import java.lang.management.ThreadInfo
import java.lang.management.ThreadMXBean
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

/**
 * 线程监控工具
 * 用于监控 JVM 线程状态、死锁检测、性能分析等
 */
object ThreadMonitor {
    
    private val threadBean: ThreadMXBean = ManagementFactory.getThreadMXBean()
    private var isMonitoring = false
    private var scheduler: ScheduledExecutorService? = null
    private val threadHistory = ConcurrentHashMap<String, ThreadStats>()
    
    // 线程统计信息
    data class ThreadStats(
        val name: String,
        val state: Thread.State,
        val cpuTime: Long,
        val userTime: Long,
        var lastSeen: Long = System.currentTimeMillis()
    )
    
    /**
     * 开始线程监控
     */
    fun startMonitoring(intervalSeconds: Long = 5) {
        if (isMonitoring) {
            DebugConfig.warning("ThreadMonitor", "线程监控已在运行")
            return
        }
        
        if (!DebugConfig.PERFORMANCE_DEBUG_ENABLED) {
            DebugConfig.debug("ThreadMonitor", "性能调试未启用，跳过线程监控")
            return
        }
        
        isMonitoring = true
        scheduler = Executors.newSingleThreadScheduledExecutor { r ->
            Thread(r, "ThreadMonitor").apply { isDaemon = true }
        }
        
        DebugConfig.info("ThreadMonitor", "开始线程监控，间隔: ${intervalSeconds}秒")
        
        scheduler?.scheduleAtFixedRate({
            try {
                logThreadMetrics()
            } catch (e: Exception) {
                DebugConfig.error("ThreadMonitor", "线程监控异常", e)
            }
        }, 0, intervalSeconds, TimeUnit.SECONDS)
    }
    
    /**
     * 停止线程监控
     */
    fun stopMonitoring() {
        if (!isMonitoring) {
            return
        }
        
        isMonitoring = false
        scheduler?.shutdown()
        scheduler = null
        
        DebugConfig.info("ThreadMonitor", "线程监控已停止")
    }
    
    /**
     * 记录线程指标
     */
    private fun logThreadMetrics() {
        val threadCount = threadBean.threadCount
        val peakThreadCount = threadBean.peakThreadCount
        val daemonThreadCount = threadBean.daemonThreadCount
        
        // 检测死锁
        val deadlockedThreads = detectDeadlock()
        if (deadlockedThreads.isNotEmpty()) {
            DebugConfig.error("ThreadMonitor", "检测到死锁线程: ${deadlockedThreads.joinToString(", ")}")
        }
        
        // 检测高 CPU 线程
        val highCpuThreads = findHighCpuThreads()
        if (highCpuThreads.isNotEmpty()) {
            DebugConfig.warning("ThreadMonitor", "检测到高 CPU 线程: ${highCpuThreads.size} 个")
        }
        
        // 检测线程泄漏
        val threadLeak = detectThreadLeak()
        if (threadLeak) {
            DebugConfig.warning("ThreadMonitor", "检测到可能的线程泄漏")
        }
        
        DebugConfig.performanceDebug("ThreadMonitor", """
            🧵 线程监控报告:
            📊 当前线程数: $threadCount
            📈 峰值线程数: $peakThreadCount
            👻 守护线程数: $daemonThreadCount
            💀 死锁线程: ${deadlockedThreads.size}
            🔥 高 CPU 线程: ${highCpuThreads.size}
            🚨 线程泄漏: ${if (threadLeak) "是" else "否"}
        """.trimIndent())
        
        // 更新线程历史
        updateThreadHistory()
    }
    
    /**
     * 获取线程转储
     */
    fun getThreadDump(): String {
        val threadInfos = threadBean.dumpAllThreads(true, true)
        return buildString {
            appendLine("=== 线程转储 ===")
            appendLine("时间: ${java.time.LocalDateTime.now()}")
            appendLine("总线程数: ${threadInfos.size}")
            appendLine()
            
            threadInfos.forEach { threadInfo ->
                appendLine("线程: ${threadInfo.threadName}")
                appendLine("ID: ${threadInfo.threadId}")
                appendLine("状态: ${threadInfo.threadState}")
                if (threadBean.isThreadCpuTimeSupported) {
                    try {
                        val cpuTime = threadBean.getThreadCpuTime(threadInfo.threadId)
                        val userTime = threadBean.getThreadUserTime(threadInfo.threadId)
                        appendLine("CPU 时间: ${formatNanos(cpuTime)}")
                        appendLine("用户时间: ${formatNanos(userTime)}")
                    } catch (e: Exception) {
                        appendLine("CPU 时间: 无法获取")
                        appendLine("用户时间: 无法获取")
                    }
                }
                appendLine("阻塞时间: ${formatNanos(threadInfo.blockedTime)}")
                appendLine("等待时间: ${formatNanos(threadInfo.waitedTime)}")
                
                if (threadInfo.lockName != null) {
                    appendLine("锁信息: ${threadInfo.lockName}")
                }
                
                if (threadInfo.lockOwnerName != null) {
                    appendLine("锁拥有者: ${threadInfo.lockOwnerName}")
                }
                
                appendLine("调用栈:")
                threadInfo.stackTrace.forEach { frame ->
                    appendLine("  at ${frame.className}.${frame.methodName}(${frame.fileName}:${frame.lineNumber})")
                }
                appendLine("---")
            }
        }
    }
    
    /**
     * 获取线程摘要
     */
    fun getThreadSummary(): String {
        val threadCount = threadBean.threadCount
        val peakCount = threadBean.peakThreadCount
        val daemonCount = threadBean.daemonThreadCount
        val deadlockedThreads = detectDeadlock()
        val highCpuThreads = findHighCpuThreads()
        
        return """
            🧵 线程摘要:
            📊 当前线程数: $threadCount
            📈 峰值线程数: $peakCount
            👻 守护线程数: $daemonCount
            💀 死锁线程: ${deadlockedThreads.size}
            🔥 高 CPU 线程: ${highCpuThreads.size}
        """.trimIndent()
    }
    
    /**
     * 检测死锁
     */
    fun detectDeadlock(): List<Long> {
        return try {
            threadBean.findDeadlockedThreads()?.toList() ?: emptyList()
        } catch (e: Exception) {
            DebugConfig.debug("ThreadMonitor", "死锁检测失败: ${e.message}")
            emptyList()
        }
    }
    
    /**
     * 检测线程泄漏
     */
    fun detectThreadLeak(): Boolean {
        val currentCount = threadBean.threadCount
        val peakCount = threadBean.peakThreadCount
        return currentCount > peakCount * 0.8 // 如果当前线程数接近峰值，可能存在泄漏
    }
    
    /**
     * 查找高 CPU 线程
     */
    fun findHighCpuThreads(): List<ThreadInfo> {
        return try {
            if (!threadBean.isThreadCpuTimeSupported) {
                DebugConfig.debug("ThreadMonitor", "当前 JVM 不支持 CPU 时间统计")
                return emptyList()
            }
            
            val threadInfos = threadBean.dumpAllThreads(true, true)
            threadInfos.filter { threadInfo ->
                try {
                    val cpuTime = threadBean.getThreadCpuTime(threadInfo.threadId)
                    cpuTime > 1_000_000_000 // 超过1秒的CPU时间
                } catch (e: Exception) {
                    false
                }
            }
        } catch (e: Exception) {
            DebugConfig.debug("ThreadMonitor", "查找高 CPU 线程失败: ${e.message}")
            emptyList()
        }
    }
    
    /**
     * 获取线程状态统计
     */
    fun getThreadStateStats(): Map<Thread.State, Int> {
        val threadInfos = threadBean.dumpAllThreads(false, false)
        return threadInfos.groupingBy { it.threadState }
            .eachCount()
    }
    
    /**
     * 获取线程池信息
     */
    fun getThreadPoolInfo(): String {
        val threadInfos = threadBean.dumpAllThreads(false, false)
        val poolThreads = threadInfos.filter { 
            it.threadName.contains("pool", ignoreCase = true) ||
            it.threadName.contains("executor", ignoreCase = true)
        }
        
        return buildString {
            appendLine("🏊 线程池信息:")
            poolThreads.forEach { threadInfo ->
                appendLine("  - ${threadInfo.threadName}: ${threadInfo.threadState}")
            }
        }
    }
    
    /**
     * 格式化纳秒时间
     */
    private fun formatNanos(nanos: Long): String {
        return when {
            nanos >= 1_000_000_000 -> "${nanos / 1_000_000_000}s"
            nanos >= 1_000_000 -> "${nanos / 1_000_000}ms"
            nanos >= 1_000 -> "${nanos / 1_000}μs"
            else -> "${nanos}ns"
        }
    }
    
    /**
     * 更新线程历史
     */
    private fun updateThreadHistory() {
        val threadInfos = threadBean.dumpAllThreads(false, false)
        val currentTime = System.currentTimeMillis()
        
        threadInfos.forEach { threadInfo ->
            val cpuTime = if (threadBean.isThreadCpuTimeSupported) {
                try {
                    threadBean.getThreadCpuTime(threadInfo.threadId)
                } catch (e: Exception) {
                    0L
                }
            } else {
                0L
            }
            
            val userTime = if (threadBean.isThreadCpuTimeSupported) {
                try {
                    threadBean.getThreadUserTime(threadInfo.threadId)
                } catch (e: Exception) {
                    0L
                }
            } else {
                0L
            }
            
            val stats = ThreadStats(
                name = threadInfo.threadName,
                state = threadInfo.threadState,
                cpuTime = cpuTime,
                userTime = userTime,
                lastSeen = currentTime
            )
            threadHistory[threadInfo.threadName] = stats
        }
        
        // 清理过期的线程记录
        val expiredKeys = threadHistory.filter { 
            currentTime - it.value.lastSeen > 60_000 // 1分钟
        }.keys
        expiredKeys.forEach { threadHistory.remove(it) }
    }
    
    /**
     * 获取线程历史统计
     */
    fun getThreadHistory(): String {
        return buildString {
            appendLine("📈 线程历史统计:")
            appendLine("总记录数: ${threadHistory.size}")
            
            val stateStats = threadHistory.values.groupingBy { it.state }
                .eachCount()
            
            stateStats.forEach { (state, count) ->
                appendLine("  $state: $count")
            }
        }
    }
    
    /**
     * 强制线程转储到文件
     */
    fun dumpThreadsToFile(filename: String = "thread_dump_${System.currentTimeMillis()}.txt") {
        try {
            val dump = getThreadDump()
            java.io.File(filename).writeText(dump)
            DebugConfig.info("ThreadMonitor", "线程转储已保存到: $filename")
        } catch (e: Exception) {
            DebugConfig.error("ThreadMonitor", "保存线程转储失败: ${e.message}", e)
        }
    }
    
    /**
     * 获取线程监控摘要
     */
    fun getMonitoringSummary(): String {
        val uptime = System.currentTimeMillis() - (scheduler?.let { System.currentTimeMillis() } ?: 0)
        val threadCount = threadBean.threadCount
        val deadlockedThreads = detectDeadlock()
        val highCpuThreads = findHighCpuThreads()
        
        return """
            🧵 线程监控摘要:
            ⏱️  监控运行时间: ${uptime}ms
            📊 当前线程数: $threadCount
            💀 死锁线程: ${deadlockedThreads.size}
            🔥 高 CPU 线程: ${highCpuThreads.size}
            📈 历史记录: ${threadHistory.size}
        """.trimIndent()
    }
}
