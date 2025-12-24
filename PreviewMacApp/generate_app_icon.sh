#!/bin/bash

# macOS 应用图标生成脚本
# 使用方法: ./generate_app_icon.sh <源图片路径>
# 例如: ./generate_app_icon.sh ~/Desktop/hummingbird-icon.png

set -e

# 检查参数
if [ $# -eq 0 ]; then
    echo "❌ 错误: 请提供源图片路径"
    echo "使用方法: $0 <源图片路径>"
    echo "例如: $0 ~/Desktop/hummingbird-icon.png"
    exit 1
fi

SOURCE_IMAGE="$1"

# 检查源图片是否存在
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ 错误: 源图片不存在: $SOURCE_IMAGE"
    exit 1
fi

# 图标目录
ICON_DIR="PreviewMacApp/Assets.xcassets/AppIcon.appiconset"

# 确保目录存在
mkdir -p "$ICON_DIR"

echo "🔄 正在生成 macOS 应用图标..."
echo "📁 源图片: $SOURCE_IMAGE"
echo "📁 输出目录: $ICON_DIR"

# macOS 需要的图标尺寸
# 格式: 文件名:宽度:高度
declare -a SIZES=(
    "icon_16x16.png:16:16"
    "icon_16x16@2x.png:32:32"
    "icon_32x32.png:32:32"
    "icon_32x32@2x.png:64:64"
    "icon_128x128.png:128:128"
    "icon_128x128@2x.png:256:256"
    "icon_256x256.png:256:256"
    "icon_256x256@2x.png:512:512"
    "icon_512x512.png:512:512"
    "icon_512x512@2x.png:1024:1024"
)

# 检查是否安装了 sips (macOS 自带)
if command -v sips &> /dev/null; then
    echo "✅ 使用 sips 工具生成图标..."
    
    for size_info in "${SIZES[@]}"; do
        IFS=':' read -r filename width height <<< "$size_info"
        output_path="$ICON_DIR/$filename"
        
        echo "  📐 生成 $filename (${width}x${height})..."
        sips -z "$height" "$width" "$SOURCE_IMAGE" --out "$output_path" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "    ✅ 成功: $filename"
        else
            echo "    ❌ 失败: $filename"
            exit 1
        fi
    done
# 检查是否安装了 ImageMagick
elif command -v convert &> /dev/null; then
    echo "✅ 使用 ImageMagick 生成图标..."
    
    for size_info in "${SIZES[@]}"; do
        IFS=':' read -r filename width height <<< "$size_info"
        output_path="$ICON_DIR/$filename"
        
        echo "  📐 生成 $filename (${width}x${height})..."
        convert "$SOURCE_IMAGE" -resize "${width}x${height}!" "$output_path"
        
        if [ $? -eq 0 ]; then
            echo "    ✅ 成功: $filename"
        else
            echo "    ❌ 失败: $filename"
            exit 1
        fi
    done
else
    echo "❌ 错误: 未找到图片处理工具"
    echo "请安装以下工具之一:"
    echo "  - sips (macOS 自带，通常已安装)"
    echo "  - ImageMagick (brew install imagemagick)"
    exit 1
fi

echo ""
echo "✅ 所有图标已生成完成！"
echo ""
echo "📝 下一步: 运行以下命令更新 Contents.json:"
echo "   ./update_icon_config.sh"

