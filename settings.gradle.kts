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


//include(":compose")
//project(":compose").buildFileName = buildFileName

// Desktop JVM app
//include(":desktopApp")

// Desktop Render Layer (桌面端渲染层)
//include(":desktop-render-layer")

// Desktop Render SDK (桌面端渲染 SDK)
//include(":desktop-render-sdk")

rootProject.buildFileName = buildFileName