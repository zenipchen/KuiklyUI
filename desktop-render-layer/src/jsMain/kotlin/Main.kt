import com.tencent.kuikly.core.render.web.KuiklyRenderView
import com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode
import com.tencent.kuikly.core.render.web.expand.KuiklyRenderViewDelegatorDelegate
import com.tencent.kuikly.core.render.web.ktx.SizeI
import com.tencent.kuikly.core.render.web.runtime.web.expand.KuiklyRenderViewDelegator
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
 * 参考 h5App 的实现，正确继承 KuiklyRenderViewDelegatorDelegate 并桥接 core-render-web
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
class DesktopRenderViewDelegator : KuiklyRenderViewDelegatorDelegate {

    // 使用 core-render-web 的委托器实现
    private val delegator = KuiklyRenderViewDelegator(this)

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
        
        // 确保 pageData 是一个正确的 Kotlin Map 对象
        val kotlinPageData = if (pageData is kotlin.collections.Map<*, *>) {
            pageData as Map<String, Any>
        } else {
            // 如果传入的不是 Kotlin Map，创建一个新的 Map
            val newMap = mutableMapOf<String, Any>()
            if (pageData != null) {
                // 尝试从 JavaScript 对象转换为 Kotlin Map
                try {
                    val jsObject = pageData.asDynamic()
                    for (key in js("Object.keys")(jsObject)) {
                        val keyStr = key as String
                        newMap[keyStr] = jsObject[keyStr]
                    }
                } catch (e: Exception) {
                    console.warn("[Desktop Render Layer] 无法转换 pageData: ${e.message}")
                }
            }
            newMap
        }
        
        console.log("[Desktop Render Layer] 转换后的 pageData: $kotlinPageData")
        
        // 使用 core-render-web 的委托器进行初始化
        delegator.onAttach(container, pageName, kotlinPageData, size)
    }

    /**
     * 页面显示
     */
    fun resume() {
        console.log("[Desktop Render Layer] 页面显示")
        delegator.onResume()
    }
    
    /**
     * 页面隐藏
     */
    fun pause() {
        console.log("[Desktop Render Layer] 页面隐藏")
        delegator.onPause()
    }
    
    /**
     * 页面销毁
     */
    fun detach() {
        console.log("[Desktop Render Layer] 页面销毁")
        delegator.onDetach()
    }
    
    /**
     * 发送事件
     */
    fun sendEvent(event: String, data: Map<String, Any>) {
        console.log("[Desktop Render Layer] 发送事件: $event, data: $data")
        delegator.sendEvent(event, data)
    }

    // 实现 KuiklyRenderViewDelegatorDelegate 接口
    override fun onKuiklyRenderViewCreated() {
        console.log("[Desktop Render Layer] KuiklyRenderView 已创建")
    }

    override fun onKuiklyRenderContentViewCreated() {
        console.log("[Desktop Render Layer] KuiklyRenderView 内容视图已创建")
    }

    override fun onPageLoadComplete(
        isSucceed: Boolean,
        errorReason: com.tencent.kuikly.core.render.web.exception.ErrorReason?,
        executeMode: KuiklyRenderCoreExecuteMode
    ) {
        console.log("[Desktop Render Layer] 页面加载完成: succeed=$isSucceed, mode=$executeMode")
        if (!isSucceed && errorReason != null) {
            console.error("[Desktop Render Layer] 页面加载失败: $errorReason")
        }
    }

    override fun onUnhandledException(
        throwable: Throwable,
        errorReason: com.tencent.kuikly.core.render.web.exception.ErrorReason,
        executeMode: KuiklyRenderCoreExecuteMode
    ) {
        console.error("[Desktop Render Layer] 未处理异常: ${throwable.message}, reason: $errorReason, mode: $executeMode")
        throwable.printStackTrace()
    }
}
