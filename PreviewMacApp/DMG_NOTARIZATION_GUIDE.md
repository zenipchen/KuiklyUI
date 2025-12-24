# DMG 公证（Notarization）完整指南

## 前置条件

### 1. 确认证书类型
**必须使用 `Developer ID Application` 证书签名，不能使用 `3rd Party Mac Developer Application`**

```bash
# 检查应用签名
codesign -dv --verbose=4 your_app.app | grep "Authority="

# 应该看到类似：
# Authority=Developer ID Application: Your Company Name (TEAM_ID)
```

### 2. 确认应用已正确签名
```bash
# 验证签名
codesign --verify --deep --strict --verbose=2 your_app.app

# 如果看到错误，需要先修复签名问题
```

### 3. 准备 App 专用密码
1. 登录 [Apple ID 账户页面](https://appleid.apple.com)
2. 进入"安全" → "App 专用密码"
3. 生成新的 App 专用密码（用于公证）
4. 保存密码（只显示一次）

### 4. 获取 Team ID
```bash
# 从证书信息中获取
codesign -dv --verbose=4 your_app.app | grep "TeamIdentifier="

# 或从 Apple Developer 账户中查看
```

## 方法一：使用 notarytool（推荐，Xcode 13+）

### 步骤 1：存储凭证（可选，但推荐）

```bash
xcrun notarytool store-credentials "notarytool-profile" \
  --apple-id "your@email.com" \
  --team-id "88L2Q4487U" \
  --password "your-app-specific-password"
```

**说明：**
- `notarytool-profile` 是凭证配置名称，可以自定义
- `your@email.com` 是你的 Apple ID 邮箱
- `88L2Q4487U` 是你的 Team ID
- `your-app-specific-password` 是 App 专用密码

### 步骤 2：提交 DMG 进行公证

#### 方式 A：使用存储的凭证（推荐）

```bash
xcrun notarytool submit /path/to/your_app.dmg \
  --keychain-profile "notarytool-profile" \
  --wait
```

#### 方式 B：直接提供凭证

```bash
xcrun notarytool submit /path/to/your_app.dmg \
  --apple-id "your@email.com" \
  --team-id "88L2Q4487U" \
  --password "your-app-specific-password" \
  --wait
```

**参数说明：**
- `--wait`: 等待公证完成（推荐使用）
- 不加 `--wait` 会立即返回，需要手动查询状态

### 步骤 3：检查公证状态（如果未使用 --wait）

```bash
# 获取提交 ID（从步骤 2 的输出中获取）
SUBMISSION_ID="your-submission-id"

# 查询状态
xcrun notarytool info $SUBMISSION_ID \
  --keychain-profile "notarytool-profile"
```

### 步骤 4：装订公证票据

公证成功后，装订票据到 DMG：

```bash
xcrun stapler staple /path/to/your_app.dmg
```

### 步骤 5：验证公证结果

```bash
# 验证装订状态
xcrun stapler validate /path/to/your_app.dmg

# 验证 Gatekeeper 状态
spctl -a -t open --context context:primary-signature -v /path/to/your_app.dmg
```

## 方法二：使用 altool（旧方法，Xcode 12 及以下）

> ⚠️ 注意：`altool` 已在 Xcode 14.5 中弃用，建议使用 `notarytool`

```bash
# 提交公证
xcrun altool --notarize-app \
  --primary-bundle-id "com.tencent.kuikly.kuikly-ui-tools" \
  --username "your@email.com" \
  --password "your-app-specific-password" \
  --file /path/to/your_app.dmg

# 查询状态（使用返回的 UUID）
xcrun altool --notarization-info <UUID> \
  --username "your@email.com" \
  --password "your-app-specific-password"

# 装订票据
xcrun stapler staple /path/to/your_app.dmg
```

## 完整示例

### 示例 1：使用存储的凭证

```bash
# 1. 存储凭证（只需执行一次）
xcrun notarytool store-credentials "kuikly-notary" \
  --apple-id "your@email.com" \
  --team-id "88L2Q4487U" \
  --password "abcd-efgh-ijkl-mnop"

# 2. 提交公证
xcrun notarytool submit build/KuiklyUITools-1.0.0.dmg \
  --keychain-profile "kuikly-notary" \
  --wait

# 3. 装订票据
xcrun stapler staple build/KuiklyUITools-1.0.0.dmg

# 4. 验证
xcrun stapler validate build/KuiklyUITools-1.0.0.dmg
```

### 示例 2：直接提供凭证

```bash
# 提交公证（一次性命令）
xcrun notarytool submit build/KuiklyUITools-1.0.0.dmg \
  --apple-id "your@email.com" \
  --team-id "88L2Q4487U" \
  --password "your-app-specific-password" \
  --wait

# 装订票据
xcrun stapler staple build/KuiklyUITools-1.0.0.dmg

# 验证
xcrun stapler validate build/KuiklyUITools-1.0.0.dmg
```

## 常见问题

### Q1: 公证失败，提示 "Invalid signature"

**原因：** 应用签名有问题或使用了错误的证书类型

**解决：**
```bash
# 检查签名
codesign --verify --deep --strict --verbose=2 your_app.app

# 确保使用 Developer ID Application 证书
codesign -dv --verbose=4 your_app.app | grep "Authority="
```

### Q2: 公证失败，提示 "Hardened Runtime is not enabled"

**原因：** 应用未启用 Hardened Runtime

**解决：**
1. 在 Xcode 中启用 Hardened Runtime
2. 或在签名时添加 `--options runtime`：
```bash
codesign --force --deep --sign "Developer ID Application: ..." \
  --options runtime \
  your_app.app
```

### Q3: 如何查看详细的公证日志？

```bash
# 获取提交 ID
SUBMISSION_ID="your-submission-id"

# 查看日志
xcrun notarytool log $SUBMISSION_ID \
  --keychain-profile "notarytool-profile"
```

### Q4: 公证需要多长时间？

- 通常需要 5-30 分钟
- 使用 `--wait` 参数会自动等待完成
- 可以在 Apple Developer 后台查看进度

### Q5: 公证后仍然被 Gatekeeper 拒绝？

**检查：**
1. 是否装订了票据：`xcrun stapler validate your_app.dmg`
2. 是否使用了 Developer ID 证书
3. 签名是否有效：`codesign --verify your_app.app`

## 自动化脚本

可以将公证步骤集成到 `build_dmg.sh` 中：

```bash
# 在 build_dmg.sh 末尾添加
if [ "$ENABLE_NOTARIZATION" = "true" ]; then
    echo -e "${YELLOW}=== 提交公证 ===${NC}"
    xcrun notarytool submit "${DMG_PATH}" \
        --keychain-profile "notarytool-profile" \
        --wait
    
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}=== 装订票据 ===${NC}"
        xcrun stapler staple "${DMG_PATH}"
        echo -e "${GREEN}✓ 公证完成${NC}"
    else
        echo -e "${RED}✗ 公证失败${NC}"
    fi
fi
```

## 参考资源

- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [notarytool 文档](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Troubleshooting Notarization](https://developer.apple.com/help/account/notarize-your-mac-software-for-macos)





