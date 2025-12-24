# 预览配置参数功能测试指南

## 测试概述

本测试用于验证预览配置参数功能是否正常工作。测试会使用 Pixel 5 配置启动预览，验证配置参数是否正确传递和应用。

## 前置条件

1. **PreviewMacApp 必须运行**
   - 打开 Xcode
   - 打开 `PreviewMacApp.xcworkspace`
   - 运行 PreviewMacApp
   - 确认端口 9528 正在监听

2. **检查端口**
   ```bash
   lsof -i :9528
   ```

## 测试步骤

### 方法一：使用测试脚本（推荐）

```bash
./test_preview_config.sh
```

### 方法二：手动运行

1. **编译项目**
   ```bash
   ./gradlew :desktopAppWithMacRender:compileKotlinJvm
   ```

2. **运行测试**
   ```bash
   cd desktopAppWithMacRender
   ./gradlew testPreviewConfig
   ```

### 方法三：在 IDE 中运行

1. 打开 `desktopAppWithMacRender/src/jvmMain/kotlin/com/tencent/kuikly/desktop/mac/TestPreviewConfig.kt`
2. 右键点击 `main` 函数
3. 选择 "Run 'TestPreviewConfigKt'"

## 测试配置

测试使用的配置参数：

```kotlin
val config = PreviewConfig.PIXEL_5.copy(
    name = "测试配置",
    group = "测试组",
    locale = "en-US",
    fontScale = 1.0f,
    showSystemUi = false,
    showBackground = false,
    backgroundColor = "#FFFFFF",
    apiLevel = 35
)
```

具体参数：
- **Device**: Pixel 5
- **Size**: 1080x2340
- **Density**: 2.75 (440dpi / 160)
- **Orientation**: portrait
- **API Level**: 35
- **Locale**: en-US
- **Font Scale**: 1.0

## 验证点

### 1. 控制台日志验证

**JVM 端（desktopAppWithMacRender）应该看到：**
```
[Test] 📋 使用配置:
  - Device: Pixel 5
  - Size: 1080x2340
  - Density: 2.75
  - Orientation: portrait
  - API Level: 35
  - Locale: en-US
  - Font Scale: 1.0

[Mac SDK] 📋 使用预览配置: device=Pixel 5, density=2.75, orientation=portrait
```

**Mac 端（PreviewMacApp）应该看到：**
```
[PreviewServer] 📋 预览配置: device=Pixel 5, density=2.75, orientation=portrait
[PreviewRenderVC] 📋 应用预览配置: {device: Pixel 5, density: 2.75, ...}
[PreviewRenderVC] ✅ 预览配置已应用
```

### 2. 预览窗口验证

- 预览窗口大小应为 **1080x2340**
- 窗口标题应显示正确的尺寸

### 3. 配置参数验证

在 PreviewMacApp 的控制台中，应该看到配置参数被正确应用：
- density 参数被合并到 pageData
- orientation 参数被应用
- 其他配置参数被正确传递

## 常见问题

### 1. PreviewMacApp 未运行

**错误信息：**
```
[Test] ❌ 预览启动失败
[Test] 💡 请确保 PreviewMacApp 已启动 (端口 9528)
```

**解决方法：**
- 启动 PreviewMacApp
- 检查端口是否正确（默认 9528）

### 2. 配置参数未应用

**检查点：**
1. 查看 PreviewMacApp 控制台是否有配置日志
2. 检查 `applyConfig:` 方法是否被调用
3. 验证配置字典是否正确传递

### 3. 编译错误

**如果遇到编译错误：**
```bash
# 清理并重新编译
./gradlew clean
./gradlew :desktopAppWithMacRender:compileKotlinJvm
```

## 测试代码位置

- **测试文件**: `desktopAppWithMacRender/src/jvmMain/kotlin/com/tencent/kuikly/desktop/mac/TestPreviewConfig.kt`
- **配置类**: `mac-render-sdk/src/jvmMain/kotlin/com/tencent/kuikly/mac/sdk/PreviewConfig.kt`

## 下一步

测试通过后，可以在实际项目中使用预览配置参数：

```kotlin
val config = PreviewConfig(
    device = "Pixel 5",
    width = 1080,
    height = 2340,
    density = 2.75f,
    orientation = "portrait",
    apiLevel = 35,
    locale = "en-US"
)

val runner = KuiklyMacPreviewRunner(
    pageName = "MyPage",
    config = config
)
runner.start()
```

