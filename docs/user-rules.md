# Kuikly 编码规范

## 1. 概述

### 1.1 规范目的
- 提高代码质量和可读性
- 降低维护成本
- 促进团队协作
- 减少潜在Bug

### 1.2 适用范围
本规范适用于 Kuikly 项目的所有 Kotlin 代码，包括：
- 核心模块（core）
- Compose 模块
- 平台特定代码（Android、iOS、鸿蒙等）
- 示例代码（demo）
- 测试代码

### 1.3 规范层级

**强制**: 必须遵守的规范，违反会导致代码评审不通过  
**推荐**: 建议遵守的规范，有助于提高代码质量  
**参考**: 可选的规范，根据具体情况判断

## 2. 基础规范

### 2.1 编码格式

#### 2.1.1 字符编码
**[强制]** 所有源文件使用 UTF-8 编码

#### 2.1.2 缩进
**[强制]** 使用 4 个空格缩进，不使用 Tab

```kotlin
// ✅ 正确
fun calculateSum(a: Int, b: Int): Int {
    return a + b
}

// ❌ 错误：使用了 Tab
fun calculateSum(a: Int, b: Int): Int {
	return a + b  // 使用了 Tab
}
```

#### 2.1.3 行长度
**[推荐]** 每行代码不超过 120 字符

```kotlin
// ✅ 正确：适当换行
fun createUser(
    firstName: String,
    lastName: String,
    email: String,
    age: Int
): User {
    return User(firstName, lastName, email, age)
}

// ❌ 不推荐：一行太长
fun createUser(firstName: String, lastName: String, email: String, age: Int, address: String, phoneNumber: String): User {
    return User(firstName, lastName, email, age, address, phoneNumber)
}
```

#### 2.1.4 空行
**[推荐]** 合理使用空行分隔逻辑块

```kotlin
// ✅ 正确
class UserService {
    private val repository = UserRepository()
    
    fun getUser(id: String): User? {
        val cached = cache.get(id)
        if (cached != null) return cached
        
        val user = repository.findById(id)
        if (user != null) {
            cache.put(id, user)
        }
        
        return user
    }
}

// ❌ 不推荐：缺少空行
class UserService {
    private val repository = UserRepository()
    fun getUser(id: String): User? {
        val cached = cache.get(id)
        if (cached != null) return cached
        val user = repository.findById(id)
        if (user != null) {
            cache.put(id, user)
        }
        return user
    }
}
```

### 2.2 命名规范

#### 2.2.1 包名
**[强制]** 包名全部小写，使用点分隔，避免使用下划线

```kotlin
// ✅ 正确
package com.tencent.kuikly.core
package com.tencent.kuikly.compose.ui

// ❌ 错误
package com.tencent.Kuikly.Core
package com.tencent.kuikly.compose_ui
```

#### 2.2.2 类名
**[强制]** 使用大驼峰命名法（PascalCase）

```kotlin
// ✅ 正确
class UserRepository
class HttpClient
class XMLParser
interface DataSource
object AppConfig

// ❌ 错误
class userRepository
class HTTPClient
class xmlParser
```

#### 2.2.3 函数名
**[强制]** 使用小驼峰命名法（camelCase）

```kotlin
// ✅ 正确
fun getUserById(id: String): User
fun calculateTotal(): Double
fun isValid(): Boolean

// ❌ 错误
fun GetUserById(id: String): User
fun calculate_total(): Double
fun is_valid(): Boolean
```

#### 2.2.4 变量名
**[强制]** 使用小驼峰命名法

```kotlin
// ✅ 正确
val userName: String
val maxRetryCount: Int
var isLoading: Boolean

// ❌ 错误
val UserName: String
val max_retry_count: Int
var is_loading: Boolean
```

#### 2.2.5 常量名
**[强制]** 使用全大写加下划线分隔（UPPER_SNAKE_CASE）

```kotlin
// ✅ 正确
const val MAX_COUNT = 100
const val DEFAULT_TIMEOUT = 30_000L
const val API_BASE_URL = "https://api.example.com"

// ❌ 错误
const val maxCount = 100
const val defaultTimeout = 30000L
```

#### 2.2.6 布尔变量命名
**[推荐]** 布尔变量使用 is/has/should 等前缀

```kotlin
// ✅ 推荐
val isEnabled: Boolean
val hasPermission: Boolean
val shouldRefresh: Boolean

// ⚠️ 可接受但不推荐
val enabled: Boolean
val permission: Boolean
```

