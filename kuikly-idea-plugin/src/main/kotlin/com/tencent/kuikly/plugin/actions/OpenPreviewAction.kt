package com.tencent.kuikly.plugin.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.wm.ToolWindowManager

/**
 * 打开预览窗口动作
 */
class OpenPreviewAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindow = toolWindowManager.getToolWindow("Kuikly Preview")
        
        toolWindow?.show()
    }
    
    override fun update(e: AnActionEvent) {
        // 只在有项目时启用
        e.presentation.isEnabled = e.project != null
    }
}

