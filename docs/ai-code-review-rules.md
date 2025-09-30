# Kuikly 代码评审规范

## 1. 代码评审概述

### 1.1 评审目的
- 提高代码质量
- 发现潜在问题
- 统一代码风格
- 知识分享和团队学习
- 确保代码可维护性

### 1.2 评审原则
- **及时性**: 提交后 24 小时内完成评审
- **建设性**: 提出问题时给出建议
- **尊重性**: 对事不对人，友善沟通
- **全面性**: 关注功能、性能、安全等多方面
- **学习性**: 互相学习，共同进步

## 2. 评审流程

### 2.1 提交前自查

**开发者自查清单**:
- [ ] 代码已在本地测试通过
- [ ] 单元测试已编写并通过
- [ ] 代码符合编码规范
- [ ] 没有遗留的 TODO 或注释掉的代码
- [ ] 没有硬编码的敏感信息
- [ ] 提交信息清晰明确
- [ ] 相关文档已更新

### 2.2 发起评审

**PR/MR 规范**:

**标题格式**:
```
<type>(<scope>): <subject>

示例:
feat(compose): 新增滚动性能优化
fix(core): 修复内存泄漏问题
```

**描述模板**:
```markdown
## 变更说明
[简要说明本次变更的目的和内容]

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 性能优化
- [ ] 代码重构
- [ ] 文档更新
- [ ] 测试补充

## 相关 Issue/需求
- Issue #XXX
- 需求文档: [链接]

## 主要改动
- 改动点1: [说明]
- 改动点2: [说明]

## 测试情况
- [x] 单元测试通过
- [x] Android 平台测试通过
- [x] iOS 平台测试通过
- [ ] 鸿蒙平台测试中

## 截图/录屏
[如有 UI 变化，提供截图或录屏]

## 注意事项
[需要评审者特别关注的点]

## CheckList
- [ ] 代码符合编码规范
- [ ] 已编写单元测试
- [ ] 文档已更新
- [ ] 无明显性能问题
- [ ] 无安全隐患
```

### 2.3 评审执行

**评审者职责**:
1. 在 24 小时内完成评审
2. 仔细阅读代码变更
3. 运行和测试代码（必要时）
4. 提出具体的评审意见
5. 标记评审结果（通过/需要修改/拒绝）

**评审重点**:
- 功能正确性
- 代码质量
- 性能影响
- 安全问题
- 可维护性

### 2.4 反馈处理

**开发者响应**:
1. 及时回复评审意见
2. 修改代码或说明原因
3. 更新 PR 并通知评审者
4. 所有问题解决后请求再次评审

**再次评审**:
- 确认问题已解决
- 无新问题引入
- 批准合并

## 3. 评审检查项

### 3.1 功能正确性

**检查要点**:
- [ ] 是否实现了需求的所有功能点
- [ ] 逻辑是否正确
- [ ] 边界条件是否处理
- [ ] 异常情况是否处理
- [ ] 是否有遗漏的场景

**常见问题**:
```kotlin
// ❌ 错误：未处理空值
fun processData(data: String) {
    val length = data.length // 如果 data 为 null 会崩溃
}

// ✅ 正确：处理空值
fun processData(data: String?) {
    val length = data?.length ?: 0
}
```

### 3.2 代码风格

**Kotlin 编码规范**:
- [ ] 遵循 Kotlin 官方编码规范
- [ ] 命名清晰且符合规范
- [ ] 适当使用 Kotlin 特性
- [ ] 避免不必要的复杂性

**命名规范**:
```kotlin
// ✅ 好的命名
class UserRepository
fun getUserById(id: String): User
val isLoggedIn: Boolean
const val MAX_RETRY_COUNT = 3

// ❌ 不好的命名
class UR
fun get(id: String): User
val flag: Boolean
const val N = 3
```