### 2.3 文件组织

#### 2.3.1 文件命名
**[强制]** 文件名与主类名一致

```kotlin
// UserRepository.kt
class UserRepository {
    // ...
}

// Extensions.kt (扩展函数文件)
fun String.toSnakeCase(): String {
    // ...
}
```

#### 2.3.2 文件结构
**[推荐]** 按以下顺序组织代码

```kotlin
// 1. 文件头注释（如需要）
/**
 * User repository implementation
 * 
 * @author Kuikly Team
 * @since 2.0.0
 */

// 2. Package 声明
package com.tencent.kuikly.core.repository

// 3. Import 语句（分组排序）
import com.tencent.kuikly.core.model.User
import com.tencent.kuikly.core.database.UserDao
import kotlinx.coroutines.flow.Flow

// 4. 类/接口定义
class UserRepository(
    private val userDao: UserDao
) {
    // 4.1 伴生对象
    companion object {
        private const val TAG = "UserRepository"
    }
    
    // 4.2 属性
    private val cache = mutableMapOf<String, User>()
    
    // 4.3 初始化块
    init {
        // 初始化代码
    }
    
    // 4.4 公共方法
    fun getUser(id: String): User? {
        // ...
    }
    
    // 4.5 私有方法
    private fun loadFromCache(id: String): User? {
        // ...
    }
}
```

## 3. Kotlin 语言特性

### 3.1 可空性

#### 3.1.1 避免使用 !!
**[强制]** 尽量避免使用 !! 操作符

```kotlin
// ❌ 不推荐
fun processUser(user: User?) {
    val name = user!!.name  // 可能抛出 NPE
}

// ✅ 推荐
fun processUser(user: User?) {
    val name = user?.name ?: "Unknown"
}

// ✅ 推荐
fun processUser(user: User?) {
    user?.let { 
        println(it.name)
    }
}
```

#### 3.1.2 合理使用 ?. 和 ?:
**[推荐]** 使用安全调用和 Elvis 操作符

```kotlin
// ✅ 推荐
val length = text?.length ?: 0
val user = repository.findUser(id) ?: return

// 使用 let 处理可空值
user?.let { u ->
    println(u.name)
    updateUser(u)
}
```

### 3.2 类型推断

#### 3.2.1 合理使用类型推断
**[推荐]** 当类型明显时可省略类型声明

```kotlin
// ✅ 正确：类型明显
val name = "张三"
val count = 10
val list = listOf(1, 2, 3)

// ✅ 正确：类型不明显时显式声明
val callback: () -> Unit = createCallback()
val data: User = fetchUserData()
```

### 3.3 函数

#### 3.3.1 单表达式函数
**[推荐]** 简单函数使用单表达式形式

```kotlin
// ✅ 推荐
fun double(x: Int): Int = x * 2
fun isAdult(age: Int): Boolean = age >= 18

// ⚠️ 也可以但略显冗余
fun double(x: Int): Int {
    return x * 2
}
```

#### 3.3.2 默认参数
**[推荐]** 优先使用默认参数而不是函数重载

```kotlin
// ✅ 推荐
fun createUser(
    name: String,
    age: Int = 0,
    email: String = ""
) {
    // ...
}

// ❌ 不推荐
fun createUser(name: String) {
    createUser(name, 0, "")
}

fun createUser(name: String, age: Int) {
    createUser(name, age, "")
}
```

#### 3.3.3 命名参数
**[推荐]** 参数较多时使用命名参数

```kotlin
// ✅ 推荐：清晰明了
createUser(
    name = "张三",
    age = 25,
    email = "zhangsan@example.com"
)

// ⚠️ 可接受但不够清晰
createUser("张三", 25, "zhangsan@example.com")
```

### 3.4 集合操作

#### 3.4.1 优先使用集合操作符
**[推荐]** 使用 Kotlin 集合操作符而不是循环

```kotlin
// ✅ 推荐
val adults = users.filter { it.age >= 18 }
val names = users.map { it.name }
val totalAge = users.sumOf { it.age }

// ❌ 不推荐
val adults = mutableListOf<User>()
for (user in users) {
    if (user.age >= 18) {
        adults.add(user)
    }
}
```

#### 3.4.2 避免不必要的集合转换
**[推荐]** 注意集合操作的性能

