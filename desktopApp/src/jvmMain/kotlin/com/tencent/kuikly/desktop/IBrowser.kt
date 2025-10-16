package com.tencent.kuikly.desktop

/**
 * 浏览器抽象接口，用于替代 CEF 具体类型
 */
interface IBrowser {
    fun executeJavaScript(script: String, scriptUrl: String, startLine: Int)
}
