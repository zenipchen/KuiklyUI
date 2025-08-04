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

package com.tencent.kuikly.demo.pages.compose

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.foundation.Canvas
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.border
import com.tencent.kuikly.compose.foundation.clickable
import com.tencent.kuikly.compose.foundation.focusable
import com.tencent.kuikly.compose.foundation.gestures.detectHorizontalDragGestures
import com.tencent.kuikly.compose.foundation.gestures.detectTapGestures
import com.tencent.kuikly.compose.foundation.layout.Arrangement
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.Row
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
import com.tencent.kuikly.compose.foundation.layout.height
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.layout.size
import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
import com.tencent.kuikly.compose.foundation.text.BasicTextField
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.draw.alpha
import com.tencent.kuikly.compose.ui.draw.clipToBounds
import com.tencent.kuikly.compose.ui.draw.drawBehind
import com.tencent.kuikly.compose.ui.geometry.Offset
import com.tencent.kuikly.compose.ui.geometry.Rect
import com.tencent.kuikly.compose.ui.geometry.Size
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.graphics.Path
import com.tencent.kuikly.compose.ui.graphics.PathEffect
import com.tencent.kuikly.compose.ui.graphics.StrokeCap
import com.tencent.kuikly.compose.ui.graphics.StrokeJoin
import com.tencent.kuikly.compose.ui.graphics.drawscope.Fill
import com.tencent.kuikly.compose.ui.graphics.drawscope.Stroke
import com.tencent.kuikly.compose.ui.input.pointer.pointerInput
import com.tencent.kuikly.compose.ui.platform.LocalFocusManager
import com.tencent.kuikly.compose.ui.text.font.FontWeight
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page

@Page("PathEffectDemo")
class PathEffectDemo : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {

