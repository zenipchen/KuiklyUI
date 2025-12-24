plugins {
    kotlin("multiplatform")
    application
}

group = Publishing.kuiklyGroup
version = "1.0.0"

repositories {
    mavenCentral()
    google()
    mavenLocal()
}

kotlin {
    jvm {
        compilations.all {
            kotlinOptions {
                jvmTarget = "17"
                freeCompilerArgs += "-Xjvm-default=all"
            }
        }
    }
    
    sourceSets {
        val jvmMain by getting {
            dependencies {
                // 核心依赖 - 排除有问题的 coroutines
                implementation(project(":core")) {
                    exclude(group = "com.tencent.kuiklyx-open", module = "coroutines")
                }
                implementation(project(":compose")) {
                    exclude(group = "com.tencent.kuiklyx-open", module = "coroutines")
                }
                
                // Demo 模块 - 包含 HelloWorldPage 等示例页面
                implementation(project(":demo"))
                
                // Mac 渲染 SDK - 通过 HTTP 与 PreviewMacApp 通信
                implementation(project(":mac-render-sdk"))
                
                // JSON 解析
                implementation("com.google.code.gson:gson:2.10.1")
                
                // Coroutines
                api("com.tencent.kuiklyx-open:coroutines:1.5.1-2.0.21") {
                    exclude(group = "com.tencent.kuikly-open", module = "core")
                    exclude(group = "com.tencent.kuikly-open", module = "core-annotations")
                }
                
                // Swing UI
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-swing:1.7.3")
            }
        }
    }
}

kotlin {
    jvmToolchain(17)
}

application {
    mainClass.set("com.tencent.kuikly.desktop.mac.MainKt")
    
    applicationDefaultJvmArgs = listOf(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}

// 配置 run 任务使用 JVM 编译的类路径
tasks.named<JavaExec>("run") {
    val jvmJar = tasks.named("jvmJar")
    dependsOn(jvmJar)
    
    val jvmRuntimeClasspath by configurations.getting
    classpath = files(jvmJar) + jvmRuntimeClasspath
    
    mainClass.set("com.tencent.kuikly.desktop.mac.MainKt")
    
    jvmArgs(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}

// 自定义运行任务
tasks.register<JavaExec>("runApp") {
    group = "application"
    description = "运行 DesktopAppWithMacRender 应用"
    
    val jvmJar = tasks.named("jvmJar")
    dependsOn(jvmJar)
    
    val jvmRuntimeClasspath by configurations.getting
    classpath = files(jvmJar) + jvmRuntimeClasspath
    
    mainClass.set("com.tencent.kuikly.desktop.mac.MainKt")
    workingDir = projectDir
    
    jvmArgs(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}

// 测试 TextFieldDemo 预览
tasks.register<JavaExec>("testTextFieldDemo") {
    group = "application"
    description = "测试 TextFieldDemo 页面预览"
    
    val jvmJar = tasks.named("jvmJar")
    dependsOn(jvmJar)
    
    val jvmRuntimeClasspath by configurations.getting
    classpath = files(jvmJar) + jvmRuntimeClasspath
    
    mainClass.set("com.tencent.kuikly.desktop.mac.TestTextFieldDemoKt")
    workingDir = projectDir
    
    standardInput = System.`in`
    
    jvmArgs(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}

// 测试预览配置参数功能
tasks.register<JavaExec>("testPreviewConfig") {
    group = "application"
    description = "测试预览配置参数功能"
    
    val jvmJar = tasks.named("jvmJar")
    dependsOn(jvmJar)
    
    val jvmRuntimeClasspath by configurations.getting
    classpath = files(jvmJar) + jvmRuntimeClasspath
    
    mainClass.set("com.tencent.kuikly.desktop.mac.TestPreviewConfigKt")
    workingDir = projectDir
    
    standardInput = System.`in`
    
    jvmArgs(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}

// 测试 updatePreviewConfig 功能（带自动测试）
tasks.register<JavaExec>("testUpdatePreviewConfig") {
    group = "application"
    description = "测试 updatePreviewConfig 功能（带自动测试）"
    
    val jvmJar = tasks.named("jvmJar")
    dependsOn(jvmJar)
    
    val jvmRuntimeClasspath by configurations.getting
    classpath = files(jvmJar) + jvmRuntimeClasspath
    
    mainClass.set("com.tencent.kuikly.desktop.mac.TestUpdatePreviewConfigKt")
    workingDir = projectDir
    
    standardInput = System.`in`
    
    jvmArgs(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}

