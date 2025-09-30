# Kuikly 发布上线规范

## 1. 发布概述

### 1.1 发布目标
- 保证发布质量
- 降低发布风险
- 提高发布效率
- 确保快速回滚能力

### 1.2 发布原则
- **小步快跑**: 频繁小版本发布
- **灰度发布**: 逐步扩大发布范围
- **快速回滚**: 出现问题立即回滚
- **监控先行**: 完善的监控体系
- **文档完整**: 详细的发布文档

### 1.3 版本命名规范

**语义化版本 (Semantic Versioning)**:
```
主版本号.次版本号.修订号 (MAJOR.MINOR.PATCH)

示例: 2.1.3
- 2: 主版本号（不兼容的 API 变更）
- 1: 次版本号（向后兼容的功能性新增）
- 3: 修订号（向后兼容的问题修正）
```

**版本示例**:
- `1.0.0`: 首次正式发布
- `1.1.0`: 新增功能
- `1.1.1`: Bug 修复
- `2.0.0`: 重大更新，可能不兼容

**预发布版本**:
- `1.0.0-alpha.1`: Alpha 版本
- `1.0.0-beta.1`: Beta 版本
- `1.0.0-rc.1`: Release Candidate

## 2. 发布流程

### 2.1 完整发布流程

```
需求确认 → 开发完成 → 代码评审 → 测试验证 → 准备发布 
    ↓
内部测试 → 小范围灰度 → 扩大灰度 → 全量发布 → 发布总结
    ↓
监控观察 → 问题处理 → 稳定运行
```

### 2.2 发布前准备

#### 2.2.1 代码准备

```bash
# 1. 确保本地代码最新
git checkout main
git pull origin main

# 2. 创建发布分支
git checkout -b release/2.1.0

# 3. 更新版本号
# 修改 gradle.properties 或相关配置文件

# 4. 更新 CHANGELOG
vim CHANGELOG.md

# 5. 提交版本变更
git add .
git commit -m "chore: bump version to 2.1.0"

# 6. 打标签
git tag -a v2.1.0 -m "Release version 2.1.0"

# 7. 推送到远程
git push origin release/2.1.0
git push origin v2.1.0
```

#### 2.2.2 版本配置

**gradle.properties**:
```properties
# 版本信息
VERSION_NAME=2.1.0
VERSION_CODE=210

# Kotlin 版本
KOTLIN_VERSION=2.0.21

# 发布配置
ENABLE_PROGUARD=true
ENABLE_SHRINK_RESOURCES=true
```

**build.gradle.kts**:
```kotlin
android {
    defaultConfig {
        versionCode = 210
        versionName = "2.1.0"
    }
    
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            
            // 签名配置
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

#### 2.2.3 更新 CHANGELOG

**CHANGELOG.md**:
```markdown
# Changelog

## [2.1.0] - 2025-09-30

### Added
- 新增滚动性能优化功能
- 支持鸿蒙平台新特性
- 新增国际化支持

### Changed
- 优化内存使用
- 改进 Compose 渲染性能
- 更新第三方依赖版本

### Fixed
- 修复 Android 平台内存泄漏
- 修复 iOS 平台崩溃问题
- 修复 Web 平台布局问题

### Security
- 加强数据加密
- 修复安全漏洞 CVE-2025-XXXX

## [2.0.0] - 2025-08-15
...
```

### 2.3 构建产物

#### 2.3.1 Android 构建

```bash
# 清理构建
./gradlew clean

# 构建 Release 版本
./gradlew assembleRelease

# 生成的文件位置
# app/build/outputs/apk/release/app-release.apk
```

**多渠道打包**:
```kotlin
android {
    flavorDimensions += "version"
    
    productFlavors {
        create("googlePlay") {
            dimension = "version"
            applicationIdSuffix = ".gp"
            versionNameSuffix = "-gp"
        }
        
        create("huawei") {
            dimension = "version"
            applicationIdSuffix = ".hw"
            versionNameSuffix = "-hw"
        }
    }
}
```

#### 2.3.2 iOS 构建

```bash
# 1. 安装依赖
cd iosApp
pod install

