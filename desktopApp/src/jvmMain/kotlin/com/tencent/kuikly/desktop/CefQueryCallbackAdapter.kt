package com.tencent.kuikly.desktop

import com.tencent.kuikly.desktop.sdk.KuiklyDesktopRenderSdk

/**
 * CEF 查询回调适配器
 * 
 * 将 CEF 的 CefQueryCallback 适配为 KuiklyDesktopRenderSdk.QueryCallback 接口。
 * 这样可以让 SDK 不直接依赖 CEF 具体类型，提高可测试性和可扩展性。
 * 
 * @param cefQueryCallback CEF 查询回调实例
 */
class CefQueryCallbackAdapter(private val cefQueryCallback: org.cef.callback.CefQueryCallback) : KuiklyDesktopRenderSdk.QueryCallback {
    override fun success(response: String) {
        cefQueryCallback.success(response)
    }
    
    override fun failure(errorCode: Int, errorMessage: String) {
        cefQueryCallback.failure(errorCode, errorMessage)
    }
}
