package com.tencent.kuikly.plugin.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.wm.ToolWindowManager
import org.jetbrains.kotlin.psi.KtClass
import org.jetbrains.kotlin.psi.KtFile

/**
 * 预览当前页面动作
 * 在编辑器右键菜单中显示
 */
class PreviewCurrentPageAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val psiFile = e.getData(CommonDataKeys.PSI_FILE) as? KtFile ?: return
        
        // 查找带 @Page 注解的类
        val pageClass = psiFile.declarations.filterIsInstance<KtClass>().find { ktClass ->
            ktClass.annotationEntries.any { 
                it.shortName?.asString() == "Page" 
            }
        }
        
        if (pageClass == null) {
            return
        }
        
        // 打开预览窗口
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindow = toolWindowManager.getToolWindow("Kuikly Preview")
        toolWindow?.show()
        
        println("📱 Preview page: ${pageClass.name}")
    }
    
    override fun update(e: AnActionEvent) {
        val psiFile = e.getData(CommonDataKeys.PSI_FILE) as? KtFile
        
        // 只在 Kotlin 文件中且包含 @Page 注解时显示
        val hasPageAnnotation = psiFile?.declarations
            ?.filterIsInstance<KtClass>()
            ?.any { ktClass ->
                ktClass.annotationEntries.any { 
                    it.shortName?.asString() == "Page" 
                }
            } ?: false
        
        e.presentation.isEnabledAndVisible = hasPageAnnotation
    }
}

