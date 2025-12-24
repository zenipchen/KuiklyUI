# 构建失败 - Exit Code 65 错误分析

## 错误信息

```
** BUILD FAILED **

The following build commands failed:
    Building workspace PreviewMacApp with scheme KuiklyUITools and configuration Release
(1 failure)

Fail to run the plugin because exit code not equal 0
Error: Process completed with exit code 2199011: Script command execution failed with exit code(65)
```

## 错误含义

### Exit Code 65

`xcodebuild` 退出代码 65 通常表示：
- **编译错误**：源代码编译失败
- **链接错误**：链接阶段失败
- **配置错误**：项目配置问题
- **依赖错误**：依赖库或框架问题

### 常见原因

1. **编译错误**（最常见）
   - 语法错误
   - 类型不匹配
   - 缺少头文件
   - API 不可用

2. **架构不匹配**
   - 目标架构与构建机器不匹配
   - 依赖库架构不匹配

3. **依赖问题**
   - CocoaPods 依赖未正确安装
   - 依赖库版本不兼容
   - 缺少必要的框架

4. **配置问题**
   - Build Settings 配置错误
   - 签名配置问题
   - SDK 版本不匹配

## 诊断步骤

### 步骤 1：获取详细错误信息

运行诊断脚本：

```bash
cd /Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp
./diagnose_build_failure.sh
```

或手动获取详细日志：

```bash
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build 2>&1 | tee build_detailed.log

# 提取错误
grep -A 20 "error:" build_detailed.log
```

### 步骤 2：检查常见问题

#### 问题 A: 架构不匹配

**症状**：
- 警告：`Using the first of multiple matching destinations: { platform:macOS, arch:x86_64 }`
- 构建机器是 arm64，但目标架构是 x86_64

**解决方案**：

```bash
# 方法 1: 构建 arm64 版本（推荐）
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -arch arm64 \
    ONLY_ACTIVE_ARCH=NO \
    -derivedDataPath ./build/DerivedData \
    clean build

# 方法 2: 使用 build_dmg.sh 并指定架构
BUILD_ARCH=arm64 ./build_dmg.sh 1.0.0
```

#### 问题 B: Pod 依赖问题

**症状**：
- 找不到 Pod 依赖
- Pod 编译失败

**解决方案**：

```bash
# 清理并重新安装
cd PreviewMacApp
rm -rf Pods Podfile.lock build/DerivedData
pod install --repo-update

# 然后重新构建
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build
```

#### 问题 C: 编译错误

**症状**：
- 日志中显示具体的 `error:` 信息
- 通常是某个文件编译失败

**解决方案**：

1. **查看具体错误**：
   ```bash
   grep -A 20 "error:" build_detailed.log
   ```

2. **检查失败的文件**：
   - 查看错误信息中提到的文件
   - 检查该文件的语法和导入

3. **常见编译错误**：
   - 缺少头文件：检查 `#import` 或 `#include`
   - API 不可用：检查 `API_AVAILABLE` 注解
   - 类型不匹配：检查类型定义

#### 问题 D: 链接错误

**症状**：
- `Undefined symbol`
- `ld: library not found`
- `framework not found`

**解决方案**：

```bash
# 检查链接设置
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -showBuildSettings \
    | grep -E "FRAMEWORK_SEARCH_PATHS|LIBRARY_SEARCH_PATHS|OTHER_LDFLAGS"
```

## 快速修复方案

### 方案 1: 清理并重建

```bash
cd PreviewMacApp

# 清理所有构建产物
rm -rf build Pods Podfile.lock DerivedData

# 重新安装依赖
pod install

# 重新构建
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build
```

### 方案 2: 使用正确的架构

```bash
# 如果构建机器是 Apple Silicon
BUILD_ARCH=arm64 ./build_dmg.sh 1.0.0

# 如果需要通用二进制
BUILD_ARCH="arm64 x86_64" ./build_dmg.sh 1.0.0
```

### 方案 3: 检查 Xcode 版本

```bash
# 检查 Xcode 版本
xcodebuild -version

# 确保使用正确的 Xcode
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

## 获取帮助

如果以上方法都无法解决，请提供以下信息：

1. **完整构建日志**：
   ```bash
   ./diagnose_build_failure.sh
   ```

2. **环境信息**：
   ```bash
   xcodebuild -version
   sw_vers
   uname -m
   ```

3. **项目配置**：
   ```bash
   cat Podfile
   cat Podfile.lock 2>/dev/null || echo "Podfile.lock 不存在"
   ```

4. **具体错误信息**：
   ```bash
   grep -A 20 "error:" build_detailed.log
   ```

## 相关文档

- `BUILD_ERROR_TROUBLESHOOTING.md` - 详细构建错误排查指南
- `ARCHITECTURE_FIX_GUIDE.md` - 架构问题解决方案
- `COMPILE_ERROR_ANALYSIS.md` - 编译错误分析
- `diagnose_build_failure.sh` - 构建失败诊断脚本

## 常见错误模式

### 模式 1: UIView+CSS.m 编译失败

**错误**：
```
CompileC .../UIView+CSS.m normal x86_64 objective-c
error: ...
```

**解决方案**：查看 `BUILD_ERROR_TROUBLESHOOTING.md`

### 模式 2: 架构警告

**错误**：
```
WARNING: Using the first of multiple matching destinations:
{ platform:macOS, arch:x86_64 }
```

**解决方案**：指定正确的架构或使用通用二进制

### 模式 3: Pod 依赖失败

**错误**：
```
[!] Pod installation failed
```

**解决方案**：清理并重新安装 Pods





