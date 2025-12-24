package com.tencent.kuikly.desktop.mac

import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner
import com.tencent.kuikly.mac.sdk.PreviewConfig
import com.tencent.kuiklyx.coroutines.DefaultKuiklyThreadScheduler
import javax.swing.SwingUtilities
import javax.swing.UIManager
import kotlin.concurrent.thread

// 测试页面
private const val TEST_PAGE_NAME_UPDATE = "HelloWorldPage"

/**
 * 测试 updatePreviewConfig 功能
 * 
 * 此测试会：
 * 1. 启动预览窗口（带配置编辑器）
 * 2. 自动测试多次配置更新
 * 3. 验证配置更新是否成功
 */
fun main() {
    println("=".repeat(60))
    println("🧪 测试 updatePreviewConfig 功能")
    println("=".repeat(60))
    println("")
    
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
                com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner.getKotlinMethodExecutor().submit {
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
    
    // 创建初始配置
    val initialConfig = PreviewConfig.DEFAULT.copy(
        width = 400,
        height = 800,
        density = 2.0f,
        orientation = "portrait"
    )
    
    println("[Test] 📋 初始配置:")
    println("  - Size: ${initialConfig.width}x${initialConfig.height}")
    println("  - Density: ${initialConfig.density}")
    println("  - Orientation: ${initialConfig.orientation}")
    println("")
    
    // 创建预览运行器
    val runner = KuiklyMacPreviewRunner(
        pageName = TEST_PAGE_NAME_UPDATE,
        classLoader = Thread.currentThread().contextClassLoader,
        width = initialConfig.width,
        height = initialConfig.height,
        config = initialConfig
    )
    
    var previewWindow: PreviewWindow? = null
    
    runner.onConnected = {
        println("[Test] ✅ 已连接到 Mac 渲染端")
        System.out.flush()
        
        // 在新线程中执行测试
        thread {
            // 等待渲染完成
            println("[Test] ⏳ 等待渲染视图准备...")
            Thread.sleep(2000)
            
            // 在 Swing 线程中创建预览窗口
            SwingUtilities.invokeLater {
                println("[Test] 🖼️ 创建预览窗口（带配置编辑器）...")
                previewWindow = PreviewWindow(
                    TEST_PAGE_NAME_UPDATE,
                    runner,
                    initialConfig.width,
                    initialConfig.height,
                    initialConfig = initialConfig
                )
                previewWindow!!.isVisible = true
                println("[Test] ✅ 预览窗口已显示")
                System.out.flush()
                
                // 延迟执行自动测试
                thread {
                    Thread.sleep(3000) // 等待窗口完全加载
                    performAutoTests(runner, previewWindow!!)
                }
            }
        }
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
    
    println("[Test] 🚀 正在启动 $TEST_PAGE_NAME_UPDATE 预览...")
    
    // start() 现在是异步的，通过回调通知结果
    runner.start()
    println("[Test] 💡 启动请求已提交，等待连接...")
    println("[Test] 💡 将自动执行配置更新测试...")
    println("[Test] 💡 关闭预览窗口退出...")
    
    // 保持主线程运行
    while (true) {
        Thread.sleep(1000)
    }
}

/**
 * 执行自动测试
 */
private fun performAutoTests(runner: KuiklyMacPreviewRunner, window: PreviewWindow) {
    println("")
    println("=".repeat(60))
    println("🤖 开始自动测试配置更新")
    println("=".repeat(60))
    println("")
    
    val tests = listOf(
        TestCase("测试 1: 更新尺寸", PreviewConfig(width = 500, height = 1000)),
        TestCase("测试 2: 更新密度", PreviewConfig(density = 2.75f)),
        TestCase("测试 3: 更新方向", PreviewConfig(orientation = "landscape")),
        TestCase("测试 4: 更新多个参数", PreviewConfig(
            width = 600,
            height = 1200,
            density = 3.0f,
            orientation = "portrait",
            locale = "zh-CN",
            fontScale = 1.2f
        )),
        TestCase("测试 5: 恢复默认尺寸", PreviewConfig(width = 400, height = 800))
    )
    
    tests.forEachIndexed { index, testCase ->
        println("[AutoTest] ${testCase.name}...")
        
        Thread {
            val success = runner.updatePreviewConfig(testCase.config)
            
            SwingUtilities.invokeLater {
                if (success) {
                    println("[AutoTest] ✅ ${testCase.name} - 成功")
                } else {
                    println("[AutoTest] ❌ ${testCase.name} - 失败")
                }
            }
        }.start()
        
        // 等待测试完成
        Thread.sleep(2000)
    }
    
    println("")
    println("=".repeat(60))
    println("✅ 自动测试完成")
    println("=".repeat(60))
    println("")
    println("💡 请检查:")
    println("   1. PreviewMacApp 控制台是否有配置更新日志")
    println("   2. 预览视图大小是否按预期更新")
    println("   3. 配置编辑面板中的值是否同步更新")
    println("")
}

/**
 * 测试用例
 */
private data class TestCase(
    val name: String,
    val config: PreviewConfig
)

