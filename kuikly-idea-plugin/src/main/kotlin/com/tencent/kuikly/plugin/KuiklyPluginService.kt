package com.tencent.kuikly.plugin

import com.intellij.openapi.components.Service
import com.intellij.openapi.project.Project
import com.tencent.kuikly.plugin.server.KuiklyDevServer
import com.tencent.kuikly.plugin.watcher.KuiklyFileWatcher

/**
 * Kuikly Plugin 服务
 * 管理 Dev Server 和 File Watcher 的生命周期
 */
@Service(Service.Level.PROJECT)
class KuiklyPluginService(private val project: Project) {
    
    var devServer: KuiklyDevServer? = null
        private set
    
    var fileWatcher: KuiklyFileWatcher? = null
        private set
    
    private var isInitialized = false
    
    /**
     * 初始化服务
     */
    fun initialize() {
        if (isInitialized) {
            return
        }
        
        try {
            // 创建开发服务器
            devServer = KuiklyDevServer(project, port = 8765).apply {
                start()
            }
            
            // 创建文件监听器
            fileWatcher = KuiklyFileWatcher(project, devServer!!).apply {
                start()
            }
            
            isInitialized = true
            println("✅ Kuikly Plugin Service initialized")
            
        } catch (e: Exception) {
            println("❌ Failed to initialize Kuikly Plugin Service: ${e.message}")
            e.printStackTrace()
            throw e
        }
    }
    
    /**
     * 停止服务
     */
    fun shutdown() {
        if (!isInitialized) {
            return
        }
        
        try {
            fileWatcher?.stop()
            devServer?.stop()
            
            fileWatcher = null
            devServer = null
            isInitialized = false
            
            println("✅ Kuikly Plugin Service shutdown")
            
        } catch (e: Exception) {
            println("❌ Error during shutdown: ${e.message}")
            e.printStackTrace()
        }
    }
    
    companion object {
        /**
         * 获取服务实例
         */
        fun getInstance(project: Project): KuiklyPluginService {
            return project.getService(KuiklyPluginService::class.java)
        }
    }
}

