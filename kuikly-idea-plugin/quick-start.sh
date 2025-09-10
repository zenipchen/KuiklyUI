#!/bin/bash

# Kuikly IDEA Plugin 快速开始脚本

set -e

echo "🚀 Kuikly IDEA Plugin - 快速开始"
echo "================================"
echo ""

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到 Java"
    echo "请先安装 Java 17 或更高版本"
    exit 1
fi

echo "✅ Java 版本:"
java -version
echo ""

# 步骤 1: 构建 h5App
echo "📦 步骤 1/3: 构建 h5App..."
cd ..
if [ ! -f "h5App/build/dist/js/developmentExecutable/h5App.js" ]; then
    echo "正在构建 h5App (首次构建可能需要 1-2 分钟)..."
    ./gradlew :h5App:jsBrowserDevelopmentWebpack
    echo "✅ h5App 构建完成"
else
    echo "✅ h5App 已构建"
fi
echo ""

# 步骤 2: 构建 Plugin
echo "🔨 步骤 2/3: 构建 Plugin..."
cd kuikly-idea-plugin
./gradlew buildPlugin
echo "✅ Plugin 构建完成"
echo ""

# 步骤 3: 显示安装说明
echo "📋 步骤 3/3: 安装 Plugin"
echo "================================"
echo ""
echo "Plugin 已构建成功！"
echo ""
echo "📦 构建产物:"
echo "  $(pwd)/build/distributions/kuikly-idea-plugin-1.0.0.zip"
echo ""
echo "📖 安装步骤:"
echo "  1. 打开 IntelliJ IDEA"
echo "  2. File -> Settings -> Plugins"
echo "  3. 点击 ⚙️ -> Install Plugin from Disk..."
echo "  4. 选择上述 zip 文件"
echo "  5. 重启 IDEA"
echo ""
echo "🎉 然后就可以使用了："
echo "  View -> Tool Windows -> Kuikly Preview"
echo ""
echo "📚 详细文档:"
echo "  - README.md - 快速开始"
echo "  - USAGE.md - 完整使用手册"
echo ""
echo "✨ 祝您使用愉快！"

