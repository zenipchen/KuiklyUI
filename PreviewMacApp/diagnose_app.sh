#!/bin/bash

# KuiklyUITools 应用诊断脚本

APP_PATH="${1:-/Applications/KuiklyUITools.app}"

if [ ! -d "$APP_PATH" ]; then
    echo "错误: 应用不存在: $APP_PATH"
    exit 1
fi

echo "=== KuiklyUITools 应用诊断 ==="
echo "应用路径: $APP_PATH"
echo ""

# 1. 检查应用结构
echo "=== 1. 应用结构 ==="
if [ -f "$APP_PATH/Contents/MacOS/KuiklyUITools" ]; then
    echo "✓ 可执行文件存在"
    file "$APP_PATH/Contents/MacOS/KuiklyUITools"
else
    echo "✗ 可执行文件不存在"
fi
echo ""

# 2. 检查代码签名
echo "=== 2. 代码签名 ==="
SIGNATURE_INFO=$(codesign -dv --verbose=4 "$APP_PATH" 2>&1)
echo "$SIGNATURE_INFO" | head -10

# 检查证书类型
if echo "$SIGNATURE_INFO" | grep -q "3rd Party Mac Developer"; then
    echo ""
    echo "⚠️  警告: 使用了 3rd Party Mac Developer 证书"
    echo "   此证书仅用于 Mac App Store 分发，不适用于直接运行"
fi

# 验证签名
echo ""
echo "验证签名:"
codesign --verify --deep --strict --verbose=2 "$APP_PATH" 2>&1
echo ""

# 3. 检查 Gatekeeper 状态
echo "=== 3. Gatekeeper 状态 ==="
SPCTL_STATUS=$(spctl --assess --verbose --type execute "$APP_PATH" 2>&1)
echo "$SPCTL_STATUS"
echo ""

# 4. 检查隔离属性
echo "=== 4. 隔离属性 ==="
QUARANTINE=$(xattr -l "$APP_PATH" 2>&1 | grep "quarantine" || echo "无隔离属性")
if [ -n "$QUARANTINE" ] && echo "$QUARANTINE" | grep -q "quarantine"; then
    echo "⚠️  发现隔离属性:"
    echo "$QUARANTINE"
    echo ""
    echo "建议移除: xattr -cr \"$APP_PATH\""
else
    echo "✓ 无隔离属性"
fi
echo ""

# 5. 检查架构
echo "=== 5. 架构信息 ==="
EXECUTABLE="$APP_PATH/Contents/MacOS/KuiklyUITools"
if [ -f "$EXECUTABLE" ]; then
    FILE_INFO=$(file "$EXECUTABLE")
    echo "$FILE_INFO"
    
    # 检查架构匹配
    SYSTEM_ARCH=$(uname -m)
    if echo "$FILE_INFO" | grep -q "x86_64" && [ "$SYSTEM_ARCH" = "arm64" ]; then
        echo ""
        echo "⚠️  架构不匹配:"
        echo "   应用架构: x86_64"
        echo "   系统架构: arm64"
        echo "   需要通过 Rosetta 运行，但签名问题可能导致无法启动"
    fi
fi
echo ""

# 6. 检查依赖库
echo "=== 6. 依赖库检查 ==="
if [ -f "$EXECUTABLE" ]; then
    EXTERNAL_DEPS=$(otool -L "$EXECUTABLE" 2>/dev/null | grep -v "^/usr/lib\|^/System/Library\|^/usr/lib/swift" | grep -v ":$" | head -10)
    if [ -n "$EXTERNAL_DEPS" ]; then
        echo "外部依赖库:"
        echo "$EXTERNAL_DEPS"
    else
        echo "✓ 无外部依赖库（使用静态链接）"
    fi
fi
echo ""

# 7. 检查崩溃报告
echo "=== 7. 最近的崩溃报告 ==="
CRASH_REPORTS=$(ls -t ~/Library/Logs/DiagnosticReports/KuiklyUITools-*.ips 2>/dev/null | head -1)
if [ -n "$CRASH_REPORTS" ]; then
    echo "最新崩溃报告: $CRASH_REPORTS"
    echo ""
    echo "崩溃原因:"
    grep -E "exception|termination|Code Signature|Taskgated" "$CRASH_REPORTS" 2>/dev/null | head -5 || true
else
    echo "未找到崩溃报告"
fi
echo ""

# 8. 建议
echo "=== 8. 建议 ==="
if echo "$SIGNATURE_INFO" | grep -q "3rd Party Mac Developer"; then
    echo "1. 使用 Developer ID Application 证书重新签名"
    echo "2. 或通过 Mac App Store 分发"
fi

if echo "$SPCTL_STATUS" | grep -q "rejected"; then
    echo "3. Gatekeeper 拒绝应用，需要修复签名或进行公证"
fi

if [ -n "$QUARANTINE" ] && echo "$QUARANTINE" | grep -q "quarantine"; then
    echo "4. 移除隔离属性: xattr -cr \"$APP_PATH\""
fi

echo ""
echo "=== 诊断完成 ==="
