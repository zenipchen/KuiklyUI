import androidx.compose.runtime.Composer


expect fun invokeComposeFunc(clasName: String, func: String, target: Any, currentComposer: Composer)