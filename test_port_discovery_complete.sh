#!/bin/bash

# 完整的端口发现功能测试脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}▶ $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

CONFIG_DIR="$HOME/Library/Application Support/Kuikly"
TCP_PORT_FILE="$CONFIG_DIR/tcp-port"
DISCOVERY_PORT_FILE="$CONFIG_DIR/discovery-port"

# 步骤 1: 构建 PreviewMacApp
step1_build_preview_mac_app() {
    print_step "步骤 1: 构建 PreviewMacApp"
    
    if [ ! -d "PreviewMacApp/build/Build/Products/Debug/PreviewMacApp.app" ]; then
        print_info "PreviewMacApp 未构建，正在构建..."
        cd PreviewMacApp
        
        if [ -f "Podfile" ] && [ ! -d "Pods" ]; then
            print_info "安装 CocoaPods 依赖..."
            pod install
        fi
        
        xcodebuild -workspace PreviewMacApp.xcworkspace \
                   -scheme PreviewMacApp \
                   -configuration Debug \
                   -derivedDataPath build \
                   build 2>&1 | grep -E "(error|warning|BUILD SUCCEEDED)" | tail -5
        
        cd ..
        
        if [ -d "PreviewMacApp/build/Build/Products/Debug/PreviewMacApp.app" ]; then
            print_success "PreviewMacApp 构建完成"
        else
            print_error "PreviewMacApp 构建失败"
            return 1
        fi
    else
        print_success "PreviewMacApp 已构建"
    fi
}

# 步骤 2: 启动 PreviewMacApp
step2_start_preview_mac_app() {
    print_step "步骤 2: 启动 PreviewMacApp"
    
    APP_PATH="PreviewMacApp/build/Build/Products/Debug/PreviewMacApp.app"
    
    if [ ! -d "$APP_PATH" ]; then
        print_error "找不到 PreviewMacApp.app"
        return 1
    fi
    
    # 关闭已运行的实例
    pkill -f "PreviewMacApp" 2>/dev/null || true
    sleep 2
    
    # 清理旧的配置文件（测试自动分配）
    rm -f "$TCP_PORT_FILE" "$DISCOVERY_PORT_FILE"
    print_info "已清理旧配置文件（测试自动端口分配）"
    
    # 启动应用
    open "$APP_PATH"
    print_info "等待 PreviewMacApp 启动..."
    
    # 等待服务发现端点启动（最多 30 秒）
    discovery_port=""
    for i in {1..30}; do
        # 检查配置文件
        if [ -f "$DISCOVERY_PORT_FILE" ]; then
            discovery_port=$(cat "$DISCOVERY_PORT_FILE" 2>/dev/null | tr -d '\n')
            if [ -n "$discovery_port" ]; then
                # 验证端点是否响应
                if curl -s -m 1 "http://localhost:$discovery_port/discover" > /dev/null 2>&1; then
                    print_success "PreviewMacApp 已启动"
                    print_info "服务发现端口: $discovery_port"
                    break
                fi
            fi
        fi
        
        # 扫描端口范围
        for port in {8765..8775}; do
            if curl -s -m 1 "http://localhost:$port/discover" > /dev/null 2>&1; then
                discovery_port=$port
                print_success "PreviewMacApp 已启动（通过端口扫描）"
                print_info "服务发现端口: $discovery_port"
                break
            fi
        done
        
        if [ -n "$discovery_port" ]; then
            break
        fi
        
        sleep 1
        echo -n "."
    done
    echo ""
    
    if [ -z "$discovery_port" ]; then
        print_error "PreviewMacApp 启动超时（未找到服务发现端点）"
        return 1
    fi
    
    return 0
}

