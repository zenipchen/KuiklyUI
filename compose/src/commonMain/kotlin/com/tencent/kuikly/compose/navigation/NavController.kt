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
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.Saver
import androidx.compose.runtime.saveable.listSaver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember

/**
 * 导航控制器，管理导航状态和返回栈
 */
class NavController {
    
    /**
     * 返回栈条目
     */
    data class NavBackStackEntry(
        val route: String,
        val arguments: Map<String, Any?> = emptyMap(),
        val savedState: Map<String, Any?> = emptyMap()
    )
    
    private val _backStack = mutableListOf<NavBackStackEntry>()
    private val _currentBackStackEntry = mutableStateOf<NavBackStackEntry?>(null)
    
    /**
     * 当前返回栈条目（可观察状态）
     */
    val currentBackStackEntry: State<NavBackStackEntry?> = _currentBackStackEntry
    
    /**
     * 当前路由
     */
    val currentRoute: String?
        get() = _currentBackStackEntry.value?.route
    
    /**
     * 返回栈大小
     */
    val backStackSize: Int
        get() = _backStack.size
    
    /**
     * 是否可以返回
     */
    val canGoBack: Boolean
        get() = _backStack.size > 1
    
    /**
     * 导航到指定路由
     *
     * @param route 目标路由
     * @param arguments 路由参数
     * @param popUpTo 导航前弹出到指定路由
     * @param popUpToInclusive 是否包含 popUpTo 路由一并弹出
     * @param launchSingleTop 如果目标已在栈顶，不创建新实例
     * @param restoreState 是否恢复之前保存的状态
     * @param saveState 是否保存当前状态
     */
    fun navigate(
        route: String,
        arguments: Map<String, Any?> = emptyMap(),
        popUpTo: String? = null,
        popUpToInclusive: Boolean = false,
        launchSingleTop: Boolean = false,
        restoreState: Boolean = false,
        saveState: Boolean = false
    ) {
        // 检查是否需要保存当前状态
        if (saveState && _currentBackStackEntry.value != null) {
            val currentEntry = _currentBackStackEntry.value!!
            val index = _backStack.indexOfFirst { it.route == currentEntry.route }
            if (index != -1) {
                _backStack[index] = currentEntry.copy(
                    savedState = saveCurrentState()
                )
            }
        }
        
        // 检查 launchSingleTop
        if (launchSingleTop && _currentBackStackEntry.value?.route == route) {
            return
        }
        
        // 执行 popUpTo
        if (popUpTo != null) {
            val index = _backStack.indexOfFirst { it.route == popUpTo }
            if (index != -1) {
                val removeCount = if (popUpToInclusive) {
                    _backStack.size - index
                } else {
                    _backStack.size - index - 1
                }
                repeat(removeCount) {
                    if (_backStack.isNotEmpty()) {
                        _backStack.removeAt(_backStack.size - 1)
                    }
                }
            }
        }
        
        // 查找是否已存在相同路由（用于 restoreState）
        val existingEntry = if (restoreState) {
            _backStack.find { it.route == route }
        } else null
        
        // 创建新条目或恢复已有条目
        val newEntry = existingEntry?.copy(arguments = arguments)
            ?: NavBackStackEntry(route, arguments)
        
        _backStack.add(newEntry)
        _currentBackStackEntry.value = newEntry
    }
    
    /**
     * 返回上一页
     *
     * @return 是否成功返回
     */
    fun popBackStack(): Boolean {
        if (_backStack.size <= 1) {
            return false
        }
        _backStack.removeAt(_backStack.size - 1)
        _currentBackStackEntry.value = _backStack.lastOrNull()
        return true
    }
    
    /**
     * 返回到指定路由
     *
     * @param route 目标路由
     * @param inclusive 是否包含目标路由一并弹出
     * @return 是否成功返回
     */
    fun popBackStack(route: String, inclusive: Boolean = false): Boolean {
        val index = _backStack.indexOfLast { it.route == route }
        if (index == -1) return false
        
        val targetIndex = if (inclusive) index - 1 else index
        if (targetIndex < 0) return false
        
        while (_backStack.size > targetIndex + 1) {
            _backStack.removeAt(_backStack.size - 1)
        }
        _currentBackStackEntry.value = _backStack.lastOrNull()
        return true
    }
    
    /**
     * 设置起始目的地
     */
    fun setStartDestination(route: String, arguments: Map<String, Any?> = emptyMap()) {
        if (_backStack.isEmpty()) {
            val entry = NavBackStackEntry(route, arguments)
            _backStack.add(entry)
            _currentBackStackEntry.value = entry
        }
    }
    
    /**
     * 获取路由图中起始目的地的路由
     */
    fun findStartDestination(): String {
        return _backStack.firstOrNull()?.route ?: ""
    }
    
    /**
     * 保存当前状态（可由子类重写）
     */
    private fun saveCurrentState(): Map<String, Any?> {
        return emptyMap()
    }
    
    companion object {
        /**
         * 用于 rememberSaveable 的 Saver
         */
        val Saver: Saver<NavController, *> = listSaver(
            save = { controller ->
                listOf(
                    controller._backStack.map { it.route },
                    controller._currentBackStackEntry.value?.route
                )
            },
            restore = { data ->
                NavController().apply {
                    val routes = data[0] as? List<String> ?: emptyList()
                    val currentRoute = data[1] as? String
                    routes.forEach { route ->
                        _backStack.add(NavBackStackEntry(route))
                    }
                    _currentBackStackEntry.value = _backStack.find { it.route == currentRoute }
                        ?: _backStack.lastOrNull()
                }
            }
        )
    }
}

/**
 * 创建并记住 NavController
 */
@Composable
fun rememberNavController(): NavController {
    return rememberSaveable(saver = NavController.Saver) {
        NavController()
    }
}

/**
 * 获取当前返回栈条目作为 State
 */
@Composable
fun NavController.currentBackStackEntryAsState(): State<NavController.NavBackStackEntry?> {
    return currentBackStackEntry
}
