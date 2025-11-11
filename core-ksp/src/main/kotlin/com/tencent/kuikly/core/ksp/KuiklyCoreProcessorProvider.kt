/*
 * Tencent is pleased to support the open source community by making KuiklyUI
 * available.
 * Copyright (C) 2025 Tencent. All rights reserved.
 * Licensed under the License of KuiklyUI;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://github.com/Tencent-TDS/KuiklyUI/blob/main/LICENSE
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tencent.kuikly.core.ksp

import com.google.devtools.ksp.processing.*
import com.google.devtools.ksp.symbol.KSAnnotated
import com.google.devtools.ksp.symbol.KSClassDeclaration
import com.google.devtools.ksp.symbol.KSFile
import com.google.devtools.ksp.symbol.KSFunctionDeclaration
import com.squareup.kotlinpoet.AnnotationSpec
import com.squareup.kotlinpoet.ClassName
import com.squareup.kotlinpoet.FileSpec
import com.squareup.kotlinpoet.FunSpec
import com.squareup.kotlinpoet.KModifier
import com.squareup.kotlinpoet.TypeSpec
import com.tencent.kuikly.core.annotations.Page
import impl.AndroidTargetEntryBuilder
import impl.KuiklyCoreAbsEntryBuilder
import impl.IOSTargetEntryBuilder
import impl.OhOsTargetEntryBuilder
import impl.OhOsTargetMultiEntryBuilder
import impl.JVMTargetEntryBuilder
import impl.PageInfo
import impl.submodule.AndroidMultiEntryBuilder
import impl.submodule.IOSMultiTargetEntryBuilder

/**
 * Created by kam on 2022/6/19.
 */

class KuiklyCoreProcessorProvider : SymbolProcessorProvider {

    override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor {
        return CoreProcessor(environment.codeGenerator, environment.logger, environment.options)
    }
}

