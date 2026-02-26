#!/bin/bash
#
# Kuikly DSL Preview - 一键启动脚本
#
# 此脚本会同时启动：
# 1. Demo serve 服务器 (端口 8083，提供 nativevue2.js)
# 2. H5App 开发服务器 (端口 8080，提供 H5 预览页面)
# 3. DSL 编辑器编译服务 (端口 3456，接收编译请求并提供编辑器页面)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "╔══════════════════════════════════════════════════════╗"
echo "║         Kuikly DSL Preview - 启动脚本                ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  项目根目录: $PROJECT_ROOT"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# PID 数组
PIDS=()

# 清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}[关闭] 正在停止所有服务...${NC}"
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done
    echo -e "${GREEN}[完成] 所有服务已停止${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

cd "$PROJECT_ROOT"

# ===== Step 1: 启动 Demo Serve =====
echo -e "${BLUE}[Step 1/3] 启动 Demo Serve 服务器 (端口 8083)...${NC}"
npm run serve &
PIDS+=($!)
sleep 2

# ===== Step 2: 执行首次编译 =====
echo -e "${BLUE}[Step 2/3] 执行首次 Demo 编译 (packLocalJsBundleDebug)...${NC}"
echo -e "${YELLOW}  首次编译可能需要较长时间，请耐心等待...${NC}"
$PROJECT_ROOT/gradlew :demo:packLocalJsBundleDebug -Pkuikly.useLocalKsp=false

# ===== Step 3: 启动 H5App 开发服务器 =====
echo -e "${BLUE}[Step 3/3] 启动 H5App 开发服务器 (端口 8080)...${NC}"
$PROJECT_ROOT/gradlew :h5App:jsBrowserDevelopmentRun &
PIDS+=($!)
sleep 5

# ===== Step 4: 启动编辑器编译服务 =====
echo -e "${BLUE}[Step 4/4] 启动 DSL 编辑器编译服务 (端口 3456)...${NC}"
cd "$SCRIPT_DIR"
node server.js &
PIDS+=($!)
sleep 2

# ===== 完成 =====
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         所有服务已启动！                              ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}║  🎨 编辑器: http://localhost:3456                    ║${NC}"
echo -e "${GREEN}║  📱 H5预览: http://localhost:8080                    ║${NC}"
echo -e "${GREEN}║  📦 Serve:  http://localhost:8083                    ║${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}║  按 Ctrl+C 停止所有服务                               ║${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# 自动打开浏览器
if command -v open &>/dev/null; then
    open "http://localhost:3456"
elif command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:3456"
fi

# 等待所有后台进程
wait
