package com.tencent.kuikly.demo.pages.preview

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.*
import com.tencent.kuikly.core.pager.*
import com.tencent.kuikly.core.views.*
import com.tencent.kuikly.core.directives.*
import com.tencent.kuikly.core.reactive.*
import com.tencent.kuikly.core.layout.*
import com.tencent.kuikly.core.nvi.*
import com.tencent.kuikly.demo.pages.base.BasePager

@Page("PreviewPage")
internal class PreviewPage : BasePager() {

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                backgroundColor(Color.WHITE)
            }

            View {
                attr {
                    flexDirectionColumn()
                    allCenter()
                    flex(1f)
                }

                Text {
                    attr {
                        text("Hello Kuikly!")
                        fontSize(32f)
                        fontWeightBold()
                        color(Color(0xFF6366F1))
                        textAlignCenter()
                    }
                }

                Text {
                    attr {
                        text("欢迎66使用 Kuikly DSL Editor")
                        fontSize(16f)
                        color(Color.GRAY)
                        marginTop(12f)
                    }
                }
            }
        }
    }

    override fun createEvent(): ComposeEvent = ComposeEvent()
}