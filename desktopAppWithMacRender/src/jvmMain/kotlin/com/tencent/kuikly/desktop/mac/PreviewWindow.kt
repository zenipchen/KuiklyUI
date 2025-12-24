package com.tencent.kuikly.desktop.mac

import com.tencent.kuikly.core.manager.PagerManager
import com.tencent.kuikly.mac.sdk.KuiklyMacPreviewRunner
import com.tencent.kuikly.mac.sdk.PreviewConfig
import java.awt.*
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent
import java.awt.event.MouseMotionAdapter
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import javax.imageio.ImageIO
import javax.swing.*
import javax.swing.border.EmptyBorder

/**
 * 预览窗口 - 显示 Mac 端的渲染结果
 */
class PreviewWindow(
    private val pageName: String,
    private val runner: KuiklyMacPreviewRunner,
    private val previewWidth: Int = 400,
    private val previewHeight: Int = 800,
    initialConfig: PreviewConfig = PreviewConfig.DEFAULT.copy(width = previewWidth, height = previewHeight)
) : JFrame("Kuikly Preview - $pageName (${previewWidth}x${previewHeight})") {

    private val imagePanel = ImagePanel(previewWidth, previewHeight) { event ->
        handleTouchEvent(event)
    }
    private val statusLabel = JLabel("等待渲染...")
    private val fpsLabel = JLabel("FPS: --")
    private var isRunning = true
    private var lastFrameTime = System.currentTimeMillis()
    private var frameCount = 0
    private var currentFps = 0.0
    private var currentConfig = initialConfig
    private val configEditor = PreviewConfigEditor(initialConfig) { config ->
        applyPreviewConfig(config)
    }

    init {
        setupUI()
        startScreenshotPolling()
    }
    
    /**
     * 处理触摸事件并发送到 Mac 端
     */
    private fun handleTouchEvent(event: TouchEvent) {
        Thread {
            try {
                runner.sendTouchEvent(
                    type = event.type.name.lowercase(),
                    x = event.x,
                    y = event.y,
                    timestamp = event.timestamp
                )
            } catch (e: Exception) {
                println("[PreviewWindow] 发送触摸事件失败: ${e.message}")
            }
        }.start()
    }

    private fun setupUI() {
        defaultCloseOperation = DISPOSE_ON_CLOSE
        // 窗口尺寸：左侧预览区域 + 右侧配置面板
        val previewAreaWidth = previewWidth + 40  // 预览区域宽度 + padding
        val configWidth = 450  // 配置面板宽度
        val windowWidth = previewAreaWidth + configWidth
        val windowHeight = maxOf(previewHeight + 100, 800)  // 至少 800 高度
        size = Dimension(windowWidth, windowHeight)
        setLocationRelativeTo(null)

        // 主面板 - 左右分栏：左侧预览，右侧配置
        val mainPanel = JPanel(BorderLayout(0, 0))
        mainPanel.background = Color(45, 45, 45)

        // 顶部状态栏
        val topBar = createTopBar()
        mainPanel.add(topBar, BorderLayout.NORTH)
        
        // 中间：左右分栏容器
        val splitPane = JSplitPane(JSplitPane.HORIZONTAL_SPLIT)
        splitPane.isOneTouchExpandable = true
        splitPane.dividerLocation = previewAreaWidth
        splitPane.dividerSize = 8
        splitPane.background = Color(45, 45, 45)
        
        // 左侧：预览区域
        val previewPanel = JPanel(BorderLayout())
        previewPanel.background = Color(30, 30, 30)
        previewPanel.add(imagePanel, BorderLayout.CENTER)
        splitPane.leftComponent = previewPanel
        
        // 右侧：配置编辑面板
        val configScrollPane = JScrollPane(configEditor)
        configScrollPane.border = null
        configScrollPane.background = Color(45, 45, 45)
        splitPane.rightComponent = configScrollPane
        
        mainPanel.add(splitPane, BorderLayout.CENTER)
        
        // 底部控制栏
        val bottomBar = createBottomBar()
        mainPanel.add(bottomBar, BorderLayout.SOUTH)
        
        contentPane = mainPanel

        // 窗口关闭时停止并销毁实例
        addWindowListener(object : java.awt.event.WindowAdapter() {
            override fun windowClosing(e: java.awt.event.WindowEvent?) {
                println("[PreviewWindow] 🛑 窗口正在关闭: $pageName")
                stopPolling()
                // 销毁 runner 实例，这会发送 /destroy 请求到 Mac 端
                runner.stop()
                println("[PreviewWindow] ✅ 实例已销毁: $pageName")
            }
        })
    }

    private fun createTopBar(): JPanel {
        val panel = JPanel(BorderLayout())
        panel.background = Color(45, 45, 45)
        panel.border = EmptyBorder(8, 12, 8, 12)

        // 左侧：页面名称
        val titleLabel = JLabel("📱 预览窗口 - $pageName (${previewWidth}x${previewHeight})")
        titleLabel.foreground = Color.WHITE
        titleLabel.font = Font("Dialog", Font.BOLD, 14)
        panel.add(titleLabel, BorderLayout.WEST)

        // 右侧：FPS 显示
        fpsLabel.foreground = Color(150, 150, 150)
        fpsLabel.font = Font("Dialog", Font.PLAIN, 11)
        panel.add(fpsLabel, BorderLayout.EAST)

        return panel
    }

    private fun createBottomBar(): JPanel {
        val panel = JPanel(BorderLayout())
        panel.background = Color(45, 45, 45)
        panel.border = EmptyBorder(8, 12, 8, 12)

        // 左侧：状态标签
        val leftPanel = JPanel(FlowLayout(FlowLayout.LEFT, 8, 0))
        leftPanel.background = Color(45, 45, 45)
        
        statusLabel.foreground = Color(180, 180, 180)
        statusLabel.font = Font("Dialog", Font.PLAIN, 11)
        leftPanel.add(statusLabel)
        
        // 添加重新加载按钮
        val reloadBtn = JButton("🔄 重新加载")
        reloadBtn.font = Font("Dialog", Font.PLAIN, 11)
        reloadBtn.addActionListener {
            handleReload()
        }
        leftPanel.add(reloadBtn)
        
        // 添加配置按钮（滚动到配置面板）
        val configBtn = JButton("⚙️ 配置")
        configBtn.font = Font("Dialog", Font.PLAIN, 11)
        configBtn.addActionListener {
            // 滚动到配置面板顶部
            val scrollPane = configEditor.parent as? JScrollPane
            scrollPane?.viewport?.viewPosition = Point(0, 0)
        }
        leftPanel.add(configBtn)
        
        panel.add(leftPanel, BorderLayout.WEST)

        // 右侧：状态信息
        val infoLabel = JLabel("📋 实时预览模式")
        infoLabel.foreground = Color(150, 150, 150)
        infoLabel.font = Font("Dialog", Font.PLAIN, 11)
        panel.add(infoLabel, BorderLayout.EAST)

        return panel
    }

    private fun startScreenshotPolling() {
        Thread {
            while (isRunning) {
                try {

                    Thread.sleep(2000) // ~30 FPS
                    captureAndDisplayScreenshot()
                } catch (e: InterruptedException) {
                    break
                } catch (e: Exception) {
                    SwingUtilities.invokeLater {
                        statusLabel.text = "截图失败: ${e.message}"
                    }
                    Thread.sleep(2000)
                }
            }
        }.apply {
            isDaemon = true
            name = "Screenshot-Poller"
            start()
        }
    }

    private fun captureAndDisplayScreenshot() {
        val imageData = runner.captureScreenshot()

        if (imageData != null && imageData.isNotEmpty()) {
            try {
                val image = ImageIO.read(ByteArrayInputStream(imageData))
                if (image != null) {
                    SwingUtilities.invokeLater {
                        imagePanel.setImage(image)
                        statusLabel.text = "✅ 渲染中 | ${image.width}x${image.height}"
                        updateFps()
                    }
                }
            } catch (e: Exception) {
                SwingUtilities.invokeLater {
                    statusLabel.text = "图片解析失败: ${e.message}"
                }
            }
        } else {
            SwingUtilities.invokeLater {
                statusLabel.text = "⏳ 等待渲染视图..."
            }
        }
    }

    private fun updateFps() {
        frameCount++
        val now = System.currentTimeMillis()
        val elapsed = now - lastFrameTime
        
        if (elapsed >= 1000) {
            currentFps = frameCount * 1000.0 / elapsed
            frameCount = 0
            lastFrameTime = now
            fpsLabel.text = "FPS: %.1f".format(currentFps)
        }
    }

    fun stopPolling() {
        isRunning = false
    }
    
    /**
     * 处理重新加载
     */
    private fun handleReload() {
        println("[PreviewWindow] 🔄 用户点击重新加载按钮")
        Thread {
            try {
                SwingUtilities.invokeLater {
                    statusLabel.text = "🔄 正在重新加载..."
                }
                runner.getInstanceId()?.apply {

                    PagerManager.destroyPager(this)
                }

                runner.reload()
                SwingUtilities.invokeLater {
                    statusLabel.text = "✅ 重新加载请求已发送"
                }
                println("[PreviewWindow] ✅ 重新加载请求已发送")
            } catch (e: Exception) {
                println("[PreviewWindow] ❌ 重新加载失败: ${e.message}")
                e.printStackTrace()
                SwingUtilities.invokeLater {
                    statusLabel.text = "❌ 重新加载失败: ${e.message}"
                }
            }
        }.start()
    }
    
    /**
     * 应用预览配置
     */
    private fun applyPreviewConfig(config: PreviewConfig) {
        println("[PreviewWindow] 🔄 收到配置更新请求: width=${config.width}, height=${config.height}, density=${config.density}")
        Thread {
            try {
                println("[PreviewWindow] 📤 调用 runner.updatePreviewConfig...")
                val success = runner.updatePreviewConfig(config)
                println("[PreviewWindow] 📥 updatePreviewConfig 返回: success=$success")
                SwingUtilities.invokeLater {
                    if (success) {
                        currentConfig = config
                        // 更新窗口标题
                        title = "Kuikly Preview - $pageName (${config.width}x${config.height})"
                        statusLabel.text = "✅ 配置已应用: ${config.width}x${config.height}"
                        // 同步更新配置编辑器的显示（确保显示最新值）
                        configEditor.updateConfig(config)
                        println("[PreviewWindow] ✅ 配置已应用，状态标签和配置编辑器已更新")
                    } else {
                        statusLabel.text = "❌ 配置应用失败"
                        println("[PreviewWindow] ❌ 配置应用失败")
                    }
                }
            } catch (e: Exception) {
                println("[PreviewWindow] ❌ 配置应用异常: ${e.message}")
                e.printStackTrace()
                SwingUtilities.invokeLater {
                    statusLabel.text = "❌ 错误: ${e.message}"
                }
            }
        }.start()
    }
    
}