            Box(modifier = Modifier.padding(top = 50.dp).size(120.dp)){

                val localFocusManager = LocalFocusManager.current
                Column(modifier = Modifier.size(100.dp).background(Color.Yellow).pointerInput(
                    Unit
                ){
//                    detectTapGestures(
//                        onPress = {
//                            println("PathEffectDemo onTap Click")
//                        }
//                    )
                }) {
                    BasicTextField(
                        enabled = true,
                        modifier = Modifier.fillMaxSize(),
                        value = "123",
                        onValueChange = {

                        }
                    )
                }

                Column(modifier = Modifier.size(110.dp).background(Color.Green).clipToBounds().alpha(0.7f)
                    .focusable(true)
                    .clickable {
                        println("PathEffectDemo Click")
                        localFocusManager.clearFocus()
                    }
                ) {

                }
            }

//            ComposeNavigationBar {
//                LazyColumn(
//                    modifier = Modifier.fillMaxSize().background(Color.White),
//                ) {
//                    item {
//                        DashPathEffectDemo()
//                    }
//                    item {
//                        CornerPathEffectDemo()
//                    }
//                    item {
//                        DiscretePathEffectDemo()
//                    }
//                    item {
//                        PathDashPathEffectDemo()
//                    }
//                    item {
//                        SumPathEffectDemo()
//                    }
//                    item {
//                        ComposePathEffectDemo()
//                    }
//                    item {
//                        InteractivePathEffectDemo()
//                    }
//                }
//            }
        }
    }

    @Composable
    fun DashPathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "DashPathEffect 虚线效果演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // 1. 基本虚线效果
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp)
                    .background(Color.LightGray)
                    .drawBehind {
                        drawLine(
                            color = Color.Blue,
                            start = Offset(50f, 30f),
                            end = Offset(300f, 30f),
                            strokeWidth = 4f,
                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(20f, 10f))
                        )
                    }
            ) {
            }

            // 2. 不同虚线间隔
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                listOf(
                    floatArrayOf(10f, 5f) to "短虚线",
                    floatArrayOf(30f, 15f) to "长虚线",
                    floatArrayOf(5f, 20f) to "点线",
                    floatArrayOf(20f, 10f, 5f, 10f) to "复杂虚线"
                ).forEach { (dashArray, label) ->
                    Canvas(
                        modifier = Modifier
                            .size(80.dp, 60.dp)
                            .background(Color.White)
                            .border(1.dp, Color.Gray)
                            .drawBehind {
                                drawLine(
                                    color = Color.Red,
                                    start = Offset(10f, 30f),
                                    end = Offset(70f, 30f),
                                    strokeWidth = 3f,
                                    pathEffect = PathEffect.dashPathEffect(dashArray)
                                )
                            }
                    ) {
                    }
                }
            }

            // 3. 圆形虚线
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .background(Color.LightGray)
                    .drawBehind {
                        drawPath(
                            path = Path().apply {
                                addOval(Rect(50f, 20f, 250f, 80f))
                            },
                            color = Color.Green,
                            style = Fill,
//                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(15f, 8f))
                        )
                    }
            ) {
            }
        }
    }

    @Composable
    fun CornerPathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "CornerPathEffect 圆角效果演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // 1. 不同圆角半径的矩形
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                listOf(5f, 15f, 25f, 35f).forEach { radius ->
                    Box(
                        modifier = Modifier
                            .size(80.dp, 60.dp)
                            .background(Color.White)
                            .border(1.dp, Color.Gray)
                            .drawBehind {
                                drawRect(
                                    color = Color.Blue,
                                    topLeft = Offset(10f, 10f),
                                    size = Size(60f, 40f),
//                                    pathEffect = PathEffect.cornerPathEffect(radius)
                                )
                            }
                    ) {
                        Text("R$radius", fontSize = 12.sp, modifier = Modifier.padding(4.dp))
                    }
                }
            }

            // 2. 圆角路径
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(80.dp)
                    .background(Color.LightGray)
                    .drawBehind {
                        val path = Path().apply {
                            moveTo(50f, 20f)
                            lineTo(200f, 20f)
                            lineTo(200f, 60f)
                            lineTo(50f, 60f)
                            close()
                        }
                        drawPath(
                            path = path,
                            color = Color.Red,
                            style = Stroke(width = 4f, pathEffect = PathEffect.cornerPathEffect(20f)),
                        )
                    }
            ) {
            }
        }
    }

    @Composable
    fun DiscretePathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "DiscretePathEffect 离散效果演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // 1. 不同离散程度的直线
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                listOf(2f, 5f, 8f, 12f).forEach { segmentLength ->
                    Box(
                        modifier = Modifier
                            .size(80.dp, 60.dp)
                            .background(Color.White)
                            .border(1.dp, Color.Gray)
                            .drawBehind {
                                drawLine(
                                    color = Color.Green,
                                    start = Offset(10f, 30f),
                                    end = Offset(70f, 30f),
                                    strokeWidth = 3f,
//                                    pathEffect = PathEffect.discretePathEffect(segmentLength, 0f)
                                )
                            }
                    ) {
                        Text("S$segmentLength", fontSize = 12.sp, modifier = Modifier.padding(4.dp))
                    }
                }
            }

//            // 2. 不同偏移量的离散效果
//            Box(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .height(100.dp)
//                    .background(Color.LightGray)
//                    .drawBehind {
//                        val path = Path().apply {
//                            moveTo(50f, 20f)
//                            quadraticBezierTo(150f, 20f, 250f, 80f)
//                        }
//                        drawPath(
//                            path = path,
//                            color = Color.Purple,
//                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 4f),
//                            pathEffect = PathEffect.discretePathEffect(8f, 5f)
//                        )
//                    }
//            ) {
//                Text("离散曲线", modifier = Modifier.padding(8.dp))
//            }
        }
    }

    @Composable
    fun PathDashPathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "PathDashPathEffect 路径虚线效果演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // 1. 不同形状的路径虚线
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 圆形虚线
                Box(
                    modifier = Modifier
                        .size(80.dp, 60.dp)
                        .background(Color.White)
                        .border(1.dp, Color.Gray)
                        .drawBehind {
                            val dashPath = Path().apply {
                                addOval(Rect(0f, 0f, 8f, 8f))
                            }
                            drawLine(
                                color = Color.Blue,
                                start = Offset(10f, 30f),
                                end = Offset(70f, 30f),
                                strokeWidth = 3f,
//                                pathEffect = PathEffect.pathDashPathEffect(dashPath, 20f, 0f, PathDashPathEffect.Style.Translate)
                            )
                        }
                ) {
                    Text("圆形", fontSize = 12.sp, modifier = Modifier.padding(4.dp))
                }

                // 方形虚线
