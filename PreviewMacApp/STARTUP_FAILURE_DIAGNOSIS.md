# KuiklyUITools.app 启动失败完整诊断报告

生成时间：2025-12-19

## 执行摘要

**当前状态**：⚠️ 部分可用，但存在问题

- ✅ **直接运行可执行文件**：可以运行
- ❌ **通过 `open` 命令启动**：失败（Taskgated 拒绝）
- ❌ **通过 Finder 双击启动**：可能失败

## 问题详情

### 1. 证书类型问题（根本原因）

**当前使用的证书**：
```
Apple Distribution: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)
```

**问题**：
- `Apple Distribution` 证书仅用于 **Mac App Store 分发**
- 当直接运行（非 App Store）时，Taskgated 会拒绝
- 即使签名有效，系统也会阻止通过 launchd 启动

**崩溃信息**：
```
signal: SIGKILL (Code Signature Invalid)
indicator: Taskgated Invalid Signature
codeSigningTrustLevel: 4294967295 (无效)
```

### 2. 架构问题（已解决）

- ✅ 当前架构：arm64（正确）
- ✅ 系统架构：arm64（匹配）

### 3. 隔离属性（已解决）

- ✅ 隔离属性已移除

### 4. 启动方式差异

**直接运行可执行文件**：
```bash
/Applications/KuiklyUITools.app/Contents/MacOS/KuiklyUITools
```
✅ 可以运行（绕过某些检查）

**通过 launchd 启动**：
```bash
open /Applications/KuiklyUITools.app
```
❌ 失败（Taskgated 拒绝）

## 完整诊断结果

### 应用信息
```
路径: /Applications/KuiklyUITools.app
架构: arm64
Bundle ID: com.tencent.kuikly.kuikly-ui-tools
可执行文件权限: -rwxr-xr-x (正确)
```

### 代码签名
```
证书: Apple Distribution: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)
Team ID: 88L2Q4487U
签名状态: valid on disk, satisfies Designated Requirement
Runtime Version: 15.2.0
```

### Entitlements
```
com.apple.application-identifier: 88L2Q4487U.com.tencent.kuikly.kuikly-ui-tools
com.apple.developer.team-identifier: 88L2Q4487U
com.apple.security.app-sandbox: false
com.apple.security.get-task-allow: true
com.apple.security.network.client: true
com.apple.security.network.server: true
```

### Gatekeeper 状态
```
状态: accepted
原因: override=security disabled
```

**注意**：虽然 Gatekeeper 显示 accepted，但 Taskgated 仍然拒绝，因为证书类型不正确。

## 解决方案

### 方案 1：使用 Developer ID Application 证书（强烈推荐）

这是用于直接分发（非 App Store）的正确证书类型。

#### 步骤 1：检查是否有 Developer ID 证书

```bash
security find-identity -v -p codesigning | grep "Developer ID Application"
```

如果没有，需要：
1. 登录 Apple Developer Portal
2. 创建 `Developer ID Application` 证书
3. 下载并安装到 Keychain

#### 步骤 2：使用 Developer ID 证书重新签名

```bash
# 1. 找到 Developer ID 证书名称
DEVELOPER_ID="Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)"

# 2. 重新签名
codesign --force --deep --sign "$DEVELOPER_ID" \
  --entitlements /Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp/PreviewMacApp/KuiklyUITools.entitlements \
  --options runtime \
  /Applications/KuiklyUITools.app

# 3. 验证签名
codesign --verify --deep --strict --verbose=2 /Applications/KuiklyUITools.app

# 4. 验证 Gatekeeper
spctl --assess --verbose --type execute /Applications/KuiklyUITools.app
```

#### 步骤 3：进行公证（Notarization）

```bash
# 1. 提交公证
xcrun notarytool submit /Applications/KuiklyUITools.app \
  --apple-id "your@email.com" \
  --team-id "88L2Q4487U" \
  --password "app-specific-password" \
  --wait

# 2. 装订票据
xcrun stapler staple /Applications/KuiklyUITools.app

# 3. 验证
xcrun stapler validate /Applications/KuiklyUITools.app
```

