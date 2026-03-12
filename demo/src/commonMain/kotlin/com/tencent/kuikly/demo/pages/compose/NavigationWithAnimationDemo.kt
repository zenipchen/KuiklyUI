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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
import com.tencent.kuikly.compose.foundation.lazy.items
import com.tencent.kuikly.compose.material3.Button
import com.tencent.kuikly.compose.material3.Card
import com.tencent.kuikly.compose.material3.Scaffold
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.material3.TopAppBar
import com.tencent.kuikly.compose.navigation.NavAnimations
import com.tencent.kuikly.compose.navigation.NavHost
import com.tencent.kuikly.compose.navigation.NavigationBar
import com.tencent.kuikly.compose.navigation.NavigationBarItem
import com.tencent.kuikly.compose.navigation.composable
import com.tencent.kuikly.compose.navigation.currentBackStackEntryAsState
import com.tencent.kuikly.compose.navigation.navigate
import com.tencent.kuikly.compose.navigation.rememberNavController
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page

/**
 * 带页面跳转动画的导航 Demo
 */
@Page("navanimationdemo", supportInLocal = true)
class NavigationWithAnimationDemo : ComposeContainer() {

    override fun willInit() {
        super.willInit()
        setContent {
            NavigationWithAnimationContent()
        }
    }
}

@Composable
fun NavigationWithAnimationContent() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.route ?: "home"

    // 判断是否需要显示底部导航栏
    val hideBottomBarRoutes = listOf("product_detail", "settings")
    val showBottomBar = currentRoute !in hideBottomBarRoutes

    Scaffold(
        topBar = {
            if (!showBottomBar) {
                // 在详情页显示返回按钮
                TopAppBar(
                    title = { Text("详情") },
                    navigationIcon = {
                        Text(
                            text = "← 返回",
                            modifier = Modifier
                                .padding(horizontal = 16.dp)
                                .clickable {
                                    navController.popBackStack()
                                },
                            color = Color(0xFF1976D2),
                            fontSize = 16.sp
                        )
                    }
                )
            } else {
                TopAppBar(
                    title = { Text("导航动画 Demo") }
                )
            }
        },
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    NavigationBarItem(
                        icon = { Text("🏠", fontSize = 24.sp) },
                        label = { Text("首页") },
                        selected = currentRoute == "home",
                        onClick = {
                            navController.navigate("home") {
                                popUpTo("home") { inclusive = true }
                            }
                        }
                    )
                    NavigationBarItem(
                        icon = { Text("📂", fontSize = 24.sp) },
                        label = { Text("商品") },
                        selected = currentRoute == "products",
                        onClick = {
                            navController.navigate("products") {
                                popUpTo("home") { saveState = true }
                                restoreState = true
                            }
                        }
                    )
                    NavigationBarItem(
                        icon = { Text("⚙️", fontSize = 24.sp) },
                        label = { Text("设置") },
                        selected = currentRoute == "settings_list",
                        onClick = {
                            navController.navigate("settings_list") {
                                popUpTo("home") { saveState = true }
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            // 首页 - 使用淡入淡出动画
            composable(
                "home",
                enterTransition = NavAnimations.fadeIn(),
                exitTransition = NavAnimations.fadeOut()
            ) {
                HomeAnimatedPage(
                    onNavigateToDetail = { productId ->
                        navController.navigate("product_detail/$productId")
                    }
                )
            }

            // 商品列表页
            composable(
                "products",
                enterTransition = NavAnimations.fadeIn(),
                exitTransition = NavAnimations.fadeOut()
            ) {
                ProductsPage(
                    onProductClick = { productId ->
                        navController.navigate("product_detail/$productId")
                    }
                )
            }

            // 商品详情页 - 使用滑动动画
            composable(
                "product_detail/{productId}",
                enterTransition = NavAnimations.slideInFromRight(),
                exitTransition = NavAnimations.slideOutToLeft(),
                popEnterTransition = NavAnimations.slideInFromLeft(),
                popExitTransition = NavAnimations.slideOutToRight()
            ) { entry ->
                val productId = entry.route.substringAfterLast("/")
                ProductDetailPage(productId = productId)
            }

            // 设置列表页
            composable(
                "settings_list",
                enterTransition = NavAnimations.fadeIn(),
                exitTransition = NavAnimations.fadeOut()
            ) {
                SettingsListPage(
                    onSettingClick = { settingName ->
                        navController.navigate("settings/$settingName")
                    }
                )
            }

            // 设置详情页
            composable(
                "settings/{settingName}",
                enterTransition = NavAnimations.slideInFromRight(),
                exitTransition = NavAnimations.slideOutToLeft(),
                popEnterTransition = NavAnimations.slideInFromLeft(),
                popExitTransition = NavAnimations.slideOutToRight()
            ) { entry ->
                val settingName = entry.route.substringAfterLast("/")
                SettingDetailPage(settingName = settingName)
            }
        }
    }
}

@Composable
fun HomeAnimatedPage(onNavigateToDetail: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .padding(16.dp)
    ) {
        Text(
            text = "🏠 推荐商品",
            fontSize = 24.sp,
            color = Color.Black,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // 推荐商品卡片
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onNavigateToDetail("1") }
                .padding(8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp)
                        .background(Color(0xFFE0E0E0)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("📱 商品图片", fontSize = 48.sp)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text("iPhone 15 Pro", fontSize = 18.sp, color = Color.Black)
                Text("¥ 8999", fontSize = 16.sp, color = Color(0xFFF44336))
                Text("点击查看详情 →", fontSize = 14.sp, color = Color(0xFF1976D2))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onNavigateToDetail("2") }
                .padding(8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp)
                        .background(Color(0xFFE0E0E0)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("💻 商品图片", fontSize = 48.sp)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text("MacBook Pro", fontSize = 18.sp, color = Color.Black)
                Text("¥ 14999", fontSize = 16.sp, color = Color(0xFFF44336))
                Text("点击查看详情 →", fontSize = 14.sp, color = Color(0xFF1976D2))
            }
        }
    }
}