**代码格式**:
```kotlin
// ✅ 格式良好
fun calculateTotal(
    price: Double,
    quantity: Int,
    discount: Double = 0.0
): Double {
    return price * quantity * (1 - discount)
}

// ❌ 格式混乱
fun calculateTotal(price:Double,quantity:Int,discount:Double=0.0):Double{
return price*quantity*(1-discount)}
```

### 3.3 代码质量

**简洁性**:
```kotlin
// ❌ 冗余
fun isAdult(age: Int): Boolean {
    if (age >= 18) {
        return true
    } else {
        return false
    }
}

// ✅ 简洁
fun isAdult(age: Int): Boolean = age >= 18
```

**可读性**:
```kotlin
// ❌ 难以理解
fun check(x: Int, y: Int): Boolean = x > 0 && x < 100 && y > 0 && y < 100 && (x + y) % 2 == 0

// ✅ 清晰易读
fun isValidCoordinate(x: Int, y: Int): Boolean {
    val isXValid = x in 1..99
    val isYValid = y in 1..99
    val isSumEven = (x + y) % 2 == 0
    return isXValid && isYValid && isSumEven
}
```

**复用性**:
```kotlin
// ❌ 重复代码
fun formatUserName(firstName: String, lastName: String): String {
    return "${firstName.trim()} ${lastName.trim()}"
}

fun formatAddress(street: String, city: String): String {
    return "${street.trim()}, ${city.trim()}"
}

// ✅ 提取公共逻辑
private fun String.trimmed(): String = this.trim()

fun formatUserName(firstName: String, lastName: String): String {
    return "${firstName.trimmed()} ${lastName.trimmed()}"
}

fun formatAddress(street: String, city: String): String {
    return "${street.trimmed()}, ${city.trimmed()}"
}
```

### 3.4 性能问题

**常见性能问题**:
```kotlin
// ❌ 性能问题：频繁字符串拼接
fun buildString(items: List<String>): String {
    var result = ""
    items.forEach { result += it }
    return result
}

// ✅ 使用 StringBuilder
fun buildString(items: List<String>): String {
    return buildString {
        items.forEach { append(it) }
    }
}

// ❌ 性能问题：不必要的重组
@Composable
fun UserList(users: List<User>) {
    users.forEach { user ->
        Text("${user.firstName} ${user.lastName}")
    }
}

// ✅ 使用 key 避免不必要的重组
@Composable
fun UserList(users: List<User>) {
    users.forEach { user ->
        key(user.id) {
            Text("${user.firstName} ${user.lastName}")
        }
    }
}
```

**内存泄漏检查**:
```kotlin
// ❌ 内存泄漏：Activity 引用
class DataManager(private val context: Activity) {
    // Activity 可能被长期持有
}

// ✅ 使用 Application Context
class DataManager(private val context: Context) {
    private val appContext = context.applicationContext
}
```

### 3.5 安全问题

**常见安全问题**:
```kotlin
// ❌ 硬编码敏感信息
const val API_KEY = "sk-1234567890abcdef"

// ✅ 使用配置文件或环境变量
val apiKey = BuildConfig.API_KEY

// ❌ SQL 注入风险
fun getUser(username: String): User {
    val sql = "SELECT * FROM users WHERE username = '$username'"
    // 执行查询
}

// ✅ 使用参数化查询
fun getUser(username: String): User {
    val sql = "SELECT * FROM users WHERE username = ?"
    // 使用预编译语句
}

// ❌ 未加密的敏感数据
fun savePassword(password: String) {
    sharedPreferences.edit()
        .putString("password", password)
        .apply()
}

// ✅ 加密存储
fun savePassword(password: String) {
    val encrypted = encrypt(password)
    sharedPreferences.edit()
        .putString("password", encrypted)
        .apply()
}
```

### 3.6 测试覆盖

