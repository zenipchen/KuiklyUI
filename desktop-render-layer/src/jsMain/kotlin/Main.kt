import com.tencent.kuikly.core.render.web.IKuiklyRenderExport
import com.tencent.kuikly.core.render.web.KuiklyRenderView
import com.tencent.kuikly.core.render.web.context.KuiklyRenderCoreExecuteMode
import com.tencent.kuikly.core.render.web.expand.KuiklyRenderViewDelegatorDelegate
import com.tencent.kuikly.core.render.web.expand.components.*
import com.tencent.kuikly.core.render.web.expand.components.list.KRListView
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
    window.asDynamic().refresh = { -> api.refresh() }
    
    console.log("DesktopRenderLayer API 已导出")
    console.log("createRenderViewDelegator 方法类型:", js("typeof window.createRenderViewDelegator"))
    console.log("refresh 方法类型:", js("typeof window.refresh"))
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
 * 全局导出的刷新方法
 */
@OptIn(ExperimentalJsExport::class)
@JsExport
fun refresh() {
    console.log("[Desktop Render Layer] 全局 refresh 调用")
    
    // 获取当前活跃的 renderView 实例
    val renderView = window.asDynamic().desktopRenderView
    if (renderView && renderView.asDynamic().delegator) {
        val delegator = renderView.asDynamic().delegator
        if (delegator.asDynamic().sendEvent) {
            // 生成随机刷新数据
            val randomValue = js("Math.random()") as Double
            val randomKey = "refresh_${randomValue.toString().replace(".", "")}"
            
            val kotlinData = mapOf(
                "refreshKey" to randomKey,
                "forceRefresh" to true,
                "randomValue" to randomValue
            )
            
            console.log("[Desktop Render Layer] 使用随机刷新数据: $kotlinData")
            delegator.asDynamic().sendEvent("refresh", kotlinData)
        } else {
            console.warn("[Desktop Render Layer] delegator.sendEvent 方法不存在")
        }
    } else {
        console.warn("[Desktop Render Layer] 未找到活跃的 renderView 或 delegator")
    }
}

/**
 * 初始化全局对象
 */
