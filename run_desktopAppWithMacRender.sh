#!/bin/bash

# Kuikly Desktop with Mac Render 启动脚本
#
# 该脚本用于启动基于 Mac 原生渲染的桌面应用
# 
# 使用方法:
#   ./run_desktopAppWithMacRender.sh              # 启动应用（需先手动启动 PreviewMacApp）
#   ./run_desktopAppWithMacRender.sh --with-mac   # 同时启动 PreviewMacApp 和桌面应用
#   ./run_desktopAppWithMacRender.sh --help       # 显示帮助

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_banner() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║      Kuikly Desktop with Mac Render                       ║"
    echo "║      使用 Mac 原生渲染器进行 UI 渲染                        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

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

# 显示帮助
show_help() {
    echo "Kuikly Desktop with Mac Render 启动脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  (无参数)      启动桌面应用（需先手动启动 PreviewMacApp）"
    echo "  --with-mac    同时启动 PreviewMacApp 和桌面应用"
    echo "  --mac-only    仅启动 PreviewMacApp"
    echo "  --build       先构建再启动"
    echo "  --help        显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                    # 快速启动（假设 PreviewMacApp 已运行）"
    echo "  $0 --with-mac         # 同时启动 Mac 端和桌面端"
    echo "  $0 --build --with-mac # 完整构建并启动"
    echo ""
    echo "架构说明:"
    echo "  ┌─────────────────────────────────────────────────────┐"
    echo "  │  desktopAppWithMacRender (JVM)                      │"
    echo "  │    - 业务逻辑层 (core + compose)                    │"
    echo "  │    - Swing UI (控制面板)                            │"
    echo "  └────────────────────┬────────────────────────────────┘"
    echo "                       │ TCP (端口自动分配: 9528-9600)"
    echo "                       │ 服务发现 (端口自动分配: 8765-8775)"
    echo "                       ▼"
    echo "  ┌─────────────────────────────────────────────────────┐"
    echo "  │  PreviewMacApp (macOS)                              │"
    echo "  │    - 渲染层 (core-render-ios)                       │"
    echo "  │    - TCP Server (自动端口分配)                      │"
    echo "  │    - 服务发现端点 (自动端口分配)                     │"
    echo "  └─────────────────────────────────────────────────────┘"
}

# 检查必要的目录
check_directories() {
    if [ ! -d "desktopAppWithMacRender" ]; then
        print_error "找不到 desktopAppWithMacRender 目录"
        exit 1
    fi
    
    if [ ! -d "mac-render-sdk" ]; then
        print_error "找不到 mac-render-sdk 目录"
        exit 1
    fi
}

# 检查 PreviewMacApp 是否运行
check_preview_mac_app() {
    print_info "检查 PreviewMacApp 是否运行..."
    
    # 方式1: 检查服务发现端点（8765-8775）
    CONFIG_DIR="$HOME/Library/Application Support/Kuikly"
    DISCOVERY_PORT_FILE="$CONFIG_DIR/discovery-port"
    
    if [ -f "$DISCOVERY_PORT_FILE" ]; then
        discovery_port=$(cat "$DISCOVERY_PORT_FILE" 2>/dev/null | tr -d '\n')
        if [ -n "$discovery_port" ] && curl -s -m 1 "http://localhost:$discovery_port/discover" > /dev/null 2>&1; then
            print_success "PreviewMacApp 已运行（服务发现端口: $discovery_port）"
            return 0
        fi
    fi
    
    # 方式2: 扫描服务发现端口范围
    for port in {8765..8775}; do
        if curl -s -m 1 "http://localhost:$port/discover" > /dev/null 2>&1; then
            print_success "PreviewMacApp 已运行（服务发现端口: $port）"
            return 0
        fi
    done
    
    # 方式3: 检查 TCP 端口范围（向后兼容）
    for port in {9528..9600}; do
        if lsof -i :$port > /dev/null 2>&1; then
            print_success "PreviewMacApp 已运行（TCP 端口: $port）"
            return 0
        fi
    done
    
    print_warning "PreviewMacApp 未运行"
    return 1
}

