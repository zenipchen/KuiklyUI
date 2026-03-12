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

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProvideTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Material Design 3 底部导航栏
 *
 * 示例：
 * ```
 * NavigationBar {
 *     items.forEach { item ->
 *         NavigationBarItem(
 *             icon = { Icon(item.icon, contentDescription = item.label) },
 *             label = { Text(item.label) },
 *             selected = selectedItem == item,
 *             onClick = { selectedItem = item }
 *         )
 *     }
 * }
 * ```
 *
 * @param modifier 修饰符
 * @param containerColor 容器背景色
 * @param contentColor 内容颜色
 * @param tonalElevation 色调高度
 * @param content 导航项内容
 */
@Composable
fun NavigationBar(
    modifier: Modifier = Modifier,
    containerColor: Color = MaterialTheme.colorScheme.surface,
    contentColor: Color = MaterialTheme.colorScheme.onSurface,
    tonalElevation: Float = 3f,
    content: @Composable RowScope.() -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(containerColor)
            .padding(horizontal = 12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(80.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
            content = content
        )
    }
}

/**
 * NavigationBarItem - 导航栏单项
 *
 * @param selected 是否选中
 * @param onClick 点击回调
 * @param icon 图标内容
 * @param modifier 修饰符
 * @param enabled 是否可用
 * @param label 标签内容
 * @param alwaysShowLabel 是否始终显示标签
 * @param colors 颜色配置
 * @param interactionSource 交互源
 */
@Composable
fun RowScope.NavigationBarItem(
    selected: Boolean,
    onClick: () -> Unit,
    icon: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: @Composable (() -> Unit)? = null,
    alwaysShowLabel: Boolean = true,
    colors: NavigationBarItemColors = NavigationBarItemDefaults.colors(),
    interactionSource: MutableInteractionSource? = null
) {
    val iconAlpha by animateFloatAsState(
        targetValue = if (selected) 1f else 0.6f,
        animationSpec = tween(150),
        label = "icon_alpha"
    )
    
    val labelAlpha by animateFloatAsState(
        targetValue = if (selected || alwaysShowLabel) 1f else 0f,
        animationSpec = tween(150),
        label = "label_alpha"
    )

    Column(
        modifier = modifier
            .weight(1f)
            .selectable(
                selected = selected,
                onClick = onClick,
                enabled = enabled,
                role = Role.Tab,
                interactionSource = interactionSource ?: remember { MutableInteractionSource() },
                indication = null
            )
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // 图标区域
        Box(
            modifier = Modifier
                .height(32.dp)
                .fillMaxWidth()
                .background(
                    color = if (selected) colors.indicatorColor else Color.Transparent,
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            CompositionLocalProvider(
                LocalContentColor provides if (selected) colors.selectedIconColor else colors.unselectedIconColor
            ) {
                Box(modifier = Modifier.alpha(iconAlpha)) {
                    icon()
                }
            }
        }

        // 标签
        if (label != null) {
            Box(
                modifier = Modifier
                    .padding(top = 4.dp)
                    .alpha(labelAlpha),
                contentAlignment = Alignment.Center
            ) {
                CompositionLocalProvider(
                    LocalContentColor provides if (selected) colors.selectedTextColor else colors.unselectedTextColor
                ) {
                    ProvideTextStyle(
                        MaterialTheme.typography.labelSmall.copy(
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    ) {
                        label()
                    }
                }
            }
        }
    }
}

/**
 * NavigationBarItem 颜色配置
 */
interface NavigationBarItemColors {
    val selectedIconColor: Color
    val selectedTextColor: Color
    val unselectedIconColor: Color
    val unselectedTextColor: Color
    val indicatorColor: Color
}

/**
 * NavigationBarItem 默认配置
 */
object NavigationBarItemDefaults {
    @Composable
    fun colors(
        selectedIconColor: Color = MaterialTheme.colorScheme.onSecondaryContainer,
        selectedTextColor: Color = MaterialTheme.colorScheme.onSurface,
        unselectedIconColor: Color = MaterialTheme.colorScheme.onSurfaceVariant,
        unselectedTextColor: Color = MaterialTheme.colorScheme.onSurfaceVariant,
        indicatorColor: Color = MaterialTheme.colorScheme.secondaryContainer
    ): NavigationBarItemColors {
        return object : NavigationBarItemColors {
            override val selectedIconColor = selectedIconColor
            override val selectedTextColor = selectedTextColor
            override val unselectedIconColor = unselectedIconColor
            override val unselectedTextColor = unselectedTextColor
            override val indicatorColor = indicatorColor
        }
    }
}

/**
 * NavigationBar 默认配置
 */
object NavigationBarDefaults {
    @Composable
    fun containerColor() = MaterialTheme.colorScheme.surface
    
    @Composable
    fun contentColor() = MaterialTheme.colorScheme.onSurface
}
