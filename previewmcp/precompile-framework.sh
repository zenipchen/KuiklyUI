#!/bin/bash
#
# Kuikly 框架预编译脚本
# 将 core、compose 等框架模块预编译成 JS，供 demo 使用
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PRECOMPILE_DIR="$PROJECT_ROOT/precompiled-framework"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         Kuikly 框架预编译脚本                                 ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║  项目根目录: $PROJECT_ROOT"
echo "║  预编译输出: $PRECOMPILE_DIR"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# 创建预编译目录
mkdir -p "$PRECOMPILE_DIR"

cd "$PROJECT_ROOT"

# 1. 预编译 core-annotations (基础注解)
echo "[1/5] 预编译 core-annotations..."
./gradlew :core-annotations:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false \
    --parallel --build-cache -q

# 2. 预编译 core (核心模块)
echo "[2/5] 预编译 core..."
./gradlew :core:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false \
    --parallel --build-cache -q

# 3. 预编译 compose (UI 组件)
echo "[3/5] 预编译 compose..."
./gradlew :compose:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false \
    --parallel --build-cache -q

# 4. 预编译 core-render-web:base
echo "[4/5] 预编译 core-render-web:base..."
./gradlew :core-render-web:base:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false \
    --parallel --build-cache -q

# 5. 预编译 core-render-web:h5
echo "[5/5] 预编译 core-render-web:h5..."
./gradlew :core-render-web:h5:jsBrowserDevelopmentWebpack \
    -Pkuikly.useLocalKsp=false \
    --parallel --build-cache -q

# 复制编译产物到预编译目录
echo ""
echo "[复制] 复制编译产物到 $PRECOMPILE_DIR..."

# core-annotations
cp -r core-annotations/build/kotlin-webpack/js/developmentExecutable/* "$PRECOMPILE_DIR/" 2>/dev/null || true

# core
cp -r core/build/kotlin-webpack/js/developmentExecutable/* "$PRECOMPILE_DIR/" 2>/dev/null || true

# compose
cp -r compose/build/kotlin-webpack/js/developmentExecutable/* "$PRECOMPILE_DIR/" 2>/dev/null || true

# core-render-web:base
cp -r core-render-web/base/build/kotlin-webpack/js/developmentExecutable/* "$PRECOMPILE_DIR/" 2>/dev/null || true

# core-render-web:h5
cp -r core-render-web/h5/build/kotlin-webpack/js/developmentExecutable/* "$PRECOMPILE_DIR/" 2>/dev/null || true

# 生成模块清单
cat > "$PRECOMPILE_DIR/manifest.json" << 'EOF'
{
  "version": "2.14.0",
  "modules": [
    "core-annotations",
    "core",
    "compose",
    "core-render-web-base",
    "core-render-web-h5"
  ],
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo ""
echo "✅ 预编译完成!"
echo ""
echo "预编译目录内容:"
ls -lh "$PRECOMPILE_DIR" | grep -E "\.js$|\.json$" | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "使用说明:"
echo "  1. demo/build.gradle.kts 中使用预编译产物"
echo "  2. 修改 server.js 使用预编译的 JS 路径"
