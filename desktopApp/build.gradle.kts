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

dependencies {
    implementation(project(":core"))
    implementation(project(":compose"))
    implementation(project(":core-render-web:base"))
    implementation(project(":core-render-web:h5"))
    
    // 使用 Swing，无需额外的 GUI 依赖
    // Swing 是 Java 标准库的一部分
}

application {
    mainClass.set("com.tencent.kuikly.desktop.MainKt")
}

kotlin {
    jvmToolchain(17)
}