# 2. 打开 Xcode 项目
open iosApp.xcworkspace

# 3. 在 Xcode 中
# - 选择 Product -> Archive
# - 等待构建完成
# - 在 Organizer 中导出 IPA

# 或使用命令行
xcodebuild -workspace iosApp.xcworkspace \
           -scheme iosApp \
           -configuration Release \
           -archivePath build/iosApp.xcarchive \
           archive

xcodebuild -exportArchive \
           -archivePath build/iosApp.xcarchive \
           -exportPath build \
           -exportOptionsPlist ExportOptions.plist
```

#### 2.3.3 鸿蒙构建

```bash
# 1. 编译跨平台产物
./2.0_ohos_test_publish.sh

# 2. 在 DevEco Studio 中构建
# Build -> Build Hap(s)/APP(s)
# 生成 .hap 文件
```

#### 2.3.4 Web 构建

```bash
# 构建 Web 版本
./gradlew jsBrowserDistribution

# 生成的文件位置
# h5App/build/distributions/
```

### 2.4 测试验证

#### 2.4.1 测试检查清单

**功能测试**:
- [ ] 核心功能正常
- [ ] 新功能验证通过
- [ ] Bug 修复确认有效
- [ ] 兼容性测试通过

**性能测试**:
- [ ] 启动时间符合标准
- [ ] 内存占用正常
- [ ] CPU 使用率正常
- [ ] 包体积符合要求

**安全测试**:
- [ ] 无明显安全漏洞
- [ ] 数据加密正常
- [ ] 权限使用合理
- [ ] 代码混淆生效

**兼容性测试**:
- [ ] Android 5.0+ 设备测试通过
- [ ] iOS 12.0+ 设备测试通过
- [ ] 鸿蒙设备测试通过
- [ ] 不同屏幕尺寸适配正常

#### 2.4.2 回归测试

```kotlin
// 自动化回归测试
@Test
fun regressionTests() {
    // 核心功能测试
    testCoreFeatures()
    
    // 性能测试
    testPerformance()
    
    // 兼容性测试
    testCompatibility()
}
```

## 3. 灰度发布

### 3.1 灰度策略

**分阶段发布**:

| 阶段 | 范围 | 时长 | 观察指标 | 决策标准 |
|------|------|------|----------|----------|
| 阶段0 | 内部测试 | 1-2天 | 崩溃率、功能可用性 | 无阻塞问题 |
| 阶段1 | 1% 用户 | 2-3天 | 崩溃率、ANR率、关键指标 | 指标正常 |
| 阶段2 | 5% 用户 | 2-3天 | 全面监控 | 无新增问题 |
| 阶段3 | 20% 用户 | 3-5天 | 持续监控 | 稳定运行 |
| 阶段4 | 50% 用户 | 3-5天 | 全面观察 | 无异常 |
| 阶段5 | 100% 用户 | - | 持续监控 | - |

### 3.2 灰度配置

**远程配置**:
```kotlin
class FeatureFlags {
    private val remoteConfig = RemoteConfig.getInstance()
    
    suspend fun isNewFeatureEnabled(): Boolean {
        // 从远程配置获取
        return remoteConfig.getBoolean("new_feature_enabled")
    }
    
    suspend fun getGrayReleasePercent(): Int {
        // 获取灰度发布比例
        return remoteConfig.getInt("gray_release_percent")
    }
    
    fun isInGrayGroup(userId: String): Boolean {
        // 根据用户ID计算是否在灰度组
        val hash = userId.hashCode() and 0x7FFFFFFF
        val percent = getGrayReleasePercent()
        return (hash % 100) < percent
    }
}

