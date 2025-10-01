plugins {
    java
}

group = Publishing.kuiklyGroup
version = "1.0.0"

repositories {
    mavenCentral()
    google()
    mavenLocal()
}

// 简单的资源复制任务
tasks.register<Copy>("copyWebResources") {
    from("src/main/resources")
    into("$buildDir/resources/main")
}

tasks.named("processResources") {
    dependsOn("copyWebResources")
}