class CoreProcessor(
    private val codeGenerator: CodeGenerator,
    private val logger: KSPLogger,
    private val option: Map<String, String>,
) :
    SymbolProcessor {

    private var isInitialInvocation = true
    private var coreEntryGenerated = false

    override fun process(resolver: Resolver): List<KSAnnotated> {
        val newFiles = resolver.getNewFiles()
        if (!isInitialInvocation || newFiles.firstOrNull() == null) {
            // * A subsequent invocation is for processing generated files. We do not need to process these.
            // * If there are no new files to process, we avoid generating an output file, as this would break
            //   incremental compilation.
            //   TODO: This could be omitted if file generation were not required to discover the output source set.
            return emptyList()
        }

        isInitialInvocation = false

        codeGenerator.createNewFile(
            dependencies = Dependencies(aggregating = true),
            packageName = "",
            fileName = "KuiklyCoreEntry",
            extensionName = "kt"
        ).use { output ->
            // TODO: This hack to discover the output source set should be replaced with a better solution.
            getEntryBuilder().also {
                buildEntryFile(resolver, it).forEach { fileSpec ->
                    output.write(fileSpec.toString().toByteArray())
                }
            }
        }
        coreEntryGenerated = true
        return emptyList()
    }

    private fun buildEntryFile(
        resolver: Resolver,
        absEntryBuilder: KuiklyCoreAbsEntryBuilder,
    ): List<FileSpec> {
        val pageName = option["pageName"] ?: ""
        val packLocalAarBundle = option["packLocalAarBundle"] ?: ""
        val packBundleByModuleId = option["packBundleByModuleId"] ?: ""
        val pageClassDeclarations = mutableListOf<PageInfo>()
        val moduleSet = packBundleByModuleId.split("&").toSet()
        
        // 处理 HotPreview 注解，只在有新建文件时处理
        val hotPreviewPageInfos = processHotPreviewAnnotations(resolver)
        if (hotPreviewPageInfos.isNotEmpty()) {
            logger.info("CoreProcessor: Adding ${hotPreviewPageInfos.size} HotPreview generated pages to registry")
            pageClassDeclarations.addAll(hotPreviewPageInfos)
        }
        
        // 处理原有的 @Page 注解
        resolver.getSymbolsWithAnnotation(Page::class.qualifiedName!!)
            .filterIsInstance<KSClassDeclaration>()
            .forEach { classDeclaration ->
                val pageInfo = classDeclaration.toPageInfo()
                if (packLocalAarBundle == "1") {
                    if (pageInfo.packLocal) { // 只打包支持内置的page
                        pageClassDeclarations.add(pageInfo)
                    }
                } else if (pageName.isNotEmpty()) { // 全部page打成一个包
                    if (pageName == pageInfo.pageName) {
                        pageClassDeclarations.add(pageInfo)
                    }
                } else if (packBundleByModuleId.isNotEmpty()) { // 按照moduleId打包bundle
                    if (moduleSet.contains(pageInfo.moduleId)) {
                        pageClassDeclarations.add(pageInfo)
                    }
                } else {
                    pageClassDeclarations.add(pageInfo)
                }
            }
            
        logger.info("CoreProcessor: Total pages for registry: ${pageClassDeclarations.size}")
        return absEntryBuilder.build(pageClassDeclarations)
    }

    /**
     * 处理 HotPreview 注解，只在需要时生成文件
     */
    private fun processHotPreviewAnnotations(resolver: Resolver): List<PageInfo> {
        val symbols = resolver.getSymbolsWithAnnotation("de.drick.compose.hotpreview.HotPreview")
        if (symbols.none()) {
            return emptyList()
        }

        logger.info("CoreProcessor: Found ${symbols.count()} HotPreview annotations")
        val pageInfos = mutableListOf<PageInfo>()

        symbols.forEach { symbol ->
            if (symbol is KSFunctionDeclaration) {
                try {
                    val pageInfo = generateHotPreviewPage(symbol)
                    pageInfos.add(pageInfo)
                } catch (e: Exception) {
                    logger.error("Error generating HotPreview page for ${symbol.simpleName.asString()}: ${e.message}")
                    e.printStackTrace()
                }
            }
        }

        return pageInfos
    }

    /**
     * 生成单个 HotPreview 页面
     */
    private fun generateHotPreviewPage(functionDeclaration: KSFunctionDeclaration): PageInfo {
        val functionName = functionDeclaration.simpleName.asString()
        val packageName = functionDeclaration.packageName.asString()
        val className = "${functionName}PreviewPager"
        
        // 获取函数所在的类名
        val containingClassName = when (val parent = functionDeclaration.parent) {
            is KSClassDeclaration -> parent.qualifiedName?.asString() ?: ""
            else -> {
                // 如果是顶层函数，Kotlin 会生成一个以文件名+Kt 结尾的类
                val file = functionDeclaration.containingFile
                if (file != null && packageName.isNotEmpty()) {
                    // 对于顶层函数，使用包名 + 文件名（去掉扩展名）+ Kt
                    val fileName = file.fileName.replace(".kt", "").replace(".kts", "")
                    if (fileName.isNotEmpty()) {
                        "$packageName.${fileName}Kt"
                    } else {
                        ""
                    }
                } else {
                    ""
                }
            }
        }
        
        // 生成预览 Pager 类
        val fileSpec = FileSpec.builder(packageName, className)
            .addImport("com.tencent.kuikly.compose", "setContent")
            .addImport("", "invokeComposeFunc")
            .addType(
                TypeSpec.classBuilder(className)
                    .addAnnotation(
                        AnnotationSpec.builder(Page::class)
                            .addMember("name = %S", "${functionName}Preview")
                            .build()
                    )
                    .addModifiers(KModifier.INTERNAL)
                    .superclass(ClassName("com.tencent.kuikly.compose", "ComposeContainer"))
                    .addFunction(
                        FunSpec.builder("willInit")
                            .addModifiers(KModifier.OVERRIDE)
                            .addStatement("super.willInit()")
                            .addStatement("setContent {")
                            .addStatement("   invokeComposeFunc(%S, %S, this@"  + className + ");", containingClassName, functionName)
                            .addStatement("}")
                            .build()
                    )
                    .build()
            )
            .build()

        // 写入生成的文件
        codeGenerator.createNewFile(
            dependencies = Dependencies(aggregating = false),
            packageName = packageName,
            fileName = className,
            extensionName = "kt"
        ).use { output ->
            output.write(fileSpec.toString().toByteArray())
        }

        // 创建并返回 PageInfo
        val pageInfo = PageInfo(
            pageName = "${functionName}Preview",
            pageFullName = "$packageName.$className",
            moduleId = "preview",
            packLocal = true
        )

        logger.info("Generated HotPreview page: $packageName.$className with page name: ${pageInfo.pageName}")
        return pageInfo
    }

    private fun getEntryBuilder(): KuiklyCoreAbsEntryBuilder{
        val enableMultiModule = option["enableMultiModule"]?.toBoolean() ?: false
        val isMainModule = option["isMainModule"]?.toBoolean() ?: false
        val subModules = option["subModules"] ?: ""
        val moduleId = option["moduleId"] ?: ""
        val outputSourceSet =
            codeGenerator.generatedFile.first().toString().sourceSetBelow("ksp")
        return when {
            outputSourceSet.androidJVMFamily() -> {
                if (enableMultiModule) {
                    AndroidMultiEntryBuilder(isMainModule, subModules, moduleId)
                } else {
                    AndroidTargetEntryBuilder()
                }
            }
            outputSourceSet.jvmFamily() -> {
                JVMTargetEntryBuilder()
            }
            outputSourceSet.iosFamily() -> {
                if (enableMultiModule) {
                    IOSMultiTargetEntryBuilder(isMainModule, subModules, moduleId)
                } else {
                    IOSTargetEntryBuilder()
                }
            }
            outputSourceSet.ohosFamily() -> {
                if (enableMultiModule) {
                    OhOsTargetMultiEntryBuilder(isMainModule, subModules, moduleId)
                }else{
                    OhOsTargetEntryBuilder()
                }
            }
            else -> {
                AndroidTargetEntryBuilder()
            }
        }
    }
}
