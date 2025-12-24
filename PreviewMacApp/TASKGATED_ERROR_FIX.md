# Taskgated Invalid Signature 错误修复指南

## 错误信息

```
signal: SIGKILL (Code Signature Invalid)
termination: Taskgated Invalid Signature
namespace: CODESIGNING
```

## 错误含义

### 1. `SIGKILL (Code Signature Invalid)`

- **SIGKILL**：系统强制终止信号，无法被捕获或忽略
- **Code Signature Invalid**：代码签名验证失败
- **原因**：Taskgated 在验证代码签名时发现签名无效或证书类型不正确

### 2. `Taskgated Invalid Signature`

- **Taskgated**：macOS 的代码签名验证守护进程
- **Invalid Signature**：签名无效
- **触发时机**：应用通过 launchd 启动时（如使用 `open` 命令或 Finder 双击）

### 3. `namespace: CODESIGNING`

- 表示错误发生在代码签名验证阶段
- 不是运行时错误，而是启动前的验证失败

## 根本原因

### 证书类型不匹配

当前使用的证书：`Apple Distribution`

**问题**：
- `Apple Distribution` 证书仅用于 **Mac App Store 分发**
- 当直接运行（非 App Store）时，Taskgated 会拒绝
- 即使签名本身有效，系统也会阻止启动

### 证书类型对比

| 证书类型 | 用途 | 直接运行 | App Store | Taskgated 接受 |
|---------|------|---------|-----------|---------------|
| Developer ID Application | 直接分发 | ✅ | ❌ | ✅ |
| Apple Distribution | App Store | ❌ | ✅ | ❌ |
| 3rd Party Mac Developer Application | App Store | ❌ | ✅ | ❌ |

## 解决方案

### 方案 1：使用 Developer ID Application 证书（推荐）

#### 步骤 1：检查是否有 Developer ID 证书

```bash
security find-identity -v -p codesigning | grep "Developer ID Application"
```

