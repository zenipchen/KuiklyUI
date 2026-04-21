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

package com.tencent.kuikly.demo.pages.demo

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Animation
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ComposeAttr
import com.tencent.kuikly.core.base.ComposeEvent
import com.tencent.kuikly.core.base.ComposeView
import com.tencent.kuikly.core.base.Translate
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.base.event.EventHandlerFn
import com.tencent.kuikly.core.directives.vif
import com.tencent.kuikly.core.reactive.handler.observable
import com.tencent.kuikly.core.views.Modal
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.tencent.kuikly.core.views.compose.Button
import com.tencent.kuikly.demo.pages.base.BasePager
import com.tencent.kuikly.demo.pages.demo.base.NavBar

/**
 * Android 虚拟（手势）导航栏遮挡规避 Demo
 *
 * 正确做法：
 *   Android 容器层（Activity/Fragment）通过 pageData 将导航栏高度传入 Kuikly 侧，
 *   Kuikly 页面和对话框各自使用 pagerData.androidBottomBavBarHeight 添加底部 padding，
 *   而不是在容器层直接对根 View 加 padding 来规避遮挡。
 *
 * 关键 API：
 *   pagerData.androidBottomBavBarHeight  —— Android 虚拟导航栏高度（dp），
 *   手势导航模式下为 0，三键导航模式下为实际高度。
 */
@Page("GestureNavBarDemoPage")
internal class GestureNavBarDemoPage : BasePager() {

    private var showBottomSheet by observable(false)

    override fun body(): ViewBuilder {
        val ctx = this
        // 从 pageData 中读取 Android 虚拟导航栏高度（由容器层通过 pageData 传入）
        val navBarHeight = pagerData.androidBottomBavBarHeight

        return {
            attr {
                backgroundColor(Color(0xFFF5F5F5L))
            }

            // 顶部导航栏
            NavBar {
                attr {
                    title = "手势导航栏规避 Demo"
                }
            }

            // 页面主体内容
            View {
                attr {
                    flex(1f)
                    backgroundColor(Color(0xFFF5F5F5L))
                    // ✅ 正确做法：页面在 Kuikly 侧通过 pagerData.androidBottomBavBarHeight 添加底部 padding，
                    //    确保内容不被虚拟导航栏遮挡。
                    //    手势导航模式下 navBarHeight == 0，不影响效果。
                    paddingBottom(navBarHeight)
                    paddingLeft(16f)
                    paddingRight(16f)
                    paddingTop(16f)
                }

                // 说明文字
                View {
                    attr {
                        backgroundColor(Color.WHITE)
                        borderRadius(8f)
                        padding(16f)
                        marginBottom(16f)
                    }
                    Text {
                        attr {
                            text("当前 Android 虚拟导航栏高度：${navBarHeight}dp")
                            fontSize(15f)
                            color(Color.BLACK)
                        }
                    }
                }

                View {
                    attr {
                        backgroundColor(Color.WHITE)
                        borderRadius(8f)
                        padding(16f)
                        marginBottom(16f)
                    }
                    Text {
                        attr {
                            text("✅ 正确做法\n\n容器层（Activity）通过 pageData 将导航栏高度传入，" +
                                    "Kuikly 页面在 body() 中使用 pagerData.androidBottomBavBarHeight " +
                                    "对页面内容区添加底部 paddingBottom，对底部弹窗添加底部 paddingBottom。\n\n" +
                                    "手势导航模式下高度为 0，三键导航模式下为实际导航栏高度。")
                            fontSize(14f)
                            color(Color(0xFF333333L))
                            lineHeight(22f)
                        }
                    }
                }

                View {
                    attr {
                        backgroundColor(Color(0xFFFFEEEEL))
                        borderRadius(8f)
                        padding(16f)
                        marginBottom(24f)
                    }
                    Text {
                        attr {
                            text("❌ 错误做法\n\n在 Android 容器层（Activity/Fragment）对 KuiklyRenderView " +
                                    "的父容器直接 setPadding() 来规避导航栏遮挡。\n\n" +
                                    "这样会导致 Kuikly 侧无法感知导航栏高度，弹窗等浮层无法自行规避遮挡。")
                            fontSize(14f)
                            color(Color(0xFF333333L))
                            lineHeight(22f)
                        }
                    }
                }

                // 弹出底部弹窗按钮
                Button {
                    attr {
                        height(50f)
                        borderRadius(25f)
                        backgroundColor(Color(0xFF1976D2L))
                        titleAttr {
                            text("弹出底部对话框（含导航栏规避）")
                            fontSize(16f)
                            color(Color.WHITE)
                        }
                    }
                    event {
                        click {
                            ctx.showBottomSheet = true
                        }
                    }
                }
            }

            // 底部对话框
            vif({ ctx.showBottomSheet }) {
                Modal {
                    GestureNavBarBottomSheet {
                        attr {
                            // 将导航栏高度传入底部弹窗
                            bottomNavBarHeight = navBarHeight
                        }
                        event {
                            close {
                                ctx.showBottomSheet = false
                            }
                        }
                    }
                }
            }
        }
    }
}

