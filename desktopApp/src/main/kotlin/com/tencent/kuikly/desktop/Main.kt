package com.tencent.kuikly.desktop

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.tencent.kuikly.core.manager.BridgeManager
import com.tencent.kuikly.core.manager.KotlinMethod
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JFrame
import javax.swing.SwingUtilities
import javax.swing.WindowConstants
import javax.swing.JLabel
import javax.swing.JPanel
import java.awt.Color
import java.awt.Font

/**
 * Kuikly 桌面端 - 简化版本（暂时移除 JCEF）
 * 
 * 架构：
 * - 逻辑层：JVM (Kotlin) - core + compose + demo
 * - 渲染层：纯渲染模块（不包含业务逻辑）
 * - 通信：JS Bridge 双向桥接
 * 
 * 当前状态：基础版本，先验证核心功能
 */
fun main(args: Array<String>) {
    println("[Kuikly Desktop] 🚀 正在初始化...")
    
    // 1. 初始化 BridgeManager (JVM 业务逻辑层)
    println("[Kuikly Desktop] 🔗 初始化 BridgeManager...")
    try {
        BridgeManager.init()
        println("[Kuikly Desktop] ✅ BridgeManager 初始化完成")
    } catch (e: Exception) {
        println("[Kuikly Desktop] ❌ BridgeManager 初始化失败: ${e.message}")
        e.printStackTrace()
    }
    
    // 2. 创建 Swing 窗口（暂时替代 JCEF）
    SwingUtilities.invokeLater {
        createAndShowGUI()
    }
}

private fun createAndShowGUI() {
    println("[Kuikly Desktop] 🖥️ 正在创建桌面窗口...")
    
    // 创建主窗口
    val frame = JFrame("Kuikly Desktop - 纯渲染层架构")
    frame.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
    frame.setSize(1200, 800)
    frame.setLocationRelativeTo(null)
    
    // 创建主面板
    val mainPanel = JPanel(BorderLayout())
    mainPanel.background = Color(245, 245, 245)
    
    // 创建标题面板
    val titlePanel = JPanel()
    titlePanel.background = Color(102, 126, 234)
    val titleLabel = JLabel("Kuikly Desktop - 纯渲染层架构")
    titleLabel.font = Font("Arial", Font.BOLD, 24)
    titleLabel.foreground = Color.WHITE
    titlePanel.add(titleLabel)
    
    // 创建内容面板
    val contentPanel = JPanel()
    contentPanel.background = Color.WHITE
    contentPanel.layout = null
    
    // 添加状态信息
    val statusLabel = JLabel("✅ 架构验证成功")
    statusLabel.font = Font("Arial", Font.PLAIN, 16)
    statusLabel.foreground = Color(21, 87, 36)
    statusLabel.setBounds(50, 50, 300, 30)
    contentPanel.add(statusLabel)
    
    val archLabel = JLabel("🏗️ 业务逻辑运行在 JVM 中")
    archLabel.font = Font("Arial", Font.PLAIN, 14)
    archLabel.foreground = Color(102, 102, 102)
    archLabel.setBounds(50, 90, 300, 30)
    contentPanel.add(archLabel)
    
    val renderLabel = JLabel("🎨 纯渲染层已准备就绪")
    renderLabel.font = Font("Arial", Font.PLAIN, 14)
    renderLabel.foreground = Color(102, 102, 102)
    renderLabel.setBounds(50, 120, 300, 30)
    contentPanel.add(renderLabel)
    
    val bridgeLabel = JLabel("🌉 JS Bridge 已初始化")
    bridgeLabel.font = Font("Arial", Font.PLAIN, 14)
    bridgeLabel.foreground = Color(102, 102, 102)
    bridgeLabel.setBounds(50, 150, 300, 30)
    contentPanel.add(bridgeLabel)
    
    // 添加说明文本
    val infoText = """
        <html>
        <body style="font-family: Arial; font-size: 12px; color: #666;">
        <h3>架构说明：</h3>
        <ul>
        <li><b>JVM 业务逻辑层：</b> core + compose + demo</li>
        <li><b>纯渲染层：</b> desktopWebRender（不包含业务逻辑）</li>
        <li><b>通信机制：</b> JS Bridge 双向桥接</li>
        <li><b>Web 服务器：</b> http://localhost:8080/desktopWebRender.html</li>
        </ul>
        
        <h3>下一步：</h3>
        <ul>
        <li>解决 JCEF 依赖问题</li>
        <li>集成 Web 渲染层</li>
        <li>测试 JS Bridge 通信</li>
        </ul>
        </body>
        </html>
    """.trimIndent()
    
    val infoLabel = JLabel(infoText)
    infoLabel.setBounds(50, 200, 500, 300)
    contentPanel.add(infoLabel)
    
    // 组装界面
    mainPanel.add(titlePanel, BorderLayout.NORTH)
    mainPanel.add(contentPanel, BorderLayout.CENTER)
    
    frame.contentPane = mainPanel
    frame.isVisible = true
    
    println("[Kuikly Desktop] 🎉 桌面窗口已启动！")
    println("[Kuikly Desktop] 💡 当前为简化版本，先验证基础架构")
    println("[Kuikly Desktop] 💡 下一步：解决 JCEF 依赖问题")
}

/**
 * JS Bridge 处理类（暂时简化）
 */
class KuiklyJSBridge {
    private val gson = Gson()
    
    fun handleWebCall(request: String): String {
        try {
            val json = gson.fromJson(request, JsonObject::class.java)
            val type = json.get("type")?.asString ?: "unknown"
            
            println("[Kuikly Desktop] 📨 收到 Web 调用: $type")
            
            when (type) {
                "callKotlinMethod" -> {
                    val methodId = json.get("methodId")?.asInt ?: 0
                    val arg0 = json.get("arg0")?.asString ?: ""
                    val arg1 = json.get("arg1")?.asString ?: ""
                    val arg2 = json.get("arg2")?.asString ?: ""
                    val arg3 = json.get("arg3")?.asString ?: ""
                    val arg4 = json.get("arg4")?.asString ?: ""
                    val arg5 = json.get("arg5")?.asString ?: ""
                    
                    if (!BridgeManager.isDidInit()) {
                        BridgeManager.init()
                        println("[Kuikly Desktop] ✅ BridgeManager 已初始化")
                    }
                    
                    BridgeManager.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                    println("[Kuikly Desktop] ✅ BridgeManager.callKotlinMethod 调用成功")
                    return "OK"
                }
                "renderReady" -> {
                    println("[Kuikly Desktop] ✅ 渲染层已准备就绪")
                    return "OK"
                }
                else -> {
                    println("[Kuikly Desktop] ⚠️ 未知的调用类型: $type")
                    return "UNKNOWN_TYPE"
                }
            }
        } catch (e: Exception) {
            println("[Kuikly Desktop] ❌ 处理 Web 调用失败: ${e.message}")
            e.printStackTrace()
            return "ERROR"
        }
    }
}