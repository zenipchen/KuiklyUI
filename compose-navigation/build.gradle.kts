plugins {
    kotlin("multiplatform")
    kotlin("plugin.compose")
    id("com.android.library")
    id("org.jetbrains.compose")
    id("maven-publish")
    signing
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = "1.8"
                freeCompilerArgs += "-Xjvm-default=all"
            }
        }
        publishLibraryVariantsGroupedByFlavor = true
        publishLibraryVariants("release")
    }

    sourceSets {
        commonMain.dependencies {
            // Kuikly Compose 核心
            api(project(":compose"))
            api(project(":core"))
            
            // Compose Runtime
            api(compose.runtime)
            api(compose.runtimeSaveable)
        }

        // Android Navigation Compose 支持
        val androidMain by getting {
            dependencies {
                // Jetpack Navigation Compose
                api("androidx.navigation:navigation-compose:2.7.7")
                
                // Lifecycle
                api("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")
                api("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
                
                // Activity Compose
                api("androidx.activity:activity-compose:1.8.2")
            }
        }
    }
}

// 配置Maven发布
publishing {
    repositories {
        val username = MavenConfig.getUsername(project)
        val password = MavenConfig.getPassword(project)
        if (username.isNotEmpty() && password.isNotEmpty()) {
            maven {
                credentials {
                    setUsername(username)
                    setPassword(password)
                }
                url = uri(MavenConfig.getRepoUrl(version as String))
            }
        } else {
            mavenLocal()
        }
    }

    publications.withType<MavenPublication>().configureEach {
        pom.configureMavenCentralMetadata()
        signPublicationIfKeyPresent(project)
    }
}

group = MavenConfig.GROUP
version = Version.getCoreVersion()

android {
    namespace = "com.tencent.kuikly.compose.navigation"
    compileSdk = 34
    defaultConfig {
        minSdk = 21
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}
