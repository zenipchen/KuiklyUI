# 构建错误排查指南

## 错误信息

```
Fail to run the plugin because exit code not equal 0
Error: Process completed with exit code 2199011: Script command execution failed with exit code(65)
xcodebuild: WARNING: Using the first of multiple matching destinations:
{ platform:macOS, arch:x86_64, id:4232A0C8-0BAB-FEF6-4EA8-A1F6AB7AA3C7 }
{ platform:macOS, name:Any Mac }
** BUILD FAILED **

The following build commands failed:
    CompileC .../UIView+CSS.m normal x86_64 objective-c com.apple.compilers.llvm.clang.1_0.compiler 
    (in target 'OpenKuiklyIOSRender' from project 'Pods')
```

## 问题分析

编译失败发生在 `UIView+CSS.m` 文件，目标架构为 `x86_64`（Intel Mac）。

## 排查步骤

### 1. 查看详细编译错误

在 CI/CD 环境中，xcodebuild 可能没有显示完整的错误信息。尝试以下方法获取详细错误：

```bash
# 方法1: 增加详细输出
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    clean build \
    2>&1 | tee build.log

# 方法2: 只编译失败的文件
cd PreviewMacApp
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build \
    | grep -A 20 "error:"
```

### 2. 检查常见问题

#### 问题 A: macOS API 兼容性

`UIView+CSS.m` 中使用了条件编译 `#if TARGET_OS_OSX`，但某些 API 可能在 macOS 上不可用。

**检查点：**
- 确认所有 iOS 专用 API 都有 macOS 替代方案
- 检查 `RCTUIKit.h` 是否正确导入

#### 问题 B: 架构不匹配

如果构建机器是 Apple Silicon (arm64)，但目标架构是 x86_64，可能存在架构相关的问题。

**解决方案：**
```bash
# 方法1: 指定架构
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    ARCHS=x86_64 \
    ONLY_ACTIVE_ARCH=NO \
    clean build

# 方法2: 使用通用二进制（推荐）
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    ARCHS="x86_64 arm64" \
    ONLY_ACTIVE_ARCH=NO \
    clean build
```

#### 问题 C: Pod 依赖问题

`OpenKuiklyIOSRender` Pod 可能没有正确配置 macOS 支持。

**检查步骤：**
```bash
# 1. 清理 Pods
cd PreviewMacApp
rm -rf Pods Podfile.lock

# 2. 重新安装
pod install --repo-update

# 3. 检查 Pod 配置
cat Pods/Target\ Support\ Files/OpenKuiklyIOSRender/OpenKuiklyIOSRender.xcconfig
```

#### 问题 D: 头文件搜索路径

**检查方法：**
```bash
# 查看头文件搜索路径
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -showBuildSettings \
    | grep HEADER_SEARCH_PATHS
```

### 3. 本地复现问题

在本地 Mac 上尝试复现：

```bash
cd PreviewMacApp

# 清理
rm -rf build Pods Podfile.lock
pod install

# 构建
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build 2>&1 | tee build.log
```

### 4. 检查特定文件编译

单独编译问题文件：

```bash
# 设置环境变量
export SDKROOT=$(xcrun --show-sdk-path --sdk macosx)
export CC=$(xcrun --find clang)
export CXX=$(xcrun --find clang++)

# 编译单个文件（需要调整路径）
clang -c \
    -arch x86_64 \
    -isysroot $SDKROOT \
    -framework AppKit \
    -framework Foundation \
    -I./Pods/Headers/Public \
    -I./Pods/Headers/Private \
    core-render-ios/Extension/Category/UIView+CSS.m \
    -o /tmp/UIView+CSS.o
```

### 5. 检查 Xcode 版本兼容性

确保使用的 Xcode 版本支持 macOS 12.0：

```bash
xcodebuild -version
# 应该显示 Xcode 13.0 或更高版本
```

### 6. 临时解决方案

如果问题持续，可以尝试：

#### 方案 A: 禁用特定警告

在 `Podfile` 的 `post_install` 中添加：

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['MACOSX_DEPLOYMENT_TARGET'] = '12.0'
      # 禁用特定警告
      config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
      # 或者只针对 OpenKuiklyIOSRender
      if target.name == 'OpenKuiklyIOSRender'
        config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
      end
    end
  end
end
```

#### 方案 B: 修改架构设置

如果不需要支持 Intel Mac，可以只构建 arm64：

```bash
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    ARCHS=arm64 \
    ONLY_ACTIVE_ARCH=YES \
    clean build
```

## 快速诊断脚本

已创建 `get_build_errors.sh` 脚本来获取详细的编译错误：

```bash
cd PreviewMacApp
./get_build_errors.sh
```

这个脚本会：
1. 执行完整构建
2. 捕获所有输出到 `build_full.log`
3. 提取并显示错误、警告和失败信息

## 已修复的问题

### 问题 1: API_AVAILABLE 注解不完整 ✅

**位置**: `UIView+CSS.m` 第 71 行

**修复前**:
```objective-c
API_AVAILABLE(ios(7.0))
```

**修复后**:
```objective-c
API_AVAILABLE(ios(7.0), macos(10.9))
```

**原因**: macOS 编译时无法识别仅 iOS 的可用性注解

## 获取帮助

如果以上方法都无法解决，请提供以下信息：

1. **完整构建日志**（运行 `./get_build_errors.sh` 获取）
2. **Xcode 版本**：`xcodebuild -version`
3. **macOS 版本**：`sw_vers`
4. **构建机器架构**：`uname -m`
5. **Podfile.lock 内容**（如果存在）
6. **build_full.log 文件**（运行诊断脚本后生成）

## 相关文件

- `core-render-ios/Extension/Category/UIView+CSS.m` - 编译失败的文件
- `core-render-ios/MacSupport/RCTUIKit.h` - macOS 平台适配头文件
- `PreviewMacApp/Podfile` - Pod 依赖配置






