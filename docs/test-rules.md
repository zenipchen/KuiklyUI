# Kuikly 单元测试规范

## 1. 测试概述

### 1.1 测试目标
- 确保代码功能正确
- 防止回归问题
- 提高代码质量
- 促进模块化设计
- 作为文档使用

### 1.2 测试原则
- **全面性**: 覆盖所有关键功能和边界情况
- **独立性**: 测试之间互不依赖
- **可重复性**: 每次运行结果一致
- **快速性**: 单元测试执行要快
- **清晰性**: 测试意图明确

### 1.3 测试金字塔

```
         /\
        /  \  E2E Tests (少量)
       /----\
      / UI   \ UI Tests (适量)
     /--------\
    /  单元测试 \ Unit Tests (大量)
   /------------\
```

## 2. 测试框架

### 2.1 Kotlin 多平台测试

**Common 测试**:
```kotlin
// commonTest
class CalculatorTest {
    @Test
    fun testAdd() {
        val calculator = Calculator()
        assertEquals(5, calculator.add(2, 3))
    }
}
```

**平台特定测试**:
```kotlin
// androidTest
class AndroidSpecificTest {
    @Test
    fun testAndroidFeature() {
        // Android 特定测试
    }
}

// iosTest
class IosSpecificTest {
    @Test
    fun testIosFeature() {
        // iOS 特定测试
    }
}
```

### 2.2 测试依赖

**build.gradle.kts**:
```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }
        
        val androidTest by getting {
            dependencies {
                implementation(kotlin("test-junit"))
                implementation("androidx.test:core:1.5.0")
                implementation("androidx.test.ext:junit:1.1.5")
            }
        }
        
        val iosTest by getting {
            // iOS 测试依赖
        }
    }
}
```

## 3. 单元测试规范

### 3.1 测试命名

**测试类命名**:
```kotlin
// 被测试类
class UserRepository

// 测试类
class UserRepositoryTest
```

**测试方法命名**:

**方式1**: 使用反引号（推荐）
```kotlin
@Test
fun `should return user when id exists`() {
    // 测试代码
}

@Test
fun `should throw exception when id is invalid`() {
    // 测试代码
}
```

**方式2**: 驼峰命名
```kotlin
@Test
fun shouldReturnUserWhenIdExists() {
    // 测试代码
}
```

**命名模式**: `should_期望结果_when_前置条件`

### 3.2 测试结构 (AAA 模式)

```kotlin
@Test
fun `should calculate total price correctly`() {
    // Arrange (准备)
    val calculator = PriceCalculator()
    val items = listOf(
        Item("商品1", 10.0, 2),
        Item("商品2", 20.0, 1)
    )
    
    // Act (执行)
    val total = calculator.calculateTotal(items)
    
    // Assert (断言)
    assertEquals(40.0, total)
}
```

### 3.3 测试覆盖

**核心功能**:
```kotlin
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
    fun subtract(a: Int, b: Int): Int = a - b
    fun multiply(a: Int, b: Int): Int = a * b
    fun divide(a: Int, b: Int): Int = a / b
}

class CalculatorTest {
    private lateinit var calculator: Calculator
    
    @Before
    fun setup() {
        calculator = Calculator()
    }
    
    @Test
    fun `add should return sum of two numbers`() {
        assertEquals(5, calculator.add(2, 3))
        assertEquals(0, calculator.add(-1, 1))
        assertEquals(-5, calculator.add(-2, -3))
    }
    
    @Test
    fun `divide should return quotient`() {
        assertEquals(2, calculator.divide(6, 3))
    }
    
    @Test(expected = ArithmeticException::class)
    fun `divide should throw exception when dividing by zero`() {
        calculator.divide(6, 0)
    }
}
```

**边界条件**:
```kotlin
@Test
fun `should handle empty list`() {
    val result = processItems(emptyList())
    assertTrue(result.isEmpty())
}

@Test
fun `should handle null input`() {
    val result = processData(null)
    assertNull(result)
}

@Test
fun `should handle large numbers`() {
    val result = calculate(Int.MAX_VALUE)
    assertNotNull(result)
}
```

