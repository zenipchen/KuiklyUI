#!/bin/bash

# KuiklyUITools DMG 打包脚本
# 使用方法: ./build_dmg.sh [版本号]
# 例如: ./build_dmg.sh 1.0.0

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 版本号（从参数获取，默认为 1.0.0）
VERSION="${1:-1.0.0}"
APP_NAME="KuiklyUITools"
DMG_NAME="${APP_NAME}-${VERSION}"
BUILD_DIR="build"
DMG_DIR="${BUILD_DIR}/dmg"
APP_PATH="${BUILD_DIR}/Release/${APP_NAME}.app"
DMG_PATH="${BUILD_DIR}/${DMG_NAME}.dmg"

# 输出路径配置信息
echo -e "${GREEN}=== 路径配置 ===${NC}"
echo -e "脚本目录: ${SCRIPT_DIR}"
echo -e "工作目录: $(pwd)"
echo -e "构建目录: ${BUILD_DIR} (绝对路径: $(cd "${BUILD_DIR}" 2>/dev/null && pwd || echo "不存在"))"
echo -e "DMG 目录: ${DMG_DIR} (绝对路径: $(cd "${DMG_DIR}" 2>/dev/null && pwd || echo "不存在"))"
echo -e "应用路径: ${APP_PATH} (绝对路径: $(cd "$(dirname "${APP_PATH}")" 2>/dev/null && pwd)/$(basename "${APP_PATH}") || echo "不存在")"
echo -e "DMG 路径: ${DMG_PATH} (绝对路径: $(cd "$(dirname "${DMG_PATH}")" 2>/dev/null && pwd)/$(basename "${DMG_PATH}") || echo "不存在")"
echo ""

# 架构配置（可通过环境变量覆盖）
# 可选值: arm64, x86_64, 或 "arm64 x86_64" (通用二进制)
# 默认: 根据系统架构自动选择
# 示例: BUILD_ARCH=arm64 ./build_dmg.sh
# 示例: BUILD_ARCH="arm64 x86_64" ./build_dmg.sh  # 通用二进制
BUILD_ARCH="${BUILD_ARCH:-}"

# 代码签名配置（可通过环境变量覆盖）
# 示例: CODE_SIGN_IDENTITY="Developer ID Application: Your Company" ./build_dmg.sh
# 注意: Developer ID Application 证书用于 App Store 外分发，通常不需要 Provisioning Profile
#       如果遇到签名错误，可以设置 USE_PROVISIONING_PROFILE=false 来禁用
CODE_SIGN_IDENTITY="${CODE_SIGN_IDENTITY:-}"
DEVELOPMENT_TEAM="${DEVELOPMENT_TEAM:-88L2Q4487U}"
PROVISIONING_PROFILE_SPECIFIER="${PROVISIONING_PROFILE_SPECIFIER:-com.tencent.kuikly.kuikly-ui-tools_Production_SignProvision_MAC_OS}"
USE_PROVISIONING_PROFILE="${USE_PROVISIONING_PROFILE:-false}"
ENABLE_CODE_SIGN="${ENABLE_CODE_SIGN:-false}"

# 公证配置（可通过环境变量覆盖）
# 示例: ENABLE_NOTARIZATION=true NOTARYTOOL_PROFILE="notarytool-profile" ./build_dmg.sh
# 或: ENABLE_NOTARIZATION=true APPLE_ID="your@email.com" TEAM_ID="88L2Q4487U" APP_SPECIFIC_PASSWORD="xxx" ./build_dmg.sh
ENABLE_NOTARIZATION="${ENABLE_NOTARIZATION:-false}"
NOTARYTOOL_PROFILE="${NOTARYTOOL_PROFILE:-}"
APPLE_ID="${APPLE_ID:-}"
TEAM_ID="${TEAM_ID:-88L2Q4487U}"
APP_SPECIFIC_PASSWORD="${APP_SPECIFIC_PASSWORD:-}"

echo -e "${GREEN}开始构建 ${APP_NAME} DMG 安装包...${NC}"
echo -e "版本号: ${VERSION}"
echo ""

# 清理之前的构建
echo -e "${YELLOW}清理之前的构建...${NC}"
echo -e "  [路径] 删除: ${BUILD_DIR}/Release"
rm -rf "${BUILD_DIR}/Release"
echo -e "  [路径] 删除: ${DMG_DIR}"
rm -rf "${DMG_DIR}"
echo -e "  [路径] 删除: ${DMG_PATH}"
rm -f "${DMG_PATH}"

# 检查 CocoaPods 依赖
if [ ! -d "Pods" ]; then
    echo -e "${YELLOW}安装 CocoaPods 依赖...${NC}"
    pod install
fi

# 构建应用（Release 配置）
echo -e "${YELLOW}构建 Release 版本...${NC}"

# 构建参数
BUILD_ARGS=(
    -workspace "PreviewMacApp.xcworkspace"
    -scheme "${APP_NAME}"
    -configuration Release
    -derivedDataPath "${BUILD_DIR}/DerivedData"
)

# 添加架构参数
if [ -n "$BUILD_ARCH" ]; then
    # 解析多个架构（支持通用二进制）
    ARCH_ARRAY=($BUILD_ARCH)
    for arch in "${ARCH_ARRAY[@]}"; do
        BUILD_ARGS+=(-arch "$arch")
    done
    BUILD_ARGS+=(ONLY_ACTIVE_ARCH=NO)
    echo -e "${YELLOW}构建架构: ${BUILD_ARCH}${NC}"
else
    # 默认：根据系统架构自动选择
    SYSTEM_ARCH=$(uname -m)
    if [ "$SYSTEM_ARCH" = "arm64" ]; then
        echo -e "${YELLOW}检测到 Apple Silicon，构建 arm64 版本${NC}"
        BUILD_ARGS+=(-arch arm64)
    else
        echo -e "${YELLOW}检测到 Intel Mac，构建 x86_64 版本${NC}"
        BUILD_ARGS+=(-arch x86_64)
    fi
