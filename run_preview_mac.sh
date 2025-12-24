#!/bin/bash

# Kuikly Mac 预览启动脚本
# 
# 该脚本用于启动 PreviewMacApp 和相关服务
#
# 使用方法:
#   ./run_preview_mac.sh           # 启动预览应用
#   ./run_preview_mac.sh build     # 构建并启动
#   ./run_preview_mac.sh clean     # 清理并重新构建

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PREVIEW_APP_DIR="$SCRIPT_DIR/PreviewMacApp"
BUILD_DIR="$PREVIEW_APP_DIR/build"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 检查 CocoaPods 是否安装
check_cocoapods() {
    if ! command -v pod &> /dev/null; then
        print_error "CocoaPods 未安装，请先安装 CocoaPods"
        print_info "运行: gem install cocoapods"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    print_info "正在安装 CocoaPods 依赖..."
    cd "$PREVIEW_APP_DIR"
    
    if [ ! -f "Podfile.lock" ] || [ "$1" == "clean" ]; then
        pod install
    else
        print_info "依赖已安装，跳过..."
    fi
    
    cd "$SCRIPT_DIR"
}

# 构建应用
build_app() {
    print_info "正在构建 PreviewMacApp..."
    
    cd "$PREVIEW_APP_DIR"
    
    xcodebuild -workspace PreviewMacApp.xcworkspace \
               -scheme PreviewMacApp \
               -configuration Debug \
               -derivedDataPath "$BUILD_DIR" \
               build
    
    cd "$SCRIPT_DIR"
    print_success "构建完成"
}

# 运行应用
run_app() {
    print_info "正在启动 PreviewMacApp..."
    
    APP_PATH="$BUILD_DIR/Build/Products/Debug/PreviewMacApp.app"
    
    if [ ! -d "$APP_PATH" ]; then
        print_warning "应用未构建，正在构建..."
        build_app
    fi
    
    open "$APP_PATH"
    print_success "PreviewMacApp 已启动"
    print_info "HTTP 服务运行在端口 9527"
}

# 清理构建
clean_build() {
    print_info "正在清理构建..."
    rm -rf "$BUILD_DIR"
    cd "$PREVIEW_APP_DIR"
    pod deintegrate
    rm -rf Pods
    rm -f Podfile.lock
    cd "$SCRIPT_DIR"
    print_success "清理完成"
}

# 显示帮助
show_help() {
    echo "Kuikly Mac 预览启动脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  (无参数)    安装依赖并启动应用"
    echo "  build       构建并启动应用"
    echo "  clean       清理并重新构建"
    echo "  help        显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0           # 快速启动"
    echo "  $0 build     # 完整构建"
    echo "  $0 clean     # 清理重建"
}

# 主函数
main() {
    case "${1:-}" in
        "build")
            check_cocoapods
            install_dependencies
            build_app
            run_app
            ;;
        "clean")
            clean_build
            check_cocoapods
            install_dependencies "clean"
            build_app
            run_app
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            check_cocoapods
            install_dependencies
            run_app
            ;;
    esac
}

main "$@"

