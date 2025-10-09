pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
    }
}

val buildFileName = "build.2.0.21.gradle.kts"

include(":androidApp")
include(":demo")

include(":core-annotations")
project(":core-annotations").buildFileName = buildFileName

include(":core-ksp")
project(":core-ksp").buildFileName = buildFileName

include(":core")
project(":core").buildFileName = buildFileName

include(":core-render-android")
project(":core-render-android").buildFileName = buildFileName

include(":core-render-web:base")
include(":core-render-web:h5")
include(":core-render-web:miniapp")

include(":h5App")
project(":h5App").buildFileName = buildFileName
include(":miniApp")
project(":miniApp").buildFileName = buildFileName


include(":compose")
project(":compose").buildFileName = buildFileName

// Desktop JVM app
include(":desktopApp")

// Desktop Web Render module (纯渲染层)
include(":desktopWebRender")

// Desktop Render Host (桌面端渲染宿主)
include(":desktopRenderHost")

// Desktop Render Engine (桌面端渲染引擎)
include(":desktop-render-engine")

// Desktop Render Layer (桌面端渲染层)
include(":desktop-render-layer")

rootProject.buildFileName = buildFileName