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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.layout.Arrangement
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.painter.painterResource
import com.tencent.kuikly.compose.material3.Scaffold
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.material3.TopAppBar
import com.tencent.kuikly.compose.navigation.AppRoute
import com.tencent.kuikly.compose.navigation.NavAnimations
import com.tencent.kuikly.compose.navigation.NavHost
import com.tencent.kuikly.compose.navigation.NavigationBar
import com.tencent.kuikly.compose.navigation.NavigationBarItem
import com.tencent.kuikly.compose.navigation.composable
import com.tencent.kuikly.compose.navigation.currentBackStackEntryAsState
import com.tencent.kuikly.compose.navigation.navigate
import com.tencent.kuikly.compose.navigation.rememberNavController
import com.tencent.kuikly.compose.resources.DrawableResource
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page

/**
 * NavigationBar 完整功能 Demo
 */
@Page("navbardemo", supportInLocal = true)
class NavigationBarDemo : ComposeContainer() {

    override fun willInit() {
        super.willInit()
        setContent {
            NavigationBarDemoContent()
        }
    }
}

@Composable
fun NavigationBarDemoContent() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.route ?: "home"

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("NavigationBar Demo") }
            )
        },
        bottomBar = {
            NavigationBar {
                // 首页
                NavigationBarItem(
                    icon = {
                        val iconRes = if (currentRoute == "home") 
                            DrawableResource("home_filled") 
                        else 
                            DrawableResource("home_outlined")
                        // 使用 painterResource 加载图标
                        Box(
                            modifier = Modifier.padding(4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (currentRoute == "home") "🏠" else "🏠",
                                fontSize = 24.sp
                            )
                        }
                    },
                    label = { Text("首页") },
                    selected = currentRoute == "home",
                    onClick = { navController.navigate(AppRoute.Home) }
                )

                // 分类
                NavigationBarItem(
                    icon = {
                        Box(
                            modifier = Modifier.padding(4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (currentRoute == "category") "📂" else "📂",
                                fontSize = 24.sp
                            )
                        }
                    },
                    label = { Text("分类") },
                    selected = currentRoute == "category",
                    onClick = { navController.navigate(AppRoute.Category) }
                )

                // 购物车（带角标）
                NavigationBarItem(
                    icon = {
                        Box(
                            modifier = Modifier.padding(4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (currentRoute == "cart") "🛒" else "🛒",
                                fontSize = 24.sp
                            )
                        }
                    },
                    label = { Text("购物车") },
                    selected = currentRoute == "cart",
                    onClick = { navController.navigate(AppRoute.Cart) }
                )

                // 我的
                NavigationBarItem(
                    icon = {
                        Box(
                            modifier = Modifier.padding(4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (currentRoute == "profile") "👤" else "👤",
                                fontSize = 24.sp
                            )
                        }
                    },
                    label = { Text("我的") },
                    selected = currentRoute == "profile",
                    onClick = { navController.navigate(AppRoute.Profile) }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            // 首页
            composable(
                "home",
                enterTransition = NavAnimations.BottomNavTransitions.enter,
                exitTransition = NavAnimations.BottomNavTransitions.exit
            ) { HomePage() }

            // 分类
            composable(
                "category",
                enterTransition = NavAnimations.BottomNavTransitions.enter,
                exitTransition = NavAnimations.BottomNavTransitions.exit
            ) { CategoryPage() }

            // 购物车
            composable(
                "cart",
                enterTransition = NavAnimations.BottomNavTransitions.enter,
                exitTransition = NavAnimations.BottomNavTransitions.exit
            ) { CartPage() }

            // 我的
            composable(
                "profile",
                enterTransition = NavAnimations.BottomNavTransitions.enter,
                exitTransition = NavAnimations.BottomNavTransitions.exit
            ) { ProfilePage() }
        }
    }
}

@Composable
fun HomePage() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "🏠 首页",
            fontSize = 32.sp,
            color = Color.Black
        )
        Text(
            text = "这是首页内容",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

@Composable
fun CategoryPage() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFE8F5E9))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "📂 分类",
            fontSize = 32.sp,
            color = Color(0xFF2E7D32)
        )
        Text(
            text = "这是分类内容",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

@Composable
fun CartPage() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFF3E0))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "🛒 购物车",
            fontSize = 32.sp,
            color = Color(0xFFEF6C00)
        )
        Text(
            text = "购物车中有 3 件商品",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

@Composable
fun ProfilePage() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFE3F2FD))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "👤 我的",
            fontSize = 32.sp,
            color = Color(0xFF1565C0)
        )
        Text(
            text = "用户个人中心",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}
