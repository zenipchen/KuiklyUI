# Kuikly 项目文档中心

欢迎来到 Kuikly 项目文档中心！这里包含了 Kuikly 开发的完整指南和规范。

## 📚 文档目录

### 🚀 核心文档

1. **[开发指南 (dev-guide.md)](./dev-guide.md)**
   - 开发环境配置
   - 分支管理和提交规范
   - 开发流程说明
   - 项目结构解析

2. **[技术架构方案 (project-arch.md)](./project-arch.md)** ⭐ 已完善
   - Kuikly 总体架构
   - 核心模块设计（Pager、响应式系统、ComposeContainer、KSP处理器）
   - 实际代码示例
   - 技术选型和风险评估

3. **[代码示例大全 (kuikly-code-examples.md)](./kuikly-code-examples.md)** ⭐ 新增
   - 自研 DSL 完整语法和示例
   - Compose DSL 完整语法和示例
   - @Page 和 @HotPreview 注解使用
   - 响应式状态管理
   - 平台特定代码（expect/actual）
   - 模块通信
   - 最佳实践

### 📝 规范文档

4. **[编码规范 (user-rules.md)](./user-rules.md)**
   - Kotlin 编码规范
   - 命名规范
   - 代码风格
   - Compose 规范
   - 文档注释规范

5. **[代码评审规范 (ai-code-review-rules.md)](./ai-code-review-rules.md)**
   - 评审流程
   - 检查要点
   - 评审意见规范
   - AI 辅助评审

6. **[测试规范 (test-rules.md)](./test-rules.md)**
   - 单元测试
   - Compose 测试
   - 平台特定测试
   - 性能测试
   - 测试覆盖率

7. **[安全规范 (security-rules.md)](./security-rules.md)**
   - 数据安全
   - 认证授权
   - 输入验证
   - 密码学使用

### 📋 流程文档

8. **[需求文档模板 (requirement-rules.md)](./requirement-rules.md)**
   - PRD 编写规范
   - 需求分析方法
   - 功能设计
   - 验收标准

9. **[UI 设计规范 (ui-design-rules.md)](./ui-design-rules.md)**
   - 设计流程
   - 设计规范（颜色、字体、间距）
   - 组件设计
   - 平台适配

10. **[开发日志模板 (devlog-rules.md)](./devlog-rules.md)**
    - 每日工作记录
    - 技术难点总结
    - 测试情况记录
    - 周报模板

11. **[发布上线规范 (release-rules.md)](./release-rules.md)**
    - 发布流程
    - 灰度发布策略
    - 回滚方案
    - 监控告警

## 🎯 快速开始

### 新人上手路径

1. 阅读 [开发指南](./dev-guide.md) 了解项目整体情况
2. 学习 [编码规范](./user-rules.md) 掌握代码风格
3. 查看 [代码示例](./kuikly-code-examples.md) 学习实际用法
4. 参考 [技术架构](./project-arch.md) 理解项目设计

### 开发者路径

1. 查阅 [代码示例](./kuikly-code-examples.md) 快速上手开发
2. 遵循 [编码规范](./user-rules.md) 编写代码
3. 参考 [测试规范](./test-rules.md) 编写测试
4. 按照 [代码评审规范](./ai-code-review-rules.md) 提交 PR

### 架构师/技术负责人路径

1. 研读 [技术架构方案](./project-arch.md) 了解整体设计
2. 参考 [需求文档模板](./requirement-rules.md) 编写技术方案
3. 查看 [安全规范](./security-rules.md) 确保安全性
4. 使用 [发布上线规范](./release-rules.md) 管理发布

## 📖 Kuikly 核心概念

### 双 DSL 支持

Kuikly 支持两种UI开发模式：

#### 1. 自研 DSL（声明式+响应式）

```kotlin
@Page("HelloWorld")
internal class HelloWorldPage : Pager() {
    var count: Int by observable(0)
    
    override fun body(): ViewBuilder {
        return {
            View {
                attr {
                    flex(1f)
                    backgroundColor(Color.WHITE)
                }
                Text {
                    attr { text("Count: $count") }
                }
                event {
                    click { count++ }
                }
            }
        }
    }
}
```

#### 2. Compose DSL（基于 Jetpack Compose）

```kotlin
@Page("ComposeDemo")
internal class ComposeDemoPage : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            ComposeContent()
        }
    }
}

@Composable
fun ComposeContent() {
    var count by remember { mutableStateOf(0) }
    Column {
        Text("Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

### 注解驱动

```kotlin
// @Page 注解自动生成入口代码
@Page("MyPage", supportInLocal = true, moduleId = "module1")
internal class MyPage : Pager() { }

// @HotPreview 注解自动生成预览 Pager
@HotPreview
@Composable
fun PreviewComponent() { }
```

### 跨平台架构

```
业务代码 (commonMain)
    ↓
