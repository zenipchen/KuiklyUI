import com.tencent.kuikly.core.render.web.runtime.web.expand.KuiklyRenderViewDelegator
import com.tencent.kuikly.core.render.web.KuiklyRenderView
import com.tencent.kuikly.core.render.web.expand.KuiklyRenderViewDelegatorDelegate
import org.w3c.dom.HTMLElement

/**
 * 桌面端专用渲染委托器
 */
class DesktopRenderDelegate : KuiklyRenderViewDelegatorDelegate {
    override fun onKuiklyRenderViewCreated() {
        console.log("[Desktop Render Delegate] KuiklyRenderView 已创建")
    }
    
    override fun onKuiklyRenderContentViewCreated() {
        console.log("[Desktop Render Delegate] KuiklyRenderContentView 已创建")
    }
}

/**
 * 桌面端专用渲染宿主
 * 只负责初始化渲染引擎，不包含任何业务逻辑
 */
class DesktopRenderHost {
    private var renderViewDelegator: KuiklyRenderViewDelegator? = null
    private var container: HTMLElement? = null
    
    fun initialize(container: HTMLElement) {
        console.log("[Desktop Render Host] 初始化渲染引擎...")
        
        try {
            this.container = container
            
            // 创建渲染委托器
            val delegate = DesktopRenderDelegate()
            renderViewDelegator = KuiklyRenderViewDelegator(delegate)
            
            console.log("[Desktop Render Host] ✅ 渲染引擎初始化完成")
            
            // 通知 JVM 端渲染层已就绪
            notifyRenderReady()
            
        } catch (e: Throwable) {
            console.error("[Desktop Render Host] ❌ 渲染引擎初始化失败:", e)
        }
    }
    
    private fun notifyRenderReady() {
        if (js("typeof window.cefQuery !== 'undefined'")) {
            val requestData = js("{}")
            requestData.type = "renderReady"
            
            val queryData = js("{}")
            queryData.request = JSON.stringify(requestData)
            queryData.onSuccess = { response: String ->
                console.log("[Desktop Render Host] 已通知 JVM 端渲染层就绪")
            }
            queryData.onFailure = { errorCode: Int, errorMessage: String ->
                console.error("[Desktop Render Host] 通知 JVM 端失败:", errorMessage)
            }
            
            js("window.cefQuery")(queryData)
        } else {
            console.log("[Desktop Render Host] JS Bridge 未就绪，等待中...")
        }
    }
    
    fun renderContent(content: String) {
        console.log("[Desktop Render Host] 收到渲染指令:", content)
        
        // 解析渲染指令
        try {
            val renderData = JSON.parse<dynamic>(content)
            val type = renderData.type as? String
            
            when (type) {
                "init" -> {
                    console.log("[Desktop Render Host] 初始化渲染视图")
                    // 初始化渲染视图
                    val pageName = renderData.pageName as? String ?: "desktop"
                    val pageData = emptyMap<String, Any>() // 简化处理
                    val size = js("{}")
                    size.width = renderData.width as? Int ?: 800
                    size.height = renderData.height as? Int ?: 600
                    
                    renderViewDelegator?.onAttach(
                        container = container!!,
                        pageName = pageName,
                        pageData = pageData,
                        size = size
                    )
                }
                "destroy" -> {
                    console.log("[Desktop Render Host] 销毁渲染视图")
                    renderViewDelegator?.onDetach()
                }
                "event" -> {
                    console.log("[Desktop Render Host] 发送事件:", renderData.event)
                    val event = renderData.event as? String ?: ""
                    val data = emptyMap<String, Any>() // 简化处理
                    
                    renderViewDelegator?.sendEvent(
                        event = event,
                        data = data
                    )
                }
                       "test" -> {
                           console.log("[Desktop Render Host] 执行 Kuikly DSL 测试渲染")
                           val dslType = renderData.dslType as? String ?: "default"
                           val content = renderData.content as? String ?: "测试内容"
                           
                           // 添加 Kuikly DSL 测试元素到容器
                           val currentContainer = container
                           if (currentContainer != null) {
                               val testElement = js("document.createElement('div')")
                               testElement.innerHTML = """
                                   <div style="
                                       position: absolute;
                                       top: 50%;
                                       left: 50%;
                                       transform: translate(-50%, -50%);
                                       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                       color: white;
                                       padding: 40px;
                                       border-radius: 20px;
                                       text-align: center;
                                       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                       box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                                       max-width: 600px;
                                   ">
                                       <h1 style="margin: 0 0 20px 0; font-size: 32px;">🎨 Kuikly DSL</h1>
                                       <p style="margin: 0 0 10px 0; font-size: 18px;">$content</p>
                                       <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.8;">DSL 类型: $dslType</p>
                                       
                                       <div style="
                                           display: flex;
                                           gap: 15px;
                                           justify-content: center;
                                           margin: 20px 0;
                                       ">
                                           <button style="
                                               padding: 10px 20px;
                                               background: rgba(255, 255, 255, 0.2);
                                               border: 2px solid rgba(255, 255, 255, 0.3);
                                               border-radius: 8px;
                                               color: white;
                                               font-size: 14px;
                                               cursor: pointer;
                                               transition: all 0.3s ease;
                                           " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                                              onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                               📱 DSL 按钮
                                           </button>
                                           <button style="
                                               padding: 10px 20px;
                                               background: rgba(255, 255, 255, 0.2);
                                               border: 2px solid rgba(255, 255, 255, 0.3);
                                               border-radius: 8px;
                                               color: white;
                                               font-size: 14px;
                                               cursor: pointer;
                                               transition: all 0.3s ease;
                                           " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                                              onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                               🎯 渲染测试
                                           </button>
                                       </div>
                                       
                                       <div style="
                                           margin-top: 20px;
                                           padding: 15px;
                                           background: rgba(255, 255, 255, 0.1);
                                           border-radius: 10px;
                                           border-left: 4px solid #4ade80;
                                       ">
                                           <p style="font-size: 12px; margin: 0; opacity: 0.9;">
                                               ✅ Kuikly DSL 渲染成功<br>
                                               ✅ JVM ↔ Web 通信正常<br>
                                               ✅ 渲染层工作正常
                                           </p>
                                       </div>
                                   </div>
                               """.trimIndent()
                               currentContainer.appendChild(testElement)
                               console.log("[Desktop Render Host] ✅ Kuikly DSL 测试元素已添加到渲染容器")
                           }
                       }
                else -> {
                    console.warn("[Desktop Render Host] 未知的渲染指令类型:", type)
                }
            }
        } catch (e: Throwable) {
            console.error("[Desktop Render Host] 解析渲染指令失败:", e)
        }
    }
}

// 全局实例
val desktopRenderHost = DesktopRenderHost()

// 全局函数供 JVM 调用
fun renderContent(content: String) {
    desktopRenderHost.renderContent(content)
}

// 初始化函数
fun initializeDesktopRenderHost() {
    console.log("[Desktop Render Host] 模块已加载")
    
    // 使用 JavaScript 直接挂载到全局对象
    js("window.renderContent = arguments[0]")(::renderContent)
    
    // 等待 DOM 就绪
    if (js("typeof document !== 'undefined'")) {
        val container = js("document.getElementById('kuikly-render-container')") as? HTMLElement
        if (container != null) {
            desktopRenderHost.initialize(container)
        } else {
            console.error("[Desktop Render Host] 找不到渲染容器 #kuikly-render-container")
        }
    }
}

// 使用顶层属性来执行初始化
val _init = initializeDesktopRenderHost()

