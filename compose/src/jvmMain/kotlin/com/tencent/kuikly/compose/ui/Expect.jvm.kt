package com.tencent.kuikly.compose.ui


import com.tencent.kuikly.compose.ui.node.ModifierNodeElement
import com.tencent.kuikly.compose.ui.platform.InspectorInfo
import com.tencent.kuikly.compose.ui.util.fastForEach
import kotlinx.coroutines.CancellationException

internal actual fun areObjectsOfSameType(a: Any, b: Any): Boolean {
    return a::class.java === b::class.java
}

// TODO: For non-JVM platforms, you can revive the kotlin-reflect implementation from
//  https://android-review.googlesource.com/c/platform/frameworks/support/+/2441379
internal actual fun InspectorInfo.tryPopulateReflectively(
    element: ModifierNodeElement<*>
) {
    element.javaClass.declaredFields
        // Sort by the field name to make the result more well-defined
        .sortedBy { it.name }
        .fastForEach { field ->
            if (!field.declaringClass.isAssignableFrom(ModifierNodeElement::class.java)) {
                try {
                    field.isAccessible = true
                    properties[field.name] = field.get(element)
                } catch (_: SecurityException) {
                    // Do nothing. Just ignore the field and prevent the error from crashing
                    // the application and ending the debugging session.
                } catch (_: IllegalAccessException) {
                    // Do nothing. Just ignore the field and prevent the error from crashing
                    // the application and ending the debugging session.
                }
            }
        }
}

internal actual abstract class PlatformOptimizedCancellationException actual constructor(
    message: String?
) : CancellationException(message) {

    override fun fillInStackTrace(): Throwable {
        // Avoid null.clone() on Android <= 6.0 when accessing stackTrace
        stackTrace = emptyArray()
        return this
    }

}

internal actual fun getCurrentThreadId(): Long = Thread.currentThread().id