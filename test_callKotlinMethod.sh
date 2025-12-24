#!/bin/bash

# 测试 callKotlinMethod 从 PreviewMacApp 到 desktopApp 的通信

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  测试 callKotlinMethod 通信流程                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 1. 检查 PreviewMacApp 是否运行
echo "=== 1. 检查 PreviewMacApp ==="
if lsof -i :9527 > /dev/null 2>&1; then
    echo "✅ PreviewMacApp 正在运行（端口 9527）"
else
    echo "❌ PreviewMacApp 未运行，请先启动"
    exit 1
fi

# 2. 测试 ping
echo ""
echo "=== 2. 测试 HTTP ping ==="
PING_RESPONSE=$(curl -s http://localhost:9527/ping 2>&1)
if echo "$PING_RESPONSE" | grep -q "pong\|ok"; then
    echo "✅ HTTP 服务正常: $PING_RESPONSE"
else
    echo "❌ HTTP 服务异常: $PING_RESPONSE"
    exit 1
fi

# 3. 测试轮询端点（应该返回空数组）
echo ""
echo "=== 3. 测试轮询端点（初始状态）==="
POLL_RESPONSE=$(curl -s "http://localhost:9527/pollCallKotlinMethod?instanceId=test" 2>&1)
echo "响应: $POLL_RESPONSE"
if echo "$POLL_RESPONSE" | grep -q "requests"; then
    echo "✅ 轮询端点正常"
else
    echo "⚠️  轮询端点响应异常"
fi

# 4. 模拟触发一个 callKotlinMethod（通过渲染请求）
echo ""
echo "=== 4. 发送渲染请求（会触发 callKotlinMethod）==="
RENDER_PAYLOAD='{"pageName":"TextFieldDemo","pageData":{},"instanceId":"test-001","width":400,"height":800}'
RENDER_RESPONSE=$(curl -s -X POST http://localhost:9527/render \
    -H "Content-Type: application/json" \
    -d "$RENDER_PAYLOAD" 2>&1)
echo "渲染响应: $RENDER_RESPONSE"

# 等待一下让渲染层处理
sleep 2

# 5. 再次轮询，看是否有 callKotlinMethod 请求
echo ""
echo "=== 5. 轮询 callKotlinMethod 请求 ==="
for i in {1..5}; do
    echo "第 $i 次轮询..."
    POLL_RESPONSE=$(curl -s "http://localhost:9527/pollCallKotlinMethod?instanceId=test-001" 2>&1)
    echo "响应: $POLL_RESPONSE"
    
    if echo "$POLL_RESPONSE" | grep -q '"requests":\s*\[.*\]' && ! echo "$POLL_RESPONSE" | grep -q '"requests":\s*\[\]'; then
        echo "✅ 检测到 callKotlinMethod 请求！"
        echo ""
        echo "📋 请求详情:"
        echo "$POLL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$POLL_RESPONSE"
        break
    fi
    
    if [ $i -lt 5 ]; then
        sleep 1
    fi
done

echo ""
echo "=== 6. 查看 PreviewMacApp 日志（callKotlinMethod 相关）==="
if [ -f /tmp/preview_mac_app.log ]; then
    echo "最近包含 callKotlinMethod 的日志:"
    grep -i "callKotlinMethod\|callKotlin\|📤\|📥" /tmp/preview_mac_app.log | tail -10 || echo "未找到相关日志"
else
    echo "日志文件不存在"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  测试完成                                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"

