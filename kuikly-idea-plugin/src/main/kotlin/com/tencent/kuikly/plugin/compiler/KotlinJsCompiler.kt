package com.tencent.kuikly.plugin.compiler

import com.intellij.openapi.project.Project
import java.io.File
import java.util.concurrent.TimeUnit

/**
 * Kotlin to JS 编译器
 * 使用 Gradle 进行增量编译
 */
class KotlinJsCompiler(
    private val project: Project
) {
    
    /**
     * 增量编译
     */
    fun incrementalCompile(): Boolean {
        return try {
            compileViaGradle()
        } catch (e: Exception) {
            println("❌ Compilation error: ${e.message}")
            e.printStackTrace()
            false
        }
    }
    
    /**
     * 通过 Gradle 编译
     */
    private fun compileViaGradle(): Boolean {
        val projectDir = File(project.basePath ?: return false)
        
        if (!projectDir.exists()) {
            println("❌ Project directory not found: ${projectDir.absolutePath}")
            return false
        }
        
        // 使用 Gradle Wrapper
        val isWindows = System.getProperty("os.name").lowercase().contains("win")
        val gradlew = if (isWindows) "gradlew.bat" else "gradlew"
        
        val gradlewFile = File(projectDir, gradlew)
        if (!gradlewFile.exists()) {
            println("❌ Gradlew not found: ${gradlewFile.absolutePath}")
            return false
        }
        
        // 确保 gradlew 有执行权限（Unix/Linux/Mac）
        if (!isWindows) {
            gradlewFile.setExecutable(true)
        }
        
        // 执行增量编译（只编译 h5App 模块）
        val command = if (isWindows) {
            listOf(
                "cmd.exe",
                "/c",
                gradlewFile.absolutePath,
                ":h5App:jsBrowserDevelopmentWebpack",
                "--quiet"
            )
        } else {
            listOf(
                gradlewFile.absolutePath,
                ":h5App:jsBrowserDevelopmentWebpack",
                "--quiet"
            )
        }
        
        println("🔨 Running: ${command.joinToString(" ")}")
        
        val startTime = System.currentTimeMillis()
        
        val process = ProcessBuilder(command)
            .directory(projectDir)
            .redirectOutput(ProcessBuilder.Redirect.PIPE)
            .redirectError(ProcessBuilder.Redirect.PIPE)
            .start()
        
        // 等待编译完成（最多 60 秒）
        val completed = process.waitFor(60, TimeUnit.SECONDS)
        
        if (!completed) {
            process.destroy()
            println("⚠️ Compilation timeout (60s)")
            return false
        }
        
        val exitCode = process.exitValue()
        val duration = System.currentTimeMillis() - startTime
        
        if (exitCode != 0) {
            val error = process.errorStream.bufferedReader().readText()
            val output = process.inputStream.bufferedReader().readText()
            
            println("❌ Compilation failed with exit code $exitCode (${duration}ms)")
            println("--- Output ---")
            println(output)
            println("--- Error ---")
            println(error)
            
            return false
        }
        
        println("✅ Compilation successful (${duration}ms)")
        return true
    }
}

