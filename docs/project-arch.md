# Kuikly 核心技术方案

## 1. 文档信息

| 项目 | 内容 |
|------|------|
| 文档标题 | [功能名称] 技术方案 |
| 文档版本 | v1.0 |
| 创建日期 | YYYY-MM-DD |
| 最后更新 | YYYY-MM-DD |
| 方案作者 | [姓名] |
| 评审人员 | [姓名列表] |
| 当前状态 | 草稿/评审中/已批准/已实施 |

## 2. 方案概述

### 2.1 背景
[描述项目背景、为什么需要这个功能或优化]

**现状分析：**
- 当前存在的问题
- 业务痛点
- 技术债务

**目标：**
- 解决什么问题
- 达到什么效果
- 预期收益

### 2.2 范围
- **包含**：本方案涉及的模块和功能
- **不包含**：不在本方案范围内的内容
- **依赖**：依赖的其他模块或服务

### 2.3 术语表

| 术语 | 说明 |
|------|------|
| KMP | Kotlin Multiplatform |
| DSL | Domain Specific Language |
| AOT | Ahead-of-Time Compilation |
| ... | ... |

## 3. 需求分析

### 3.1 功能需求
1. **需求1**: 描述
   - 详细说明
   - 用户场景
   - 验收标准

2. **需求2**: 描述
   - 详细说明
   - 用户场景
   - 验收标准

### 3.2 非功能需求

#### 3.2.1 性能要求
- 响应时间：< Xms
- 吞吐量：> X QPS
- 内存占用：< X MB
- 包体积增量：< X KB

#### 3.2.2 可用性要求
- 崩溃率：< 0.X%
- 成功率：> 99.X%

#### 3.2.3 兼容性要求
- Android 5.0+
- iOS 12.0+
- HarmonyOS Next 5.0.0(12)+
- Kotlin 1.3.10+

#### 3.2.4 安全性要求
- 数据加密
- 权限控制
- 安全审计

## 4. 技术方案

### 4.1 总体架构

```
[在此处添加架构图]

示例：
┌─────────────────────────────────────┐
│        Application Layer            │
│  (Android/iOS/Ohos/Web/MiniApp)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Compose/DSL Layer             │
│  (UI Components & Layout)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Core Layer (KMP)            │
│  (Reactive System & Bridge)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Platform Render Layer          │
│  (Native UI Rendering)              │
└─────────────────────────────────────┘
```

**架构说明：**
- 分层职责
- 模块划分
- 数据流向

### 4.2 核心模块设计

#### 4.2.1 模块一：Pager（页面管理）

**职责：**
- 页面生命周期管理
- UI 构建和更新
- 状态管理
- 事件处理

**核心接口：**
```kotlin
/**
 * Kuikly 页面基类
 * 所有使用自研 DSL 的页面都需要继承此类
 */
abstract class Pager : IPager {
    /**
     * 构建页面 UI
     * @return ViewBuilder DSL 构建器
     */
    abstract fun body(): ViewBuilder
    
    /**
     * 页面初始化前回调
     */
    open fun willInit() {}
    
    /**
     * 页面初始化后回调
     */
    open fun didInit() {}
    
    /**
     * 创建事件对象
     */
    open fun createEvent(): ComposeEvent = ComposeEvent()
    
    /**
     * 创建外部模块
     */
    open fun createExternalModules(): Map<String, Module>? = null
    
    /**
     * 获取模块实例
     */
    fun <T : Module> acquireModule(moduleName: String): T
}
```

**实际使用示例：**
```kotlin
@Page("HelloWorldPage")
internal class HelloWorldPage : Pager() {
    
    var message: String by observable("Hello")
    
    override fun willInit() {
        super.willInit()
        // 初始化逻辑
        message = "Hello Kuikly!"
    }
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    flex(1f)
                    backgroundColor(Color.WHITE)
                    allCenter()
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
```

#### 4.2.2 模块二：响应式系统（Reactive System）

**职责：**
- 管理可观察属性
- 追踪依赖关系
- 自动触发UI更新
- 集合变化监听