/**
 * 图片显示面板
 * 支持 Retina 2x 图像的缩放显示和触摸事件传递
 */
class ImagePanel(
    private val targetWidth: Int = 400,
    private val targetHeight: Int = 800,
    private val onTouchEvent: ((TouchEvent) -> Unit)? = null
) : JPanel() {
    private var image: BufferedImage? = null
    private var currentScale: Double = 1.0
    private var offsetX: Int = 0
    private var offsetY: Int = 0

    init {
        background = Color(30, 30, 30)
        preferredSize = Dimension(targetWidth, targetHeight)
        setupMouseListeners()
    }
    
    private fun setupMouseListeners() {
        addMouseListener(object : MouseAdapter() {
            override fun mousePressed(e: MouseEvent) {
                sendTouchEvent(e, TouchEventType.DOWN)
            }
            
            override fun mouseReleased(e: MouseEvent) {
                sendTouchEvent(e, TouchEventType.UP)
            }
        })
        
        addMouseMotionListener(object : MouseMotionAdapter() {
            override fun mouseDragged(e: MouseEvent) {
                sendTouchEvent(e, TouchEventType.MOVE)
            }
        })
    }
    
    private fun sendTouchEvent(e: MouseEvent, type: TouchEventType) {
        // 将屏幕坐标转换为渲染视图坐标
        val viewX = ((e.x - offsetX) / currentScale).toFloat()
        val viewY = ((e.y - offsetY) / currentScale).toFloat()
        
        // 检查坐标是否在有效范围内
        if (viewX >= 0 && viewX <= targetWidth && viewY >= 0 && viewY <= targetHeight) {
            onTouchEvent?.invoke(TouchEvent(type, viewX, viewY, System.currentTimeMillis()))
        }
    }

    fun setImage(img: BufferedImage) {
        this.image = img
        // 保持目标尺寸（不使用图像原始尺寸，因为可能是 2x）
        preferredSize = Dimension(targetWidth, targetHeight)
        revalidate()
        repaint()
    }

    override fun paintComponent(g: Graphics) {
        super.paintComponent(g)
        
        val g2d = g as Graphics2D
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR)
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        
        image?.let { img ->
            // 计算缩放比例，使图像适应面板
            val scaleX = width.toDouble() / img.width
            val scaleY = height.toDouble() / img.height
            currentScale = minOf(scaleX, scaleY)
            
            val scaledWidth = (img.width * currentScale).toInt()
            val scaledHeight = (img.height * currentScale).toInt()
            
            // 居中绘制缩放后的图像
            offsetX = (width - scaledWidth) / 2
            offsetY = (height - scaledHeight) / 2
            
            g2d.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight, null)
        } ?: run {
            // 没有图片时显示提示
            g2d.color = Color(100, 100, 100)
            g2d.font = Font("Dialog", Font.PLAIN, 14)
            val text = "等待渲染..."
            val fm = g2d.fontMetrics
            val textWidth = fm.stringWidth(text)
            g2d.drawString(text, (width - textWidth) / 2, height / 2)
        }
    }
}

/**
 * 触摸事件类型
 */
enum class TouchEventType {
    DOWN,   // 按下
    MOVE,   // 移动
    UP,     // 抬起
    CANCEL  // 取消
}

/**
 * 触摸事件数据
 */
data class TouchEvent(
    val type: TouchEventType,
    val x: Float,
    val y: Float,
    val timestamp: Long
)