**单元测试**:
```kotlin
// 需要对应的测试
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
    fun divide(a: Int, b: Int): Int = a / b
}

// ✅ 完整的测试
class CalculatorTest {
    private val calculator = Calculator()
    
    @Test
    fun `add returns sum of two numbers`() {
        assertEquals(5, calculator.add(2, 3))
    }
    
    @Test
    fun `divide returns quotient`() {
        assertEquals(2, calculator.divide(6, 3))
    }
    
    @Test(expected = ArithmeticException::class)
    fun `divide throws exception when dividing by zero`() {
        calculator.divide(6, 0)
    }
}
```

**测试覆盖率检查**:
- [ ] 核心逻辑有单元测试
- [ ] 测试覆盖率 >= 80%
- [ ] 边界条件有测试
- [ ] 异常情况有测试

### 3.7 文档注释

**KDoc 注释**:
```kotlin
// ✅ 完整的文档注释
/**
 * 计算两个数的和
 *
 * @param a 第一个加数
 * @param b 第二个加数
 * @return 两数之和
 * @throws IllegalArgumentException 如果参数为负数
 */
fun add(a: Int, b: Int): Int {
    require(a >= 0 && b >= 0) { "参数不能为负数" }
    return a + b
}

// ❌ 缺少文档
fun add(a: Int, b: Int): Int = a + b
```

**注释要求**:
- [ ] 公共 API 有 KDoc 注释
- [ ] 复杂逻辑有行内注释
- [ ] 注释准确且有意义
- [ ] 避免无意义的注释

```kotlin
// ❌ 无意义的注释
// 设置名称
name = "张三"

// ✅ 有意义的注释
// 使用默认名称，因为用户未设置昵称
name = "张三"
```

### 3.8 依赖管理

**依赖检查**:
- [ ] 新增依赖是否必要
- [ ] 依赖版本是否合理
- [ ] 是否有更轻量的替代方案
- [ ] 是否会增加包体积

```kotlin
// ❌ 引入大型库只用一个功能
implementation("com.google.guava:guava:31.1-jre") // 只用来格式化字符串

// ✅ 自己实现简单功能
fun formatString(str: String): String {
    return str.trim().capitalize()
}
```

### 3.9 平台兼容性

**跨平台代码检查**:
```kotlin
// ✅ 正确的跨平台代码
expect class PlatformSpecific {
    fun platformMethod(): String
}

// Android 实现
actual class PlatformSpecific {
    actual fun platformMethod(): String = "Android"
}

// iOS 实现
actual class PlatformSpecific {
    actual fun platformMethod(): String = "iOS"
}
```

**平台差异处理**:
- [ ] 各平台实现是否完整
- [ ] 平台特性是否正确使用
- [ ] 是否有平台兼容性问题

### 3.10 向后兼容

**API 兼容性**:
```kotlin
// ❌ 直接删除或修改公共 API
// 旧版本
fun getData(): String

// 新版本（破坏兼容性）
fun getData(): List<String>

// ✅ 保持兼容
@Deprecated("Use getDataList() instead", ReplaceWith("getDataList()"))
fun getData(): String = getDataList().firstOrNull() ?: ""

fun getDataList(): List<String>
```

## 4. 评审意见规范

### 4.1 意见等级

**Must (必须修改)**:
- 功能错误
- 严重性能问题
- 安全漏洞
- 可能导致崩溃的问题

**Should (建议修改)**:
- 代码规范问题
- 一般性能优化
- 可读性改进
- 最佳实践

**Nice to have (可选)**:
- 优化建议
- 个人偏好
- 额外的功能建议

### 4.2 意见格式

**建设性意见**:
```markdown
❌ 不好的评审意见:
"这段代码写得太差了"

✅ 好的评审意见:
[Must] 这里存在空指针异常风险，建议添加空值检查：
\`\`\`kotlin
val result = data?.let { processData(it) }
\`\`\`
```

**具体示例**:
```markdown
[Must] 性能问题：循环内创建对象
当前代码在循环内创建新对象，数据量大时会影响性能：
\`\`\`kotlin
// 当前代码
fun process(items: List<Item>) {
    items.forEach {
        val processor = Processor() // 每次循环创建新对象
        processor.process(it)
    }
}
\`\`\`

建议改为：
\`\`\`kotlin
fun process(items: List<Item>) {
    val processor = Processor() // 在循环外创建
    items.forEach {
        processor.process(it)
    }
}
\`\`\`
```

