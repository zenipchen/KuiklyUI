plugins {
    kotlin("multiplatform")
}

kotlin {
    jvm {
        compilations.all {
            kotlinOptions.jvmTarget = "11"
        }
    }

    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation(project(":core"))
                implementation(project(":compose"))
                implementation("com.google.code.gson:gson:2.10.1")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
            }
        }
        
        val jvmTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}

// 创建完整 JAR 包（包含所有依赖）
tasks.register<Jar>("sdkFatJar") {
    group = "build"
    description = "创建 Mac Render SDK 的完整 JAR 包（包含所有依赖）"

    archiveBaseName.set("mac-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("fat")
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE


    // 包含编译后的类文件
    from(sourceSets["jvmMain"].output) {
        // 排除 kotlin.Metadata 类
        exclude("**/kotlin/Metadata.class")
        exclude("**/kotlin/Metadata\$*.class")
    }

    // 包含资源文件
    from(sourceSets["jvmMain"].resources) {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    }

    // 包含依赖的 JAR 文件（fat jar）
    from(configurations["jvmRuntimeClasspath"].map { if (it.isDirectory) it else zipTree(it) }) {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE

        // 排除特定的依赖包
        exclude("**/compose/runtime/**")
        exclude("**/compose/runtimeSaveable/**")
        exclude("**/kotlinx/coroutines/**")
        exclude("**/androidx/annotation/**")
        exclude("**/org/jetbrains/compose/collection/**")
        exclude("**/kotlinx-coroutines-core-*.jar")
        exclude("**/annotation-*.jar")
        exclude("**/collection-*.jar")

        // 排除 kotlin.Metadata 类
        exclude("**/kotlin/Metadata.class")
        exclude("**/kotlin/Metadata\$*.class")
    }

    // 排除重复的 META-INF 文件
    exclude("META-INF/*.SF", "META-INF/*.DSA", "META-INF/*.RSA")

    // 设置清单文件
    manifest {
        attributes(
            "Implementation-Title" to "Desktop Render SDK",
            "Implementation-Version" to "1.0.0",
            "Implementation-Vendor" to "Tencent Kuikly",
            "Main-Class" to "com.tencent.kuikly.mac.sdk.KuiklyMacRenderSdkKt",
            "Created-By" to "Gradle ${gradle.gradleVersion}"
        )
    }

    // 设置目标目录
    destinationDirectory.set(file("$buildDir/libs"))
}

// 创建轻量级 SDK jar (不包含依赖)
tasks.register<Jar>("sdkLightJar") {
    archiveBaseName.set("mac-render-sdk")
    archiveVersion.set("1.0.0")
    archiveClassifier.set("light")
    
    from(kotlin.jvm().compilations["main"].output.classesDirs)
    
    destinationDirectory.set(file("$buildDir/libs"))
}

