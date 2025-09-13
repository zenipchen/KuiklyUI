/*
 * Tencent is pleased to support the open source community by making KuiklyUI
 * available.
 * Copyright (C) 2025 THL A29 Limited, a Tencent company. All rights reserved.
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

package com.tencent.kuikly.core.render.android.expand.module

import android.app.Activity
import android.content.Context
import android.content.res.Configuration
import android.graphics.Rect
import android.os.Build
import android.view.View
import android.view.ViewTreeObserver
import android.view.WindowManager
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.tencent.kuikly.core.render.android.adapter.KuiklyRenderLog
import com.tencent.kuikly.core.render.android.export.KuiklyRenderBaseModule

/**
 * 用于获取/监听键盘的相关状态
 */
class KRKeyboardModule : KuiklyRenderBaseModule() {

    companion object {
        const val MODULE_NAME = "KRKeyboardModule"
    }

    private var keyboardStatusWatcher: KeyboardStatusWatcher? = null

    fun addListener(listener: KeyboardStatusListener) {
        if (keyboardStatusWatcher == null) {
            activity?.let {
                keyboardStatusWatcher = KeyboardStatusWatcher(it)
            }
        }
        keyboardStatusWatcher?.addListener(listener)
    }

    fun removeListener(listener: KeyboardStatusListener) {
        keyboardStatusWatcher?.removeListener(listener)
    }

    override fun onDestroy() {
        super.onDestroy()
        keyboardStatusWatcher?.destroy()
    }

}

/**
 * 键盘状态监听，使用 ViewTreeObserver 和 WindowInsets 监听键盘状态变化
 * 对齐 Compose 库的方案，不使用 PopupWindow
 */
class KeyboardStatusWatcher(private val activity: Activity) : ViewTreeObserver.OnGlobalLayoutListener {

    private val rootView: View by lazy {
        activity.findViewById<View>(android.R.id.content)
    }
    
    private var lastVisibleHeight = -1
    private var lastKeyboardHeight = -1
    private var listeners = ArrayList<KeyboardStatusListener>()
    private var isInitialized = false
    private var lastConfigurationHash = -1

    init {
        // 初始化配置哈希值
        lastConfigurationHash = getConfigurationHash(activity.resources.configuration)
        
        // 设置 WindowInsets 监听
        setupWindowInsetsListener()
        
        // 添加 ViewTreeObserver 监听
        rootView.viewTreeObserver.addOnGlobalLayoutListener(this)
    }

    override fun onGlobalLayout() {
        // 检查配置是否发生变化（包括分屏模式切换）
        val currentConfig = activity.resources.configuration
        val currentConfigHash = getConfigurationHash(currentConfig)
        
        if (currentConfigHash != lastConfigurationHash) {
            // 配置发生变化，重置状态
            KuiklyRenderLog.d(KRKeyboardModule.MODULE_NAME, "Configuration changed, resetting keyboard state")
            resetKeyboardState()
            lastConfigurationHash = currentConfigHash
        }
        
        // 使用 WindowInsets 获取键盘高度
        val keyboardHeight = getKeyboardHeightFromInsets()
        
        // 键盘高度没有变化，不重复通知
        if (keyboardHeight == lastKeyboardHeight) {
            return
        }
        
        lastKeyboardHeight = keyboardHeight
        
        KuiklyRenderLog.d(KRKeyboardModule.MODULE_NAME, 
            "Keyboard height changed: $keyboardHeight")
        
        notifyKeyboardHeightChanged(keyboardHeight)
    }

    /**
     * 设置 WindowInsets 监听器
     */
    private fun setupWindowInsetsListener() {
        ViewCompat.setOnApplyWindowInsetsListener(rootView) { _, insets ->
            // 这里可以处理 WindowInsets 变化，但主要逻辑在 onGlobalLayout 中
            insets
        }
    }

    /**
     * 使用 WindowInsets 获取键盘高度
     * 对齐 Compose 的 WindowInsets.ime 方案
     */
    private fun getKeyboardHeightFromInsets(): Int {
        return try {
            val insets = ViewCompat.getRootWindowInsets(rootView)
            val imeInsets = insets?.getInsets(WindowInsetsCompat.Type.ime())
            imeInsets?.bottom ?: 0
        } catch (e: Exception) {
            KuiklyRenderLog.e(KRKeyboardModule.MODULE_NAME, "getKeyboardHeightFromInsets: " + e.message)
            0
        }
    }

    /**
     * 获取配置的哈希值，用于检测配置变化
     */
    private fun getConfigurationHash(config: Configuration): Int {
        return config.orientation.hashCode() + 
               config.screenWidthDp.hashCode() + 
               config.screenHeightDp.hashCode()
    }

    /**
     * 重置键盘状态
     */
    private fun resetKeyboardState() {
        lastVisibleHeight = -1
        lastKeyboardHeight = -1
        isInitialized = false
    }

    fun addListener(listener: KeyboardStatusListener) {
        listeners.add(listener)
    }

    fun removeListener(listener: KeyboardStatusListener) {
        listeners.remove(listener)
    }

    private fun notifyKeyboardHeightChanged(height: Int) {
        listeners.forEach {
            it.onHeightChanged(height)
        }
    }

    fun destroy() {
        // 移除监听器，避免内存泄露
        rootView.viewTreeObserver.removeOnGlobalLayoutListener(this)
        listeners.clear()
    }

}

/**
 * 键盘状态监听相关回调
 */
interface KeyboardStatusListener {
    fun onHeightChanged(height: Int)
}