package com.tencent.kuikly.desktop.mac

import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner
import com.tencent.kuikly.mac.sdk.PreviewConfig
import com.tencent.kuiklyx.coroutines.DefaultKuiklyThreadScheduler
import javax.swing.SwingUtilities
import javax.swing.UIManager

// 测试页面
private const val TEST_PAGE_NAME_CONFIG = "HelloWorldPage"

/**
 * 测试预览配置参数功能
 */
fun main() {
    println("=".repeat(60))
    println("🧪 测试预览配置参数功能")
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
    
    // 创建 Pixel 5 配置
    val config = PreviewConfig.PIXEL_5.copy(
        name = "测试配置",
        group = "测试组",
        locale = "en-US",
        fontScale = 1.0f,
        showSystemUi = false,
        showBackground = false,
        backgroundColor = "#FFFFFF",
        apiLevel = 35
    )
    
    println("[Test] 📋 使用配置:")
    println("  - Device: ${config.device}")
    println("  - Size: ${config.width}x${config.height}")
    println("  - Density: ${config.density}")
    println("  - Orientation: ${config.orientation}")
    println("  - API Level: ${config.apiLevel}")
    println("  - Locale: ${config.locale}")
    println("  - Font Scale: ${config.fontScale}")
    
    // 创建预览运行器（使用配置）
    val runner = KuiklyMacPreviewRunner(
        pageName = TEST_PAGE_NAME_CONFIG,
        classLoader = Thread.currentThread().contextClassLoader,
        width = config.width,
        height = config.height,
        config = config
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
            
            // 在 Swing 线程中创建预览窗口（带配置编辑器）
            SwingUtilities.invokeLater {
                println("[Test] 🖼️ 创建预览窗口（带配置编辑器）...")
                val previewWindow = PreviewWindow(
                    TEST_PAGE_NAME_CONFIG, 
                    runner, 
                    config.width, 
                    config.height,
                    initialConfig = config
                )
                previewWindow.isVisible = true
                println("[Test] ✅ 预览窗口已显示")
                println("[Test] 💡 可以在右侧配置面板中修改预览参数并点击'应用配置'")
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
    
    println("[Test] 🚀 正在启动 $TEST_PAGE_NAME_CONFIG 预览（使用配置参数）...")
    
    // start() 现在是异步的，通过回调通知结果
    runner.start()
    println("[Test] 💡 启动请求已提交，等待连接...")
    println("[Test] 💡 关闭预览窗口退出...")
    println("[Test] 📋 请检查 PreviewMacApp 的控制台，确认配置参数已应用")
    
    // 保持主线程运行
    while (true) {
        Thread.sleep(1000)
    }
}

