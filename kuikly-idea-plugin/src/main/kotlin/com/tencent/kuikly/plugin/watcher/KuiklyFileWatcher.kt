package com.tencent.kuikly.plugin.watcher

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFileManager
import com.intellij.openapi.vfs.newvfs.BulkFileListener
import com.intellij.openapi.vfs.newvfs.events.VFileEvent
import com.tencent.kuikly.plugin.compiler.KotlinJsCompiler
import com.tencent.kuikly.plugin.server.KuiklyDevServer
import kotlinx.coroutines.*

/**
 * Kuikly 文件监听器
 * 监听 Kotlin 文件变化并触发热重载
 */
class KuiklyFileWatcher(
    private val project: Project,
    private val devServer: KuiklyDevServer
) {
    
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val compiler = KotlinJsCompiler(project)
    
    // 防抖：避免频繁编译
    private var compileJob: Job? = null
    private val debounceDelay = 1000L // 1秒
    
    private var isWatching = false
    
    /**
     * 启动监听
     */
    fun start() {
        if (isWatching) {
            return
        }
        
        val connection = project.messageBus.connect()
        
        connection.subscribe(VirtualFileManager.VFS_CHANGES, object : BulkFileListener {
            override fun after(events: List<VFileEvent>) {
                // 过滤 Kotlin 文件变化
                val kotlinFileChanged = events.any { event ->
                    val file = event.file ?: return@any false
                    val path = file.path
                    
                    // 只关注 demo 目录下的 .kt 文件
                    file.name.endsWith(".kt") && 
                    (path.contains("/demo/src/") || path.contains("\\demo\\src\\"))
                }
                
                if (kotlinFileChanged) {
                    onKotlinFileChanged()
                }
            }
        })
        
        isWatching = true
        println("👀 Kuikly File Watcher started")
    }
    
    /**
     * Kotlin 文件变化
     */
    private fun onKotlinFileChanged() {
        // 取消之前的编译任务（防抖）
        compileJob?.cancel()
        
        // 延迟执行编译
        compileJob = scope.launch {
            try {
                delay(debounceDelay)
                
                println("📝 Kotlin file changed, triggering compilation...")
                
                val success = compiler.incrementalCompile()
                
                if (success) {
                    println("✅ Compilation successful, notifying browser...")
                    devServer.notifyReload()
                } else {
                    println("❌ Compilation failed, skipping reload")
                }
            } catch (e: CancellationException) {
                // 被取消，忽略
            } catch (e: Exception) {
                println("❌ Error during file change handling: ${e.message}")
                e.printStackTrace()
            }
        }
    }
    
    /**
     * 停止监听
     */
    fun stop() {
        if (!isWatching) {
            return
        }
        
        compileJob?.cancel()
        scope.cancel()
        isWatching = false
        
        println("⏹️ Kuikly File Watcher stopped")
    }
}