**异常情况**:
```kotlin
@Test(expected = IllegalArgumentException::class)
fun `should throw exception for negative age`() {
    createUser(age = -1)
}

@Test
fun `should return error when network fails`() {
    // Mock 网络失败
    val result = repository.fetchData()
    assertTrue(result is Result.Error)
}
```

### 3.4 断言

**基本断言**:
```kotlin
// 相等性断言
assertEquals(expected, actual)
assertNotEquals(unexpected, actual)

// 布尔断言
assertTrue(condition)
assertFalse(condition)

// 空值断言
assertNull(value)
assertNotNull(value)

// 集合断言
assertContains(collection, element)
assertEmpty(collection)
```

**自定义断言消息**:
```kotlin
assertEquals(
    expected = 5,
    actual = calculator.add(2, 3),
    message = "2 + 3 应该等于 5"
)
```

**浮点数比较**:
```kotlin
// ❌ 不精确
assertEquals(0.3, 0.1 + 0.2) // 可能失败

// ✅ 使用 delta
assertEquals(0.3, 0.1 + 0.2, 0.0001)
```

## 4. Mock 和 Stub

### 4.1 使用 MockK

**依赖配置**:
```kotlin
dependencies {
    testImplementation("io.mockk:mockk:1.13.8")
}
```

**基本用法**:
```kotlin
@Test
fun `should fetch user from repository`() {
    // 创建 Mock 对象
    val repository = mockk<UserRepository>()
    
    // 定义行为
    every { repository.getUserById("123") } returns User("123", "张三")
    
    // 使用
    val service = UserService(repository)
    val user = service.getUser("123")
    
    // 验证
    assertEquals("张三", user.name)
    verify { repository.getUserById("123") }
}
```

**Mock 多次调用**:
```kotlin
@Test
fun `should handle multiple calls`() {
    val repository = mockk<DataRepository>()
    
    every { repository.getData() } returnsMany listOf(
        "第一次调用",
        "第二次调用",
        "第三次调用"
    )
    
    assertEquals("第一次调用", repository.getData())
    assertEquals("第二次调用", repository.getData())
    assertEquals("第三次调用", repository.getData())
}
```

**Mock 挂起函数**:
```kotlin
@Test
fun `should fetch data asynchronously`() = runTest {
    val repository = mockk<RemoteRepository>()
    
    coEvery { repository.fetchData() } returns Result.Success(data)
    
    val result = repository.fetchData()
    
    assertTrue(result is Result.Success)
    coVerify { repository.fetchData() }
}
```

### 4.2 测试协程

**使用 runTest**:
```kotlin
@Test
fun `should load data in coroutine`() = runTest {
    val viewModel = MyViewModel()
    
    viewModel.loadData()
    advanceUntilIdle() // 等待所有协程完成
    
    assertEquals(LoadState.Success, viewModel.state.value)
}
```

**测试延迟**:
```kotlin
@Test
fun `should delay execution`() = runTest {
    val startTime = currentTime
    
    delay(1000)
    
    assertEquals(1000, currentTime - startTime)
}
```

### 4.3 测试 Flow

```kotlin
@Test
fun `should emit values in flow`() = runTest {
    val flow = flow {
        emit(1)
        emit(2)
        emit(3)
    }
    
    val result = flow.toList()
    
    assertEquals(listOf(1, 2, 3), result)
}

@Test
fun `should transform flow values`() = runTest {
    val viewModel = MyViewModel()
    
    val values = mutableListOf<Int>()
    val job = launch {
        viewModel.dataFlow.toList(values)
    }
    
    viewModel.updateData(1)
    viewModel.updateData(2)
    
    job.cancel()
    
    assertEquals(listOf(1, 2), values)
}
```

## 5. Compose 测试

### 5.1 Compose 测试依赖

