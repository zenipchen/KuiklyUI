package com.tencent.kuikly.demo.pages.demo

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.*
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.reactive.handler.observable
import com.tencent.kuikly.core.views.Input
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View
import com.tencent.kuikly.demo.pages.demo.base.NavBar

@Page("EmojiTextInputDemo")
internal class EmojiTextInputDemo : Pager() {

    // observable 委托，使输入框内容变化时自动刷新 UI
    private var inputText: String by observable("")

    private val emojiShortcodes = listOf("[smile]", "[heart]", "[thumbup]", "[star]", "[fire]")
    private val emojiLabels  = listOf("😊", "❤️", "👍", "⭐", "🔥")

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    size(pagerData.pageViewWidth, pagerData.pageViewHeight)
                    backgroundColor(Color(0xFFF5F5F5))
                    flexDirectionColumn()
                }

                NavBar { attr { title = "自定义表情 Demo (自研DSL)" } }

                // 说明文字
                View {
                    attr {
                        marginTop(12f)
                        marginLeft(16f)
                        marginRight(16f)
                    }
                    Text {
                        attr {
                            text("点击表情按钮向输入框插入短码，KRTextPostProcessorAdapter 会将短码替换为图片。")
                            color(Color(0xFF666666))
                            fontSize(14f)
                        }
                    }
                }

                // 输入框（使用 Input 组件，触发 KRTextPostProcessorAdapter）
                View {
                    attr {
                        marginTop(12f)
                        marginLeft(16f)
                        marginRight(16f)
                        height(48f)
                        borderRadius(8f)
                        border(Border(1f, color = Color(0xFFDDDDDD), lineStyle = BorderStyle.SOLID))
                        backgroundColor(Color.WHITE)
                        paddingLeft(12f)
                        paddingRight(12f)
                        flexDirectionRow()
                        alignItemsCenter()
                    }
                    Input {
                        attr {
                            flex(1f)
                            text(ctx.inputText)
                            placeholder("输入文字或点击下方表情按钮")
                            fontSize(16f)
                            color(Color(0xFF333333))
                            textPostProcessor("input")
                        }
                        event {
                            textDidChange { params ->
                                ctx.inputText = params.text
                            }
                        }
                    }
                }

                // 预览区域
                View {
                    attr {
                        marginTop(12f)
                        marginLeft(16f)
                        marginRight(16f)
                        minHeight(48f)
                        borderRadius(8f)
                        backgroundColor(Color.WHITE)
                        paddingLeft(12f)
                        paddingRight(12f)
                        paddingTop(12f)
                        paddingBottom(12f)
                    }
                    Text {
                        attr {
                            text(
                                "预览：" + if (ctx.inputText.isEmpty()) {
                                    "（暂无内容）"
                                } else {
                                    ctx.inputText
                                }
                            )
                            fontSize(16f)
                            color(if (ctx.inputText.isEmpty()) Color(0xFFCCCCCC) else Color(0xFF333333))
                            textPostProcessor("input")
                        }
                    }
                }

                // 表情按钮行
                View {
                    attr {
                        marginTop(16f)
                        marginLeft(16f)
                        marginRight(16f)
                        flexDirectionRow()
                    }
                    for (i in ctx.emojiShortcodes.indices) {
                        View {
                            attr {
                                height(40f)
                                borderRadius(20f)
                                backgroundColor(Color.WHITE)
                                paddingLeft(12f)
                                paddingRight(12f)
                                marginRight(8f)
                                marginBottom(8f)
                                border(Border(1f, color = Color(0xFFDDDDDD), lineStyle = BorderStyle.SOLID))
                                justifyContentCenter()
                                alignItemsCenter()
                            }
                            Text {
                                attr {
                                    text(ctx.emojiLabels[i] + " " + ctx.emojiShortcodes[i])
                                    fontSize(14f)
                                    color(Color(0xFF333333))
                                }
                            }
                            event {
                                click {
                                    ctx.inputText += ctx.emojiShortcodes[i]
                                }
                            }
                        }
                    }
                }

                // 清空按钮
                View {
                    attr {
                        marginTop(24f)
                        marginLeft(16f)
                        marginRight(16f)
                        height(44f)
                        borderRadius(8f)
                        backgroundColor(Color(0xFFFF4444))
                        justifyContentCenter()
                        alignItemsCenter()
                    }
                    Text {
                        attr {
                            text("清空输入框")
                            fontSize(16f)
                            color(Color.WHITE)
                            fontWeightBold()
                        }
                    }
                    event {
                        click {
                            ctx.inputText = ""
                        }
                    }
                }
            }
        }
    }
}
