# DMG 代码签名指南

## 问题：DMG 在其他 Mac 上显示"已损坏"

这是 macOS Gatekeeper 安全机制导致的。未签名的应用会被系统拦截。

## 解决方案

### 方案一：使用企业证书签名（推荐）

#### 1. 查找你的证书名称

```bash
# 查看所有可用的代码签名证书
security find-identity -v -p codesigning
```

查找类似这样的证书：
- `Developer ID Application: Your Company Name (TEAM_ID)`
- `Apple Development: Your Name (TEAM_ID)`

#### 2. 使用签名构建 DMG

```bash
# 方式1: 使用环境变量
CODE_SIGN_IDENTITY="Developer ID Application: Tencent Technology (Shenzhen) Company Limited" \
ENABLE_CODE_SIGN=true \
./build_dmg.sh 1.0.0

# 方式2: 导出环境变量后执行
export CODE_SIGN_IDENTITY="Developer ID Application: Your Company"
export ENABLE_CODE_SIGN=true
./build_dmg.sh 1.0.0
```

#### 3. 验证签名

构建完成后，脚本会自动验证签名。你也可以手动验证：

```bash
codesign -dv --verbose=4 build/Release/KuiklyUITools.app
spctl -a -vv build/Release/KuiklyUITools.app
```

### 方案二：临时解决方案（仅用于测试）

如果暂时无法签名，可以在其他 Mac 上执行以下命令来绕过 Gatekeeper：

#### 方法 A：移除隔离属性（推荐）

```bash
# 在接收 DMG 的 Mac 上执行
xattr -cr /path/to/KuiklyUITools.app
```

或者对于整个 DMG：

```bash
xattr -cr /path/to/KuiklyUITools-1.0.0.dmg
```

#### 方法 B：临时禁用 Gatekeeper（不推荐，有安全风险）

```bash
# 临时禁用（需要管理员权限）
sudo spctl --master-disable

# 使用完后重新启用
sudo spctl --master-enable
```

#### 方法 C：右键打开（一次性）

1. 右键点击应用
2. 选择"打开"
3. 在弹出对话框中点击"打开"

### 方案三：进行公证（Notarization）- 最完整方案

对于正式发布，建议进行 Apple 公证：

```bash
# 1. 签名应用
CODE_SIGN_IDENTITY="Developer ID Application: Your Company" \
ENABLE_CODE_SIGN=true \
./build_dmg.sh 1.0.0

# 2. 提交公证（需要 App Store Connect API Key）
xcrun notarytool submit build/KuiklyUITools-1.0.0.dmg \
    --apple-id your@email.com \
    --team-id YOUR_TEAM_ID \
    --password YOUR_APP_SPECIFIC_PASSWORD \
    --wait

# 3. 装订票据（可选，用于离线验证）
xcrun stapler staple build/KuiklyUITools-1.0.0.dmg
```

## 常见问题

### Q1: 如何查找证书名称？

```bash
security find-identity -v -p codesigning | grep "Developer ID"
```

### Q2: 签名失败，提示找不到证书？

确保：
1. 证书已安装到钥匙串中
2. 证书名称完全匹配（包括空格和标点）
3. 证书未过期

### Q3: 签名后仍然显示"已损坏"？

可能原因：
1. 证书不是 "Developer ID" 类型（需要企业分发证书）
2. 需要公证（macOS 10.15+ 要求）
3. 描述文件不匹配

### Q4: 如何检查应用的签名状态？

```bash
# 检查签名
codesign -dv --verbose=4 KuiklyUITools.app

# 检查 Gatekeeper 状态
spctl -a -vv KuiklyUITools.app

# 检查隔离属性
xattr -l KuiklyUITools.app
```

## 推荐工作流

1. **开发阶段**: 使用临时方案（xattr）快速测试
2. **内部分发**: 使用企业证书签名
3. **正式发布**: 签名 + 公证

## 参考资源

- [Apple Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/)
- [Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Gatekeeper and Runtime Protection](https://developer.apple.com/documentation/security/gatekeeper_and_runtime_protection)






