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

package com.tencent.kuikly.core.render.android.adapter

import android.content.res.Resources
import android.os.Build
import android.provider.Settings

/** Android 16 (API 36)，compileSdk 未定义对应 VERSION_CODES 时的兜底常量 */
private const val ANDROID_16_API_LEVEL = 36

/** [Settings.Secure.navigation_mode]：0 = 三键虚拟导航栏 */
private const val NAVIGATION_MODE_THREE_BUTTON = 0

/**
 * 框架默认键盘高度适配器，修正部分 ROM 上框架计算的键盘高度偏差。
 * 业务可通过注册 [KuiklyRenderAdapterManager.krKeyboardHeightAdapter] 完全覆盖。
 */
object KRDefaultKeyboardHeightAdapter : IKRKeyboardHeightAdapter {

    override fun adaptKeyboardHeight(context: KRKeyboardHeightContext): Int {
        val rawHeightPx = context.rawHeightPx
        if (rawHeightPx <= 0 || !isSamsung()) {
            return rawHeightPx
        }
        if (!shouldCompensateSamsungGestureNav(context)) {
            return rawHeightPx
        }
        return rawHeightPx + getStaticNavigationBarHeightPx()
    }

    /** Android 16 + 三星 + 全面屏手势 */
    private fun shouldCompensateSamsungGestureNav(context: KRKeyboardHeightContext): Boolean {
        return Build.VERSION.SDK_INT >= ANDROID_16_API_LEVEL
            && isFullScreenGestureNavigation(context)
    }

    private fun isFullScreenGestureNavigation(context: KRKeyboardHeightContext): Boolean {
        return try {
            Settings.Secure.getInt(
                context.activity.contentResolver,
                "navigation_mode",
                NAVIGATION_MODE_THREE_BUTTON,
            ) != NAVIGATION_MODE_THREE_BUTTON
        } catch (_: Exception) {
            false
        }
    }

    /** 系统配置的导航栏高度（与当前 WindowInsets 可见性无关） */
    private fun getStaticNavigationBarHeightPx(): Int {
        val resources = Resources.getSystem()
        val resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android")
        return if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 0
    }

    private fun isSamsung(): Boolean {
        return Build.MANUFACTURER.equals("samsung", ignoreCase = true)
    }
}