@Composable
fun ProductsPage(onProductClick: (String) -> Unit) {
    val products = listOf(
        "1" to "iPhone 15 Pro",
        "2" to "MacBook Pro",
        "3" to "iPad Air",
        "4" to "AirPods Pro",
        "5" to "Apple Watch",
        "6" to "Magic Mouse"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .padding(16.dp)
    ) {
        item {
            Text(
                text = "📂 全部商品",
                fontSize = 24.sp,
                color = Color.Black,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }

        items(products) { (id, name) ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onProductClick(id) }
                    .padding(vertical = 4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(60.dp)
                            .background(Color(0xFFE0E0E0)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("📦", fontSize = 32.sp)
                    }
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .padding(start = 16.dp)
                    ) {
                        Text(name, fontSize = 16.sp, color = Color.Black)
                        Text("点击查看详情", fontSize = 14.sp, color = Color.Gray)
                    }
                    Text("→", fontSize = 24.sp, color = Color(0xFF1976D2))
                }
            }
        }
    }
}

@Composable
fun ProductDetailPage(productId: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
                .background(Color(0xFFF5F5F5)),
            contentAlignment = Alignment.Center
        ) {
            Text("📱 商品 $productId 大图", fontSize = 64.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "商品详情 #$productId",
            fontSize = 24.sp,
            color = Color.Black
        )

        Text(
            text = "这是商品 $productId 的详细描述信息。\n\n" +
                    "• 高性能处理器\n" +
                    "• 超长续航\n" +
                    "• 精美设计\n" +
                    "• 优质售后",
            fontSize = 16.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 16.dp)
        )

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = { },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("立即购买", fontSize = 18.sp)
        }
    }
}

@Composable
fun SettingsListPage(onSettingClick: (String) -> Unit) {
    val settings = listOf(
        "account" to "👤 账号设置",
        "notification" to "🔔 通知设置",
        "privacy" to "🔒 隐私设置",
        "about" to "ℹ️ 关于我们"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .padding(16.dp)
    ) {
        item {
            Text(
                text = "⚙️ 设置",
                fontSize = 24.sp,
                color = Color.Black,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }

        items(settings) { (id, name) ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSettingClick(id) }
                    .padding(vertical = 4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(name, fontSize = 16.sp, color = Color.Black)
                    Text("→", fontSize = 20.sp, color = Color.Gray)
                }
            }
        }
    }
}

@Composable
fun SettingDetailPage(settingName: String) {
    val title = when (settingName) {
        "account" -> "👤 账号设置"
        "notification" -> "🔔 通知设置"
        "privacy" -> "🔒 隐私设置"
        "about" -> "ℹ️ 关于我们"
        else -> "设置详情"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            text = title,
            fontSize = 24.sp,
            color = Color.Black,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // 模拟设置项
        repeat(5) { index ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("设置项 ${index + 1}", fontSize = 16.sp)
                Text("开关", fontSize = 14.sp, color = Color(0xFF1976D2))
            }
            if (index < 4) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(Color(0xFFE0E0E0))
                )
            }
        }
    }
}