**核心类设计：**
```kotlin
/**
 * 可观察属性包装器
 * 当属性值变化时自动通知观察者，触发UI更新
 */
class ObservableProperty<T>(
    private var value: T
) : ReadWriteProperty<Any?, T> {
    
    private val observers = mutableListOf<ReactiveObserver>()
    
    override fun getValue(thisRef: Any?, property: KProperty<*>): T {
        // 记录依赖
        return value
    }
    
    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        if (this.value != value) {
            this.value = value
            // 通知所有观察者
            notifyObservers()
        }
    }
    
    private fun notifyObservers() {
        observers.forEach { it.update() }
    }
}

/**
 * 可观察列表
 * 支持列表元素的增删改查操作，并自动触发UI更新
 */
class ObservableList<E> : MutableList<E> {
    private val innerList = mutableListOf<E>()
    private val observers = mutableListOf<ReactiveObserver>()
    
    override fun add(element: E): Boolean {
        val result = innerList.add(element)
        if (result) notifyObservers()
        return result
    }
    
    override fun removeAt(index: Int): E {
        val element = innerList.removeAt(index)
        notifyObservers()
        return element
    }
    
    // ... 其他 MutableList 方法实现
}
```

**使用示例：**
```kotlin
@Page("ReactiveDemo")
class ReactiveDemoPage : Pager() {
    // 可观察属性
    var count: Int by observable(0)
    var name: String by observable("User")
    
    // 可观察列表
    var items: ObservableList<String> by observableList()
    
    override fun willInit() {
        super.willInit()
        items.addAll(listOf("Item 1", "Item 2"))
    }
    
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                // 显示count，count变化会自动更新UI
                Text {
                    attr { text("Count: ${ctx.count}") }
                }
                
                // 点击增加计数
                event {
                    click { ctx.count++ }  // 自动触发UI更新
                }
            }
            
            // 列表渲染，items变化会自动更新
            vfor(ctx.items) { item, index ->
                Text {
                    attr { text("${index + 1}. $item") }
                }
            }
        }
    }
}
```

#### 4.2.3 模块三：ComposeContainer（Compose集成）

**职责：**
- 桥接 Compose 和 Kuikly
- 管理 Compose 生命周期
- 处理布局方向和主题

**核心实现：**
```kotlin
/**
 * Compose DSL 容器基类
 * 使用 Jetpack Compose API 的页面需要继承此类
 */
abstract class ComposeContainer : Pager() {
    
    protected var layoutDirection: LayoutDirection = LayoutDirection.Ltr
    
    /**
     * 设置 Compose 内容
     */
    fun setContent(content: @Composable () -> Unit) {
        // 创建 Compose 场景
        val mediator = ComposeSceneMediator()
        mediator.setContent(content)
        
        // 桥接到 Kuikly 渲染系统
        attachComposeScene(mediator)
    }
    
    override fun body(): ViewBuilder {
        return {
            // Compose内容会渲染在这里
        }
    }
}
```

**实际使用：**
```kotlin
@Page("ComposeDemo")
internal class ComposeDemoPage : ComposeContainer() {
    
    override fun willInit() {
        super.willInit()
        layoutDirection = LayoutDirection.Ltr
        
        setContent {
            MyComposeUI()
        }
    }
}

@Composable
fun MyComposeUI() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp)
    ) {
        Text("Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

#### 4.2.4 模块四：注解处理（KSP Processor）

**职责：**
- 扫描 @Page 和 @HotPreview 注解
- 生成页面入口代码
- 生成预览 Pager 类
- 支持模块化打包

**核心处理器：**
```kotlin
/**
 * Kuikly KSP 注解处理器
 * 处理 @Page 和 @HotPreview 注解
 */
