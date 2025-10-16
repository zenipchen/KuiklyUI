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
                
                // JCEF (Java Chromium Embedded Framework)
                implementation("me.friwi:jcefmaven:122.1.10")
                implementation("org.slf4j:slf4j-simple:2.0.9")
                
                // JSON 解析
                implementation("com.google.code.gson:gson:2.10.1")
                api("com.tencent.kuiklyx-open:coroutines:1.5.0-2.0.21") {
                    exclude(group = "com.tencent.kuikly-open", module = "core")
                    exclude(group = "com.tencent.kuikly-open", module = "core-annotations")
                }
            }
        }
    }
}

application {
    mainClass.set("com.tencent.kuikly.desktop.MainKt")
    
    // 添加 JVM 参数以支持 JCEF（Java 17 完整配置）
    applicationDefaultJvmArgs = listOf(
        // 优化内存使用 - 根据系统属性动态调整
        if (System.getProperty("kuikly.memory.optimization", "true").toBoolean()) {
            "-Xmx512m"  // 优化后使用 512MB
        } else {
            "-Xmx1024m" // 原始配置 1GB
        },
        
        // 关键：同时使用 --add-exports 和 --add-opens 确保 JCEF 可以访问 sun.awt.AWTAccessor
        "--add-exports=java.desktop/sun.awt=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.lwawt=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.opengl=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.metal=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.font=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED",
        "--add-exports=java.desktop/java.awt.peer=ALL-UNNAMED",
        
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED",
        "--add-opens=java.base/java.util.concurrent=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.awt=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.java2d=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.java2d.opengl=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.java2d.metal=ALL-UNNAMED",
        "--add-opens=java.desktop/java.awt.peer=ALL-UNNAMED",
        "--add-opens=java.desktop/java.awt.event=ALL-UNNAMED",
        "--add-opens=java.desktop/java.awt=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.lwawt=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.font=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
        "--add-opens=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED"
    )
}

kotlin {
    jvmToolchain(17)
}

// For debug builds, add JVM args
afterEvaluate {
    tasks.withType<JavaExec> {
        jvmArgs(
            // 关键：同时使用 --add-exports 和 --add-opens 确保 JCEF 可以访问 sun.awt.AWTAccessor
            "--add-exports=java.desktop/sun.awt=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.lwawt=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.opengl=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.metal=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.font=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED",
            "--add-exports=java.desktop/java.awt.peer=ALL-UNNAMED",
            
            "--add-opens=java.base/java.lang=ALL-UNNAMED",
            "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
            "--add-opens=java.base/java.util=ALL-UNNAMED",
            "--add-opens=java.base/java.util.concurrent=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.awt=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d.opengl=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d.metal=ALL-UNNAMED",
            "--add-opens=java.desktop/java.awt.peer=ALL-UNNAMED",
            "--add-opens=java.desktop/java.awt.event=ALL-UNNAMED",
            "--add-opens=java.desktop/java.awt=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.lwawt=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.font=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED"
        )
    }
}

// 创建 DesktopRenderViewSdk JAR 包
tasks.register<Jar>("desktopRenderSdkJar") {
    group = "build"
    description = "创建 DesktopRenderViewSdk 的独立 JAR 包"
    
    archiveBaseName.set("desktop-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("")
    
    // 包含编译后的类文件
    from(sourceSets["jvmMain"].output)
    
    // 包含资源文件
    from(sourceSets["jvmMain"].resources)
    
    // 包含依赖的 JAR 文件（fat jar）
    from(configurations["jvmRuntimeClasspath"].map { if (it.isDirectory) it else zipTree(it) })
    
    // 排除重复的 META-INF 文件
    exclude("META-INF/*.SF", "META-INF/*.DSA", "META-INF/*.RSA")
    
    // 设置清单文件
    manifest {
        attributes(
            "Implementation-Title" to "DesktopRenderViewSdk",
            "Implementation-Version" to "1.0.0",
            "Implementation-Vendor" to "Tencent Kuikly",
            "Main-Class" to "com.tencent.kuikly.desktop.DesktopRenderViewSdk",
            "Created-By" to "Gradle ${gradle.gradleVersion}"
        )
    }
    
    // 设置目标目录
    destinationDirectory.set(file("$buildDir/libs"))
}

// 创建轻量级 JAR 包（不包含依赖）
tasks.register<Jar>("desktopRenderSdkLightJar") {
    group = "build"
    description = "创建 DesktopRenderViewSdk 的轻量级 JAR 包（不包含依赖）"
    
    archiveBaseName.set("desktop-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("light")
    
    // 只包含编译后的类文件和资源文件
    from(sourceSets["jvmMain"].output)
    from(sourceSets["jvmMain"].resources)
    
    // 设置清单文件
    manifest {
        attributes(
            "Implementation-Title" to "DesktopRenderViewSdk",
            "Implementation-Version" to "1.0.0",
            "Implementation-Vendor" to "Tencent Kuikly",
            "Created-By" to "Gradle ${gradle.gradleVersion}"
        )
    }
    
    // 设置目标目录
    destinationDirectory.set(file("$buildDir/libs"))
}

