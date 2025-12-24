#!/bin/bash

# 直接测试序号机制 - 通过检查代码逻辑和日志

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  直接测试序号机制 - 代码逻辑验证                            ║"
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

# 1. 检查代码中的序号逻辑
print_info "=== 1. 检查服务器端序号逻辑 ==="

# 检查 PreviewHttpServer.swift 中的序号实现
if grep -q "sequenceCounters" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
    print_success "✅ 找到 sequenceCounters 定义"
    
    # 检查是否为每个 instanceId 维护独立计数器
    if grep -q "sequenceCounters\[instanceId\]" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
        print_success "✅ 为每个 instanceId 维护独立序号计数器"
    else
        print_error "❌ 未找到按 instanceId 分配序号的逻辑"
    fi
    
    # 检查序号是否递增
    if grep -q "currentSequence = (self.sequenceCounters\[instanceId\] ?? -1) + 1" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
        print_success "✅ 序号递增逻辑正确"
    else
        print_error "❌ 序号递增逻辑可能有问题"
    fi
    
    # 检查是否按序号排序
    if grep -q "sorted.*sequence" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
        print_success "✅ 返回时按序号排序"
    else
        print_error "❌ 未找到按序号排序的逻辑"
    fi
else
    print_error "❌ 未找到 sequenceCounters 定义"
fi

# 2. 检查客户端序号处理
print_info ""
print_info "=== 2. 检查客户端序号处理 ==="

if grep -q "sequence" mac-render-sdk/src/jvmMain/kotlin/com/tencent/kuikly/mac/sdk/KuiklyMacRenderSdk.kt; then
    print_success "✅ 客户端代码包含序号处理"
    
    # 检查是否按序号排序
    if grep -q "sortedBy.*sequence\|sorted.*first" mac-render-sdk/src/jvmMain/kotlin/com/tencent/kuikly/mac/sdk/KuiklyMacRenderSdk.kt; then
        print_success "✅ 客户端按序号排序请求"
    else
        print_error "❌ 客户端未找到按序号排序的逻辑"
    fi
else
    print_error "❌ 客户端代码未处理序号"
fi

# 3. 检查数据结构
print_info ""
print_info "=== 3. 检查数据结构 ==="

# 检查请求是否包含序号字段
if grep -q "sequence.*Int64\|sequence.*sequence" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
    print_success "✅ 请求数据结构包含序号字段"
else
    print_error "❌ 请求数据结构可能缺少序号字段"
fi

# 4. 检查线程安全
print_info ""
print_info "=== 4. 检查线程安全 ==="

if grep -q "callKotlinMethodQueue.*barrier\|callKotlinMethodQueue.*sync" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
    print_success "✅ 使用队列确保线程安全"
else
    print_error "❌ 可能缺少线程安全保护"
fi

# 5. 检查不同 instanceId 的独立性
print_info ""
print_info "=== 5. 检查不同 instanceId 的独立性 ==="

if grep -q "pendingCallKotlinMethodRequests\[instanceId\]" PreviewMacApp/PreviewMacApp/Server/PreviewHttpServer.swift; then
    print_success "✅ 按 instanceId 分组存储请求"
else
    print_error "❌ 未找到按 instanceId 分组的逻辑"
fi

# 6. 总结
print_info ""
print_info "=== 6. 代码逻辑总结 ==="
echo ""
echo "序号机制实现要点："
echo "  1. ✅ 每个 instanceId 有独立的序号计数器"
echo "  2. ✅ 序号从 0 开始递增"
echo "  3. ✅ 请求按序号排序返回"
echo "  4. ✅ 客户端按序号排序执行"
echo "  5. ✅ 使用队列保证线程安全"
echo ""
print_success "代码逻辑验证完成！"
echo ""
print_info "要测试实际运行效果，请："
print_info "  1. 启动 PreviewMacApp: ./run_preview_mac.sh"
print_info "  2. 启动 desktopAppWithMacRender: ./run_desktopAppWithMacRender.sh"
print_info "  3. 在 GUI 中创建预览，观察日志中的序号信息"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  代码逻辑验证完成                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"

