# Kuikly 实战代码示例

## 1. 项目核心概念

### 1.1 @Page 注解

Kuikly 使用 `@Page` 注解来标记页面类，KSP 会自动生成入口代码。

```kotlin
package com.tencent.kuikly.core.annotations

/**
 * Kuikly页面注解
 * @property name 页面名字（用于路由和标识）
 * @property supportInLocal 是否内置打包。true: 内置到宿主，false: 不内置
 * @property moduleId 页面所属模块ID，用于按模块维度打包
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.SOURCE)
annotation class Page(
    val name: String = "", 
    val supportInLocal: Boolean = false, 
    val moduleId: String = ""
)
```

### 1.2 两种 DSL 开发模式

Kuikly 支持两种UI开发模式：

#### 模式1：自研 DSL（继承 Pager）

```kotlin
package com.tencent.kuikly.demo.pages

import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.views.RichText
import com.tencent.kuikly.core.views.Span

/**
 * 自研 DSL 示例 - HelloWorld 页面
 */
@Page("HelloWorldPage")
internal class HelloWorldPage : Pager() {

    override fun body(): ViewBuilder {
        return {
            attr {
                backgroundColor(Color.WHITE)
                flexDirectionColumn()
                autoDarkEnable(false)
            }
            RichText {
                attr {
                    marginTop(30f)
                    lines(3)
                    textOverFlowTail()
                    color(Color.BLACK)
                    fontSize(16f)
                }
                Span {
                    text("我是第一个文本")
                }
                Span {
                    color(Color.RED)
                    fontSize(16f)
                    text("这是第二个文本")
                    fontWeightBold()
                    textDecorationLineThrough()
                }
            }
        }
    }
}
```

**自研 DSL 特点**：
- 继承 `Pager` 类
- 覆写 `body()` 方法返回 `ViewBuilder`
- 使用 `attr {}` 配置属性
- 使用 `event {}` 处理事件
- 使用内置视图组件：View、Text、Image、Button等
- Flexbox 布局系统

#### 模式2：Compose DSL（继承 ComposeContainer）

```kotlin
package com.tencent.kuikly.demo.pages.compose

import androidx.compose.runtime.*
import com.tencent.kuikly.compose.*
import com.tencent.kuikly.compose.foundation.layout.*
import com.tencent.kuikly.compose.material3.*
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.core.annotations.Page
import de.drick.compose.hotpreview.HotPreview

/**
 * Compose DSL 示例 - 无障碍功能演示
 */
@Page("AccessibilityDemo")
internal class AccessibilityDemoPager : ComposeContainer() {

    override fun willInit() {
        super.willInit()
        setContent {
            AccessibilityDemo()
        }
    }
}

@HotPreview  // HotPreview 注解支持热预览
@Composable
fun AccessibilityDemo() {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp)
    ) {
        item {
            Text(
                "无障碍功能演示",
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }
        
        item {
            DemoCard(title = "基础语义标签") {
                BasicSemanticsDemo()
            }
        }
    }
}

@Composable
private fun BasicSemanticsDemo() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .semantics {
                contentDescription = "这是一个可点击的卡片"
                role = Role.Button
            }
            .clickable { /* 处理点击事件 */ }
    ) {
        Text("点击我", modifier = Modifier.align(Alignment.Center))
    }
}
```

**Compose DSL 特点**：
- 继承 `ComposeContainer` 类
- 在 `willInit()` 中调用 `setContent {}`
- 使用标准 Compose API（`@Composable`, `remember`, `LaunchedEffect`等）
- 支持 `@HotPreview` 热预览功能
- Material3 组件支持

## 2. 自研 DSL 详细语法

### 2.1 基础视图组件

