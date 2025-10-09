plugins {
    kotlin("multiplatform")
}

kotlin {
    js(IR) {
        browser {
            webpackTask {
                outputFileName = "desktopRenderHost.js"
            }
            
            commonWebpackConfig {
                output?.library = null
            }
        }
        // 关键：添加 executable 配置
        binaries.executable()
    }
    
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(project(":core-render-web:base"))
                implementation(project(":core-render-web:h5"))
            }
        }
    }
}
