plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij.platform") version "2.0.1"
}

group = "com.tencent.kuikly"
version = "1.0.0"

repositories {
    mavenCentral()
    
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    // IntelliJ Platform
    intellijPlatform {
        local("/Applications/IntelliJ IDEA.app/Contents")
        
        // Plugin 依赖
        bundledPlugins("com.intellij.java")
        
        // IntelliJ Platform 提供的依赖
        instrumentationTools()
    }
    
    // Ktor Server (嵌入式 HTTP + WebSocket)
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-websockets:2.3.7")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
}

intellijPlatform {
    pluginConfiguration {
        name = "Kuikly Preview"
        version = "1.0.0"
        
        ideaVersion {
            sinceBuild = "241"
            untilBuild = "251.*"
        }
        
        changeNotes = """
            <h3>1.0.0</h3>
            <ul>
                <li>🎉 初始版本发布</li>
                <li>✨ Kuikly 页面实时预览</li>
                <li>🔥 热重载支持</li>
                <li>📱 多设备尺寸支持</li>
                <li>🔧 Chrome DevTools 集成</li>
            </ul>
        """.trimIndent()
    }
    
    instrumentCode = false
}

tasks {
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