class KuiklyCoreProcessor(
    private val codeGenerator: CodeGenerator,
    private val logger: KSPLogger,
    private val option: Map<String, String>
) : SymbolProcessor {
    
    private val hotPreviewProcessor = HotPreviewProcessor(codeGenerator, logger)
    
    override fun process(resolver: Resolver): List<KSAnnotated> {
        // 1. 处理 @HotPreview 注解
        hotPreviewProcessor.process(resolver)
        
        // 2. 收集所有 @Page 注解的类
        val pageClasses = resolver
            .getSymbolsWithAnnotation(Page::class.qualifiedName!!)
            .filterIsInstance<KSClassDeclaration>()
            .map { it.toPageInfo() }
        
        // 3. 生成入口文件 KuiklyCoreEntry.kt
        generateEntryFile(pageClasses)
        
        return emptyList()
    }
    
    private fun generateEntryFile(pages: List<PageInfo>) {
        // 生成页面映射代码
        val fileSpec = FileSpec.builder("", "KuiklyCoreEntry")
            .addFunction(
                FunSpec.builder("getPageMap")
                    .returns(Map::class.parameterizedBy(String::class, ...))
                    .addStatement("return mapOf(")
                    .apply {
                        pages.forEach { page ->
                            addStatement("    %S to { %T() },", 
                                page.pageName, 
                                page.className
                            )
                        }
                    }
                    .addStatement(")")
                    .build()
            )
            .build()
        
        // 写入文件
        codeGenerator.createNewFile(...)
            .use { output ->
                output.write(fileSpec.toString().toByteArray())
            }
    }
}

/**
 * HotPreview 注解处理器
 * 为 @HotPreview 标记的 Composable 函数生成预览 Pager
 */
class HotPreviewProcessor(
    private val codeGenerator: CodeGenerator,
    private val logger: KSPLogger
) {
    fun process(resolver: Resolver) {
        // 查找所有 @HotPreview 注解的函数
        resolver
            .getSymbolsWithAnnotation("de.drick.compose.hotpreview.HotPreview")
            .filterIsInstance<KSFunctionDeclaration>()
            .forEach { function ->
                generatePreviewPager(function)
            }
    }
    
    private fun generatePreviewPager(function: KSFunctionDeclaration) {
        val functionName = function.simpleName.asString()
        val packageName = function.packageName.asString()
        val className = "${functionName}PreviewPager"
        
        // 生成预览 Pager 类
        val fileSpec = FileSpec.builder(packageName, className)
            .addType(
                TypeSpec.classBuilder(className)
                    .addAnnotation(
                        AnnotationSpec.builder(Page::class)
                            .addMember("name = %S", "${functionName}Preview")
                            .build()
                    )
                    .superclass(ComposeContainer::class)
                    .addFunction(
                        FunSpec.builder("willInit")
                            .addModifiers(KModifier.OVERRIDE)
                            .addStatement("super.willInit()")
                            .addStatement("setContent { %L() }", functionName)
                            .build()
                    )
                    .build()
            )
            .build()
        
        // 写入生成的文件
        codeGenerator.createNewFile(...)
    }
}
```

**生成的代码示例：**
```kotlin
// 原始代码
@HotPreview
@Composable
fun AccessibilityDemo() {
    Text("Demo Content")
}

// KSP 自动生成
@Page("AccessibilityDemoPreview")
internal class AccessibilityDemoPreviewPager : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            AccessibilityDemo()
        }
    }
}
```

#### 4.2.5 模块五：Layout 布局引擎

**职责：**
- 实现 Flexbox 布局算法
- 计算视图尺寸和位置
- 支持自适应和响应式布局

**核心类：**
```kotlin
/**
 * Flex 布局节点
 */
class FlexNode {
    var style: FlexStyle
    var children: List<FlexNode>
    
    // 计算后的布局结果
    var left: Float = 0f
    var top: Float = 0f
    var width: Float = 0f
    var height: Float = 0f
    
    /**
     * 计算布局
     */
    fun calculateLayout(
        parentWidth: Float?,
        parentHeight: Float?
    ) {
        // Flexbox 布局算法实现
        // 参考 Yoga 布局引擎
    }
}

/**
 * Flex 样式
 */
class FlexStyle {
    var flexDirection: FlexDirection = FlexDirection.COLUMN
    var justifyContent: JustifyContent = JustifyContent.FLEX_START
    var alignItems: AlignItems = AlignItems.STRETCH
    var flexWrap: FlexWrap = FlexWrap.NO_WRAP
    
