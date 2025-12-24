package com.tencent.kuikly.desktop.mac

import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner
import com.tencent.kuiklyx.coroutines.DefaultKuiklyThreadScheduler
import javax.swing.SwingUtilities
import javax.swing.UIManager

// 可选测试页面: TextFieldDemo, HelloWorldPage, TextDemo, ComposeAllSample
const val TEST_PAGE_NAME = "HelloWorldPage"

/**
 * 测试页面预览 - 带图形界面
 */
fun main() {
    println("=".repeat(60))
    println("🧪 测试 $TEST_PAGE_NAME 页面预览 (带截图显示)")
    println("=".repeat(60))
    
    // 设置 Look and Feel
    try {
        UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName())
    } catch (e: Exception) {
        // 忽略
    }
    
    // 初始化 Kuikly 线程调度器
    try {
        setKuiklyThreadScheduler(object : DefaultKuiklyThreadScheduler() {
            override fun scheduleOnKuiklyThread(pagerId: String) {
                KuiklyMacPreviewRunner.getKotlinMethodExecutor().submit {
                    runTasks(pagerId)
                }
            }
        })
        println("[Test] ✅ Kuikly 线程调度器初始化完成")
    } catch (e: Exception) {
        println("[Test] ❌ Kuikly 线程调度器初始化失败: ${e.message}")
        e.printStackTrace()
        return
    }
    
    // 创建预览运行器
    val runner = KuiklyMacPreviewRunner(
        pageName = TEST_PAGE_NAME,
        classLoader = Thread.currentThread().contextClassLoader
    )
    
    runner.onConnected = {
        println("[Test] ✅ 已连接到 Mac 渲染端")
        System.out.flush()
        
        // 在新线程中执行，避免阻塞
        Thread {
            // 等待一段时间让渲染完成
            println("[Test] ⏳ 等待渲染视图准备...")
            System.out.flush()
            Thread.sleep(2000)
            
            // 测试截图
            val screenshot = runner.captureScreenshot()
            println("[Test] 📸 截图测试: ${if (screenshot != null) "${screenshot.size} 字节" else "失败"}")
            System.out.flush()
            
            // 在 Swing 线程中创建预览窗口
            SwingUtilities.invokeLater {
                println("[Test] 🖼️ 创建预览窗口...")
                val previewWindow = PreviewWindow(TEST_PAGE_NAME, runner)
                previewWindow.isVisible = true
                println("[Test] ✅ 预览窗口已显示")
                System.out.flush()
            }
        }.start()
    }
    
    runner.onError = { error ->
        println("[Test] ❌ 错误: ${error.message}")
        error.printStackTrace()
    }
    
    runner.onFirstFramePaint = {
        println("[Test] 🎨 首帧渲染完成！")
    }
    
    runner.onDisconnected = {
        println("[Test] 🔌 已断开连接")
    }
    
    println("[Test] 🚀 正在启动 $TEST_PAGE_NAME 预览...")
    
    // start() 现在是异步的，通过回调通知结果
    runner.start()
    println("[Test] 💡 启动请求已提交，等待连接...")
    println("[Test] 💡 关闭预览窗口退出...")
    
    // 保持主线程运行
    while (true) {
        Thread.sleep(1000)
    }
}
