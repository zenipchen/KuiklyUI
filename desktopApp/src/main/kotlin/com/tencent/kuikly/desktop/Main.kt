package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.google.gson.JsonObject
import java.awt.BorderLayout
import java.awt.Dimension
import java.awt.event.ActionEvent
import java.awt.event.ActionListener
import javax.swing.*
import javax.swing.text.html.HTMLEditorKit
import javax.swing.text.html.StyleSheet

/**
 * Kuikly 桌面端 - 使用 Swing JEditorPane
 * 
 * 架构：
 * - 逻辑层：JVM (Kotlin) - core + compose + demo
 * - 渲染层：JEditorPane (HTML) - core-render-web
 * - 通信：JS Bridge 双向桥接
 * 
 * 当前状态：基础版本，展示简单的 HTML 渲染
 */
fun main(args: Array<String>) {
    println("[Kuikly Desktop] 🚀 正在启动 Swing 应用...")
    
    SwingUtilities.invokeLater {
        // 创建窗口
        val frame = JFrame("Kuikly Desktop")
        frame.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
        frame.layout = BorderLayout()
        frame.size = Dimension(1200, 800)
        
        // 创建 HTML 编辑器
        val editorPane = JEditorPane()
        editorPane.isEditable = false
        editorPane.contentType = "text/html"
        
        // 设置样式
        val kit = HTMLEditorKit()
        val styleSheet = StyleSheet()
        styleSheet.addRule("""
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #333; }
            .status { 
                background: #e3f2fd; 
                padding: 10px; 
                border-radius: 4px; 
                margin: 10px 0;
            }
            .bridge-info {
                background: #f3e5f5;
                padding: 10px;
                border-radius: 4px;
                margin: 10px 0;
            }
        """.trimIndent())
        kit.styleSheet = styleSheet
        editorPane.editorKit = kit
        
        // 创建 JS Bridge 处理器
        val bridge = KuiklyJSBridge()
        
        // 加载简单的 HTML 页面
        val htmlContent = """
            <div class="container">
                <h1>🚀 Kuikly Desktop</h1>
                <div class="status">
                    <strong>状态：</strong> 应用已启动
                </div>
                <div class="bridge-info">
                    <strong>JS Bridge：</strong> 已启用（简化版本）
                </div>
                <p>这是一个使用 Swing JEditorPane 的简化版本，用于替代复杂的 WebView。</p>
                <p>当前架构：</p>
                <ul>
                    <li>逻辑层：JVM (Kotlin) - core + compose + demo</li>
                    <li>渲染层：JEditorPane (HTML) - 简化版本</li>
                    <li>通信：JS Bridge 双向桥接（待实现）</li>
                </ul>
                <p><strong>注意：</strong> 这是一个基础版本，主要用于展示应用结构。如需完整的 Web 渲染功能，建议使用 JavaFX WebView 或 JCEF。</p>
            </div>
        """.trimIndent()
        
        editorPane.text = htmlContent
        
        // 将编辑器添加到窗口
        frame.add(JScrollPane(editorPane), BorderLayout.CENTER)
        
        frame.isVisible = true
        
        println("[Kuikly Desktop] 🎉 窗口已启动！")
        println("[Kuikly Desktop] 💡 当前为简化版本，使用 Swing JEditorPane")
        println("[Kuikly Desktop] 💡 如需完整 Web 功能，请配置 JavaFX WebView")
    }
}

/**
 * Kuikly JS Bridge - 简化版本（JEditorPane 不支持 JavaScript）
 * 
 * 注意：JEditorPane 不支持 JavaScript 执行，这是一个占位符类
 * 如需完整的 JS Bridge 功能，请使用 JavaFX WebView 或 JCEF
 */
class KuiklyJSBridge {
    private val gson = Gson()
    
    /**
     * 处理来自 Web 的调用 (Web → JVM)
     * 注意：JEditorPane 版本中此方法不会被调用
     */
    fun handleWebCall(request: String): String {
        try {
            println("[Kuikly Desktop] 📥 收到调用请求: $request")
            
            val json = gson.fromJson(request, JsonObject::class.java)
            val type = json.get("type")?.asString
            
            when (type) {
                "callKotlinMethod" -> {
                    val methodId = json.get("methodId")?.asInt ?: 0
                    println("[Kuikly Desktop] 📞 callKotlinMethod: methodId=$methodId")
                    println("[Kuikly Desktop] 💡 当前为简化版本，暂未集成 BridgeManager")
                    return "OK"
                }
                "registerCallback" -> {
                    val pagerId = json.get("pagerId")?.asString
                    println("[Kuikly Desktop] 📝 registerCallback: $pagerId")
                    return "OK"
                }
                else -> {
                    println("[Kuikly Desktop] ⚠️ 未知请求类型: $type")
                    return "ERROR: Unknown request type: $type"
                }
            }
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 处理调用失败: ${e.message}")
            e.printStackTrace()
            return "ERROR: ${e.message ?: "Internal error"}"
        }
    }
    
    /**
     * JVM 调用 Web (JVM → Web，用于逻辑层驱动渲染层)
     * 注意：JEditorPane 版本中此方法不会被调用
     */
    fun callWeb(pagerId: String, methodName: String, vararg args: Any?) {
        println("[Kuikly Desktop] 📤 尝试调用 Web: $pagerId.$methodName")
        println("[Kuikly Desktop] 💡 当前为简化版本，不支持 JavaScript 执行")
    }
}