```kotlin
// ❌ 不好：多次转换
val result = list
    .asSequence()
    .filter { it > 0 }
    .toList()
    .asSequence()
    .map { it * 2 }
    .toList()

// ✅ 更好：链式调用
val result = list
    .asSequence()
    .filter { it > 0 }
    .map { it * 2 }
    .toList()
```

### 3.5 作用域函数

#### 3.5.1 正确使用 let/also/run/apply/with
**[推荐]** 根据场景选择合适的作用域函数

```kotlin
// let: 对可空对象操作
user?.let { u ->
    println(u.name)
    updateUser(u)
}

// also: 附加操作
val user = createUser().also {
    logger.info("User created: ${it.id}")
}

// run: 对象配置和计算结果
val result = service.run {
    authenticate()
    fetchData()
}

// apply: 对象初始化
val user = User().apply {
    name = "张三"
    age = 25
}

// with: 批量调用对象方法
with(canvas) {
    drawLine(x1, y1, x2, y2)
    drawCircle(x, y, radius)
}
```

### 3.6 协程

#### 3.6.1 使用结构化并发
**[强制]** 正确管理协程生命周期

```kotlin
// ✅ 正确：使用 CoroutineScope
class MyViewModel : ViewModel() {
    private val viewModelScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    
    fun loadData() {
        viewModelScope.launch {
            val data = withContext(Dispatchers.IO) {
                repository.fetchData()
            }
            updateUI(data)
        }
    }
    
    override fun onCleared() {
        viewModelScope.cancel()
    }
}

// ❌ 错误：使用 GlobalScope
fun loadData() {
    GlobalScope.launch {  // 不推荐
        // ...
    }
}
```

#### 3.6.2 异常处理
**[推荐]** 正确处理协程异常

```kotlin
// ✅ 推荐
viewModelScope.launch {
    try {
        val data = repository.fetchData()
        updateUI(data)
    } catch (e: Exception) {
        handleError(e)
    }
}

// ✅ 推荐：使用 CoroutineExceptionHandler
private val exceptionHandler = CoroutineExceptionHandler { _, throwable ->
    handleError(throwable)
}

viewModelScope.launch(exceptionHandler) {
    val data = repository.fetchData()
    updateUI(data)
}
```

## 4. Compose 规范

### 4.1 Composable 函数命名
**[强制]** Composable 函数使用大驼峰命名

```kotlin
// ✅ 正确
@Composable
fun UserProfile(user: User) {
    // ...
}

@Composable
fun LoadingIndicator() {
    // ...
}

// ❌ 错误
@Composable
fun userProfile(user: User) {
    // ...
}
```

### 4.2 状态管理
**[推荐]** 合理使用 remember 和 State

```kotlin
// ✅ 推荐
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}

// ✅ 推荐：提升状态
@Composable
fun Counter(
    count: Int,
    onIncrement: () -> Unit
) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}
```

### 4.3 性能优化
**[推荐]** 避免不必要的重组

```kotlin
// ✅ 推荐：使用 key
@Composable
fun UserList(users: List<User>) {
    users.forEach { user ->
        key(user.id) {
            UserItem(user)
        }
    }
}

// ✅ 推荐：使用 derivedStateOf
@Composable
fun FilteredList(items: List<Item>, query: String) {
    val filteredItems by remember(items, query) {
        derivedStateOf {
            items.filter { it.name.contains(query, ignoreCase = true) }
        }
    }
    
    LazyColumn {
        items(filteredItems) { item ->
            ItemRow(item)
        }
    }
}
```

## 5. 文档注释

### 5.1 KDoc 规范
**[强制]** 公共 API 必须包含 KDoc 注释

```kotlin
/**
 * 用户仓库，负责用户数据的增删改查
 *
 * @property userDao 用户数据访问对象
 * @constructor 创建用户仓库实例
 */
class UserRepository(
    private val userDao: UserDao
) {
    /**
     * 根据 ID 获取用户信息
     *
     * @param id 用户 ID
     * @return 用户对象，如果不存在则返回 null
     * @throws DatabaseException 数据库访问异常
     */
    suspend fun getUserById(id: String): User? {
        return userDao.findById(id)
    }
}
```

### 5.2 行内注释
**[推荐]** 复杂逻辑添加必要的注释

```kotlin
// ✅ 好的注释：解释"为什么"
// 使用缓存避免频繁的数据库查询
val cached = cache.get(id)
if (cached != null) return cached

// ❌ 不好的注释：描述"是什么"
// 从缓存获取数据
val cached = cache.get(id)
```

