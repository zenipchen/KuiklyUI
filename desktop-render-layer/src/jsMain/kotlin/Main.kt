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

        // 初始化 core.nvi 命名空间
        if (window.asDynamic().com == null) {
            window.asDynamic().com = js("{}")
        }
        if (window.asDynamic().com.tencent == null) {
            window.asDynamic().com.tencent = js("{}")
        }
        if (window.asDynamic().com.tencent.kuikly == null) {
            window.asDynamic().com.tencent.kuikly = js("{}")
        }
        if (window.asDynamic().com.tencent.kuikly.core == null) {
            window.asDynamic().com.tencent.kuikly.core = js("{}")
        }
        if (window.asDynamic().com.tencent.kuikly.core.nvi == null) {
            window.asDynamic().com.tencent.kuikly.core.nvi = js("{}")
        }

        // 1. 提供 callKotlinMethod 钩子，供 core-render-web 调用 JVM 逻辑层
        window.asDynamic().callKotlinMethod = { methodId: Int, arg0: Any?, arg1: Any?, arg2: Any?, arg3: Any?, arg4: Any?, arg5: Any? ->
            console.log("[Desktop Render Layer] callKotlinMethod 调用: methodId=$methodId")
            
            // 通过 cefQuery 调用 JVM 逻辑层
            val request = js("JSON.stringify")(js("""
                {
                    type: 'callKotlinMethod',
                    methodId: methodId,
                    args: [arg0, arg1, arg2, arg3, arg4, arg5]
                }
            """))
            
            // 同步调用 JVM
            var result: Any? = null
            if (js("typeof window.cefQuery === 'function'")) {
                window.asDynamic().cefQuery(js("""
                    {
                        request: request,
                        onSuccess: function(response) {
                            result = response;
                        },
                        onFailure: function(error_code, error_message) {
                            console.error('[Desktop Render Layer] callKotlinMethod 调用失败:', error_message);
                            result = null;
                        }
                    }
                """))
            } else {
                console.warn("[Desktop Render Layer] cefQuery 未找到，无法调用 JVM 逻辑层")
            }
            
            result
        }

        // 2. 提供 callNative 方法，供 JVM 调用 Web 渲染层
        window.asDynamic().callNative = { methodId: Int, arg0: Any?, arg1: Any?, arg2: Any?, arg3: Any?, arg4: Any?, arg5: Any? ->
            console.log("[Desktop Render Layer] callNative 调用: methodId=$methodId")
            
            // 这里应该调用 core-render-web 的 callNative 实现
            // 暂时返回 null，实际实现需要调用 core-render-web 的 callNative
            null
        }

        // 3. 注册 registerCallNative 函数，供 core-render-web 注册回调
        window.asDynamic().com.tencent.kuikly.core.nvi.registerCallNative = { pagerId: String, callback: dynamic ->
            console.log("[Desktop Render Layer] 注册 callNative 回调: pagerId=$pagerId")
            // 存储回调，用于后续的 callNative 调用
            window.asDynamic().desktopCallNativeCallback = callback
        }

        // 4. 实现 renderContent 函数，用于处理来自 JVM 的调用
        window.asDynamic().renderContent = { data: String ->
            try {
                val renderData = js("JSON.parse(data)")
                console.log("[Desktop Render Layer] 收到渲染指令:", renderData)

                when (renderData.type) {
                    "nativeCall" -> {
                        // 处理 callNative 调用
                        val methodId = renderData.methodId
                        val arg0 = renderData.arg0
                        val arg1 = renderData.arg1
                        val arg2 = renderData.arg2
                        val arg3 = renderData.arg3
                        val arg4 = renderData.arg4
                        val arg5 = renderData.arg5

                        console.log("[Desktop Render Layer] 处理 callNative: methodId=$methodId")

                        // 调用存储的 callNative 回调
                        val callback = window.asDynamic().desktopCallNativeCallback
                        if (callback && js("typeof callback === 'function'")) {
                            callback(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                        } else {
                            console.warn("[Desktop Render Layer] callNative 回调未注册")
                        }
                    }
                    else -> {
                        console.log("[Desktop Render Layer] 未知的渲染指令类型:", renderData.type)
                    }
                }
            } catch (e: dynamic) {
                console.error("[Desktop Render Layer] 处理渲染指令失败:", e)
            }
        }
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
