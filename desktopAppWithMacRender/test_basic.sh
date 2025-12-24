#!/bin/bash

# 基本功能测试脚本

set -e

cd "$(dirname "$0")/.."

echo "🧪 开始测试 desktopAppWithMacRender..."
echo ""

# 1. 检查编译
echo "1️⃣ 检查编译..."
./gradlew :desktopAppWithMacRender:compileKotlinJvm --no-daemon > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 编译成功"
else
    echo "   ❌ 编译失败"
    exit 1
fi

# 2. 检查 PreviewMacApp 是否运行
echo ""
echo "2️⃣ 检查 PreviewMacApp 是否运行..."
if curl -s -m 1 http://localhost:8765/discover > /dev/null 2>&1 || \
   curl -s -m 1 http://localhost:8766/discover > /dev/null 2>&1 || \
   curl -s -m 1 http://localhost:8767/discover > /dev/null 2>&1; then
    echo "   ✅ PreviewMacApp 正在运行"
else
    echo "   ⚠️  PreviewMacApp 未运行（测试可能失败）"
fi

# 3. 测试 ping 功能（通过编译后的类）
echo ""
echo "3️⃣ 测试连接检查功能..."
echo "   （需要运行应用才能测试）"

# 4. 检查关键类是否存在
echo ""
echo "4️⃣ 检查关键类..."
if [ -f "desktopAppWithMacRender/build/classes/kotlin/jvm/main/com/tencent/kuikly/desktop/mac/MainKt.class" ]; then
    echo "   ✅ Main.kt 已编译"
else
    echo "   ⚠️  Main.kt 未找到编译产物"
fi

echo ""
echo "✅ 基本检查完成！"
echo ""
echo "💡 要运行完整测试，请执行："
echo "   ./gradlew :desktopAppWithMacRender:run"
echo "   或"
echo "   ./run_desktopAppWithMacRender.sh"

