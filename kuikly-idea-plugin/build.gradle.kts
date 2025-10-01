plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij") version "1.17.4"
}

group = "com.tencent.kuikly"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    
    // Ktor Server (嵌入式 HTTP + WebSocket)
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-websockets:2.3.7")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-swing:1.7.3")
    
    // Logging
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test")
}

intellij {
    version.set("2024.2")
    type.set("IC") // IntelliJ IDEA Community
    plugins.set(listOf("org.jetbrains.kotlin"))
    
    // 启用 JCEF
    downloadSources.set(true)
}

tasks {
    patchPluginXml {
        sinceBuild.set("232")
        untilBuild.set("242.*")
        
        changeNotes.set("""
            <h3>1.0.0</h3>
            <ul>
                <li>🎉 初始版本发布</li>
                <li>✨ Kuikly 页面实时预览</li>
                <li>🔥 热重载支持</li>
                <li>📱 多设备尺寸支持</li>
                <li>🔧 Chrome DevTools 集成</li>
            </ul>
        """.trimIndent())
    }
    
    runIde {
        jvmArgs = listOf(
            "-Xmx2048m",
            "-Djdk.module.illegalAccess.silent=true"
        )
    }
    
    buildSearchableOptions {
        enabled = false // 加快构建速度
    }
    
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions {
            jvmTarget = "17"
            freeCompilerArgs = listOf("-Xjsr305=strict")
        }
    }
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

