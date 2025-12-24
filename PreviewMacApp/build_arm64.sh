#!/bin/bash

# 快速构建 arm64 版本的脚本
# 使用方法: ./build_arm64.sh

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

APP_NAME="KuiklyUITools"
BUILD_DIR="build"

echo -e "${GREEN}=== 构建 arm64 版本 ===${NC}"
echo ""

# 检查 CocoaPods 依赖
if [ ! -d "Pods" ]; then
    echo -e "${YELLOW}安装 CocoaPods 依赖...${NC}"
    pod install
fi

# 构建 arm64 版本
echo -e "${YELLOW}构建 Release 版本 (arm64)...${NC}"

xcodebuild -workspace PreviewMacApp.xcworkspace \
  -scheme "${APP_NAME}" \
  -configuration Release \
  -arch arm64 \
  ONLY_ACTIVE_ARCH=NO \
  -derivedDataPath "${BUILD_DIR}/DerivedData" \
  clean build

# 查找构建的应用
DERIVED_APP_PATH="${BUILD_DIR}/DerivedData/Build/Products/Release/${APP_NAME}.app"

if [ -d "${DERIVED_APP_PATH}" ]; then
    echo ""
    echo -e "${GREEN}✓ 构建成功！${NC}"
    echo -e "${GREEN}应用位置: ${DERIVED_APP_PATH}${NC}"
    echo ""
    
    # 验证架构
    EXECUTABLE="${DERIVED_APP_PATH}/Contents/MacOS/${APP_NAME}"
    if [ -f "$EXECUTABLE" ]; then
        echo "架构信息:"
        file "$EXECUTABLE"
        echo ""
        echo "可以使用以下命令验证:"
        echo "  lipo -info \"$EXECUTABLE\""
    fi
else
    echo -e "${YELLOW}⚠️  未找到构建的应用，请检查构建日志${NC}"
    exit 1
fi
