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

package com.tencent.kuikly.demo.pages

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ComposeEvent
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.reactive.collection.ObservableList
import com.tencent.kuikly.core.reactive.handler.observableList
import com.tencent.kuikly.core.views.Text

/**
 * 调试日志配置
 */
object PageDebugConfig {
    // 页面调试日志开关
    var PAGE_DEBUG_ENABLED = System.getProperty("kuikly.page.debug", "false").toBoolean()
    
    // 生命周期调试日志开关
    var LIFECYCLE_DEBUG_ENABLED = System.getProperty("kuikly.lifecycle.debug", "false").toBoolean()
    
    // 渲染调试日志开关
    var RENDER_DEBUG_ENABLED = System.getProperty("kuikly.render.debug", "false").toBoolean()
    
    fun debug(tag: String, message: String) {
        if (PAGE_DEBUG_ENABLED) {
            println("[$tag] $message")
        }
    }
    
    fun lifecycleDebug(tag: String, message: String) {
        if (LIFECYCLE_DEBUG_ENABLED) {
            println("[$tag] 🔄 $message")
        }
    }
    
    fun renderDebug(tag: String, message: String) {
        if (RENDER_DEBUG_ENABLED) {
            println("[$tag] 🎨 $message")
        }
    }
    
    fun info(tag: String, message: String) {
        println("[$tag] ℹ️ $message")
    }
    
    fun error(tag: String, message: String, throwable: Throwable? = null) {
        println("[$tag] ❌ $message")
        throwable?.printStackTrace()
    }
}

/**
 * Created by kam on 2022/7/28.
 */
@Page("HelloWorldPage")
internal class HelloWorldPage : Pager() {

    init {
        PageDebugConfig.debug("HelloWorldPage", "页面构造函数被调用")
    }

    var dataList: ObservableList<String> by observableList()

    override fun createEvent(): ComposeEvent {
        PageDebugConfig.debug("HelloWorldPage", "createEvent() 被调用")
        return ComposeEvent()
    }

    override fun onCreatePager(pagerId: String, pageData: com.tencent.kuikly.core.nvi.serialization.json.JSONObject) {
        super.onCreatePager(pagerId, pageData)
        PageDebugConfig.lifecycleDebug("HelloWorldPage", "onCreatePager() 被调用，pagerId: $pagerId")
    }

    override fun onDestroyPager() {
        super.onDestroyPager()
        PageDebugConfig.lifecycleDebug("HelloWorldPage", "onDestroyPager() 被调用")
    }

    override fun pageDidAppear() {
        super.pageDidAppear()
        PageDebugConfig.lifecycleDebug("HelloWorldPage", "pageDidAppear() 被调用")
    }

    override fun pageDidDisappear() {
        super.pageDidDisappear()
        PageDebugConfig.lifecycleDebug("HelloWorldPage", "pageDidDisappear() 被调用")
    }

    override fun pageWillDestroy() {
        super.pageWillDestroy()
        PageDebugConfig.lifecycleDebug("HelloWorldPage", "pageWillDestroy() 被调用")
    }

    override fun onFirstFramePaint() {
        super.onFirstFramePaint()
        PageDebugConfig.renderDebug("HelloWorldPage", "onFirstFramePaint() 被调用")
    }

    override fun onViewEvent(viewRef: Int, event: String, res: com.tencent.kuikly.core.nvi.serialization.json.JSONObject?) {
        super.onViewEvent(viewRef, event, res)
        PageDebugConfig.debug("HelloWorldPage", "onViewEvent() 被调用，viewRef: $viewRef, event: $event")
    }

    override fun body(): ViewBuilder {
        PageDebugConfig.renderDebug("HelloWorldPage", "body() 被调用，开始构建视图")

        return {
            attr {
                backgroundColor(Color.WHITE)
                flexDirectionColumn()
                autoDarkEnable(false)
                width(1200f)
                height(800f)
                paddingLeft(20f)
                paddingTop(20f)
            }
            
            // 使用简单的 Text 组件来验证渲染流程
            Text {
                PageDebugConfig.renderDebug("HelloWorldPage", "创建第一个 Text 组件")
                attr {
                    text("Hello World from Desktop!")
                    fontSize(24f)
                    color(Color.BLACK)
                    marginBottom(10f)
                }
            }
            
            Text {
                PageDebugConfig.renderDebug("HelloWorldPage", "创建第二个 Text 组件")
                attr {
                    text("这是第二行文本")
                    fontSize(18f)
                    color(Color.RED)
                    marginBottom(10f)
                }
            }
            
            Text {
                PageDebugConfig.renderDebug("HelloWorldPage", "创建第三个 Text 组件")
                attr {
                    text("Kuikly Desktop 渲染成功！")
                    fontSize(16f)
                    color(Color(0xFF0088FF))
                }
            }
        }
    }
}