```kotlin
import com.tencent.kuikly.core.base.ViewBuilder
import com.tencent.kuikly.core.base.Color
import com.tencent.kuikly.core.views.*

fun exampleView(): ViewBuilder = {
    View {
        attr {
            width(300f)
            height(200f)
            backgroundColor(Color.WHITE)
            borderRadius(12f)
            padding(16f)
            margin(8f)
            
            // Flexbox 布局
            flexDirectionColumn()
            justifyContentCenter()
            alignItemsCenter()
        }
        
        Text {
            attr {
                text("标题文本")
                fontSize(18f)
                color(Color.BLACK)
                fontWeightBold()
            }
        }
        
        Image {
            attr {
                src("https://example.com/image.png")
                width(100f)
                height(100f)
                borderRadius(8f)
            }
        }
        
        event {
            click {
                println("View clicked")
            }
        }
    }
}
```

### 2.2 列表组件

```kotlin
import com.tencent.kuikly.core.reactive.collection.ObservableList
import com.tencent.kuikly.core.reactive.handler.observableList

@Page("ListDemo")
internal class ListDemoPage : Pager() {
    
    var dataList: ObservableList<String> by observableList()
    
    override fun willInit() {
        super.willInit()
        dataList.addAll(listOf("Item 1", "Item 2", "Item 3"))
    }
    
    override fun body(): ViewBuilder {
        return {
            ListView {
                attr {
                    flex(1f)
                    backgroundColor(Color.WHITE)
                }
                
                // 绑定数据源
                vfor(dataList) { item, index ->
                    View {
                        attr {
                            height(60f)
                            padding(16f)
                            alignItemsCenter()
                        }
                        Text {
                            attr {
                                text(item)
                                fontSize(16f)
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### 2.3 响应式状态管理

```kotlin
import com.tencent.kuikly.core.reactive.ObservableProperty
import com.tencent.kuikly.core.reactive.handler.observable

@Page("CounterPage")
internal class CounterPage : Pager() {
    
    // 响应式属性
    var count: Int by observable(0)
    var message: String by observable("Hello")
    
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
                
                // 显示计数
                Text {
                    attr {
                        text("Count: ${ctx.count}")
                        fontSize(24f)
                        marginBottom(20f)
                    }
                }
                
                // 增加按钮
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
                            text("增加")
                            color(Color.WHITE)
                            fontSize(16f)
                        }
                    }
                    event {
                        click {
                            ctx.count++  // 修改会自动触发UI更新
                        }
                    }
                }
            }
        }
    }
}
```

### 2.4 条件渲染与循环

```kotlin
override fun body(): ViewBuilder {
    val ctx = this
    return {
        View {
            attr {
                flex(1f)
                flexDirectionColumn()
            }
            
            // 条件渲染 - vif
            vif({ ctx.showContent }) {
                Text {
                    attr { text("内容可见") }
                }
            }
            
            // 循环渲染 - vfor
            vfor(ctx.items) { item, index ->
                View {
                    attr {
                        height(50f)
                        padding(10f)
                    }
                    Text {
                        attr {
                            text("${index + 1}. $item")
                        }
                    }
                }
            }
        }
    }
}
```

### 2.5 自定义组件

```kotlin
// 定义自定义视图
import com.tencent.kuikly.core.base.DeclarativeBaseView

class MyCustomView : DeclarativeBaseView() {
    
    var message: String by observable("")
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    backgroundColor(Color.YELLOW)
                    padding(16f)
                }
                Text {
                    attr {
                        text(ctx.message)
                        fontSize(18f)
                    }
                }
            }
        }
    }
}

// 使用自定义视图
@Page("CustomViewExample")
internal class CustomViewExamplePage : Pager() {
    
    var message = "Hello Custom View"
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            MyCustomView {
                attr {
                    width(300f)
                    height(200f)
                    message(ctx.message)
                }
                event {
                    click {
                        ctx.message = "Updated!"
                    }
                }
            }
        }
    }
}
```

### 2.6 模块通信（Module）

```kotlin
import com.tencent.kuikly.core.module.Module

