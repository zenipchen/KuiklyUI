package com.tencent.kuikly.plugin.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.wm.ToolWindowManager
import javax.swing.JOptionPane

/**
 * 刷新预览动作
 */
class RefreshPreviewAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindow = toolWindowManager.getToolWindow("Kuikly Preview")
        
        if (toolWindow == null || !toolWindow.isVisible) {
            JOptionPane.showMessageDialog(
                null,
                "请先打开 Kuikly Preview 窗口",
                "提示",
                JOptionPane.INFORMATION_MESSAGE
            )
            return
        }
        
        // TODO: 触发刷新
        // 由于无法直接访问 PreviewPanel，这里暂时只是显示消息
        println("🔄 Refresh preview requested")
    }
    
    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}

