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
                // 使用开发模式，禁用代码混淆
                mode = org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig.Mode.DEVELOPMENT
            }
        }
        binaries.executable()
    }
    
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(project(":core"))
                implementation(project(":core-render-web:base"))
                implementation(project(":core-render-web:h5"))
            }
        }
    }
}