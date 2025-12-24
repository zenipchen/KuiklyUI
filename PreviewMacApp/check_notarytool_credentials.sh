#!/bin/bash

# 检查 notarytool 凭证配置脚本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 检查 notarytool 凭证配置 ===${NC}"
echo ""

# 方法 1: 尝试使用一个测试 profile 名称来验证
echo -e "${YELLOW}方法 1: 检查 keychain 中的凭证...${NC}"

# 检查常见的 profile 名称
PROFILES=("notarytool-profile" "notarytool" "default" "AC_PASSWORD")

FOUND_PROFILE=""
for profile in "${PROFILES[@]}"; do
    # 尝试查找 keychain 中的凭证
    if security find-generic-password -s "AC_PASSWORD" -a "$profile" -g 2>&1 | grep -q "password:"; then
        FOUND_PROFILE="$profile"
        echo -e "  ${GREEN}✓ 找到凭证配置: ${profile}${NC}"
        break
    fi
done

if [ -z "$FOUND_PROFILE" ]; then
    # 尝试查找所有可能的 notarytool 相关凭证
    echo -e "  ${YELLOW}搜索所有可能的凭证配置...${NC}"
    
    # 查找 keychain 中所有包含 "notary" 的条目
    KEYCHAIN_RESULTS=$(security dump-keychain login.keychain 2>/dev/null | grep -i "notary\|AC_PASSWORD" | head -5 || true)
    
    if [ -n "$KEYCHAIN_RESULTS" ]; then
        echo -e "  ${GREEN}✓ 找到可能的凭证条目:${NC}"
        echo "$KEYCHAIN_RESULTS" | sed 's/^/    /'
    else
        echo -e "  ${RED}✗ 未找到 notarytool 凭证配置${NC}"
    fi
fi

echo ""

# 方法 2: 尝试使用 notarytool 验证（需要提供 profile 名称）
echo -e "${YELLOW}方法 2: 测试凭证是否可用...${NC}"

# 提示用户输入 profile 名称进行测试
echo -e "  请输入你的 notarytool profile 名称（如果已配置）:"
read -p "  Profile 名称（留空跳过）: " TEST_PROFILE

if [ -n "$TEST_PROFILE" ]; then
    echo -e "  ${YELLOW}测试凭证: ${TEST_PROFILE}...${NC}"
    
    # 尝试使用 notarytool 验证凭证（不实际提交，只检查凭证是否有效）
    # 注意：notarytool 没有直接的验证命令，但我们可以尝试一个无害的操作
    TEST_OUTPUT=$(xcrun notarytool store-credentials "$TEST_PROFILE" --validate 2>&1 || true)
    
    if echo "$TEST_OUTPUT" | grep -q "already exists\|saved\|validated"; then
        echo -e "  ${GREEN}✓ 凭证配置存在且有效${NC}"
    else
        echo -e "  ${YELLOW}⚠️  无法验证凭证，可能需要重新配置${NC}"
        echo -e "  输出: $TEST_OUTPUT"
    fi
else
    echo -e "  ${YELLOW}跳过测试（未提供 profile 名称）${NC}"
fi

echo ""

# 方法 3: 检查代码签名证书
echo -e "${YELLOW}方法 3: 检查代码签名证书...${NC}"
echo -e "  检查是否有 Developer ID Application 证书（公证必需）:"

CERTIFICATES=$(security find-identity -v -p codesigning 2>/dev/null | grep "Developer ID Application" || true)

if [ -n "$CERTIFICATES" ]; then
    echo -e "  ${GREEN}✓ 找到 Developer ID Application 证书:${NC}"
    echo "$CERTIFICATES" | sed 's/^/    /'
else
    echo -e "  ${RED}✗ 未找到 Developer ID Application 证书${NC}"
    echo -e "  ${YELLOW}提示: 公证需要使用 Developer ID Application 证书${NC}"
fi

echo ""

# 总结和建议
echo -e "${BLUE}=== 总结 ===${NC}"

if [ -z "$FOUND_PROFILE" ] && [ -z "$TEST_PROFILE" ]; then
    echo -e "${YELLOW}⚠️  未找到 notarytool 凭证配置${NC}"
    echo ""
    echo -e "${YELLOW}配置凭证的方法:${NC}"
    echo ""
    echo -e "${GREEN}方法 1: 使用 App 专用密码（推荐）${NC}"
    echo -e "  执行以下命令并按照提示操作:"
    echo -e "  ${BLUE}xcrun notarytool store-credentials \"notarytool-profile\" \\${NC}"
    echo -e "  ${BLUE}    --apple-id \"your@email.com\" \\${NC}"
    echo -e "  ${BLUE}    --team-id \"88L2Q4487U\" \\${NC}"
    echo -e "  ${BLUE}    --password \"your-app-specific-password\"${NC}"
    echo ""
    echo -e "${GREEN}方法 2: 使用 App Store Connect API Key${NC}"
    echo -e "  ${BLUE}xcrun notarytool store-credentials \"notarytool-profile\" \\${NC}"
    echo -e "  ${BLUE}    --key \"path/to/AuthKey_XXXXXXXXXX.p8\" \\${NC}"
    echo -e "  ${BLUE}    --key-id \"XXXXXXXXXX\" \\${NC}"
    echo -e "  ${BLUE}    --issuer \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"${NC}"
    echo ""
    echo -e "${YELLOW}获取 App 专用密码:${NC}"
    echo -e "  1. 访问 https://appleid.apple.com"
    echo -e "  2. 登录你的 Apple ID"
    echo -e "  3. 在「安全」部分找到「App 专用密码」"
    echo -e "  4. 生成新的 App 专用密码"
    echo ""
    echo -e "${YELLOW}配置完成后，使用以下命令构建并公证:${NC}"
    echo -e "  ${BLUE}NOTARYTOOL_PROFILE=\"notarytool-profile\" ENABLE_NOTARIZATION=true \\${NC}"
    echo -e "  ${BLUE}CODE_SIGN_IDENTITY=\"Developer ID Application: Your Company\" \\${NC}"
    echo -e "  ${BLUE}ENABLE_CODE_SIGN=true ./build_dmg.sh 1.0.0${NC}"
else
    echo -e "${GREEN}✓ 找到凭证配置${NC}"
    echo -e "  可以在 build_dmg.sh 中使用:"
    echo -e "  ${BLUE}NOTARYTOOL_PROFILE=\"${FOUND_PROFILE:-$TEST_PROFILE}\" ENABLE_NOTARIZATION=true ./build_dmg.sh${NC}"
fi

echo ""


