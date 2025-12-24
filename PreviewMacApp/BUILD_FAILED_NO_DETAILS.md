# 构建失败 - 无详细错误信息

## 错误信息

```
** BUILD FAILED **

The following build commands failed:
    Building workspace PreviewMacApp with scheme KuiklyUITools and configuration Release
(1 failure)

Exit Code: 65
警告: Using the first of multiple matching destinations: { platform:macOS, arch:x86_64 }
```

## 问题分析

### 错误特征

1. **BUILD FAILED** 但没有显示具体错误
2. **Exit Code 65** - xcodebuild 构建失败
3. **架构警告** - 使用 x86_64 架构
4. **Note 信息** - Swift 预览被禁用（这是正常的，不影响构建）

### 可能的原因

1. **架构不匹配**（最可能）
   - 构建机器是 Apple Silicon (arm64)
   - 但构建目标是 x86_64
   - 可能导致编译或链接失败

2. **编译错误被隐藏**
   - CI/CD 环境可能没有显示完整错误
   - 需要查看详细日志

3. **依赖问题**
   - Pod 依赖未正确安装
   - 依赖库架构不匹配

## 解决方案

### 方案 1：获取详细错误信息（首先执行）

运行脚本获取详细错误：

```bash
cd /Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp
./get_detailed_build_error.sh
```

或手动获取：

```bash
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build 2>&1 | tee build_error.log

# 查看错误
grep -A 20 "error:" build_error.log
```

### 方案 2：修复架构问题（如果构建机器是 Apple Silicon）

```bash
# 使用 arm64 架构构建
cd /Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp
BUILD_ARCH=arm64 ./build_dmg.sh 1.0.0
```

或直接使用 xcodebuild：

```bash
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -arch arm64 \
    ONLY_ACTIVE_ARCH=NO \
    -derivedDataPath ./build/DerivedData \
    clean build
```

### 方案 3：清理并重建

```bash
cd /Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp

# 清理所有构建产物
rm -rf build Pods Podfile.lock build/DerivedData

# 重新安装依赖
pod install

# 使用正确架构重新构建
BUILD_ARCH=arm64 ./build_dmg.sh 1.0.0
```

### 方案 4：检查 CI/CD 配置

如果是在 CI/CD 环境中：

1. **检查构建机器架构**：
   ```bash
   uname -m  # 应该显示 arm64 或 x86_64
   ```

2. **修改构建命令**：
   ```yaml
   # 在 CI/CD 配置中添加架构参数
   - run: |
       cd PreviewMacApp
       BUILD_ARCH=arm64 ./build_dmg.sh 1.0.0
   ```

3. **或使用 xcodebuild 直接构建**：
   ```bash
   xcodebuild \
       -workspace PreviewMacApp.xcworkspace \
       -scheme KuiklyUITools \
       -configuration Release \
       -arch arm64 \
       ONLY_ACTIVE_ARCH=NO \
       -derivedDataPath ./build/DerivedData \
       clean build
   ```

## 诊断步骤

### 步骤 1：确认构建机器架构

```bash
uname -m
# arm64 = Apple Silicon
# x86_64 = Intel Mac
```

### 步骤 2：获取详细错误

```bash
./get_detailed_build_error.sh
```

### 步骤 3：根据错误信息修复

- **如果是架构错误**：使用 `BUILD_ARCH=arm64`
- **如果是编译错误**：查看具体文件并修复
- **如果是依赖错误**：重新安装 Pods

## 常见错误模式

### 模式 1: 架构不匹配

**症状**：
- 警告：`Using the first of multiple matching destinations: { platform:macOS, arch:x86_64 }`
- 构建机器是 arm64

**解决**：
```bash
BUILD_ARCH=arm64 ./build_dmg.sh 1.0.0
```

### 模式 2: 编译错误（UIView+CSS.m）

**症状**：
- 错误信息中提到 `UIView+CSS.m`
- 通常是头文件或 API 问题

**解决**：查看 `BUILD_ERROR_TROUBLESHOOTING.md`

### 模式 3: Pod 依赖失败

**症状**：
- 错误信息中提到 Pod 相关
- 找不到依赖库

**解决**：
```bash
rm -rf Pods Podfile.lock
pod install --repo-update
```

## 快速检查清单

- [ ] 运行 `./get_detailed_build_error.sh` 获取详细错误
- [ ] 检查构建机器架构：`uname -m`
- [ ] 如果构建机器是 arm64，使用 `BUILD_ARCH=arm64`
- [ ] 检查 Pod 依赖是否正确安装
- [ ] 查看完整构建日志中的 `error:` 信息

## 相关文档

- `BUILD_FAILURE_EXIT_CODE_65.md` - Exit Code 65 详细分析
- `BUILD_ERROR_TROUBLESHOOTING.md` - 构建错误排查指南
- `ARCHITECTURE_FIX_GUIDE.md` - 架构问题解决方案
- `get_detailed_build_error.sh` - 获取详细错误脚本





