plugins {
    kotlin("multiplatform")
}

kotlin {
    js(IR) {
        moduleName = "KuiklyDesktopRenderEngine"
        // Output build products that support browser execution
        browser {
            webpackTask {
                outputFileName = "desktopRenderEngine.js"
            }

            commonWebpackConfig {
                output?.library = null // Don't export global objects, only export necessary entry functions
            }
        }
        // Output executable JS rather than library
        binaries.executable()
    }

    sourceSets {
        val jsMain by getting {
            dependencies {
                // Import web render modules
                implementation(project(":core-render-web:base"))
                implementation(project(":core-render-web:h5"))
                // Import core modules for desktop rendering
                implementation(project(":core"))
                implementation(project(":compose"))
            }
        }
    }
}