// 定义模块
class TDFTestModule : Module() {
    companion object {
        const val MODULE_NAME = "TDFTestModule"
    }
    
    fun syncCall(
        param1: String,
        param2: Int,
        param3: Double,
        param4: Boolean
    ): String {
        return "Result: $param1 $param2 $param3 $param4"
    }
}

// 在 Pager 中使用模块
@Page("ModuleExample")
internal class ModuleExamplePage : Pager() {
    
    override fun createExternalModules(): Map<String, Module>? {
        val modules = HashMap<String, Module>()
        modules[TDFTestModule.MODULE_NAME] = TDFTestModule()
        return modules
    }
    
    fun testModule() {
        val module = getPager().acquireModule<TDFTestModule>(
            TDFTestModule.MODULE_NAME
        )
        val result = module.syncCall("test", 1, 2.0, true)
        println("Module result: $result")
    }
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    padding(16f)
                    allCenter()
                }
                Text {
                    attr { text("调用模块") }
                }
                event {
                    click {
                        ctx.testModule()
                    }
                }
            }
        }
    }
}
```

## 3. Compose DSL 详细语法

### 3.1 基础 Composable

```kotlin
import androidx.compose.runtime.*
import com.tencent.kuikly.compose.foundation.layout.*
import com.tencent.kuikly.compose.material3.*
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.unit.dp

@Composable
fun BasicComposeExample() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Hello Compose",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = { /* 点击事件 */ }) {
            Text("Click Me")
        }
    }
}
```

### 3.2 状态管理

```kotlin
@Composable
fun CounterExample() {
    // 使用 remember 和 mutableStateOf
    var count by remember { mutableStateOf(0) }
    var text by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp)
    ) {
        Text("Count: $count")
        
        Button(onClick = { count++ }) {
            Text("Increment")
        }
        
        TextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("Enter text") }
        )
    }
}
```

### 3.3 LazyColumn 列表

```kotlin
@Composable
fun LazyListExample() {
    val items = remember { List(100) { "Item $it" } }
    
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(items) { item ->
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = item,
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
    }
}
```

### 3.4 副作用处理

```kotlin
@Composable
fun EffectExample() {
    var data by remember { mutableStateOf<String?>(null) }
    
    // LaunchedEffect：启动协程
    LaunchedEffect(Unit) {
        delay(1000)
        data = "Loaded data"
    }
    
    // DisposableEffect：清理资源
    DisposableEffect(Unit) {
        val listener = createListener()
        onDispose {
            listener.dispose()
        }
    }
    
    // derivedStateOf：派生状态
    val isDataReady by remember {
        derivedStateOf { data != null }
    }
    
    if (isDataReady) {
        Text("Data: $data")
    } else {
        CircularProgressIndicator()
    }
}
```

### 3.5 HotPreview 热预览

```kotlin
import de.drick.compose.hotpreview.HotPreview

// 标记 Composable 函数支持热预览
@HotPreview
@Composable
fun PreviewableComponent() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Title", fontSize = 20.sp)
            Text("Subtitle", fontSize = 14.sp)
        }
    }
}

// KSP 会自动生成对应的 Pager 类
// PreviewableComponentPreviewPager : ComposeContainer
```

### 3.6 与 Kuikly View 互操作

```kotlin
import com.tencent.kuikly.compose.extension.KuiklyView

@Composable
fun VideoPlayerExample() {
    // 将 Kuikly 的 VideoView 封装为 Composable
    KuiklyView(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp),
        factory = { context ->
            VideoView().apply {
                attr {
                    src("https://example.com/video.mp4")
                    autoPlay(true)
                }
            }
        }
    )
}
```

## 4. 平台特定代码

### 4.1 expect/actual 机制

```kotlin
// commonMain - 定义期望
expect class PlatformUtils {
    companion object {
        fun isIOS(): Boolean
        fun isAndroid(): Boolean
        fun platformName(): String
    }
}

