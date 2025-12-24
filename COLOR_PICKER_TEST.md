# 颜色选择器和 showBackground 标志测试指南

## 🎨 测试功能

### 1. 颜色选择器功能
- ✅ 使用 JColorChooser 替代文本输入框
- ✅ 按钮显示当前选择的颜色（背景色）
- ✅ 按钮文字显示十六进制值（如 #FFFFFF）
- ✅ 文字颜色自动调整（深色背景用白色，浅色背景用黑色）

### 2. showBackground 标志控制
- ✅ 只有当 `showBackground = true` 时，`backgroundColor` 才会被传递
- ✅ `showBackground = false` 时，`backgroundColor = null`

## 🧪 测试步骤

### 步骤 1: 启动测试

```bash
./gradlew :desktopAppWithMacRender:testPreviewConfig
```

### 步骤 2: 测试颜色选择器

1. **打开颜色选择器**
   - 在配置编辑器的 Display 部分
   - 找到 `backgroundColor:` 标签
   - 点击右侧的按钮（初始显示"选择颜色"）

2. **选择颜色**
   - 在系统颜色选择器中选择一个颜色（如红色 #FF0000）
   - 点击"确定"

3. **验证按钮更新**
   - ✅ 按钮背景应该变成选择的颜色
   - ✅ 按钮文字应该显示十六进制值（如 `#FF0000`）
   - ✅ 文字颜色应该自动调整（红色背景用白色文字）

### 步骤 3: 测试 showBackground 标志

#### 测试 3.1: showBackground = false

1. **取消勾选 showBackground**
   - 取消勾选 `showBackground:` 复选框

2. **应用配置**
   - 点击"应用配置"按钮

3. **验证日志**
   - 查看控制台日志，应该看到：
     ```
     [PreviewConfigEditor] 📋 构建的配置: ... backgroundColor=null
     [Mac SDK] 📋 更新预览配置: ... backgroundColor=null
     ```

#### 测试 3.2: showBackground = true

1. **勾选 showBackground**
   - 勾选 `showBackground:` 复选框

2. **应用配置**
   - 点击"应用配置"按钮

3. **验证日志**
   - 查看控制台日志，应该看到：
     ```
     [PreviewConfigEditor] 📋 构建的配置: ... backgroundColor=#FF0000
     [Mac SDK] 📋 更新预览配置: ... backgroundColor=#FF0000
     [PreviewHttpServer] 📋 收到更新预览配置请求: ...
     [RenderCoreManager] 📋 更新预览配置: ...
     ```

### 步骤 4: 验证 PreviewMacApp 端

1. **查看 PreviewMacApp 控制台**
   - 应该看到配置更新日志
   - 当 `showBackground=false` 时，`backgroundColor` 不应该出现在配置中
   - 当 `showBackground=true` 时，`backgroundColor` 应该被传递

## 📋 预期结果

### ✅ 颜色选择器
- 按钮可以正常打开颜色选择器
- 选择颜色后，按钮背景和文字正确更新
- 文字颜色自动调整，确保可读性

### ✅ showBackground 标志
- `showBackground=false` 时，`backgroundColor` 为 `null`
- `showBackground=true` 时，`backgroundColor` 被正确传递
- PreviewMacApp 端正确接收和处理配置

## 🐛 故障排查

### 问题 1: 颜色选择器不打开
- **检查**: 按钮是否正确初始化
- **解决**: 查看控制台是否有错误日志

### 问题 2: 按钮不更新
- **检查**: `updateBackgroundColorButton()` 是否被调用
- **解决**: 查看控制台日志

### 问题 3: backgroundColor 总是传递
- **检查**: `buildConfigFromFields()` 中的逻辑
- **解决**: 确认 `showBackgroundCheckbox.isSelected` 的判断

### 问题 4: PreviewMacApp 不接收 backgroundColor
- **检查**: PreviewMacApp 控制台日志
- **解决**: 确认 `configToDictionary` 中的逻辑

## 📝 测试检查清单

- [ ] 颜色选择器可以正常打开
- [ ] 选择颜色后按钮正确更新
- [ ] 按钮文字显示十六进制值
- [ ] 文字颜色自动调整
- [ ] showBackground=false 时，backgroundColor 为 null
- [ ] showBackground=true 时，backgroundColor 被传递
- [ ] PreviewMacApp 正确接收配置
- [ ] 控制台日志显示正确的配置值

