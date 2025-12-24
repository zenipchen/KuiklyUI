#!/bin/bash

# 端口重新发现功能测试脚本
# 
# 测试场景：
# 1. 启动 PreviewMacApp（端口 9528）
# 2. JVM 端连接成功
# 3. 关闭 PreviewMacApp
# 4. 观察 JVM 端日志，应该看到：
#    - 连接失败 (第 1 次)
#    - 连接失败 (第 2 次)
#    - 连接失败 (第 3 次)
#    - 🔍 连续失败 3 次，尝试重新发现端口...
# 5. 重新启动 PreviewMacApp（可能使用新端口）
# 6. JVM 端应该自动发现新端口并重连

echo "=========================================="
echo "端口重新发现功能测试"
echo "=========================================="
echo ""

echo "📋 测试步骤："
echo "1. 确保 PreviewMacApp 正在运行"
echo "2. 运行一个使用 mac-render-sdk 的应用"
echo "3. 关闭 PreviewMacApp，等待 3-5 秒"
echo "4. 重新启动 PreviewMacApp"
echo "5. 观察应用日志"
echo ""

echo "✅ 预期行为："
echo "- JVM 端检测到连接断开"
echo "- 连续失败 3 次后触发端口重新发现"
echo "- 自动发现新端口（如果端口变化）"
echo "- 自动重连成功"
echo ""

echo "🔍 关键日志标志："
echo "  [TcpTransport] ❌ TCP 连接失败 (第 X 次)"
echo "  [TcpTransport] 🔍 连续失败 3 次，尝试重新发现端口..."
echo "  [Mac SDK] 🔍 开始端口重新发现..."
echo "  [Discovery] 🔍 扫描端口范围 (8765-8775)..."
echo "  [Discovery] ✅ 通过端口扫描发现端口: discovery=XXXX, tcp=YYYY"
echo "  [TcpTransport] ✅ 发现新端口: YYYY (旧端口: ZZZZ)"
echo "  [TcpTransport] ✅ TCP 连接已建立"
echo ""

echo "📊 测试场景："
echo ""

echo "场景 1: PreviewMacApp 重启（端口变化）"
echo "  1. 关闭 PreviewMacApp"
echo "  2. 等待 3-5 秒（观察 JVM 端日志）"
echo "  3. 重新启动 PreviewMacApp"
echo "  4. 应该看到端口重新发现并连接成功"
echo ""

echo "场景 2: 网络临时中断（端口未变）"
echo "  1. 快速关闭并重启 PreviewMacApp（< 3 秒）"
echo "  2. 应该不触发端口重新发现（失败次数 < 3）"
echo "  3. 直接使用原端口重连成功"
echo ""

echo "场景 3: 连续失败后端口未变"
echo "  1. 关闭 PreviewMacApp"
echo "  2. 等待 3-5 秒（触发端口重新发现）"
echo "  3. 重新启动 PreviewMacApp（使用相同端口）"
echo "  4. 端口重新发现返回原端口，继续重连"
echo ""

echo "=========================================="
echo "开始测试..."
echo "=========================================="
echo ""

# 检查 PreviewMacApp 是否正在运行
if pgrep -x "PreviewMacApp" > /dev/null; then
    echo "✅ PreviewMacApp 正在运行"
    
    # 获取 PreviewMacApp 的 PID
    PID=$(pgrep -x "PreviewMacApp")
    echo "   PID: $PID"
    
    # 检查端口发现配置文件
    CONFIG_FILE="$HOME/Library/Application Support/Kuikly/discovery-port"
    if [ -f "$CONFIG_FILE" ]; then
        DISCOVERY_PORT=$(cat "$CONFIG_FILE")
        echo "   缓存的发现端口: $DISCOVERY_PORT"
    else
        echo "   ⚠️ 未找到端口缓存文件"
    fi
    
    echo ""
    echo "📝 提示："
    echo "   - 可以通过以下命令关闭 PreviewMacApp："
    echo "     kill $PID"
    echo ""
    echo "   - 清除端口缓存（强制重新发现）："
    echo "     rm -f \"$CONFIG_FILE\""
    echo ""
else
    echo "❌ PreviewMacApp 未运行"
    echo "   请先启动 PreviewMacApp，然后重新运行此脚本"
    exit 1
fi

echo "=========================================="
echo "现在可以开始测试了！"
echo "=========================================="
echo ""
echo "建议步骤："
echo "1. 在另一个终端运行你的 JVM 应用（使用 mac-render-sdk）"
echo "2. 确认连接成功"
echo "3. 关闭 PreviewMacApp: kill $PID"
echo "4. 观察 JVM 应用日志（应该看到连接失败和端口重新发现）"
echo "5. 重新启动 PreviewMacApp"
echo "6. 观察是否自动重连成功"
echo ""
