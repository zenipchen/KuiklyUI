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

package impl

import com.squareup.kotlinpoet.*
import com.tencent.kuikly.core.IKuiklyCoreEntry

/**
 * Created by kam on 2022/6/25.
 * JVM version of EntryBuilder
 */
class JVMTargetEntryBuilder : KuiklyCoreAbsEntryBuilder() {

    override fun build(
        builder: FileSpec.Builder,
        pagesAnnotations: List<PageInfo>
    ) {
        builder.addType(
            TypeSpec.classBuilder("KuiklyCoreEntry")
                .addSuperinterface(IKuiklyCoreEntry::class)
                .addProperty(
                    PropertySpec.builder("hadRegisterNativeBridge", Boolean::class)
                        .initializer("false")
                        .mutable()
                        .addModifiers(KModifier.PRIVATE)
                        .build()
                )
                .addProperty(
                    PropertySpec.builder("delegate", IKuiklyCoreEntry.Delegate::class.asTypeName().copy(nullable = true))
                        .mutable()
                        .addModifiers(KModifier.PUBLIC)
                        .addModifiers(KModifier.OVERRIDE)
                        .build()
                )
                .addFunction(
                    FunSpec.builder(FUNC_NAME_CALL_KT_METHOD)
                        .addModifiers(KModifier.PUBLIC, KModifier.OVERRIDE)
                        .addParameters(createKtMethodParameters())
                        .addCode(buildCallKotlinMethodBody(pagesAnnotations))
                        .build()
                )
                .addFunction(
                    FunSpec.builder("triggerRegisterPages")
                        .addModifiers(KModifier.PUBLIC, KModifier.OVERRIDE)
                        .addCode(buildTriggerRegisterPagesBody(pagesAnnotations))
                        .build()
                )
                .build()
        )
    }

    private fun buildCallKotlinMethodBody(pagesAnnotations: List<PageInfo>): CodeBlock {
        val codeBlock = CodeBlock.builder()
        codeBlock.addStatement("if (!hadRegisterNativeBridge) {")
        codeBlock.addStatement("BridgeManager.init()")
        codeBlock.addStatement("BridgeManager.registerNativeBridge(arg0 as String, NativeBridge())")
        codeBlock.addStatement("")
        
        // Add page registrations
        pagesAnnotations.forEach { info ->
            codeBlock.addStatement("BridgeManager.registerPageRouter(\"${info.pageName}\") {")
            codeBlock.addStatement("${info.pageFullName}()")
            codeBlock.addStatement("}")
        }
        
        codeBlock.addStatement("hadRegisterNativeBridge = true")
        codeBlock.addStatement("}")
        codeBlock.addStatement("")
        codeBlock.addStatement("BridgeManager.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)")
        
        return codeBlock.build()
    }

    private fun buildTriggerRegisterPagesBody(pagesAnnotations: List<PageInfo>): CodeBlock {
        val codeBlock = CodeBlock.builder()
        codeBlock.addStatement("if (!hadRegisterNativeBridge) {")
        codeBlock.addStatement("BridgeManager.init()")
        codeBlock.addStatement("BridgeManager.registerNativeBridge(\"\", NativeBridge())")
        codeBlock.addStatement("")
        
        // Add page registrations
        pagesAnnotations.forEach { info ->
            codeBlock.addStatement("BridgeManager.registerPageRouter(\"${info.pageName}\") {")
            codeBlock.addStatement("${info.pageFullName}()")
            codeBlock.addStatement("}")
        }
        
        codeBlock.addStatement("hadRegisterNativeBridge = true")
        codeBlock.addStatement("}")
        
        return codeBlock.build()
    }

    override fun entryFileName(): String {
        return "KuiklyCoreEntry"
    }

    override fun packageName(): String {
        return "com.tencent.kuikly.core"
    }
}
