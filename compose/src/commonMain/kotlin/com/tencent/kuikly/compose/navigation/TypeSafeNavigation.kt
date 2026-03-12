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

import kotlin.reflect.KClass

/**
 * 类型安全导航路由接口
 *
 * 使用示例：
 * ```
 * @Serializable
 * data class Profile(val id: String) : TypedRoute
 *
 * // 导航
 * navController.navigate(Profile(id = "123"))
 *
 * // 接收参数
 * val profile = backStackEntry.toRoute<Profile>()
 * ```
 */
interface TypedRoute {
    /**
     * 获取路由字符串表示
     */
    fun route(): String
}

/**
 * NavController 扩展：类型安全导航
 */
fun NavController.navigate(
    route: TypedRoute,
    popUpTo: String? = null,
    popUpToInclusive: Boolean = false,
    launchSingleTop: Boolean = false,
    restoreState: Boolean = false,
    saveState: Boolean = false
) {
    navigate(
        route = route.route(),
        popUpTo = popUpTo,
        popUpToInclusive = popUpToInclusive,
        launchSingleTop = launchSingleTop,
        restoreState = restoreState,
        saveState = saveState
    )
}

/**
 * NavGraphBuilder 扩展：类型安全 composable
 */
inline fun <reified T : TypedRoute> NavGraphBuilder.composable(
    type: KClass<T>,
    enterTransition: EnterTransition? = null,
    exitTransition: ExitTransition? = null,
    popEnterTransition: EnterTransition? = null,
    popExitTransition: ExitTransition? = null,
    noinline content: @Composable (T) -> Unit
) {
    val instance = createRouteInstance<T>()
    composable(
        route = instance.route(),
        enterTransition = enterTransition,
        exitTransition = exitTransition,
        popEnterTransition = popEnterTransition,
        popExitTransition = popExitTransition,
        content = { entry ->
            val route = entry.toRoute<T>()
            content(route)
        }
    )
}

/**
 * 将返回栈条目转换为类型安全的路由对象
 */
inline fun <reified T : TypedRoute> NavBackStackEntry.toRoute(): T {
    return parseRoute(this.route, T::class)
}

/**
 * 创建路由实例（用于获取路由字符串）
 */
inline fun <reified T : TypedRoute> createRouteInstance(): T {
    // 这里需要通过反射或其他方式创建实例
    // 实际实现可能需要依赖注入或工厂模式
    throw NotImplementedError("需要在具体项目中实现")
}

/**
 * 解析路由字符串为类型安全对象
 */
fun <T : TypedRoute> parseRoute(route: String, clazz: KClass<T>): T {
    // 这里需要实现路由字符串到对象的解析逻辑
    throw NotImplementedError("需要在具体项目中实现")
}

/**
 * 简单的路由构建器
 */
object RouteBuilder {
    /**
     * 构建带参数的路由字符串
     */
    fun build(baseRoute: String, vararg params: Pair<String, Any>): String {
        return if (params.isEmpty()) {
            baseRoute
        } else {
            val paramString = params.joinToString("&") { "${it.first}=${it.second}" }
            "$baseRoute?$paramString"
        }
    }

    /**
     * 解析路由参数
     */
    fun parseParams(route: String): Map<String, String> {
        val params = mutableMapOf<String, String>()
        val queryStart = route.indexOf('?')
        if (queryStart != -1) {
            val query = route.substring(queryStart + 1)
            query.split('&').forEach { param ->
                val (key, value) = param.split('=')
                params[key] = value
            }
        }
        return params
    }
}

/**
 * 预定义的路由类型示例
 */
sealed class AppRoute(val route: String) : TypedRoute {
    override fun route(): String = route

    object Home : AppRoute("home")
    object Category : AppRoute("category")
    object Cart : AppRoute("cart")
    object Profile : AppRoute("profile")

    data class ProductDetail(val productId: String) : AppRoute("product/$productId") {
        companion object {
            fun fromParams(params: Map<String, String>): ProductDetail {
                return ProductDetail(params["productId"] ?: "")
            }
        }
    }

    data class UserProfile(val userId: String) : AppRoute("user/$userId") {
        companion object {
            fun fromParams(params: Map<String, String>): UserProfile {
                return UserProfile(params["userId"] ?: "")
            }
        }
    }
}

/**
 * NavController 扩展：使用预定义路由类型导航
 */
fun NavController.navigate(route: AppRoute) {
    navigate(route.route())
}
