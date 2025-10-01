package com.tencent.kuikly.desktop

import javafx.application.Application
import javafx.application.Platform
import javafx.concurrent.Worker
import javafx.scene.Scene
import javafx.scene.layout.BorderPane
import javafx.scene.web.WebEngine
import javafx.scene.web.WebView
import javafx.stage.Stage
import netscape.javascript.JSObject

/**
 * 桌面端 JVM 宿主，使用 JavaFX WebView 作为渲染容器
 * - 通过注入全局函数 callKotlinMethod 供 Web 调用
 * - 通过执行 com.tencent.kuikly.core.nvi.registerCallNative 注入 Native 回调供 Kotlin 调用
 */
class DesktopApp : Application() {

    override fun start(primaryStage: Stage) {
        val root = BorderPane()
        val webView = WebView()
        val engine = webView.engine

        // 注入桥接：提供 callKotlinMethod 给 Web 调用 -> Kotlin Core
        class KotlinBridge {
            fun callKotlinMethod(methodId: Int, arg0: Any?, arg1: Any?, arg2: Any?, arg3: Any?, arg4: Any?, arg5: Any?) {
                // 直接转发给 Core 的 BridgeManager
                try {
                    // BridgeManager 是在 core 内部，使用反射以避免桌面模块直接依赖具体实现细节
                    val bridgeManager = Class.forName("com.tencent.kuikly.core.manager.BridgeManager")
                    val callMethod = bridgeManager.getMethod(
                        "callKotlinMethod",
                        Int::class.javaPrimitiveType,
                        Any::class.java,
                        Any::class.java,
                        Any::class.java,
                        Any::class.java,
                        Any::class.java,
                        Any::class.java,
                    )
                    callMethod.invoke(null, methodId, arg0, arg1, arg2, arg3, arg4, arg5)
                } catch (t: Throwable) {
                    t.printStackTrace()
                }
            }
        }

        engine.loadWorker.stateProperty().addListener { _, _, newState ->
            if (newState == Worker.State.SUCCEEDED) {
                // 将 KotlinBridge 挂到 window 下
                val window = engine.executeScript("window") as JSObject
                window.setMember("kotlinBridge", KotlinBridge())
                // 定义全局 callKotlinMethod -> 代理到 kotlinBridge
                engine.executeScript(
                    "window.callKotlinMethod = function(methodId,arg0,arg1,arg2,arg3,arg4,arg5){ kotlinBridge.callKotlinMethod(methodId,arg0,arg1,arg2,arg3,arg4,arg5); }"
                )
                // 注入 registerCallNative 回调：Kotlin(JS) 会调用此函数注册 pagerId 对应的回调
                engine.executeScript(
                    "if(!window.com){window.com={};} if(!window.com.tencent){window.com.tencent={};} if(!window.com.tencent.kuikly){window.com.tencent.kuikly={};} if(!window.com.tencent.kuikly.core){window.com.tencent.kuikly.core={};} if(!window.com.tencent.kuikly.core.nvi){window.com.tencent.kuikly.core.nvi={};}"
                )
                window.setMember("_nativeCallProxy", object {
                    fun register(pagerId: String, cb: JSObject) {
                        try {
                            // 在 JVM 端注册 NativeBridge，接管 toNative 调用
                            val nbClass = Class.forName("com.tencent.kuikly.core.nvi.NativeBridge")
                            val delegateInterface = nbClass.getDeclaredClasses().first { it.simpleName == "NativeBridgeDelegate" }

                            val nativeBridge = nbClass.getConstructor().newInstance()
                            val proxy = java.lang.reflect.Proxy.newProxyInstance(
                                delegateInterface.classLoader,
                                arrayOf(delegateInterface)
                            ) { _, method, args ->
                                if (method.name == "callNative") {
                                    val mid = args?.get(0) as Int
                                    val r0 = args.getOrNull(1)
                                    val r1 = args.getOrNull(2)
                                    val r2 = args.getOrNull(3)
                                    val r3 = args.getOrNull(4)
                                    val r4 = args.getOrNull(5)
                                    val r5 = args.getOrNull(6)
                                    // 回调到 Web 侧的 registerCallNative 所传的 cb，即 KuiklyRenderContextHandler.callNative
                                    return@newProxyInstance cb.call("call", mid, r0, r1, r2, r3, r4, r5)
                                }
                                null
                            }
                            nbClass.getField("delegate").set(nativeBridge, proxy)

                            // BridgeManager.registerNativeBridge(pagerId, nativeBridge)
                            val bm = Class.forName("com.tencent.kuikly.core.manager.BridgeManager")
                            val reg = bm.getMethod("registerNativeBridge", String::class.java, nbClass)
                            reg.invoke(null, pagerId, nativeBridge)
                        } catch (t: Throwable) {
                            t.printStackTrace()
                        }
                    }
                })
                engine.executeScript(
                    "window.com.tencent.kuikly.core.nvi.registerCallNative = function(pagerId, cb){ _nativeCallProxy.register(pagerId, cb); }"
                )
            }
        }

        root.center = webView
        val scene = Scene(root, 1200.0, 800.0)
        primaryStage.scene = scene
        primaryStage.title = "Kuikly Desktop"
        primaryStage.show()

        // 加载本地 h5App 页面（可替换为本地 dist 路径或 dev server）
        val indexUrl = javaClass.getResource("/index.html")
        if (indexUrl != null) {
            engine.load(indexUrl.toExternalForm())
        } else {
            // 兜底：从 dev server 加载
            engine.load("http://localhost:8080/")
        }
    }

    override fun stop() {
        Platform.exit()
    }
}

fun main(args: Array<String>) {
    Application.launch(DesktopApp::class.java, *args)
}


