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

/**
 * Kuikly 类型安全路由
 * 
 * 提供类型安全的路由定义和导航
 */
sealed class KuiklyRoute(val route: String) {
    
    /**
     * 构建完整路由（带参数）
     */
    open fun buildRoute(vararg args: Pair<String, Any>): String {
        var result = route
        args.forEach { (key, value) ->
            result = result.replace("{$key}", value.toString())
        }
        return result
    }
    
    /**
     * 首页
     */
    object Home : KuiklyRoute("home")
    
    /**
     * 详情页
     * @param id 详情ID
     */
    data class Detail(val id: String) : KuiklyRoute("detail/{id}") {
        fun build() = buildRoute("id" to id)
    }
    
    /**
     * 用户页
     * @param userId 用户ID
     */
    data class User(val userId: String) : KuiklyRoute("user/{userId}") {
        fun build() = buildRoute("userId" to userId)
    }
    
    /**
     * 设置页
     */
    object Settings : KuiklyRoute("settings")
    
    /**
     * 搜索页
     * @param keyword 搜索关键词（可选）
     */
    data class Search(val keyword: String? = null) : KuiklyRoute("search?keyword={keyword}") {
        fun build() = if (keyword != null) {
            "search?keyword=$keyword"
        } else {
            "search"
        }
    }
}

/**
 * 类型安全的导航扩展
 */
fun KuiklyNavigation.navigateTo(route: KuiklyRoute) {
    when (route) {
        is KuiklyRoute.Home -> navigateTo(route.route)
        is KuiklyRoute.Settings -> navigateTo(route.route)
        is KuiklyRoute.Detail -> navigateTo(route.build())
        is KuiklyRoute.User -> navigateTo(route.build())
        is KuiklyRoute.Search -> navigateTo(route.build())
    }
}

/**
 * 示例用法：
 * 
 * ```kotlin
 * // 导航到首页
 * KuiklyNavigation.navigateTo(KuiklyRoute.Home)
 * 
 * // 导航到详情页
 * KuiklyNavigation.navigateTo(KuiklyRoute.Detail("123"))
 * 
 * // 导航到用户页
 * KuiklyNavigation.navigateTo(KuiklyRoute.User("user_456"))
 * 
 * // 导航到搜索页
 * KuiklyNavigation.navigateTo(KuiklyRoute.Search("kotlin"))
 * ```
 */
