#!/bin/bash

# 获取详细构建错误的脚本
# 使用方法: ./get_detailed_build_error.sh

set -e

cd "$(dirname "$0")"

echo "=== 获取详细构建错误 ==="
echo ""

# 清理之前的构建
echo "清理之前的构建..."
rm -rf build/DerivedData

# 构建并捕获所有输出
echo "开始构建并捕获详细错误..."
echo ""

BUILD_LOG="build_error_detailed.log"

xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build 2>&1 | tee "$BUILD_LOG" || BUILD_FAILED=true

echo ""
echo "=== 错误分析 ==="
echo ""

if [ "$BUILD_FAILED" = "true" ]; then
    # 提取所有错误
    echo "1. 所有编译错误:"
    echo "----------------------------------------"
    grep -B 5 -A 15 "error:" "$BUILD_LOG" | head -100 || echo "未找到 error: 关键字"
    echo ""
    
    # 提取失败的命令
    echo "2. 失败的命令:"
    echo "----------------------------------------"
    grep -B 10 "BUILD FAILED\|failed\|error:" "$BUILD_LOG" | tail -50 || echo "未找到失败命令"
    echo ""
    
    # 检查架构相关
    echo "3. 架构相关警告/错误:"
    echo "----------------------------------------"
    grep -i "arch\|x86_64\|arm64\|architecture" "$BUILD_LOG" | grep -i "warning\|error" | head -20 || echo "未发现架构相关问题"
    echo ""
    
    # 检查链接错误
    echo "4. 链接相关错误:"
    echo "----------------------------------------"
    grep -i "link\|undefined\|symbol\|framework\|library" "$BUILD_LOG" | grep -i "error\|fail" | head -20 || echo "未发现链接错误"
    echo ""
    
    # 检查 Pod 相关
    echo "5. Pod 相关错误:"
    echo "----------------------------------------"
    grep -i "pod\|cocoapods" "$BUILD_LOG" | grep -i "error\|fail" | head -20 || echo "未发现 Pod 错误"
    echo ""
    
    # 显示最后 100 行
    echo "6. 最后 100 行构建日志:"
    echo "----------------------------------------"
    tail -100 "$BUILD_LOG"
    echo ""
    
    echo "完整日志已保存到: $BUILD_LOG"
    echo ""
    echo "建议:"
    echo "1. 查看完整错误: cat $BUILD_LOG | grep -A 20 'error:'"
    echo "2. 如果看到架构问题，尝试: BUILD_ARCH=arm64 ./build_dmg.sh"
    echo "3. 如果看到 Pod 问题，尝试: rm -rf Pods Podfile.lock && pod install"
    
else
    echo "✓ 构建成功！"
    rm -f "$BUILD_LOG"
fi
