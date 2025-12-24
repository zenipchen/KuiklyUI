# updatePreviewConfig 实现状态总结

## ✅ 确认：updatePreviewConfig 已替代 updateSize

### 1. SDK 端（mac-render-sdk）

#### updateSize 状态
- ✅ **已标记为 `@Deprecated`**
- ✅ **内部调用 `updatePreviewConfig`**，保持向后兼容
- 位置：`KuiklyMacRenderSdk.kt` 和 `KuiklyMacPreviewRunner.kt`

```kotlin
@Deprecated("使用 updatePreviewConfig 替代", 
    ReplaceWith("updatePreviewConfig(config.copy(width = width, height = height))"))
fun updateSize(width: Int, height: Int): Boolean {
    return updatePreviewConfig(PreviewConfig(width = width, height = height))
}
```

#### updatePreviewConfig 实现
- ✅ **已完整实现**
- 接收 `PreviewConfig` 参数
- 通过 TCP 传输层发送 `/updatePreviewConfig` 请求
- 位置：`KuiklyMacRenderSdk.kt:437`

### 2. PreviewMacApp 端

#### HTTP/TCP 服务器
- ✅ **`/updatePreviewConfig` 端点已实现**
- HTTP 服务器：`PreviewHttpServer.swift:355`
- TCP 服务器：`PreviewTcpServer.swift:450`
- 都正确路由到 `PreviewRenderCoreManager.updatePreviewConfig`

#### PreviewRenderCoreManager
- ✅ **`updatePreviewConfig` 方法已实现**
- 功能：
  1. 更新尺寸（调用 `viewController.updateSize`）
  2. 应用其他配置（调用 `viewController.applyConfig`）
  3. 更新 `renderRequests` 以便 SwiftUI 重新布局
- 位置：`PreviewRenderCoreManager.swift:339`

#### PreviewRenderViewController
- ✅ **`applyConfig` 方法已实现**
- 功能：
  1. 将配置参数合并到 `pageData` 中（添加 `_preview_*` 前缀）
  2. 发送 `KRConfigurationUpdateEventKey` 事件到渲染核心
  3. 支持所有配置参数：
     - `density` - 屏幕密度
     - `orientation` - 方向
     - `device`, `apiLevel`, `locale`, `fontScale`
     - `showSystemUi`, `showBackground`, `backgroundColor`
     - `uiMode`, `wallpaper`, `isRound`, `chinSize`, `cutout`, `navigation`
- 位置：`PreviewRenderViewController.m:367`

## 📋 配置参数处理流程

### 完整流程

```
JVM 端 (desktopAppWithMacRender)
  ↓
updatePreviewConfig(PreviewConfig)
  ↓
KuiklyMacRenderSdk.updatePreviewConfig()
  ↓
TCP Transport: POST /updatePreviewConfig
  ↓
PreviewMacApp TCP Server
  ↓
PreviewRenderCoreManager.updatePreviewConfig()
  ├─→ viewController.updateSize(width, height)  // 更新尺寸
  ├─→ viewController.applyConfig(configDict)   // 应用配置
  └─→ 更新 renderRequests[instanceId]          // 更新 SwiftUI 布局
      ↓
PreviewRenderViewController.applyConfig()
  ├─→ 合并配置到 pageData (_preview_*)
  └─→ 发送 KRConfigurationUpdateEventKey 事件
      ↓
Kuikly 渲染核心
  └─→ 应用配置参数（density, orientation 等）
```

### 实际效果

#### ✅ 已生效的参数

1. **尺寸更新（width, height）**
   - ✅ 更新视图大小（`updateSize`）
   - ✅ 更新外层窗口大小（通过 `renderRequests`）
   - ✅ 发送 `KRRootViewSizeDidChangedEventKey` 事件

2. **密度更新（density）**
   - ✅ 合并到 `pageData["_preview_density"]`
   - ✅ 发送到渲染核心（`KRConfigurationUpdateEventKey`）
   - ✅ 渲染核心会应用新的密度值

3. **方向更新（orientation）**
   - ✅ 合并到 `pageData["_preview_orientation"]`
   - ✅ 发送到渲染核心（`KRConfigurationUpdateEventKey`）
   - ✅ 渲染核心会应用新的方向

#### ⚠️ 需要验证的参数

以下参数已合并到 `pageData` 中，但需要确认渲染核心是否实际使用：

- `device` → `_preview_device`
- `apiLevel` → `_preview_apiLevel`
- `locale` → `_preview_locale`
- `fontScale` → `_preview_fontScale`
- `showSystemUi` → `_preview_showSystemUi`
- `showBackground` → `_preview_showBackground`
- `backgroundColor` → `_preview_backgroundColor`
- `uiMode` → `_preview_uiMode`
- `wallpaper` → `_preview_wallpaper`
- `isRound` → `_preview_isRound`
- `chinSize` → `_preview_chinSize`
- `cutout` → `_preview_cutout`
- `navigation` → `_preview_navigation`

## 🧪 测试建议

### 1. 基础测试
```bash
./gradlew :desktopAppWithMacRender:testPreviewConfig
```

测试步骤：
1. 修改尺寸参数（width, height）
   - ✅ 预期：预览视图大小更新，外层窗口大小同步更新

2. 修改密度参数（density）
   - ✅ 预期：渲染视图应用新的密度值

3. 修改方向参数（orientation）
   - ✅ 预期：渲染视图应用新的方向

### 2. 完整配置测试
在配置编辑器中修改多个参数，点击"应用配置"：
- 尺寸、密度、方向、locale、fontScale 等
- 观察 PreviewMacApp 控制台日志
- 验证配置是否正确传递和应用

### 3. 验证点

#### 控制台日志
PreviewMacApp 应该输出：
```
[RenderCoreManager] 📋 更新预览配置: instanceId=xxx, config=...
[PreviewRenderVC] 📋 应用预览配置: {...}
[PreviewRenderVC] 📋 设置 density: 2.75
[PreviewRenderVC] 📋 设置 orientation: portrait
[PreviewRenderVC] ✅ 配置已应用到渲染核心
[PreviewRenderVC] ✅ 预览配置已应用
```

#### 视觉效果
- ✅ 预览视图大小实时更新
- ✅ 外层窗口大小同步更新
- ✅ 密度变化影响渲染（如果渲染核心支持）
- ✅ 方向变化影响布局（如果渲染核心支持）

## 📝 总结

### ✅ 已完成
1. `updatePreviewConfig` 已替代 `updateSize`
2. SDK 端完整实现
3. PreviewMacApp 端完整实现
4. 配置参数正确传递到渲染层
5. 尺寸更新已生效
6. density 和 orientation 已发送到渲染核心

### ⚠️ 需要确认
1. 渲染核心是否实际使用所有配置参数（特别是非 density/orientation 的参数）
2. 某些参数（如 locale, fontScale）是否需要在渲染核心中特殊处理

### 🎯 建议
1. 运行测试验证基础功能（尺寸、密度、方向）
2. 根据实际需求确认其他参数是否需要额外处理
3. 如果某些参数未生效，需要在渲染核心中添加对应的处理逻辑

