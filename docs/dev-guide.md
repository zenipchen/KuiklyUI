# Kuikly 团队开发指南

## 1. 项目概述

Kuikly 是基于 Kotlin Multiplatform 的 UI 与逻辑全面跨端综合解决方案，支持 Android、iOS、鸿蒙、Web 和小程序等多个平台。

## 2. 开发环境准备

### 2.1 必备工具

- **Android Studio** (推荐最新版本)
  - 如果 Android Studio 版本 >= 2024.2.1，需要将 Gradle JDK 切换为 JDK17
  - 切换路径：Android Studio -> Settings -> Build,Execution,Deployment -> Build Tools -> Gradle -> Gradle JDK
- **JDK 17** (主要开发版本)
- **JDK 11** (用于 Kotlin 1.3.10/1.4.20)
- **XCode** 和 **CocoaPods** (iOS 开发)
- **DevEco Studio 5.1.0+** (鸿蒙开发, API Version >= 18)

### 2.2 环境配置

详细配置步骤参考：[环境搭建文档](https://kuikly.tds.qq.com/QuickStart/env-setup.html)

## 3. 代码仓库管理

### 3.1 分支管理策略

- **main**: 主分支，保持稳定，仅接受经过完整测试的合并
- **develop**: 开发分支，日常开发的集成分支
- **feature/xxx**: 功能分支，从 develop 分支创建
- **bugfix/xxx**: 修复分支，用于紧急 bug 修复
- **release/x.x.x**: 发布分支，从 develop 分支创建

### 3.2 分支命名规范

```
feature/用户名/功能描述
bugfix/用户名/问题描述
release/版本号
```

示例：
- `feature/zhenhua/scroll_optimization`
- `bugfix/tom/fix_layout_crash`
- `release/2.1.0`

### 3.3 提交规范

使用规范的 commit message 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

**示例：**
```
feat(compose): 新增滚动性能优化

- 优化 LazyColumn 的渲染逻辑
- 减少不必要的重组次数

Closes #123
```

## 4. 开发流程

### 4.1 需求接收
1. 需求评审，明确需求细节
2. 创建对应的需求文档（参考 requirement-rules.md）
3. 技术方案设计（参考 project-arch.md）

### 4.2 开发流程
1. 从 develop 分支创建 feature 分支
2. 本地开发并自测
3. 编写单元测试（参考 test-rules.md）
4. 提交代码并推送到远程仓库
5. 发起 Pull Request/Merge Request
6. 代码评审（参考 ai-code-review-rules.md）
7. 合并到 develop 分支

### 4.3 发布流程
参考 release-rules.md

## 5. Kuikly 项目结构详解

### 5.1 完整目录结构

```
KuiklyUI/
├── core/                           # 跨平台核心模块 ⭐
│   ├── src/
│   │   ├── commonMain/kotlin/      # 共享代码（Kotlin）
│   │   │   └── com/tencent/kuikly/core/
│   │   │       ├── pager/          # Pager 基类和生命周期
│   │   │       ├── base/           # 基础类（View, Attr, Event）
│   │   │       ├── views/          # 内置视图组件
│   │   │       ├── reactive/       # 响应式系统
│   │   │       ├── layout/         # Flexbox 布局引擎
│   │   │       ├── module/         # 模块通信
│   │   │       ├── nvi/            # Native Bridge
│   │   │       └── utils/          # 工具类
│   │   ├── androidMain/            # Android 平台实现
│   │   ├── iosMain/                # iOS 平台实现
│   │   ├── ohosArm64Main/          # 鸿蒙平台实现
│   │   └── jsMain/                 # Web/小程序平台实现
│   └── build.gradle.kts            # KMP 构建配置
│
├── compose/                        # Compose DSL 模块 ⭐
│   ├── src/
│   │   ├── commonMain/kotlin/
│   │   │   └── com/tencent/kuikly/compose/
│   │   │       ├── foundation/     # 基础组件
│   │   │       ├── material3/      # Material3 组件
│   │   │       ├── ui/             # UI 核心
│   │   │       ├── ComposeContainer.kt  # Compose容器
│   │   │       └── extension/      # Kuikly 扩展
│   │   ├── androidMain/
│   │   ├── nativeMain/             # iOS/鸿蒙共享
│   │   └── jsMain/
│   └── build.gradle.kts
│
├── core-annotations/               # 注解定义 📝
│   └── src/commonMain/kotlin/
│       └── com/tencent/kuikly/core/annotations/
│           └── Page.kt             # @Page 注解
│
├── core-ksp/                       # KSP 注解处理器 🔧
│   └── src/main/kotlin/
│       └── com/tencent/kuikly/core/ksp/
│           ├── KuiklyCoreProcessorProvider.kt
│           └── HotPreviewProcessor.kt
│
├── core-render-android/            # Android 渲染器 📱
│   └── src/main/                   # Android View 渲染实现
│
├── core-render-ios/                # iOS 渲染器 🍎
│   ├── Core/                       # UIKit 渲染实现
│   ├── Extension/
│   └── Handler/
│
├── core-render-ohos/               # 鸿蒙渲染器 🔷
│   └── src/                        # ArkUI 渲染实现
│
├── core-render-web/                # Web 渲染器 🌐
│   ├── base/                       # 基础 DOM 渲染
│   ├── h5/                         # H5 特定
│   └── miniapp/                    # 小程序特定
│
├── demo/                           # 示例代码 📚
│   └── src/commonMain/kotlin/
│       └── com/tencent/kuikly/demo/pages/
│           ├── demo/               # 自研 DSL 示例
│           └── compose/            # Compose DSL 示例
│
├── androidApp/                     # Android 宿主 App
│   ├── src/main/
│   └── build.gradle.kts
│
├── iosApp/                         # iOS 宿主 App
│   └── iosApp.xcworkspace
│
├── ohosApp/                        # 鸿蒙宿主 App
│   └── entry/
│
├── h5App/                          # H5 宿主 App
│   └── src/
│
├── miniApp/                        # 微信小程序宿主
│   └── pages/
│
├── buildSrc/                       # 构建脚本和配置
│   └── src/main/kotlin/
│       ├── Version.kt              # 版本管理
│       └── MavenConfig.kt          # Maven 配置
│
├── build.gradle.kts                # 根项目构建文件
├── settings.gradle.kts             # 项目设置
├── gradle.properties               # Gradle 配置
│
├── build.2.0.21.gradle.kts        # Kotlin 2.0.21 配置
├── build.1.9.22.gradle.kts        # Kotlin 1.9.22 配置
├── build.1.8.21.gradle.kts        # 其他版本配置
├── 2.0.21_test_publish.sh         # 测试发布脚本
│
└── docs/                           # 项目文档
    ├── README.md                   # 文档中心
    ├── kuikly-code-examples.md     # 代码示例大全
    ├── project-arch.md             # 技术架构
    └── ...                         # 其他规范文档
```

### 5.2 核心模块说明

#### 5.2.1 core 模块（跨平台核心）

**包名**: `com.tencent.kuikly.core.*`

**主要功能**:
- **pager/** - 页面管理和生命周期
  - `Pager.kt` - 页面基类
  - `IPager.kt` - 页面接口
  - `PagerManager.kt` - 页面管理器

- **reactive/** - 响应式系统
  - `ObservableProperty.kt` - 可观察属性
  - `ObservableList.kt` - 可观察列表
  - `ReactiveObserver.kt` - 观察者

- **views/** - 内置视图组件
  - `View.kt`, `Text.kt`, `Image.kt` - 基础组件
  - `ListView.kt`, `ScrollView.kt` - 容器组件
  - `ios/` - iOS 特定组件

- **layout/** - Flexbox 布局引擎
  - `FlexLayout.kt` - 布局算法
  - `FlexNode.kt` - 布局节点
  - `FlexStyle.kt` - 布局样式

#### 5.2.2 compose 模块（Compose 支持）

**包名**: `com.tencent.kuikly.compose.*`

**基于**: Jetpack Compose 1.7.3（从 androidx.compose 修改为 com.tencent.kuikly.compose）

**主要功能**:
- **foundation/** - 基础组件（Column, Row, Box, LazyColumn 等）
- **material3/** - Material3 组件（Button, Text, Card 等）
- **ui/** - UI 核心（Modifier, State, Effect 等）
- **ComposeContainer.kt** - Compose 和 Kuikly 的桥接

#### 5.2.3 注解处理模块

**core-annotations** - 定义注解:
```kotlin
@Page(name = "MyPage", supportInLocal = true, moduleId = "module1")
```

**core-ksp** - KSP 处理器:
- 扫描 @Page 注解，生成 `KuiklyCoreEntry.kt`
- 扫描 @HotPreview 注解，生成预览 Pager

### 5.3 配置文件说明

#### gradle.properties
```properties
# Gradle JVM 配置
org.gradle.jvmargs=-Xmx5120M
org.gradle.workers.max=4
org.gradle.caching=true

# Kotlin 配置
kotlin.code.style=official

# Android 配置
android.useAndroidX=true
android.enableJetifier=true

# KMP 配置
kotlin.mpp.enableCInteropCommonization=true
kotlin.native.binary.sourceInfoType=libbacktrace

# KSP 配置
ksp.incremental=false

# Compose 配置
jetbrains.compose.compiler.version=1.5.14.1
compose.compiler.reflection=false

# JS 配置
kotlin.js.webpack.major.version=4
```

#### build.gradle.kts (core 模块)
```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("native.cocoapods")
    id("com.android.library")
    id("maven-publish")
}

kotlin {
    // 目标平台
    jvm()
    androidTarget()
    ios()
    iosSimulatorArm64()
    iosX64()
    js(IR) {
        browser()
        binaries.executable()
    }
    
    // 源集配置
    sourceSets {
        val commonMain by getting {
            dependencies {
                // 跨平台依赖
            }
        }
        val androidMain by getting
        val iosMain by getting
        val jsMain by getting
    }
}

android {
    compileSdk = 30
    defaultConfig {
        minSdk = 21
        targetSdk = 30
    }
}
```

## 6. Kuikly 开发实战

### 6.1 创建新页面

#### 6.1.1 自研 DSL 页面

**步骤 1**: 创建 Pager 类

在 `demo/src/commonMain/kotlin/com/tencent/kuikly/demo/pages/` 下创建：

```kotlin
package com.tencent.kuikly.demo.pages

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.reactive.handler.observable
import com.tencent.kuikly.core.views.Text
import com.tencent.kuikly.core.views.View

@Page("MyNewPage")
internal class MyNewPage : Pager() {
    
    var message: String by observable("Hello Kuikly")
    var count: Int by observable(0)
    
    override fun willInit() {
        super.willInit()
        // 初始化逻辑
    }
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    flex(1f)
                    flexDirectionColumn()
                    justifyContentCenter()
                    alignItemsCenter()
                    backgroundColor(Color.WHITE)
                }
                
                Text {
                    attr {
                        text(ctx.message)
                        fontSize(24f)
                        color(Color.BLACK)
                        marginBottom(20f)
                    }
                }
                
                View {
                    attr {
                        width(120f)
                        height(50f)
                        backgroundColor(Color.BLUE)
                        borderRadius(8f)
                        allCenter()
                    }
                    Text {
                        attr {
                            text("点击 (${ctx.count})")
                            color(Color.WHITE)
                        }
                    }
                    event {
                        click {
                            ctx.count++
                            ctx.message = "Clicked ${ctx.count} times"
                        }
                    }
                }
            }
        }
    }
}
```

**步骤 2**: 编译项目

KSP 会自动扫描 @Page 注解并生成入口代码到 `KuiklyCoreEntry.kt`

**步骤 3**: 运行查看

在 Android/iOS App 中可以通过页面名称 "MyNewPage" 跳转到该页面

#### 6.1.2 Compose DSL 页面

**步骤 1**: 创建 ComposeContainer

```kotlin
package com.tencent.kuikly.demo.pages.compose

import androidx.compose.runtime.*
import com.tencent.kuikly.compose.*
import com.tencent.kuikly.compose.foundation.layout.*
import com.tencent.kuikly.compose.material3.*
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.core.annotations.Page
import de.drick.compose.hotpreview.HotPreview

@Page("MyComposePage")
internal class MyComposePage : ComposeContainer() {
    
    override fun willInit() {
        super.willInit()
        setContent {
            MyComposeContent()
        }
    }
}

@HotPreview  // 支持热预览
@Composable
fun MyComposeContent() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Count: $count",
            fontSize = 24.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

**步骤 2**: 编译查看

KSP 会生成两个入口：
- `MyComposePage` - 实际页面
- `MyComposeContentPreviewPager` - 热预览页面（自动生成）

### 6.2 开发调试

#### 6.2.1 Android 调试

```bash
# 1. 连接 Android 设备或启动模拟器

# 2. 运行 Android App
./gradlew :androidApp:installDebug

# 或在 Android Studio 中
# Configuration 选择 androidApp
# Run 'androidApp'

# 3. 查看日志
adb logcat | grep Kuikly
```

#### 6.2.2 iOS 调试

```bash
# 1. 安装 CocoaPods 依赖
cd iosApp
pod install --repo-update

# 2. 使用 Android Studio 运行
# Configuration 选择 iOSApp
# Run 'iOSApp'

# 或使用 Xcode
open iosApp.xcworkspace
# 在 Xcode 中 Run
```

**注意**: iOS 编译时需要设置 `User Script Sandboxing` 为 `No`

#### 6.2.3 鸿蒙调试

```bash
# 1. 编译鸿蒙跨平台产物
./2.0_ohos_test_publish.sh

# 2. 使用 DevEco Studio 打开 ohosApp
# 连接真机或启动模拟器

# 3. 配置签名
# File -> Project Structure -> Signing Configs

# 4. Run 'entry'
```

### 6.3 热重载和预览

#### 6.3.1 HotPreview 使用

对于 Compose DSL 页面，使用 @HotPreview 支持快速预览：

```kotlin
@HotPreview
@Composable
fun UserCard(
    name: String = "张三",  // 提供默认值便于预览
    age: Int = 25
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("姓名: $name")
            Text("年龄: $age")
        }
    }
}

// KSP 会自动生成 UserCardPreviewPager
// 可以在 App 中直接跳转查看效果
```

### 6.4 版本切换

Kuikly 支持多个 Kotlin 版本：

```bash
# 当前默认 Kotlin 2.0.21
./gradlew build

# 使用其他版本（修改符号链接或脚本）
# 例如切换到 1.9.22
cp build.1.9.22.gradle.kts build.gradle.kts
./gradlew build

# 使用测试发布脚本
./2.0.21_test_publish.sh      # Kotlin 2.0.21
./1.9.22_test_publish.sh      # Kotlin 1.9.22
./1.8.21_test_publish.sh      # Kotlin 1.8.21
```

### 6.5 常见问题排查

#### 6.5.1 KSP 生成问题

**问题**: @Page 注解的类没有被识别

**解决**:
```bash
# 清理重新构建
./gradlew clean
./gradlew build

# 查看生成的文件
find . -name "KuiklyCoreEntry.kt"
```

#### 6.5.2 iOS 编译问题

**问题**: Pod install 失败

**解决**:
```bash
# 更新 CocoaPods repo
cd iosApp
pod repo update
pod install --repo-update

# 如果还是失败，删除缓存重试
rm -rf Pods
rm Podfile.lock
pod install
```

#### 6.5.3 鸿蒙编译问题

**问题**: 编译鸿蒙产物失败

**解决**:
```bash
# 确保使用 Mac 系统（鸿蒙编译仅支持 Mac）
# 检查 JDK 版本是 17
java -version

# 清理重新编译
./gradlew clean
./2.0_ohos_test_publish.sh
```

## 7. 编码规范

详细编码规范参考：user-rules.md

### 7.1 快速checklist

开发 Kuikly 页面时的检查项：

**自研 DSL**:
- [ ] 类名以 Page 或 Pager 结尾
- [ ] 使用 @Page 注解
- [ ] 继承 Pager 类
- [ ] 响应式属性使用 `by observable`
- [ ] body() 中使用 `val ctx = this`
- [ ] 使用 vif/vfor 进行条件/列表渲染

**Compose DSL**:
- [ ] 类名以 Page 或 Pager 结尾
- [ ] 使用 @Page 注解
- [ ] 继承 ComposeContainer 类
- [ ] 在 willInit() 中调用 setContent
- [ ] 可复用组件加 @HotPreview
- [ ] 正确使用 remember 和 mutableStateOf

**跨平台**:
- [ ] 平台特定代码使用 expect/actual
- [ ] 使用 PlatformUtils 进行平台判断
- [ ] iOS 特定组件用 vif 包裹

### 6.1 Kotlin 编码规范
- 遵循 [Kotlin 官方编码规范](https://kotlinlang.org/docs/coding-conventions.html)
- 使用 4 空格缩进
- 类名使用大驼峰命名法（PascalCase）
- 函数和变量使用小驼峰命名法（camelCase）
- 常量使用全大写加下划线（UPPER_SNAKE_CASE）

### 6.2 代码注释
- 公共 API 必须包含 KDoc 注释
- 复杂逻辑需要添加必要的行内注释
- 注释应该解释"为什么"而不是"是什么"

## 7. 测试规范

### 7.1 测试类型
- **单元测试**: 针对单个函数或类的测试
- **集成测试**: 针对模块间交互的测试
- **UI 测试**: 针对用户界面的测试

### 7.2 测试覆盖率
- 核心模块测试覆盖率 >= 80%
- 公共 API 测试覆盖率 >= 90%

详细测试规范参考：test-rules.md

## 8. 代码审查

### 8.1 审查要点
- 代码功能是否符合需求
- 代码是否遵循编码规范
- 是否有潜在的性能问题
- 是否有安全隐患
- 测试是否充分

详细代码评审规范参考：ai-code-review-rules.md

## 9. 性能优化

### 9.1 性能指标
- **启动时间**: 首屏渲染时间 < 1s
- **内存占用**: 
  - Android 增量 < 300KB
  - iOS 增量 < 1.2MB
- **帧率**: 保持 60fps

### 9.2 优化建议
- 避免不必要的重组（Recomposition）
- 使用 remember 缓存计算结果
- 合理使用 LaunchedEffect 和 DisposableEffect
- 注意内存泄漏

## 10. 文档规范

### 10.1 文档类型
- 需求文档（PRD）
- 技术方案文档
- API 文档
- 开发日志
- 发布说明

### 10.2 文档维护
- 代码变更时同步更新文档
- 重要决策需要记录在文档中
- 定期审查和更新文档

## 11. 问题反馈与沟通

### 11.1 问题追踪
- 使用 GitHub Issues 追踪 bug 和功能请求
- Issue 标题应简洁明确
- 提供复现步骤和环境信息

### 11.2 沟通渠道
- 技术讨论：GitHub Discussions
- 日常沟通：企业微信/钉钉
- 紧急问题：电话/即时通讯

## 12. 持续集成/持续部署 (CI/CD)

### 12.1 CI 流程
- 代码提交触发自动构建
- 运行单元测试和集成测试
- 代码质量检查（Lint、静态分析）
- 生成测试报告

### 12.2 CD 流程
- 自动发布测试版本
- 生成发布产物
- 更新文档网站

## 13. 安全规范

参考 security-rules.md

## 14. 常见问题

详见：[Kuikly QA 汇总](https://kuikly.tds.qq.com/QA/kuikly-qa.html)

## 15. 资源链接

- [官方文档](https://kuikly.tds.qq.com/)
- [快速开始](https://kuikly.tds.qq.com/QuickStart/hello-world.html)
- [API 文档](https://kuikly.tds.qq.com/API/components/override.html)
- [应用案例](https://kuikly.tds.qq.com/Introduction/application_cases.html)
- [Roadmap 2025](https://kuikly.tds.qq.com/Blog/roadmap2025.html)

---

**文档维护者**: Kuikly 团队  
**最后更新**: 2025-09-30
