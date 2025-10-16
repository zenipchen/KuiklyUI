plugins {
    kotlin("multiplatform")
    `java-library`
}

group = "com.tencent.kuikly"
version = "1.0.0"

repositories {
    mavenCentral()
    google()
    maven { url = uri("https://maven.pkg.jetbrains.space/public/p/compose/dev") }
    maven { url = uri("https://jitpack.io") }
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
                // Kotlin 标准库
                implementation("org.jetbrains.kotlin:kotlin-stdlib:2.1.21")
                
                // 协程支持
                implementation("com.tencent.kuiklyx-open:coroutines:1.5.0-2.0.21")
                
                // JSON 解析
                implementation("com.google.code.gson:gson:2.10.1")
                
                // 核心依赖
                implementation(project(":core"))
                implementation(project(":compose"))
            }
        }
    }
}

// 创建 SDK JAR 包任务
tasks.register<Jar>("sdkJar") {
    group = "build"
    description = "创建 Desktop Render SDK 的 JAR 包"
    
    archiveBaseName.set("desktop-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("")
    
    // 包含编译后的类文件
    from(sourceSets["jvmMain"].output)
    
    // 包含资源文件
    from(sourceSets["jvmMain"].resources) {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    }
    
    // 设置清单文件
    manifest {
        attributes(
            "Implementation-Title" to "Desktop Render SDK",
            "Implementation-Version" to "1.0.0",
            "Implementation-Vendor" to "Tencent Kuikly",
            "Created-By" to "Gradle ${gradle.gradleVersion}"
        )
    }
    
    // 设置目标目录
    destinationDirectory.set(file("$buildDir/libs"))
}

// 创建轻量级 JAR 包（不包含依赖）
tasks.register<Jar>("sdkLightJar") {
    group = "build"
    description = "创建 Desktop Render SDK 的轻量级 JAR 包（不包含依赖）"
    
    archiveBaseName.set("desktop-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("light")
    
    // 只包含编译后的类文件和资源文件
    from(sourceSets["jvmMain"].output)
    from(sourceSets["jvmMain"].resources) {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    }
    
    // 设置清单文件
    manifest {
        attributes(
            "Implementation-Title" to "Desktop Render SDK",
            "Implementation-Version" to "1.0.0",
            "Implementation-Vendor" to "Tencent Kuikly",
            "Created-By" to "Gradle ${gradle.gradleVersion}"
        )
    }
    
    // 设置目标目录
    destinationDirectory.set(file("$buildDir/libs"))
}

// 创建完整 JAR 包（包含所有依赖）
tasks.register<Jar>("sdkFatJar") {
    group = "build"
    description = "创建 Desktop Render SDK 的完整 JAR 包（包含所有依赖）"
    
    archiveBaseName.set("desktop-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("fat")
    
    // 包含编译后的类文件
    from(sourceSets["jvmMain"].output)
    
    // 包含资源文件
    from(sourceSets["jvmMain"].resources) {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    }
    
    // 包含依赖的 JAR 文件（fat jar）
    from(configurations["runtimeClasspath"].map { if (it.isDirectory) it else zipTree(it) }) {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    }
    
    // 排除重复的 META-INF 文件
    exclude("META-INF/*.SF", "META-INF/*.DSA", "META-INF/*.RSA")
    
    // 设置清单文件
    manifest {
        attributes(
            "Implementation-Title" to "Desktop Render SDK",
            "Implementation-Version" to "1.0.0",
            "Implementation-Vendor" to "Tencent Kuikly",
            "Main-Class" to "com.tencent.kuikly.desktop.sdk.KuiklyDesktopRenderSdk",
            "Created-By" to "Gradle ${gradle.gradleVersion}"
        )
    }
    
    // 设置目标目录
    destinationDirectory.set(file("$buildDir/libs"))
}

// 构建所有 JAR 包的任务
tasks.register("buildAllJars") {
    group = "build"
    description = "构建所有类型的 JAR 包"
    
    dependsOn("sdkJar", "sdkLightJar", "sdkFatJar")
}
