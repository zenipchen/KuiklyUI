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
    implementation("org.openjfx:javafx-controls:21.0.3:${System.getProperty("os.name").lowercase().let { if (it.contains("mac")) "mac-aarch64" else if (it.contains("win")) "win" else "linux" }}")
    implementation("org.openjfx:javafx-web:21.0.3:${System.getProperty("os.name").lowercase().let { if (it.contains("mac")) "mac-aarch64" else if (it.contains("win")) "win" else "linux" }}")
}

application {
    mainClass.set("com.tencent.kuikly.desktop.MainKt")
}

kotlin {
    jvmToolchain(17)
}


