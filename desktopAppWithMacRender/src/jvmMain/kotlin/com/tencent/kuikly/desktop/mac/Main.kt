package com.tencent.kuikly.desktop.mac

import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner
import com.tencent.kuiklyx.coroutines.DefaultKuiklyThreadScheduler
import java.awt.BorderLayout
import java.awt.Color
import java.awt.Dimension
import java.awt.FlowLayout
import java.awt.Font
import javax.swing.*

/**
 * Kuikly Desktop with Mac Render
 * 
 * 该应用使用 Mac 原生渲染器进行 UI 渲染，通过 HTTP 与 PreviewMacApp 通信。
 * 
 * 架构说明：
 * - JVM 端运行业务逻辑层 (core + compose)
 * - Mac 端运行渲染层 (core-render-ios via PreviewMacApp)
 * - 两端通过 HTTP 协议通信
 */

// 全局预览运行器列表
private val previewRunners = mutableListOf<KuiklyMacPreviewRunner>()

fun main(args: Array<String>) {
    println("🚀 Kuikly Desktop with Mac Render")
    println("📍 服务器配置由 SDK 内部自动管理（自动发现端口）")
    
    // 注意：refresh 功能已通过 TCP NOTIFICATION 实现，不再需要 RefreshServer
    // 注意：服务器地址和端口由 SDK 内部自动管理，无需外部配置
    
    // 初始化 Kuikly 线程调度器
    initKuiklyThreadScheduler()
    
    // 启动 Swing UI
    SwingUtilities.invokeLater {
        createAndShowGUI()
    }
}

/**
 * 初始化 Kuikly 线程调度器
 */
private fun initKuiklyThreadScheduler() {
    try {
        setKuiklyThreadScheduler(object : DefaultKuiklyThreadScheduler() {
            override fun scheduleOnKuiklyThread(pagerId: String) {
                KuiklyMacPreviewRunner.getKotlinMethodExecutor().submit {
                    runTasks(pagerId)
                }
            }
        })
        println("[Main] ✅ Kuikly 线程调度器初始化完成")
    } catch (e: Exception) {
        println("[Main] ❌ Kuikly 线程调度器初始化失败: ${e.message}")
        e.printStackTrace()
    }
}

/**
 * 创建并显示 GUI
 */
private fun createAndShowGUI() {
    // 创建主窗口
    val frame = JFrame("Kuikly Desktop - Mac Render")
    frame.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
    frame.layout = BorderLayout()
    frame.preferredSize = Dimension(800, 600)
    
    // 创建菜单栏
    val menuBar = createMenuBar(frame)
    frame.jMenuBar = menuBar
    
    // 创建主面板
    val mainPanel = JPanel(BorderLayout())
    mainPanel.background = Color(45, 45, 45)
    
    // 顶部状态栏
    val statusBar = createStatusBar()
    mainPanel.add(statusBar, BorderLayout.NORTH)
    
    // 中间控制面板
    val controlPanel = createControlPanel(frame)
    mainPanel.add(controlPanel, BorderLayout.CENTER)
    
    // 底部日志区域
    val logPanel = createLogPanel()
    mainPanel.add(logPanel, BorderLayout.SOUTH)
    
    frame.add(mainPanel)
    frame.pack()
    frame.setLocationRelativeTo(null)
    frame.isVisible = true
    
    // 添加窗口关闭事件
    frame.addWindowListener(object : java.awt.event.WindowAdapter() {
        override fun windowClosing(e: java.awt.event.WindowEvent?) {
            println("[Main] 🛑 正在关闭所有预览...")
            previewRunners.forEach { it.stop() }
        }
    })
    
    println("[Main] ✅ GUI 已启动")
}

/**
 * 创建菜单栏
 */
