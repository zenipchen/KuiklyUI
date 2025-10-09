plugins {
    kotlin("multiplatform")
}

kotlin {
    js(IR) {
        moduleName = "DesktopRenderLayer"
        browser {
            webpackTask {
                outputFileName = "desktopRenderLayer.js"
            }

            commonWebpackConfig {
                // 导出全局对象，让桌面应用可以访问
                output?.library = "DesktopRenderLayer"
                output?.libraryTarget = "umd"
            }
        }
        binaries.executable()
    }
    
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(kotlin("stdlib-js"))
                // 只依赖渲染层，不包含业务逻辑
                implementation(project(":core-render-web:base"))
                implementation(project(":core-render-web:h5"))
            }
        }
    }
}