## 6. 测试规范

### 6.1 测试命名
**[推荐]** 使用描述性的测试名称

```kotlin
class CalculatorTest {
    // ✅ 推荐
    @Test
    fun `should return sum when adding two positive numbers`() {
        val result = calculator.add(2, 3)
        assertEquals(5, result)
    }
    
    @Test
    fun `should throw exception when dividing by zero`() {
        assertThrows<ArithmeticException> {
            calculator.divide(10, 0)
        }
    }
}
```

详细测试规范参考：test-rules.md

## 7. Kuikly 特定规范

### 7.1 自研 DSL 编码规范

#### 7.1.1 Pager 类规范

**[强制]** 所有页面必须使用 @Page 注解：

```kotlin
// ✅ 正确
@Page("HelloWorldPage")
internal class HelloWorldPage : Pager() {
    override fun body(): ViewBuilder {
        return { /* UI代码 */ }
    }
}

// ❌ 错误：缺少注解
internal class HelloWorldPage : Pager() {
    // ...
}
```

**[推荐]** 页面类命名以 Page 或 Pager 结尾：

```kotlin
// ✅ 推荐
@Page("UserProfile")
internal class UserProfilePage : Pager()

@Page("Settings")  
internal class SettingsPager : Pager()

// ⚠️ 可以但不推荐
@Page("Home")
internal class HomeScreen : Pager()
```

#### 7.1.2 响应式属性规范

**[强制]** 需要触发 UI 更新的属性必须使用 observable：

```kotlin
// ✅ 正确
class MyPage : Pager() {
    var count: Int by observable(0)
    var message: String by observable("")
    var items: ObservableList<String> by observableList()
    
    // ❌ 错误：普通属性不会触发UI更新
    var normalCount: Int = 0  // UI不会自动更新
}
```

**[推荐]** 响应式属性初始化在 willInit 中：

```kotlin
// ✅ 推荐
override fun willInit() {
    super.willInit()
    items.addAll(listOf("Item 1", "Item 2"))
    count = 0
}

// ⚠️ 不推荐在 body() 中初始化
override fun body(): ViewBuilder {
    items.add("Item") // 避免在这里修改状态
    return { /* ... */ }
}
```

#### 7.1.3 ViewBuilder DSL 规范

**[强制]** 使用闭包捕获 this 引用：

```kotlin
// ✅ 正确
override fun body(): ViewBuilder {
    val ctx = this  // 捕获引用
    return {
        View {
            attr { text(ctx.message) }
            event { 
                click { ctx.count++ }
            }
        }
    }
}

// ❌ 错误：直接使用 this 可能有问题
override fun body(): ViewBuilder {
    return {
        View {
            attr { text(this.message) }  // 这里的 this 不对
        }
    }
}
```

**[推荐]** attr 和 event 块保持简洁：

```kotlin
// ✅ 好的写法
View {
    attr {
        width(300f)
        height(200f)
        backgroundColor(Color.WHITE)
        padding(16f)
    }
    
    event {
        click { handleClick() }
        longPress { handleLongPress() }
    }
    
    // 子视图
    Text {
        attr { text("Title") }
    }
}

// ❌ 不好的写法：attr 中混入过多逻辑
View {
    attr {
        width(300f)
        if (someCondition) {  // 避免在 attr 中写复杂逻辑
            height(200f)
        } else {
            height(100f)
        }
    }
}
```

#### 7.1.4 条件渲染规范

**[推荐]** 使用 vif 进行条件渲染：

```kotlin
// ✅ 推荐使用 vif
vif({ ctx.isLoggedIn }) {
    UserProfileView { }
}

vif({ !ctx.isLoggedIn }) {
    LoginView { }
}

// ⚠️ 也可以但不够声明式
if (ctx.isLoggedIn) {
    UserProfileView { }()  // 需要手动调用
} else {
    LoginView { }()
}
```

#### 7.1.5 列表渲染规范

**[强制]** 使用 vfor 渲染列表：

```kotlin
// ✅ 正确
vfor(ctx.items) { item, index ->
    View {
        attr {
            height(50f)
            padding(10f)
        }
        Text {
            attr { text("${index + 1}. $item") }
        }
    }
}

// ❌ 错误：不要用 forEach
ctx.items.forEach { item ->
    View { /* ... */ }()  // 不会响应式更新
}
```

### 7.2 Compose DSL 编码规范

