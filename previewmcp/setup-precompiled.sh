#!/bin/bash
#
# 预编译框架设置脚本
# 使用方法: ./setup-precompiled.sh
#

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PRECOMPILE_DIR="$PROJECT_ROOT/precompiled"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      Kuikly 预编译框架设置                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$PROJECT_ROOT"

# 步骤1: 创建预编译目录
echo "[1/3] 创建预编译目录..."
mkdir -p "$PRECOMPILE_DIR"

# 步骤2: 完整编译所有框架模块 (一次性)
echo "[2/3] 编译框架模块 (这可能需要几分钟)..."
echo "      编译 core-annotations..."
./gradlew :core-annotations:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false --parallel --build-cache -q

echo "      编译 core..."
./gradlew :core:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false --parallel --build-cache -q

echo "      编译 compose..."
./gradlew :compose:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false --parallel --build-cache -q

echo "      编译 core-render-web..."
./gradlew :core-render-web:base:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false --parallel --build-cache -q
./gradlew :core-render-web:h5:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false --parallel --build-cache -q

# 步骤3: 保存编译缓存状态
echo "[3/3] 保存编译缓存状态..."
touch "$PRECOMPILE_DIR/.precompiled"
date > "$PRECOMPILE_DIR/timestamp.txt"

echo ""
echo "✅ 预编译完成!"
echo ""
echo "后续使用:"
echo "  1. 运行 server.js (Continuous Build 模式)"
echo "  2. 所有框架模块已缓存，只编译用户代码"
echo "  3. 预期编译时间: ~10-14秒"
echo ""
echo "清理缓存:"
echo "  rm -rf precompiled/"
echo "  ./gradlew clean"
