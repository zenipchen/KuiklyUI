/*
 * LazyColumnStickyHeader 演示
 * 
 * 这个文件展示了 Kuikly Compose DSL 中 LazyColumn 的 Sticky Header 功能实现。
 * 
 * 主要功能：
 * 1. 基础 Sticky Header - 简单的分组标题吸顶效果
 * 2. 高级 Sticky Header - 带边距的吸顶效果，支持复杂的布局结构
 * 
 * 技术特性：
 * - 使用 stickyHeader() 函数实现基础吸顶效果
 * - 使用 stickyHeaderWithMarginTop() 函数实现带边距的吸顶效果
 * - 支持动态内容更新和性能优化
 * - 自动处理滚动冲突和布局计算
 * 
 * 使用场景：
 * - 联系人列表按字母分组
 * - 商品列表按分类展示
 * - 新闻列表按时间分组
 * - 任何需要分组展示的长列表
 * 
 * 作者：AI Assistant
 * 创建时间：2024
 */

@file:OptIn(ExperimentalFoundationApi::class)

package com.tencent.kuikly.demo.pages.compose

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.coil3.rememberAsyncImagePainter
import com.tencent.kuikly.compose.foundation.ExperimentalFoundationApi
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.border
import com.tencent.kuikly.compose.foundation.gestures.detectTransformGestures
import com.tencent.kuikly.compose.foundation.layout.Arrangement
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.Row
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.layout.size
import com.tencent.kuikly.compose.foundation.layout.width
import com.tencent.kuikly.compose.foundation.layout.wrapContentSize
import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
import com.tencent.kuikly.compose.foundation.lazy.rememberLazyListState
import com.tencent.kuikly.compose.foundation.layout.PaddingValues
import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
import com.tencent.kuikly.compose.foundation.layout.Spacer
import com.tencent.kuikly.compose.foundation.lazy.items
import com.tencent.kuikly.compose.foundation.shape.RoundedCornerShape
import com.tencent.kuikly.compose.material3.Button
import com.tencent.kuikly.compose.material3.MaterialTheme
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.core.annotations.Page


@Page("LazyColumnStickyHeader")
class LazyColumnStickyHeader : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            ComposeNavigationBar {
                LazyColumnStickyHeaderImpl()
            }
        }
    }
}

@Composable
fun LazyColumnStickyHeaderImpl() {
    var showAdvancedDemo by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        // 简单的顶部栏
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.primaryContainer)
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Sticky Header 演示",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )

            Button(
                onClick = { showAdvancedDemo = !showAdvancedDemo }
            ) {
                Text(
                    text = if (showAdvancedDemo) "基础演示" else "高级演示"
                )
            }
        }

        // 内容区域
        if (showAdvancedDemo) {
            AdvancedStickyHeaderDemo()
        } else {
            BasicStickyHeaderDemo()
        }
    }
}