// 使用
if (featureFlags.isNewFeatureEnabled() && 
    featureFlags.isInGrayGroup(currentUserId)) {
    // 使用新功能
    showNewFeature()
} else {
    // 使用旧功能
    showOldFeature()
}
```

### 3.3 监控指标

**核心指标**:
```kotlin
data class ReleaseMetrics(
    // 稳定性指标
    val crashRate: Double,        // 崩溃率
    val anrRate: Double,          // ANR 率
    val errorRate: Double,        // 错误率
    
    // 性能指标
    val startupTime: Long,        // 启动时间
    val memoryUsage: Long,        // 内存使用
    val cpuUsage: Double,         // CPU 使用率
    
    // 业务指标
    val activeUsers: Long,        // 活跃用户
    val retentionRate: Double,    // 留存率
    val featureUsageRate: Double  // 功能使用率
)

class ReleaseMonitor {
    fun collectMetrics(): ReleaseMetrics {
        return ReleaseMetrics(
            crashRate = getCrashRate(),
            anrRate = getAnrRate(),
            errorRate = getErrorRate(),
            startupTime = getAvgStartupTime(),
            memoryUsage = getAvgMemoryUsage(),
            cpuUsage = getAvgCpuUsage(),
            activeUsers = getActiveUserCount(),
            retentionRate = getRetentionRate(),
            featureUsageRate = getFeatureUsageRate()
        )
    }
    
    fun checkHealthy(metrics: ReleaseMetrics): Boolean {
        // 检查指标是否健康
        return metrics.crashRate < 0.001 &&
               metrics.anrRate < 0.0005 &&
               metrics.errorRate < 0.01 &&
               metrics.startupTime < 1000
    }
}
```

### 3.4 自动化决策

```kotlin
class GrayReleaseController {
    private val monitor = ReleaseMonitor()
    private val config = RemoteConfig.getInstance()
    
    suspend fun autoAdjustGrayPercent() {
        val metrics = monitor.collectMetrics()
        val currentPercent = config.getInt("gray_release_percent")
        
        when {
            // 指标异常，停止灰度
            !monitor.checkHealthy(metrics) -> {
                logger.error("Metrics unhealthy, stopping gray release")
                config.setInt("gray_release_percent", 0)
                sendAlert("灰度发布已暂停")
            }
            
            // 指标正常，扩大灰度
            currentPercent < 100 -> {
                val newPercent = minOf(currentPercent * 2, 100)
                logger.info("Expanding gray release to $newPercent%")
                config.setInt("gray_release_percent", newPercent)
            }
        }
    }
}
```

## 4. 回滚方案

### 4.1 回滚触发条件

**自动回滚**:
- 崩溃率 > 0.5%
- ANR 率 > 0.2%
- 核心功能错误率 > 1%
- 用户投诉激增

**手动回滚**:
- 发现严重 Bug
- 数据安全问题
- 业务逻辑错误
- 用户体验严重下降

### 4.2 回滚流程

```bash
# 1. 紧急会议，确认回滚决策

# 2. 停止灰度发布
# 将灰度比例设置为 0

# 3. 回退到上一个稳定版本
git checkout v2.0.0

# 4. 快速构建
./gradlew assembleRelease

# 5. 发布回滚版本

# 6. 监控回滚效果

# 7. 问题分析和修复
```

### 4.3 快速回滚能力

```kotlin
class VersionManager {
    // 保留多个稳定版本
    private val stableVersions = listOf(
        "2.1.0",
        "2.0.0",
        "1.9.0"
    )
    
    fun getCurrentVersion(): String {
        return BuildConfig.VERSION_NAME
    }
    
    fun rollbackToVersion(version: String) {
        // 1. 验证版本有效性
        if (version !in stableVersions) {
            throw IllegalArgumentException("Invalid version: $version")
        }
        
        // 2. 下载对应版本
        downloadVersion(version)
        
        // 3. 应用更新
        applyUpdate(version)
        
        // 4. 重启应用
        restartApp()
    }
}
```

## 5. 发布渠道

### 5.1 Android 渠道

**Google Play**:
```bash
# 使用 Google Play Console 上传
# 或使用 Gradle Play Publisher 插件