//                Box(
//                    modifier = Modifier
//                        .size(80.dp, 60.dp)
//                        .background(Color.White)
//                        .border(1.dp, Color.Gray)
//                        .drawBehind {
//                            val dashPath = Path().apply {
//                                addRect(androidx.compose.ui.geometry.Rect(0f, 0f, 8f, 8f))
//                            }
//                            drawLine(
//                                color = Color.Red,
//                                start = Offset(10f, 30f),
//                                end = Offset(70f, 30f),
//                                strokeWidth = 3f,
//                                pathEffect = PathEffect.pathDashPathEffect(dashPath, 20f, 0f, PathDashPathEffect.Style.Translate)
//                            )
//                        }
//                ) {
//                    Text("方形", fontSize = 12.sp, modifier = Modifier.padding(4.dp))
//                }

//                // 三角形虚线
//                Box(
//                    modifier = Modifier
//                        .size(80.dp, 60.dp)
//                        .background(Color.White)
//                        .border(1.dp, Color.Gray)
//                        .drawBehind {
//                            val dashPath = Path().apply {
//                                moveTo(4f, 0f)
//                                lineTo(8f, 8f)
//                                lineTo(0f, 8f)
//                                close()
//                            }
//                            drawLine(
//                                color = Color.Green,
//                                start = Offset(10f, 30f),
//                                end = Offset(70f, 30f),
//                                strokeWidth = 3f,
//                                pathEffect = PathEffect.pathDashPathEffect(dashPath, 20f, 0f, PathDashPathEffect.Style.Translate)
//                            )
//                        }
//                ) {
//                    Text("三角形", fontSize = 12.sp, modifier = Modifier.padding(4.dp))
//                }
            }
        }
    }

    @Composable
    fun SumPathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "SumPathEffect 组合效果演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // 1. 虚线 + 圆角
//            Box(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .height(60.dp)
//                    .background(Color.LightGray)
//                    .drawBehind {
//                        val dashEffect = PathEffect.dashPathEffect(floatArrayOf(15f, 8f))
//                        val cornerEffect = PathEffect.cornerPathEffect(10f)
//                        val sumEffect = PathEffect.sumPathEffect(dashEffect, cornerEffect)
//
//                        drawLine(
//                            color = Color.Blue,
//                            start = Offset(50f, 30f),
//                            end = Offset(300f, 30f),
//                            strokeWidth = 4f,
//                            pathEffect = sumEffect
//                        )
//                    }
//            ) {
//                Text("虚线 + 圆角", modifier = Modifier.padding(8.dp))
//            }

            // 2. 离散 + 圆角
//            Box(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .height(80.dp)
//                    .background(Color.LightGray)
//                    .drawBehind {
//                        val discreteEffect = PathEffect.discretePathEffect(5f, 2f)
//                        val cornerEffect = PathEffect.cornerPathEffect(15f)
//                        val sumEffect = PathEffect.sumPathEffect(discreteEffect, cornerEffect)
//
//                        val path = Path().apply {
//                            moveTo(50f, 20f)
//                            lineTo(200f, 20f)
//                            lineTo(200f, 60f)
//                            lineTo(50f, 60f)
//                            close()
//                        }
//                        drawPath(
//                            path = path,
//                            color = Color.Red,
//                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 4f),
//                            pathEffect = sumEffect
//                        )
//                    }
//            ) {
//                Text("离散 + 圆角", modifier = Modifier.padding(8.dp))
//            }
        }
    }

    @Composable
    fun ComposePathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "ComposePathEffect 组合效果演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

