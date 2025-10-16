#!/bin/bash

echo "🔧 构建 Kuikly Desktop SDK"
echo "=========================="

# 检查必要的目录是否存在
if [ ! -d "desktop-render-layer" ]; then
    echo "❌ 找不到 desktop-render-layer 目录"
    exit 1
fi

if [ ! -d "desktopApp" ]; then
    echo "❌ 找不到 desktopApp 目录"
    exit 1
fi

# 构建桌面渲染层
echo "📦 构建桌面渲染层..."
./gradlew :desktop-render-layer:build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 拷贝 JavaScript 文件到 resources 目录
echo "📋 拷贝 JavaScript 文件到 resources 目录..."
JS_SOURCE="desktop-render-layer/build/kotlin-webpack/js/productionExecutable/desktopRenderLayer.js"
JS_TARGET="desktopApp/src/jvmMain/resources/com/tencent/kuikly/desktop/desktopRenderLayer.js"

# 确保目标目录存在
mkdir -p "desktopApp/src/jvmMain/resources/com/tencent/kuikly/desktop/"

if [ -f "$JS_SOURCE" ]; then
    cp "$JS_SOURCE" "$JS_TARGET"
    echo "✅ JavaScript 文件已拷贝: $JS_TARGET"
    
    # 验证拷贝是否成功
    if [ -f "$JS_TARGET" ]; then
        echo "✅ 文件拷贝验证成功"
    else
        echo "❌ 文件拷贝失败"
        exit 1
    fi
else
    echo "❌ 找不到源文件: $JS_SOURCE"
    echo "请确保 desktop-render-layer 模块已正确构建"
    exit 1
fi

# 构建 JAR 包
echo "📦 构建 JAR 包..."
./gradlew :desktopApp:desktopRenderSdkLightJar

if [ $? -ne 0 ]; then
    echo "❌ JAR 包构建失败"
    exit 1
fi

echo "✅ JAR 包构建完成"

# 显示构建结果
echo "📋 构建结果："
ls -la desktopApp/build/libs/

echo ""
echo "🎉 构建完成！"
echo "JAR 包位置: desktopApp/build/libs/desktop-render-sdk-1.0.0-light.jar"
