# updatePreviewConfig 中 density 丢失问题修复

## 📋 问题描述

**症状**：
- 第一次 `updatePreviewConfig` 时，`density` 正常
- render 后，再次 `updatePreviewConfig` 时，`density` 丢失

**影响**：
- 导致预览尺寸计算错误（像素值和点值混淆）
- 窗口大小显示异常
- 布局错乱

## 🔍 根本原因

在 `PreviewRenderCoreManager.updatePreviewConfig()` 方法中（第413-419行），创建 `updatedRequest` 时存在两个问题：

### 问题 1：像素值和点值混淆

```swift
❌ 错误代码（第416-417行）：
let updatedRequest = RenderRequest(
    pageName: request.pageName,
    pageData: request.pageData,
    width: CGFloat(config.width ?? Int(request.width)),    // ❌ 像素值！
    height: CGFloat(config.height ?? Int(request.height)), // ❌ 像素值！
    config: mergedConfig
)
```

**问题分析**：
- `config.width` 和 `config.height` 是**像素值**（来自 SDK 的配置）
- `RenderRequest.width` 和 `RenderRequest.height` 应该是**点值**（用于 SwiftUI 布局）
- 直接赋值导致单位混淆

### 问题 2：后续 render 时 density 丢失

**流程**：
1. **第一次 updatePreviewConfig**：
   - `mergedConfig` 包含正确的 `density`（从 pageData 或 config 中）
   - `updatedRequest.width` = 像素值（❌ 错误）
   - `updatedRequest.config.density` = 正确值

2. **render 请求到达**：
   - 检测到 `existingRequest`（即 updatedRequest）
   - 保留 `existingRequest.width/height`（像素值，❌ 错误）
   - 合并配置，但尺寸已经错误

3. **第二次 updatePreviewConfig**：
   - 读取 `request.width`（已经是像素值，且可能没有 density 信息）
   - 再次创建 `updatedRequest` 时，使用错误的像素值
   - **density 信息逐渐丢失**

## ✅ 修复方案

### 核心改动

在创建 `updatedRequest` 时，**将像素值转换为点值**：

```swift
✅ 修复后代码：
// 合并配置
let mergedConfig = self.mergeConfig(request.config, with: finalConfig)

// 🎯 计算最终的宽高（点值）
// 注意：config.width 和 config.height 是像素值，需要转换为点值
let finalWidth: CGFloat
let finalHeight: CGFloat

if let width = config.width, let height = config.height {
    // 从合并后的 config 中获取 density
    let density = CGFloat(mergedConfig.density ?? 1.0)
    finalWidth = CGFloat(width) / density
    finalHeight = CGFloat(height) / density
    print("[RenderCoreManager] 📐 转换尺寸: 像素 \(width)x\(height) / density \(density) = 点值 \(Int(finalWidth))x\(Int(finalHeight))")
} else {
    // 保持原有尺寸（已经是点值）
    finalWidth = request.width
    finalHeight = request.height
    print("[RenderCoreManager] ⚠️ 配置中没有尺寸，保持原有尺寸: \(Int(finalWidth))x\(Int(finalHeight))")
}

// 创建新的 RenderRequest（使用点值）
let updatedRequest = RenderRequest(
    pageName: request.pageName,
    pageData: request.pageData,
    width: finalWidth,
    height: finalHeight,
    config: mergedConfig
)
```

### 关键改进

1. **显式转换**：`像素值 / density = 点值`
2. **使用合并后的 density**：确保 `mergedConfig.density` 正确
3. **保持单位一致**：`RenderRequest` 始终使用点值
4. **添加日志**：便于调试和验证

## 📊 修复效果

### 修复前（❌）

```
第一次 updatePreviewConfig:
  config: width=1080px, height=1920px, density=3.0
  updatedRequest: width=1080, height=1920 (❌ 像素值！)
  mergedConfig.density=3.0 ✓

render 后:
  existingRequest.width=1080 (❌ 已经是像素值)
  
第二次 updatePreviewConfig:
  request.width=1080 (❌ 单位已混淆)
  config.width=1080px, density 可能丢失
  updatedRequest: width=1080 (❌ 继续错误)
```

### 修复后（✅）

