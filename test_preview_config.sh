#!/bin/bash

# 测试预览配置参数功能

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      预览配置参数功能测试                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查 PreviewMacApp 是否运行
echo -e "${YELLOW}📋 步骤 1: 检查 PreviewMacApp 是否运行...${NC}"
if lsof -i :9528 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PreviewMacApp 正在运行 (端口 9528)${NC}"
else
    echo -e "${RED}❌ PreviewMacApp 未运行${NC}"
    echo -e "${YELLOW}💡 请先启动 PreviewMacApp:${NC}"
    echo "   1. 打开 Xcode"
    echo "   2. 打开 PreviewMacApp.xcworkspace"
    echo "   3. 运行 PreviewMacApp"
    exit 1
fi

# 编译测试代码
echo ""
echo -e "${YELLOW}📋 步骤 2: 编译测试代码...${NC}"
if ./gradlew :desktopAppWithMacRender:compileKotlinJvm --no-daemon > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 编译成功${NC}"
else
    echo -e "${RED}❌ 编译失败${NC}"
    echo "请检查编译错误"
    exit 1
fi

# 运行测试
echo ""
echo -e "${YELLOW}📋 步骤 3: 运行预览配置测试...${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 创建临时运行任务
cat > /tmp/test_preview_config_task.gradle << 'EOF'
tasks.register<JavaExec>("testPreviewConfig") {
    group = "application"
    description = "测试预览配置参数功能"
    
    val jvmJar = tasks.named("jvmJar")
    dependsOn(jvmJar)
    
    val jvmRuntimeClasspath by configurations.getting
    classpath = files(jvmJar) + jvmRuntimeClasspath
    
    mainClass.set("com.tencent.kuikly.desktop.mac.TestPreviewConfigKt")
    workingDir = projectDir
    
    standardInput = System.`in`
    
    jvmArgs(
        "-Xmx512m",
        "--add-opens=java.base/java.lang=ALL-UNNAMED",
        "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
        "--add-opens=java.base/java.util=ALL-UNNAMED"
    )
}
EOF

cd desktopAppWithMacRender
./../../gradlew testPreviewConfig --no-daemon -b /tmp/test_preview_config_task.gradle 2>&1 || {
    echo ""
    echo -e "${YELLOW}💡 如果测试失败，请检查：${NC}"
    echo "   1. PreviewMacApp 是否正在运行"
    echo "   2. 端口 9528 是否被占用"
    echo "   3. 查看上面的错误信息"
    exit 1
}

echo ""
echo -e "${GREEN}✅ 测试完成！${NC}"
echo ""
echo -e "${CYAN}📋 测试说明：${NC}"
echo "   1. 测试会使用 Pixel 5 配置启动预览"
echo "   2. 配置参数包括："
echo "      - Device: Pixel 5"
echo "      - Size: 1080x2340"
echo "      - Density: 2.75 (440dpi)"
echo "      - Orientation: portrait"
echo "      - API Level: 35"
echo "      - Locale: en-US"
echo ""
echo -e "${CYAN}📋 验证步骤：${NC}"
echo "   1. 检查 PreviewMacApp 的控制台输出，应该看到配置参数日志"
echo "   2. 检查预览窗口大小是否为 1080x2340"
echo "   3. 检查渲染是否正确应用了配置参数"
echo ""