./gradlew publishReleaseBundle
```

**国内应用市场**:
- 华为应用市场
- 小米应用商店
- OPPO 软件商店
- vivo 应用商店
- 腾讯应用宝

**多渠道打包脚本**:
```bash
#!/bin/bash
# build_channels.sh

CHANNELS=("googleplay" "huawei" "xiaomi" "oppo" "vivo" "tencent")

for channel in "${CHANNELS[@]}"
do
    echo "Building for $channel..."
    ./gradlew assemble${channel^}Release
done

echo "All channels built successfully!"
```

### 5.2 iOS 渠道

**App Store**:
```bash
# 1. 在 Xcode 中 Archive

# 2. 上传到 App Store Connect
# Product -> Archive -> Distribute App -> App Store Connect

# 3. 在 App Store Connect 中配置版本信息

# 4. 提交审核
```

**TestFlight** (内测):
```bash
# 上传到 TestFlight
# 在 App Store Connect 中添加测试用户
```

### 5.3 鸿蒙渠道

**AppGallery**:
```
1. 登录华为开发者联盟
2. 上传 .hap 文件
3. 配置版本信息
4. 提交审核
```

## 6. 发布后处理

### 6.1 监控观察

**关键指标监控**:
```kotlin
class PostReleaseMonitor {
    private val alertThresholds = mapOf(
        "crash_rate" to 0.005,
        "anr_rate" to 0.002,
        "startup_time" to 2000L
    )
    
    suspend fun monitorRelease() {
        while (true) {
            val metrics = collectMetrics()
            
            // 检查各项指标
            checkCrashRate(metrics.crashRate)
            checkAnrRate(metrics.anrRate)
            checkPerformance(metrics)
            checkUserFeedback()
            
            delay(5.minutes)
        }
    }
    
    private fun checkCrashRate(rate: Double) {
        if (rate > alertThresholds["crash_rate"]!!) {
            sendAlert(
                level = AlertLevel.CRITICAL,
                message = "崩溃率异常: $rate"
            )
        }
    }
}
```

**用户反馈收集**:
```kotlin
class FeedbackCollector {
    fun collectUserFeedback(): List<Feedback> {
        // 从多个渠道收集反馈
        val storeFeedback = getStoreComments()
        val inAppFeedback = getInAppFeedback()
        val socialMediaFeedback = getSocialMediaFeedback()
        
        return storeFeedback + inAppFeedback + socialMediaFeedback
    }
    
    fun analyzeFeedback(feedbacks: List<Feedback>): FeedbackAnalysis {
        return FeedbackAnalysis(
            totalCount = feedbacks.size,
            positiveRate = feedbacks.count { it.sentiment == Sentiment.POSITIVE } / feedbacks.size.toDouble(),
            negativeRate = feedbacks.count { it.sentiment == Sentiment.NEGATIVE } / feedbacks.size.toDouble(),
            commonIssues = extractCommonIssues(feedbacks)
        )
    }
}
```

### 6.2 问题处理

**问题分类**:
```kotlin
enum class IssueSeverity {
    CRITICAL,   // P0: 严重问题，立即处理
    HIGH,       // P1: 高优先级，24小时内处理
    MEDIUM,     // P2: 中等优先级，本周处理
    LOW         // P3: 低优先级，后续处理
}

data class ReleaseIssue(
    val id: String,
    val title: String,
    val severity: IssueSeverity,
    val affectedUsers: Int,
    val description: String,
    val reproduceSteps: String,
    val status: IssueStatus
)

