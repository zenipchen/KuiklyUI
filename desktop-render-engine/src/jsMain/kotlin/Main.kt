package com.tencent.kuikly.desktop.render

import com.tencent.kuikly.core.render.web.ktx.SizeI
import com.tencent.kuikly.core.render.web.runtime.web.expand.KuiklyRenderViewDelegator
import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.Element

/**
 * 桌面端渲染引擎主入口
 * 专门为桌面应用设计的 Kuikly 渲染引擎
 */
fun main() {
    console.log("##### Kuikly Desktop Render Engine #####")
    
    // 初始化桌面渲染引擎
    val desktopRenderEngine = DesktopRenderEngine()
    
    // 将渲染引擎暴露到全局作用域
    window.asDynamic().desktopRenderEngine = desktopRenderEngine
    window.asDynamic().renderContent = desktopRenderEngine::renderContent
    
    console.log("✅ 桌面渲染引擎初始化完成")
}

/**
 * 桌面端渲染引擎
 * 基于 core-render-web 的桌面专用实现
 */
class DesktopRenderEngine {
    
    private var currentDelegator: KuiklyRenderViewDelegator? = null
    private var currentContainer: Element? = null
    private var isInitialized = false
    
    /**
     * 初始化渲染引擎
     */
    fun init(containerId: String, config: Map<String, Any> = emptyMap()): Boolean {
        console.log("[Desktop Render Engine] 初始化渲染引擎")
        
        try {
            // 获取容器元素
            val container = document.getElementById(containerId)
            if (container == null) {
                console.error("[Desktop Render Engine] ❌ 找不到容器: $containerId")
                return false
            }
            
            currentContainer = container
            isInitialized = true
            
            console.log("[Desktop Render Engine] ✅ 渲染引擎初始化完成")
            return true
            
        } catch (e: Exception) {
            console.error("[Desktop Render Engine] ❌ 初始化失败:", e)
            return false
        }
    }
    
    /**
     * 渲染指定页面
     */
    fun renderPage(pageName: String, pageData: Map<String, Any> = emptyMap()): Boolean {
        console.log("[Desktop Render Engine] 渲染页面: $pageName")
        
        if (!isInitialized) {
            console.error("[Desktop Render Engine] ❌ 渲染引擎未初始化")
            return false
        }
        
        try {
            // 销毁当前渲染视图
            destroyCurrentPage()
            
            // 创建桌面渲染委托器
            val desktopDelegate = DesktopRenderViewDelegate()
            val delegator = KuiklyRenderViewDelegator(desktopDelegate)
            
            // 准备页面参数
            val params = preparePageParams(pageName, pageData)
            val size = preparePageSize(pageData)
            
            console.log("[Desktop Render Engine] 页面参数:", params)
            console.log("[Desktop Render Engine] 页面尺寸:", size)
            
            // 初始化渲染委托器
            delegator.onAttach(
                currentContainer!!,  // container
                pageName,            // pageName
                params,              // pageData
                size                 // size
            )
            
            // 触发恢复
            delegator.onResume()
            
            currentDelegator = delegator
            
            console.log("[Desktop Render Engine] ✅ 页面渲染完成: $pageName")
            return true
            
        } catch (e: Exception) {
            console.error("[Desktop Render Engine] ❌ 页面渲染失败:", e)
            return false
        }
    }
    
    /**
     * 销毁当前页面
     */
    fun destroyCurrentPage() {
        console.log("[Desktop Render Engine] 销毁当前页面")
        
        try {
            currentDelegator?.onDetach()
            currentDelegator = null
            
            // 清空容器
            currentContainer?.innerHTML = ""
            
        } catch (e: Exception) {
            console.error("[Desktop Render Engine] ❌ 销毁页面失败:", e)
        }
    }
    
