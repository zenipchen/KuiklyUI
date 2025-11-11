import androidx.compose.runtime.Composer
import com.tencent.kuikly.compose.ComposeContainer
import io.ktor.util.reflect.instanceOf
import java.lang.reflect.Method
import java.lang.reflect.Type

actual fun invokeComposeFunc(clasName: String, func: String, target: Any, currentComposer: Composer) {
    try {
        val clazz = target::class.java.classLoader.loadClass(clasName)
        val method = findMethod(clazz, func)

        if (method != null) {
            method.isAccessible = true
            val parameters = method.parameterTypes
            val parameterTypes = method.genericParameterTypes
            val args = arrayOfNulls<Any?>(parameters.size)

            // 识别 Compose 运行时参数的位置
            val composerIndex = parameters.indexOfLast { it == Composer::class.java }
            val hasComposer = composerIndex >= 0

            // 填充参数默认值
            for (i in parameters.indices) {
                args[i] = getDefaultValueForType(
                    parameters[i],
                    parameterTypes[i],
                    i,
                    parameters.size,
                    currentComposer,
                    hasComposer,
                    composerIndex
                )
            }

            // 调用方法
            if (java.lang.reflect.Modifier.isStatic(method.modifiers)) {
                method.invoke(null, *args)
            } else {
                var myTarget: Any? = target
                myTarget?.let {
                    if (!it.instanceOf(clazz.kotlin)) {
                        myTarget = clazz.constructors.firstOrNull()?.newInstance()
                    }
                }
                // 非静态方法，target 作为接收者，args 作为参数
                method.invoke(myTarget, *args)
            }
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

/**
 * 查找匹配的方法（考虑方法重载）
 */
private fun findMethod(clazz: Class<*>, methodName: String): Method? {
    return clazz.declaredMethods.firstOrNull { it.name == methodName }
}

/**
 * 根据参数类型获取默认值
 */
private fun getDefaultValueForType(
    paramType: Class<*>,
    genericType: Type,
    paramIndex: Int,
    totalParams: Int,
    currentComposer: Composer,
    hasComposer: Boolean,
    composerIndex: Int
): Any? {
    // 检查是否是 Compose 运行时参数
    // Compose 函数编译后，参数顺序通常是：
    // 1. 用户定义的参数
    // 2. changed 标志（Int 类型，可能有多个，每个用户参数对应一个）
    // 3. Composer（最后一个参数）

    val isComposerParam = paramType == Composer::class.java
    val isIntParam = paramType == Int::class.javaPrimitiveType || paramType == Int::class.java

    // 如果是 Composer 参数，使用传入的 currentComposer
    if (isComposerParam) {
        return currentComposer
    }

    // 检查是否是 changed 标志
    // changed 标志通常是 Int 类型，位于 Composer 之前
    // 如果存在 Composer，且当前 Int 参数在 Composer 之前，则可能是 changed 标志
    if (isIntParam && hasComposer && paramIndex < composerIndex) {
        // 计算在 Composer 之前有多少个 Int 参数
        // 如果这个 Int 参数紧邻 Composer 或者在 Composer 之前的连续 Int 序列中，可能是 changed 标志
        // 简化处理：如果 Int 在 Composer 之前，且距离 Composer 较近（比如在最后几个位置），则认为是 changed
        val distanceFromComposer = composerIndex - paramIndex
        // 假设 changed 标志通常在 Composer 之前的连续位置
        // 这里简化：如果 Int 在 Composer 之前且距离较近，认为是 changed 标志
        if (distanceFromComposer <= 10) { // 假设最多 10 个 changed 标志
            return 0 // changed 标志默认为 0
        }
    }

    // 根据基本类型返回默认值
    return when (paramType) {
        Boolean::class.javaPrimitiveType, Boolean::class.java -> false
        Byte::class.javaPrimitiveType, Byte::class.java -> 0.toByte()
        Short::class.javaPrimitiveType, Short::class.java -> 0.toShort()
        Int::class.javaPrimitiveType, Int::class.java -> 0
        Long::class.javaPrimitiveType, Long::class.java -> 0L
        Float::class.javaPrimitiveType, Float::class.java -> 0.0f
        Double::class.javaPrimitiveType, Double::class.java -> 0.0
        Char::class.javaPrimitiveType, Char::class.java -> '\u0000'
        String::class.java -> ""
        // 对于可空类型和对象类型，返回 null
        else -> {
            if (!paramType.isPrimitive) {
                null
            } else {
                null
            }
        }
    }
}