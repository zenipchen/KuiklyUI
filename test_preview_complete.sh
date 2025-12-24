#!/bin/bash

# 完整的预览测试脚本
# 用于测试从启动到显示预览界面的完整流程

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
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}▶ $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 步骤 1: 检查并构建 PreviewMacApp
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
                   build 2>&1 | grep -E "(error|warning|BUILD)" | tail -10
        
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
    
    # 启动应用
    open "$APP_PATH"
    print_info "等待 PreviewMacApp 启动..."
    
    # 等待 TCP 服务器启动（最多 30 秒）
    for i in {1..30}; do
        if lsof -i :9528 > /dev/null 2>&1; then
            print_success "PreviewMacApp 已启动，TCP 服务器运行在端口 9528"
            return 0
        fi
        sleep 1
        echo -n "."
    done
    echo ""
    print_error "PreviewMacApp 启动超时（TCP 端口 9528 未监听）"
    return 1
}

# 步骤 3: 构建 desktopAppWithMacRender
step3_build_desktop_app() {
    print_step "步骤 3: 构建 desktopAppWithMacRender"
    
    print_info "正在构建..."
    ./gradlew :desktopAppWithMacRender:build -x test 2>&1 | tail -5
    
    if [ $? -eq 0 ]; then
        print_success "desktopAppWithMacRender 构建完成"
    else
        print_error "desktopAppWithMacRender 构建失败"
        return 1
    fi
}

# 步骤 4: 启动 desktopAppWithMacRender（测试模式）
step4_start_desktop_app() {
    print_step "步骤 4: 启动 desktopAppWithMacRender"
    
    print_info "正在启动桌面应用..."
    print_info "💡 提示：应用启动后，请在 GUI 中点击 '启动预览' 并输入页面名称（如 HelloWorldPage）"
    
    # 在后台启动应用
    ./gradlew :desktopAppWithMacRender:run &
    DESKTOP_PID=$!
    
    print_info "桌面应用已启动（PID: $DESKTOP_PID）"
    print_info "等待 10 秒让应用完全启动..."
    sleep 10
    
    # 检查是否有连接错误
    print_info "检查连接状态..."
    
    return 0
}

# 主函数
main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║      Kuikly Preview 完整测试流程                           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # 执行所有步骤
    step1_build_preview_mac_app || exit 1
    step2_start_preview_mac_app || exit 1
    step3_build_desktop_app || exit 1
    step4_start_desktop_app || exit 1
    
    echo ""
    print_success "✅ 所有步骤完成！"
    echo ""
    print_info "📋 下一步操作："
    echo "   1. 在 desktopAppWithMacRender 的 GUI 中点击 '启动预览'"
    echo "   2. 输入页面名称（如：HelloWorldPage）"
    echo "   3. 等待预览界面在 PreviewMacApp 中显示"
    echo ""
    print_info "💡 如果预览界面未显示，请检查："
    echo "   - PreviewMacApp 的控制台日志"
    echo "   - desktopAppWithMacRender 的控制台日志"
    echo "   - 端口 9528 是否正在监听：lsof -i :9528"
    echo ""
}

main "$@"