// androidMain - Android 实现
actual class PlatformUtils {
    actual companion object {
        actual fun isIOS(): Boolean = false
        actual fun isAndroid(): Boolean = true
        actual fun platformName(): String = "Android"
    }
}

// iosMain - iOS 实现
actual class PlatformUtils {
    actual companion object {
        actual fun isIOS(): Boolean = true
        actual fun isAndroid(): Boolean = false
        actual fun platformName(): String = "iOS"
    }
}

// 使用
@Page("PlatformDemo")
internal class PlatformDemoPage : Pager() {
    override fun body(): ViewBuilder {
        return {
            Text {
                attr {
                    text("Running on: ${PlatformUtils.platformName()}")
                }
            }
            
            // 平台条件渲染
            vif({ PlatformUtils.isIOS() }) {
                Text {
                    attr { text("iOS 专属功能") }
                }
            }
        }
    }
}
```

### 4.2 iOS 特定组件

```kotlin
import com.tencent.kuikly.core.views.ios.*

override fun body(): ViewBuilder {
    return {
        vif({ PlatformUtils.isIOS() }) {
            // iOS Switch 组件
            iOSSwitch {
                attr {
                    isOn(true)
                    onTintColor(Color(0xFF007AFF))
                }
                event {
                    valueChange { isOn ->
                        println("Switch changed: $isOn")
                    }
                }
            }
            
            // iOS Slider
            iOSSlider {
                attr {
                    value(0.5f)
                    minimumValue(0f)
                    maximumValue(1f)
                }
            }
            
            // iOS 毛玻璃效果
            LiquidGlassView {
                attr {
                    width(300f)
                    height(200f)
                    blurRadius(20f)
                }
            }
        }
    }
}
```

## 5. KSP 注解处理

### 5.1 @Page 注解处理流程

```kotlin
// 1. 标记页面
@Page("MyPage", supportInLocal = true, moduleId = "module1")
internal class MyPage : Pager() {
    // ...
}

// 2. KSP 扫描并生成入口文件 KuiklyCoreEntry.kt
// 生成的代码类似：
object KuiklyCoreEntry {
    fun getPageMap(): Map<String, () -> Pager> {
        return mapOf(
            "MyPage" to { MyPage() },
            "HelloWorldPage" to { HelloWorldPage() },
            // ...
        )
    }
}
```

### 5.2 @HotPreview 注解处理

```kotlin
// 1. 标记 Composable 函数
@HotPreview
@Composable
fun AccessibilityDemo() {
    // UI 代码
}

// 2. KSP 自动生成预览 Pager
@Page("AccessibilityDemoPreview")
internal class AccessibilityDemoPreviewPager : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            AccessibilityDemo()
        }
    }
}

// 3. 预览 Pager 会被收集到 KuiklyCoreEntry 中
```

## 6. 项目配置示例

### 6.1 gradle.properties

```properties
# Gradle
org.gradle.jvmargs=-Xmx5120M
org.gradle.workers.max=4
org.gradle.caching=true

# Kotlin
kotlin.code.style=official

# Android
android.useAndroidX=true
android.enableJetifier=true

# KMP
kotlin.mpp.enableCInteropCommonization=true
kotlin.native.binary.sourceInfoType=libbacktrace

# KSP
ksp.incremental=false

