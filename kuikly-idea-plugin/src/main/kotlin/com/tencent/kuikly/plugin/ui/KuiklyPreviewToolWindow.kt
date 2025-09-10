package com.tencent.kuikly.plugin.ui

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import com.tencent.kuikly.plugin.KuiklyPluginService
import com.tencent.kuikly.plugin.scanner.PageScanner
import java.awt.BorderLayout
import java.awt.FlowLayout
import javax.swing.*

/**
 * Kuikly 预览工具窗口工厂
 */
class KuiklyPreviewToolWindowFactory : ToolWindowFactory {
    
    override fun createToolWindowContent(
        project: Project,
        toolWindow: ToolWindow
    ) {
        val panel = KuiklyPreviewPanel(project)
        val content = ContentFactory.getInstance()
            .createContent(panel, "", false)
        toolWindow.contentManager.addContent(content)
    }
}

/**
 * Kuikly 预览面板
 */
class KuiklyPreviewPanel(
    private val project: Project
) : JPanel(BorderLayout()) {
    
    private val pluginService: KuiklyPluginService
    private val pageScanner = PageScanner(project)
    
    private val browserPanel: KuiklyBrowserPanel
    private val pageSelector = JComboBox<String>()
    private val deviceSelector = JComboBox<DeviceConfig>()
    private val statusLabel = JLabel("初始化中...")
    
    init {
        // 初始化 Plugin 服务
        pluginService = try {
            KuiklyPluginService.getInstance(project).apply {
                initialize()
            }
        } catch (e: Exception) {
            statusLabel.text = "❌ 启动失败: ${e.message}"
            showErrorDialog(e)
            throw e
        }
        
        // 创建浏览器面板
        browserPanel = KuiklyBrowserPanel("http://localhost:8765").apply {
            setLoadCallbacks(
                onStart = { onBrowserLoadStart() },
                onEnd = { status -> onBrowserLoadEnd(status) },
                onError = { error -> onBrowserLoadError(error) }
            )
        }
        
        // 构建 UI
        setupUI()
        
        // 扫描页面
        SwingUtilities.invokeLater {
            refreshPages()
        }
    }
    
    /**
     * 显示错误对话框
     */
    private fun showErrorDialog(e: Exception) {
        SwingUtilities.invokeLater {
            JOptionPane.showMessageDialog(
                this,
                "无法启动 Kuikly Preview:\n\n" +
                "${e.message}\n\n" +
                "请确保:\n" +
                "1. 端口 8765 未被占用\n" +
                "2. h5App 已构建: ./gradlew :h5App:jsBrowserDevelopmentWebpack",
                "启动失败",
                JOptionPane.ERROR_MESSAGE
            )
        }
    }
    
    /**
     * 构建 UI
     */
    private fun setupUI() {
        // 顶部工具栏
        val toolbar = JPanel(FlowLayout(FlowLayout.LEFT, 10, 5)).apply {
            border = BorderFactory.createEmptyBorder(5, 5, 5, 5)
            
            add(JLabel("📄 页面:"))
            add(pageSelector.apply {
                preferredSize = java.awt.Dimension(200, 28)
                addActionListener { onPageSelected() }
            })
            
            add(JLabel("📱 设备:"))
            add(deviceSelector.apply {
                DeviceConfig.getAllDevices().forEach { addItem(it) }
                selectedItem = DeviceConfig.PHONE_MEDIUM
                preferredSize = java.awt.Dimension(150, 28)
                addActionListener { onDeviceChanged() }
            })
            
            add(JButton("🔄 刷新").apply {
                toolTipText = "刷新预览 (Ctrl+Alt+R)"
                addActionListener { onRefresh() }
            })
            
            add(JButton("🔧 DevTools").apply {
                toolTipText = "打开 Chrome DevTools"
                addActionListener { browserPanel.openDevTools() }
            })
            
            add(JButton("📋 扫描").apply {
                toolTipText = "重新扫描页面"
                addActionListener { refreshPages() }
            })
        }
        add(toolbar, BorderLayout.NORTH)
        
        // 中间浏览器区域
        add(browserPanel.getComponent(), BorderLayout.CENTER)
        
        // 底部状态栏
        val statusBar = JPanel(FlowLayout(FlowLayout.LEFT, 10, 2)).apply {
            border = BorderFactory.createEmptyBorder(2, 10, 2, 10)
            add(statusLabel)
        }
        add(statusBar, BorderLayout.SOUTH)
    }
    
    /**
     * 刷新页面列表
     */
    private fun refreshPages() {
        SwingUtilities.invokeLater {
            statusLabel.text = "🔍 正在扫描页面..."
            pageSelector.removeAllItems()
            
            Thread {
                try {
                    val pages = pageScanner.scanAllPages()
                    
                    SwingUtilities.invokeLater {
                        if (pages.isEmpty()) {
                            pageSelector.addItem("(未找到页面)")
                            statusLabel.text = "⚠️ 未找到 @Page 注解的页面"
                            
                            JOptionPane.showMessageDialog(
                                this,
                                "未找到任何带 @Page 注解的页面。\n\n" +
                                "请确保:\n" +
                                "1. 在 demo/src/commonMain/kotlin 目录下创建页面\n" +
                                "2. 页面类使用 @Page 注解",
                                "未找到页面",
                                JOptionPane.WARNING_MESSAGE
                            )
                        } else {
                            pages.forEach { page ->
                                pageSelector.addItem(page.name)
                            }
                            statusLabel.text = "✅ 找到 ${pages.size} 个页面"
                            
                            // 自动加载第一个页面
                            if (pageSelector.itemCount > 0) {
                                pageSelector.selectedIndex = 0
                                onPageSelected()
                            }
                        }
                    }
                } catch (e: Exception) {
                    SwingUtilities.invokeLater {
                        statusLabel.text = "❌ 扫描失败: ${e.message}"
                        println("❌ Page scanning error: ${e.message}")
                        e.printStackTrace()
                    }
                }
            }.start()
        }
    }
    
    /**
     * 页面选择变化
     */
    private fun onPageSelected() {
        val pageName = pageSelector.selectedItem as? String ?: return
        if (pageName.startsWith("(")) return // 跳过提示信息
        
        val device = deviceSelector.selectedItem as DeviceConfig
        browserPanel.loadPage(pageName, device)
        statusLabel.text = "📱 正在加载: $pageName"
    }
    
    /**
     * 设备选择变化
     */
    private fun onDeviceChanged() {
        onPageSelected() // 重新加载
    }
    
    /**
     * 刷新按钮点击
     */
    private fun onRefresh() {
        browserPanel.reload()
        statusLabel.text = "🔄 正在刷新..."
    }
    
    /**
     * 浏览器开始加载
     */
    private fun onBrowserLoadStart() {
        SwingUtilities.invokeLater {
            statusLabel.text = "⏳ 正在加载..."
        }
    }
    
    /**
     * 浏览器加载完成
     */
    private fun onBrowserLoadEnd(status: Int) {
        SwingUtilities.invokeLater {
            if (status == 200) {
                val pageName = pageSelector.selectedItem as? String ?: "Unknown"
                statusLabel.text = "✅ 已加载: $pageName"
            } else {
                statusLabel.text = "⚠️ 加载完成 (状态码: $status)"
            }
        }
    }
    
    /**
     * 浏览器加载错误
     */
    private fun onBrowserLoadError(error: String?) {
        SwingUtilities.invokeLater {
            statusLabel.text = "❌ 加载失败: ${error ?: "未知错误"}"
        }
    }
}