@Composable
fun BasicStickyHeaderDemo() {
    val listState = rememberLazyListState()

    // 模拟分组数据
    val groups = remember {
        listOf(
            "A" to (1..5).map { "Apple $it" },
            "B" to (1..8).map { "Banana $it" },
            "C" to (1..6).map { "Cherry $it" },
            "D" to (1..4).map { "Date $it" },
            "E" to (1..7).map { "Elderberry $it" },
            "F" to (1..9).map { "Fig $it" },
            "G" to (1..5).map { "Grape $it" },
            "H" to (1..6).map { "Honeydew $it" }
        )
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // 说明文字
        Text(
            text = "基础演示：简单的 sticky header",
            modifier = Modifier.padding(16.dp),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        // 主要的 LazyColumn
        LazyColumn(
            state = listState,
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {
            // 顶部说明区域
            item {
                Text(
                    text = "使用 stickyHeader 实现简单的吸顶效果",
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // 分组内容
            groups.forEach { (letter, items) ->
                // Sticky Header - 字母分组标题
                stickyHeader(
                    key = "header_$letter"
                ) { headerIndex ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.primary)
                            .padding(16.dp)
                    ) {
                        Text(
                            text = "分组 $letter",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.align(Alignment.CenterStart)
                        )
                    }
                }

                // 分组内的项目
                items(
                    items = items,
                    key = { item -> "item_${letter}_$item" }
                ) { item ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surface)
                            .border(
                                width = 0.5.dp,
                                color = MaterialTheme.colorScheme.outlineVariant
                            )
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // 项目图标
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .background(
                                        MaterialTheme.colorScheme.secondaryContainer,
                                        shape = RoundedCornerShape(8.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = letter,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer
                                )
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            // 项目内容
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item,
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = "这是 $item 的详细描述信息",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                        }
                    }
                }
            }

            // 底部说明
            item {
                Text(
                    text = "滚动查看吸顶效果",
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun AdvancedStickyHeaderDemo() {
    val listState = rememberLazyListState()

    // 模拟更复杂的分组数据
    val advancedGroups = remember {
        listOf(
            "热门推荐" to (1..3).map { "热门项目 $it" },
            "最新发布" to (1..5).map { "新项目 $it" },
            "精选内容" to (1..4).map { "精选 $it" },
            "推荐阅读" to (1..6).map { "推荐 $it" }
        )
    }

    LazyColumn(
        state = listState,
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 16.dp)
    ) {
        // 顶部说明
        item {
            Text(
                text = "高级演示：带边距的 sticky header",
                modifier = Modifier.padding(16.dp),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // 分组内容
        advancedGroups.forEach { (category, items) ->
            // 带边距的 Sticky Header
            stickyHeaderWithMarginTop(
                key = "advanced_header_$category",
                listState = listState,
                hoverMarginTop = 56.dp
            ) { headerIndex ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.secondary)
                        .padding(16.dp)
                ) {
                    Text(
                        text = category,
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSecondary,
                        modifier = Modifier.align(Alignment.CenterStart)
                    )
                }
            }


            // 分组内的项目
            items(
                items = items,
                key = { item -> "advanced_item_${category}_$item" }
            ) { item ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surface)
                        .border(
                            width = 0.5.dp,
                            color = MaterialTheme.colorScheme.outlineVariant
                        )
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // 项目图标
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .background(
                                    MaterialTheme.colorScheme.tertiaryContainer,
                                    shape = RoundedCornerShape(8.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = item.first().toString(),
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        // 项目详情
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item,
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "这是 $item 的详细描述信息",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        // 右侧箭头
                    }
                }
            }
        }

        // 底部说明
        item {
            Text(
                text = "使用 stickyHeaderWithMarginTop 实现带边距的吸顶效果",
                modifier = Modifier.padding(16.dp),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

/*
 * 使用示例：
 * 
 * 1. 基础 Sticky Header 使用：
 * 
 * LazyColumn {
 *     stickyHeader(key = "header_1") { headerIndex ->
 *         Text("分组标题", modifier = Modifier.background(Color.Gray))
 *     }
 *     items(items) { item ->
 *         Text(item)
 *     }
 * }
 * 
 * 2. 带边距的 Sticky Header 使用：
 * 
 * val listState = rememberLazyListState()
 * LazyColumn(state = listState) {
 *     stickyHeaderWithMarginTop(
 *         key = "header_1",
 *         listState = listState,
 *         hoverMarginTop = 56.dp
 *     ) { headerIndex ->
 *         Text("带边距的分组标题")
 *     }
 *     items(items) { item ->
 *         Text(item)
 *     }
 * }
 * 
 * 3. 分组列表的完整示例：
 * 
 * val groups = listOf(
 *     "A" to listOf("Apple", "Ant"),
 *     "B" to listOf("Banana", "Bear")
 * )
 * 
 * LazyColumn {
 *     groups.forEach { (letter, items) ->
 *         stickyHeader(key = "header_$letter") {
 *             Text("分组 $letter")
 *         }
 *         items(items) { item ->
 *             Text(item)
 *         }
 *     }
 * }
 */