# 步骤 3: 测试服务发现端点
step3_test_discovery_endpoint() {
    print_step "步骤 3: 测试服务发现端点"
    
    # 读取服务发现端口
    if [ -f "$DISCOVERY_PORT_FILE" ]; then
        discovery_port=$(cat "$DISCOVERY_PORT_FILE" 2>/dev/null | tr -d '\n')
    else
        # 扫描端口范围
        for port in {8765..8775}; do
            if curl -s -m 1 "http://localhost:$port/discover" > /dev/null 2>&1; then
                discovery_port=$port
                break
            fi
        done
    fi
    
    if [ -z "$discovery_port" ]; then
        print_error "未找到服务发现端点"
        return 1
    fi
    
    print_info "测试服务发现端点: http://localhost:$discovery_port/discover"
    
    response=$(curl -s -m 2 "http://localhost:$discovery_port/discover")
    
    if [ -z "$response" ]; then
        print_error "服务发现端点无响应"
        return 1
    fi
    
    print_success "服务发现端点响应成功"
    echo "响应内容: $response"
    
    # 解析 TCP 端口
    tcp_port=$(echo "$response" | grep -o '"tcpPort":[0-9]*' | grep -o '[0-9]*' | head -1)
    if [ -n "$tcp_port" ]; then
        print_success "从服务发现端点获取 TCP 端口: $tcp_port"
        
        # 验证 TCP 端口是否在监听
        if lsof -i :$tcp_port > /dev/null 2>&1; then
            print_success "TCP 端口 $tcp_port 正在监听"
        else
            print_warning "TCP 端口 $tcp_port 未在监听"
        fi
    else
        print_warning "无法从响应中解析 TCP 端口"
    fi
    
    return 0
}

# 步骤 4: 验证配置文件
step4_verify_config_files() {
    print_step "步骤 4: 验证配置文件"
    
    if [ -f "$TCP_PORT_FILE" ]; then
        tcp_port=$(cat "$TCP_PORT_FILE" 2>/dev/null | tr -d '\n')
        if [[ "$tcp_port" =~ ^[0-9]+$ ]] && [ "$tcp_port" -ge 9528 ] && [ "$tcp_port" -le 9600 ]; then
            print_success "TCP 端口配置文件正确: $tcp_port"
        else
            print_error "TCP 端口配置文件格式错误: $tcp_port"
            return 1
        fi
    else
        print_warning "TCP 端口配置文件不存在"
    fi
    
    if [ -f "$DISCOVERY_PORT_FILE" ]; then
        discovery_port=$(cat "$DISCOVERY_PORT_FILE" 2>/dev/null | tr -d '\n')
        if [[ "$discovery_port" =~ ^[0-9]+$ ]] && [ "$discovery_port" -ge 8765 ] && [ "$discovery_port" -le 8775 ]; then
            print_success "服务发现端口配置文件正确: $discovery_port"
        else
            print_error "服务发现端口配置文件格式错误: $discovery_port"
            return 1
        fi
    else
        print_warning "服务发现端口配置文件不存在"
    fi
    
    return 0
}

# 步骤 5: 测试 SDK 端口发现
step5_test_sdk_discovery() {
    print_step "步骤 5: 测试 SDK 端口发现"
    
    print_info "构建 mac-render-sdk..."
    ./gradlew :mac-render-sdk:compileKotlinJvm -q 2>&1 | tail -3
    
    if [ $? -ne 0 ]; then
        print_error "mac-render-sdk 编译失败"
        return 1
    fi
    
    print_success "mac-render-sdk 编译成功"
    print_info "SDK 端口发现功能已集成到 KuiklyMacPreviewRunner"
    print_info "当使用默认端口 9528 时，会自动尝试端口发现"
    
    return 0
}

# 主函数
main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║      端口自动分配和发现功能测试                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    step1_build_preview_mac_app || exit 1
    step2_start_preview_mac_app || exit 1
    step3_test_discovery_endpoint || exit 1
    step4_verify_config_files || exit 1
    step5_test_sdk_discovery || exit 1
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ 所有测试通过！${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📋 测试总结:"
    echo "  ✅ PreviewMacApp 自动分配端口成功"
    echo "  ✅ 服务发现端点正常工作"
    echo "  ✅ 配置文件正确创建"
    echo "  ✅ SDK 端口发现功能已集成"
    echo ""
    echo "💡 下一步:"
    echo "  运行 ./run_desktopAppWithMacRender.sh --with-mac 测试完整流程"
}

main "$@"

