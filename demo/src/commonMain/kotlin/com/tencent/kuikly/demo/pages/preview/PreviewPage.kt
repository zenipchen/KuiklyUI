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
        return {
            Text {
                attr {
                    text("CB Speed Test 9")
                    fontSize(28f)
                    color(Color.BLUE)
                }
            }
        }
    }
}