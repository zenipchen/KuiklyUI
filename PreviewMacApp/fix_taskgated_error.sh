#!/bin/bash

# 修复 Taskgated Invalid Signature 错误
# 使用方法: ./fix_taskgated_error.sh [应用路径]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 应用路径（默认 /Applications/KuiklyUITools.app）
APP_PATH="${1:-/Applications/KuiklyUITools.app}"
ENTITLEMENTS="/Users/zhenhuachen/Desktop/KuiklyUISecond/PreviewMacApp/PreviewMacApp/KuiklyUITools.entitlements"

echo -e "${GREEN}=== 修复 Taskgated Invalid Signature 错误 ===${NC}"
echo ""

# 检查应用是否存在
if [ ! -d "$APP_PATH" ]; then
    echo -e "${RED}✗ 应用不存在: $APP_PATH${NC}"
    exit 1
fi

# 检查 entitlements 文件
if [ ! -f "$ENTITLEMENTS" ]; then
    echo -e "${YELLOW}⚠️  Entitlements 文件不存在: $ENTITLEMENTS${NC}"
    echo -e "${YELLOW}   将不使用 entitlements 文件签名${NC}"
    ENTITLEMENTS=""
fi

# 1. 检查当前证书类型
echo -e "${YELLOW}1. 检查当前证书类型...${NC}"
CURRENT_CERT=$(codesign -dvv "$APP_PATH" 2>&1 | grep "^Authority=" | head -1 | sed 's/.*Authority=//')
echo "   当前证书: $CURRENT_CERT"

if echo "$CURRENT_CERT" | grep -q "Developer ID Application"; then
    echo -e "${GREEN}   ✓ 已使用正确的证书类型${NC}"
    echo ""
    echo "   但可能签名有问题，将重新签名..."
elif echo "$CURRENT_CERT" | grep -q "Apple Distribution\|3rd Party Mac Developer"; then
    echo -e "${RED}   ✗ 使用了 App Store 证书，需要更换为 Developer ID Application${NC}"
else
    echo -e "${YELLOW}   ⚠️  未知证书类型${NC}"
fi
echo ""

# 2. 查找 Developer ID 证书
echo -e "${YELLOW}2. 查找 Developer ID Application 证书...${NC}"
DEVELOPER_ID=$(security find-identity -v -p codesigning 2>/dev/null | grep "Developer ID Application" | head -1 | sed 's/.*"\(.*\)".*/\1/')

if [ -z "$DEVELOPER_ID" ]; then
    echo -e "${RED}✗ 未找到 Developer ID Application 证书${NC}"
    echo ""
    echo "请执行以下步骤："
    echo "1. 登录 https://developer.apple.com"
    echo "2. Certificates, Identifiers & Profiles → Certificates"
    echo "3. 点击 '+' 创建新证书"
    echo "4. 选择 'Developer ID Application'"
    echo "5. 下载并安装到 Keychain"
    echo ""
    exit 1
fi

echo -e "${GREEN}   ✓ 找到证书: $DEVELOPER_ID${NC}"
echo ""

# 3. 重新签名
echo -e "${YELLOW}3. 重新签名应用...${NC}"
if [ -n "$ENTITLEMENTS" ]; then
    codesign --force --deep --sign "$DEVELOPER_ID" \
      --entitlements "$ENTITLEMENTS" \
      --options runtime \
      "$APP_PATH"
else
    codesign --force --deep --sign "$DEVELOPER_ID" \
      --options runtime \
      "$APP_PATH"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ 签名失败${NC}"
    exit 1
fi

echo -e "${GREEN}   ✓ 签名成功${NC}"
echo ""

# 4. 验证签名
echo -e "${YELLOW}4. 验证签名...${NC}"
VERIFY_OUTPUT=$(codesign --verify --deep --strict --verbose=2 "$APP_PATH" 2>&1)
if echo "$VERIFY_OUTPUT" | grep -q "valid on disk"; then
    echo -e "${GREEN}   ✓ 签名验证通过${NC}"
else
    echo -e "${RED}   ✗ 签名验证失败:${NC}"
    echo "$VERIFY_OUTPUT"
    exit 1
fi
echo ""

# 5. 验证 Taskgated
echo -e "${YELLOW}5. 验证 Taskgated...${NC}"
SPCTL_OUTPUT=$(spctl --assess --verbose --type execute "$APP_PATH" 2>&1)
echo "   $SPCTL_OUTPUT"

if echo "$SPCTL_OUTPUT" | grep -q "accepted"; then
    echo -e "${GREEN}   ✓ Taskgated 已接受应用${NC}"
    TASKGATED_OK=true
else
    echo -e "${YELLOW}   ⚠️  Taskgated 状态: $SPCTL_OUTPUT${NC}"
    TASKGATED_OK=false
fi
echo ""

# 6. 移除隔离属性（如果存在）
echo -e "${YELLOW}6. 检查隔离属性...${NC}"
if xattr -l "$APP_PATH" 2>/dev/null | grep -q "quarantine"; then
    echo "   发现隔离属性，正在移除..."
    xattr -cr "$APP_PATH"
    echo -e "${GREEN}   ✓ 隔离属性已移除${NC}"
else
    echo -e "${GREEN}   ✓ 无隔离属性${NC}"
fi
echo ""

# 7. 显示最终状态
echo -e "${GREEN}=== 修复完成 ===${NC}"
echo ""
echo "应用信息:"
echo "  路径: $APP_PATH"
echo "  证书: $(codesign -dvv "$APP_PATH" 2>&1 | grep '^Authority=' | head -1 | sed 's/.*Authority=//')"
echo ""

if [ "$TASKGATED_OK" = true ]; then
    echo -e "${GREEN}✓ 应用已修复，可以正常启动${NC}"
    echo ""
    echo "可以尝试启动应用:"
    echo "  open \"$APP_PATH\""
    echo ""
    echo "或通过 Finder 双击启动"
else
    echo -e "${YELLOW}⚠️  签名已更新，但 Taskgated 状态需要进一步检查${NC}"
    echo ""
    echo "如果仍然无法启动，请检查:"
    echo "1. 证书是否已正确安装到 Keychain"
    echo "2. 是否有其他安全设置阻止运行"
    echo "3. 查看最新的崩溃报告:"
    echo "   ls -lt ~/Library/Logs/DiagnosticReports/KuiklyUITools-*.ips | head -1"
fi





