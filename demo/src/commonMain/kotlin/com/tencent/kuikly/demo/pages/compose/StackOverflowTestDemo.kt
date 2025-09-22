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
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.clickable
import com.tencent.kuikly.compose.foundation.layout.Arrangement
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.Row
import com.tencent.kuikly.compose.foundation.layout.Spacer
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
import com.tencent.kuikly.compose.foundation.layout.height
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.layout.width
import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.text.SpanStyle
import com.tencent.kuikly.compose.ui.text.buildAnnotatedString
import com.tencent.kuikly.compose.ui.text.font.FontWeight
import com.tencent.kuikly.compose.ui.text.withStyle
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

@Page("StackOverflowTestDemo")
class StackOverflowTestDemo : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            ComposeNavigationBar {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().background(Color.White).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        Text(
                            "StackOverflowError 极限测试",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                    }
                    
                    item {
                        TextParamsTest()
                    }
                    
                    item {
                        LayoutDepthTest()
                    }
                    
                    item {
                        NestedTextTest()
                    }
                }
            }
        }
    }

    @Composable
    private fun TextParamsTest() {
        var paramCount by remember { mutableStateOf(10) }
        var isRunning by remember { mutableStateOf(false) }
        var result by remember { mutableStateOf("未测试") }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFE3F2FD))
                .padding(16.dp)
        ) {
            Text(
                "1. Text组件入参个数测试",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Text("当前参数个数: $paramCount")
            Text("测试结果: $result")

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // 快速设置按钮
                listOf(10, 50, 100, 500, 1000, 2000).forEach { count ->
                    Text(
                        "${count}个",
                        modifier = Modifier
                            .background(
                                if (paramCount == count) Color.Green else Color.Gray
                            )
                            .padding(8.dp)
                            .clickable {
                                paramCount = count
                                result = "未测试"
                            },
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    "测试",
                    modifier = Modifier
                        .background(if (isRunning) Color.Red else Color.Blue)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                isRunning = true
                                result = "测试中..."
                                // 调用非Compose函数进行测试
                                val testResult = testTextParamsWithResult(paramCount)
                                result = testResult
                                isRunning = false
                            }
                        },
                    color = Color.White
                )

                Text(
                    "递增测试",
                    modifier = Modifier
                        .background(Color.Red)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                paramCount += 100
                                result = "未测试"
                            }
                        },
                    color = Color.White
                )
            }

        }
    }

    @Composable
    private fun LayoutDepthTest() {
        var depth by remember { mutableStateOf(10) }
        var paramCount by remember { mutableStateOf(1) }
        var layoutType by remember { mutableStateOf("Box") }
        var isRunning by remember { mutableStateOf(false) }
        var result by remember { mutableStateOf("未测试") }
        var showTestLayout by remember { mutableStateOf(false) }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFE8F5E8))
                .padding(16.dp)
        ) {
            Text(
                "2. 布局深度测试 (Box嵌套)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Text("当前深度: $depth")
            Text("参数个数: $paramCount")
            Text("布局类型: $layoutType")
            Text("测试结果: $result")

            // 深度控制
            Text("深度控制:", fontSize = 14.sp, fontWeight = FontWeight.Medium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(10, 50, 100, 200, 500, 1000).forEach { d ->
                    Text(
                        "深度$d",
                        modifier = Modifier
                            .background(
                                if (depth == d) Color.Green else Color.Gray
                            )
                            .padding(8.dp)
                            .clickable {
                                depth = d
                                result = "未测试"
                                showTestLayout = false
                            },
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 布局类型控制
            Text("布局类型控制:", fontSize = 14.sp, fontWeight = FontWeight.Medium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Box", "Row", "Column").forEach { type ->
                    Text(
                        type,
                        modifier = Modifier
                            .background(
                                if (layoutType == type) Color.Red else Color.LightGray
                            )
                            .padding(8.dp)
                            .clickable {
                                layoutType = type
                                result = "未测试"
                                showTestLayout = false
                            },
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 参数个数控制
            Text("参数个数控制:", fontSize = 14.sp, fontWeight = FontWeight.Medium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                (1..10).forEach { count ->
                    Text(
                        "$count",
                        modifier = Modifier
                            .background(
                                if (paramCount == count) Color.Blue else Color.LightGray
                            )
                            .padding(8.dp)
                            .clickable {
                                paramCount = count
                                result = "未测试"
                                showTestLayout = false
                            },
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    "渲染测试",
                    modifier = Modifier
                        .background(if (isRunning) Color.Red else Color.Blue)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                isRunning = true
                                result = "渲染中..."
                                showTestLayout = true
                                // 延迟重置状态，给渲染一些时间
                                GlobalScope.launch {
                                    kotlinx.coroutines.delay(100)
                                    isRunning = false
                                    result = "渲染完成: 深度 $depth, 参数 $paramCount, 布局 $layoutType"
                                }
                            }
                        },
                    color = Color.White
                )

                Text(
                    "递增深度",
                    modifier = Modifier
                        .background(Color.Red)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                depth += 1
                                result = "未测试"
                                showTestLayout = false
                            }
                        },
                    color = Color.White
                )

                Text(
                    "递增参数",
                    modifier = Modifier
                        .background(Color.Red)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                paramCount = (paramCount + 1).coerceAtMost(10)
                                result = "未测试"
                                showTestLayout = false
                            }
                        },
                    color = Color.White
                )
            }

            // 显示测试的嵌套布局
            if (showTestLayout) {
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(8.dp)
                ) {
                    createNestedLayout(depth, paramCount, layoutType)
                }
            }

        }
    }

    @Composable
    private fun NestedTextTest() {
        var textCount by remember { mutableStateOf(10) }
        var isRunning by remember { mutableStateOf(false) }
        var result by remember { mutableStateOf("未测试") }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFFFF3E0))
                .padding(16.dp)
        ) {
            Text(
                "3. 嵌套Text组件测试",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Text("当前Text数量: $textCount")
            Text("测试结果: $result")

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(10, 50, 100, 200, 500).forEach { count ->
                    Text(
                        "${count}个",
                        modifier = Modifier
                            .background(
                                if (textCount == count) Color.Green else Color.Gray
                            )
                            .padding(8.dp)
                            .clickable {
                                textCount = count
                                result = "未测试"
                            },
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    "测试",
                    modifier = Modifier
                        .background(if (isRunning) Color.Red else Color.Blue)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                isRunning = true
                                result = "测试中..."
                                // 调用非Compose函数进行测试
                                val testResult = testNestedTextsWithResult(textCount)
                                result = testResult
                                isRunning = false
                            }
                        },
                    color = Color.White
                )

                Text(
                    "递增测试",
                    modifier = Modifier
                        .background(Color.Red)
                        .padding(8.dp)
                        .clickable {
                            if (!isRunning) {
                                textCount += 50
                                result = "未测试"
                            }
                        },
                    color = Color.White
                )
            }

        }
    }

    // 非Compose函数，用于测试StackOverflowError并返回结果
    private fun testTextParamsWithResult(paramCount: Int): String {
        return try {
            // 创建大量字符串拼接来测试StackOverflowError
            var result = ""
            repeat(paramCount) { i ->
                result += "参数$i "
            }
            "成功: $paramCount 个参数"
        } catch (e: Error) {
            "StackOverflowError: $paramCount 个参数"
        } catch (e: Exception) {
            "其他错误: ${e.message}"
        }
    }

    private fun testLayoutDepthWithResult(depth: Int, paramCount: Int): String {
        return try {
            // 递归函数测试深度，支持多个参数
            testLayoutDepthRecursive(depth, paramCount)
            "成功: 深度 $depth, 参数 $paramCount"
        } catch (e: Error) {
            "StackOverflowError: 深度 $depth, 参数 $paramCount"
        } catch (e: Exception) {
            "其他错误: ${e.message}"
        }
    }

    private fun testNestedTextsWithResult(count: Int): String {
        return try {
            // 递归函数测试嵌套
            testNestedTextsRecursive(count)
            "成功: $count 个Text"
        } catch (e: Error) {
            "StackOverflowError: $count 个Text"
        } catch (e: Exception) {
            "其他错误: ${e.message}"
        }
    }

    // 纯递归函数，用于触发StackOverflowError，支持多个参数
    private fun testLayoutDepthRecursive(depth: Int, paramCount: Int) {
        if (depth <= 0) return
        
        // 根据参数个数调用不同参数数量的函数
        when (paramCount) {
            1 -> testLayoutDepthRecursive1(depth - 1)
            2 -> testLayoutDepthRecursive2(depth - 1, depth - 1)
            3 -> testLayoutDepthRecursive3(depth - 1, depth - 1, depth - 1)
            4 -> testLayoutDepthRecursive4(depth - 1, depth - 1, depth - 1, depth - 1)
            5 -> testLayoutDepthRecursive5(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            6 -> testLayoutDepthRecursive6(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            7 -> testLayoutDepthRecursive7(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            8 -> testLayoutDepthRecursive8(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            9 -> testLayoutDepthRecursive9(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            10 -> testLayoutDepthRecursive10(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
        }
    }

    // 1个参数的递归函数
    private fun testLayoutDepthRecursive1(depth: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive1(depth - 1)
    }

    // 2个参数的递归函数
    private fun testLayoutDepthRecursive2(depth: Int, param2: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive2(depth - 1, param2 - 1)
    }

    // 3个参数的递归函数
    private fun testLayoutDepthRecursive3(depth: Int, param2: Int, param3: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive3(depth - 1, param2 - 1, param3 - 1)
    }

    // 4个参数的递归函数
    private fun testLayoutDepthRecursive4(depth: Int, param2: Int, param3: Int, param4: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive4(depth - 1, param2 - 1, param3 - 1, param4 - 1)
    }

    // 5个参数的递归函数
    private fun testLayoutDepthRecursive5(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive5(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1)
    }

    // 6个参数的递归函数
    private fun testLayoutDepthRecursive6(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive6(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1)
    }

    // 7个参数的递归函数
    private fun testLayoutDepthRecursive7(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive7(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1)
    }

    // 8个参数的递归函数
    private fun testLayoutDepthRecursive8(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive8(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1)
    }

    // 9个参数的递归函数
    private fun testLayoutDepthRecursive9(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive9(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1)
    }

    // 10个参数的递归函数
    private fun testLayoutDepthRecursive10(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int, param10: Int) {
        if (depth <= 0) return
        testLayoutDepthRecursive10(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1, param10 - 1)
    }

    private fun testNestedTextsRecursive(count: Int) {
        if (count <= 0) return
        testNestedTextsRecursive(count - 1)
    }

    @Composable
    private fun createTextWithManyParams(paramCount: Int) {
        // 创建包含大量参数的AnnotatedString
        val annotatedString = buildAnnotatedString {
            repeat(paramCount) { i ->
                withStyle(
                    SpanStyle(
                        color = Color(
                            red = (i * 10) % 255,
                            green = (i * 20) % 255,
                            blue = (i * 30) % 255
                        ),
                        fontSize = (10 + i % 20).sp
                    )
                ) {
                    append("参数$i ")
                }
            }
        }
        
        Text(
            text = annotatedString,
            fontSize = 12.sp,
            modifier = Modifier.fillMaxWidth()
        )
    }

    // 创建嵌套布局，用于测试Compose布局深度
    @Composable
    private fun createNestedLayout(depth: Int, paramCount: Int, layoutType: String) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        
        // 根据布局类型和参数个数创建不同复杂度的嵌套布局
        when (layoutType) {
            "Box" -> createNestedBoxLayout(depth, paramCount)
            "Row" -> createNestedRowLayout(depth, paramCount)
            "Column" -> createNestedColumnLayout(depth, paramCount)
        }
    }

    // 创建嵌套的Box布局，用于测试Compose布局深度
    @Composable
    private fun createNestedBoxLayout(depth: Int, paramCount: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        
        // 根据参数个数创建不同复杂度的嵌套布局
        when (paramCount) {
            1 -> createNestedBoxLayout1(depth - 1)
            2 -> createNestedBoxLayout2(depth - 1, depth - 1)
            3 -> createNestedBoxLayout3(depth - 1, depth - 1, depth - 1)
            4 -> createNestedBoxLayout4(depth - 1, depth - 1, depth - 1, depth - 1)
            5 -> createNestedBoxLayout5(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            6 -> createNestedBoxLayout6(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            7 -> createNestedBoxLayout7(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            8 -> createNestedBoxLayout8(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            9 -> createNestedBoxLayout9(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            10 -> createNestedBoxLayout10(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
        }
    }

    // 1个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout1(depth: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFE3F2FD))
                .padding(2.dp)
        ) {
            createNestedBoxLayout1(depth - 1)
        }
    }

    // 2个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout2(depth: Int, param2: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFE8F5E8))
                .padding(2.dp)
        ) {
            createNestedBoxLayout2(depth - 1, param2 - 1)
        }
    }

    // 3个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout3(depth: Int, param2: Int, param3: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFFFF3E0))
                .padding(2.dp)
        ) {
            createNestedBoxLayout3(depth - 1, param2 - 1, param3 - 1)
        }
    }

    // 4个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout4(depth: Int, param2: Int, param3: Int, param4: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFF3E5F5))
                .padding(2.dp)
        ) {
            createNestedBoxLayout4(depth - 1, param2 - 1, param3 - 1, param4 - 1)
        }
    }

    // 5个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout5(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFE0F2F1))
                .padding(2.dp)
        ) {
            createNestedBoxLayout5(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1)
        }
    }

    // 6个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout6(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFFFEBEE))
                .padding(2.dp)
        ) {
            createNestedBoxLayout6(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1)
        }
    }

    // 7个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout7(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFF1F8E9))
                .padding(2.dp)
        ) {
            createNestedBoxLayout7(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1)
        }
    }

    // 8个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout8(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFE8EAF6))
                .padding(2.dp)
        ) {
            createNestedBoxLayout8(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1)
        }
    }

    // 9个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout9(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFFCE4EC))
                .padding(2.dp)
        ) {
            createNestedBoxLayout9(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1)
        }
    }

    // 10个参数的嵌套Box布局
    @Composable
    private fun createNestedBoxLayout10(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int, param10: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Box(
            modifier = Modifier
                .background(Color(0xFFE0F7FA))
                .padding(2.dp)
        ) {
            createNestedBoxLayout10(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1, param10 - 1)
        }
    }

    // 创建嵌套的Row布局，用于测试Compose布局深度
    @Composable
    private fun createNestedRowLayout(depth: Int, paramCount: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        
        // 根据参数个数创建不同复杂度的嵌套布局
        when (paramCount) {
            1 -> createNestedRowLayout1(depth - 1)
            2 -> createNestedRowLayout2(depth - 1, depth - 1)
            3 -> createNestedRowLayout3(depth - 1, depth - 1, depth - 1)
            4 -> createNestedRowLayout4(depth - 1, depth - 1, depth - 1, depth - 1)
            5 -> createNestedRowLayout5(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            6 -> createNestedRowLayout6(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            7 -> createNestedRowLayout7(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            8 -> createNestedRowLayout8(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            9 -> createNestedRowLayout9(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            10 -> createNestedRowLayout10(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
        }
    }

    // 1个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout1(depth: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFE3F2FD))
                .padding(2.dp)
        ) {
            createNestedRowLayout1(depth - 1)
        }
    }

    // 2个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout2(depth: Int, param2: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFE8F5E8))
                .padding(2.dp)
        ) {
            createNestedRowLayout2(depth - 1, param2 - 1)
        }
    }

    // 3个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout3(depth: Int, param2: Int, param3: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFFFF3E0))
                .padding(2.dp)
        ) {
            createNestedRowLayout3(depth - 1, param2 - 1, param3 - 1)
        }
    }

    // 4个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout4(depth: Int, param2: Int, param3: Int, param4: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFF3E5F5))
                .padding(2.dp)
        ) {
            createNestedRowLayout4(depth - 1, param2 - 1, param3 - 1, param4 - 1)
        }
    }

    // 5个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout5(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFE0F2F1))
                .padding(2.dp)
        ) {
            createNestedRowLayout5(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1)
        }
    }

    // 6个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout6(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFFFEBEE))
                .padding(2.dp)
        ) {
            createNestedRowLayout6(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1)
        }
    }

    // 7个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout7(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFF1F8E9))
                .padding(2.dp)
        ) {
            createNestedRowLayout7(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1)
        }
    }

    // 8个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout8(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFE8EAF6))
                .padding(2.dp)
        ) {
            createNestedRowLayout8(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1)
        }
    }

    // 9个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout9(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFFCE4EC))
                .padding(2.dp)
        ) {
            createNestedRowLayout9(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1)
        }
    }

    // 10个参数的嵌套Row布局
    @Composable
    private fun createNestedRowLayout10(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int, param10: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Row(
            modifier = Modifier
                .background(Color(0xFFE0F7FA))
                .padding(2.dp)
        ) {
            createNestedRowLayout10(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1, param10 - 1)
        }
    }

    // 创建嵌套的Column布局，用于测试Compose布局深度
    @Composable
    private fun createNestedColumnLayout(depth: Int, paramCount: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        
        // 根据参数个数创建不同复杂度的嵌套布局
        when (paramCount) {
            1 -> createNestedColumnLayout1(depth - 1)
            2 -> createNestedColumnLayout2(depth - 1, depth - 1)
            3 -> createNestedColumnLayout3(depth - 1, depth - 1, depth - 1)
            4 -> createNestedColumnLayout4(depth - 1, depth - 1, depth - 1, depth - 1)
            5 -> createNestedColumnLayout5(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            6 -> createNestedColumnLayout6(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            7 -> createNestedColumnLayout7(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            8 -> createNestedColumnLayout8(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            9 -> createNestedColumnLayout9(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
            10 -> createNestedColumnLayout10(depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1, depth - 1)
        }
    }

    // 1个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout1(depth: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFE3F2FD))
                .padding(2.dp)
        ) {
            createNestedColumnLayout1(depth - 1)
        }
    }

    // 2个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout2(depth: Int, param2: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFE8F5E8))
                .padding(2.dp)
        ) {
            createNestedColumnLayout2(depth - 1, param2 - 1)
        }
    }

    // 3个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout3(depth: Int, param2: Int, param3: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFFFF3E0))
                .padding(2.dp)
        ) {
            createNestedColumnLayout3(depth - 1, param2 - 1, param3 - 1)
        }
    }

    // 4个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout4(depth: Int, param2: Int, param3: Int, param4: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFF3E5F5))
                .padding(2.dp)
        ) {
            createNestedColumnLayout4(depth - 1, param2 - 1, param3 - 1, param4 - 1)
        }
    }

    // 5个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout5(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFE0F2F1))
                .padding(2.dp)
        ) {
            createNestedColumnLayout5(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1)
        }
    }

    // 6个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout6(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFFFEBEE))
                .padding(2.dp)
        ) {
            createNestedColumnLayout6(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1)
        }
    }

    // 7个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout7(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFF1F8E9))
                .padding(2.dp)
        ) {
            createNestedColumnLayout7(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1)
        }
    }

    // 8个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout8(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFE8EAF6))
                .padding(2.dp)
        ) {
            createNestedColumnLayout8(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1)
        }
    }

    // 9个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout9(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFFCE4EC))
                .padding(2.dp)
        ) {
            createNestedColumnLayout9(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1)
        }
    }

    // 10个参数的嵌套Column布局
    @Composable
    private fun createNestedColumnLayout10(depth: Int, param2: Int, param3: Int, param4: Int, param5: Int, param6: Int, param7: Int, param8: Int, param9: Int, param10: Int) {
        if (depth <= 0) {
            Text("深度: 0", fontSize = 12.sp)
            return
        }
        Column(
            modifier = Modifier
                .background(Color(0xFFE0F7FA))
                .padding(2.dp)
        ) {
            createNestedColumnLayout10(depth - 1, param2 - 1, param3 - 1, param4 - 1, param5 - 1, param6 - 1, param7 - 1, param8 - 1, param9 - 1, param10 - 1)
        }
    }

    @Composable
    private fun createNestedTexts(count: Int) {
        if (count <= 0) {
            Text("Text数量: 0")
            return
        }

        createNestedTextsRecursive(count, 0)
    }

    @Composable
    private fun createNestedTextsRecursive(remainingCount: Int, currentCount: Int) {
        if (remainingCount <= 0) {
            Text("Text数量: $currentCount")
            return
        }

        Column {
            Text("Text $currentCount")
            if (remainingCount > 1) {
                createNestedTextsRecursive(remainingCount - 1, currentCount + 1)
            }
        }
    }
}
