import com.tencent.kuikly.core.render.web.IKuiklyRenderViewLifecycleCallback
import com.tencent.kuikly.core.render.web.core.IKuiklyRenderContextInitCallback
import com.tencent.kuikly.core.render.web.exception.ErrorReason

open class LifeCycleCallbakc : IKuiklyRenderViewLifecycleCallback{
    override fun onInit() {
    }

    override fun onPreloadDexClassFinish() {
    }

    override fun onInitCoreStart() {
    }

    override fun onInitCoreFinish() {
    }

    override fun onInitContextStart() {
    }

    override fun onInitContextFinish() {
    }

    override fun onCreateInstanceStart() {
    }

    override fun onCreateInstanceFinish() {
    }

    override fun onFirstFramePaint() {
    }

    override fun onResume() {
    }

    override fun onPause() {
    }

    override fun onDestroy() {
    }

    override fun onRenderException(
        throwable: Throwable,
        errorReason: ErrorReason
    ) {
    }
}