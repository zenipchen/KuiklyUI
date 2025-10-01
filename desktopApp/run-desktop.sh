#!/bin/bash

# Kuikly Desktop 一键启动脚本

echo "========================================="
echo "  Kuikly Desktop 启动脚本"
echo "========================================="
echo ""

# 检查是否在项目根目录
if [ ! -f "settings.gradle.kts" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    echo "   cd /path/to/KuiklyUI && ./desktopApp/run-desktop.sh"
    exit 1
fi

echo "📋 步骤 1/4: 检查必要服务..."

# 检查 dev server (端口 8083)
if ! lsof -i:8083 > /dev/null 2>&1; then
    echo "⚠️  Dev server (8083) 未运行"
    echo "   请在另一个终端运行: npm run serve"
else
    echo "✅ Dev server (8083) 正在运行"
fi

# 检查 h5App (端口 8080)
if ! lsof -i:8080 > /dev/null 2>&1; then
    echo "⚠️  h5App (8080) 未运行"
    echo "   请在另一个终端运行: ./gradlew :h5App:jsBrowserDevelopmentRun -t"
else
    echo "✅ h5App (8080) 正在运行"
fi

echo ""
echo "📋 步骤 2/4: 检查磁盘空间..."
df -h / | tail -1 | awk '{print "   可用空间: " $4}'

AVAIL=$(df -k / | tail -1 | awk '{print $4}')
if [ "$AVAIL" -lt 1048576 ]; then  # 1GB = 1048576 KB
    echo "⚠️  磁盘空间不足 1GB，可能影响 JCEF 下载"
fi

echo ""
echo "📋 步骤 3/4: 清理旧的构建..."
./gradlew :desktopApp:clean --quiet

echo ""
echo "📋 步骤 4/4: 启动桌面应用..."
echo "   首次运行会下载 Chromium (~200MB)，请耐心等待"
echo ""

./gradlew :desktopApp:run

echo ""
echo "========================================="
echo "  应用已退出"
echo "========================================="

