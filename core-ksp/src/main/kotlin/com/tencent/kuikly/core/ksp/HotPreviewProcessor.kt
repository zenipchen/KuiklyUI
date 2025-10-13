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
import com.google.devtools.ksp.symbol.KSFunctionDeclaration
import com.squareup.kotlinpoet.*
import com.tencent.kuikly.core.annotations.Page

/**
 * HotPreview 注解处理器
 * 用于处理 @HotPreview 注解，生成对应的预览 Pager 类
 */
class HotPreviewProcessor(
    private val codeGenerator: CodeGenerator,
    private val logger: KSPLogger
) : SymbolProcessor {

    override fun process(resolver: Resolver): List<KSAnnotated> {
        logger.info("HotPreviewProcessor: Starting to process HotPreview annotations")
        val symbols = resolver.getSymbolsWithAnnotation("de.drick.compose.hotpreview.HotPreview")
        val ret = symbols.toList()
        
        logger.info("HotPreviewProcessor: Found ${symbols.count()} symbols with HotPreview annotation")

        symbols.forEach { symbol ->
            val symbolName = if (symbol is KSFunctionDeclaration) symbol.simpleName.asString() else "unknown"
            logger.info("HotPreviewProcessor: Processing symbol: $symbolName, type: ${symbol::class.simpleName}")
            if (symbol is KSFunctionDeclaration) {
                try {
                    logger.info("HotPreviewProcessor: Generating preview pager for function: ${symbol.simpleName.asString()}")
                    generatePreviewPager(symbol)
                } catch (e: Exception) {
                    logger.error("Error generating preview pager for ${symbol.simpleName.asString()}: ${e.message}")
                    e.printStackTrace()
                }
            } else {
                logger.warn("HotPreviewProcessor: Symbol $symbolName is not a function declaration")
            }
        }

        return ret
    }
    private fun generatePreviewPager(functionDeclaration: KSFunctionDeclaration) {
        val functionName = functionDeclaration.simpleName.asString()
        val packageName = functionDeclaration.packageName.asString()
        val className = "${functionName}PreviewPager"
        
        // 生成预览 Pager 类
        val fileSpec = FileSpec.builder(packageName, className)
            .addImport("com.tencent.kuikly.compose", "setContent")
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
                            .addStatement("    %L()", functionName)
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

        logger.info("Generated preview pager: $packageName.$className")
    }
}