```kotlin
dependencies {
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

### 5.2 基本 Compose 测试

```kotlin
@Test
fun testButtonClick() {
    composeTestRule.setContent {
        MyButton(
            text = "点击",
            onClick = { /* ... */ }
        )
    }
    
    // 查找和点击按钮
    composeTestRule
        .onNodeWithText("点击")
        .performClick()
}
```

### 5.3 测试状态变化

```kotlin
@Test
fun testCounterIncrement() {
    composeTestRule.setContent {
        CounterScreen()
    }
    
    // 验证初始状态
    composeTestRule
        .onNodeWithText("0")
        .assertExists()
    
    // 点击增加按钮
    composeTestRule
        .onNodeWithContentDescription("增加")
        .performClick()
    
    // 验证状态更新
    composeTestRule
        .onNodeWithText("1")
        .assertExists()
}
```

### 5.4 测试输入

```kotlin
@Test
fun testTextInput() {
    var text = ""
    
    composeTestRule.setContent {
        TextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("输入") }
        )
    }
    
    // 输入文字
    composeTestRule
        .onNodeWithText("输入")
        .performTextInput("测试文字")
    
    // 验证
    assertEquals("测试文字", text)
}
```

## 6. 平台特定测试

### 6.1 Android 测试

**Context 相关测试**:
```kotlin
@RunWith(AndroidJUnit4::class)
class AndroidUtilsTest {
    private lateinit var context: Context
    
    @Before
    fun setup() {
        context = ApplicationProvider.getApplicationContext()
    }
    
    @Test
    fun testGetString() {
        val text = context.getString(R.string.app_name)
        assertNotNull(text)
    }
}
```

**Room 数据库测试**:
```kotlin
@RunWith(AndroidJUnit4::class)
class UserDaoTest {
    private lateinit var database: AppDatabase
    private lateinit var userDao: UserDao
    
    @Before
    fun setup() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java
        ).build()
        userDao = database.userDao()
    }
    
    @After
    fun teardown() {
        database.close()
    }
    
    @Test
    fun testInsertAndRead() = runTest {
        val user = User(1, "张三")
        userDao.insert(user)
        
        val loaded = userDao.getById(1)
        assertEquals(user, loaded)
    }
}
```

### 6.2 iOS 测试

```kotlin
// iosTest
class IosUtilsTest {
    @Test
    fun testPlatformSpecific() {
        val utils = PlatformUtils()
        assertEquals("iOS", utils.platformName)
    }
}
```

## 7. 性能测试

### 7.1 基准测试

```kotlin
@Test
fun testPerformance() {
    val startTime = System.currentTimeMillis()
    
    // 执行操作
    repeat(1000) {
        calculator.calculate(it)
    }
    
    val elapsed = System.currentTimeMillis() - startTime
    
    // 验证性能
    assertTrue(elapsed < 1000, "操作应在 1 秒内完成")
}
```

### 7.2 内存测试

```kotlin
@Test
fun testMemoryLeak() {
    val weakRef = WeakReference(createObject())
    
    // 触发 GC
    System.gc()
    Thread.sleep(100)
    
    // 验证对象已被回收
    assertNull(weakRef.get(), "对象应该被回收")
}
```

## 8. 测试数据

### 8.1 测试数据构建

**使用工厂方法**:
```kotlin
object TestDataFactory {
    fun createUser(
        id: String = "123",
        name: String = "测试用户",
        age: Int = 20
    ): User {
        return User(id, name, age)
    }
    
    fun createUserList(count: Int = 10): List<User> {
        return List(count) { createUser(id = it.toString()) }
    }
}

@Test
fun testWithFactoryData() {
    val user = TestDataFactory.createUser(name = "张三")
    assertEquals("张三", user.name)
}
```

### 8.2 测试数据文件

**使用资源文件**:
```kotlin
@Test
fun testWithJsonData() {
    val json = loadTestResource("test_user.json")
    val user = Json.decodeFromString<User>(json)
    assertNotNull(user)
}

