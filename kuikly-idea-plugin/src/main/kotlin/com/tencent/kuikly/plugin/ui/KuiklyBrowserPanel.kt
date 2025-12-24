package com.tencent.kuikly.plugin.ui

import com.intellij.ui.jcef.JBCefApp
import com.intellij.ui.jcef.JBCefBrowser
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.handler.CefLoadHandlerAdapter
import org.cef.network.CefRequest
import javax.swing.JComponent
import javax.swing.JLabel
import javax.swing.JPanel
import java.awt.BorderLayout

/**
 * Kuikly 浏览器面板
 * 使用 JCEF 嵌入 Chromium 浏览器
 */
class KuiklyBrowserPanel(
    private val devServerUrl: String
) {
    
    private val browser: JBCefBrowser?
    private val component: JComponent
    private var onLoadStart: (() -> Unit)? = null
    private var onLoadEnd: ((Int) -> Unit)? = null
    private var onLoadError: ((String?) -> Unit)? = null
    
    init {
        if (!JBCefApp.isSupported()) {
            // JCEF 不支持，显示错误消息
            browser = null
            component = createUnsupportedPanel()
        } else {
            // 创建浏览器
            browser = JBCefBrowser().apply {
                setupBrowser()
            }
            component = browser.component
        }
    }
    
    /**
     * 创建不支持的面板
     */
    private fun createUnsupportedPanel(): JPanel {
        return JPanel(BorderLayout()).apply {
            val label = JLabel(
                "<html><center>" +
                "<h2>❌ JCEF 不支持</h2>" +
                "<p>Kuikly Preview 需要 JCEF (Java Chromium Embedded Framework) 支持。</p>" +
                "<p>请升级到 IntelliJ IDEA 2020.2 或更高版本。</p>" +
                "</center></html>"
            )
            label.horizontalAlignment = JLabel.CENTER
            add(label, BorderLayout.CENTER)
        }
    }
    
    /**
     * 获取 UI 组件
     */
    fun getComponent(): JComponent {
        return component
    }
    
    /**
     * 加载页面
     */
    fun loadPage(pageName: String, device: DeviceConfig) {
        if (browser == null) {
            return
        }
        
        val url = buildUrl(pageName, device)
        println("📱 Loading page: $url")
        browser.loadURL(url)
    }
    
    /**
     * 刷新页面
     */
    fun reload() {
        if (browser == null) {
            return
        }
        
        println("🔄 Reloading browser...")
        browser.cefBrowser.reload()
    }
    
    /**
     * 构建 URL
     */
    private fun buildUrl(pageName: String, device: DeviceConfig): String {
        return "$devServerUrl/index.html?page_name=$pageName&width=${device.width}&height=${device.height}"
    }
    
    /**
     * 配置浏览器
     */
    private fun JBCefBrowser.setupBrowser() {
        val client = this.jbCefClient
        
        // 监听页面加载
        client.addLoadHandler(object : CefLoadHandlerAdapter() {
            override fun onLoadStart(
                browser: CefBrowser?,
                frame: CefFrame?,
                transitionType: CefRequest.TransitionType?
            ) {
                println("🔵 Kuikly Preview: Loading started")
                onLoadStart?.invoke()
            }
            
            override fun onLoadEnd(
                browser: CefBrowser?,
                frame: CefFrame?,
                httpStatusCode: Int
            ) {
                println("✅ Kuikly Preview: Loading finished (status: $httpStatusCode)")
                onLoadEnd?.invoke(httpStatusCode)
            }
            
            override fun onLoadError(
                browser: CefBrowser?,
                frame: CefFrame?,
                errorCode: org.cef.handler.CefLoadHandler.ErrorCode?,
                errorText: String?,
                failedUrl: String?
            ) {
                println("❌ Kuikly Preview: Loading error - $errorText ($failedUrl)")
                onLoadError?.invoke(errorText)
            }
        }, this.cefBrowser)
    }
    
    /**
     * 打开 DevTools
     */
    fun openDevTools() {
        if (browser == null) {
            return
        }
        
        println("🔧 Opening DevTools...")
        browser.openDevtools()
    }
    
    /**
     * 设置加载回调
     */
    fun setLoadCallbacks(
        onStart: (() -> Unit)? = null,
        onEnd: ((Int) -> Unit)? = null,
        onError: ((String?) -> Unit)? = null
    ) {
        this.onLoadStart = onStart
        this.onLoadEnd = onEnd
        this.onLoadError = onError
    }
    
    /**
     * 销毁浏览器
     */
    fun dispose() {
        browser?.dispose()
    }
}