private fun createMenuBar(frame: JFrame): JMenuBar {
    val menuBar = JMenuBar()
    
    // 文件菜单
    val fileMenu = JMenu("文件")
    val exitItem = JMenuItem("退出")
    exitItem.addActionListener {
        previewRunners.forEach { it.stop() }
        frame.dispose()
        System.exit(0)
    }
    fileMenu.add(exitItem)
    menuBar.add(fileMenu)
    
    // 预览菜单
    val previewMenu = JMenu("预览")
    
    val connectItem = JMenuItem("连接 Mac 渲染端")
    connectItem.addActionListener {
        checkConnection()
    }
    previewMenu.add(connectItem)
    
    previewMenu.addSeparator()
    
    val startPreviewItem = JMenuItem("启动预览...")
    startPreviewItem.addActionListener {
        showStartPreviewDialog(frame)
    }
    previewMenu.add(startPreviewItem)
    
    val stopAllItem = JMenuItem("停止所有预览")
    stopAllItem.addActionListener {
        previewRunners.forEach { it.stop() }
        previewRunners.clear()
        println("[Main] ✅ 已停止所有预览")
    }
    previewMenu.add(stopAllItem)
    
    menuBar.add(previewMenu)
    
    // 帮助菜单
    val helpMenu = JMenu("帮助")
    val aboutItem = JMenuItem("关于")
    aboutItem.addActionListener {
        JOptionPane.showMessageDialog(
            frame,
            "Kuikly Desktop with Mac Render\n\n" +
            "版本: 1.0.0\n" +
            "使用 Mac 原生渲染器进行 UI 渲染\n" +
            "通过 HTTP 与 PreviewMacApp 通信",
            "关于",
            JOptionPane.INFORMATION_MESSAGE
        )
    }
    helpMenu.add(aboutItem)
    menuBar.add(helpMenu)
    
    return menuBar
}

/**
 * 创建状态栏
 */
private fun createStatusBar(): JPanel {
    val statusBar = JPanel(FlowLayout(FlowLayout.LEFT))
    statusBar.background = Color(60, 60, 60)
    statusBar.border = BorderFactory.createEmptyBorder(5, 10, 5, 10)
    
    val host = KuiklyMacPreviewRunner.getServerHost()
    val port = KuiklyMacPreviewRunner.getServerPort()
    val statusLabel = JLabel("● 服务器: $host:$port")
    statusLabel.foreground = Color.LIGHT_GRAY
    statusLabel.font = Font("SansSerif", Font.PLAIN, 12)
    statusBar.add(statusLabel)
    
    return statusBar
}

/**
 * 创建控制面板
 */
private fun createControlPanel(frame: JFrame): JPanel {
    val panel = JPanel()
    panel.layout = BoxLayout(panel, BoxLayout.Y_AXIS)
    panel.background = Color(45, 45, 45)
    panel.border = BorderFactory.createEmptyBorder(30, 50, 30, 50)
    
    // 标题
    val titleLabel = JLabel("Kuikly Desktop with Mac Render")
    titleLabel.font = Font("SansSerif", Font.BOLD, 24)
    titleLabel.foreground = Color.WHITE
    titleLabel.alignmentX = JPanel.CENTER_ALIGNMENT
    panel.add(titleLabel)
    
    panel.add(Box.createVerticalStrut(10))
    
    // 副标题
    val subtitleLabel = JLabel("使用 Mac 原生渲染器进行 UI 渲染")
    subtitleLabel.font = Font("SansSerif", Font.PLAIN, 14)
    subtitleLabel.foreground = Color.GRAY
    subtitleLabel.alignmentX = JPanel.CENTER_ALIGNMENT
    panel.add(subtitleLabel)
    
    panel.add(Box.createVerticalStrut(40))
    
    // 检查连接按钮
    val checkButton = createStyledButton("🔗 检查连接")
    checkButton.addActionListener {
        checkConnection()
    }
    panel.add(checkButton)
    
    panel.add(Box.createVerticalStrut(15))
    
    // 启动预览按钮
    val startButton = createStyledButton("▶️ 启动预览")
    startButton.addActionListener {
        showStartPreviewDialog(frame)
    }
    panel.add(startButton)
    
    panel.add(Box.createVerticalStrut(15))
    
    // 快速启动按钮 - HelloWorldPage
    val quickStartButton = createStyledButton("🚀 快速启动 (HelloWorldPage)")
    quickStartButton.addActionListener {
        startPreview("HelloWorldPage")
    }
    panel.add(quickStartButton)
    
    panel.add(Box.createVerticalStrut(15))
    
    // 快速启动按钮 - ComposeAllSample
    val composeAllButton = createStyledButton("📝 启动 ComposeAllSample")
    composeAllButton.addActionListener {
        startPreview("ComposeAllSample")
    }
    panel.add(composeAllButton)
    
    panel.add(Box.createVerticalStrut(20))
    
    // 分隔线
    val separator = JSeparator()
    separator.maximumSize = Dimension(250, 1)
    separator.foreground = Color(80, 80, 80)
    panel.add(separator)
    
    panel.add(Box.createVerticalStrut(15))
    
    // 双屏预览按钮
    val dualPreviewButton = createStyledButton("🖥️ 双屏预览模式")
    dualPreviewButton.background = Color(100, 149, 237)  // 使用不同颜色区分
    dualPreviewButton.addActionListener {
        startDualPreview()
    }
    panel.add(dualPreviewButton)
    
    return panel
}

