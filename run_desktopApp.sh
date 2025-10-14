#!/bin/bash

echo "🚀 启动 Kuikly Desktop 多窗口应用"
echo "================================="

# 构建桌面渲染层
echo "📦 构建桌面渲染层..."
./gradlew :desktop-render-layer:build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 启动应用（会显示两个窗口）
echo "🔄 启动多窗口应用..."
./gradlew :desktopApp:jvmRun -DmainClass=com.tencent.kuikly.desktop.MainKt --quiet --rerun-tasks