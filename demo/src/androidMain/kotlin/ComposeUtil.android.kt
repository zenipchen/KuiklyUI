import androidx.compose.runtime.Composer
import com.tencent.kuikly.compose.ComposeContainer

actual fun invokeComposeFunc(clasName: String, func: String, target: Any, currentComposer: Composer) {
    val clazz = ComposeContainer::class.java.classLoader.loadClass(clasName)
    clazz.declaredMethods.forEach { method ->
        if (method.name == func) {
            if (java.lang.reflect.Modifier.isStatic(method.modifiers)) {
                method.isAccessible = true
                method.invoke(null)
            } else {
                method.isAccessible = true
                method.invoke(target)
            }
            return@forEach
        }
    }
}