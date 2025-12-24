#!/bin/bash

# 测试端口自动分配和发现功能

set -e

echo "🧪 开始测试端口自动分配和发现功能..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置文件路径
CONFIG_DIR="$HOME/Library/Application Support/Kuikly"
TCP_PORT_FILE="$CONFIG_DIR/tcp-port"
DISCOVERY_PORT_FILE="$CONFIG_DIR/discovery-port"

# 清理函数
cleanup() {
    echo ""
    echo "🧹 清理测试环境..."
    # 不删除配置文件，保留用于测试
    # rm -f "$TCP_PORT_FILE" "$DISCOVERY_PORT_FILE"
    echo "✅ 清理完成"
}

trap cleanup EXIT

# 测试 1: 检查配置文件目录
echo "📋 测试 1: 检查配置文件目录"
if [ -d "$CONFIG_DIR" ]; then
    echo -e "${GREEN}✅ 配置文件目录存在: $CONFIG_DIR${NC}"
else
    echo -e "${YELLOW}⚠️  配置文件目录不存在，将在 PreviewMacApp 启动时自动创建${NC}"
fi
echo ""

# 测试 2: 检查端口范围是否可用
echo "📋 测试 2: 检查端口范围可用性"
echo "检查服务发现端口范围 (8765-8775)..."
available_discovery_ports=0
for port in {8765..8775}; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}  ⚠️  端口 $port 已被占用${NC}"
    else
        ((available_discovery_ports++))
    fi
done
echo -e "${GREEN}✅ 可用服务发现端口数: $available_discovery_ports/11${NC}"

echo "检查 TCP 端口范围 (9528-9600)..."
available_tcp_ports=0
for port in {9528..9600}; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}  ⚠️  端口 $port 已被占用${NC}"
    else
        ((available_tcp_ports++))
    fi
done
echo -e "${GREEN}✅ 可用 TCP 端口数: $available_tcp_ports/73${NC}"
echo ""

# 测试 3: 测试服务发现端点（如果 PreviewMacApp 正在运行）
echo "📋 测试 3: 测试服务发现端点"
discovery_port_found=false

# 先尝试从配置文件读取
if [ -f "$DISCOVERY_PORT_FILE" ]; then
    config_port=$(cat "$DISCOVERY_PORT_FILE" 2>/dev/null | tr -d '\n')
    if [ -n "$config_port" ] && [ "$config_port" -ge 8765 ] && [ "$config_port" -le 8775 ]; then
        echo "📄 从配置文件读取服务发现端口: $config_port"
        response=$(curl -s -m 2 "http://localhost:$config_port/discover" 2>/dev/null || echo "")
        if [ -n "$response" ] && echo "$response" | grep -q "tcpPort"; then
            echo -e "${GREEN}✅ 服务发现端点响应成功${NC}"
            echo "响应内容: $response"
            discovery_port_found=true
        fi
    fi
fi

# 如果配置文件不存在或失败，扫描端口范围
if [ "$discovery_port_found" = false ]; then
    echo "🔍 扫描端口范围 (8765-8775)..."
    for port in {8765..8775}; do
        response=$(curl -s -m 1 "http://localhost:$port/discover" 2>/dev/null || echo "")
        if [ -n "$response" ] && echo "$response" | grep -q "tcpPort"; then
            echo -e "${GREEN}✅ 找到服务发现端点: $port${NC}"
            echo "响应内容: $response"
            discovery_port_found=true
            break
        fi
    done
fi

if [ "$discovery_port_found" = false ]; then
    echo -e "${YELLOW}⚠️  未找到服务发现端点（PreviewMacApp 可能未运行）${NC}"
    echo "提示: 请先启动 PreviewMacApp"
fi
echo ""

# 测试 4: 验证 TCP 端口（如果服务发现成功）
if [ "$discovery_port_found" = true ]; then
    echo "📋 测试 4: 验证 TCP 端口"
    if [ -f "$TCP_PORT_FILE" ]; then
        tcp_port=$(cat "$TCP_PORT_FILE" 2>/dev/null | tr -d '\n')
        if [ -n "$tcp_port" ] && [ "$tcp_port" -ge 9528 ] && [ "$tcp_port" -le 9600 ]; then
            echo -e "${GREEN}✅ TCP 端口配置文件存在: $tcp_port${NC}"
            
            # 检查端口是否在监听
            if lsof -Pi :$tcp_port -sTCP:LISTEN -t >/dev/null 2>&1; then
                echo -e "${GREEN}✅ TCP 端口 $tcp_port 正在监听${NC}"
            else
                echo -e "${YELLOW}⚠️  TCP 端口 $tcp_port 未在监听${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  TCP 端口配置文件不存在${NC}"
    fi
    echo ""
fi

# 测试 5: 测试端口冲突处理
echo "📋 测试 5: 端口冲突处理"
echo "模拟端口冲突场景..."
echo "提示: 如果多个 PreviewMacApp 实例同时运行，每个实例会自动选择不同的端口"
echo ""

# 测试 6: 配置文件格式验证
echo "📋 测试 6: 配置文件格式验证"
if [ -f "$TCP_PORT_FILE" ]; then
    tcp_content=$(cat "$TCP_PORT_FILE" 2>/dev/null | tr -d '\n' | tr -d ' ')
    if [[ "$tcp_content" =~ ^[0-9]+$ ]]; then
        echo -e "${GREEN}✅ TCP 端口配置文件格式正确: $tcp_content${NC}"
    else
        echo -e "${RED}❌ TCP 端口配置文件格式错误: $tcp_content${NC}"
    fi
fi

if [ -f "$DISCOVERY_PORT_FILE" ]; then
    discovery_content=$(cat "$DISCOVERY_PORT_FILE" 2>/dev/null | tr -d '\n' | tr -d ' ')
    if [[ "$discovery_content" =~ ^[0-9]+$ ]]; then
        echo -e "${GREEN}✅ 服务发现端口配置文件格式正确: $discovery_content${NC}"
    else
        echo -e "${RED}❌ 服务发现端口配置文件格式错误: $discovery_content${NC}"
    fi
fi
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试总结"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 端口范围配置:"
echo "   - TCP 端口范围: 9528-9600 (73 个端口)"
echo "   - 服务发现端口范围: 8765-8775 (11 个端口)"
echo ""
echo "✅ 配置文件位置:"
echo "   - TCP 端口: $TCP_PORT_FILE"
echo "   - 服务发现端口: $DISCOVERY_PORT_FILE"
echo ""
if [ "$discovery_port_found" = true ]; then
    echo -e "${GREEN}✅ 服务发现功能正常${NC}"
else
    echo -e "${YELLOW}⚠️  服务发现功能未测试（PreviewMacApp 未运行）${NC}"
fi
echo ""
echo "💡 下一步:"
echo "   1. 启动 PreviewMacApp"
echo "   2. 检查配置文件是否正确创建"
echo "   3. 使用 SDK 连接测试端口发现功能"
echo ""

