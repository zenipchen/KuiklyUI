package com.tencent.kuikly.core.coroutines


/**
 * Deferred value is a non-blocking cancellable future &mdash; it is a [Job] with a result.
 *
 * It is created with the [async][CoroutineScope.async] coroutine builder or via the constructor of [CompletableDeferred] class.
 * It is in [active][isActive] state while the value is being computed.
 *
 * `Deferred` has the same state machine as the [Job] with additional convenience methods to retrieve
 * the successful or failed result of the computation that was carried out. The result of the deferred is
 * available when it is [completed][isCompleted] and can be retrieved by [await] method, which throws
 * an exception if the deferred had failed.
 * Note that a _cancelled_ deferred is also considered as completed.
 * The corresponding exception can be retrieved via [getCompletionExceptionOrNull] from a completed instance of deferred.
 *
 * Usually, a deferred value is created in _active_ state (it is created and started).
 * However, the [async][CoroutineScope.async] coroutine builder has an optional `start` parameter that creates a deferred value in _new_ state
 * when this parameter is set to [CoroutineStart.LAZY].
 * Such a deferred can be be made _active_ by invoking [start], [join], or [await].
 *
 * A deferred value is a [Job]. A job in the
 * [coroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/coroutine-context.html)
 * of [async][CoroutineScope.async] builder represents the coroutine itself.
 *
 * All functions on this interface and on all interfaces derived from it are **thread-safe** and can
 * be safely invoked from concurrent coroutines without external synchronization.
 *
 * **`Deferred` interface and all its derived interfaces are not stable for inheritance in 3rd party libraries**,
 * as new methods might be added to this interface in the future, but is stable for use.
 */
public interface Deferred<out T> : Job {

    /**
     * Awaits for completion of this value without blocking a thread and resumes when deferred computation is complete,
     * returning the resulting value or throwing the corresponding exception if the deferred was cancelled.
     *
     * This suspending function is cancellable.
     * If the [Job] of the current coroutine is cancelled or completed while this suspending function is waiting, this function
     * immediately resumes with [CancellationException].
     * There is a **prompt cancellation guarantee**. If the job was cancelled while this function was
     * suspended, it will not resume successfully. See [suspendCancellableCoroutine] documentation for low-level details.
     */
    public suspend fun await(): T


}
