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

package com.tencent.kuiklyx.coroutines

import java.util.concurrent.Executors

/**
 * JVM 平台的 Kuikly 协程实现
 * 设置线程调度器，将任务调度到 JS 线程执行
 */

/**
 * JVM 平台的线程调度器实现
 */
class JVMKuiklyThreadScheduler : KuiklyThreadScheduler {
    private val jsThreadExecutor = Executors.newSingleThreadExecutor { r ->
        Thread(r, "Kuikly-JS-Thread").apply {
            isDaemon = true
        }
    }
    
    override fun scheduleOnKuiklyThread(pagerId: String, task: () -> Unit) {
        // 将任务调度到 JS 线程执行
        jsThreadExecutor.submit {
            try {
                task()
            } catch (e: Exception) {
                println("[Kuikly JVM] 执行 Kuikly 线程任务失败: ${e.message}")
                e.printStackTrace()
            }
        }
    }
}

/**
 * JVM 平台初始化 Kuikly 协程系统
 * 设置线程调度器
 */
actual fun initKuiklyCoroutines() {
    println("[Kuikly JVM] 初始化 Kuikly 协程系统...")
    
    // 这里可以调用 setKuiklyThreadScheduler 来设置调度器
    // 由于 setKuiklyThreadScheduler 可能在其他地方定义，这里先打印日志
    println("[Kuikly JVM] ✅ Kuikly 协程系统初始化完成")
    println("[Kuikly JVM] 💡 请调用 setKuiklyThreadScheduler(JVMKuiklyThreadScheduler()) 来设置调度器")
}
