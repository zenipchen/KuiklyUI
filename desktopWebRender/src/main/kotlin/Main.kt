import org.jetbrains.compose.web.css.*
import org.jetbrains.compose.web.dom.*
import org.jetbrains.compose.web.renderComposable
import com.tencent.kuikly.core.render.web.context.KuiklyRenderContextHandler

/**
 * 桌面端 Web 渲染模块
 * 
 * 职责：
 * 1. 提供纯渲染能力（不包含业务逻辑）
 * 2. 通过 JS Bridge 接收来自 JVM 的渲染指令
 * 3. 将用户交互通过 JS Bridge 发送回 JVM
 */
fun main() {
    renderComposable(rootElementId = "root") {
        DesktopWebRenderApp()
    }
}

@Composable
fun DesktopWebRenderApp() {
    Div({
        style {
            width(100.percent)
            height(100.vh)
            backgroundColor(Color("#f5f5f5"))
            display(DisplayStyle.Flex)
            flexDirection(FlexDirection.Column)
            alignItems(AlignItems.Center)
            justifyContent(JustifyContent.Center)
        }
    }) {
        // 初始化 Kuikly 渲染上下文
        KuiklyRenderContextHandler.init()
        
        // 渲染容器
        Div({
            id("kuikly-render-container")
            style {
                width(100.percent)
                height(100.percent)
                backgroundColor(Color.white)
                borderRadius(8.px)
                boxShadow(0.px, 4.px, 8.px, Color.black.copy(alpha = 0.1))
            }
        }) {
            // 这里将通过 JS Bridge 接收来自 JVM 的渲染指令
            Text("Kuikly Desktop Web Render")
        }
    }
}
