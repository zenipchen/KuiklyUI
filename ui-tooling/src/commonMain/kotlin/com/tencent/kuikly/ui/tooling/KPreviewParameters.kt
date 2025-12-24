package com.tencent.kuikly.ui.tooling

import kotlin.reflect.KClass


/**
 * Interface to be implemented by any provider of values that you want to be injected as @[KPreview]
 * parameters. This allows providing sample information for previews.
 */
interface KPreviewParameterProvider<T> {
    /**
     * [Sequence] of values of type [T] to be passed as @[KPreview] parameter.
     */
    val values: Sequence<T>

    /**
     * Returns the number of elements in the [values] [Sequence].
     */
    val count get() = values.count()

    fun getParameters(limit: Int): List<T> = values.take(limit).toList()
}

/**
 * [KPreviewParameter] can be applied to any parameter of a @[KPreview].
 *
 * @param provider A [KPreviewParameterProvider] class to use to inject values to the annotated
 * parameter.
 * @param limit Max number of values from [provider] to inject to this parameter.
 */
annotation class KPreviewParameter(
    val provider: KClass<out KPreviewParameterProvider<*>>,
    val limit: Int = Int.MAX_VALUE
)
