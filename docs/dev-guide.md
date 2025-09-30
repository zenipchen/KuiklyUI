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

## 5. 项目结构

```
.
├── core/                    # 跨平台核心模块
│   ├── src/
│   │   ├── commonMain/      # 共享代码
│   │   ├── androidMain/     # Android 实现
│   │   ├── iosMain/         # iOS 实现
│   │   ├── ohosArm64Main/   # 鸿蒙实现
│   │   └── jsMain/          # Web/小程序实现
├── core-render-android/     # Android 渲染器
├── core-render-ios/         # iOS 渲染器
├── core-render-ohos/        # 鸿蒙渲染器
├── core-render-web/         # Web 渲染器
├── core-annotations/        # 注解定义
├── core-ksp/               # 注解处理器
├── compose/                # Compose 跨平台模块
├── demo/                   # 示例代码
├── androidApp/             # Android 宿主
├── iosApp/                 # iOS 宿主
├── ohosApp/                # 鸿蒙宿主
├── h5App/                  # H5 宿主
└── miniApp/                # 小程序宿主
```

## 6. 编码规范

详细编码规范参考：user-rules.md

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
