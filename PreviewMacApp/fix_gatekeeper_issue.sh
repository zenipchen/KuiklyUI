#!/bin/bash

# 修复 Gatekeeper 问题的脚本
# 使用方法: ./fix_gatekeeper_issue.sh

set -e

echo "=== 修复 Gatekeeper 问题 ==="
echo ""

# 1. 查找可用的 Developer ID Application 证书
echo "1. 查找可用的 Developer ID Application 证书..."
echo "----------------------------------------"
DEVELOPER_ID_CERTS=$(security find-identity -v -p codesigning 2>/dev/null | grep "Developer ID Application" || true)

if [ -z "$DEVELOPER_ID_CERTS" ]; then
    echo "❌ 未找到 Developer ID Application 证书"
    echo ""
    echo "请确保："
    echo "  1. 已登录 Apple Developer Portal"
    echo "  2. 已创建 Developer ID Application 证书"
    echo "  3. 证书已下载并安装到钥匙串"
    echo ""
    echo "查看所有证书："
    security find-identity -v -p codesigning
    exit 1
fi

echo "$DEVELOPER_ID_CERTS"
echo ""

# 2. 提取证书名称（使用第一个找到的）
CERT_NAME=$(echo "$DEVELOPER_ID_CERTS" | head -1 | sed 's/.*"\(.*\)".*/\1/')
CERT_HASH=$(echo "$DEVELOPER_ID_CERTS" | head -1 | awk '{print $2}')

echo "2. 选择的证书："
echo "   哈希: $CERT_HASH"
echo "   名称: $CERT_NAME"
echo ""

# 3. 生成构建命令
echo "3. 构建命令："
echo "----------------------------------------"
echo ""
echo "使用以下命令重新构建 DMG（带代码签名）："
echo ""
echo "CODE_SIGN_IDENTITY=\"$CERT_HASH\" \\"
echo "ENABLE_CODE_SIGN=true \\"
echo "USE_PROVISIONING_PROFILE=false \\"
echo "./build_dmg.sh 1.0.0"
echo ""
echo "或者使用证书名称（如果哈希不工作）："
echo ""
echo "CODE_SIGN_IDENTITY=\"$CERT_NAME\" \\"
echo "ENABLE_CODE_SIGN=true \\"
echo "USE_PROVISIONING_PROFILE=false \\"
echo "./build_dmg.sh 1.0.0"
echo ""

# 4. 可选：公证配置
echo "4. 可选：配置公证（Notarization）"
echo "----------------------------------------"
echo ""
echo "如果需要公证（推荐用于正式发布），添加："
echo ""
echo "ENABLE_NOTARIZATION=true \\"
echo "APPLE_ID=\"your@email.com\" \\"
echo "APP_SPECIFIC_PASSWORD=\"your-app-specific-password\" \\"
echo "CODE_SIGN_IDENTITY=\"$CERT_HASH\" \\"
echo "ENABLE_CODE_SIGN=true \\"
echo "USE_PROVISIONING_PROFILE=false \\"
echo "./build_dmg.sh 1.0.0"
echo ""
echo "注意：需要 App 专用密码（从 appleid.apple.com 生成）"
echo ""

# 5. 临时解决方案（如果无法签名）
echo "5. 临时解决方案（仅用于测试）"
echo "----------------------------------------"
echo ""
echo "如果暂时无法签名，可以在目标 Mac 上执行："
echo ""
echo "  # 移除隔离属性"
echo "  xattr -cr /path/to/KuiklyUITools.app"
echo ""
echo "  # 或者右键点击应用 → 选择'打开'"
echo ""