# Compose
jetbrains.compose.compiler.version=1.5.14.1
compose.compiler.reflection=false
```

### 6.2 build.gradle.kts (core 模块)

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
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
        publishLibraryVariants("release")
    }
    ios()
    iosSimulatorArm64()
    iosX64()
    
    js(IR) {
        moduleName = "KuiklyCore-core"
        browser {
            webpackTask {
                outputFileName = "${moduleName}.js"
            }
        }
        binaries.executable()
    }
    
    // 源集
    sourceSets {
        val commonMain by getting {
            dependencies {
                // 跨平台依赖
            }
        }
        
        val androidMain by getting {
            dependencies {
                // Android 特定依赖
            }
        }
        
        val iosMain by getting {
            dependencies {
                // iOS 特定依赖
            }
        }
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

## 7. 常用 API 参考

### 7.1 自研 DSL 核心 API

```kotlin
// Pager 基类
abstract class Pager {
    abstract fun body(): ViewBuilder
    open fun willInit() {}
    open fun didInit() {}
    open fun createEvent(): ComposeEvent = ComposeEvent()
    open fun createExternalModules(): Map<String, Module>? = null
}

// ViewBuilder 类型别名
typealias ViewBuilder = Unit.() -> Unit

// 响应式属性代理
fun <T> observable(initialValue: T): ObservableProperty<T>
fun <T> observableList(): ObservableList<T>
fun <T> observableSet(): ObservableSet<T>

// 视图组件
fun View(init: ViewBuilder)
fun Text(init: ViewBuilder)
fun Image(init: ViewBuilder)
fun Button(init: ViewBuilder)
fun ListView(init: ViewBuilder)
fun ScrollView(init: ViewBuilder)

// 指令
fun vif(condition: () -> Boolean, builder: ViewBuilder)
fun vfor<T>(list: List<T>, builder: (T, Int) -> Unit)
```

### 7.2 Compose DSL 核心 API

```kotlin
// ComposeContainer 基类
abstract class ComposeContainer : Pager() {
    fun setContent(content: @Composable () -> Unit)
    override fun willInit()
}

// Composable 注解
@Composable
fun MyComponent()

// 状态管理
@Composable
fun remember<T>(calculation: () -> T): T

fun mutableStateOf<T>(value: T): MutableState<T>

@Composable
fun LaunchedEffect(key1: Any?, block: suspend CoroutineScope.() -> Unit)

// 布局组件
@Composable
fun Box(modifier: Modifier, content: @Composable BoxScope.() -> Unit)

@Composable
fun Column(modifier: Modifier, content: @Composable ColumnScope.() -> Unit)

@Composable
fun Row(modifier: Modifier, content: @Composable RowScope.() -> Unit)

@Composable
fun LazyColumn(modifier: Modifier, content: LazyListScope.() -> Unit)
```

## 8. 最佳实践

### 8.1 自研 DSL 最佳实践

1. **使用响应式属性**：所有需要触发 UI 更新的数据都应使用 `by observable`
2. **组件化**：将可复用的 UI 封装为自定义 View
3. **事件处理**：统一在 `event {}` 块中处理事件
4. **避免内存泄漏**：及时清理监听器和定时器
5. **性能优化**：合理使用 `vif` 和 `vfor`，避免不必要的渲染

### 8.2 Compose DSL 最佳实践

1. **状态提升**：将状态提升到合适的层级
2. **使用 key**：在 LazyColumn 等组件中使用 key 优化性能
3. **避免不必要的重组**：使用 `remember` 和 `derivedStateOf`
4. **Side Effects**：正确使用各种 Effect API
5. **性能优化**：避免在 Composable 中执行耗时操作

### 8.3 跨平台开发最佳实践

1. **平台抽象**：使用 expect/actual 机制抽象平台差异
2. **条件编译**：使用 `vif({ PlatformUtils.isXXX() })` 处理平台特定逻辑
3. **测试**：编写跨平台单元测试
4. **文档**：记录平台特定的行为差异

---

**文档维护者**: Kuikly 团队  
**最后更新**: 2025-09-30

## 参考链接

- [Kuikly 官方文档](https://kuikly.tds.qq.com/)
- [快速开始](https://kuikly.tds.qq.com/QuickStart/hello-world.html)
- [API 文档](https://kuikly.tds.qq.com/API/components/override.html)
- [GitHub 仓库](https://github.com/Tencent-TDS/KuiklyUI)
