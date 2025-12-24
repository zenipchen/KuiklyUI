#!/bin/bash

# 测试 callKotlinMethod 序号机制
# 验证不同 instanceId 的请求是否有独立的递增序号，且按顺序执行

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  测试 callKotlinMethod 序号机制                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. 检查 PreviewMacApp 是否运行
print_info "=== 1. 检查 PreviewMacApp ==="
if lsof -i :9527 > /dev/null 2>&1; then
    print_success "PreviewMacApp 正在运行（端口 9527）"
else
    print_error "PreviewMacApp 未运行，请先启动: ./run_preview_mac.sh"
    exit 1
fi

# 2. 测试 ping
print_info ""
print_info "=== 2. 测试 HTTP ping ==="
PING_RESPONSE=$(curl -s http://localhost:9527/ping 2>&1)
if echo "$PING_RESPONSE" | grep -q "pong\|ok"; then
    print_success "HTTP 服务正常"
else
    print_error "HTTP 服务异常: $PING_RESPONSE"
    exit 1
fi

# 3. 测试序号机制 - 模拟多个请求
print_info ""
print_info "=== 3. 测试序号机制 ==="
print_info "模拟为 instanceId='test-001' 添加多个 callKotlinMethod 请求..."

# 使用 Python 脚本模拟添加请求（因为需要调用 Swift 代码）
# 这里我们通过发送渲染请求来触发 callKotlinMethod
print_info "发送渲染请求以触发 callKotlinMethod..."
RENDER_PAYLOAD='{"pageName":"TextFieldDemo","pageData":{},"instanceId":"test-001","width":400,"height":800}'
RENDER_RESPONSE=$(curl -s -X POST http://localhost:9527/render \
    -H "Content-Type: application/json" \
    -d "$RENDER_PAYLOAD" 2>&1)
echo "渲染响应: $RENDER_RESPONSE"

# 等待渲染层处理并生成 callKotlinMethod 请求
print_info "等待渲染层处理（3秒）..."
sleep 3

# 4. 轮询并检查序号
print_info ""
print_info "=== 4. 轮询 callKotlinMethod 请求并检查序号 ==="
MAX_ATTEMPTS=10
FOUND_REQUESTS=false

for i in $(seq 1 $MAX_ATTEMPTS); do
    print_info "第 $i 次轮询..."
    POLL_RESPONSE=$(curl -s "http://localhost:9527/pollCallKotlinMethod?instanceId=test-001" 2>&1)
    
    # 检查是否有请求
    if echo "$POLL_RESPONSE" | grep -q '"requests":\s*\[.*\]' && ! echo "$POLL_RESPONSE" | grep -q '"requests":\s*\[\]'; then
        print_success "检测到 callKotlinMethod 请求！"
        echo ""
        print_info "📋 请求详情:"
        echo "$POLL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$POLL_RESPONSE"
        echo ""
        
        # 检查序号
        print_info "=== 5. 验证序号 ==="
        
        # 提取所有序号
        SEQUENCES=$(echo "$POLL_RESPONSE" | python3 -c "
import sys
import json
try:
    data = json.load(sys.stdin)
    requests = data.get('requests', [])
    sequences = [req.get('sequence', -1) for req in requests if 'sequence' in req]
    if sequences:
        print(' '.join(map(str, sequences)))
    else:
        print('NO_SEQUENCES')
except:
    print('PARSE_ERROR')
" 2>/dev/null)
        
        if [ "$SEQUENCES" = "NO_SEQUENCES" ]; then
            print_error "❌ 响应中没有序号字段！"
            echo "响应内容: $POLL_RESPONSE"
        elif [ "$SEQUENCES" = "PARSE_ERROR" ]; then
            print_error "❌ 无法解析响应"
        else
            print_info "检测到的序号: $SEQUENCES"
            
            # 检查序号是否递增
            PREV_SEQ=-1
            IS_ORDERED=true
            for seq in $SEQUENCES; do
                if [ "$seq" -le "$PREV_SEQ" ]; then
                    print_error "❌ 序号未按顺序: 前一个=$PREV_SEQ, 当前=$seq"
                    IS_ORDERED=false
                    break
                fi
                PREV_SEQ=$seq
            done
            
            if [ "$IS_ORDERED" = true ]; then
                print_success "✅ 序号按递增顺序排列！"
                print_info "序号范围: $(echo $SEQUENCES | awk '{print $1}') - $(echo $SEQUENCES | awk '{print $NF}')"
            fi
        fi
        
        FOUND_REQUESTS=true
        break
    fi
    
    if [ $i -lt $MAX_ATTEMPTS ]; then
        sleep 1
    fi
done

if [ "$FOUND_REQUESTS" = false ]; then
    print_error "❌ 未检测到 callKotlinMethod 请求"
    print_info "这可能是因为："
    print_info "  1. 渲染层尚未生成请求"
    print_info "  2. 页面名称 'TextFieldDemo' 不存在"
    print_info "  3. 需要更多时间处理"
fi

# 6. 测试不同 instanceId 的序号独立性
print_info ""
print_info "=== 6. 测试不同 instanceId 的序号独立性 ==="
print_info "为 instanceId='test-002' 发送渲染请求..."

RENDER_PAYLOAD_2='{"pageName":"TextFieldDemo","pageData":{},"instanceId":"test-002","width":400,"height":800}'
RENDER_RESPONSE_2=$(curl -s -X POST http://localhost:9527/render \
    -H "Content-Type: application/json" \
    -d "$RENDER_PAYLOAD_2" 2>&1)
echo "渲染响应: $RENDER_RESPONSE_2"

sleep 3

print_info "轮询 test-002 的请求..."
POLL_RESPONSE_2=$(curl -s "http://localhost:9527/pollCallKotlinMethod?instanceId=test-002" 2>&1)

if echo "$POLL_RESPONSE_2" | grep -q '"requests":\s*\[.*\]' && ! echo "$POLL_RESPONSE_2" | grep -q '"requests":\s*\[\]'; then
    print_success "test-002 也有请求！"
    
    SEQUENCES_2=$(echo "$POLL_RESPONSE_2" | python3 -c "
import sys
import json
try:
    data = json.load(sys.stdin)
    requests = data.get('requests', [])
    sequences = [req.get('sequence', -1) for req in requests if 'sequence' in req]
    if sequences:
        print(' '.join(map(str, sequences)))
    else:
        print('NO_SEQUENCES')
except:
    print('PARSE_ERROR')
" 2>/dev/null)
    
    if [ "$SEQUENCES_2" != "NO_SEQUENCES" ] && [ "$SEQUENCES_2" != "PARSE_ERROR" ]; then
        print_info "test-002 的序号: $SEQUENCES_2"
        FIRST_SEQ_2=$(echo $SEQUENCES_2 | awk '{print $1}')
        if [ "$FIRST_SEQ_2" = "0" ]; then
            print_success "✅ 不同 instanceId 的序号从 0 开始，独立计数！"
        else
            print_info "⚠️  test-002 的第一个序号是 $FIRST_SEQ_2（应该是 0）"
        fi
    fi
else
    print_info "test-002 暂无请求（可能需要更多时间）"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  测试完成                                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"