fi

# 如果启用了代码签名，添加签名参数
if [ "$ENABLE_CODE_SIGN" = "true" ] && [ -n "$CODE_SIGN_IDENTITY" ]; then
    echo -e "${YELLOW}使用代码签名: ${CODE_SIGN_IDENTITY}${NC}"
    
    # 检查证书类型
    CERT_INFO=$(security find-identity -v -p codesigning 2>/dev/null | grep "$CODE_SIGN_IDENTITY" || true)
    IS_DEVELOPER_ID=false
    if echo "$CERT_INFO" | grep -q "Developer ID Application"; then
        IS_DEVELOPER_ID=true
        echo -e "${YELLOW}检测到 Developer ID Application 证书（用于 App Store 外分发）${NC}"
    fi
    
    BUILD_ARGS+=(
        CODE_SIGN_STYLE=Manual
        CODE_SIGN_IDENTITY="$CODE_SIGN_IDENTITY"
        DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM"
        CODE_SIGN_ENTITLEMENTS=PreviewMacApp/KuiklyUITools.entitlements
        CODE_SIGNING_RESOURCE_RULES_PATH=""
    )
    
    # Developer ID Application 证书通常不需要 Provisioning Profile
    # 只有在明确启用且不是 Developer ID 时才使用
    if [ "$USE_PROVISIONING_PROFILE" = "true" ] && [ -n "$PROVISIONING_PROFILE_SPECIFIER" ]; then
        if [ "$IS_DEVELOPER_ID" = "true" ]; then
            echo -e "${YELLOW}警告: Developer ID Application 证书通常不需要 Provisioning Profile${NC}"
            echo -e "${YELLOW}提示: 如果遇到签名错误，请设置 USE_PROVISIONING_PROFILE=false${NC}"
        fi
        echo -e "${YELLOW}使用 Provisioning Profile: ${PROVISIONING_PROFILE_SPECIFIER}${NC}"
        BUILD_ARGS+=(PROVISIONING_PROFILE_SPECIFIER="$PROVISIONING_PROFILE_SPECIFIER")
    elif [ "$IS_DEVELOPER_ID" = "true" ]; then
        echo -e "${YELLOW}已禁用 Provisioning Profile（Developer ID Application 证书不需要）${NC}"
    fi
else
    echo -e "${YELLOW}警告: 未启用代码签名，应用可能在其他 Mac 上显示为'已损坏'${NC}"
    echo -e "${YELLOW}提示: 设置 ENABLE_CODE_SIGN=true 和 CODE_SIGN_IDENTITY 来启用签名${NC}"
    BUILD_ARGS+=(
        CODE_SIGN_IDENTITY=""
        CODE_SIGNING_REQUIRED=NO
        CODE_SIGNING_ALLOWED=NO
    )
fi

BUILD_ARGS+=(clean build)

# 执行构建并捕获输出
echo -e "${YELLOW}执行 xcodebuild 构建...${NC}"
BUILD_LOG="${BUILD_DIR}/xcodebuild.log"
mkdir -p "${BUILD_DIR}"

# 临时禁用 set -e 以捕获错误
set +e
xcodebuild "${BUILD_ARGS[@]}" 2>&1 | tee "${BUILD_LOG}"
BUILD_EXIT_CODE=${PIPESTATUS[0]}
set -e

if [ ${BUILD_EXIT_CODE} -ne 0 ]; then
    echo ""
    echo -e "${RED}=== 构建失败 (退出代码: ${BUILD_EXIT_CODE}) ===${NC}"
    echo ""
    
    # 提取并显示错误信息
    echo -e "${YELLOW}=== 错误摘要 ===${NC}"
    if grep -q "error:" "${BUILD_LOG}" 2>/dev/null; then
        echo -e "${RED}编译错误:${NC}"
        grep -B 3 -A 10 "error:" "${BUILD_LOG}" | head -50 | sed 's/^/  /'
    else
        echo -e "${YELLOW}  未找到明确的 error: 关键字，查看失败命令...${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}=== 失败的命令 ===${NC}"
    grep -B 5 "BUILD FAILED\|failed\|error:" "${BUILD_LOG}" 2>/dev/null | tail -30 | sed 's/^/  /' || echo "  无法提取失败信息"
    
    echo ""
    echo -e "${YELLOW}=== 架构信息 ===${NC}"
    echo -e "  当前系统架构: $(uname -m)"
    if [ -n "$BUILD_ARCH" ]; then
        echo -e "  构建目标架构: ${BUILD_ARCH}"
    else
        SYSTEM_ARCH=$(uname -m)
        echo -e "  构建目标架构: 自动检测 (${SYSTEM_ARCH})"
    fi
    
    echo ""
    echo -e "${YELLOW}=== 诊断建议 ===${NC}"
    
    # 检查是否是 Provisioning Profile 错误
    if grep -q "doesn't include signing certificate\|Provisioning profile" "${BUILD_LOG}" 2>/dev/null; then
        echo -e "${YELLOW}检测到代码签名配置错误:${NC}"
        echo -e "  ${RED}问题: Provisioning Profile 与签名证书不匹配${NC}"
        echo -e ""
        echo -e "  ${YELLOW}解决方案:${NC}"
        echo -e "  1. 如果使用 Developer ID Application 证书（App Store 外分发）:"
        echo -e "     ${GREEN}USE_PROVISIONING_PROFILE=false ENABLE_CODE_SIGN=true CODE_SIGN_IDENTITY=\"你的证书\" ./build_dmg.sh ${VERSION}${NC}"
        echo -e ""
        echo -e "  2. 如果使用 Apple Distribution 证书（App Store 分发）:"
        echo -e "     确保使用匹配的 Provisioning Profile"
        echo -e ""
        echo -e "  3. 检查证书类型:"
        echo -e "     security find-identity -v -p codesigning"
        echo ""
    fi
    
    echo -e "  1. 查看完整构建日志: ${BUILD_LOG}"
    echo -e "  2. 如果架构不匹配，尝试指定架构:"
    echo -e "     BUILD_ARCH=arm64 ./build_dmg.sh ${VERSION}"
    echo -e "  3. 检查 Pod 依赖:"
    echo -e "     cd PreviewMacApp && pod install"
    echo -e "  4. 清理并重建:"
    echo -e "     rm -rf build Pods Podfile.lock && pod install"
    echo ""
    echo -e "${RED}构建失败，退出代码: ${BUILD_EXIT_CODE}${NC}"
    exit ${BUILD_EXIT_CODE}
