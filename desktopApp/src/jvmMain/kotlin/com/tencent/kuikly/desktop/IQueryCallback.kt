package com.tencent.kuikly.desktop

/**
 * 查询回调抽象接口，用于替代 CEF 具体类型
 */
interface IQueryCallback {
    fun success(response: String)
    fun failure(errorCode: Int, errorMessage: String)
}