    var width: Dimension = Dimension.Auto
    var height: Dimension = Dimension.Auto
    var flex: Float? = null
    
    var margin: Edges = Edges.ZERO
    var padding: Edges = Edges.ZERO
}
```

### 4.3 数据模型

```kotlin
/**
 * [数据模型说明]
 */
data class DataModel(
    val id: String,
    val name: String,
    val properties: Map<String, Any>
)
```

### 4.4 核心算法/流程

#### 4.4.1 流程图

```
开始
  ↓
步骤1：初始化
  ↓
步骤2：数据处理
  ↓
步骤3：渲染输出
  ↓
结束
```

#### 4.4.2 伪代码

```
function process(input):
    // 步骤1
    data = preprocess(input)
    
    // 步骤2
    result = transform(data)
    
    // 步骤3
    return render(result)
```

#### 4.4.3 时间复杂度分析
- 最好情况：O(n)
- 平均情况：O(n log n)
- 最坏情况：O(n²)

### 4.5 平台差异处理

#### 4.5.1 Android 特殊处理
```kotlin
// Android 平台特定实现
actual class PlatformSpecific {
    actual fun platformMethod() {
        // Android 实现
    }
}
```

#### 4.5.2 iOS 特殊处理
```kotlin
// iOS 平台特定实现
actual class PlatformSpecific {
    actual fun platformMethod() {
        // iOS 实现
    }
}
```

#### 4.5.3 其他平台
[描述其他平台的特殊处理]

### 4.6 性能优化方案

#### 4.6.1 渲染优化
- 减少重组次数
- 使用 remember 缓存
- 懒加载策略

#### 4.6.2 内存优化
- 对象池
- 及时释放资源
- 避免内存泄漏

#### 4.6.3 包体积优化
- 代码混淆
- 资源压缩
- 按需加载

### 4.7 错误处理

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
}

try {
    // 业务逻辑
} catch (e: Exception) {
    // 错误处理
    logger.error("Error occurred", e)
    return Result.Error(e)
}
```

## 5. 技术选型

### 5.1 技术栈

| 技术 | 版本 | 用途 | 备选方案 |
|------|------|------|----------|
| Kotlin | 2.0.21 | 开发语言 | - |
| KMP | 2.0.21 | 跨平台 | - |
| Compose | 1.7.3 | UI 框架 | 自研 DSL |
| KSP | X.X.X | 注解处理 | KAPT |

### 5.2 选型理由
[详细说明为什么选择这些技术]

### 5.3 风险评估
[评估技术选型可能带来的风险]

## 6. 实施计划

### 6.1 里程碑

| 阶段 | 任务 | 负责人 | 预计完成时间 | 状态 |
|------|------|--------|--------------|------|
| 设计阶段 | 完成技术方案设计 | XXX | YYYY-MM-DD | 进行中 |
| 开发阶段 | 核心功能开发 | XXX | YYYY-MM-DD | 待开始 |
| 测试阶段 | 单元测试和集成测试 | XXX | YYYY-MM-DD | 待开始 |
| 发布阶段 | 发布到生产环境 | XXX | YYYY-MM-DD | 待开始 |

### 6.2 详细任务分解

#### 6.2.1 第一阶段：基础搭建（X 天）
- [ ] 任务1：搭建项目结构
- [ ] 任务2：定义核心接口
- [ ] 任务3：实现基础组件

#### 6.2.2 第二阶段：核心功能（X 天）
- [ ] 任务1：实现功能A
- [ ] 任务2：实现功能B
- [ ] 任务3：平台适配

#### 6.2.3 第三阶段：优化测试（X 天）
- [ ] 任务1：性能优化
- [ ] 任务2：单元测试
- [ ] 任务3：集成测试

### 6.3 资源需求
- **人力**：X 人 × Y 天
- **设备**：测试设备清单
- **其他**：第三方服务、许可证等

## 7. 测试方案

