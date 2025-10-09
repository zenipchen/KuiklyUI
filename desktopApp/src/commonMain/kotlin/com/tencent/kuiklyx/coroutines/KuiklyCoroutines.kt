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

/**
 * 跨平台 Kuikly 协程初始化
 * 提供简单的初始化接口，由各平台实现具体的调度逻辑
 */

/**
 * 线程调度器接口
 */
interface KuiklyThreadScheduler {
    fun scheduleOnKuiklyThread(pagerId: String, task: () -> Unit)
}

/**
 * 跨平台初始化 Kuikly 协程系统
 * 各平台需要实现此方法来设置线程调度器
 */
expect fun initKuiklyCoroutines()
