#!/bin/bash

# 测试预览配置编辑器功能
# 测试 updatePreviewConfig 和配置编辑界面

set -e

echo "=========================================="
echo "🧪 测试预览配置编辑器功能"
echo "=========================================="
echo ""

# 检查 PreviewMacApp 是否运行
echo "📋 步骤 1: 检查 PreviewMacApp 是否运行..."
if ! curl -s http://localhost:9527/ping > /dev/null 2>&1; then
    echo "⚠️  PreviewMacApp 未运行，请先启动 PreviewMacApp"
    echo "   运行方式: cd PreviewMacApp && open PreviewMacApp.xcworkspace"
    echo "   或者在终端运行: ./run_preview_mac.sh"
    exit 1
fi
echo "✅ PreviewMacApp 正在运行"
echo ""

# 编译项目
echo "📋 步骤 2: 编译项目..."
cd "$(dirname "$0")"
./gradlew :desktopAppWithMacRender:compileKotlinJvm --quiet
echo "✅ 编译完成"
echo ""

# 运行测试
echo "📋 步骤 3: 启动预览窗口（带配置编辑器）..."
echo ""
echo "💡 测试说明:"
echo "   1. 预览窗口右侧会显示配置编辑面板"
echo "   2. 可以修改所有预览配置参数（宽高、密度、方向等）"
echo "   3. 点击'应用配置'按钮应用更改"
echo "   4. 配置会实时更新到 PreviewMacApp 的预览视图"
echo ""
echo "🚀 正在启动..."
echo ""

./gradlew :desktopAppWithMacRender:testPreviewConfig --quiet

