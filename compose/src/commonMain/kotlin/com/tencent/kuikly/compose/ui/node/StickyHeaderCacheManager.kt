/*
 * Tencent is pleased to support the open source community by making KuiklyUI
 * available.
 * Copyright (C) 2025 THL A29 Limited, a Tencent company. All rights reserved.
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

package com.tencent.kuikly.compose.ui.node

import com.tencent.kuikly.compose.ui.geometry.Offset
import com.tencent.kuikly.compose.ui.unit.IntSize

/**
 * Sticky Header 缓存管理器
 * 专门负责管理多个 sticky header 的位置缓存
 * 与 KuiklyScrollInfo 绑定使用
 */
class StickyHeaderCacheManager {

    /**
     * 缓存数据结构
     */
    private data class StickyHeaderCache(
        val position: Offset,
        val size: IntSize
    )

    /**
     * 缓存映射表，使用 lazyItemKey 作为标识
     */
    private val stickyHeaderCacheMap = mutableMapOf<Any, StickyHeaderCache>()

    /**
     * 获取 sticky header 的缓存位置
     * 只要是 sticky header 且在首次出现时缓存位置，后续复用缓存位置
     * 支持多个 sticky header，通过 lazyItemKey 区分
     */
    fun getCachedStickyPosition(itemKey: Any, currentPos: Offset, currentSize: IntSize): Offset {
        val cachedData = stickyHeaderCacheMap[itemKey]

        return if (cachedData == null) {
            // 首次出现且是 sticky 状态时，缓存当前位置
            stickyHeaderCacheMap[itemKey] = StickyHeaderCache(currentPos, currentSize)
            currentPos
        } else {
            cachedData.position
        }
    }
}