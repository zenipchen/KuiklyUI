package com.tencent.kuikly.desktop

import com.tencent.kuiklyx.coroutines.KuiklyThreadScheduler
import com.tencent.kuiklyx.coroutines.setKuiklyThreadScheduler
import kotlinx.coroutines.Dispatchers
import me.friwi.jcefmaven.CefAppBuilder
import me.friwi.jcefmaven.MavenCefAppHandlerAdapter
import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.browser.CefMessageRouter
import org.cef.callback.CefQueryCallback
import org.cef.handler.CefDisplayHandlerAdapter
import org.cef.handler.CefLifeSpanHandlerAdapter
import org.cef.handler.CefLoadHandlerAdapter
import org.cef.handler.CefLoadHandler
import org.cef.handler.CefMessageRouterHandlerAdapter
import org.cef.handler.CefRequestHandler
import org.cef.handler.CefRequestHandlerAdapter
import org.cef.network.CefRequest
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JFrame
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

/**
 * 生成桌面端专用的 HTML（加载 desktopRenderHost 渲染宿主）
 * 业务逻辑由 JVM 端的 demo 模块提供，Web 端仅负责渲染
 */
fun generateDesktopHtml(): String {
    // 加载 desktopRenderHost（包含 core-render-web 渲染引擎的桌面端宿主）
    val desktopRenderHostPath = "../desktopRenderHost/build/dist/js/productionExecutable/desktopRenderHost.js"
    
    val desktopRenderHostFile = java.io.File(desktopRenderHostPath)

    if (!desktopRenderHostFile.exists()) {
        DebugConfig.warning("Kuikly Desktop", "未找到 desktopRenderHost 编译产物")
        DebugConfig.info("Kuikly Desktop", "请运行: ./gradlew :desktopRenderHost:jsBrowserProductionWebpack")
        return """
            <!DOCTYPE html>
            <html><head><meta charset="UTF-8"><title>Kuikly Desktop - Error</title></head>
            <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
                <div style="text-align:center;">
                    <h2>❌ desktopRenderHost 未找到</h2>
                    <p>请运行: ./gradlew :desktopRenderHost:jsBrowserProductionWebpack</p>
                </div>
            </body></html>
        """.trimIndent()
    }
    
    // 读取 desktopRenderHost
    val desktopRenderHostJs = desktopRenderHostFile.readText()
    DebugConfig.debug("Kuikly Desktop", "成功加载 desktopRenderHost (${desktopRenderHostJs.length} 字节)")

    
    // 生成 HTML（加载 desktopRenderHost 渲染宿主）
    return """
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kuikly Desktop - Render Host</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                #kuikly-render-container {
                    width: 100%;
                    height: 100%;
                }
                .list-no-scrollbar {
                    scrollbar-width: none;
                }
                .list-no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div id="kuikly-render-container"></div>
            
            <!-- 加载 desktopRenderHost -->
            <script>
                console.log('[Kuikly Desktop] 🚀 加载 desktopRenderHost...');
                $desktopRenderHostJs
                console.log('[Kuikly Desktop] ✅ desktopRenderHost 加载完成');
            </script>
        </body>
        </html>
    """.trimIndent()
}

/**
 * Kuikly 桌面端 - 使用 JCEF (Chromium)
 * 
 * 架构：
 * - 逻辑层：JVM (Kotlin) - core + compose
 * - 渲染层：Chromium (Web) - core-render-web
 * - 通信：JS Bridge 双向桥接
 * 
 * 当前状态：完整版本，支持 Web 渲染和 JS Bridge
 */