fi

# 从 DerivedData 中查找构建的应用
DERIVED_APP_PATH="${BUILD_DIR}/DerivedData/Build/Products/Release/${APP_NAME}.app"

echo -e "${YELLOW}=== 查找构建的应用 ===${NC}"
echo -e "  [路径] 查找位置: ${DERIVED_APP_PATH}"
echo -e "  [路径] 绝对路径: $(cd "$(dirname "${DERIVED_APP_PATH}")" 2>/dev/null && pwd)/$(basename "${DERIVED_APP_PATH}") || echo "目录不存在")"

# 如果找不到，尝试从 archive 中提取
if [ ! -d "${DERIVED_APP_PATH}" ]; then
    echo -e "  [路径] ❌ 未找到，尝试 archive 方式..."
    echo -e "${YELLOW}尝试使用 archive 方式构建...${NC}"
    
    ARCHIVE_ARGS=(
        -workspace "PreviewMacApp.xcworkspace"
        -scheme "${APP_NAME}"
        -configuration Release
        -derivedDataPath "${BUILD_DIR}/DerivedData"
        -archivePath "${BUILD_DIR}/${APP_NAME}.xcarchive"
        archive
    )
    
    # 如果启用了代码签名，添加签名参数
    if [ "$ENABLE_CODE_SIGN" = "true" ] && [ -n "$CODE_SIGN_IDENTITY" ]; then
        ARCHIVE_ARGS+=(
            CODE_SIGN_STYLE=Manual
            CODE_SIGN_IDENTITY="$CODE_SIGN_IDENTITY"
            DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM"
            CODE_SIGN_ENTITLEMENTS=PreviewMacApp/KuiklyUITools.entitlements
        )
        
        # 只有在启用时才添加 Provisioning Profile
        if [ "$USE_PROVISIONING_PROFILE" = "true" ] && [ -n "$PROVISIONING_PROFILE_SPECIFIER" ]; then
            ARCHIVE_ARGS+=(PROVISIONING_PROFILE_SPECIFIER="$PROVISIONING_PROFILE_SPECIFIER")
        fi
    else
        ARCHIVE_ARGS+=(
            CODE_SIGN_IDENTITY=""
            CODE_SIGNING_REQUIRED=NO
            CODE_SIGNING_ALLOWED=NO
        )
    fi
    
    # 执行 archive 构建
    echo -e "${YELLOW}执行 xcodebuild archive...${NC}"
    ARCHIVE_LOG="${BUILD_DIR}/xcodebuild_archive.log"
    set +e
    xcodebuild "${ARCHIVE_ARGS[@]}" 2>&1 | tee "${ARCHIVE_LOG}"
    ARCHIVE_EXIT_CODE=${PIPESTATUS[0]}
    set -e
    
    if [ ${ARCHIVE_EXIT_CODE} -ne 0 ]; then
        echo ""
        echo -e "${RED}=== Archive 构建失败 (退出代码: ${ARCHIVE_EXIT_CODE}) ===${NC}"
        echo ""
        
        # 提取并显示错误信息
        if grep -q "error:" "${ARCHIVE_LOG}" 2>/dev/null; then
            echo -e "${RED}编译错误:${NC}"
            grep -B 3 -A 10 "error:" "${ARCHIVE_LOG}" | head -50 | sed 's/^/  /'
        fi
        
        echo ""
        echo -e "${RED}Archive 构建失败，退出代码: ${ARCHIVE_EXIT_CODE}${NC}"
        echo -e "${YELLOW}查看完整日志: ${ARCHIVE_LOG}${NC}"
        exit ${ARCHIVE_EXIT_CODE}
    fi
    
    DERIVED_APP_PATH="${BUILD_DIR}/${APP_NAME}.xcarchive/Products/Applications/${APP_NAME}.app"
    echo -e "  [路径] 更新查找位置: ${DERIVED_APP_PATH}"
    echo -e "  [路径] 绝对路径: $(cd "$(dirname "${DERIVED_APP_PATH}")" 2>/dev/null && pwd)/$(basename "${DERIVED_APP_PATH}") || echo "目录不存在")"
else
    echo -e "  [路径] ✓ 找到应用"
fi

# 复制应用到 Release 目录
echo -e "${YELLOW}=== 复制应用到 Release 目录 ===${NC}"
if [ -d "${DERIVED_APP_PATH}" ]; then
    echo -e "  [路径] 源路径: ${DERIVED_APP_PATH}"
    echo -e "  [路径] 源绝对路径: $(cd "$(dirname "${DERIVED_APP_PATH}")" && pwd)/$(basename "${DERIVED_APP_PATH}")"
    echo -e "  [路径] 目标路径: ${APP_PATH}"
    echo -e "  [路径] 目标绝对路径: $(cd "$(dirname "${APP_PATH}")" 2>/dev/null && pwd || mkdir -p "$(dirname "${APP_PATH}")" && cd "$(dirname "${APP_PATH}")" && pwd)/$(basename "${APP_PATH}")"
    echo -e "  [路径] 创建目录: $(dirname "${APP_PATH}")"
    mkdir -p "${BUILD_DIR}/Release"
    echo -e "  [路径] 复制中: ${DERIVED_APP_PATH} -> ${APP_PATH}"
    cp -R "${DERIVED_APP_PATH}" "${APP_PATH}"
    echo -e "  [路径] ✓ 复制完成"
