package com.tencent.kuikly.compose.coroutines.internal

internal actual fun platformInitScheduler() {
}

internal actual inline fun platformIsOnKuiklyThread(pagerId: String): Boolean {
    return true
}

// 1. 定义线程调度接口
interface KuiklyThreadScheduler {
    fun scheduleOnKuiklyThread(pagerId: String)
}

// 2. 提供接口的默认实现（可选，根据实际需求）
open class DefaultKuiklyThreadScheduler : KuiklyThreadScheduler {

    open fun runTasks(pagerId: String) {
        KuiklyContextScheduler.runTask(pagerId)
    }

    override fun scheduleOnKuiklyThread(pagerId: String) {
        runTasks(pagerId)
    }
}

// 3. 保存接口实例（可以通过依赖注入等方式管理）
private var kuiklyThreadScheduler: KuiklyThreadScheduler = DefaultKuiklyThreadScheduler()

// 4. 将原函数实现委托给接口
internal actual inline fun platformScheduleOnKuiklyThread(pagerId: String) {
    kuiklyThreadScheduler.scheduleOnKuiklyThread(pagerId)
}

// 可选：提供设置调度器的方法（用于替换实现或测试）
fun setKuiklyThreadScheduler(scheduler: KuiklyThreadScheduler) {
    kuiklyThreadScheduler = scheduler
}

internal actual inline fun platformNotifyKuiklyException(t: Throwable) {
}