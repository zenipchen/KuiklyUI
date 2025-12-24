#!/bin/bash

# 更新 AppIcon Contents.json 配置文件
# 自动为所有生成的图标文件添加配置

set -e

ICON_DIR="PreviewMacApp/Assets.xcassets/AppIcon.appiconset"
CONFIG_FILE="$ICON_DIR/Contents.json"

echo "🔄 正在更新图标配置文件..."

# 检查目录是否存在
if [ ! -d "$ICON_DIR" ]; then
    echo "❌ 错误: 图标目录不存在: $ICON_DIR"
    exit 1
fi

# 创建新的 Contents.json
cat > "$CONFIG_FILE" << 'EOF'
{
  "images" : [
    {
      "filename" : "icon_16x16.png",
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "16x16"
    },
    {
      "filename" : "icon_16x16@2x.png",
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "16x16"
    },
    {
      "filename" : "icon_32x32.png",
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "32x32"
    },
    {
      "filename" : "icon_32x32@2x.png",
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "32x32"
    },
    {
      "filename" : "icon_128x128.png",
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "128x128"
    },
    {
      "filename" : "icon_128x128@2x.png",
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "128x128"
    },
    {
      "filename" : "icon_256x256.png",
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "256x256"
    },
    {
      "filename" : "icon_256x256@2x.png",
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "256x256"
    },
    {
      "filename" : "icon_512x512.png",
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "512x512"
    },
    {
      "filename" : "icon_512x512@2x.png",
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "512x512"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

echo "✅ 配置文件已更新: $CONFIG_FILE"

# 验证所有图标文件是否存在
echo ""
echo "🔍 验证图标文件..."
missing_files=0

for icon_file in \
    "icon_16x16.png" \
    "icon_16x16@2x.png" \
    "icon_32x32.png" \
    "icon_32x32@2x.png" \
    "icon_128x128.png" \
    "icon_128x128@2x.png" \
    "icon_256x256.png" \
    "icon_256x256@2x.png" \
    "icon_512x512.png" \
    "icon_512x512@2x.png"; do
    
    if [ -f "$ICON_DIR/$icon_file" ]; then
        echo "  ✅ $icon_file"
    else
        echo "  ❌ 缺失: $icon_file"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -eq 0 ]; then
    echo ""
    echo "✅ 所有图标文件已就绪！"
    echo ""
    echo "📝 下一步: 在 Xcode 中重新构建项目以应用新图标"
else
    echo ""
    echo "⚠️  警告: 有 $missing_files 个图标文件缺失"
    echo "请先运行 ./generate_app_icon.sh <源图片路径> 生成图标"
fi

