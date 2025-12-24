#!/bin/bash

# 构建失败诊断脚本
# 使用方法: ./diagnose_build_failure.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")"

echo -e "${GREEN}=== 构建失败诊断工具 ===${NC}"
echo ""

# 1. 检查环境
echo -e "${YELLOW}1. 检查构建环境...${NC}"
echo "  Xcode 版本:"
xcodebuild -version 2>&1 | sed 's/^/    /'
echo ""
echo "  macOS 版本:"
sw_vers | sed 's/^/    /'
echo ""
echo "  系统架构: $(uname -m)"
echo ""

# 2. 检查项目文件
echo -e "${YELLOW}2. 检查项目文件...${NC}"
if [ ! -f "PreviewMacApp.xcworkspace/contents.xcworkspacedata" ]; then
    echo -e "  ${RED}✗ PreviewMacApp.xcworkspace 不存在${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓ 工作空间文件存在${NC}"

if [ ! -d "Pods" ]; then
    echo -e "  ${YELLOW}⚠️  Pods 目录不存在，需要运行 pod install${NC}"
else
    echo -e "  ${GREEN}✓ Pods 目录存在${NC}"
fi
echo ""

# 3. 执行构建并捕获详细错误
echo -e "${YELLOW}3. 执行构建并捕获详细错误...${NC}"
echo "  这可能需要几分钟..."
echo ""

BUILD_LOG="build_failure_diagnostic.log"
rm -f "$BUILD_LOG"

# 清理之前的构建
rm -rf build/DerivedData

# 执行构建
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build 2>&1 | tee "$BUILD_LOG" || BUILD_FAILED=true

echo ""

# 4. 分析错误
if [ "$BUILD_FAILED" = "true" ]; then
    echo -e "${RED}=== 构建失败分析 ===${NC}"
    echo ""
    
    # 提取错误信息
    echo -e "${YELLOW}4.1 编译错误:${NC}"
    ERRORS=$(grep -A 10 "error:" "$BUILD_LOG" | head -50 || true)
    if [ -n "$ERRORS" ]; then
        echo "$ERRORS" | sed 's/^/    /'
    else
        echo "    未找到明确的 error: 关键字"
    fi
    echo ""
    
    # 提取失败的命令
    echo -e "${YELLOW}4.2 失败的命令:${NC}"
    FAILED_COMMANDS=$(grep -B 5 "BUILD FAILED\|failed\|error:" "$BUILD_LOG" | tail -30 || true)
    if [ -n "$FAILED_COMMANDS" ]; then
        echo "$FAILED_COMMANDS" | sed 's/^/    /'
    else
        echo "    未找到失败命令"
    fi
    echo ""
    
    # 检查架构相关错误
    echo -e "${YELLOW}4.3 架构相关检查:${NC}"
    ARCH_ERRORS=$(grep -i "arch\|x86_64\|arm64\|architecture" "$BUILD_LOG" | grep -i "error\|fail" | head -10 || true)
    if [ -n "$ARCH_ERRORS" ]; then
        echo "$ARCH_ERRORS" | sed 's/^/    /'
    else
        echo "    未发现架构相关错误"
    fi
    echo ""
    
    # 检查链接错误
    echo -e "${YELLOW}4.4 链接错误:${NC}"
    LINK_ERRORS=$(grep -i "link\|undefined\|symbol\|framework" "$BUILD_LOG" | grep -i "error\|fail" | head -10 || true)
    if [ -n "$LINK_ERRORS" ]; then
        echo "$LINK_ERRORS" | sed 's/^/    /'
    else
        echo "    未发现链接错误"
    fi
    echo ""
    
    # 检查 Pod 相关错误
    echo -e "${YELLOW}4.5 Pod 依赖错误:${NC}"
    POD_ERRORS=$(grep -i "pod\|cocoapods" "$BUILD_LOG" | grep -i "error\|fail" | head -10 || true)
    if [ -n "$POD_ERRORS" ]; then
        echo "$POD_ERRORS" | sed 's/^/    /'
    else
        echo "    未发现 Pod 相关错误"
    fi
    echo ""
    
    # 检查签名错误
    echo -e "${YELLOW}4.6 代码签名错误:${NC}"
    SIGN_ERRORS=$(grep -i "sign\|certificate\|provisioning" "$BUILD_LOG" | grep -i "error\|fail" | head -10 || true)
    if [ -n "$SIGN_ERRORS" ]; then
        echo "$SIGN_ERRORS" | sed 's/^/    /'
    else
        echo "    未发现签名错误"
    fi
    echo ""
    
    # 显示最后 50 行日志
    echo -e "${YELLOW}4.7 最后 50 行构建日志:${NC}"
    tail -50 "$BUILD_LOG" | sed 's/^/    /'
    echo ""
    
    echo -e "${RED}=== 诊断完成 ===${NC}"
    echo ""
    echo "完整日志已保存到: $BUILD_LOG"
    echo ""
    echo -e "${YELLOW}建议的排查步骤:${NC}"
    echo "1. 查看完整日志: cat $BUILD_LOG | grep -A 20 'error:'"
    echo "2. 检查特定文件编译: 查看日志中失败的文件"
    echo "3. 尝试单独构建: xcodebuild -workspace PreviewMacApp.xcworkspace -scheme KuiklyUITools -configuration Release -target <target-name>"
    echo "4. 检查 Pod 依赖: pod install --repo-update"
    echo "5. 清理并重建: rm -rf build Pods Podfile.lock && pod install && xcodebuild clean build"
    
else
    echo -e "${GREEN}✓ 构建成功！${NC}"
    rm -f "$BUILD_LOG"
fi