else
    echo -e "${RED}错误: 找不到构建的应用${NC}"
    echo -e "  [路径] 查找的路径: ${DERIVED_APP_PATH}"
    echo -e "  [路径] 绝对路径: $(cd "$(dirname "${DERIVED_APP_PATH}")" 2>/dev/null && pwd)/$(basename "${DERIVED_APP_PATH}") || echo "目录不存在")"
    echo "请检查构建日志以获取更多信息"
    exit 1
fi

# 检查应用是否存在
echo -e "${YELLOW}=== 验证应用存在 ===${NC}"
if [ ! -d "${APP_PATH}" ]; then
    echo -e "  [路径] ❌ 应用不存在: ${APP_PATH}"
    echo -e "  [路径] 绝对路径: $(cd "$(dirname "${APP_PATH}")" 2>/dev/null && pwd)/$(basename "${APP_PATH}") || echo "目录不存在")"
    echo -e "${RED}错误: 找不到构建的应用 ${APP_PATH}${NC}"
    exit 1
fi
echo -e "  [路径] ✓ 应用存在: ${APP_PATH}"
echo -e "  [路径] 绝对路径: $(cd "$(dirname "${APP_PATH}")" && pwd)/$(basename "${APP_PATH}")"

# 如果应用已签名但验证失败，尝试修复资源规则问题
if [ "$ENABLE_CODE_SIGN" = "true" ] && [ -n "$CODE_SIGN_IDENTITY" ]; then
    echo -e "${YELLOW}=== 检查并修复签名问题 ===${NC}"
    VERIFY_RESULT=$(codesign --verify "${APP_PATH}" 2>&1 || true)
    if echo "$VERIFY_RESULT" | grep -q "no resources but signature indicates"; then
        echo -e "  [签名] ⚠️  检测到资源规则问题，尝试修复..."
        echo -e "  [签名] 重新签名应用以修复资源规则..."
        
        # 检查证书类型
        CERT_TYPE=$(echo "$CODE_SIGN_IDENTITY" | grep -o "Developer ID\|3rd Party Mac Developer\|Apple Development" || echo "Unknown")
        echo -e "  [签名] 证书类型: $CERT_TYPE"
        
        if echo "$CERT_TYPE" | grep -q "3rd Party Mac Developer"; then
            echo -e "  [签名] ⚠️  警告: 使用的是 3rd Party Mac Developer 证书"
            echo -e "  [签名] 提示: 此证书用于 App Store 分发，不适用于直接分发（DMG）"
            echo -e "  [签名] 建议: 使用 Developer ID Application 证书进行 App Store 外分发"
        fi
        
        # 重新签名，不指定资源规则
        codesign --force --deep --sign "$CODE_SIGN_IDENTITY" \
            --entitlements PreviewMacApp/KuiklyUITools.entitlements \
            --options runtime \
            "${APP_PATH}" 2>&1 | sed 's/^/    /' || {
            echo -e "  [签名] ⚠️  重新签名失败，但继续构建"
        }
        
        # 再次验证
        if codesign --verify "${APP_PATH}" 2>&1 | grep -q "no resources"; then
            echo -e "  [签名] ⚠️  资源规则问题仍然存在"
            echo -e "  [签名] 提示: 这可能是 Xcode 构建配置问题，但不影响应用运行"
        else
            echo -e "  [签名] ✓ 签名问题已修复"
        fi
    fi
fi

# 验证应用完整性
echo -e "${YELLOW}=== 验证应用完整性 ===${NC}"
EXECUTABLE_PATH="${APP_PATH}/Contents/MacOS/${APP_NAME}"
if [ ! -f "${EXECUTABLE_PATH}" ]; then
    echo -e "  [路径] ❌ 可执行文件不存在: ${EXECUTABLE_PATH}"
    echo -e "${RED}错误: 应用可执行文件缺失${NC}"
    exit 1
fi
echo -e "  [路径] ✓ 可执行文件存在: ${EXECUTABLE_PATH}"

# 检查依赖库
echo -e "${YELLOW}=== 检查应用依赖 ===${NC}"
echo -e "  [依赖] 检查动态库链接..."
DYLIBS=$(otool -L "${EXECUTABLE_PATH}" 2>/dev/null | grep -v ":" | grep -v "^$" | awk '{print $1}' | grep -v "^/usr/lib\|^/System/Library" || true)
if [ -n "$DYLIBS" ]; then
    echo -e "  [依赖] ⚠️  发现外部动态库依赖:"
    echo "$DYLIBS" | while read -r dylib; do
        echo -e "    - $dylib"
        if [[ "$dylib" == @rpath* ]] || [[ "$dylib" == @loader_path* ]]; then
            echo -e "      [依赖] ⚠️  使用相对路径，可能无法在其他机器上运行"
        fi
    done
else
    echo -e "  [依赖] ✓ 未发现外部动态库依赖（使用静态链接）"
fi

# 检查 Frameworks 目录
if [ -d "${APP_PATH}/Contents/Frameworks" ]; then
    echo -e "  [依赖] ✓ Frameworks 目录存在"
    FRAMEWORK_COUNT=$(find "${APP_PATH}/Contents/Frameworks" -name "*.framework" 2>/dev/null | wc -l | tr -d ' ')
    echo -e "  [依赖] 包含 $FRAMEWORK_COUNT 个框架"
