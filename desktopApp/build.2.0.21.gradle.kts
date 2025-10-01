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
    // Kuikly 核心依赖
    implementation(project(":core"))
    implementation(project(":demo")) // 业务逻辑层
    
    // JCEF (Java Chromium Embedded Framework)
    implementation("me.friwi:jcefmaven:122.1.10")
    implementation("org.slf4j:slf4j-simple:2.0.9")
    
    // JSON 解析
    implementation("com.google.code.gson:gson:2.10.1")
}

application {
    mainClass.set("com.tencent.kuikly.desktop.MainKt")
}