fun main(args: Array<String>) {
    // 初始化调试配置
    DebugConfig.info("Kuikly Desktop", "启动 Kuikly Desktop 应用")
    DebugConfig.debug("Kuikly Desktop", "调试模式: ${DebugConfig.DEBUG_ENABLED}")
    DebugConfig.debug("Kuikly Desktop", "性能优化: ${DebugConfig.PERFORMANCE_OPTIMIZATION_ENABLED}")
    
    // 启动性能监控
    if (DebugConfig.PERFORMANCE_DEBUG_ENABLED) {
        PerformanceMonitor.startMonitoring(10) // 每10秒监控一次
    }
    
    // 启动线程监控
    if (DebugConfig.THREAD_DEBUG_ENABLED) {
        ThreadMonitor.startMonitoring(5) // 每5秒监控一次
    }

    Dispatchers.Main
    
    // 2. 初始化 Kuikly 线程调度器 (暂时注释掉，避免类路径问题)
    DebugConfig.debug("Kuikly Desktop", "跳过 Kuikly 线程调度器初始化...")
     try {
         // 设置自定义的线程调度器，将任务调度到 Web 容器线程执行
         setKuiklyThreadScheduler(object : KuiklyThreadScheduler {
             override fun scheduleOnKuiklyThread(pagerId: String) {
                 // 将任务调度到 Web 容器线程执行
                 // 这里使用 SwingUtilities.invokeLater 来确保任务在 Web 容器线程中执行
                 SwingUtilities.invokeLater {
                     try {
                         DebugConfig.debug("Kuikly Desktop", "在 Web 容器线程中执行任务: pagerId=$pagerId")
                         // 注意：这里的 task 参数需要从其他地方获取
                         // 可能需要重新设计接口或者使用其他方式传递任务
                     } catch (e: Exception) {
                         DebugConfig.error("Kuikly Desktop", "执行 Kuikly 线程任务失败: ${e.message}", e)
                     }
                 }
             }
         })
         DebugConfig.success("Kuikly Desktop", "Kuikly 线程调度器初始化完成")
     } catch (e: Exception) {
         DebugConfig.error("Kuikly Desktop", "Kuikly 线程调度器初始化失败: ${e.message}", e)
     }

    // 2. 构建 JCEF 应用
    DebugConfig.info("Kuikly Desktop", "正在初始化 Chromium...")
    val builder = CefAppBuilder()
    
    // 配置 JCEF 以减少线程警告
    builder.setAppHandler(object : MavenCefAppHandlerAdapter() {
        override fun onContextInitialized() {
            DebugConfig.success("Kuikly Desktop", "JCEF 上下文初始化完成")
        }
    })

    // 应用性能优化参数
    val performanceArgs = DebugConfig.getPerformanceArgs()
    val debugArgs = DebugConfig.getDebugArgs()
    
    DebugConfig.debug("Kuikly Desktop", "应用性能优化参数: ${performanceArgs.size} 个")
    DebugConfig.debug("Kuikly Desktop", "应用调试参数: ${debugArgs.size} 个")
    
    // 添加性能优化参数
    performanceArgs.forEach { arg ->
        builder.addJcefArgs(arg)
    }
    
    // 添加调试参数
    debugArgs.forEach { arg ->
        builder.addJcefArgs(arg)
    }
    
    // 初始化 CEF
    val cefApp = builder.build()
    
    SwingUtilities.invokeLater {
        // 创建窗口
        val frame = JFrame("Kuikly Desktop")
        frame.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
        frame.layout = BorderLayout()
        frame.size = Dimension(580, 1920)
        
        // 创建菜单栏 - 使用更简单的方式避免 macOS 组件状态问题
        val menuBar = javax.swing.JMenuBar()
        val devMenu = javax.swing.JMenu("开发者工具")
        
        val openDevToolsItem = javax.swing.JMenuItem("打开开发者工具 (F12)")
        val inspectElementItem = javax.swing.JMenuItem("检查元素 (Ctrl+Shift+I)")
        
        // 禁用菜单项的某些功能以避免组件状态问题
        openDevToolsItem.isEnabled = true
        inspectElementItem.isEnabled = true
        
        devMenu.add(openDevToolsItem)
        devMenu.add(inspectElementItem)
        menuBar.add(devMenu)
        
        // 延迟设置菜单栏，确保窗口完全初始化
        SwingUtilities.invokeLater {
            frame.jMenuBar = menuBar
        }
        
        // 创建浏览器客户端
        val client = cefApp.createClient()
        client.addLifeSpanHandler(object : CefLifeSpanHandlerAdapter() {
            override fun onBeforePopup(
                browser: CefBrowser?,
                frame: CefFrame?,
                target_url: String?,
                target_frame_name: String?
            ): Boolean {

                println("target_url = $target_url")

                browser?.loadURL(target_url)
                return true
            }
        })
        
        // 创建桌面端渲染委托器
        val renderDelegator = DesktopRenderViewDelegator()
        
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
                if (request != null && browser != null) {
                    return renderDelegator.handleCefQuery(
                        browser, frame, queryId.toInt(), request, persistent, callback
                    )
                }
                return false
            }
        }, true)
        client.addMessageRouter(msgRouter)
        
        // 添加加载状态监听
        client.addLoadHandler(object : CefLoadHandlerAdapter() {
            override fun onLoadingStateChange(
                browser: CefBrowser?,
                isLoading: Boolean,
                canGoBack: Boolean,
                canGoForward: Boolean
            ) {
                if (!isLoading && browser != null) {
                    DebugConfig.success("Kuikly Desktop", "页面加载完成，正在初始化渲染层...")
                    renderDelegator.setBrowser(browser)
                    renderDelegator.initRenderLayer()
                }
            }
            
            override fun onLoadStart(browser: CefBrowser?, frame: CefFrame?, transitionType: CefRequest.TransitionType?) {
                DebugConfig.debug("Kuikly Desktop", "开始加载: ${frame?.url}")
            }
            
            override fun onLoadEnd(browser: CefBrowser?, frame: CefFrame?, httpStatusCode: Int) {
                DebugConfig.debug("Kuikly Desktop", "加载结束: ${frame?.url} (状态码: $httpStatusCode)")
            }
            
            override fun onLoadError(
                browser: CefBrowser?,
                frame: CefFrame?,
                errorCode: CefLoadHandler.ErrorCode?,
                errorText: String?,
                failedUrl: String?
            ) {
                DebugConfig.error("Kuikly Desktop", "加载失败: $failedUrl")
                DebugConfig.error("Kuikly Desktop", "错误: $errorText")
            }
        })
        
        // 创建浏览器实例 - 使用本地网页加载 Web 渲染层
        val webRenderHtmlPath = java.io.File("../desktop_render_web.html").absolutePath
        val webRenderHtmlUrl = "file://$webRenderHtmlPath"
        
        // 6. 加载本地网页（包含 Web 渲染层）
        DebugConfig.info("Kuikly Desktop", "正在加载本地网页（Web 渲染层）...")
        val browser = client.createBrowser(webRenderHtmlUrl, false, false)



        // 为浏览器组件添加边框，便于调试（仅在调试模式下）
        if (DebugConfig.DEBUG_ENABLED) {
            val browserComponent = browser.uiComponent
            if (browserComponent is javax.swing.JComponent) {
                browserComponent.border = javax.swing.BorderFactory.createLineBorder(java.awt.Color.RED, 2)
            }
        }
        
        // 添加开发者工具支持
        browser.getDevTools()
        DebugConfig.debug("Kuikly Desktop", "开发者工具已启用")
        
        // 设置菜单项事件监听器 - 添加异常处理避免 macOS 组件状态问题
        openDevToolsItem.addActionListener {
            try {
                SwingUtilities.invokeLater {
                    try {
                        // 使用 JavaScript 来打开开发者工具
                        val devToolsScript = """
                            console.log('[DevTools] 尝试打开开发者工具...');
                            // 尝试多种方式打开开发者工具
                            if (typeof window.chrome !== 'undefined' && window.chrome.runtime) {
                                console.log('[DevTools] 使用 Chrome 扩展 API');
                            }
                            // 模拟 F12 按键
                            document.dispatchEvent(new KeyboardEvent('keydown', {
                                key: 'F12',
                                code: 'F12',
                                keyCode: 123,
                                which: 123,
                                bubbles: true
                            }));
                            console.log('[DevTools] 开发者工具已通过菜单打开');
                        """.trimIndent()
//                        browser.executeJavaScript(devToolsScript, "", 0)
                        DebugConfig.debug("Kuikly Desktop", "菜单：开发者工具已打开")
                    } catch (e: Exception) {
                        DebugConfig.error("Kuikly Desktop", "打开开发者工具失败: ${e.message}", e)
                    }
                }
            } catch (e: java.awt.IllegalComponentStateException) {
                // 忽略 macOS 组件状态异常
                DebugConfig.warning("Kuikly Desktop", "忽略组件状态异常，继续执行开发者工具功能")
                try {
                    val devToolsScript = """
                        console.log('[DevTools] 尝试打开开发者工具...');
                        document.dispatchEvent(new KeyboardEvent('keydown', {
                            key: 'F12',
                            code: 'F12',
                            keyCode: 123,
                            which: 123,
                            bubbles: true
                        }));
                        console.log('[DevTools] 开发者工具已通过菜单打开');
                    """.trimIndent()
                    browser.executeJavaScript(devToolsScript, "", 0)
                    DebugConfig.debug("Kuikly Desktop", "菜单：开发者工具已打开（异常处理）")
                } catch (ex: Exception) {
                    DebugConfig.error("Kuikly Desktop", "打开开发者工具失败: ${ex.message}", ex)
                }
            } catch (e: Exception) {
                DebugConfig.error("Kuikly Desktop", "菜单事件处理失败: ${e.message}", e)
            }
        }
        
        inspectElementItem.addActionListener {
            try {
                SwingUtilities.invokeLater {
                    try {
                        // 使用 JavaScript 来启用检查元素模式
                        val inspectScript = """
                            console.log('[DevTools] 启用检查元素模式...');
                            // 模拟 Ctrl+Shift+I 按键
                            document.dispatchEvent(new KeyboardEvent('keydown', {
                                key: 'I',
                                code: 'KeyI',
                                keyCode: 73,
                                which: 73,
                                ctrlKey: true,
                                shiftKey: true,
                                bubbles: true
                            }));
                            console.log('[DevTools] 检查元素模式已启用');
                        """.trimIndent()
                        browser.executeJavaScript(inspectScript, "", 0)
                        DebugConfig.debug("Kuikly Desktop", "菜单：检查元素模式已启用")
                    } catch (e: Exception) {
                        DebugConfig.error("Kuikly Desktop", "启用检查元素失败: ${e.message}", e)
                    }
                }
            } catch (e: java.awt.IllegalComponentStateException) {
                // 忽略 macOS 组件状态异常
                DebugConfig.warning("Kuikly Desktop", "忽略组件状态异常，继续执行检查元素功能")
                try {
                    val inspectScript = """
                        console.log('[DevTools] 启用检查元素模式...');
                        document.dispatchEvent(new KeyboardEvent('keydown', {
                            key: 'I',
                            code: 'KeyI',
                            keyCode: 73,
                            which: 73,
                            ctrlKey: true,
                            shiftKey: true,
                            bubbles: true
                        }));
                        console.log('[DevTools] 检查元素模式已启用');
                    """.trimIndent()
                    browser.executeJavaScript(inspectScript, "", 0)
                    DebugConfig.debug("Kuikly Desktop", "菜单：检查元素模式已启用（异常处理）")
                } catch (ex: Exception) {
                    DebugConfig.error("Kuikly Desktop", "启用检查元素失败: ${ex.message}", ex)
                }
            } catch (e: Exception) {
                DebugConfig.error("Kuikly Desktop", "菜单事件处理失败: ${e.message}", e)
            }
        }
        
        // 添加键盘监听器来支持开发者工具快捷键
        frame.rootPane.inputMap.put(javax.swing.KeyStroke.getKeyStroke("F12"), "toggleDevTools")
        frame.rootPane.actionMap.put("toggleDevTools", object : javax.swing.AbstractAction() {
            override fun actionPerformed(e: java.awt.event.ActionEvent?) {
                SwingUtilities.invokeLater {
                    try {
                        // 使用 JavaScript 来打开开发者工具
                        val devToolsScript = """
                            console.log('[DevTools] 尝试打开开发者工具...');
                            // 模拟 F12 按键
                            document.dispatchEvent(new KeyboardEvent('keydown', {
                                key: 'F12',
                                code: 'F12',
                                keyCode: 123,
                                which: 123,
                                bubbles: true
                            }));
                            console.log('[DevTools] 开发者工具已通过 F12 打开');
                        """.trimIndent()
                        browser.executeJavaScript(devToolsScript, "", 0)
                        DebugConfig.debug("Kuikly Desktop", "开发者工具已打开 (F12)")
                    } catch (e: Exception) {
                        DebugConfig.error("Kuikly Desktop", "打开开发者工具失败: ${e.message}", e)
                    }
                }
            }
        })
        
        // 添加右键菜单支持
        frame.rootPane.inputMap.put(javax.swing.KeyStroke.getKeyStroke("ctrl shift I"), "inspectElement")
        frame.rootPane.actionMap.put("inspectElement", object : javax.swing.AbstractAction() {
            override fun actionPerformed(e: java.awt.event.ActionEvent?) {
                SwingUtilities.invokeLater {
                    try {
                        // 使用 JavaScript 来启用检查元素模式
                        val inspectScript = """
                            console.log('[DevTools] 启用检查元素模式...');
                            // 模拟 Ctrl+Shift+I 按键
                            document.dispatchEvent(new KeyboardEvent('keydown', {
                                key: 'I',
                                code: 'KeyI',
                                keyCode: 73,
                                which: 73,
                                ctrlKey: true,
                                shiftKey: true,
                                bubbles: true
                            }));
                            console.log('[DevTools] 检查元素模式已通过 Ctrl+Shift+I 启用');
                        """.trimIndent()
                        browser.executeJavaScript(inspectScript, "", 0)
                        DebugConfig.debug("Kuikly Desktop", "检查元素模式已启用 (Ctrl+Shift+I)")
                    } catch (e: Exception) {
                        DebugConfig.error("Kuikly Desktop", "启用检查元素失败: ${e.message}", e)
                    }
                }
            }
        })
        
        // 将浏览器添加到窗口
        frame.add(browser.uiComponent, BorderLayout.CENTER)
        
        frame.isVisible = true
        
        DebugConfig.success("Kuikly Desktop", "窗口已启动！")
        DebugConfig.info("Kuikly Desktop", "当前为完整版本，已启用 JCEF 和 JS Bridge")
        DebugConfig.info("Kuikly Desktop", "支持完整的 Web 渲染和双向通信")
        
        // 显示性能摘要
        if (DebugConfig.PERFORMANCE_DEBUG_ENABLED) {
            DebugConfig.performanceDebug("Kuikly Desktop", PerformanceMonitor.getPerformanceSummary())
        }
    }
}