#### 7.2.1 ComposeContainer 规范

**[强制]** Compose 页面必须继承 ComposeContainer：

```kotlin
// ✅ 正确
@Page("ComposeDemo")
internal class ComposeDemoPage : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            MyComposable()
        }
    }
}

// ❌ 错误：不要在 body() 中使用 Compose
@Page("WrongDemo")
internal class WrongDemoPage : Pager() {
    override fun body(): ViewBuilder {
        setContent { /* 不要这样做 */ }
        return { }
    }
}
```

#### 7.2.2 HotPreview 使用规范

**[推荐]** 使用 @HotPreview 提高开发效率：

```kotlin
// ✅ 推荐：可独立预览的 Composable
@HotPreview
@Composable
fun UserCard() {
    Card {
        Text("User Info")
    }
}

// 会自动生成 UserCardPreviewPager

// ⚠️ 不建议给有大量依赖的函数加预览
@HotPreview  // 不推荐
@Composable
fun ComplexPage(
    viewModel: ViewModel,
    repository: Repository,
    // 很多依赖...
) {
    // 复杂页面
}
```

#### 7.2.3 状态提升规范

**[推荐]** 合理进行状态提升：

```kotlin
// ✅ 好的状态提升
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }
    
    Counter(
        count = count,
        onIncrement = { count++ }
    )
}

@Composable
fun Counter(
    count: Int,
    onIncrement: () -> Unit
) {
    Column {
        Text("Count: $count")
        Button(onClick = onIncrement) {
            Text("Increment")
        }
    }
}

// ❌ 不好：状态管理混乱
@Composable
fun BadCounter() {
    // 状态分散，难以管理
}
```

### 7.3 跨平台代码规范

#### 7.3.1 expect/actual 使用规范

**[强制]** 平台特定代码使用 expect/actual：

```kotlin
// commonMain - 定义接口
expect class PlatformUtils {
    companion object {
        fun isIOS(): Boolean
        fun platformName(): String
    }
}

expect fun showNativeDialog(title: String, message: String)

// androidMain - 实现
actual class PlatformUtils {
    actual companion object {
        actual fun isIOS(): Boolean = false
        actual fun platformName(): String = "Android"
    }
}

actual fun showNativeDialog(title: String, message: String) {
    // Android 实现
    Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
}

// iosMain - 实现
actual class PlatformUtils {
    actual companion object {
        actual fun isIOS(): Boolean = true
        actual fun platformName(): String = "iOS"
    }
}

actual fun showNativeDialog(title: String, message: String) {
    // iOS 实现
    UIAlertController.show(title, message)
}
```

#### 7.3.2 平台判断规范

**[推荐]** 使用 vif 进行平台判断：

```kotlin
// ✅ 推荐
override fun body(): ViewBuilder {
    return {
        vif({ PlatformUtils.isIOS() }) {
            iOSSwitch { /* iOS 特有组件 */ }
        }
        
        vif({ PlatformUtils.isAndroid() }) {
            AndroidCheckbox { /* Android 特有组件 */ }
        }
    }
}

// ⚠️ 也可以但不够声明式
override fun body(): ViewBuilder {
    return {
        if (PlatformUtils.isIOS()) {
            iOSSwitch { }()
        }
    }
}
```

### 7.4 模块通信规范

**[推荐]** 使用 Module 进行模块间通信：

```kotlin
// 定义模块
class UserModule : Module() {
    companion object {
        const val MODULE_NAME = "UserModule"
    }
    
    fun getUserInfo(userId: String): UserInfo {
        // 实现
    }
}

// 在 Pager 中注册
override fun createExternalModules(): Map<String, Module> {
    return mapOf(
        UserModule.MODULE_NAME to UserModule()
    )
}

// 使用模块
fun loadUser() {
    val module = acquireModule<UserModule>(UserModule.MODULE_NAME)
    val user = module.getUserInfo("123")
}
```

## 8. 版本控制

### 8.1 Commit 规范
**[强制]** 遵循约定式提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具

**Kuikly 特定的 scope**:
- `core`: 核心模块
- `compose`: Compose 模块
- `render-android`: Android 渲染
- `render-ios`: iOS 渲染
- `render-ohos`: 鸿蒙渲染
- `ksp`: KSP 注解处理
- `demo`: 示例代码

