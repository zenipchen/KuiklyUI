/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tencent.kuikly.compose.ui.graphics

import androidx.compose.runtime.Immutable
import com.tencent.kuikly.compose.ui.CanvasContextEx
import com.tencent.kuikly.compose.ui.KuiklyCanvas
import com.tencent.kuikly.compose.ui.getDensity

/**
 * Effect applied to the geometry of a drawing primitive. For example, this can be used
 * to draw shapes as a dashed or shaped pattern, or apply a treatment around line segment
 * intersections.
 */
interface PathEffect {


    fun applyTo(canvas: CanvasContextEx?) {
        applyToImpl(this, canvas)
    }

    private fun applyToImpl(effect: PathEffect, canvas: CanvasContextEx?) {
        if (effect is DashPathEffectImpl) {
            canvas?.setLineDash(effect.intervals.map { it / canvas.getDensity() })
        } else if (effect is CornerPathEffectImpl) {
            canvas?.setLineCorner(effect.radius / canvas.getDensity())
        } else if (effect is ChainPathEffectImpl) {
            applyToImpl(effect.inner, canvas)
            applyToImpl(effect.outer, canvas)
        }
    }

    companion object {

        /**
         * Replaces sharp angles between line segments into rounded angles of the specified radius
         *
         * @param radius Rounded corner radius to apply for each angle of the drawn shape
         */
        fun cornerPathEffect(radius: Float): PathEffect = actualCornerPathEffect(radius)

        /**
         * Draws a shape as a series of dashes with the given intervals and offset into the specified
         * interval array. The intervals must contain an even number of entries (>=2). The even indices
         * specify "on" intervals and the odd indices represent "off" intervals. The phase parameter
         * is the pixel offset into the intervals array (mod the sum of all of the intervals).
         *
         * For example: if `intervals[] = {10, 20}`, and phase = 25, this will set up a dashed
         * path like so: 5 pixels off 10 pixels on 20 pixels off 10 pixels on 20 pixels off
         *
         * The phase parameter is
         * an offset into the intervals array. The intervals array
         * controls the length of the dashes. This is only applied for stroked shapes
         * (ex. [PaintingStyle.Stroke] and is ignored for filled in shapes (ex. [PaintingStyle.Fill]
         *
         * @param intervals Array of "on" and "off" distances for the dashed line segments
         * @param phase Pixel offset into the intervals array
         */
        fun dashPathEffect(intervals: FloatArray, phase: Float = 0f): PathEffect =
            actualDashPathEffect(intervals, phase)

        /**
         * Create a PathEffect that applies the inner effect to the path, and then applies the outer
         * effect to the result of the inner effect. (e.g. outer(inner(path)).
         */
        fun chainPathEffect(outer: PathEffect, inner: PathEffect): PathEffect =
            actualChainPathEffect(outer, inner)

        /**
         * Dash the drawn path by stamping it with the specified shape represented as a [Path].
         * This is only applied to stroke shapes and will be ignored with filled shapes.
         * The stroke width used with this [PathEffect] is ignored as well.
         *
         * @param shape Path to stamp along
         * @param advance Spacing between each stamped shape
         * @param phase Amount to offset before the first shape is stamped
         * @param style How to transform the shape at each position as it is stamped
         */
//        fun stampedPathEffect(
//            shape: Path,
//            advance: Float,
//            phase: Float,
//            style: StampedPathEffectStyle
//        ): PathEffect = actualStampedPathEffect(shape, advance, phase, style)
    }
}

/**
 * 圆角路径效果实现类（成员公开）
 * @property radius 圆角半径
 */
@Immutable
public class CornerPathEffectImpl(
    public val radius: Float
) : PathEffect {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is CornerPathEffectImpl) return false
        return radius == other.radius
    }

    override fun hashCode(): Int {
        return radius.hashCode()
    }

    override fun toString(): String {
        return "CornerPathEffectImpl(radius=$radius)"
    }
}

/**
 * 虚线路径效果实现类（成员公开）
 * @property intervals 交替的线段长度和间隔长度数组
 * @property phase 起始偏移量
 */
@Immutable
public class DashPathEffectImpl(
    public val intervals: FloatArray,
    public val phase: Float
) : PathEffect {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DashPathEffectImpl) return false
        return intervals.contentEquals(other.intervals) && phase == other.phase
    }

    override fun hashCode(): Int {
        var result = intervals.contentHashCode()
        result = 31 * result + phase.hashCode()
        return result
    }

    override fun toString(): String {
        return "DashPathEffectImpl(intervals=${intervals.contentToString()}, phase=$phase)"
    }
}

