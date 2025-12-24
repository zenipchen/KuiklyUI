#!/bin/bash

# 获取详细编译错误的脚本
# 使用方法: ./get_build_errors.sh

set -e

cd "$(dirname "$0")"

echo "开始构建并捕获详细错误信息..."
echo ""

# 清理之前的构建
rm -rf build/DerivedData

# 构建并捕获所有输出
xcodebuild \
    -workspace PreviewMacApp.xcworkspace \
    -scheme KuiklyUITools \
    -configuration Release \
    -derivedDataPath ./build/DerivedData \
    clean build 2>&1 | tee build_full.log

# 提取错误信息
echo ""
echo "========== 编译错误摘要 =========="
grep -A 5 "error:" build_full.log || echo "未找到 error: 关键字"

echo ""
echo "========== 警告信息 =========="
grep -A 2 "warning:" build_full.log | head -50 || echo "未找到 warning: 关键字"

echo ""
echo "========== 失败的命令 =========="
grep -B 5 "BUILD FAILED" build_full.log | tail -20 || echo "未找到失败信息"

echo ""
echo "完整日志已保存到: build_full.log"