else
    echo -e "  [依赖] ℹ️  Frameworks 目录不存在（可能使用静态链接）"
fi

# 检查 Swift 运行时
echo -e "  [依赖] 检查 Swift 运行时..."
if otool -L "${EXECUTABLE_PATH}" 2>/dev/null | grep -q "libswift"; then
    echo -e "  [依赖] ✓ 使用 Swift，运行时库由系统提供"
else
    echo -e "  [依赖] ℹ️  未使用 Swift 或已静态链接"
fi

echo -e "${GREEN}应用构建成功: ${APP_PATH}${NC}"

# 验证代码签名
echo -e "${YELLOW}=== 验证代码签名 ===${NC}"

# 首先检查是否有签名
SIGNATURE_INFO=$(codesign -dv --verbose=4 "${APP_PATH}" 2>&1 || true)
if echo "$SIGNATURE_INFO" | grep -q "adhoc"; then
    echo -e "  [签名] ⚠️  使用临时签名（adhoc）"
    echo -e "  [签名] 提示: 在其他 Mac 上可能无法运行，建议使用正式签名"
elif echo "$SIGNATURE_INFO" | grep -q "Authority="; then
    # 有正式签名，进行验证
    echo -e "  [签名] 检测到正式签名，进行验证..."
    
    # 使用 --verify 进行完整验证
    VERIFY_OUTPUT=$(codesign --verify -vv "${APP_PATH}" 2>&1 || true)
    
    if [ -z "$VERIFY_OUTPUT" ] || echo "$VERIFY_OUTPUT" | grep -q "valid on disk"; then
        echo -e "  [签名] ✓ 代码签名验证通过"
        echo -e "  [签名] 签名信息:"
        echo "$SIGNATURE_INFO" | grep -E "(Authority|Identifier|TeamIdentifier|Signed Time)" | sed 's/^/    /' || true
    else
        echo -e "  [签名] ⚠️  代码签名验证发现问题:"
        echo "$VERIFY_OUTPUT" | sed 's/^/    /' || true
        
        # 检查是否是资源问题
        if echo "$VERIFY_OUTPUT" | grep -q "no resources but signature indicates"; then
            echo -e "  [签名] ⚠️  警告: 签名要求资源文件但应用中没有"
            echo -e "  [签名] 提示: 这可能是签名配置问题，但不影响应用运行"
            echo -e "  [签名] 建议: 检查签名时的资源规则配置"
        fi
        
        # 显示签名详情
        echo -e "  [签名] 签名详情:"
        echo "$SIGNATURE_INFO" | grep -E "(Authority|Identifier|TeamIdentifier|Signed Time|Runtime Version)" | sed 's/^/    /' || true
    fi
else
    echo -e "  [签名] ℹ️  签名信息:"
    echo "$SIGNATURE_INFO" | head -5 | sed 's/^/    /' || true
fi

# 验证应用可以运行（可选测试）
echo -e "${YELLOW}=== 验证应用可执行性 ===${NC}"
if command -v spctl >/dev/null 2>&1; then
    echo -e "  [验证] 检查 Gatekeeper 状态..."
    SPCTL_STATUS=$(spctl --assess --verbose --type execute "${APP_PATH}" 2>&1 || true)
    if echo "$SPCTL_STATUS" | grep -q "accepted"; then
        echo -e "  [验证] ✓ Gatekeeper 检查通过"
    else
        echo -e "  [验证] ⚠️  Gatekeeper 拒绝应用:"
        echo "$SPCTL_STATUS" | sed 's/^/    /' || true
        
        # 分析拒绝原因
        if echo "$SPCTL_STATUS" | grep -q "no resources but signature indicates"; then
            echo -e ""
            echo -e "  [验证] 🔍 问题分析: 签名配置要求资源文件，但应用中没有"
            echo -e "  [验证] 💡 解决方案:"
            echo -e "    1. 检查 Xcode 项目设置中的 Code Signing Entitlements"
            echo -e "    2. 确保签名时不要指定不必要的资源规则"
            echo -e "    3. 或者在签名时使用 --no-strict 选项（不推荐）"
            echo -e "    4. 重新签名应用，移除资源规则要求"
        elif echo "$SPCTL_STATUS" | grep -q "rejected"; then
            echo -e ""
            echo -e "  [验证] 🔍 可能的原因:"
            echo -e "    1. 应用未签名或签名无效"
            echo -e "    2. 应用未公证（Notarization）"
            echo -e "    3. 签名证书不在系统信任列表中"
            echo -e "    4. 签名被撤销或过期"
            echo -e ""
            echo -e "  [验证] 💡 解决方案:"
            echo -e ""
            echo -e "  [验证] 📌 重要提示:"
            CERT_TYPE_CHECK=$(codesign -dv "${APP_PATH}" 2>&1 | grep "Authority=" | head -1 || true)
            if echo "$CERT_TYPE_CHECK" | grep -q "3rd Party Mac Developer"; then
                echo -e "  [验证] ⚠️  当前使用的是 '3rd Party Mac Developer' 证书"
                echo -e "  [验证] ⚠️  此证书仅用于 Mac App Store 分发，不适用于直接分发（DMG）"
                echo -e "  [验证] ✅ 必须使用 'Developer ID Application' 证书进行 App Store 外分发"
                echo -e ""
            fi
            echo -e "  [验证] 解决步骤:"
            echo -e "    1. ✅ 使用 Developer ID Application 证书签名（不是 3rd Party Mac Developer）"
            echo -e "    2. ✅ 提交应用进行公证（Notarization）- macOS 10.15+ 必需"
            echo -e "    3. ✅ 装订公证票据到应用"
            echo -e "    4. ⚠️  临时方案: 用户可以在系统设置中允许运行（不推荐）"
            echo -e ""
            echo -e "  [验证] 公证命令示例:"
            echo -e "    xcrun notarytool submit ${DMG_PATH} \\"
            echo -e "        --apple-id your@email.com \\"
            echo -e "        --team-id 88L2Q4487U \\"
            echo -e "        --password YOUR_APP_SPECIFIC_PASSWORD \\"
            echo -e "        --wait"
            echo -e "    xcrun stapler staple ${DMG_PATH}"
        fi
        
        # 检查公证状态
        if command -v stapler >/dev/null 2>&1; then
            echo -e ""
            echo -e "  [验证] 检查公证状态..."
            NOTARIZATION_STATUS=$(stapler validate "${APP_PATH}" 2>&1 || true)
            if echo "$NOTARIZATION_STATUS" | grep -q "ticket stapled"; then
                echo -e "  [验证] ✓ 应用已公证"
            else
                echo -e "  [验证] ⚠️  应用未公证"
                echo -e "  [验证] 提示: 对于分发到 App Store 外的应用，建议进行公证"
            fi
        fi
    fi
