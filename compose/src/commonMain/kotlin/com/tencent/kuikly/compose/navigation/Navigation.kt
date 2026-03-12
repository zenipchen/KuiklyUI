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

@file:Suppress("NOTHING_TO_INLINE")

package com.tencent.kuikly.compose.navigation

/**
 * Kuikly Navigation 模块
 *
 * 提供声明式导航组件，包括：
 * - NavController: 导航控制器
 * - NavHost: 导航宿主
 * - NavigationBar: 底部导航栏
 * - NavigationBarItem: 导航项
 * - NavAnimations: 导航动画
 *
 * 使用示例：
 * ```
 * val navController = rememberNavController()
 *
 * NavHost(navController, startDestination = "home") {
 *     composable("home") { HomeScreen() }
 *     composable("profile") { ProfileScreen() }
 * }
 * ```
 */

// 重新导出主要 API
inline fun navigationVersion(): String = "1.0.0"

/**
 * Navigation 配置选项
 */
data class NavigationOptions(
    val restoreState: Boolean = false,
    val saveState: Boolean = false,
    val launchSingleTop: Boolean = false
)
