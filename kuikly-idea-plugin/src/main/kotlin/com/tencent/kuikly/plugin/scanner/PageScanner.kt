package com.tencent.kuikly.plugin.scanner

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile

/**
 * 简化的页面扫描器
 * 不依赖 Kotlin PSI，使用文件内容正则匹配
 */
class PageScanner(
    private val project: Project
) {
    
    /**
     * 扫描所有 @Page 注解的类
     */
    fun scanAllPages(): List<PageInfo> {
        val pages = mutableListOf<PageInfo>()
        
        try {
            // 遍历项目文件
            val basePath = project.basePath ?: return emptyList()
            val demoDir = java.io.File("$basePath/demo/src/commonMain/kotlin")
            
            if (!demoDir.exists()) {
                println("⚠️ Demo directory not found: ${demoDir.absolutePath}")
                return emptyList()
            }
            
            // 递归扫描 .kt 文件
            demoDir.walkTopDown()
                .filter { it.isFile && it.name.endsWith(".kt") }
                .forEach { file ->
                    try {
                        val content = file.readText()
                        val pageInfos = extractPageInfo(file, content)
                        pages.addAll(pageInfos)
                    } catch (e: Exception) {
                        println("⚠️ Error reading file ${file.name}: ${e.message}")
                    }
                }
            
        } catch (e: Exception) {
            println("❌ Error during page scanning: ${e.message}")
            e.printStackTrace()
        }
        
        return pages.sortedBy { it.name }
    }
    
    /**
     * 从文件内容中提取 @Page 信息
     */
    private fun extractPageInfo(file: java.io.File, content: String): List<PageInfo> {
        val pages = mutableListOf<PageInfo>()
        
        // 正则匹配 @Page 注解
        val pageRegex = """@Page\s*\(\s*(?:name\s*=\s*)?["']([^"']+)["']\s*\)""".toRegex()
        val classRegex = """class\s+(\w+)""".toRegex()
        
        val lines = content.lines()
        var i = 0
        
        while (i < lines.size) {
            val line = lines[i].trim()
            
            // 查找 @Page 注解
            val pageMatch = pageRegex.find(line)
            if (pageMatch != null) {
                val pageName = pageMatch.groupValues[1]
                
                // 查找下一行的类名
                var className = "Unknown"
                var j = i + 1
                while (j < lines.size && j < i + 5) {
                    val classMatch = classRegex.find(lines[j])
                    if (classMatch != null) {
                        className = classMatch.groupValues[1]
                        break
                    }
                    j++
                }
                
                pages.add(
                    PageInfo(
                        name = pageName,
                        className = className,
                        fqName = "",
                        file = null
                    )
                )
            }
            
            i++
        }
        
        return pages
    }
}

/**
 * 页面信息
 */
data class PageInfo(
    val name: String,
    val className: String,
    val fqName: String,
    val file: VirtualFile?
)