fi

# 创建 DMG 目录
echo -e "${YELLOW}=== 创建 DMG 目录 ===${NC}"
echo -e "  [路径] DMG 目录: ${DMG_DIR}"
echo -e "  [路径] DMG 目录绝对路径: $(cd "$(dirname "${DMG_DIR}")" 2>/dev/null && pwd || mkdir -p "$(dirname "${DMG_DIR}")" && cd "$(dirname "${DMG_DIR}")" && pwd)/$(basename "${DMG_DIR}")"
mkdir -p "${DMG_DIR}"
echo -e "  [路径] ✓ DMG 目录已创建"

# 复制应用到 DMG 目录
echo -e "${YELLOW}=== 复制应用到 DMG 目录 ===${NC}"
echo -e "  [路径] 源路径: ${APP_PATH}"
echo -e "  [路径] 源绝对路径: $(cd "$(dirname "${APP_PATH}")" && pwd)/$(basename "${APP_PATH}")"
echo -e "  [路径] 目标路径: ${DMG_DIR}/${APP_NAME}.app"
echo -e "  [路径] 目标绝对路径: $(cd "${DMG_DIR}" && pwd)/${APP_NAME}.app"
echo -e "  [路径] 复制中..."
cp -R "${APP_PATH}" "${DMG_DIR}/"
echo -e "  [路径] ✓ 复制完成"

# 验证应用已复制
echo -e "${YELLOW}=== 验证应用已复制到 DMG 目录 ===${NC}"
if [ ! -d "${DMG_DIR}/${APP_NAME}.app" ]; then
    echo -e "  [路径] ❌ 应用不存在: ${DMG_DIR}/${APP_NAME}.app"
    echo -e "  [路径] 绝对路径: $(cd "${DMG_DIR}" 2>/dev/null && pwd)/${APP_NAME}.app || echo "目录不存在")"
    echo -e "${RED}错误: 应用未成功复制到 DMG 目录${NC}"
    exit 1
fi
echo -e "  [路径] ✓ 应用已存在于 DMG 目录: ${DMG_DIR}/${APP_NAME}.app"
echo -e "  [路径] 绝对路径: $(cd "${DMG_DIR}" && pwd)/${APP_NAME}.app"
echo -e "${GREEN}✓ 应用已复制到 DMG 目录: ${DMG_DIR}/${APP_NAME}.app${NC}"

# 创建 Applications 链接（可选）
echo -e "${YELLOW}=== 创建 Applications 链接 ===${NC}"
echo -e "  [路径] 链接路径: ${DMG_DIR}/Applications"
echo -e "  [路径] 链接目标: /Applications"
ln -s /Applications "${DMG_DIR}/Applications"
echo -e "  [路径] ✓ 链接已创建"

# 创建 DMG
echo -e "${YELLOW}=== 创建 DMG 镜像 ===${NC}"
echo -e "  [路径] 源文件夹: ${DMG_DIR}"
echo -e "  [路径] 源文件夹绝对路径: $(cd "${DMG_DIR}" && pwd)"
echo -e "  [路径] 临时 DMG 文件: ${DMG_PATH}.temp.dmg"
echo -e "  [路径] 临时 DMG 绝对路径: $(cd "$(dirname "${DMG_PATH}")" && pwd)/$(basename "${DMG_PATH}").temp.dmg"
hdiutil create -srcfolder "${DMG_DIR}" \
    -volname "${APP_NAME}" \
    -fs HFS+ \
    -fsargs "-c c=64,a=16,e=16" \
    -format UDRW \
    -size 200m \
    "${DMG_PATH}.temp.dmg"
echo -e "  [路径] ✓ 临时 DMG 已创建: ${DMG_PATH}.temp.dmg"

# 挂载 DMG
echo -e "${YELLOW}=== 挂载 DMG 以设置布局 ===${NC}"
echo -e "  [路径] DMG 文件: ${DMG_PATH}.temp.dmg"
echo -e "  [路径] DMG 绝对路径: $(cd "$(dirname "${DMG_PATH}")" && pwd)/$(basename "${DMG_PATH}").temp.dmg"
MOUNT_DIR=$(hdiutil attach -readwrite -noverify -noautoopen "${DMG_PATH}.temp.dmg" | \
    awk 'BEGIN {FS="\t"} /Apple_HFS/ {print $3}')
echo -e "  [路径] 挂载点: ${MOUNT_DIR}"
echo -e "  [路径] ✓ DMG 已挂载"

# 设置 DMG 窗口布局
echo -e "${YELLOW}设置 DMG 窗口布局...${NC}"
sleep 2

