package com.tencent.kuikly.plugin.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.wm.ToolWindowManager

/**
 * 预览当前页面动作
 * 在编辑器右键菜单中显示
 */
class PreviewCurrentPageAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val psiFile = e.getData(CommonDataKeys.PSI_FILE) ?: return
        
        // 打开预览窗口
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindow = toolWindowManager.getToolWindow("Kuikly Preview")
        toolWindow?.show()
        
        println("📱 Preview page from: ${psiFile.name}")
    }
    
    override fun update(e: AnActionEvent) {
        val psiFile = e.getData(CommonDataKeys.PSI_FILE)
        
        // 只在 Kotlin 文件中且包含 @Page 注解时显示
        val isKotlinFile = psiFile?.name?.endsWith(".kt") == true
        val hasPageAnnotation = if (isKotlinFile && psiFile != null) {
            try {
                val content = psiFile.text
                content.contains("@Page")
            } catch (e: Exception) {
                false
            }
        } else {
            false
        }
        
        e.presentation.isEnabledAndVisible = hasPageAnnotation
    }
}
