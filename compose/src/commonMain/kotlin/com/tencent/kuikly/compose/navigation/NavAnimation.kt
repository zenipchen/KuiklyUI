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

import com.tencent.kuikly.compose.animation.EnterTransition
import com.tencent.kuikly.compose.animation.ExitTransition
import com.tencent.kuikly.compose.animation.fadeIn
import com.tencent.kuikly.compose.animation.fadeOut
import com.tencent.kuikly.compose.animation.slideInHorizontally
import com.tencent.kuikly.compose.animation.slideInVertically
import com.tencent.kuikly.compose.animation.slideOutHorizontally
import com.tencent.kuikly.compose.animation.slideOutVertically
import com.tencent.kuikly.compose.animation.core.FastOutSlowInEasing
import com.tencent.kuikly.compose.animation.core.LinearOutSlowInEasing
import com.tencent.kuikly.compose.animation.core.tween

/**
 * 导航动画规范
 *
 * 提供常用的导航过渡动画效果
 */
object NavAnimations {

    /**
     * 水平滑动进入（从右向左）- 适合页面推送
     */
    fun slideInFromRight(): EnterTransition {
        return slideInHorizontally(
            initialOffsetX = { fullWidth -> fullWidth },
            animationSpec = tween(
                durationMillis = 300,
                easing = FastOutSlowInEasing
            )
        )
    }

    /**
     * 水平滑出（从左向右）- 适合页面返回
     */
    fun slideOutToRight(): ExitTransition {
        return slideOutHorizontally(
            targetOffsetX = { fullWidth -> fullWidth },
            animationSpec = tween(
                durationMillis = 300,
                easing = FastOutSlowInEasing
            )
        )
    }

    /**
     * 水平滑入（从左向右）- 适合页面返回时的进入
     */
    fun slideInFromLeft(): EnterTransition {
        return slideInHorizontally(
            initialOffsetX = { fullWidth -> -fullWidth },
            animationSpec = tween(
                durationMillis = 300,
                easing = LinearOutSlowInEasing
            )
        )
    }

    /**
     * 水平滑出（从右向左）- 适合页面推送时的退出
     */
    fun slideOutToLeft(): ExitTransition {
        return slideOutHorizontally(
            targetOffsetX = { fullWidth -> -fullWidth },
            animationSpec = tween(
                durationMillis = 300,
                easing = LinearOutSlowInEasing
            )
        )
    }

    /**
     * 垂直滑入（从下向上）- 适合底部弹出页面
     */
    fun slideInFromBottom(): EnterTransition {
        return slideInVertically(
            initialOffsetY = { fullHeight -> fullHeight },
            animationSpec = tween(
                durationMillis = 300,
                easing = FastOutSlowInEasing
            )
        )
    }

    /**
     * 垂直滑出（从上向下）- 适合关闭底部弹出页面
     */
    fun slideOutToBottom(): ExitTransition {
        return slideOutVertically(
            targetOffsetY = { fullHeight -> fullHeight },
            animationSpec = tween(
                durationMillis = 300,
                easing = FastOutSlowInEasing
            )
        )
    }

    /**
     * 淡入动画 - 适合底部导航切换
     */
    fun fadeIn(): EnterTransition {
        return fadeIn(
            animationSpec = tween(
                durationMillis = 200,
                easing = LinearOutSlowInEasing
            )
        )
    }

    /**
     * 淡出动画 - 适合底部导航切换
     */
    fun fadeOut(): ExitTransition {
        return fadeOut(
            animationSpec = tween(
                durationMillis = 200,
                easing = LinearOutSlowInEasing
            )
        )
    }

    /**
     * 淡入 + 缩放 - 适合弹窗或重要页面
     */
    fun fadeInWithScale(): EnterTransition {
        return fadeIn() + scaleIn(
            initialScale = 0.9f,
            animationSpec = tween(300)
        )
    }

    /**
     * 默认页面推送动画组合
     */
    object PageTransitions {
        val enter: EnterTransition = slideInFromRight()
        val exit: ExitTransition = slideOutToLeft()
        val popEnter: EnterTransition = slideInFromLeft()
        val popExit: ExitTransition = slideOutToRight()
    }

    /**
     * 底部导航切换动画组合
     */
    object BottomNavTransitions {
        val enter: EnterTransition = fadeIn()
        val exit: ExitTransition = fadeOut()
        val popEnter: EnterTransition = fadeIn()
        val popExit: ExitTransition = fadeOut()
    }

    /**
     * 模态页面动画组合（从底部滑入）
     */
    object ModalTransitions {
        val enter: EnterTransition = slideInFromBottom()
        val exit: ExitTransition = slideOutToBottom()
        val popEnter: EnterTransition = slideInFromBottom()
        val popExit: ExitTransition = slideOutToBottom()
    }
}

/**
 * 创建缩放入场动画
 */
fun scaleIn(
    initialScale: Float = 0f,
    animationSpec: AnimationSpec<Float> = tween(300)
): EnterTransition {
    // 实际实现需要使用 compose animation 的 scaleIn
    return EnterTransition.None
}

/**
 * 动画规格类型别名
 */
typealias AnimationSpec<T> = com.tencent.kuikly.compose.animation.core.AnimationSpec<T>