Core 层 (Reactive + Layout + Bridge)
    ↓
Platform Render (Android/iOS/Ohos/Web)
    ↓
原生 UI 渲染
```

## 🔧 项目配置

### Kotlin 版本支持

项目支持多个 Kotlin 版本，默认使用 2.0.21：

- `build.2.0.21.gradle.kts` - Kotlin 2.0.21 (默认)
- `build.1.9.22.gradle.kts` - Kotlin 1.9.22
- `build.1.8.21.gradle.kts` - Kotlin 1.8.21
- 其他历史版本...

### 平台支持

- ✅ Android (5.0+, API 21+)
- ✅ iOS (12.0+)
- ✅ HarmonyOS Next (5.0.0(12)+)
- ✅ Web (Chrome 90+, Safari 14+)
- ✅ 微信小程序 (基础库 2.0+)

## 📦 核心模块

### core

跨平台核心模块，包含：
- 响应式UI框架
- Flexbox 布局引擎
- Bridge 通信机制
- 状态管理系统

**包名**: `com.tencent.kuikly.core.*`

### compose

Compose DSL 支持，基于 Jetpack Compose 1.7.3：
- Material3 组件
- Foundation 组件
- UI核心（Modifier, State, Effect等）

**包名**: `com.tencent.kuikly.compose.*`

### core-ksp

KSP 注解处理器：
- @Page 注解处理
- @HotPreview 注解处理
- 自动生成入口代码

### core-render-*

各平台的渲染实现：
- `core-render-android` - Android View 渲染
- `core-render-ios` - iOS UIKit 渲染
- `core-render-ohos` - 鸿蒙 ArkUI 渲染
- `core-render-web` - Web DOM/WXML 渲染

## 🌟 特色功能

### 1. 热预览 (HotPreview)

使用 @HotPreview 注解即可为 Composable 函数自动生成预览页面：

```kotlin
@HotPreview
@Composable
fun MyComponent() {
    Text("Preview Me!")
}

// KSP 自动生成 MyComponentPreviewPager
```

### 2. 响应式状态管理

使用 `by observable` 即可实现响应式：

```kotlin
var count: Int by observable(0)
var items: ObservableList<String> by observableList()

// 状态变化自动触发 UI 更新
count++
items.add("New Item")
```

### 3. 双向数据绑定

自研 DSL 支持双向绑定：

```kotlin
Input {
    attr {
        value(ctx.text)
        onValueChange { newValue ->
            ctx.text = newValue
        }
    }
}
```

### 4. 跨平台抽象

使用 expect/actual 机制实现平台差异：

```kotlin
// commonMain
expect fun getPlatformName(): String

// androidMain
actual fun getPlatformName() = "Android"

// iosMain
actual fun getPlatformName() = "iOS"
```

## 📚 相关资源

### 官方资源

- [官方网站](https://kuikly.tds.qq.com/)
- [快速开始](https://kuikly.tds.qq.com/QuickStart/hello-world.html)
- [API 文档](https://kuikly.tds.qq.com/API/components/override.html)
- [GitHub 仓库](https://github.com/Tencent-TDS/KuiklyUI)

### 学习资源

- [应用案例](https://kuikly.tds.qq.com/Introduction/application_cases.html)
- [常见问题](https://kuikly.tds.qq.com/QA/kuikly-qa.html)
- [Roadmap 2025](https://kuikly.tds.qq.com/Blog/roadmap2025.html)

### 社区

- 腾讯端服务微信公众号
- TDS Framework 微信公众号
- 在线技术支持

## 📝 文档更新日志

### 2025-09-30

- ✨ 新增：`kuikly-code-examples.md` - 完整的代码示例文档
- ✨ 更新：`project-arch.md` - 添加基于实际源码的架构细节
- ✨ 创建：`README.md` - 文档中心索引
- 📝 完善所有文档模板，添加 Kuikly 特定内容

### 2025-09-30 (初始版本)

- 📝 创建所有基础文档模板
  - dev-guide.md
  - project-arch.md
  - devlog-rules.md
  - requirement-rules.md
  - ui-design-rules.md
  - ai-code-review-rules.md
  - test-rules.md
  - security-rules.md
  - release-rules.md
  - user-rules.md

## 🤝 贡献

欢迎为文档做出贡献！如果您发现文档中的错误或希望补充内容，请：

1. Fork 项目
2. 创建特性分支
3. 提交您的修改
4. 发起 Pull Request

## 📄 许可证

本文档遵循 Kuikly 项目的许可证。

---

**文档维护团队**: Kuikly 团队  
**最后更新**: 2025-09-30  
**文档版本**: v1.0

有问题？查看 [常见问题](https://kuikly.tds.qq.com/QA/kuikly-qa.html) 或联系我们！
