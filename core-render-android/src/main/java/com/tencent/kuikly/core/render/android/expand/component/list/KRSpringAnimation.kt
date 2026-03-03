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

package com.tencent.kuikly.core.render.android.expand.component.list

import android.animation.ValueAnimator
import android.view.animation.LinearInterpolator
import com.tencent.kuikly.core.render.android.adapter.KuiklyRenderLog

internal class KRSpringAnimation(
    startValue: Float,
    val endValue: Float,
    velocity: Float,
    val stiffness: Float,
    dampingRatio: Float
): KRScrollAnimation() {
    private var currentValue = startValue
    private var currentVelocity = velocity
    private var lastTime = 0L
    private val mass = 1f
    private var frameCount = 0
    // c = 2 * m * sqrt(k/m) * zeta = 2 * sqrt(m*k) * zeta
    private val dampingCoefficient = 2f * kotlin.math.sqrt((mass * stiffness).toDouble()).toFloat() * dampingRatio

    init {
        KuiklyRenderLog.d("SpringAnim", "[INIT] start=$startValue end=$endValue velocity=$velocity stiffness=$stiffness damping=$dampingRatio")
    }

    private val animator = ValueAnimator.ofFloat(0f, 1f).apply {
        duration = 100000L // Long enough
        repeatCount = ValueAnimator.INFINITE
        interpolator = LinearInterpolator()
        addUpdateListener {
            val currentTime = System.currentTimeMillis()
            if (lastTime == 0L) {
                lastTime = currentTime
                return@addUpdateListener
            }
            var dt = (currentTime - lastTime) / 1000f
            lastTime = currentTime

            // Cap dt to avoid instability in case of long pauses (e.g. backgrounding)
            if (dt > 0.064f) dt = 0.064f

            // Semi-implicit Euler integration
            // F = -k * x - c * v
            val displacement = currentValue - endValue
            val force = -stiffness * displacement - dampingCoefficient * currentVelocity
            val acceleration = force / mass

            currentVelocity += acceleration * dt
            currentValue += currentVelocity * dt
            frameCount++

            // 每10帧或关键状态打印日志
            if (frameCount % 10 == 1 || kotlin.math.abs(currentValue - endValue) < 5f || kotlin.math.abs(currentVelocity) > 1000f) {
                KuiklyRenderLog.d("SpringAnim", "[FRAME#$frameCount] dt=${dt}s value=$currentValue target=$endValue vel=$currentVelocity acc=$acceleration displacement=$displacement")
            }

            onUpdate(currentValue)

            // End condition: close enough and slow enough
            val distToEnd = kotlin.math.abs(currentValue - endValue)
            if (distToEnd < 0.5f && kotlin.math.abs(currentVelocity) < 10f) {
                KuiklyRenderLog.d("SpringAnim", "[END] frame=$frameCount value=$currentValue target=$endValue dist=$distToEnd vel=$currentVelocity")
                cancel()
                onUpdate(endValue)
            }
        }
        addListener(object : android.animation.Animator.AnimatorListener {
            override fun onAnimationCancel(animation: android.animation.Animator) {
                onEnd()
            }

            override fun onAnimationEnd(animation: android.animation.Animator) {
                onEnd()
            }

            override fun onAnimationRepeat(animation: android.animation.Animator) {}
            override fun onAnimationStart(animation: android.animation.Animator) {}
        })
    }

    override var onUpdate: (Float) -> Unit = {}
    override var onEnd: () -> Unit = {}

    override fun start() {
        lastTime = 0L
        frameCount = 0
        KuiklyRenderLog.d("SpringAnim", "[START] animator started")
        animator.start()
    }

    override fun cancel() {
        KuiklyRenderLog.d("SpringAnim", "[CANCEL] frame=$frameCount value=$currentValue target=$endValue vel=$currentVelocity")
        animator.cancel()
    }
}