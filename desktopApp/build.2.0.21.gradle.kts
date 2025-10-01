plugins {
    kotlin("jvm")
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
    jvmToolchain(17)
}

val osName = System.getProperty("os.name").toLowerCase()
val arch = System.getProperty("os.arch").toLowerCase()
val jcefPlatform = when {
    osName.contains("mac") && arch.contains("aarch64") -> "macosx-arm64"
    osName.contains("mac") -> "macosx-x64"
    osName.contains("win") -> "windows-x64"
    else -> "linux-x64"
}

dependencies {
    // Kuikly 核心依赖（暂时不依赖 demo，先验证基础功能）
    implementation(project(":core"))
    // implementation(project(":demo")) // TODO: 等依赖问题解决后再启用
    
    // JCEF (Java Chromium Embedded Framework)
    implementation("me.friwi:jcefmaven:122.1.10")
    implementation("org.slf4j:slf4j-simple:2.0.9")
    
    // JSON 解析
    implementation("com.google.code.gson:gson:2.10.1")
}

application {
    mainClass.set("com.tencent.kuikly.desktop.MainKt")
    
    // 添加 JVM 参数以支持 JCEF 访问内部 API
    applicationDefaultJvmArgs = listOf(
        // 开放 AWT 内部 API 给 JCEF 使用
        "--add-opens", "java.desktop/sun.awt=ALL-UNNAMED",
        "--add-opens", "java.desktop/java.awt=ALL-UNNAMED",
        "--add-opens", "java.desktop/java.awt.peer=ALL-UNNAMED",
        
        // 可选：增加内存以支持 Chromium
        "-Xmx1024m"
    )
}




