# 预览配置参数功能测试结果

## 测试时间
2025-01-XX

## 编译测试 ✅

### 测试结果
- **状态**: ✅ **编译成功**
- **编译命令**: `./gradlew :desktopAppWithMacRender:compileKotlinJvm`
- **编译时间**: 26秒
- **问题**: 已修复 `TEST_PAGE_NAME` 常量冲突

### 修复的问题
1. **常量冲突**: `TEST_PAGE_NAME` 在多个文件中定义
   - **解决方案**: 将 `TestPreviewConfig.kt` 中的常量重命名为 `TEST_PAGE_NAME_CONFIG`
2. **导入问题**: 缺少 `KuiklyMacRenderSdk` 导入
   - **解决方案**: 添加正确的导入语句

## 功能测试准备

### 测试文件
- **测试代码**: `desktopAppWithMacRender/src/jvmMain/kotlin/com/tencent/kuikly/desktop/mac/TestPreviewConfig.kt`
- **测试脚本**: `test_preview_config.sh`
- **Gradle 任务**: `./gradlew :desktopAppWithMacRender:testPreviewConfig`

### 测试配置
测试使用 Pixel 5 配置：
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

参数详情：
- Device: Pixel 5
- Size: 1080x2340
- Density: 2.75 (440dpi)
- Orientation: portrait
- API Level: 35
- Locale: en-US
- Font Scale: 1.0

## 运行测试

### 前置条件
1. ✅ PreviewMacApp 必须运行（端口 9528）
2. ✅ 编译成功

### 运行命令

**方法一：使用 Gradle 任务**
```bash
cd desktopAppWithMacRender
./gradlew testPreviewConfig
```

**方法二：使用测试脚本**
```bash
./test_preview_config.sh
```

**方法三：在 IDE 中运行**
- 打开 `TestPreviewConfig.kt`
- 运行 `main` 函数

## 预期测试结果

### JVM 端控制台输出
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
[Mac SDK] 📱 初始化渲染: pageName=HelloWorldPage, size=1080x2340
[Test] ✅ 已连接到 Mac 渲染端
```

### PreviewMacApp 控制台输出
```
[PreviewServer] 📋 预览配置: device=Pixel 5, density=2.75, orientation=portrait
[PreviewRenderVC] 📋 应用预览配置: {device: Pixel 5, density: 2.75, ...}
[PreviewRenderVC] ✅ 预览配置已应用
```

### 预览窗口验证
- ✅ 窗口大小应为 **1080x2340**
- ✅ 窗口标题显示正确的尺寸
- ✅ 配置参数已应用到渲染端

## 测试状态

### 编译测试
- ✅ **通过** - 代码编译成功，无错误

### 功能测试
- ⏳ **待运行** - 需要启动 PreviewMacApp 后运行

### 下一步
1. 启动 PreviewMacApp
2. 运行测试命令
3. 验证配置参数是否正确传递和应用

## 已知问题
无

## 测试结论

✅ **编译测试通过** - 代码可以正常编译，所有语法错误已修复。

⏳ **功能测试待验证** - 需要在实际运行环境中验证配置参数的传递和应用。

