package com.tencent.kuikly.demo.pages.compose

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers

/**
 * JVM implementation of Dispatchers.IO for CoroutinesDemoPage
 */
internal actual val Dispatchers.IO: CoroutineDispatcher
    get() = Dispatchers.IO