class IssueTracker {
    fun trackIssue(issue: ReleaseIssue) {
        // 记录问题
        database.insertIssue(issue)
        
        // 根据严重程度采取行动
        when (issue.severity) {
            IssueSeverity.CRITICAL -> {
                // 立即通知相关人员
                notifyTeam(issue)
                // 考虑回滚
                considerRollback(issue)
            }
            IssueSeverity.HIGH -> {
                // 优先处理
                assignToEngineer(issue)
                createHotfix(issue)
            }
            else -> {
                // 正常流程处理
                addToBacklog(issue)
            }
        }
    }
}
```

### 6.3 热修复

**Android 热修复**:
```kotlin
// 使用腾讯 Tinker 或类似方案
class HotfixManager {
    fun checkAndApplyHotfix() {
        // 检查是否有热修复补丁
        val patch = checkForPatch()
        
        if (patch != null) {
            // 下载补丁
            downloadPatch(patch)
            
            // 应用补丁
            applyPatch(patch)
            
            // 重启生效
            requestRestart()
        }
    }
}
```

### 6.4 发布总结

**发布报告模板**:
```markdown
# Kuikly v2.1.0 发布报告

## 1. 基本信息
- 版本号: 2.1.0
- 发布日期: 2025-09-30
- 负责人: XXX
- 发布渠道: Android、iOS、鸿蒙

## 2. 发布过程
### 2.1 时间线
- 2025-09-28: 开始灰度发布（1%）
- 2025-09-29: 扩大到 20%
- 2025-09-30: 全量发布

### 2.2 遇到的问题
- 问题1: [描述] - 已解决
- 问题2: [描述] - 热修复

## 3. 数据表现
### 3.1 稳定性
- 崩溃率: 0.08% (目标 < 0.1%)
- ANR率: 0.03% (目标 < 0.05%)
- 成功率: 99.95%

### 3.2 性能
- 启动时间: 850ms (目标 < 1000ms)
- 内存占用: 280KB (目标 < 300KB)
- 包体积: 295KB

### 3.3 业务指标
- 新功能使用率: 35%
- 用户满意度: 4.5/5.0
- 正面评价率: 85%

## 4. 用户反馈
- 正面反馈: 滚动更流畅、界面更美观
- 负面反馈: 部分设备有卡顿

## 5. 经验教训
### 5.1 做得好的地方
- 灰度发布策略有效
- 监控及时发现问题

### 5.2 需要改进的地方
- 兼容性测试需要加强
- 监控指标需要更细化

## 6. 后续计划
- 继续监控线上表现
- 优化已知问题
- 规划 2.2.0 版本
```

## 7. 发布检查清单

### 7.1 发布前检查

- [ ] 代码已合并到发布分支
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 所有测试通过
- [ ] 代码评审完成
- [ ] 文档已更新
- [ ] 发布说明已准备
- [ ] 签名配置正确
- [ ] 混淆配置正确
- [ ] 第三方SDK已更新
- [ ] 隐私政策已更新
- [ ] 回滚方案已准备

### 7.2 发布中检查

- [ ] 构建产物已生成
- [ ] 产物已测试验证
- [ ] 灰度配置已设置
- [ ] 监控已启动
- [ ] 告警已配置
- [ ] 相关人员已通知

### 7.3 发布后检查

- [ ] 监控指标正常
- [ ] 用户反馈正常
- [ ] 无严重问题
- [ ] 发布报告已完成
- [ ] 经验已总结

## 8. 应急预案

### 8.1 应急联系人

| 角色 | 姓名 | 电话 | 备注 |
|------|------|------|------|
| 技术负责人 | XXX | XXX | 24小时待命 |
| 运维负责人 | XXX | XXX | 监控告警 |
| 产品负责人 | XXX | XXX | 业务决策 |
| 测试负责人 | XXX | XXX | 问题验证 |

### 8.2 应急流程

```
问题发现 → 问题确认 → 影响评估 → 决策处理
    ↓          ↓          ↓          ↓
监控告警    复现验证    严重程度    回滚/热修复
    ↓          ↓          ↓          ↓
人工发现    日志分析    影响范围    问题修复
```

### 8.3 应急演练

定期进行应急演练：
- 模拟发布问题
- 演练回滚流程
- 测试监控告警
- 验证应急响应

---

**文档维护者**: Kuikly 团队  
**最后更新**: 2025-09-30
