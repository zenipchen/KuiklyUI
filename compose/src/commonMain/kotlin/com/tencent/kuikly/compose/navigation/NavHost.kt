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
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.tencent.kuikly.compose.animation.AnimatedContent
import com.tencent.kuikly.compose.animation.fadeIn
import com.tencent.kuikly.compose.animation.fadeOut
import com.tencent.kuikly.compose.animation.slideInHorizontally
import com.tencent.kuikly.compose.animation.slideOutHorizontally
import com.tencent.kuikly.compose.animation.with
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color

/**
 * 导航宿主组件，显示当前目的地对应的内容
 *
 * @param navController 导航控制器
 * @param startDestination 起始目的地路由
 * @param modifier 修饰符
 * @param content 导航图构建器
 */
@Composable
fun NavHost(
    navController: NavController,
    startDestination: String,
    modifier: Modifier = Modifier,
    content: NavGraphBuilder.() -> Unit
) {
    // 构建导航图
    val navGraph = remember(content) {
        NavGraphBuilder().apply(content).build()
    }
    
    // 设置起始目的地
    LaunchedEffect(startDestination) {
        if (navController.backStackSize == 0) {
            navController.setStartDestination(startDestination)
        }
    }
    
    // 监听当前返回栈条目
    val currentEntry by navController.currentBackStackEntry
    val currentRoute = currentEntry?.route
    
    // 获取当前导航节点
    val currentNode = remember(currentRoute, navGraph) {
        navGraph.nodes[currentRoute]
    }
    
    // 显示当前页面内容
    Box(modifier = modifier.fillMaxSize()) {
        currentNode?.let { node ->
            AnimatedContent(
                targetState = currentRoute,
                transitionSpec = {
                    // 使用节点定义的动画或默认动画
                    val enterTransition = navGraph.nodes[targetState]?.enterTransition 
                        ?: fadeIn()
                    val exitTransition = navGraph.nodes[initialState]?.exitTransition 
                        ?: fadeOut()
                    enterTransition with exitTransition
                }
            ) { route ->
                // 保存当前节点的内容
                val contentState = remember(route) {
                    mutableStateOf<(@Composable () -> Unit)?>(null)
                }
                
                // 执行内容 composable
                LaunchedEffect(route) {
                    contentState.value = node.content
                }
                
                // 显示内容
                contentState.value?.invoke()
            }
        }
    }
}

/**
 * 导航图构建器
 */
class NavGraphBuilder {
    
    internal val nodes = mutableMapOf<String, NavNode>()
    internal var startDestination: String? = null
    
    /**
     * 定义一个可组合的目的地
     *
     * @param route 路由字符串
     * @param arguments 路由参数定义
     * @param enterTransition 进入动画
     * @param exitTransition 退出动画
     * @param popEnterTransition 返回时的进入动画
     * @param popExitTransition 返回时的退出动画
     * @param content 页面内容
     */
    fun composable(
        route: String,
        arguments: List<NamedNavArgument> = emptyList(),
        enterTransition: EnterTransition? = null,
        exitTransition: ExitTransition? = null,
        popEnterTransition: EnterTransition? = null,
        popExitTransition: ExitTransition? = null,
        content: @Composable (NavBackStackEntry) -> Unit
    ) {
        nodes[route] = NavNode.ComposableNode(
            route = route,
            arguments = arguments,
            enterTransition = enterTransition,
            exitTransition = exitTransition,
            popEnterTransition = popEnterTransition,
            popExitTransition = popExitTransition,
            content = { entry -> content(entry) }
        )
    }
    
    /**
     * 定义一个嵌套导航图
     *
     * @param startDestination 嵌套图的起始目的地
     * @param route 嵌套图的路由
     * @param builder 嵌套图的构建器
     */
    fun navigation(
        startDestination: String,
        route: String,
        builder: NavGraphBuilder.() -> Unit
    ) {
        val nestedGraph = NavGraphBuilder().apply(builder)
        nodes[route] = NavNode.NavigationNode(
            route = route,
            startDestination = startDestination,
            nodes = nestedGraph.nodes
        )
    }
    
    internal fun build(): NavGraph {
        return NavGraph(nodes, startDestination)
    }
}

/**
 * 导航图
 */
internal class NavGraph(
    val nodes: Map<String, NavNode>,
    val startDestination: String?
)

/**
 * 导航节点
 */
internal sealed class NavNode {
    abstract val route: String
    abstract val content: @Composable () -> Unit
    
    data class ComposableNode(
        override val route: String,
        val arguments: List<NamedNavArgument> = emptyList(),
        val enterTransition: EnterTransition? = null,
        val exitTransition: ExitTransition? = null,
        val popEnterTransition: EnterTransition? = null,
        val popExitTransition: ExitTransition? = null,
        val nodeContent: @Composable (NavBackStackEntry) -> Unit
    ) : NavNode() {
        override val content: @Composable () -> Unit = { nodeContent(NavBackStackEntry(route)) }
    }
    
    data class NavigationNode(
        override val route: String,
        val startDestination: String,
        val nodes: Map<String, NavNode>
    ) : NavNode() {
        override val content: @Composable () -> Unit = { }
    }
}

/**
 * 命名导航参数
 */
data class NamedNavArgument(
    val name: String,
    val argument: NavArgument
)

/**
 * 导航参数
 */
data class NavArgument(
    val type: NavType,
    val defaultValue: Any? = null,
    val nullable: Boolean = false
)

/**
 * 导航参数类型
 */
sealed class NavType {
    object StringType : NavType()
    object IntType : NavType()
    object LongType : NavType()
    object FloatType : NavType()
    object BoolType : NavType()
}

/**
 * 返回栈条目
 */
data class NavBackStackEntry(
    val route: String,
    val arguments: Map<String, Any?> = emptyMap()
)

// 动画类型别名
typealias EnterTransition = com.tencent.kuikly.compose.animation.EnterTransition
typealias ExitTransition = com.tencent.kuikly.compose.animation.ExitTransition

/**
 * 创建 navArgument
 */
fun navArgument(
    name: String,
    builder: NavArgumentBuilder.() -> Unit = {}
): NamedNavArgument {
    return NamedNavArgument(name, NavArgumentBuilder().apply(builder).build())
}

/**
 * 导航参数构建器
 */
class NavArgumentBuilder {
    var type: NavType = NavType.StringType
    var defaultValue: Any? = null
    var nullable: Boolean = false
    
    fun build(): NavArgument {
        return NavArgument(type, defaultValue, nullable)
    }
}