/**
 * 创建样式按钮
 */
private fun createStyledButton(text: String): JButton {
    val button = JButton(text)
    button.font = Font("SansSerif", Font.PLAIN, 14)
    button.preferredSize = Dimension(250, 40)
    button.maximumSize = Dimension(250, 40)
    button.alignmentX = JPanel.CENTER_ALIGNMENT
    button.background = Color(70, 130, 180)
    button.foreground = Color.WHITE
    button.isFocusPainted = false
    button.border = BorderFactory.createEmptyBorder(10, 20, 10, 20)
    return button
}

/**
 * 创建日志面板
 */
private fun createLogPanel(): JPanel {
    val panel = JPanel(BorderLayout())
    panel.preferredSize = Dimension(800, 150)
    panel.background = Color(30, 30, 30)
    
    val logArea = JTextArea()
    logArea.isEditable = false
    logArea.background = Color(30, 30, 30)
    logArea.foreground = Color.LIGHT_GRAY
    logArea.font = Font("Monospaced", Font.PLAIN, 12)
    logArea.border = BorderFactory.createEmptyBorder(10, 10, 10, 10)
    
    // 重定向控制台输出到日志区域
    val scrollPane = JScrollPane(logArea)
    scrollPane.border = BorderFactory.createTitledBorder(
        BorderFactory.createLineBorder(Color.DARK_GRAY),
        "日志",
        javax.swing.border.TitledBorder.LEFT,
        javax.swing.border.TitledBorder.TOP,
        Font("SansSerif", Font.PLAIN, 11),
        Color.GRAY
    )
    
    panel.add(scrollPane, BorderLayout.CENTER)
    
    // 设置全局日志输出
    LogOutput.setLogArea(logArea)
    
    return panel
}

/**
 * 检查与 Mac 渲染端的连接
 */
private fun checkConnection() {
    val host = KuiklyMacPreviewRunner.getServerHost()
    val port = KuiklyMacPreviewRunner.getServerPort()
    println("[Main] 🔗 正在检查与 $host:$port 的连接...")
    
    Thread {
        try {
            val connected = KuiklyMacPreviewRunner.ping()
            if (connected) {
                println("[Main] ✅ 连接成功！Mac 渲染端已就绪")
                SwingUtilities.invokeLater {
                    JOptionPane.showMessageDialog(
                        null,
                        "✅ 连接成功！\n\nMac 渲染端已就绪",
                        "连接状态",
                        JOptionPane.INFORMATION_MESSAGE
                    )
                }
            } else {
                println("[Main] ❌ 连接失败！请确保 PreviewMacApp 已启动")
                SwingUtilities.invokeLater {
                    JOptionPane.showMessageDialog(
                        null,
                        "❌ 连接失败！\n\n请确保 PreviewMacApp 已启动\n端口: $port",
                        "连接状态",
                        JOptionPane.ERROR_MESSAGE
                    )
                }
            }
        } catch (e: Exception) {
            println("[Main] ❌ 连接错误: ${e.message}")
            SwingUtilities.invokeLater {
                JOptionPane.showMessageDialog(
                    null,
                    "❌ 连接错误！\n\n${e.message}",
                    "连接状态",
                    JOptionPane.ERROR_MESSAGE
                )
            }
        }
    }.start()
}

/**
 * 显示启动预览对话框
 */
private fun showStartPreviewDialog(parent: JFrame) {
    val pageName = JOptionPane.showInputDialog(
        parent,
        "请输入页面名称:",
        "启动预览",
        JOptionPane.PLAIN_MESSAGE
    )
    
    if (!pageName.isNullOrBlank()) {
        startPreview(pageName)
    }
}

/**
 * 启动预览
 */
