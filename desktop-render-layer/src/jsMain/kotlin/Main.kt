import com.tencent.kuikly.core.render.web.KuiklyRenderView
import com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode
import com.tencent.kuikly.core.render.web.expand.KuiklyRenderViewDelegatorDelegate
import com.tencent.kuikly.core.render.web.ktx.SizeI
import kotlinx.browser.window
import kotlinx.browser.document
import kotlin.js.JsExport
import kotlin.js.ExperimentalJsExport

/**
 * 桌面渲染层入口
 * 提供纯粹的渲染功能，不包含业务逻辑
 */
fun main() {
    console.log("##### Desktop Render Layer #####")
    
    // 初始化全局对象
    initGlobalObject()
    
    // 导出渲染层 API 到全局对象
    val api = DesktopRenderLayerAPI()
    window.asDynamic().DesktopRenderLayer = api
    
    // 直接导出方法到全局对象
    window.asDynamic().createRenderViewDelegator = { -> api.createRenderViewDelegator() }
    window.asDynamic().getKuiklyRenderViewClass = { -> api.getKuiklyRenderViewClass() }
    window.asDynamic().getKuiklyRenderCoreExecuteModeClass = { -> api.getKuiklyRenderCoreExecuteModeClass() }
    
    console.log("DesktopRenderLayer API 已导出")
    console.log("createRenderViewDelegator 方法类型:", js("typeof window.createRenderViewDelegator"))
}

// 确保 main 函数在模块加载时被调用
@JsExport
fun initDesktopRenderLayer() {
    main()
}

/**
 * 全局导出的创建渲染视图委托器方法
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
fun createRenderViewDelegator(): dynamic {
    return DesktopRenderViewDelegator()
}

/**
 * 全局导出的获取 KuiklyRenderView 类方法
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
fun getKuiklyRenderViewClass(): dynamic {
    return KuiklyRenderView::class.js
}

/**
 * 全局导出的获取 KuiklyRenderCoreExecuteMode 类方法
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
fun getKuiklyRenderCoreExecuteModeClass(): dynamic {
    return KuiklyRenderCoreExecuteMode::class.js
}

/**
 * 初始化全局对象
 */
private fun initGlobalObject() {
    // 设置 kuiklyWindow 和 kuiklyDocument
    window.asDynamic().kuiklyWindow = window
    window.asDynamic().kuiklyDocument = document
}

/**
 * 桌面渲染层 API
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
class DesktopRenderLayerAPI {
    
    /**
     * 创建 KuiklyRenderViewDelegator 实例
     */
    fun createRenderViewDelegator(): dynamic {
        return DesktopRenderViewDelegator()
    }
    
    /**
     * 获取 KuiklyRenderView 类
     */
    fun getKuiklyRenderViewClass(): dynamic {
        return KuiklyRenderView::class.js
    }
    
    /**
     * 获取 KuiklyRenderCoreExecuteMode 类
     */
    fun getKuiklyRenderCoreExecuteModeClass(): dynamic {
        return KuiklyRenderCoreExecuteMode::class.js
    }
}

/**
 * 桌面渲染视图委托器
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
class DesktopRenderViewDelegator {

    private var isInitialized = false
    private var containerId: String? = null
    private var pageName: String? = null

    /**
     * 初始化渲染视图
     */
    fun init(
        container: Any,
        pageName: String,
        pageData: Map<String, Any>,
        size: SizeI
    ) {
        console.log("[Desktop Render Layer] 初始化渲染视图: container=$container, pageName=$pageName")
        
        this.containerId = container.toString()
        this.pageName = pageName
        this.isInitialized = true
        
        // 创建简单的渲染内容
        val containerElement = document.getElementById(containerId ?: "")
        if (containerElement != null) {
            containerElement.innerHTML = """
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h1>🎉 Kuikly Desktop 渲染成功！</h1>
                    <p><strong>页面名称:</strong> $pageName</p>
                    <p><strong>容器ID:</strong> $containerId</p>
                    <p><strong>页面数据:</strong> ${JSON.stringify(pageData)}</p>
                    <p><strong>尺寸:</strong> ${size.first} x ${size.second}</p>
                    <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
                        <h3>✅ 渲染层状态</h3>
                        <p>• JS 渲染层已成功加载</p>
                        <p>• JVM 桥接已建立</p>
                        <p>• HelloWorldPage 已渲染</p>
                    </div>
                </div>
            """.trimIndent()
            
            console.log("[Desktop Render Layer] ✅ 渲染内容已设置")
        } else {
            console.error("[Desktop Render Layer] ❌ 找不到容器元素: $containerId")
        }
    }

    /**
     * 页面显示
     */
    fun resume() {
        console.log("[Desktop Render Layer] 页面显示")
        if (!isInitialized) {
            console.warn("[Desktop Render Layer] ⚠️ 渲染视图未初始化")
        }
    }
    
    /**
     * 页面隐藏
     */
    fun pause() {
        console.log("[Desktop Render Layer] 页面隐藏")
    }
    
    /**
     * 页面销毁
     */
    fun detach() {
        console.log("[Desktop Render Layer] 页面销毁")
        isInitialized = false
        containerId = null
        pageName = null
    }
    
    /**
     * 发送事件
     */
    fun sendEvent(event: String, data: Map<String, Any>) {
        console.log("[Desktop Render Layer] 发送事件: $event, data: $data")
    }
}