# 使用 AppleScript 设置窗口布局
osascript <<EOF
tell application "Finder"
    tell disk "${APP_NAME}"
        open
        set current view of container window to icon view
        set toolbar visible of container window to false
        set statusbar visible of container window to false
        set the bounds of container window to {400, 100, 920, 420}
        set viewOptions to the icon view options of container window
        set arrangement of viewOptions to not arranged
        set icon size of viewOptions to 72
        delay 1
        set position of item "${APP_NAME}.app" of container window to {160, 205}
        set position of item "Applications" of container window to {360, 205}
        close
        open
        update without registering applications
        delay 2
    end tell
end tell
EOF

# 同步文件系统
sync
sleep 2

# 卸载 DMG
echo -e "${YELLOW}=== 卸载 DMG ===${NC}"
echo -e "  [路径] 卸载挂载点: ${MOUNT_DIR}"
hdiutil detach "${MOUNT_DIR}"
echo -e "  [路径] ✓ DMG 已卸载"

# 转换为只读压缩格式
echo -e "${YELLOW}=== 转换为只读压缩格式 ===${NC}"
echo -e "  [路径] 源文件: ${DMG_PATH}.temp.dmg"
echo -e "  [路径] 源绝对路径: $(cd "$(dirname "${DMG_PATH}")" && pwd)/$(basename "${DMG_PATH}").temp.dmg"
echo -e "  [路径] 目标文件: ${DMG_PATH}"
echo -e "  [路径] 目标绝对路径: $(cd "$(dirname "${DMG_PATH}")" && pwd)/$(basename "${DMG_PATH}")"
hdiutil convert "${DMG_PATH}.temp.dmg" \
    -format UDZO \
    -imagekey zlib-level=9 \
    -o "${DMG_PATH}"
echo -e "  [路径] ✓ DMG 转换完成"

# 清理临时文件
echo -e "${YELLOW}=== 清理临时文件 ===${NC}"
echo -e "  [路径] 删除临时 DMG: ${DMG_PATH}.temp.dmg"
rm -f "${DMG_PATH}.temp.dmg"
echo -e "  [路径] 删除 DMG 目录: ${DMG_DIR}"
rm -rf "${DMG_DIR}"
echo -e "  [路径] ✓ 临时文件已清理"

echo ""
echo -e "${GREEN}=== DMG 打包完成 ===${NC}"
echo -e "${GREEN}✓ DMG 打包完成！${NC}"
echo -e "  [路径] DMG 文件: ${DMG_PATH}"
echo -e "  [路径] DMG 绝对路径: $(cd "$(dirname "${DMG_PATH}")" && pwd)/$(basename "${DMG_PATH}")"
echo -e "  [路径] 文件大小: $(du -h "${DMG_PATH}" | cut -f1)"

