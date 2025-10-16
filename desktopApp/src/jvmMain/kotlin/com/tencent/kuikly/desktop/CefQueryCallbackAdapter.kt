package com.tencent.kuikly.desktop

/**
 * CEF 查询回调适配器，将 CefQueryCallback 适配为 IQueryCallback 接口
 */
class CefQueryCallbackAdapter(private val cefQueryCallback: org.cef.callback.CefQueryCallback) : IQueryCallback {
    override fun success(response: String) {
        cefQueryCallback.success(response)
    }
    
    override fun failure(errorCode: Int, errorMessage: String) {
        cefQueryCallback.failure(errorCode, errorMessage)
    }
}
