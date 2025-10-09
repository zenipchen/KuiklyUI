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
    window.asDynamic().DesktopRenderLayer = DesktopRenderLayerAPI()
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
     * 创建 KuiklyRenderView 实例
     */
    fun createRenderView(executeMode: String = "JS"): dynamic {
        val mode = when (executeMode) {
            "JS" -> KuiklyRenderCoreExecuteMode.JS
            else -> KuiklyRenderCoreExecuteMode.JS
        }
        
        return KuiklyRenderView(mode, DesktopRenderViewDelegate())
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
 * 桌面渲染视图委托
 */
class DesktopRenderViewDelegate : KuiklyRenderViewDelegatorDelegate {
    
    override fun coreExecuteMode(): KuiklyRenderCoreExecuteMode {
        return KuiklyRenderCoreExecuteMode.JS
    }
    
    override fun onKuiklyRenderViewCreated() {
        console.log("[Desktop Render Layer] KuiklyRenderView 已创建")
    }
    
    override fun onKuiklyRenderContentViewCreated() {
        console.log("[Desktop Render Layer] KuiklyRenderContentView 已创建")
    }
}