## 5. AI 辅助代码评审

### 5.1 使用 AI 工具

**推荐工具**:
- GitHub Copilot
- ChatGPT
- Claude
- Cursor AI

**AI 评审流程**:
1. 将代码提交给 AI 工具
2. 要求 AI 从多个维度分析
3. 结合 AI 建议和人工判断
4. 给出最终评审意见

**AI 提示词模板**:
```
请帮我评审以下 Kotlin 代码，重点关注：
1. 功能正确性
2. 代码质量和可读性
3. 性能问题
4. 安全隐患
5. 最佳实践

代码：
```kotlin
[粘贴代码]
```

请给出具体的改进建议和示例代码。
```

### 5.2 AI 评审注意事项

- AI 建议仅供参考，需人工判断
- 不要盲目采纳所有 AI 建议
- 注意项目特定的规范和约束
- 敏感代码不要提交给公开 AI 服务

## 6. 评审记录

### 6.1 评审模板

```markdown
## 代码评审记录

**PR/MR**: #XXX
**作者**: [姓名]
**评审者**: [姓名]
**评审时间**: YYYY-MM-DD
**评审结果**: ✅ 通过 / ⚠️ 需要修改 / ❌ 拒绝

### 主要问题

#### [Must] 问题1
**位置**: `文件名:行号`
**描述**: [问题描述]
**建议**: [改进建议]
**状态**: 待修复 / 已修复 / 已说明

#### [Should] 问题2
**位置**: `文件名:行号`
**描述**: [问题描述]
**建议**: [改进建议]
**状态**: 待修复 / 已修复 / 已说明

### 优点

- [值得学习的地方]
- [做得好的地方]

### 总体评价

[总结性评价]

### 后续跟进

- [ ] 待办事项1
- [ ] 待办事项2
```

## 7. 特殊场景评审

### 7.1 紧急修复

**快速评审流程**:
1. 明确标记为紧急修复
2. 重点关注修复的问题
3. 快速验证功能正确性
4. 后续补充完整评审

### 7.2 大规模重构

**分步评审**:
1. 先评审整体设计
2. 分模块分批评审
3. 关注向后兼容性
4. 充分测试验证

### 7.3 第三方贡献

**社区贡献评审**:
1. 感谢贡献者
2. 更详细的说明和指导
3. 提供示例和文档链接
4. 保持友好和耐心

## 8. 评审最佳实践

### 8.1 评审者

**DO**:
- ✅ 及时评审
- ✅ 提供具体建议
- ✅ 给出示例代码
- ✅ 友善沟通
- ✅ 认可优点

**DON'T**:
- ❌ 拖延评审
- ❌ 只指出问题不给建议
- ❌ 过于主观的意见
- ❌ 人身攻击
- ❌ 只关注缺点

### 8.2 提交者

**DO**:
- ✅ 提交前自查
- ✅ 提供完整信息
- ✅ 及时响应评审
- ✅ 虚心接受意见
- ✅ 解释设计决策

**DON'T**:
- ❌ 提交未测试的代码
- ❌ 忽视评审意见
- ❌ 防御性回应
- ❌ 拖延修改
- ❌ 强行合并

## 9. 持续改进

### 9.1 评审数据统计

**统计指标**:
- 平均评审时间
- 发现的问题数量
- 问题类型分布
- 评审通过率

### 9.2 经验总结

**定期回顾**:
- 每月总结常见问题
- 分享优秀案例
- 更新评审规范
- 团队培训

### 9.3 工具优化

**提高效率**:
- 使用代码检查工具
- 配置自动化检查
- 集成 AI 辅助评审
- 优化评审流程

---

**文档维护者**: Kuikly 团队  
**最后更新**: 2025-09-30
