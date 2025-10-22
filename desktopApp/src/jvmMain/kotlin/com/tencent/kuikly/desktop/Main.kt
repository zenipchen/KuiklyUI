package com.tencent.kuikly.desktop

import com.tencent.kuiklyx.coroutines.KuiklyThreadScheduler
import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import com.tencent.kuikly.desktop.sdk.KuiklyDesktopRenderSdk
import com.tencent.kuiklyx.coroutines.DefaultKuiklyThreadScheduler
import me.friwi.jcefmaven.CefAppBuilder
import me.friwi.jcefmaven.MavenCefAppHandlerAdapter
import org.cef.CefApp
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.browser.CefMessageRouter
import org.cef.callback.CefQueryCallback
import org.cef.handler.CefLoadHandler
import org.cef.handler.CefLoadHandlerAdapter
import org.cef.handler.CefMessageRouterHandlerAdapter
import org.cef.network.CefRequest
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JComponent
import javax.swing.JFrame
import javax.swing.JMenu
import javax.swing.JMenuBar
import javax.swing.JMenuItem
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

data class PageParam(val pageName: String = "")

// 全局 CEF 应用实例
private var globalCefApp: CefApp? = null

fun main(args: Array<String>) {
    // 在单个窗口内并排显示两个页面
    runPageWithTwoPanels()
}




/**
 * 在单个窗口内并排显示两个页面
 */
private fun runPageWithTwoPanels() {
    try {
        // 设置自定义的线程调度器，将任务调度到 Swing EDT 线程执行
        setKuiklyThreadScheduler(object : DefaultKuiklyThreadScheduler() {
            override fun scheduleOnKuiklyThread(pagerId: String) {
                KuiklyDesktopRenderSdk.kotlinMethodExecutor.submit {
                    runTasks(pagerId)
                }
            }
        })
        DebugConfig.success("Kuikly Desktop", "Kuikly 线程调度器初始化完成")
    } catch (e: Exception) {
        DebugConfig.error("Kuikly Desktop", "Kuikly 线程调度器初始化失败: ${e.message}", e)
    }

    // 2. 构建 JCEF 应用（使用全局实例）
    if (globalCefApp == null) {
        DebugConfig.info("Kuikly Desktop", "正在初始化 Chromium...")
        val builder = CefAppBuilder()

        // 配置 JCEF 以减少线程警告
        builder.setAppHandler(object : MavenCefAppHandlerAdapter() {
            override fun onContextInitialized() {
                DebugConfig.success("Kuikly Desktop", "JCEF 上下文初始化完成")
            }
        })

        // 初始化 CEF
        globalCefApp = builder.build()
        DebugConfig.success("Kuikly Desktop", "全局 CEF 应用已初始化")
    } else {
        DebugConfig.info("Kuikly Desktop", "使用已存在的全局 CEF 应用")
    }

    val cefApp = globalCefApp!!

    SwingUtilities.invokeLater {
        // 创建主窗口
        val frame = JFrame("Kuikly Desktop - 双页面并排显示")
        frame.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
        frame.layout = BorderLayout()
        frame.size = Dimension(1200, 800) // 更宽的窗口以容纳两个页面

        // 创建菜单栏
        val menuBar = JMenuBar()
        
        // 添加刷新菜单
        val refreshMenu = JMenu("刷新控制")
        val refreshLeftItem = JMenuItem("刷新左侧页面")
        val refreshRightItem = JMenuItem("刷新右侧页面")
        val refreshBothItem = JMenuItem("刷新两个页面")
        
        refreshMenu.add(refreshLeftItem)
        refreshMenu.add(refreshRightItem)
        refreshMenu.add(refreshBothItem)
        menuBar.add(refreshMenu)
        
        // 添加开发者工具菜单
        val devMenu = JMenu("开发者工具")
        val openDevToolsItem = JMenuItem("打开开发者工具 (F12)")
        val inspectElementItem = JMenuItem("检查元素 (Ctrl+Shift+I)")

        devMenu.add(openDevToolsItem)
        devMenu.add(inspectElementItem)
        menuBar.add(devMenu)
        frame.jMenuBar = menuBar

        // 创建左侧面板 (ComposeAllSample)
        val leftPanelResult = createBrowserPanel(cefApp, "AccessibilityDemo", "左侧页面")
        val leftPanel = leftPanelResult.first
        val leftBrowser = leftPanelResult.second

        // 创建右侧面板 (TextDemo)
        val rightPanelResult = createBrowserPanel(cefApp, "TextDemo", "右侧页面")
        val rightPanel = rightPanelResult.first
        val rightBrowser = rightPanelResult.second
        
        // 添加刷新按钮事件处理
        refreshLeftItem.addActionListener {
            DebugConfig.info("Kuikly Desktop", "刷新左侧页面")
            refreshPage(leftBrowser, "左侧页面")
        }
        
        refreshRightItem.addActionListener {
            DebugConfig.info("Kuikly Desktop", "刷新右侧页面")
            refreshPage(rightBrowser, "右侧页面")
        }
        
        refreshBothItem.addActionListener {
            DebugConfig.info("Kuikly Desktop", "刷新两个页面")
            refreshPage(leftBrowser, "左侧页面")
            refreshPage(rightBrowser, "右侧页面")
        }

        // 创建分割面板
        val splitPane =
            javax.swing.JSplitPane(javax.swing.JSplitPane.HORIZONTAL_SPLIT, leftPanel, rightPanel)
        splitPane.dividerLocation = 600 // 设置分割线位置
        splitPane.isOneTouchExpandable = true
        splitPane.isContinuousLayout = true

        // 将分割面板添加到主窗口
        frame.add(splitPane, BorderLayout.CENTER)

        frame.isVisible = true

        DebugConfig.success("Kuikly Desktop", "双页面并排窗口已启动！")
        DebugConfig.info("Kuikly Desktop", "左侧显示 ComposeAllSample，右侧显示 TextDemo")
    }
}

