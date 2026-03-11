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
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavController

/**
 * Kuikly ViewModel 扩展
 * 
 * 提供 ViewModel 与 Navigation 的集成支持
 */

/**
 * 在 Composable 中获取 ViewModel（作用域为当前路由）
 * 
 * ```kotlin
 * @Composable
 * fun DetailPage(navBackStackEntry: NavBackStackEntry) {
 *     val viewModel: DetailViewModel = kuiklyViewModel(navBackStackEntry)
 *     // ...
 * }
 * ```
 */
@Composable
inline fun <reified VM : ViewModel> kuiklyViewModel(
    navBackStackEntry: NavBackStackEntry
): VM {
    return viewModel(navBackStackEntry)
}

/**
 * 在 Composable 中获取共享 ViewModel（作用域为整个 NavGraph）
 * 
 * ```kotlin
 * @Composable
 * fun DetailPage(navController: NavController) {
 *     val sharedViewModel: SharedViewModel = kuiklySharedViewModel(navController)
 *     // ...
 * }
 * ```
 */
@Composable
inline fun <reified VM : ViewModel> kuiklySharedViewModel(
    navController: NavController
): VM {
    val navBackStackEntry = navController.currentBackStackEntry
    return viewModel(navBackStackEntry!!)
}

/**
 * 示例 ViewModel
 */
class DetailViewModel : ViewModel() {
    // ViewModel 逻辑
}

/**
 * 示例：在页面中使用 ViewModel
 * 
 * ```kotlin
 * @Composable
 * fun DetailPage(navBackStackEntry: NavBackStackEntry) {
 *     val viewModel: DetailViewModel = kuiklyViewModel(navBackStackEntry)
 *     
 *     // 使用 viewModel
 *     Text("Detail: ${viewModel.data}")
 * }
 * ```
 */