### 7.1 测试策略
- **单元测试**：覆盖核心逻辑
- **集成测试**：测试模块间交互
- **端到端测试**：完整业务流程测试
- **性能测试**：压力测试、稳定性测试

### 7.2 测试用例

| 用例编号 | 测试场景 | 预期结果 | 优先级 |
|----------|----------|----------|--------|
| TC001 | 场景描述 | 期望行为 | P0 |
| TC002 | 场景描述 | 期望行为 | P1 |

### 7.3 测试环境
- **开发环境**：本地开发机
- **测试环境**：测试服务器
- **生产环境**：线上环境

详细测试方案参考：test-rules.md

## 8. 风险评估与应对

### 8.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 | 负责人 |
|------|------|------|----------|--------|
| 平台兼容性问题 | 高 | 中 | 提前测试，准备降级方案 | XXX |
| 性能不达标 | 高 | 低 | 性能监控，优化预案 | XXX |
| 第三方依赖问题 | 中 | 低 | 选择稳定版本，准备替代方案 | XXX |

### 8.2 业务风险
[描述可能的业务风险及应对]

### 8.3 时间风险
[描述时间延期的风险及应对]

## 9. 性能指标

### 9.1 性能目标

| 指标 | 目标值 | 当前值 | 测试方法 |
|------|--------|--------|----------|
| 启动时间 | < 1s | - | 启动耗时统计 |
| 内存占用 | < 300KB (Android) | - | 内存分析工具 |
| 帧率 | ≥ 60fps | - | FPS 监控 |
| 包体积增量 | < 300KB | - | APK 分析 |

### 9.2 监控方案
- 性能监控平台
- 日志收集
- 异常上报

## 10. 安全方案

### 10.1 安全威胁分析
[分析潜在的安全威胁]

### 10.2 安全措施
- 数据加密
- 权限控制
- 输入验证
- 日志脱敏

详细安全方案参考：security-rules.md

## 11. 监控与运维

### 11.1 监控指标
- 性能指标：启动时间、帧率、内存
- 稳定性指标：崩溃率、ANR 率
- 业务指标：功能使用率、成功率

### 11.2 告警规则
- 崩溃率 > 0.1% 触发告警
- 内存占用 > 500MB 触发告警
- 响应时间 > 3s 触发告警

### 11.3 日志规范
```kotlin
// 使用统一的日志工具
Logger.d("tag", "debug message")
Logger.i("tag", "info message")
Logger.w("tag", "warning message")
Logger.e("tag", "error message", exception)
```

## 12. 灰度发布计划

### 12.1 灰度策略
- **第一阶段**：内部测试（1-2 天）
- **第二阶段**：小范围灰度（1%，2-3 天）
- **第三阶段**：扩大灰度（10%，3-5 天）
- **第四阶段**：全量发布（7-10 天）

### 12.2 回滚方案
- 监控关键指标
- 发现问题立即回滚
- 回滚后问题分析

详细发布方案参考：release-rules.md

## 13. 后续优化方向

### 13.1 短期优化（1-3 个月）
- 优化项1
- 优化项2

### 13.2 长期规划（3-12 个月）
- 规划项1
- 规划项2

## 14. 参考资料

- [Kotlin Multiplatform 官方文档](https://kotlinlang.org/docs/multiplatform.html)
- [Jetpack Compose 文档](https://developer.android.com/jetpack/compose)
- [Kuikly 官方文档](https://kuikly.tds.qq.com/)
- 相关技术博客链接

## 15. 附录

### 15.1 变更记录

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| v1.0 | YYYY-MM-DD | 初始版本 | XXX |
| v1.1 | YYYY-MM-DD | 更新XX部分 | XXX |

### 15.2 评审记录

| 日期 | 评审人 | 评审意见 | 状态 |
|------|--------|----------|------|
| YYYY-MM-DD | XXX | 意见内容 | 已处理 |

### 15.3 相关文档
- 需求文档：[链接]
- 设计文档：[链接]
- 测试报告：[链接]

---

**文档维护者**: [姓名]  
**最后更新**: YYYY-MM-DD
