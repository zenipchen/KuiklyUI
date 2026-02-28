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
import androidx.compose.runtime.setValue
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.extension.bouncesEnable
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.border
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.Spacer
import com.tencent.kuikly.compose.foundation.layout.fillMaxHeight
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
import com.tencent.kuikly.compose.foundation.layout.height
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
import com.tencent.kuikly.compose.foundation.pager.HorizontalPager
import com.tencent.kuikly.compose.foundation.pager.rememberPagerState
import com.tencent.kuikly.compose.material3.Tab
import com.tencent.kuikly.compose.material3.TabRow
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page
import kotlinx.coroutines.launch

@Page("NestedHorizontalPagerDemo")
class NestedHorizontalPagerDemo : ComposeContainer() {
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
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .background(Color(0xFFF5F5F5)),
        ) {
            // 外层标签定义
            val outerTabs = listOf("主页面1", "主页面2", "主页面3", "主页面4")
            val outerPagerState = rememberPagerState { outerTabs.size }
            val outerCoroutineScope = rememberCoroutineScope()

            // 外层 TabRow
            TabRow(
                selectedTabIndex = outerPagerState.currentPage,
                modifier = Modifier.fillMaxWidth(),
                containerColor = Color(0xFF6200EE),
                contentColor = Color.White,
            ) {
                outerTabs.forEachIndexed { index, title ->
                    Tab(
                        selected = outerPagerState.currentPage == index,
                        onClick = {
                            outerCoroutineScope.launch {
                                outerPagerState.animateScrollToPage(index)
                            }
                        },
                        text = {
                            Text(
                                title,
                                fontSize = 16.sp,
                                color = if (outerPagerState.currentPage == index) Color.White else Color.White.copy(alpha = 0.7f),
                            )
                        },
                    )
                }
            }

            // 外层 HorizontalPager
            HorizontalPager(
                state = outerPagerState,
                modifier =
                    Modifier
                        .fillMaxSize()
                        .bouncesEnable(false),
            ) { outerPage ->
                // 每个外层页面都包含一个内层的 TabRow + HorizontalPager
                InnerPagerPage(outerPageIndex = outerPage)
            }
        }
    }

    @Composable
    fun InnerPagerPage(outerPageIndex: Int) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .background(Color.White),
        ) {
            // 内层标签定义 - 每个外层页面有不同的内层标签
            val innerTabs = List(5) { "子页面${outerPageIndex + 1}-${it + 1}" }
            val innerPagerState = rememberPagerState { innerTabs.size }
            val innerCoroutineScope = rememberCoroutineScope()

            Spacer(modifier = Modifier.height(8.dp))

            // 内层 TabRow
            TabRow(
                selectedTabIndex = innerPagerState.currentPage,
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                containerColor = Color(0xFF03DAC5),
                contentColor = Color.Black,
            ) {
                innerTabs.forEachIndexed { index, title ->
                    Tab(
                        selected = innerPagerState.currentPage == index,
                        onClick = {
                            innerCoroutineScope.launch {
                                innerPagerState.animateScrollToPage(index)
                            }
                        },
                        text = {
                            Text(
                                title,
                                fontSize = 14.sp,
                                color = if (innerPagerState.currentPage == index) Color.Black else Color.Black.copy(alpha = 0.6f),
                            )
                        },
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 内层 HorizontalPager
            HorizontalPager(
                state = innerPagerState,
                modifier =
                    Modifier
                        .fillMaxSize()
                        .bouncesEnable(false),
            ) { innerPage ->
                // 内层页面内容
                InnerPageContent(
                    outerPageIndex = outerPageIndex,
                    innerPageIndex = innerPage,
                )
            }
        }
    }

    @Composable
    fun InnerPageContent(
        outerPageIndex: Int,
        innerPageIndex: Int,
    ) {
        // 页面内容 - 使用 LazyColumn 展示可滚动的内容
        LazyColumn(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(16.dp),
        ) {
            item {
                Box(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .height(120.dp)
                            .background(getColorForPage(outerPageIndex, innerPageIndex))
                            .border(2.dp, Color.DarkGray)
                            .padding(16.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "外层页面: ${outerPageIndex + 1}",
                            fontSize = 20.sp,
                            color = Color.White,
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "内层页面: ${innerPageIndex + 1}",
                            fontSize = 18.sp,
                            color = Color.White,
                        )
                    }
                }
            }

            // 添加一些列表内容展示垂直滚动
            items(30) { itemIndex ->
                Box(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .height(60.dp)
                            .padding(vertical = 4.dp)
                            .background(Color(0xFFE0E0E0))
                            .border(1.dp, Color.Gray)
                            .padding(16.dp),
                    contentAlignment = Alignment.CenterStart,
                ) {
                    Text(
                        "列表项 ${itemIndex + 1} - 主${outerPageIndex + 1} / 子${innerPageIndex + 1}",
                        fontSize = 14.sp,
                    )
                }
            }
        }
    }

    // 根据页面索引返回不同的颜色
    private fun getColorForPage(
        outerPage: Int,
        innerPage: Int,
    ): Color {
        val colors =
            listOf(
                Color(0xFF1976D2), // Blue
                Color(0xFFD32F2F), // Red
                Color(0xFF388E3C), // Green
                Color(0xFFF57C00), // Orange
                Color(0xFF7B1FA2), // Purple
            )
        return colors[(outerPage * 5 + innerPage) % colors.size]
    }
}
