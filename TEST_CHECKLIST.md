# 预览配置编辑器测试检查清单

## ✅ 基本功能检查

### 1. 界面显示
- [ ] 预览窗口正常打开
- [ ] 窗口左侧显示预览渲染区域
- [ ] 窗口右侧显示配置编辑面板
- [ ] 配置面板可以滚动查看所有参数

### 2. 配置编辑面板结构
- [ ] **Preview Configuration** 部分显示：
  - [ ] name 输入框
  - [ ] group 下拉框（可编辑）
- [ ] **Hardware** 部分显示：
  - [ ] Device 下拉框
  - [ ] Dimensions (width x height) 输入框和单位选择
  - [ ] Density 下拉框
  - [ ] Orientation 下拉框
  - [ ] IsRound 复选框
  - [ ] ChinSize 输入框
  - [ ] Cutout 下拉框
  - [ ] Navigation 下拉框
- [ ] **Display** 部分显示：
  - [ ] apiLevel 下拉框
  - [ ] locale 下拉框
  - [ ] fontScale 输入框
  - [ ] showSystemUi 复选框
  - [ ] showBackground 复选框
  - [ ] backgroundColor 输入框
  - [ ] uiMode 下拉框
  - [ ] wallpaper 下拉框
- [ ] 底部有"应用配置"按钮

## ✅ 功能测试

### 测试 1: 修改尺寸
1. [ ] 在 Dimensions 中修改 width 为 `500`
2. [ ] 修改 height 为 `1000`
3. [ ] 点击"应用配置"按钮
4. [ ] **验证**：
   - [ ] PreviewMacApp 中的预览视图大小变为 500x1000
   - [ ] 预览窗口标题更新为 `Kuikly Preview - HelloWorldPage (500x1000)`
   - [ ] 状态栏显示"✅ 配置已应用"
   - [ ] 视图没有消失

### 测试 2: 修改密度
1. [ ] 在 Density 下拉框中选择 `440dpi (2.75)`
2. [ ] 点击"应用配置"按钮
3. [ ] **验证**：
   - [ ] PreviewMacApp 控制台输出配置更新日志
   - [ ] 状态栏显示成功消息

### 测试 3: 修改方向
1. [ ] 在 Orientation 下拉框中选择 `landscape`
2. [ ] 点击"应用配置"按钮
3. [ ] **验证**：
   - [ ] 配置成功应用
   - [ ] PreviewMacApp 控制台有相关日志

### 测试 4: 修改多个参数
1. [ ] 同时修改以下参数：
   - [ ] width: `600`
   - [ ] height: `1200`
   - [ ] density: `320dpi (2.0)`
   - [ ] orientation: `portrait`
   - [ ] locale: `zh-CN`
   - [ ] fontScale: `1.2`
2. [ ] 点击"应用配置"按钮
3. [ ] **验证**：
   - [ ] 所有参数都成功应用
   - [ ] 预览视图大小更新为 600x1200
   - [ ] 其他配置参数也正确应用

### 测试 5: 快速尺寸调整（兼容性）
1. [ ] 在底部控制栏的 width 输入框中输入 `800`
2. [ ] 在 height 输入框中输入 `1600`
3. [ ] 点击"应用"按钮（不是"应用配置"）
4. [ ] **验证**：
   - [ ] 尺寸成功更新
   - [ ] 配置编辑器中的尺寸值同步更新

### 测试 6: 多次更新
1. [ ] 连续修改尺寸 3-5 次
2. [ ] **验证**：
   - [ ] 每次更新都成功
   - [ ] 视图不会消失
   - [ ] 没有内存泄漏或错误

## ✅ 控制台日志检查

检查 PreviewMacApp 的控制台输出，应该看到：

```
[PreviewHttpServer] 📋 收到更新预览配置请求: instanceId=xxx
[RenderCoreManager] 📋 更新预览配置: instanceId=xxx, config=...
[PreviewRenderVC] 📐 更新预览大小: ...
[PreviewRenderVC] 📋 应用预览配置: ...
[PreviewHttpServer] ✅ 预览配置更新成功: instanceId=xxx
```

## ✅ 错误检查

- [ ] 没有编译错误
- [ ] 没有运行时错误
- [ ] 没有视图消失的问题
- [ ] 没有内存泄漏警告

## 📝 测试结果记录

测试时间：___________

测试人员：___________

### 测试结果
- [ ] 所有测试通过
- [ ] 部分测试通过（请注明哪些失败）
- [ ] 测试失败（请描述问题）

### 发现的问题
1. 
2. 
3. 

### 备注
_________________________________________________