//            // 1. 外层虚线 + 内层圆角
//            Box(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .height(60.dp)
//                    .background(Color.LightGray)
//                    .drawBehind {
//                        val outerEffect = PathEffect.dashPathEffect(floatArrayOf(20f, 10f))
//                        val innerEffect = PathEffect.cornerPathEffect(8f)
//                        val composeEffect = PathEffect.composePathEffect(outerEffect, innerEffect)
//
//                        drawLine(
//                            color = Color.Purple,
//                            start = Offset(50f, 30f),
//                            end = Offset(300f, 30f),
//                            strokeWidth = 4f,
//                            pathEffect = composeEffect
//                        )
//                    }
//            ) {
//                Text("外层虚线 + 内层圆角", modifier = Modifier.padding(8.dp))
//            }

            // 2. 外层离散 + 内层圆角
//            Box(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .height(80.dp)
//                    .background(Color.LightGray)
//                    .drawBehind {
//                        val outerEffect = PathEffect.discretePathEffect(6f, 3f)
//                        val innerEffect = PathEffect.cornerPathEffect(12f)
//                        val composeEffect = PathEffect.composePathEffect(outerEffect, innerEffect)
//
//                        val path = Path().apply {
//                            moveTo(50f, 20f)
//                            lineTo(200f, 20f)
//                            lineTo(200f, 60f)
//                            lineTo(50f, 60f)
//                            close()
//                        }
//                        drawPath(
//                            path = path,
//                            color = Color.Orange,
//                            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 4f),
//                            pathEffect = composeEffect
//                        )
//                    }
//            ) {
//                Text("外层离散 + 内层圆角", modifier = Modifier.padding(8.dp))
//            }
        }
    }

    @Composable
    fun InteractivePathEffectDemo() {
        Column(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                "交互式 PathEffect 演示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            var dashLength by remember { mutableStateOf(20f) }
            var cornerRadius by remember { mutableStateOf(10f) }
            var discreteLength by remember { mutableStateOf(5f) }

            // 动态虚线效果
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp)
                    .background(Color.LightGray)
                    .drawBehind {
                        drawLine(
                            color = Color.Blue,
                            start = Offset(50f, 30f),
                            end = Offset(300f, 30f),
                            strokeWidth = 4f,
                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(dashLength, dashLength / 2))
                        )
                    }
            ) {
                Text("虚线长度: ${dashLength.toInt()}", modifier = Modifier.padding(8.dp))
            }

            // 控制按钮
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    "虚线长度",
                    modifier = Modifier
                        .background(Color.Blue)
                        .padding(8.dp)
                        .pointerInput(Unit) {
                            detectHorizontalDragGestures { _, dragAmount ->
                                dashLength = (dashLength + dragAmount).coerceIn(5f, 50f)
                            }
                        },
                    color = Color.White
                )

                Text(
                    "圆角半径",
                    modifier = Modifier
                        .background(Color.Red)
                        .padding(8.dp)
                        .pointerInput(Unit) {
                            detectHorizontalDragGestures { _, dragAmount ->
                                cornerRadius = (cornerRadius + dragAmount).coerceIn(0f, 30f)
                            }
                        },
                    color = Color.White
                )

                Text(
                    "离散长度",
                    modifier = Modifier
                        .background(Color.Green)
                        .padding(8.dp)
                        .pointerInput(Unit) {
                            detectHorizontalDragGestures { _, dragAmount ->
                                discreteLength = (discreteLength + dragAmount).coerceIn(1f, 20f)
                            }
                        },
                    color = Color.White
                )
            }
        }
    }
}


@Composable
fun PathEffectSection(
    title: String,
    pathEffect: PathEffect
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            title,
            modifier = Modifier.padding(bottom = 4.dp)
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(80.dp)
                .background(Color(0xFFF5F5F5))
        ) {
            Canvas(
                modifier = Modifier.fillMaxSize()
            ) {
                val path = Path().apply {
                    moveTo(50f, 20f)
                    lineTo(150f, 20f)
                    lineTo(200f, 60f)
                    lineTo(250f, 20f)
                    lineTo(350f, 20f)
                }

                drawPath(
                    path = path,
                    color = Color.Blue,
                    style = Stroke(
                        width = 8f,
                        pathEffect = pathEffect,
                        cap = StrokeCap.Round,
                        join = StrokeJoin.Round
                    )
                )
            }
        }
    }
}