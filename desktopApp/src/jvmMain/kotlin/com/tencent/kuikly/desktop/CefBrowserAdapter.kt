package com.tencent.kuikly.desktop

import com.tencent.kuikly.desktop.sdk.KuiklyDesktopRenderSdk

/**
 * CEF 浏览器适配器
 * 
 * 将 CEF 的 CefBrowser 适配为 KuiklyDesktopRenderSdk.Browser 接口。
 * 这样可以让 SDK 不直接依赖 CEF 具体类型，提高可测试性和可扩展性。
 * 
 * @param cefBrowser CEF 浏览器实例
 */
class CefBrowserAdapter(private val cefBrowser: org.cef.browser.CefBrowser) : KuiklyDesktopRenderSdk.Browser {
    override fun executeJavaScript(script: String, scriptUrl: String, startLine: Int) {
        cefBrowser.executeJavaScript(script, scriptUrl, startLine)
    }
}
