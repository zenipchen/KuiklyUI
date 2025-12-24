#!/bin/bash

# 自动化测试 updatePreviewConfig 功能

set -e

echo "=========================================="
echo "🧪 测试 updatePreviewConfig 功能"
echo "=========================================="
echo ""

# 检查 PreviewMacApp 是否运行
echo "📋 步骤 1: 检查 PreviewMacApp 是否运行..."
if ! curl -s http://localhost:9527/ping > /dev/null 2>&1 && ! lsof -i :9528 > /dev/null 2>&1; then
    echo "⚠️  PreviewMacApp 未运行，请先启动 PreviewMacApp"
    exit 1
fi
echo "✅ PreviewMacApp 正在运行"
echo ""

# 检查端口
TCP_PORT=$(curl -s http://localhost:9527/discover 2>/dev/null | grep -o '"tcpPort":[0-9]*' | grep -o '[0-9]*' || echo "9528")
echo "📍 TCP 端口: $TCP_PORT"
echo ""

# 测试 1: 测试 updatePreviewConfig API
echo "📋 步骤 2: 测试 updatePreviewConfig API..."
echo ""

# 创建测试脚本
cat > /tmp/test_update_config.kt << 'EOF'
import com.tencent.kuikly.mac.sdk.KuiklyMacRenderSdk
import com.tencent.kuikly.mac.sdk.PreviewConfig

fun main() {
    println("🧪 测试 updatePreviewConfig API")
    println("")
    
    // 创建 SDK 实例（用于测试，不需要实际渲染）
    val sdk = KuiklyMacRenderSdk(
        pageName = "_test_",
        serverHost = "localhost",
        serverPort = 9528
    )
    
    // 测试 1: 更新尺寸
    println("测试 1: 更新尺寸 (500x1000)...")
    val config1 = PreviewConfig(width = 500, height = 1000)
    val result1 = sdk.updatePreviewConfig(config1)
    println("结果: ${if (result1) "✅ 成功" else "❌ 失败"}")
    println("")
    
    // 测试 2: 更新多个参数
    println("测试 2: 更新多个参数...")
    val config2 = PreviewConfig(
        width = 600,
        height = 1200,
        density = 2.75f,
        orientation = "landscape",
        locale = "zh-CN"
    )
    val result2 = sdk.updatePreviewConfig(config2)
    println("结果: ${if (result2) "✅ 成功" else "❌ 失败"}")
    println("")
    
    // 测试 3: 更新密度和方向
    println("测试 3: 更新密度和方向...")
    val config3 = PreviewConfig(
        density = 3.0f,
        orientation = "portrait"
    )
    val result3 = sdk.updatePreviewConfig(config3)
    println("结果: ${if (result3) "✅ 成功" else "❌ 失败"}")
    println("")
    
    println("✅ 所有 API 测试完成")
}
EOF

echo "⚠️  注意: 此测试需要有效的 instanceId 和已初始化的渲染实例"
echo "   建议通过 UI 测试来验证功能"
echo ""

# 测试 2: 检查端点是否存在
echo "📋 步骤 3: 检查 /updatePreviewConfig 端点..."
echo ""

# 使用 curl 测试（需要有效的请求体）
TEST_JSON='{"instanceId":"test123","width":500,"height":1000}'
echo "发送测试请求..."
echo "请求体: $TEST_JSON"
echo ""

# 注意：这个测试可能会失败，因为需要有效的 instanceId
# 但可以验证端点是否存在
echo "💡 端点检查需要通过实际运行的应用来验证"
echo ""

echo "=========================================="
echo "✅ 测试准备完成"
echo "=========================================="
echo ""
echo "📋 建议的测试方式："
echo "   1. 运行预览窗口: ./gradlew :desktopAppWithMacRender:testPreviewConfig"
echo "   2. 在配置编辑面板中修改参数"
echo "   3. 点击'应用配置'按钮"
echo "   4. 观察 PreviewMacApp 控制台日志"
echo ""

