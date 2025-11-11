import androidx.compose.runtime.Composer
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.demo.pages.compose.TextDemo

actual fun invokeComposeFunc(clasName: String, func: String, target: Any, currentComposer: Composer) {
    val clazz = ComposeContainer::class.java.classLoader.loadClass("com.tencent.kuikly.demo.pages.compose.AccessibilityDemoKt")
    val method = clazz.getDeclaredMethod("AccessibilityDemo")
    method.isAccessible = true
    method.invoke(null)
}