// ──────────────────────────────────────────────
// 底部弹窗组件
// ──────────────────────────────────────────────

internal class GestureNavBarBottomSheetAttr : ComposeAttr() {
    /** Android 虚拟导航栏高度（dp），由父页面通过 pagerData.androidBottomBavBarHeight 传入 */
    var bottomNavBarHeight: Float = 0f
}

internal class GestureNavBarBottomSheetEvent : ComposeEvent() {
    fun close(handler: EventHandlerFn) {
        registerEvent(CLOSE, handler)
    }
    companion object {
        const val CLOSE = "close"
    }
}

internal class GestureNavBarBottomSheet :
    ComposeView<GestureNavBarBottomSheetAttr, GestureNavBarBottomSheetEvent>() {

    private var animated by observable(false)

    override fun createAttr() = GestureNavBarBottomSheetAttr()
    override fun createEvent() = GestureNavBarBottomSheetEvent()

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            // 半透明遮罩
            attr {
                absolutePosition(0f, 0f, 0f, 0f)
                justifyContentFlexEnd()
                if (ctx.animated) {
                    backgroundColor(Color(0, 0, 0, 0.5f))
                } else {
                    backgroundColor(Color(0, 0, 0, 0f))
                }
                animation(Animation.springEaseIn(0.5f, 0.92f, 1f), ctx.animated)
            }
            event {
                click {
                    ctx.animated = false
                }
                animationCompletion {
                    if (!ctx.animated) {
                        ctx.emit(GestureNavBarBottomSheetEvent.CLOSE, it)
                    }
                }
            }

            // 弹窗内容区
            View {
                attr {
                    backgroundColor(Color.WHITE)
                    borderRadius(16f)   // 顶部圆角
                    // ✅ 正确做法：底部弹窗通过 attr.bottomNavBarHeight（即容器层传入的
                    //    androidBottomNavBarHeight）来添加底部 paddingBottom，
                    //    确保弹窗内容不被虚拟导航栏遮挡。
                    paddingBottom(16f + ctx.attr.bottomNavBarHeight)
                    paddingTop(16f)
                    paddingLeft(16f)
                    paddingRight(16f)
                    if (ctx.animated) {
                        transform(Translate(0f, 0f))
                    } else {
                        transform(Translate(0f, 1f))
                    }
                    animation(Animation.springEaseIn(0.5f, 0.92f, 1f), ctx.animated)
                }

                // 顶部拖拽指示条
                View {
                    attr {
                        width(40f)
                        height(4f)
                        borderRadius(2f)
                        backgroundColor(Color(0xFFCCCCCCL))
                        alignSelfCenter()
                        marginBottom(16f)
                    }
                }

                Text {
                    attr {
                        text("底部弹窗")
                        fontSize(18f)
                        fontWeightBold()
                        color(Color.BLACK)
                        marginBottom(8f)
                    }
                }

                Text {
                    attr {
                        text("当前导航栏高度：${ctx.attr.bottomNavBarHeight}dp\n\n" +
                                "本弹窗已在底部添加 paddingBottom = 16 + ${ctx.attr.bottomNavBarHeight}dp，" +
                                "确保内容不被虚拟导航栏遮挡。\n\n" +
                                "点击遮罩区域关闭弹窗。")
                        fontSize(14f)
                        color(Color(0xFF555555L))
                        lineHeight(22f)
                        marginBottom(24f)
                    }
                }

                Button {
                    attr {
                        height(50f)
                        borderRadius(25f)
                        backgroundColor(Color(0xFF1976D2L))
                        titleAttr {
                            text("关闭弹窗")
                            fontSize(16f)
                            color(Color.WHITE)
                        }
                    }
                    event {
                        click {
                            ctx.animated = false
                        }
                    }
                }
            }
        }
    }

    override fun viewDidLayout() {
        super.viewDidLayout()
        animated = true
    }
}

internal fun ViewContainer<*, *>.GestureNavBarBottomSheet(
    init: GestureNavBarBottomSheet.() -> Unit
) {
    addChild(GestureNavBarBottomSheet(), init)
}
