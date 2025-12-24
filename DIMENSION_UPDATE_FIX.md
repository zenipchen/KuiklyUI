# 预览尺寸更新问题排查和修复

## 🔍 问题描述

修改预览的 dimension（width/height）没有生效。

## 🐛 发现的问题

### 1. JSON 解析问题
**问题**：`PreviewConfigModel` 的 `init(from json:)` 方法只支持 `NSNumber` 类型解析 width 和 height，但 Kotlin 的 Gson 可能将 Int 序列化为其他类型。

**位置**：`PreviewHttpServer.swift:46-47`

**修复**：
- 增强 JSON 解析，支持多种数字类型（Int, NSNumber, Double）
- 添加类型检查和转换逻辑

### 2. SwiftUI 更新问题 ⚠️ **主要问题**
**问题**：SwiftUI 的 `@Published` 属性包装器不会检测字典内部值的变化。当直接修改 `renderRequests[instanceId]` 时，SwiftUI 不会触发视图更新。

**位置**：`PreviewRenderCoreManager.swift:376`

**原因**：
```swift
// ❌ 错误：直接修改字典内部值，SwiftUI 不会检测到变化
PreviewHttpServer.shared.renderRequests[instanceId] = updatedRequest
```

**修复**：
```swift
// ✅ 正确：创建新的字典实例，替换整个字典
var updatedRequests = PreviewHttpServer.shared.renderRequests
updatedRequests[instanceId] = updatedRequest
PreviewHttpServer.shared.renderRequests = updatedRequests
```

### 3. 缺少调试日志
**问题**：缺少足够的调试日志，难以定位问题。

**修复**：
- 添加 JSON 解析前后的日志输出
- 添加尺寸更新成功/失败的日志
- 添加 SwiftUI 视图更新的日志

## ✅ 修复内容

### 1. 增强 JSON 解析 (`PreviewHttpServer.swift`)

```swift
// 支持多种数字类型解析（Int, NSNumber, Double）
if let widthValue = json["width"] {
    if let widthInt = widthValue as? Int {
        self.width = widthInt
    } else if let widthNumber = widthValue as? NSNumber {
        self.width = widthNumber.intValue
    } else if let widthDouble = widthValue as? Double {
        self.width = Int(widthDouble)
    } else {
        self.width = nil
    }
} else {
    self.width = nil
}
```

### 2. 修复 SwiftUI 更新 (`PreviewRenderCoreManager.swift`)

```swift
// 创建新的字典实例以触发 SwiftUI 更新
var updatedRequests = PreviewHttpServer.shared.renderRequests
updatedRequests[instanceId] = updatedRequest
PreviewHttpServer.shared.renderRequests = updatedRequests
```

### 3. 添加调试日志

- `PreviewHttpServer.swift`: 输出请求 JSON 和解析结果
- `PreviewRenderCoreManager.swift`: 输出尺寸更新日志和警告

## 🧪 测试步骤

1. **重新编译 PreviewMacApp**
   ```bash
   cd PreviewMacApp
   # 在 Xcode 中重新编译运行
   ```

2. **运行测试**
   ```bash
   ./gradlew :desktopAppWithMacRender:testPreviewConfig
   ```

3. **测试尺寸更新**
   - 在配置编辑器中修改 width 和 height
   - 点击"应用配置"按钮
   - 观察 PreviewMacApp 中的预览视图是否更新

4. **查看控制台日志**
   应该看到类似以下日志：
   ```
   [PreviewHttpServer] 📋 收到更新预览配置请求: instanceId=xxx
   [PreviewHttpServer] 📋 请求 JSON: {...}
   [PreviewHttpServer] 📋 解析后的配置: width=500, height=1000
   [RenderCoreManager] 📐 更新视图尺寸: 500x1000
   [PreviewRenderVC] 📐 更新预览大小: 500x1000
   [RenderCoreManager] ✅ 已更新 renderRequests 中的配置: instanceId=xxx, size=500x1000
   ```

## 📋 验证点

- ✅ JSON 解析正确（width 和 height 不为 nil）
- ✅ `updateSize` 方法被调用
- ✅ `renderRequests` 字典被替换（触发 SwiftUI 更新）
- ✅ SwiftUI 视图重新布局（`updateNSViewController` 被调用）
- ✅ 预览视图大小实际更新

## 🔗 相关文件

- `PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift`
- `PreviewMacApp/PreviewMacApp/Server/PreviewRenderCoreManager.swift`
- `PreviewMacApp/PreviewMacApp/PreviewRenderViewPage.swift`
- `PreviewMacApp/PreviewMacApp/KuiklyRenderAddons/Controllers/PreviewRenderViewController.m`

## 💡 注意事项

1. **SwiftUI @Published 字典的限制**
   - `@Published` 不会检测字典内部值的变化
   - 需要替换整个字典才能触发视图更新
   - 这是 SwiftUI 的已知限制

2. **JSON 类型转换**
   - Kotlin 的 Int 可能被序列化为不同的 JSON 数字类型
   - 需要支持多种数字类型的解析

3. **主线程更新**
   - UI 更新必须在主线程执行
   - 使用 `DispatchQueue.main.async` 确保线程安全