/**
 * 组合路径效果实现类（成员公开）
 * @property outer 外层路径效果
 * @property inner 内层路径效果
 */
class ChainPathEffectImpl(
    val outer: PathEffect,
    val inner: PathEffect
) : PathEffect {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ChainPathEffectImpl) return false
        return outer == other.outer && inner == other.inner
    }

    override fun hashCode(): Int {
        return 31 * outer.hashCode() + inner.hashCode()
    }

    override fun toString(): String {
        return "ChainPathEffectImpl(outer=$outer, inner=$inner)"
    }
}

/**
 * 印章路径效果实现类（成员公开）
 * @property shape 用于重复绘制的形状路径
 * @property advance 两个形状之间的距离
 * @property phase 起始偏移量
 * @property style 形状的对齐方式
 */
@Immutable
public class StampedPathEffectImpl(
    public val shape: Path,
    public val advance: Float,
    public val phase: Float,
    public val style: StampedPathEffectStyle
) : PathEffect {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is StampedPathEffectImpl) return false
        return shape == other.shape &&
                advance == other.advance &&
                phase == other.phase &&
                style == other.style
    }

    override fun hashCode(): Int {
        var result = shape.hashCode()
        result = 31 * result + advance.hashCode()
        result = 31 * result + phase.hashCode()
        result = 31 * result + style.hashCode()
        return result
    }

    override fun toString(): String {
        return "StampedPathEffectImpl(shape=$shape, advance=$advance, phase=$phase, style=$style)"
    }
}

/**
 * 创建并记忆圆角路径效果
 */
fun actualCornerPathEffect(radius: Float): CornerPathEffectImpl {
    return CornerPathEffectImpl(radius)
}

/**
 * 创建并记忆虚线路径效果
 */
fun actualDashPathEffect(intervals: FloatArray, phase: Float): DashPathEffectImpl {
    val intervalsCopy = intervals.copyOf() // 保护性复制，避免外部修改
    return DashPathEffectImpl(intervalsCopy, phase)
}

/**
 * 创建并记忆组合路径效果
 */
fun actualChainPathEffect(outer: PathEffect, inner: PathEffect): ChainPathEffectImpl {
    return ChainPathEffectImpl(outer, inner)
}

/**
 * 创建并记忆印章路径效果
 */
fun actualStampedPathEffect(
    shape: Path,
    advance: Float,
    phase: Float,
    style: StampedPathEffectStyle
): StampedPathEffectImpl {
   return StampedPathEffectImpl(shape, advance, phase, style)
}


/**
 * Strategy for transforming each point of the shape along the drawn path
 *
 * @sample androidx.compose.ui.graphics.samples.StampedPathEffectSample
 */
@Immutable
@kotlin.jvm.JvmInline
value class StampedPathEffectStyle internal constructor(
    @Suppress("unused") private val value: Int
) {

    companion object {
        /**
         * Translate the path shape into the specified location aligning the top left of the path with
         * the drawn geometry. This does not modify the path itself.
         *
         * For example, a circle drawn with a square path and [Translate] will draw the square path
         * repeatedly with the top left corner of each stamped square along the curvature of the circle.
         */
        val Translate = StampedPathEffectStyle(0)

        /**
         * Rotates the path shape its center along the curvature of the drawn geometry. This does not
         * modify the path itself.
         *
         * For example, a circle drawn with a square path and [Rotate] will draw the square path
         * repeatedly with the center of each stamped square along the curvature of the circle as well
         * as each square being rotated along the circumference.
         */
        val Rotate = StampedPathEffectStyle(1)

        /**
         * Modifies the points within the path such that they fit within the drawn geometry. This will
         * turn straight lines into curves.
         *
         * For example, a circle drawn with a square path and [Morph] will modify the straight lines
         * of the square paths to be curves such that each stamped square is rendered as an arc around
         * the curvature of the circle.
         */
        val Morph = StampedPathEffectStyle(2)
    }

    override fun toString() = when (this) {
        Translate -> "Translate"
        Rotate -> "Rotate"
        Morph -> "Morph"
        else -> "Unknown"
    }
}