private fun loadTestResource(filename: String): String {
    return this::class.java
        .getResource("/test-data/$filename")
        ?.readText() ?: ""
}
```

## 9. 测试覆盖率

### 9.1 配置覆盖率

**build.gradle.kts**:
```kotlin
android {
    buildTypes {
        debug {
            enableAndroidTestCoverage = true
            enableUnitTestCoverage = true
        }
    }
}

tasks.withType<Test> {
    configure<JacocoTaskExtension> {
        isIncludeNoLocationClasses = true
        excludes = listOf("jdk.internal.*")
    }
}
```

### 9.2 覆盖率目标

| 模块类型 | 目标覆盖率 |
|---------|-----------|
| 核心业务逻辑 | ≥ 90% |
| 工具类 | ≥ 80% |
| UI 层 | ≥ 60% |
| 整体项目 | ≥ 80% |

### 9.3 生成报告

```bash
# Android
./gradlew testDebugUnitTestCoverage

# 查看报告
open build/reports/coverage/test/debug/index.html
```

## 10. 持续集成

### 10.1 CI 配置

**GitHub Actions**:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          
      - name: Run tests
        run: ./gradlew test
        
      - name: Generate coverage report
        run: ./gradlew jacocoTestReport
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### 10.2 测试报告

- 单元测试报告
- 覆盖率报告
- 性能测试报告
- 失败用例分析

## 11. 最佳实践

### 11.1 DO

✅ **独立测试**:
```kotlin
@Test
fun testFeatureA() {
    // 完全独立的测试
}

@Test
fun testFeatureB() {
    // 不依赖 testFeatureA
}
```

✅ **清晰的测试意图**:
```kotlin
@Test
fun `should validate email format correctly`() {
    assertTrue(isValidEmail("test@example.com"))
    assertFalse(isValidEmail("invalid-email"))
}
```

✅ **测试一个概念**:
```kotlin
@Test
fun `should add item to cart`() {
    cart.addItem(item)
    assertTrue(cart.contains(item))
}

@Test
fun `should remove item from cart`() {
    cart.addItem(item)
    cart.removeItem(item)
    assertFalse(cart.contains(item))
}
```

### 11.2 DON'T

❌ **测试私有方法**:
```kotlin
// ❌ 不要直接测试私有方法
@Test
fun testPrivateMethod() {
    // 通过反射测试私有方法
}

// ✅ 通过公共 API 间接测试
@Test
fun testPublicMethodThatUsesPrivateMethod() {
    val result = myClass.publicMethod()
    assertEquals(expected, result)
}
```

❌ **测试依赖外部状态**:
```kotlin
// ❌ 依赖当前时间
@Test
fun testCurrentTime() {
    val time = getCurrentTime()
    assertTrue(time > 0) // 依赖当前系统时间
}

// ✅ 注入时间依赖
@Test
fun testWithMockedTime() {
    val clock = mockk<Clock>()
    every { clock.now() } returns fixedTime
    
    val time = getCurrentTime(clock)
    assertEquals(fixedTime, time)
}
```

❌ **过度 Mock**:
```kotlin
// ❌ Mock 太多
@Test
fun testWithTooManyMocks() {
    val mock1 = mockk<Dep1>()
    val mock2 = mockk<Dep2>()
    val mock3 = mockk<Dep3>()
    // ... 太多 mock
}

// ✅ 重构代码减少依赖
@Test
fun testWithSimpleDependency() {
    val dep = SimpleDependency()
    val result = myClass.doSomething(dep)
    assertEquals(expected, result)
}
```

## 12. 常见问题

### 12.1 测试运行慢

**解决方案**:
- 减少不必要的 setUp/tearDown
- 使用内存数据库代替真实数据库
- 并行运行测试
- 优化测试数据准备

### 12.2 测试不稳定

**解决方案**:
- 避免依赖时间
- 避免依赖网络
- 避免依赖随机数
- 正确处理异步操作

### 12.3 难以测试的代码

**解决方案**:
- 依赖注入
- 接口抽象
- 提取可测试的纯函数
- 重构代码结构

---

**文档维护者**: Kuikly 团队  
**最后更新**: 2025-09-30
