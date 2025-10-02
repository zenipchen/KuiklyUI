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
    // 核心依赖 - 排除有问题的 coroutines
    implementation(project(":core")) {
        exclude(group = "com.tencent.kuiklyx-open", module = "coroutines")
    }
    implementation(project(":compose")) {
        exclude(group = "com.tencent.kuiklyx-open", module = "coroutines")
    }
    
    // 桌面端 Web 渲染模块
    implementation(project(":desktopWebRender"))
    
    // JCEF (Java Chromium Embedded Framework)
    implementation("me.friwi:jcefmaven:121.1.11")
    implementation("org.slf4j:slf4j-simple:2.0.9")
    
    // JSON 解析
    implementation("com.google.code.gson:gson:2.10.1")
}

application {
    mainClass.set("com.tencent.kuikly.desktop.MainKt")
    
    // 添加 JVM 参数以支持 JCEF（Java 17 完整配置）
    applicationDefaultJvmArgs = listOf(
        // 增加内存以支持 Chromium
        "-Xmx1024m",
        
        // 使用 --add-exports 和 --add-opens 组合
        "--add-exports=java.desktop/sun.lwawt=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.awt=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.opengl=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.metal=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.font=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
        "--add-exports=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED",
        
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
            // 使用 --add-exports 和 --add-opens 组合
            "--add-exports=java.desktop/sun.lwawt=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.awt=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.opengl=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.metal=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.font=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
            "--add-exports=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED",
            
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
            "--add-opens=java.desktop/sun.lwawt=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.font=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d.pipe=ALL-UNNAMED",
            "--add-opens=java.desktop/sun.java2d.pipe.hw=ALL-UNNAMED"
        )
    }
}

