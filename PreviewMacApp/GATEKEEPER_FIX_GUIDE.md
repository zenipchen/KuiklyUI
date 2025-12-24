# Gatekeeper 问题修复指南

## 问题描述

macOS 显示错误：
```
无法打开"KuiklyUITools",因为它不是从 App Store下载。
你的安全性设置仅允许安装来自 App Store 的App。
```

## 原因

应用没有被正确签名，macOS Gatekeeper 阻止了未签名应用的运行。

## 解决方案

### 方案 1：启用代码签名（推荐）

#### 步骤 1：查找证书

运行诊断脚本：
```bash
cd PreviewMacApp
./fix_gatekeeper_issue.sh
```

或手动查找：
```bash
security find-identity -v -p codesigning | grep "Developer ID Application"
```

你应该看到类似：
```
15343903668111E9F0C270F28C710D1EBEA7A64A "Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)"
```

#### 步骤 2：使用证书重新构建

使用证书哈希（推荐）：
```bash
CODE_SIGN_IDENTITY="15343903668111E9F0C270F28C710D1EBEA7A64A" \
ENABLE_CODE_SIGN=true \
USE_PROVISIONING_PROFILE=false \
./build_dmg.sh 1.0.0
```

或使用证书名称：
```bash
CODE_SIGN_IDENTITY="Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)" \
ENABLE_CODE_SIGN=true \
USE_PROVISIONING_PROFILE=false \
./build_dmg.sh 1.0.0
```

#### 步骤 3：验证签名

构建完成后，验证签名：
```bash
# 检查应用签名
codesign -dv --verbose=4 build/Release/KuiklyUITools.app

# 检查 Gatekeeper 状态
spctl -a -vv build/Release/KuiklyUITools.app
```

如果看到 `accepted`，说明签名成功。

### 方案 2：进行公证（Notarization）- 最完整方案

对于正式发布，建议进行 Apple 公证：

#### 步骤 1：准备 App 专用密码

1. 访问 https://appleid.apple.com
2. 登录你的 Apple ID
3. 进入"安全" → "App 专用密码"
4. 生成新密码（用于公证）
5. 保存密码（只显示一次）

#### 步骤 2：构建并公证

```bash
CODE_SIGN_IDENTITY="15343903668111E9F0C270F28C710D1EBEA7A64A" \
ENABLE_CODE_SIGN=true \
USE_PROVISIONING_PROFILE=false \
ENABLE_NOTARIZATION=true \
APPLE_ID="your@email.com" \
APP_SPECIFIC_PASSWORD="your-app-specific-password" \
TEAM_ID="88L2Q4487U" \
./build_dmg.sh 1.0.0
```

脚本会自动：
1. 签名应用
2. 创建 DMG
3. 提交公证
4. 装订公证票据

#### 步骤 3：验证公证

```bash
xcrun stapler validate build/KuiklyUITools-1.0.0.dmg
```

### 方案 3：临时解决方案（仅用于测试）

如果暂时无法签名，可以在目标 Mac 上执行：

#### 方法 A：移除隔离属性（推荐）

```bash
# 对于应用
xattr -cr /path/to/KuiklyUITools.app

# 或对于整个 DMG
xattr -cr /path/to/KuiklyUITools-1.0.0.dmg
```

#### 方法 B：右键打开（一次性）

1. 右键点击应用
2. 选择"打开"
3. 在弹出对话框中点击"打开"

#### 方法 C：临时禁用 Gatekeeper（不推荐，有安全风险）

```bash
# 临时禁用（需要管理员权限）
sudo spctl --master-disable

# 使用完后重新启用
sudo spctl --master-enable
```

## 常见问题

### Q1: 找不到 Developer ID Application 证书？

**原因**：证书未安装或已过期

**解决**：
1. 登录 [Apple Developer Portal](https://developer.apple.com)
2. 进入"Certificates, Identifiers & Profiles"
3. 创建新的 "Developer ID Application" 证书
4. 下载并双击安装到钥匙串

### Q2: 签名后仍然显示"已损坏"？

**可能原因**：
1. 证书类型不正确（需要使用 Developer ID Application，不是 3rd Party Mac Developer）
2. 需要公证（macOS 10.15+ 要求）
3. 签名验证失败

**检查步骤**：
```bash
# 检查签名
codesign --verify --deep --strict --verbose=2 build/Release/KuiklyUITools.app

# 检查 Gatekeeper
spctl -a -vv build/Release/KuiklyUITools.app
```

### Q3: 如何检查应用是否已签名？

```bash
codesign -dv --verbose=4 build/Release/KuiklyUITools.app | grep "Authority="
```

应该看到：
```
Authority=Developer ID Application: Tencent Technology (Shenzhen) Company Limited (88L2Q4487U)
```

### Q4: 公证失败怎么办？

**常见错误**：
1. **Invalid credentials**：检查 App 专用密码是否正确
2. **Invalid certificate**：确保使用 Developer ID Application 证书
3. **Package invalid**：检查应用签名是否有效

**调试**：
```bash
# 查看公证日志
xcrun notarytool log <submission-id> --keychain-profile "notarytool-profile"
```

## 推荐工作流

1. **开发阶段**：使用临时方案（xattr）快速测试
2. **内部分发**：使用 Developer ID Application 证书签名
3. **正式发布**：签名 + 公证

## 快速修复命令

```bash
# 1. 运行诊断脚本
cd PreviewMacApp
./fix_gatekeeper_issue.sh

# 2. 使用输出的证书信息重新构建
CODE_SIGN_IDENTITY="证书哈希或名称" \
ENABLE_CODE_SIGN=true \
USE_PROVISIONING_PROFILE=false \
./build_dmg.sh 1.0.0
```

## 参考资源

- [Apple Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/)
- [Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Gatekeeper and Runtime Protection](https://developer.apple.com/documentation/security/gatekeeper_and_runtime_protection)