```
第一次 updatePreviewConfig:
  config: width=1080px, height=1920px, density=3.0
  计算: 1080 / 3.0 = 360 点
  updatedRequest: width=360, height=640 (✅ 点值！)
  mergedConfig.density=3.0 ✓

render 后:
  existingRequest.width=360 (✅ 点值，正确)
  mergedConfig.density=3.0 (✅ 保留)
  
第二次 updatePreviewConfig:
  request.width=360 (✅ 点值)
  config.width=1080px, density=3.0
  计算: 1080 / 3.0 = 360 点
  updatedRequest: width=360, height=640 (✅ 点值！)
  mergedConfig.density=3.0 ✓
```

## 🔧 相关代码路径

### 涉及文件
- `PreviewMacApp/PreviewMacApp/Server/PreviewRenderCoreManager.swift`
  - 第 339-435 行：`updatePreviewConfig()` 方法
  - 第 410-430 行：修复位置

### 调用链路

```
SDK updatePreviewConfig
  ↓
PreviewHttpServer.handleUpdatePreviewConfigRequest (HTTP)
  ↓
PreviewRenderCoreManager.updatePreviewConfig
  ↓
1. 更新 ViewController 尺寸 (像素值 → 点值转换)
2. 应用配置到 ViewController
3. 🎯 更新 renderRequests（修复点：像素值 → 点值）
```

## 🧪 测试验证

### 测试场景

```kotlin
// 第一次 updatePreviewConfig
@Preview(width = 1080, height = 1920, density = 3.0f)
fun MyPage() { ... }

// render 后...

// 第二次 updatePreviewConfig（修改尺寸）
@Preview(width = 1440, height = 2560, density = 3.0f)
fun MyPage() { ... }
```

### 预期日志

```
[RenderCoreManager] 📋 更新预览配置: instanceId=xxx, config=PreviewConfigModel(width=1080, height=1920, density=3.0)
[RenderCoreManager] 📐 转换尺寸: 像素 1080x1920 / density 3.0 = 点值 360x640
[RenderCoreManager] ✅ 已更新 renderRequests 中的配置: instanceId=xxx, size=360.0x640.0

... render ...

[RenderCoreManager] 📋 更新预览配置: instanceId=xxx, config=PreviewConfigModel(width=1440, height=2560, density=3.0)
[RenderCoreManager] 📐 转换尺寸: 像素 1440x2560 / density 3.0 = 点值 480x853
[RenderCoreManager] ✅ 已更新 renderRequests 中的配置: instanceId=xxx, size=480.0x853.0
```

### 验证要点

1. ✅ 第一次和第二次 `updatePreviewConfig` 都正确处理 density
2. ✅ `updatedRequest.width/height` 是点值（width / density）
3. ✅ `mergedConfig.density` 始终存在且正确
4. ✅ render 后不会丢失 density
5. ✅ SwiftUI 视图显示正确尺寸

## 📝 核心要点

### 单位约定

| 位置 | 单位 | 说明 |
|------|------|------|
| **SDK 配置**（`config.width/height`） | 像素值 | 来自 Kotlin 的 `@Preview` 注解 |
| **RenderRequest**（`width/height`） | 点值 | SwiftUI 布局使用 |
| **ViewController**（`updateSize`） | 点值 | NSView 尺寸 |
| **PreviewConfigModel**（`density`） | 比例 | 像素值 ÷ density = 点值 |

### 转换公式

```
点值 = 像素值 / density

例如：
  像素值: 1080 × 1920
  density: 3.0
  点值: 360 × 640
```

### 关键原则

1. **存储统一**：`RenderRequest` 始终存储点值
2. **转换明确**：每次从配置读取时显式转换
3. **保留 density**：`mergedConfig` 必须包含 density
4. **日志完善**：记录转换过程便于调试

---

## 🎯 总结

这个修复确保了：
1. ✅ `updatePreviewConfig` 每次都正确处理 density
2. ✅ `RenderRequest` 始终存储点值（单位一致）
3. ✅ render 后不会丢失 density 信息
4. ✅ 多次 `updatePreviewConfig` 都能正确工作

**关键改进**：从隐式混用像素值/点值，改为**显式转换并保持单位一致**！