/**
 * 创建浏览器面板
 */
private fun createBrowserPanel(cefApp: CefApp, pageName: String, panelTitle: String): Pair<JComponent, CefBrowser> {
    // 创建浏览器客户端
    val client = cefApp.createClient()

    // 创建桌面端渲染委托器
    // 使用当前线程的 ClassLoader 来加载 KuiklyCoreEntry
    val currentClassLoader = Thread.currentThread().contextClassLoader
    val renderDelegator = KuiklyDesktopRenderSdk(pageName, currentClassLoader)

    // 配置消息路由器（用于 Web → JVM 通信）
    val msgRouter = CefMessageRouter.create()
    msgRouter.addHandler(object : CefMessageRouterHandlerAdapter() {
        override fun onQuery(
            browser: CefBrowser?,
            frame: CefFrame?,
            queryId: Long,
            request: String?,
            persistent: Boolean,
            callback: CefQueryCallback?
        ): Boolean {
            // 处理来自 Web 的调用
            if (request != null && browser != null && callback != null) {
                // 使用适配器将 CEF 对象转换为抽象接口
                val browserAdapter = CefBrowserAdapter(browser)
                val callbackAdapter = CefQueryCallbackAdapter(callback)
                return renderDelegator.handleCefQuery(
                    browserAdapter, frame, queryId.toInt(), request, persistent, callbackAdapter
                )
            }
            return false
        }
    }, true)
    client.addMessageRouter(msgRouter)
    client.addLoadHandler(object : CefLoadHandlerAdapter() {
        override fun onLoadingStateChange(
            browser: CefBrowser?,
            isLoading: Boolean,
            canGoBack: Boolean,
            canGoForward: Boolean
        ) {
            if (!isLoading && browser != null) {
                DebugConfig.success(
                    "Kuikly Desktop [$pageName]",
                    "$panelTitle 页面加载完成，正在初始化渲染层..."
                )
                // 使用适配器将 CEF 浏览器转换为抽象接口
                val browserAdapter = CefBrowserAdapter(browser)
                renderDelegator.setBrowser(browserAdapter)
                renderDelegator.initRenderLayer()
            }
        }

        override fun onLoadStart(
            browser: CefBrowser?,
            frame: CefFrame?,
            transitionType: CefRequest.TransitionType?
        ) {
            DebugConfig.debug("Kuikly Desktop [$pageName]", "$panelTitle 开始加载: ${frame?.url}")
        }

        override fun onLoadEnd(browser: CefBrowser?, frame: CefFrame?, httpStatusCode: Int) {
            DebugConfig.debug(
                "Kuikly Desktop [$pageName]",
                "$panelTitle 加载结束: ${frame?.url} (状态码: $httpStatusCode)"
            )
        }

        override fun onLoadError(
            browser: CefBrowser?,
            frame: CefFrame?,
            errorCode: CefLoadHandler.ErrorCode?,
            errorText: String?,
            failedUrl: String?
        ) {
            DebugConfig.error("Kuikly Desktop [$pageName]", "$panelTitle 加载失败: $failedUrl")
            DebugConfig.error("Kuikly Desktop [$pageName]", "错误: $errorText")
        }
    })

    // 使用 DesktopRenderViewSdk 生成 HTML 文件
    val htmlFilePath = renderDelegator.generateHtmlFile()
    val webRenderHtmlUrl =
        "file://$htmlFilePath?pageName=$pageName&instanceId=${renderDelegator.getInstanceId()}"

    DebugConfig.info("Kuikly Desktop [$pageName]", "$panelTitle 加载 HTML 页面: $webRenderHtmlUrl")

    // 加载本地网页（包含 Web 渲染层）
    val browser = client.createBrowser(webRenderHtmlUrl, false, false)
    return Pair(browser.uiComponent as JComponent, browser)
}

/**
 * 刷新页面 - 调用 JavaScript 中的 refresh 方法
 */
private fun refreshPage(browser: CefBrowser, panelName: String) {
    try {
        // 执行 JavaScript 代码调用 refresh 方法
        val jsCode = """
            console.log('[$panelName] 开始刷新页面...');
            if (typeof window.refresh === 'function') {
                window.refresh();
                console.log('[$panelName] 调用 refresh() 成功');
            } else if (typeof window.DesktopRenderLayer !== 'undefined' && typeof window.DesktopRenderLayer.refresh === 'function') {
                window.DesktopRenderLayer.refresh();
                console.log('[$panelName] 调用 DesktopRenderLayer.refresh() 成功');
            }
        """.trimIndent()
        
        browser.executeJavaScript(jsCode, "", 0)
        DebugConfig.success("Kuikly Desktop", "$panelName 刷新命令已发送")
        
    } catch (e: Exception) {
        DebugConfig.error("Kuikly Desktop", "$panelName 刷新失败: ${e.message}", e)
    }
}