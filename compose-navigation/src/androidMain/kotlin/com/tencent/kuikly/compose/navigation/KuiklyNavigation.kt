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

package com.tencent.kuikly.compose.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable

/**
 * Kuikly 页面导航助手
 * 
 * 提供与 Jetpack Navigation Compose 的集成支持
 */
object KuiklyNavigation {
    
    /**
     * 当前 NavController（用于全局访问）
     */
    private var currentNavController: NavController? = null
    
    /**
     * 设置当前 NavController
     */
    fun setNavController(navController: NavController) {
        currentNavController = navController
    }
    
    /**
     * 获取当前 NavController
     */
    fun getNavController(): NavController? = currentNavController
    
    /**
     * 导航到指定路由
     */
    fun navigateTo(route: String) {
        currentNavController?.navigate(route)
    }
    
    /**
     * 返回上一页
     */
    fun navigateBack() {
        currentNavController?.popBackStack()
    }
    
    /**
     * 导航并清空返回栈
     */
    fun navigateAndClearBackStack(route: String) {
        currentNavController?.navigate(route) {
            popUpTo(0) { inclusive = true }
        }
    }
}

/**
 * Kuikly Compose 页面的 Navigation 扩展
 * 
 * 用法：
 * ```kotlin
 * NavHost(navController, startDestination = "home") {
 *     kuiklyComposable("home") { HomePage() }
 *     kuiklyComposable("detail/{id}") { DetailPage(it.arguments?.getString("id")) }
 * }
 * ```
 */
fun NavGraphBuilder.kuiklyComposable(
    route: String,
    content: @Composable (NavBackStackEntry) -> Unit
) {
    composable(route) { backStackEntry ->
        content(backStackEntry)
    }
}

/**
 * 从 NavBackStackEntry 获取参数的扩展函数
 */
fun NavBackStackEntry.getStringArg(key: String): String? {
    return arguments?.getString(key)
}

fun NavBackStackEntry.getIntArg(key: String, defaultValue: Int = 0): Int {
    return arguments?.getString(key)?.toIntOrNull() ?: defaultValue
}

fun NavBackStackEntry.getLongArg(key: String, defaultValue: Long = 0L): Long {
    return arguments?.getString(key)?.toLongOrNull() ?: defaultValue
}

fun NavBackStackEntry.getBooleanArg(key: String, defaultValue: Boolean = false): Boolean {
    return arguments?.getString(key)?.toBooleanStrictOrNull() ?: defaultValue
}