private fun startPreview(
    pageName: String, 
    width: Int = 400,
    height: Int = 800
) {
    println("[Main] 🚀 正在启动预览: $pageName (尺寸: ${width}x${height})")
    
    val runner = KuiklyMacPreviewRunner(
        pageName = pageName,
        classLoader = Thread.currentThread().contextClassLoader,
        width = width,
        height = height
    )
    
    runner.onConnected = {
        println("[Main] ✅ 预览已连接: $pageName")
        
        // 注意：refresh 功能通过 TCP NOTIFICATION 实现，无需额外注册
        
        // 显示预览窗口
        SwingUtilities.invokeLater {
            val previewWindow = PreviewWindow(pageName, runner, width, height)
            previewWindow.isVisible = true
            
            // 窗口关闭时从列表中移除 runner
            previewWindow.addWindowListener(object : java.awt.event.WindowAdapter() {
                override fun windowClosed(e: java.awt.event.WindowEvent?) {
                    previewRunners.remove(runner)
                    
                    // 停止 runner
                    runner.stop()
                    
                    println("[Main] 🧹 已从列表中移除 runner: $pageName (剩余: ${previewRunners.size})")
                }
            })
        }
        
        previewRunners.add(runner)
        println("[Main] ✅ 预览启动成功: $pageName")
    }
    
    runner.onError = { error ->
        println("[Main] ❌ 预览错误: ${error.message}")
        SwingUtilities.invokeLater {
            JOptionPane.showMessageDialog(
                null,
                "预览启动失败!\n\n${error.message}\n\n请确保:\n1. PreviewMacApp 已启动\n2. 页面 '$pageName' 存在",
                "错误",
                JOptionPane.ERROR_MESSAGE
            )
        }
    }
    
    runner.onFirstFramePaint = {
        println("[Main] 🎨 首帧渲染完成: $pageName")
    }
    
    // start() 现在是异步的，内部使用线程池，不会阻塞调用线程
    runner.start()
}

/**
 * 启动双屏预览模式
 */
private fun startDualPreview() {
    println("[Main] 🖥️ 启动双屏预览模式")
    
    // 显示对话框让用户选择两个页面
    val panel = JPanel()
    panel.layout = BoxLayout(panel, BoxLayout.Y_AXIS)
    panel.border = BorderFactory.createEmptyBorder(10, 10, 10, 10)
    
    // 页面1输入
    val page1Label = JLabel("页面 1:")
    val page1Field = JTextField("HelloWorldPage", 20)
    val size1Label = JLabel("尺寸 1 (宽x高):")
    val width1Field = JTextField("390", 5)
    val height1Field = JTextField("844", 5)
    
    val page1Panel = JPanel(FlowLayout(FlowLayout.LEFT))
    page1Panel.add(page1Label)
    page1Panel.add(page1Field)
    
    val size1Panel = JPanel(FlowLayout(FlowLayout.LEFT))
    size1Panel.add(size1Label)
    size1Panel.add(width1Field)
    size1Panel.add(JLabel("x"))
    size1Panel.add(height1Field)
    
    // 页面2输入
    val page2Label = JLabel("页面 2:")
    val page2Field = JTextField("ComposeAllSample", 20)
    val size2Label = JLabel("尺寸 2 (宽x高):")
    val width2Field = JTextField("390", 5)
    val height2Field = JTextField("844", 5)
    
    val page2Panel = JPanel(FlowLayout(FlowLayout.LEFT))
    page2Panel.add(page2Label)
    page2Panel.add(page2Field)
    
    val size2Panel = JPanel(FlowLayout(FlowLayout.LEFT))
    size2Panel.add(size2Label)
    size2Panel.add(width2Field)
    size2Panel.add(JLabel("x"))
    size2Panel.add(height2Field)
    
    panel.add(page1Panel)
    panel.add(size1Panel)
    panel.add(Box.createVerticalStrut(10))
    panel.add(page2Panel)
    panel.add(size2Panel)
    
    val result = JOptionPane.showConfirmDialog(
        null,
        panel,
        "双屏预览配置",
        JOptionPane.OK_CANCEL_OPTION,
        JOptionPane.PLAIN_MESSAGE
    )
    
    if (result == JOptionPane.OK_OPTION) {
        val pageName1 = page1Field.text.trim()
        val pageName2 = page2Field.text.trim()
        val width1 = width1Field.text.toIntOrNull() ?: 390
        val height1 = height1Field.text.toIntOrNull() ?: 844
        val width2 = width2Field.text.toIntOrNull() ?: 390
        val height2 = height2Field.text.toIntOrNull() ?: 844
        
        if (pageName1.isNotEmpty()) {
            startPreview(pageName1, width1, height1)
        }
        
        // 延迟一点启动第二个预览，避免冲突
        if (pageName2.isNotEmpty()) {
            Thread {
                Thread.sleep(500)
                startPreview(pageName2, width2, height2)
            }.start()
        }
    }
}

/**
 * 日志输出工具
 */
object LogOutput {
    private var logArea: JTextArea? = null
    
    fun setLogArea(area: JTextArea) {
        logArea = area
    }
    
    fun log(message: String) {
        logArea?.let { area ->
            SwingUtilities.invokeLater {
                area.append(message + "\n")
                area.caretPosition = area.document.length
            }
        }
    }
}

// 重写 println 以同时输出到控制台和日志区域
private val originalPrintStream = System.out

fun println(message: Any?) {
    originalPrintStream.println(message)
    LogOutput.log(message.toString())
}

