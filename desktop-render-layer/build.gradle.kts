plugins {
    kotlin("multiplatform")
}

group = "com.tencent.kuikly"
version = "1.0.0"

repositories {
    mavenCentral()
    google()
    mavenLocal()
}

kotlin {
    js(IR) {
        browser {
            webpackTask {
                outputFileName = "desktopRenderLayer.js"
            }
        }
        binaries.executable()
    }
}

dependencies {
    "jsMainImplementation"(project(":core"))
    "jsMainImplementation"(project(":core-render-web:base"))
    "jsMainImplementation"(project(":core-render-web:h5"))
}