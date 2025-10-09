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
    console.log("createRenderView 方法类型:", js("typeof window.createRenderView"))
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
class DesktopRenderViewDelegator : KuiklyRenderViewDelegatorDelegate {
    
    // 使用 H5 的委托器实现
    private val delegator = com.tencent.kuikly.core.render.web.runtime.web.expand.KuiklyRenderViewDelegator(this)
    
    /**
     * 初始化渲染视图
     */
    fun init(
        container: Any,
        pageName: String,
        pageData: Map<String, Any>,
        size: SizeI
    ) {
        delegator.onAttach(container, pageName, pageData, size)
    }
    
    /**
     * 页面显示
     */
    fun resume() {
        delegator.onResume()
    }
    
    /**
     * 页面隐藏
     */
    fun pause() {
        delegator.onPause()
    }
    
    /**
     * 页面销毁
     */
    fun detach() {
        delegator.onDetach()
    }
    
    /**
     * 发送事件
     */
    fun sendEvent(event: String, data: Map<String, Any>) {
        delegator.sendEvent(event, data)
    }

    override fun coreExecuteMode(): KuiklyRenderCoreExecuteMode {
        return KuiklyRenderCoreExecuteMode.JS
    }

    override fun onKuiklyRenderViewCreated() {
        console.log("[Desktop Render Layer] KuiklyRenderView 已创建")
    }

    override fun onKuiklyRenderContentViewCreated() {
        console.log("[Desktop Render Layer] KuiklyRenderContentView 已创建")
    }
    
    override fun onPageLoadComplete(isSucceed: Boolean, errorReason: com.tencent.kuikly.core.render.web.exception.ErrorReason?, executeMode: KuiklyRenderCoreExecuteMode) {
        console.log("[Desktop Render Layer] 页面加载完成: success=$isSucceed, errorReason=$errorReason")
    }
    
    override fun onUnhandledException(throwable: Throwable, errorReason: com.tencent.kuikly.core.render.web.exception.ErrorReason, executeMode: KuiklyRenderCoreExecuteMode) {
        console.error("[Desktop Render Layer] 未处理异常: ${throwable.message}", throwable)
    }
}