private fun initGlobalObject() {
    // 设置 kuiklyWindow 和 kuiklyDocument
    window.asDynamic().kuiklyWindow = window
    window.asDynamic().kuiklyDocument = document
    
    // 设置 com.tencent.kuikly.core.nvi 命名空间
    window.asDynamic().com = window.asDynamic().com ?: js("{}")
    window.asDynamic().com.tencent = window.asDynamic().com.tencent ?: js("{}")
    window.asDynamic().com.tencent.kuikly = window.asDynamic().com.tencent.kuikly ?: js("{}")
    window.asDynamic().com.tencent.kuikly.core = window.asDynamic().com.tencent.kuikly.core ?: js("{}")
    window.asDynamic().com.tencent.kuikly.core.nvi = window.asDynamic().com.tencent.kuikly.core.nvi ?: js("{}")
    
    // 实现 callKotlinMethod 钩子
    window.asDynamic().callKotlinMethod = { methodId: Int, arg0: Any?, arg1: Any?, arg2: Any?, arg3: Any?, arg4: Any?, arg5: Any? ->
//        console.log("[Desktop Render Layer] callKotlinMethod 调用: methodId=$methodId")
        
        // 通过 cefQuery 调用 JVM 逻辑层
        if (window.asDynamic().cefQuery) {
            val requestObj = js("{}")
            requestObj.asDynamic().type = "callKotlinMethod"
            requestObj.asDynamic().methodId = methodId
            requestObj.asDynamic().args = arrayOf(arg0, arg1, arg2, arg3, arg4, arg5)
            
            val request = JSON.stringify(requestObj)
            
            val cefQueryObj = js("{}")
            cefQueryObj.asDynamic().request = request
            cefQueryObj.asDynamic().onSuccess = { response: Any? ->
                console.log("[Desktop Render Layer] callKotlinMethod 成功: $response")
            }
            cefQueryObj.asDynamic().onFailure = { errorCode: Int, errorMessage: String ->
                console.error("[Desktop Render Layer] callKotlinMethod 失败: $errorMessage")
            }
            
            window.asDynamic().cefQuery(cefQueryObj)
        } else {
            console.warn("[Desktop Render Layer] cefQuery 不可用")
        }
        
        "OK"
    }
    
    // 判断是否为同步方法调用（参考 core-render-web 的实现）
    fun isSyncMethodCall(methodId: Int, arg5: Any?): Boolean {
        // 如果是调用模块方法且第5个参数是1，表示同步方法
        if (methodId == 8) { // KuiklyRenderNativeMethodCallModuleMethod
            val fifthArg = if (arg5 != null) {
                try {
                    arg5.toString().toInt()
                } catch (e: Exception) {
                    0
                }
            } else {
                0
            }
            return fifthArg == 1
        }
        
        // 其他同步方法（根据 core-render-web 的定义）
        return methodId == 6 || // KuiklyRenderNativeMethodCalculateRenderViewSize
               methodId == 9 || // KuiklyRenderNativeMethodCreateShadow
               methodId == 10 || // KuiklyRenderNativeMethodRemoveShadow
               methodId == 11 || // KuiklyRenderNativeMethodSetShadowForView
               methodId == 12 || // KuiklyRenderNativeMethodSetShadowProp
               methodId == 13 || // KuiklyRenderNativeMethodSetTimeout
               methodId == 14    // KuiklyRenderNativeMethodCallShadowMethod
    }
    
    // 实现 callNative 钩子
    window.asDynamic().callNative = { methodId: Int, arg0: Any?, arg1: Any?, arg2: Any?, arg3: Any?, arg4: Any?, arg5: Any? ->
        val methodName = when (methodId) {
            1 -> "CREATE_RENDER_VIEW"
            2 -> "REMOVE_RENDER_VIEW"
            3 -> "INSERT_SUB_RENDER_VIEW"
            4 -> "SET_VIEW_PROP"
            5 -> "SET_RENDER_VIEW_FRAME"
            6 -> "CALCULATE_RENDER_VIEW_SIZE"
            7 -> "CALL_VIEW_METHOD"
            8 -> "CALL_MODULE_METHOD"
            9 -> "CREATE_SHADOW"
            10 -> "REMOVE_SHADOW"
            11 -> "SET_SHADOW_PROP"
            12 -> "SET_SHADOW_FOR_VIEW"
            13 -> "SET_TIMEOUT"
            14 -> "CALL_SHADOW_METHOD"
            15 -> "FIRE_FATAL_EXCEPTION"
            16 -> "SYNC_FLUSH_UI"
            17 -> "CALL_TDF_MODULE_METHOD"
            else -> "UNKNOWN_METHOD_$methodId"
        }
//        console.log("[Desktop Render Layer] callNative 调用: methodId=$methodId ($methodName)")
        
        // 判断是否为同步方法调用
        val isSyncCall = isSyncMethodCall(methodId, arg5)
//        console.log("[Desktop Render Layer] callNative 同步调用: $isSyncCall")
        
        // 调用 core-render-web 的 callNative 实现
        try {
            // 获取当前活跃的 renderView 实例
            val renderView = window.asDynamic().desktopRenderView
            if (renderView && renderView.asDynamic().delegator) {
                val delegator = renderView.asDynamic().delegator
                if (delegator.asDynamic().callNative) {
//                    console.log("[Desktop Render Layer] 调用 delegator.callNative")
                    val result = delegator.asDynamic().callNative(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                    console.log("[Desktop Render Layer] callNative 执行完成，结果: $result")
                    
                    if (isSyncCall) {
                        // 同步调用，直接返回结果
                        result ?: ""
                    } else {
                        // 异步调用，返回 null
                        null
                    }
                } else {
                    console.warn("[Desktop Render Layer] delegator.callNative 方法不存在")
                    if (isSyncCall) "" else null
                }
            } else {
                console.warn("[Desktop Render Layer] 未找到活跃的 renderView 或 delegator")
                if (isSyncCall) "" else null
            }
        } catch (e: Exception) {
            console.error("[Desktop Render Layer] callNative 调用失败: ${e.message}")
            if (isSyncCall) "" else null
        }
    }
    
    // 实现 registerCallNative 函数
    window.asDynamic().com.tencent.kuikly.core.nvi.registerCallNative = { pagerId: String, callback: Any? ->
        console.log("[Desktop Render Layer] 注册 callNative 回调: pagerId=$pagerId")
        // 这里可以存储回调函数供后续使用
    }
    
    console.log("[Desktop Render Layer] 全局对象初始化完成")
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
    
    /**
     * 刷新方法
     */
    fun refresh() {
        console.log("[Desktop Render Layer API] 刷新调用")
        
        // 获取当前活跃的 renderView 实例
        val renderView = window.asDynamic().desktopRenderView
        if (renderView && renderView.asDynamic().delegator) {
            val delegator = renderView.asDynamic().delegator
            if (delegator.asDynamic().sendEvent) {
                // 生成随机刷新数据
                val randomValue = js("Math.random()") as Double
                val randomKey = "refresh_${randomValue.toString().replace(".", "")}"
                
                val kotlinData = mapOf(
                    "refreshKey" to randomKey,
                    "forceRefresh" to true,
                    "randomValue" to randomValue
                )
                
                console.log("[Desktop Render Layer API] 使用随机刷新数据: $kotlinData")
                delegator.asDynamic().sendEvent("refresh", kotlinData)
            } else {
                console.warn("[Desktop Render Layer API] delegator.sendEvent 方法不存在")
            }
        } else {
            console.warn("[Desktop Render Layer API] 未找到活跃的 renderView 或 delegator")
        }
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
    val delegator = KuiklyRenderViewDelegator(this)

    /**
     * 初始化渲染视图
     */
    fun init(
        container: Any,
        pageName: String,
        pageData: Any,
        size: Any
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
        
        // 处理 size 参数：可能是 SizeI 对象或 [width, height] 数组
        val kotlinSize = try {
            val dynamicSize = size.asDynamic()
            when {
                // 检查是否是数组
                js("Array.isArray")(dynamicSize) as Boolean -> {
                    // 如果是数组 [width, height]
                    console.log("[Desktop Render Layer] size 是数组，转换为 SizeI")
                    SizeI(dynamicSize[0] as Int, dynamicSize[1] as Int)
                }
                // 检查是否有 width 和 height 属性
                dynamicSize.width != undefined && dynamicSize.height != undefined -> {
                    // 如果是对象 { width, height } 或 SizeI
                    console.log("[Desktop Render Layer] size 有 width/height 属性")
                    SizeI(dynamicSize.width as Int, dynamicSize.height as Int)
                }
                else -> {
                    console.warn("[Desktop Render Layer] 无法识别的 size 格式，使用默认值")
                    SizeI(window.innerWidth, window.innerHeight)
                }
            }
        } catch (e: Exception) {
            console.error("[Desktop Render Layer] 转换 size 失败: ${e.message}")
            SizeI(window.innerWidth, window.innerHeight)
        }
        
        console.log("[Desktop Render Layer] 转换后的 size: $kotlinSize")
        
        // 使用 core-render-web 的委托器进行初始化
        delegator.onAttach(container, pageName, kotlinPageData, kotlinSize)
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
    
    /**
     * 注册外部渲染视图
     * 这个方法会在 KuiklyRenderViewDelegator 初始化时被调用
     * h5 版本的 KuiklyRenderViewDelegator 已经注册了所有内置视图
     * 这里只需要注册自定义视图（如果有的话）
     */
    override fun registerExternalRenderView(kuiklyRenderExport: IKuiklyRenderExport) {
        console.log("[Desktop Render Layer] ✅ registerExternalRenderView 被调用")
        console.log("[Desktop Render Layer] 📋 h5 的 KuiklyRenderViewDelegator 已经注册了所有内置视图")
        console.log("[Desktop Render Layer] 📋 如果需要自定义视图，在这里注册")
        
        // 不需要重复注册内置视图，h5 版本已经注册了：
        // - KRView
        // - KRRichTextView
        // - KRTextFieldView
        // - KRTextAreaView
        // - KRListView
        // - KRScrollContentView
        // - KRHoverView
        // - KRVideoView
        // - KRCanvasView
        // - KRBlurView
        // - KRActivityIndicatorView
        // - KRPagView
        // - KRMaskView
        // - KRImageView
        
        // 如果有自定义视图，在这里注册：
        // with(kuiklyRenderExport) {
        //     renderViewExport("CustomView", { CustomView() })
        // }
    }
}
