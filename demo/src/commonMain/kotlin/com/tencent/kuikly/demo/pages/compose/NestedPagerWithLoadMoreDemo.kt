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

package com.tencent.kuikly.demo.pages.compose

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.runtime.setValue
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.clickable
import com.tencent.kuikly.compose.foundation.layout.Arrangement
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.Row
import com.tencent.kuikly.compose.foundation.layout.Spacer
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
import com.tencent.kuikly.compose.foundation.layout.height
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.layout.size
import com.tencent.kuikly.compose.ui.text.font.FontWeight
import com.tencent.kuikly.compose.foundation.pager.HorizontalPager
import com.tencent.kuikly.compose.foundation.pager.PageSize
import com.tencent.kuikly.compose.foundation.pager.VerticalPager
import com.tencent.kuikly.compose.foundation.pager.rememberPagerState
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page

/**
 * HorizontalPager 嵌套 VerticalPager Demo
 * - HorizontalPager 预加载 5 页
 * - 点击按钮控制内部 VerticalPager 下滑
 * - VerticalPager 支持加载更多
 */
@Page("xxx")
class NestedPagerWithLoadMoreDemo : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            ComposeNavigationBar {
                NestedPagerContent()
            }
        }
    }

    @Composable
    fun NestedPagerContent() {
        // 外层 HorizontalPager 数据
        val horizontalTabs = listOf("页面1", "页面2", "页面3", "页面4", "页面5", "页面6", "页面7")
        val horizontalPagerState = rememberPagerState { horizontalTabs.size }

        // 第一个页面（索引0）的滚动触发器
        var firstPageScrollTrigger by remember { mutableStateOf(0) }

        Box(modifier = Modifier.fillMaxSize()) {
            // 外层 HorizontalPager，预加载 5 页
            HorizontalPager(
                state = horizontalPagerState,
                modifier = Modifier.fillMaxSize(),
                beyondViewportPageCount = 5, // 预加载 5 页
                pageSize = PageSize.Fill,
            ) { pageIndex ->
                // 每个页面包含一个 VerticalPager
                // 只有第一个页面（索引0）响应滚动触发
                VerticalPagerPage(
                    pageIndex = pageIndex,
                    pageTitle = horizontalTabs[pageIndex],
                    totalPages = horizontalTabs.size,
                    scrollTrigger = if (pageIndex == 0) firstPageScrollTrigger else 0,
                    onCurrentPageChanged = { currentPage ->
                        // 可以在这里处理页面变化
                    }
                )
            }

            // 悬浮按钮：点击让第一个 VerticalPager（页面1）下滑一页
            FloatingScrollButton(
                onClick = {
                    // 只触发第一个页面的滚动
                    firstPageScrollTrigger++
                }
            )

            // 页面指示器
            PageIndicator(
                currentPage = horizontalPagerState.currentPage,
                totalPages = horizontalTabs.size,
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }

    @Composable
    fun VerticalPagerPage(
        pageIndex: Int,
        pageTitle: String,
        totalPages: Int,
        scrollTrigger: Int,
        onCurrentPageChanged: (Int) -> Unit
    ) {
        // 数据加载状态
        var dataList by remember(pageIndex) {
            mutableStateOf((1..5).map { "Item $it" })
        }
        var isLoading by remember(pageIndex) { mutableStateOf(false) }
        var hasMoreData by remember(pageIndex) { mutableStateOf(true) }
        // 记录已加载过的数据量，避免重复触发
        var loadedSize by remember(pageIndex) { mutableStateOf(5) }

        // VerticalPager 状态
        val verticalPagerState = rememberPagerState { dataList.size }

        val coroutineScope = rememberCoroutineScope()

        // 监听滚动触发器
        LaunchedEffect(scrollTrigger) {
            if (scrollTrigger > 0) {
                val currentPage = verticalPagerState.currentPage
                val targetPage = (currentPage + 1).coerceAtMost(dataList.size - 1)
                if (targetPage > currentPage) {
                    println("[DEBUG] Page $pageIndex scroll from $currentPage to $targetPage")
                    coroutineScope.launch {
                        verticalPagerState.scrollToPage(targetPage)
                    }
                }
            }
        }

        // 加载更多：直接在 Composable 中读取 currentPage 触发重组
        val currentVerticalPage = verticalPagerState.currentPage
        val totalSize = dataList.size

        LaunchedEffect(currentVerticalPage, totalSize) {
            println("[DEBUG] Page $pageIndex: currentVerticalPage=$currentVerticalPage, totalSize=$totalSize, loadedSize=$loadedSize")
            onCurrentPageChanged(currentVerticalPage)

            // 滑到倒数第2个 item 时触发加载更多
            // 用 coroutineScope.launch 启动独立协程，避免 LaunchedEffect key 变化时取消加载
            if (currentVerticalPage >= totalSize - 2 && totalSize == loadedSize && hasMoreData && !isLoading) {
                println("[DEBUG] Page $pageIndex trigger load more at page $currentVerticalPage")

                if (totalSize >= 15) {
                    hasMoreData = false
                    return@LaunchedEffect
                }

                coroutineScope.launch {
                    isLoading = true
                    kotlinx.coroutines.delay(1000)

                    val newItems = (totalSize + 1..totalSize + 5).map { "Item $it" }
                    dataList = dataList + newItems
                    loadedSize = dataList.size
                    isLoading = false
                    println("[DEBUG] Page $pageIndex new size: ${dataList.size}")

                    if (dataList.size >= 15) {
                        hasMoreData = false
                    }
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(getPageBackgroundColor(pageIndex))
        ) {
                // 页面标题
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "$pageTitle (${pageIndex + 1}/$totalPages)",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            // 数据状态提示
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "共 ${dataList.size} 条数据 ${if (isLoading) "(加载中...)" else ""}",
                    fontSize = 14.sp,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }

            // VerticalPager
            VerticalPager(
                state = verticalPagerState,
                modifier = Modifier.fillMaxSize(),
                pageSize = PageSize.Fill,
                beyondViewportPageCount = 1,
            ) { itemIndex ->
                // 使用 index 作为 key，避免数据变化时的重组问题
                if (itemIndex >= dataList.size) {
                    // 如果索引越界，显示加载中或空页面
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Loading...", color = Color.White)
                    }
                    return@VerticalPager
                }
                val item = dataList[itemIndex]
                VerticalItem(
                    itemIndex = itemIndex,
                    item = item,
                    isLoading = isLoading && itemIndex == dataList.size - 1,
                    hasMoreData = hasMoreData
                )
            }
        }
    }

    @Composable
    fun VerticalItem(
        itemIndex: Int,
        item: String,
        isLoading: Boolean,
        hasMoreData: Boolean
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .background(Color.White.copy(alpha = 0.9f))
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 序号圆形背景
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(getItemColor(itemIndex)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${itemIndex + 1}",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // 内容文本
                Text(
                    text = item,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Black
                )

                // 加载提示
                if (isLoading) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "正在加载更多...",
                        fontSize = 16.sp,
                        color = Color.Gray
                    )
                }

                // 没有更多数据提示
                if (!hasMoreData && itemIndex >= 14) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "没有更多数据了",
                        fontSize = 16.sp,
                        color = Color.Gray
                    )
                }
            }
        }
    }

    @Composable
    fun FloatingScrollButton(
        onClick: () -> Unit
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            contentAlignment = Alignment.BottomEnd
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalAlignment = Alignment.End
            ) {
                // 下滑按钮
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(Color.Blue)
                        .clickable {
                            onClick()
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "↓",
                        fontSize = 24.sp,
                        color = Color.White
                    )
                }

                // 按钮说明
                Box(
                    modifier = Modifier
                        .background(Color.Black.copy(alpha = 0.6f))
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "下滑页面1",
                        fontSize = 12.sp,
                        color = Color.White
                    )
                }
            }
        }
    }

    @Composable
    fun PageIndicator(
        currentPage: Int,
        totalPages: Int,
        modifier: Modifier = Modifier
    ) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .padding(bottom = 100.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                repeat(totalPages) { index ->
                    Box(
                        modifier = Modifier
                            .size(if (index == currentPage) 12.dp else 8.dp)
                            .background(
                                if (index == currentPage) Color.White else Color.White.copy(alpha = 0.5f)
                            )
                    )
                }
            }
        }
    }

    // 根据页面索引获取背景色
    private fun getPageBackgroundColor(pageIndex: Int): Color {
        val colors = listOf(
            Color(0xFF1976D2), // Blue
            Color(0xFFD32F2F), // Red
            Color(0xFF388E3C), // Green
            Color(0xFFF57C00), // Orange
            Color(0xFF7B1FA2), // Purple
            Color(0xFF00796B), // Teal
            Color(0xFFC2185B), // Pink
        )
        return colors[pageIndex % colors.size]
    }

    // 根据索引获取项目颜色
    private fun getItemColor(index: Int): Color {
        val colors = listOf(
            Color(0xFF2196F3),
            Color(0xFF4CAF50),
            Color(0xFFFF9800),
            Color(0xFF9C27B0),
            Color(0xFF00BCD4),
        )
        return colors[index % colors.size]
    }
}