**示例**:
```
feat(compose): 新增滚动性能优化

- 优化 LazyColumn 渲染
- 减少不必要的重组

Closes #123

feat(ksp): 支持 @HotPreview 注解

- 自动生成预览 Pager
- 支持 Composable 函数预览

fix(render-ios): 修复 iOS 14 崩溃问题

- 修复 UIView 层级问题
- 添加兼容性处理

Fixes #456
```

详细规范参考：dev-guide.md

## 8. 代码审查

### 8.1 自查清单
**[推荐]** 提交代码前进行自查

- [ ] 代码符合编码规范
- [ ] 函数和类职责单一
- [ ] 变量和函数命名清晰
- [ ] 没有硬编码的魔法数字
- [ ] 异常处理完善
- [ ] 添加了必要的注释
- [ ] 编写了单元测试
- [ ] 没有无用的代码

详细代码评审规范参考：ai-code-review-rules.md

## 9. 性能规范

### 9.1 避免性能陷阱

```kotlin
// ❌ 不好：字符串拼接
var result = ""
for (item in items) {
    result += item.toString()
}

// ✅ 好：使用 StringBuilder
val result = buildString {
    for (item in items) {
        append(item.toString())
    }
}

// ❌ 不好：不必要的对象创建
fun process(items: List<Item>) {
    items.forEach {
        val processor = Processor()  // 每次循环创建
        processor.process(it)
    }
}

// ✅ 好：复用对象
fun process(items: List<Item>) {
    val processor = Processor()  // 只创建一次
    items.forEach {
        processor.process(it)
    }
}
```

### 9.2 内存管理

```kotlin
// ✅ 及时释放资源
class MyClass : Closeable {
    private val resource = HeavyResource()
    
    override fun close() {
        resource.release()
    }
}

// 使用 use 自动管理资源
MyClass().use { instance ->
    instance.doSomething()
}
```

## 10. 安全规范

### 10.1 敏感数据处理

```kotlin
// ❌ 错误：硬编码敏感信息
const val API_KEY = "1234567890abcdef"

// ✅ 正确：使用配置
val apiKey = BuildConfig.API_KEY

// ❌ 错误：明文存储密码
sharedPreferences.edit()
    .putString("password", password)
    .apply()

// ✅ 正确：加密存储
secureStorage.save("password", encrypt(password))
```

详细安全规范参考：security-rules.md

## 11. 平台特定规范

### 11.1 跨平台代码

```kotlin
// ✅ 正确使用 expect/actual
// commonMain
expect class PlatformContext

expect fun getPlatformName(): String

// androidMain
actual typealias PlatformContext = Context

actual fun getPlatformName(): String = "Android"

// iosMain
actual typealias PlatformContext = UIViewController

actual fun getPlatformName(): String = "iOS"
```

### 11.2 平台 API 使用

```kotlin
// ✅ 优先使用跨平台 API
// 使用 kotlinx.datetime 而不是平台特定的日期API

// ✅ 平台特定功能用 expect/actual 封装
expect fun showToast(message: String)

// Android
actual fun showToast(message: String) {
    Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
}

// iOS
actual fun showToast(message: String) {
    // iOS 实现
}
```

## 12. 工具配置

### 12.1 EditorConfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.kt]
indent_size = 4
max_line_length = 120

[*.xml]
indent_size = 2
```

### 12.2 Ktlint/Detekt 配置

**build.gradle.kts**:
```kotlin
plugins {
    id("io.gitlab.arturbosch.detekt") version "1.23.1"
}

detekt {
    config = files("${project.rootDir}/config/detekt/detekt.yml")
    buildUponDefaultConfig = true
}
```

---

**文档维护者**: Kuikly 团队  
**最后更新**: 2025-09-30

---

## 附录：快速参考

### 命名速查表

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 小写，点分隔 | `com.tencent.kuikly.core` |
| 类名 | 大驼峰 | `UserRepository` |
| 函数名 | 小驼峰 | `getUserById` |
| 变量名 | 小驼峰 | `userName` |
| 常量名 | 全大写下划线 | `MAX_COUNT` |
| Composable | 大驼峰 | `UserProfile` |

### 常用缩写

| 缩写 | 全称 | 使用 |
|------|------|------|
| Id | Identifier | ✅ `userId` |
| Url | Uniform Resource Locator | ✅ `apiUrl` |
| Http | Hypertext Transfer Protocol | ✅ `HttpClient` |
| Json | JavaScript Object Notation | ✅ `parseJson` |
| Xml | eXtensible Markup Language | ✅ `XmlParser` |
