package com.tencent.kuikly.plugin.scanner

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.psi.PsiManager
import com.intellij.psi.search.FileTypeIndex
import com.intellij.psi.search.GlobalSearchScope
import org.jetbrains.kotlin.idea.KotlinFileType
import org.jetbrains.kotlin.psi.KtAnnotationEntry
import org.jetbrains.kotlin.psi.KtClass
import org.jetbrains.kotlin.psi.KtFile

/**
 * 扫描项目中的 Kuikly 页面
 */
class PageScanner(
    private val project: Project
) {
    
    /**
     * 扫描所有 @Page 注解的类
     */
    fun scanAllPages(): List<PageInfo> {
        val pages = mutableListOf<PageInfo>()
        val psiManager = PsiManager.getInstance(project)
        
        try {
            // 搜索所有 Kotlin 文件
            val kotlinFiles = FileTypeIndex.getFiles(
                KotlinFileType.INSTANCE,
                GlobalSearchScope.projectScope(project)
            )
            
            kotlinFiles.forEach { virtualFile ->
                try {
                    val psiFile = psiManager.findFile(virtualFile) as? KtFile ?: return@forEach
                    
                    // 只扫描 demo 目录
                    val path = virtualFile.path
                    if (!path.contains("/demo/src/") && !path.contains("\\demo\\src\\")) {
                        return@forEach
                    }
                    
                    // 查找 @Page 注解
                    psiFile.declarations.filterIsInstance<KtClass>().forEach { ktClass ->
                        val pageAnnotation = findPageAnnotation(ktClass)
                        if (pageAnnotation != null) {
                            val pageName = extractPageName(ktClass, pageAnnotation)
                            
                            pages.add(
                                PageInfo(
                                    name = pageName,
                                    className = ktClass.name ?: "Unknown",
                                    fqName = ktClass.fqName?.asString() ?: "",
                                    file = virtualFile
                                )
                            )
                        }
                    }
                } catch (e: Exception) {
                    // 忽略单个文件的错误
                    println("⚠️ Error scanning file ${virtualFile.name}: ${e.message}")
                }
            }
        } catch (e: Exception) {
            println("❌ Error during page scanning: ${e.message}")
            e.printStackTrace()
        }
        
        return pages.sortedBy { it.name }
    }
    
    /**
     * 查找 @Page 注解
     */
    private fun findPageAnnotation(ktClass: KtClass): KtAnnotationEntry? {
        return ktClass.annotationEntries.find { 
            val shortName = it.shortName?.asString()
            shortName == "Page"
        }
    }
    
    /**
     * 从注解中提取页面名称
     */
    private fun extractPageName(ktClass: KtClass, annotation: KtAnnotationEntry): String {
        try {
            // 尝试从注解中提取 name 参数
            val nameArg = annotation.valueArguments.find { 
                it.getArgumentName()?.asName?.asString() == "name" 
            }
            
            val nameValue = nameArg?.getArgumentExpression()?.text
            if (nameValue != null) {
                return nameValue.removeSurrounding("\"")
            }
        } catch (e: Exception) {
            println("⚠️ Error extracting page name: ${e.message}")
        }
        
        // 降级到类名
        return ktClass.name ?: "Unknown"
    }
}

/**
 * 页面信息
 */
data class PageInfo(
    val name: String,
    val className: String,
    val fqName: String,
    val file: VirtualFile
)