### 方案 2：修改构建脚本使用正确证书

修改 `build_dmg.sh`，确保使用 `Developer ID Application` 证书：

```bash
# 在 build_dmg.sh 中
CODE_SIGN_IDENTITY="${CODE_SIGN_IDENTITY:-Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)}"
```

### 方案 3：通过 Mac App Store 分发

如果使用 `Apple Distribution` 证书，应该：
1. 通过 App Store Connect 提交应用
2. 通过 Mac App Store 分发
3. 不要直接分发 DMG

### 方案 4：临时解决方案（仅测试）

如果只是本地测试，可以：

```bash
# 1. 禁用 Gatekeeper（不推荐用于生产）
sudo spctl --master-disable

# 2. 移除隔离属性
xattr -cr /Applications/KuiklyUITools.app

# 3. 直接运行可执行文件（绕过 launchd）
/Applications/KuiklyUITools.app/Contents/MacOS/KuiklyUITools
```

**警告**：这不是生产环境的正确做法。

## 证书类型对比

| 证书类型 | 用途 | 直接运行 | App Store | 公证 |
|---------|------|---------|-----------|------|
| Developer ID Application | 直接分发 | ✅ | ❌ | ✅ |
| Apple Distribution | App Store | ❌ | ✅ | ❌ |
| 3rd Party Mac Developer Application | App Store | ❌ | ✅ | ❌ |

## 验证步骤

### 1. 检查证书类型

```bash
codesign -dvv /Applications/KuiklyUITools.app | grep Authority
```

应该显示：`Authority=Developer ID Application: ...`

### 2. 验证签名

```bash
codesign --verify --deep --strict --verbose=2 /Applications/KuiklyUITools.app
```

应该显示：`valid on disk` 和 `satisfies Designated Requirement`

### 3. 验证 Gatekeeper

```bash
spctl --assess --verbose --type execute /Applications/KuiklyUITools.app
```

应该显示：`accepted`（不是 `override=security disabled`）

### 4. 测试启动

```bash
# 方法 1：通过 open 命令
open /Applications/KuiklyUITools.app

# 方法 2：通过 Finder 双击
# 应该能正常启动，不会显示"已损坏"或"意外退出"
```

## 常见问题

### Q: 为什么直接运行可执行文件可以，但 `open` 命令不行？

A: 直接运行可执行文件绕过了 launchd 和 Taskgated 的部分检查。但通过 launchd 启动时，Taskgated 会严格验证证书类型，拒绝 `Apple Distribution` 证书。

### Q: Gatekeeper 显示 accepted，为什么还是失败？

A: Gatekeeper 和 Taskgated 是两个不同的系统：
- Gatekeeper：检查应用是否来自可信来源
- Taskgated：验证代码签名和证书类型

即使 Gatekeeper 接受，Taskgated 仍然可能拒绝不正确的证书类型。

### Q: 如何知道应该使用哪种证书？

A:
- **直接分发 DMG/安装包**：使用 `Developer ID Application`
- **通过 Mac App Store 分发**：使用 `Apple Distribution` 或 `3rd Party Mac Developer Application`

### Q: 是否可以不签名？

A: 可以，但不推荐：
- 用户会看到"无法验证开发者"警告
- 无法进行公证
- 可能被 Gatekeeper 阻止

## 下一步行动

1. ✅ **立即**：检查是否有 `Developer ID Application` 证书
2. ✅ **立即**：如果有，使用该证书重新签名
3. ⚠️  **尽快**：进行公证（Notarization）
4. ⚠️  **长期**：修改构建流程，确保使用正确的证书类型

## 相关文档

- `ARCHITECTURE_FIX_GUIDE.md` - 架构问题解决方案
- `DMG_CODE_SIGNING_GUIDE.md` - DMG 代码签名指南
- `DMG_NOTARIZATION_GUIDE.md` - DMG 公证指南
- `DISABLE_GATEKEEPER_GUIDE.md` - Gatekeeper 禁用指南（不推荐）





