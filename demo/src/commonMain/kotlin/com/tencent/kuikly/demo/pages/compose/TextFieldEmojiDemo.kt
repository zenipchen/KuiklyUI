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

import androidx.compose.runtime.*
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.clickable
import com.tencent.kuikly.compose.foundation.layout.*
import com.tencent.kuikly.compose.material3.Button
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.material3.TextField
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.text.TextStyle
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.compose.extension.textPostProcessor
import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.compose.foundation.shape.CircleShape

/**
 * Compose DSL 自定义表情输入 Demo
 * 使用短码（如 [smile]）映射到本地 drawable 资源，通过 textPostProcessor 解析为 ImageSpan 表情
 */
@Page("TextFieldEmojiDemo")
class TextFieldEmojiDemo : ComposeContainer() {

    // 自定义表情短码列表
    private val emojiList = listOf(
        "[smile]" to "微笑",
        "[heart]" to "爱心",
        "[thumbup]" to "点赞",
        "[star]" to "星星",
        "[fire]" to "火焰",
    )

    override fun willInit() {
        super.willInit()
        setContent {
            var text by remember { mutableStateOf("") }
            var showEmojiPanel by remember { mutableStateOf(false) }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFF5F5F5))
                    .padding(16.dp)
            ) {
                Text(
                    text = "Compose DSL 自定义表情 Demo",
                    fontSize = 20.sp,
                    color = Color.Black,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                Text(
                    text = "点击表情按钮插入短码，TextField 实时解析为表情图片",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                // 输入框（带 textPostProcessor，实时显示表情图片）
                TextField(
                    value = text,
                    onValueChange = { text = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .textPostProcessor("input"),
                    placeholder = { Text("输入内容或点击表情按钮") }
                )

                Spacer(modifier = Modifier.height(12.dp))

                // 表情面板开关
                Button(
                    onClick = { showEmojiPanel = !showEmojiPanel },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (showEmojiPanel) "隐藏表情面板" else "显示表情面板")
                }

                // 表情选择面板
                if (showEmojiPanel) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color.White)
                            .padding(12.dp)
                    ) {
                        EmojiGrid(emojiList) { shortCode ->
                            text += shortCode
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // 预览区域（同样带 textPostProcessor）
                Text(
                    text = "预览：",
                    fontSize = 14.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(12.dp)
                ) {
                    Text(
                        text = if (text.isEmpty()) "（暂无内容）" else text,
                        fontSize = 16.sp,
                        color = if (text.isEmpty()) Color(0xFFCCCCCC) else Color(0xFF333333),
                        modifier = Modifier.textPostProcessor("input")
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // 清空按钮
                Button(
                    onClick = { text = "" },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("清空内容")
                }

                Spacer(modifier = Modifier.height(300.dp))
            }
        }
    }
}

/**
 * 自定义表情网格组件
 */
@Composable
fun EmojiGrid(
    emojis: List<Pair<String, String>>,
    onEmojiClick: (String) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        emojis.forEach { (shortCode, label) ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .clickable { onEmojiClick(shortCode) }
                    .padding(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .background(Color(0xFFF0F0F0), shape = CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = label.first().toString(),
                        fontSize = 20.sp,
                        color = Color(0xFF666666)
                    )
                }
                Text(
                    text = label,
                    fontSize = 10.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }
    }
}
