# 预览配置编辑器测试指南

## 功能概述

本次更新实现了完整的预览配置编辑功能：

1. ✅ 将宽高纳入预览参数配置
2. ✅ 将 `updateSize` 改造成 `updatePreviewConfig`
3. ✅ 在预览窗口右侧添加了完整的配置编辑面板
4. ✅ 支持所有 PreviewConfig 参数的编辑

## 测试步骤

### 1. 启动 PreviewMacApp

```bash
cd PreviewMacApp
open PreviewMacApp.xcworkspace
# 在 Xcode 中运行 PreviewMacApp
```

或者使用脚本：

```bash
./run_preview_mac.sh
```

### 2. 运行测试

```bash
./test_preview_config_editor.sh
```

或者直接使用 Gradle：

```bash
./gradlew :desktopAppWithMacRender:testPreviewConfig
```

### 3. 测试配置编辑功能

测试窗口打开后，你应该看到：

- **左侧**：预览渲染区域
- **右侧**：配置编辑面板，包含三个部分：
  - **Preview Configuration**: name, group
  - **Hardware**: device, dimensions (width x height), density, orientation, isRound, chinSize, cutout, navigation
  - **Display**: apiLevel, locale, fontScale, showSystemUi, showBackground, backgroundColor, uiMode, wallpaper

### 4. 测试场景

#### 场景 1: 修改尺寸
1. 在 Hardware 部分的 Dimensions 中修改 width 和 height
2. 点击"应用配置"按钮
3. **预期结果**：
   - PreviewMacApp 中的预览视图大小会更新
   - 窗口标题会更新显示新尺寸
   - 状态栏显示"✅ 配置已应用"

#### 场景 2: 修改密度
1. 在 Hardware 部分的 Density 下拉框中选择不同的密度（如 440dpi (2.75)）
2. 点击"应用配置"按钮
3. **预期结果**：
   - PreviewMacApp 控制台会输出配置更新日志
   - 渲染视图会应用新的密度设置

#### 场景 3: 修改方向
1. 在 Hardware 部分的 Orientation 下拉框中选择 "landscape"
2. 点击"应用配置"按钮
3. **预期结果**：
   - 配置会更新，渲染视图可能会重新布局

#### 场景 4: 修改多个参数
1. 同时修改多个参数（如尺寸、密度、方向、locale 等）
2. 点击"应用配置"按钮
3. **预期结果**：
   - 所有配置参数都会一次性应用
   - PreviewMacApp 控制台会显示所有更新的参数

#### 场景 5: 使用快速尺寸调整
1. 在底部控制栏的尺寸输入框中输入新的宽高
2. 点击"应用"按钮
3. **预期结果**：
   - 尺寸会更新（兼容旧的 updateSize 方式）
   - 配置编辑器中的尺寸值也会同步更新

## 验证点

### 1. 控制台日志

检查 PreviewMacApp 的控制台，应该看到：

```
[PreviewHttpServer] 📋 收到更新预览配置请求: instanceId=xxx
[RenderCoreManager] 📋 更新预览配置: instanceId=xxx, config=...
[PreviewRenderVC] 📐 更新预览大小: ...
[PreviewRenderVC] 📋 应用预览配置: ...
[PreviewHttpServer] ✅ 预览配置更新成功: instanceId=xxx
```

### 2. UI 验证

- ✅ 预览窗口右侧显示配置编辑面板
- ✅ 配置面板可以滚动查看所有参数
- ✅ 所有输入框和下拉框都可以正常编辑
- ✅ "应用配置"按钮可以正常点击
- ✅ 配置应用后状态栏显示成功消息

### 3. 功能验证

- ✅ 尺寸更新后，PreviewMacApp 中的预览视图大小会改变
- ✅ 外层窗口大小会同步更新
- ✅ 配置参数会正确传递到渲染核心
- ✅ 多次更新配置不会导致视图消失

## 已知问题

无

## 测试结果

请在测试后填写：

- [ ] 配置编辑界面正常显示
- [ ] 尺寸修改功能正常
- [ ] 密度修改功能正常
- [ ] 方向修改功能正常
- [ ] 其他配置参数修改正常
- [ ] 多次更新不会导致视图消失
- [ ] PreviewMacApp 控制台日志正常

## 故障排查

如果遇到问题：

1. **配置编辑面板不显示**
   - 检查窗口大小是否足够
   - 检查 JSplitPane 的分割位置

2. **配置应用失败**
   - 检查 PreviewMacApp 是否正在运行
   - 检查网络连接（端口 9527/9528）
   - 查看控制台错误日志

3. **视图消失**
   - 检查 PreviewMacApp 控制台是否有错误
   - 确认 updatePreviewConfig 在主线程执行
   - 检查视图的 hidden 属性