    /**
     * 处理来自 JVM 的渲染指令
     */
    fun renderContent(content: String) {
        console.log("[Desktop Render Engine] 收到渲染指令:", content)
        
        try {
            val renderData = JSON.parse<dynamic>(content)
            val type = renderData.type as String
            
            when (type) {
                "init" -> {
                    console.log("[Desktop Render Engine] 初始化渲染引擎")
                    val containerId = renderData.containerId as? String ?: "kuikly-render-container"
                    val config = renderData.config as? Map<String, Any> ?: emptyMap()
                    init(containerId, config)
                }
                
                "render" -> {
                    console.log("[Desktop Render Engine] 执行页面渲染")
                    val pageName = renderData.pageName as? String ?: "HelloWorldPage"
                    val pageData = renderData.pageData as? Map<String, Any> ?: emptyMap()
                    renderPage(pageName, pageData)
                }
                
                "destroy" -> {
                    console.log("[Desktop Render Engine] 销毁渲染引擎")
                    destroyCurrentPage()
                }
                
                "event" -> {
                    console.log("[Desktop Render Engine] 发送事件:", renderData.event)
                    // 处理事件
                }
                
                else -> {
                    console.warn("[Desktop Render Engine] 未知的渲染指令类型:", type)
                }
            }
            
        } catch (e: Exception) {
            console.error("[Desktop Render Engine] 解析渲染指令失败:", e)
        }
    }
    
    /**
     * 准备页面参数
     */
    private fun preparePageParams(pageName: String, pageData: Map<String, Any>): Map<String, Any> {
        val container = currentContainer ?: return emptyMap()
        
        return mapOf(
            "pageName" to pageName,
            "pageViewWidth" to (pageData["pageViewWidth"] ?: container.clientWidth ?: 800),
            "pageViewHeight" to (pageData["pageViewHeight"] ?: container.clientHeight ?: 600),
            "deviceWidth" to window.innerWidth,
            "deviceHeight" to window.innerHeight,
            "platform" to "desktop",
            "isIOS" to false,
            "isAndroid" to false
        ) + pageData
    }
    
    /**
     * 准备页面尺寸
     */
    private fun preparePageSize(pageData: Map<String, Any>): SizeI {
        val container = currentContainer ?: return SizeI(800, 600)
        
        val width = (pageData["pageViewWidth"] as? Number)?.toInt() ?: container.clientWidth ?: 800
        val height = (pageData["pageViewHeight"] as? Number)?.toInt() ?: container.clientHeight ?: 600
        
        return SizeI(width, height)
    }
}

/**
 * 桌面端渲染视图委托器
 * 实现 KuiklyRenderViewDelegatorDelegate 接口
 */
class DesktopRenderViewDelegate : com.tencent.kuikly.core.render.web.expand.KuiklyRenderViewDelegatorDelegate {
    
    override fun registerExternalRenderView(kuiklyRenderExport: com.tencent.kuikly.core.render.web.IKuiklyRenderExport) {
        console.log("[Desktop Render Engine] 注册外部渲染视图")
        // 桌面端暂时不需要注册额外的视图
    }
    
    override fun registerExternalModule(kuiklyRenderExport: com.tencent.kuikly.core.render.web.IKuiklyRenderExport) {
        console.log("[Desktop Render Engine] 注册外部模块")
        // 桌面端暂时不需要注册额外的模块
    }
    
    override fun registerViewExternalPropHandler(kuiklyRenderExport: com.tencent.kuikly.core.render.web.IKuiklyRenderExport) {
        console.log("[Desktop Render Engine] 注册视图外部属性处理器")
        // 桌面端暂时不需要注册额外的属性处理器
    }
    
    override fun coreExecuteMode(): com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode {
        return com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode.JS
    }
    
    override fun syncRenderingWhenPageAppear(): Boolean {
        return true
    }
    
    override fun onKuiklyRenderViewCreated() {
        console.log("[Desktop Render Engine] KuiklyRenderView 已创建")
    }
    
    override fun onKuiklyRenderContentViewCreated() {
        console.log("[Desktop Render Engine] KuiklyRenderContentView 已创建")
    }
    
    override fun onPageLoadComplete(success: Boolean, errorReason: com.tencent.kuikly.core.render.web.exception.ErrorReason?, executeMode: com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode) {
        console.log("[Desktop Render Engine] 页面加载完成: success=$success, errorReason=$errorReason")
    }
    
    override fun onUnhandledException(throwable: Throwable, errorReason: com.tencent.kuikly.core.render.web.exception.ErrorReason, executeMode: com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode) {
        console.error("[Desktop Render Engine] 未处理的异常:", throwable)
    }
}
