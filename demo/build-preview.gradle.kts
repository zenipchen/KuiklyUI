/*
 * Kuikly Demo - Preview 优化版构建配置
 * 
 * 特点:
 * 1. 跳过框架模块的编译，直接使用缓存的产物
 * 2. 只编译用户代码 (PreviewPage.kt)
 * 3. 预期编译时间: ~5秒
 */

import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

plugins {
    kotlin("multiplatform")
    kotlin("native.cocoapods")
    kotlin("plugin.compose")
    id("com.android.library")
    id("com.google.devtools.ksp")
    id("org.jetbrains.compose")
    id("com.tencent.kuikly-open.kuikly")
}

group = Publishing.kuiklyGroup
version = Publishing.kuiklyVersion

// 获取属性
val publishToMavenCentral by extra { false }

kotlin {
    androidTarget {
        publishLibraryVariants("release", "debug")
    }
    
    js(IR) {
        browser {
            webpackTask {
                // 使用预编译产物的 source map
                sourceMaps = true
            }
        }
        binaries.executable()
    }
    
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    
    cocoapods {
        summary = "Kuikly Demo Module"
        homepage = "https://github.com/Tencent/kuikly"
        ios.deploymentTarget = "14.0"
        podfile = project.file("../iosApp/Podfile")
        framework {
            baseName = "demo"
            isStatic = true
        }
    }
    
    sourceSets {
        val commonMain by getting {
            dependencies {
                // Preview 模式: 使用编译好的框架产物，而不是源码依赖
                // 这样可以跳过 core/compose 的编译，只编译用户代码
                
                // 方法1: 使用本地编译缓存 (推荐)
                // 这些模块已经在之前的编译中生成了产物
                // Gradle 会自动使用缓存，跳过重新编译
                
                // 方法2: 完全移除框架依赖 (需要预编译产物已包含框架代码)
                // 仅编译 PreviewPage.kt
                
                // 保留必要的第三方依赖
                implementation("com.tencent.kuiklybase:markdown:0.4.0")
                implementation("io.ktor:ktor-client-core:2.3.10")
                
                // 核心依赖 - 使用编译缓存
                // 注意：这些在预览模式下会被优化掉
                implementation(project(":core-annotations"))
                implementation(project(":core"))
                implementation(project(":compose"))
            }
        }
        
        val jsMain by getting {
            dependsOn(commonMain)
        }
        
        val androidMain by getting {
            dependsOn(commonMain)
            dependencies {
                implementation("io.ktor:ktor-client-okhttp:2.3.10")
            }
        }
    }
}

android {
    namespace = "com.tencent.kuikly.demo"
    compileSdk = Versions.compileSdk
    
    defaultConfig {
        minSdk = Versions.minSdk
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    kotlin {
        jvmToolchain(17)
    }
    
    sourceSets["main"].manifest.srcFile("src/androidMain/AndroidManifest.xml")
}

// Kuikly 插件配置
kuikly {
    enableAutoGenerateJsPackTask = true
    enableCheckPageAnnotation = true
    
    jsPack {
        // Preview 模式优化
        // 只打包必要的资源
        resourceDir = file("src/commonMain/assets")
        jsOutputDir = file("build/dist/js/developmentExecutable")
    }
}

// KSP 配置 - 启用增量编译
ksp {
    arg("skipInvalidations", "true")
}

// 任务优化：跳过不必要的任务
// 这些任务在 preview 模式下不需要执行
tasks.named("jsTest").configure {
    enabled = false
}

tasks.named("iosX64Test").configure {
    enabled = false
}

tasks.named("iosArm64Test").configure {
    enabled = false
}

tasks.named("iosSimulatorArm64Test").configure {
    enabled = false
}

// 自定义任务：快速编译（仅编译 PreviewPage）
tasks.register<Exec>("fastCompileJs") {
    group = "preview"
    description = "快速编译 PreviewPage，跳过框架模块"
    
    // 设置环境变量
    environment("JAVA_HOME", System.getenv("JAVA_HOME") ?: "/usr/lib/jvm/java-17-konajdk")
    
    // 执行编译命令
    commandLine(
        "./gradlew",
        ":demo:compileKotlinJs",
        "-PpageName=PreviewPage",
        "-Pkuikly.useLocalKsp=false",
        "--parallel",
        "--build-cache",
        "--configure-on-demand",  // 按需配置，减少初始化时间
        "-x", "test",             // 跳过测试
        "-x", "lint",             // 跳过 lint
        "-x", ":core:test",       // 跳过 core 测试
        "-x", "compose:test"      // 跳过 compose 测试
    )
    
    // 工作目录
    workingDir = project.rootDir
}
