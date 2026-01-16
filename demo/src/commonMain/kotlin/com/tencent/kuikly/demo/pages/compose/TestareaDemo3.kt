package com.tencent.map.kuiklyAIHome

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Border
import com.tencent.kuikly.core.base.BorderStyle
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.base.ViewRef
import com.tencent.kuikly.core.reactive.handler.observable
import com.tencent.kuikly.core.views.TextArea
import com.tencent.kuikly.core.views.TextAreaView
import com.tencent.kuikly.core.views.View
import com.tencent.kuikly.demo.pages.base.BasePager

@Page("TestareaDemo3")
internal class TestareaDemo3: BasePager() {

    companion object {
        private const val TAG = "TestareaDemo3"
        private const val TEXT_LINE_HEIGHT = 24f // 输入框行高
    }

    // TextArea 相关状态
    private var textArea1Content by observable("")
    private var textArea2Content by observable("")
    lateinit var textArea1Ref: ViewRef<TextAreaView>
    lateinit var textArea2Ref: ViewRef<TextAreaView>
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    flex(1f)
                    flexDirectionColumn()
                    backgroundColor(Color(0xFFF5F5F5))
                    paddingTop(20f)
                    paddingBottom(20f)
                    paddingLeft(16f)
                    paddingRight(16f)
                }

                // 上方 TextArea
                View {
                    attr {
                        height(200f)
                        backgroundColor(Color(0xFFFFFFFF))
                        borderRadius(12f)
                        border(Border(1f, BorderStyle.SOLID, Color(0x1A000000)))
                        marginBottom(20f)
                        paddingTop(12f)
                        paddingBottom(12f)
                        paddingLeft(12f)
                        paddingRight(12f)
                    }

                    TextArea {
                        ref { ctx.textArea1Ref = it }
                        attr {
                            flex(1f)
                            placeholder("请在此输入内容...")
                            textAlignLeft()
                            fontWeightNormal()
                            fontSize(16f)
                            lineHeight(TEXT_LINE_HEIGHT)
                            backgroundColor(Color.TRANSPARENT)
                            border(Border(0f, BorderStyle.SOLID, Color.TRANSPARENT))
                            maxTextLength(1000)
                            editable(true)
                            overflow(true) // 支持滚动
                        }

                        event {
                            textDidChange { params ->
                                ctx.textArea1Content = params.text
                                // 将 textArea1 的内容同步到 textArea2
                                ctx.textArea2Content = params.text
                                ctx.textArea2Ref.view?.setText(params.text)
                            }

                            inputFocus {
                            }

                            inputBlur {
                            }
                        }
                    }
                }

                // 下方 TextArea
                View {
                    attr {
                        height(200f)
                        backgroundColor(Color(0xFFFFFFFF))
                        borderRadius(12f)
                        border(Border(1f, BorderStyle.SOLID, Color(0x1A000000)))
                        paddingTop(12f)
                        paddingBottom(12f)
                        paddingLeft(12f)
                        paddingRight(12f)
                    }

                    TextArea {
                        ref { ctx.textArea2Ref = it }
                        attr {
                            flex(1f)
                            placeholder("上方输入的内容会显示在这里...")
                            textAlignLeft()
                            fontWeightNormal()
                            fontSize(16f)
                            lineHeight(TEXT_LINE_HEIGHT)
                            backgroundColor(Color.TRANSPARENT)
                            border(Border(0f, BorderStyle.SOLID, Color.TRANSPARENT))
                            maxTextLength(1000)
                            editable(true)
                            overflow(true) // 支持滚动
                            text(ctx.textArea2Content) // 显示从 textArea1 传入的内容
                        }

                        event {
                            textDidChange { params ->
                                ctx.textArea2Content = params.text
                            }

                            inputFocus {
                            }

                            inputBlur {
                            }
                        }
                    }
                }
            }
        }
    }

    override fun viewDidLoad() {
        super.viewDidLoad()
    }
}