package com.tencent.kuikly.desktop

/**
 * CEF 浏览器适配器，将 CefBrowser 适配为 IBrowser 接口
 */
class CefBrowserAdapter(private val cefBrowser: org.cef.browser.CefBrowser) : IBrowser {
    override fun executeJavaScript(script: String, scriptUrl: String, startLine: Int) {
        cefBrowser.executeJavaScript(script, scriptUrl, startLine)
    }
}
