#!/bin/bash

# 重命名 PreviewMacApp 为 KuiklyUITools
# 注意：此脚本需要在 PreviewMacApp 目录的父目录执行

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
OLD_NAME="PreviewMacApp"
NEW_NAME="KuiklyUITools"

echo "🔄 开始重命名 $OLD_NAME -> $NEW_NAME"

# 1. 重命名主文件夹
if [ -d "$PARENT_DIR/$OLD_NAME" ]; then
    echo "📁 重命名文件夹: $OLD_NAME -> $NEW_NAME"
    mv "$PARENT_DIR/$OLD_NAME" "$PARENT_DIR/$NEW_NAME"
    echo "✅ 文件夹重命名完成"
else
    echo "⚠️  文件夹 $PARENT_DIR/$OLD_NAME 不存在，跳过"
fi

# 2. 重命名 Xcode 项目文件
if [ -d "$PARENT_DIR/$NEW_NAME/${OLD_NAME}.xcodeproj" ]; then
    echo "📦 重命名 Xcode 项目: ${OLD_NAME}.xcodeproj -> ${NEW_NAME}.xcodeproj"
    mv "$PARENT_DIR/$NEW_NAME/${OLD_NAME}.xcodeproj" "$PARENT_DIR/$NEW_NAME/${NEW_NAME}.xcodeproj"
    echo "✅ Xcode 项目重命名完成"
else
    echo "⚠️  Xcode 项目文件不存在，跳过"
fi

# 3. 重命名 Xcode workspace（如果存在）
if [ -d "$PARENT_DIR/$NEW_NAME/${OLD_NAME}.xcworkspace" ]; then
    echo "📦 重命名 Xcode workspace: ${OLD_NAME}.xcworkspace -> ${NEW_NAME}.xcworkspace"
    mv "$PARENT_DIR/$NEW_NAME/${OLD_NAME}.xcworkspace" "$PARENT_DIR/$NEW_NAME/${NEW_NAME}.xcworkspace"
    echo "✅ Xcode workspace 重命名完成"
else
    echo "⚠️  Xcode workspace 不存在，跳过"
fi

# 4. 重命名内部文件夹（如果存在）
if [ -d "$PARENT_DIR/$NEW_NAME/$OLD_NAME" ]; then
    echo "📁 重命名内部文件夹: $OLD_NAME -> $NEW_NAME"
    mv "$PARENT_DIR/$NEW_NAME/$OLD_NAME" "$PARENT_DIR/$NEW_NAME/$NEW_NAME"
    echo "✅ 内部文件夹重命名完成"
else
    echo "⚠️  内部文件夹不存在，跳过"
fi

echo ""
echo "✅ 重命名完成！"
echo ""
echo "📝 接下来的步骤："
echo "1. 在 Xcode 中打开 $NEW_NAME.xcworkspace"
echo "2. 运行 'pod install' 更新 CocoaPods 配置"
echo "3. 清理并重新构建项目"
echo "4. 更新文档和脚本中的引用（如需要）"