如果没有输出，需要创建证书：
1. 登录 [Apple Developer Portal](https://developer.apple.com)
2. Certificates, Identifiers & Profiles → Certificates
3. 点击 "+" 创建新证书
4. 选择 "Developer ID Application"
5. 下载并安装到 Keychain

#### 步骤 2：使用 Developer ID 证书重新签名

```bash
# 设置证书名称（根据实际情况修改）
DEVELOPER_ID="Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)"

# 重新签名
codesign --force --deep --sign "$DEVELOPER_ID" \
  --entitlements /Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp/PreviewMacApp/KuiklyUITools.entitlements \
  --options runtime \
  /Applications/KuiklyUITools.app

# 验证签名
codesign --verify --deep --strict --verbose=2 /Applications/KuiklyUITools.app

# 验证 Taskgated（应该显示 accepted，而不是 rejected）
spctl --assess --verbose --type execute /Applications/KuiklyUITools.app
```

#### 步骤 3：测试启动

```bash
# 方法 1：使用 open 命令
open /Applications/KuiklyUITools.app

# 方法 2：通过 Finder 双击
# 应该能正常启动，不再显示"意外退出"
```

### 方案 2：修改构建脚本

修改 `build_dmg.sh`，确保使用正确的证书：

```bash
# 在 build_dmg.sh 开头添加
# 代码签名配置
CODE_SIGN_IDENTITY="${CODE_SIGN_IDENTITY:-Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)}"

# 验证证书类型
CERT_TYPE=$(security find-identity -v -p codesigning | grep "$CODE_SIGN_IDENTITY" | head -1)
if echo "$CERT_TYPE" | grep -q "Developer ID Application"; then
    echo "✓ 使用正确的证书类型: Developer ID Application"
elif echo "$CERT_TYPE" | grep -q "Apple Distribution\|3rd Party Mac Developer"; then
    echo "⚠️  警告: 使用了 App Store 证书，不适用于直接分发"
    echo "   请使用 Developer ID Application 证书"
    exit 1
fi
```

### 方案 3：通过 Mac App Store 分发

如果必须使用 `Apple Distribution` 证书：

1. 通过 App Store Connect 提交应用
2. 通过 Mac App Store 分发
3. **不要**直接分发 DMG 文件

## 验证步骤

### 1. 检查证书类型

```bash
codesign -dvv /Applications/KuiklyUITools.app | grep "^Authority=" | head -1
```

**应该显示**：
```
Authority=Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)
```

**不应该显示**：
- `Apple Distribution`
- `3rd Party Mac Developer Application`

### 2. 验证签名完整性

```bash
codesign --verify --deep --strict --verbose=2 /Applications/KuiklyUITools.app
```

**应该显示**：
```
/Applications/KuiklyUITools.app: valid on disk
/Applications/KuiklyUITools.app: satisfies its Designated Requirement
```

### 3. 验证 Taskgated 接受

```bash
spctl --assess --verbose --type execute /Applications/KuiklyUITools.app
```

**应该显示**：
```
/Applications/KuiklyUITools.app: accepted
```

**不应该显示**：
- `rejected`
- `override=security disabled`

### 4. 测试启动

```bash
# 清理之前的进程
killall KuiklyUITools 2>/dev/null || true

# 使用 open 命令启动
open /Applications/KuiklyUITools.app

# 等待几秒后检查
sleep 3
if pgrep -f "KuiklyUITools" > /dev/null; then
    echo "✓ 应用成功启动"
else
    echo "✗ 应用启动失败"
    # 检查最新崩溃报告
    ls -lt ~/Library/Logs/DiagnosticReports/KuiklyUITools-*.ips | head -1
fi
```

## 常见问题

### Q1: 为什么 `codesign --verify` 显示有效，但 Taskgated 仍然拒绝？

A: `codesign --verify` 只检查签名的**完整性**和**格式**，不检查**证书类型**。Taskgated 会额外验证证书类型是否适用于当前场景。

### Q2: 为什么直接运行可执行文件可以，但 `open` 命令不行？

A:
- **直接运行**：`/Applications/KuiklyUITools.app/Contents/MacOS/KuiklyUITools`
  - 绕过 launchd，部分检查被跳过
- **通过 launchd**：`open /Applications/KuiklyUITools.app`
  - 通过 launchd 启动，Taskgated 会严格验证

### Q3: 如何区分不同的证书类型？

A: 使用以下命令查看所有证书：

```bash
security find-identity -v -p codesigning
```

证书名称包含：
- `Developer ID Application` → 用于直接分发 ✅
- `Apple Distribution` → 用于 App Store ❌
- `3rd Party Mac Developer Application` → 用于 App Store ❌

### Q4: 是否可以不签名？

A: 可以，但不推荐：
- 用户会看到"无法验证开发者"警告
- 无法进行公证（Notarization）
- 可能被 Gatekeeper 阻止
- 某些系统功能可能受限

### Q5: 如何检查应用是否被 Taskgated 拒绝？

A: 检查崩溃报告：

```bash
# 查看最新崩溃报告
ls -lt ~/Library/Logs/DiagnosticReports/KuiklyUITools-*.ips | head -1 | awk '{print $NF}' | xargs cat | grep -A 3 "termination"
```

如果看到 `"indicator":"Taskgated Invalid Signature"`，说明被拒绝。

## 快速修复脚本

创建一个快速修复脚本 `fix_taskgated_error.sh`：

```bash
#!/bin/bash

APP_PATH="/Applications/KuiklyUITools.app"
ENTITLEMENTS="/Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp/PreviewMacApp/KuiklyUITools.entitlements"

echo "=== 修复 Taskgated Invalid Signature 错误 ==="
echo ""

# 1. 检查是否有 Developer ID 证书
echo "1. 检查 Developer ID 证书..."
DEVELOPER_ID=$(security find-identity -v -p codesigning | grep "Developer ID Application" | head -1 | sed 's/.*"\(.*\)".*/\1/')

if [ -z "$DEVELOPER_ID" ]; then
    echo "✗ 未找到 Developer ID Application 证书"
    echo "  请先在 Apple Developer Portal 创建该证书"
    exit 1
fi

echo "✓ 找到证书: $DEVELOPER_ID"
echo ""

# 2. 重新签名
echo "2. 重新签名应用..."
codesign --force --deep --sign "$DEVELOPER_ID" \
  --entitlements "$ENTITLEMENTS" \
  --options runtime \
  "$APP_PATH"

if [ $? -ne 0 ]; then
    echo "✗ 签名失败"
    exit 1
fi

echo "✓ 签名成功"
echo ""

# 3. 验证签名
echo "3. 验证签名..."
codesign --verify --deep --strict --verbose=2 "$APP_PATH"
echo ""

# 4. 验证 Taskgated
echo "4. 验证 Taskgated..."
SPCTL_RESULT=$(spctl --assess --verbose --type execute "$APP_PATH" 2>&1)
echo "$SPCTL_RESULT"

if echo "$SPCTL_RESULT" | grep -q "accepted"; then
    echo ""
    echo "✓ Taskgated 已接受应用"
    echo ""
    echo "可以尝试启动应用:"
    echo "  open $APP_PATH"
else
    echo ""
    echo "⚠️  Taskgated 仍然拒绝，请检查证书和签名"
fi
```

使用方法：

```bash
chmod +x fix_taskgated_error.sh
./fix_taskgated_error.sh
```

## 总结

**错误原因**：使用了 `Apple Distribution` 证书，该证书仅用于 App Store 分发。

**解决方法**：使用 `Developer ID Application` 证书重新签名。

**验证**：`spctl --assess` 应该显示 `accepted`，而不是 `rejected`。