# 公证（如果启用）
if [ "$ENABLE_NOTARIZATION" = "true" ]; then
    echo ""
    echo -e "${YELLOW}=== 开始公证流程 ===${NC}"
    
    # 检查是否使用 Developer ID 证书
    CERT_TYPE=$(codesign -dv "${APP_PATH}" 2>&1 | grep "Authority=" | head -1 || true)
    if echo "$CERT_TYPE" | grep -q "3rd Party Mac Developer"; then
        echo -e "${RED}✗ 公证失败: 使用了 3rd Party Mac Developer 证书${NC}"
        echo -e "${YELLOW}提示: 公证需要使用 Developer ID Application 证书${NC}"
        echo -e "${YELLOW}请使用 Developer ID Application 证书重新签名后再进行公证${NC}"
    elif echo "$CERT_TYPE" | grep -q "Developer ID Application"; then
        echo -e "  [公证] ✓ 检测到 Developer ID Application 证书"
        
        # 检查凭证配置
        if [ -n "$NOTARYTOOL_PROFILE" ]; then
            echo -e "  [公证] 使用存储的凭证配置: ${NOTARYTOOL_PROFILE}"
            NOTARY_ARGS=(
                --keychain-profile "$NOTARYTOOL_PROFILE"
            )
        elif [ -n "$APPLE_ID" ] && [ -n "$APP_SPECIFIC_PASSWORD" ]; then
            echo -e "  [公证] 使用直接提供的凭证"
            NOTARY_ARGS=(
                --apple-id "$APPLE_ID"
                --team-id "$TEAM_ID"
                --password "$APP_SPECIFIC_PASSWORD"
            )
        else
            echo -e "${RED}✗ 公证失败: 未提供凭证${NC}"
            echo -e "${YELLOW}提示: 需要提供以下之一：${NC}"
            echo -e "${YELLOW}  1. NOTARYTOOL_PROFILE 环境变量（使用存储的凭证）${NC}"
            echo -e "${YELLOW}  2. APPLE_ID 和 APP_SPECIFIC_PASSWORD 环境变量${NC}"
            echo -e "${YELLOW}示例:${NC}"
            echo -e "${YELLOW}  NOTARYTOOL_PROFILE=\"notarytool-profile\" ENABLE_NOTARIZATION=true ./build_dmg.sh${NC}"
            echo -e "${YELLOW}  或:${NC}"
            echo -e "${YELLOW}  APPLE_ID=\"your@email.com\" APP_SPECIFIC_PASSWORD=\"xxx\" ENABLE_NOTARIZATION=true ./build_dmg.sh${NC}"
        fi
        
        if [ ${#NOTARY_ARGS[@]} -gt 0 ]; then
            echo -e "  [公证] 提交 DMG 进行公证..."
            echo -e "  [路径] DMG 文件: ${DMG_PATH}"
            
            # 提交公证
            NOTARY_OUTPUT=$(xcrun notarytool submit "${DMG_PATH}" \
                "${NOTARY_ARGS[@]}" \
                --wait 2>&1)
            
            NOTARY_EXIT_CODE=$?
            
            if [ $NOTARY_EXIT_CODE -eq 0 ]; then
                echo -e "  [公证] ✓ 公证成功"
                
                # 装订票据
                echo -e "  [公证] 装订公证票据..."
                STAPLE_OUTPUT=$(xcrun stapler staple "${DMG_PATH}" 2>&1)
                
                if [ $? -eq 0 ]; then
                    echo -e "  [公证] ✓ 票据装订成功"
                    
                    # 验证装订
                    VALIDATE_OUTPUT=$(xcrun stapler validate "${DMG_PATH}" 2>&1)
                    if echo "$VALIDATE_OUTPUT" | grep -q "validated"; then
                        echo -e "  [公证] ✓ 验证通过"
                        echo -e "${GREEN}✓ 公证完成！DMG 已准备好分发${NC}"
                    else
                        echo -e "  [公证] ⚠️  验证警告:"
                        echo "$VALIDATE_OUTPUT" | sed 's/^/    /'
                    fi
                else
                    echo -e "  [公证] ⚠️  票据装订失败:"
                    echo "$STAPLE_OUTPUT" | sed 's/^/    /'
                    echo -e "  [公证] 提示: 可以稍后手动装订: xcrun stapler staple ${DMG_PATH}"
                fi
            else
                echo -e "${RED}✗ 公证失败${NC}"
                echo -e "  [公证] 错误信息:"
                echo "$NOTARY_OUTPUT" | sed 's/^/    /'
                echo -e ""
                echo -e "${YELLOW}提示:${NC}"
                echo -e "${YELLOW}  1. 检查 App 专用密码是否正确${NC}"
                echo -e "${YELLOW}  2. 检查 Team ID 是否正确${NC}"
                echo -e "${YELLOW}  3. 查看详细日志: xcrun notarytool log <submission-id>${NC}"
            fi
        fi
    else
        echo -e "${RED}✗ 公证失败: 未检测到有效的签名证书${NC}"
        echo -e "${YELLOW}提示: 请先使用 Developer ID Application 证书签名应用${NC}"
    fi
fi

# 生成诊断报告
echo ""
echo -e "${YELLOW}=== 生成诊断报告 ===${NC}"
DIAGNOSTIC_FILE="${BUILD_DIR}/${DMG_NAME}-diagnostic.txt"
{
    echo "=== KuiklyUITools DMG 诊断报告 ==="
    echo "生成时间: $(date)"
    echo "版本: ${VERSION}"
    echo ""
    echo "=== 应用信息 ==="
    echo "应用路径: ${APP_PATH}"
    echo "应用大小: $(du -sh "${APP_PATH}" | cut -f1)"
    echo ""
    echo "=== 可执行文件信息 ==="
    file "${EXECUTABLE_PATH}" 2>/dev/null || true
    echo ""
    echo "=== 代码签名信息 ==="
    codesign -dv --verbose=4 "${APP_PATH}" 2>&1 | head -10 || true
    echo ""
    echo "=== 依赖库信息 ==="
    otool -L "${EXECUTABLE_PATH}" 2>/dev/null | head -20 || true
    echo ""
    echo "=== 应用结构 ==="
    find "${APP_PATH}" -maxdepth 2 -type d | sed 's|.*/||' || true
    echo ""
    echo "=== DMG 信息 ==="
    echo "DMG 路径: ${DMG_PATH}"
    echo "DMG 大小: $(du -h "${DMG_PATH}" | cut -f1)"
    hdiutil imageinfo "${DMG_PATH}" 2>/dev/null | head -10 || true
} > "${DIAGNOSTIC_FILE}" 2>&1

echo -e "  [诊断] ✓ 诊断报告已生成: ${DIAGNOSTIC_FILE}"
echo -e "  [诊断] 如果应用崩溃，请查看报告以获取详细信息"

# 如果未签名，给出提示
if [ "$ENABLE_CODE_SIGN" != "true" ] || [ -z "$CODE_SIGN_IDENTITY" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  注意: 应用未签名，在其他 Mac 上可能显示为'已损坏'${NC}"
    echo -e "${YELLOW}解决方案:${NC}"
    echo -e "${YELLOW}1. 使用企业证书签名（推荐）:${NC}"
    echo -e "   ${YELLOW}CODE_SIGN_IDENTITY=\"你的证书名称\" ENABLE_CODE_SIGN=true ./build_dmg.sh${NC}"
    echo -e "${YELLOW}2. 临时方案 - 在其他 Mac 上执行:${NC}"
    echo -e "   ${YELLOW}xattr -cr /path/to/${APP_NAME}.app${NC}"
    echo -e "   ${YELLOW}或: sudo spctl --master-disable${NC}"
fi

# 崩溃诊断提示
echo ""
echo -e "${YELLOW}=== 如果应用崩溃，请检查以下内容 ===${NC}"
echo -e "${YELLOW}1. 查看崩溃日志:${NC}"
echo -e "   ${YELLOW}控制台.app > 崩溃报告 > KuiklyUITools${NC}"
echo -e "   ${YELLOW}或: log show --predicate 'processImagePath contains \"KuiklyUITools\"' --last 1h${NC}"
echo -e ""
echo -e "${YELLOW}2. 检查依赖库:${NC}"
echo -e "   ${YELLOW}otool -L ${APP_PATH}/Contents/MacOS/${APP_NAME}${NC}"
echo -e ""
echo -e "${YELLOW}3. 检查代码签名:${NC}"
echo -e "   ${YELLOW}codesign -dv --verbose=4 ${APP_PATH}${NC}"
echo -e ""
echo -e "${YELLOW}4. 查看诊断报告:${NC}"
echo -e "   ${YELLOW}cat ${DIAGNOSTIC_FILE}${NC}"