# 启动 PreviewMacApp
start_preview_mac_app() {
    print_info "正在启动 PreviewMacApp..."
    
    PREVIEW_APP_PATH="PreviewMacApp/build/Build/Products/Debug/PreviewMacApp.app"
    
    if [ ! -d "$PREVIEW_APP_PATH" ]; then
        print_warning "PreviewMacApp 未构建，尝试使用启动脚本..."
        
        if [ -f "run_preview_mac.sh" ]; then
            ./run_preview_mac.sh &
            PREVIEW_PID=$!
            
            # 等待启动（检查服务发现端点）
            print_info "等待 PreviewMacApp 启动..."
            for i in {1..30}; do
                # 检查服务发现端点
                found=false
                for port in {8765..8775}; do
                    if curl -s -m 1 "http://localhost:$port/discover" > /dev/null 2>&1; then
                        print_success "PreviewMacApp 已启动（服务发现端口: $port）"
                        found=true
                        break
                    fi
                done
                if [ "$found" = true ]; then
                    return 0
                fi
                sleep 1
                echo -n "."
            done
            echo ""
            print_error "PreviewMacApp 启动超时"
            return 1
        else
            print_error "找不到 run_preview_mac.sh 脚本"
            print_info "请手动启动 PreviewMacApp 或运行: ./run_preview_mac.sh"
            return 1
        fi
    else
        open "$PREVIEW_APP_PATH"
        
        # 等待启动（检查服务发现端点）
        print_info "等待 PreviewMacApp 启动..."
        for i in {1..15}; do
            # 检查服务发现端点
            found=false
            for port in {8765..8775}; do
                if curl -s -m 1 "http://localhost:$port/discover" > /dev/null 2>&1; then
                    print_success "PreviewMacApp 已启动（服务发现端口: $port）"
                    found=true
                    break
                fi
            done
            if [ "$found" = true ]; then
                return 0
            fi
            sleep 1
            echo -n "."
        done
        echo ""
        print_error "PreviewMacApp 启动超时"
        return 1
    fi
}

# 构建 mac-render-sdk
build_sdk() {
    print_info "正在构建 mac-render-sdk..."
    ./gradlew :mac-render-sdk:build
    
    if [ $? -ne 0 ]; then
        print_error "mac-render-sdk 构建失败"
        exit 1
    fi
    print_success "mac-render-sdk 构建完成"
}

# 构建 desktopAppWithMacRender
build_app() {
    print_info "正在构建 desktopAppWithMacRender..."
    ./gradlew :desktopAppWithMacRender:build
    
    if [ $? -ne 0 ]; then
        print_error "desktopAppWithMacRender 构建失败"
        exit 1
    fi
    print_success "desktopAppWithMacRender 构建完成"
}

# 启动桌面应用
run_desktop_app() {
    print_info "正在启动 desktopAppWithMacRender..."
    ./gradlew :desktopAppWithMacRender:run --quiet
}

# 主函数
main() {
    print_banner
    
    WITH_MAC=false
    MAC_ONLY=false
    BUILD=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --with-mac)
                WITH_MAC=true
                shift
                ;;
            --mac-only)
                MAC_ONLY=true
                shift
                ;;
            --build)
                BUILD=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 检查目录
    check_directories
    
    # 如果需要构建
    if [ "$BUILD" = true ]; then
        build_sdk
        build_app
    fi
    
    # 仅启动 Mac 端
    if [ "$MAC_ONLY" = true ]; then
        start_preview_mac_app
        exit 0
    fi
    
    # 如果需要同时启动 Mac 端
    if [ "$WITH_MAC" = true ]; then
        if ! check_preview_mac_app; then
            start_preview_mac_app || exit 1
        fi
    else
        # 检查 Mac 端是否已运行
        if ! check_preview_mac_app; then
            print_warning "PreviewMacApp 未运行"
            print_info "请先启动 PreviewMacApp:"
            print_info "  方式1: ./run_preview_mac.sh"
            print_info "  方式2: $0 --with-mac"
            print_info ""
            read -p "是否现在启动 PreviewMacApp? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                start_preview_mac_app || exit 1
            else
                print_warning "继续启动桌面应用（可能无法渲染）"
            fi
        fi
    fi
    
    # 启动桌面应用
    run_desktop_app
}

main "$@"

