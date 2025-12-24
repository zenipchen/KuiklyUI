# PreviewMacApp DMG 打包指南

本指南介绍如何将 PreviewMacApp 打包成 DMG 安装文件。

## 前置要求

1. macOS 系统
2. Xcode 已安装
3. CocoaPods 已安装 (`sudo gem install cocoapods`)
4. 命令行工具已安装

## 快速开始

### 方法一：使用自动化脚本（推荐）

```bash
cd PreviewMacApp
./build_dmg.sh [版本号]
```

例如：
```bash
./build_dmg.sh 1.0.0
```

脚本会自动完成以下步骤：
1. 检查并安装 CocoaPods 依赖
2. 构建 Release 版本的应用
3. 创建 DMG 镜像
4. 设置 DMG 窗口布局
5. 生成最终的 DMG 文件

生成的 DMG 文件位于 `build/PreviewMacApp-[版本号].dmg`

### 方法二：手动打包

#### 1. 安装依赖

```bash
cd PreviewMacApp
pod install
```

#### 2. 构建应用

在 Xcode 中：
1. 打开 `PreviewMacApp.xcworkspace`
2. 选择 Product > Scheme > PreviewMacApp
3. 选择 Product > Destination > My Mac
4. 选择 Product > Build Configuration > Release
5. 按 `Cmd + B` 构建

或者使用命令行：
```bash
xcodebuild -workspace PreviewMacApp.xcworkspace \
           -scheme PreviewMacApp \
           -configuration Release \
           clean build
```

构建完成后，应用位于：
`~/Library/Developer/Xcode/DerivedData/PreviewMacApp-*/Build/Products/Release/PreviewMacApp.app`

#### 3. 创建 DMG

##### 方法 A：使用 Disk Utility（图形界面）

1. 打开"磁盘工具"（Disk Utility）
2. 选择"文件" > "新建映像" > "空白映像"
3. 设置：
   - 名称：PreviewMacApp
   - 大小：200 MB
   - 格式：Mac OS 扩展（日志式）
   - 加密：无
   - 分区：单个分区 - GUID 分区图
4. 点击"创建"
5. 将构建好的 `PreviewMacApp.app` 拖入 DMG 窗口
6. 可选：创建 `/Applications` 的快捷方式（`ln -s /Applications`）
7. 调整窗口布局和图标位置
8. 关闭 DMG 窗口
9. 在磁盘工具中选择该卷，点击"文件" > "转换"
10. 选择"压缩"格式，保存为 `PreviewMacApp.dmg`

##### 方法 B：使用命令行

```bash
# 创建临时目录
mkdir -p build/dmg
cp -R build/Release/PreviewMacApp.app build/dmg/
ln -s /Applications build/dmg/Applications

# 创建 DMG
hdiutil create -srcfolder build/dmg \
               -volname "PreviewMacApp" \
               -fs HFS+ \
               -format UDZO \
               -imagekey zlib-level=9 \
               PreviewMacApp.dmg

# 清理
rm -rf build/dmg
```

#### 4. 优化 DMG 布局（可选）

如果需要设置 DMG 窗口的布局和图标位置：

```bash
# 创建可读写的 DMG
hdiutil create -srcfolder build/dmg \
               -volname "PreviewMacApp" \
               -fs HFS+ \
               -format UDRW \
               PreviewMacApp.temp.dmg

# 挂载 DMG
hdiutil attach -readwrite -noverify -noautoopen PreviewMacApp.temp.dmg

# 使用 AppleScript 设置布局
osascript <<EOF
tell application "Finder"
    tell disk "PreviewMacApp"
        open
        set current view of container window to icon view
        set toolbar visible of container window to false
        set statusbar visible of container window to false
        set the bounds of container window to {400, 100, 920, 420}
        set viewOptions to the icon view options of container window
        set arrangement of viewOptions to not arranged
        set icon size of viewOptions to 72
        set position of item "PreviewMacApp.app" of container window to {160, 205}
        set position of item "Applications" of container window to {360, 205}
        close
        update without registering applications
    end tell
end tell
EOF

# 卸载并转换为只读格式
hdiutil detach /Volumes/PreviewMacApp
hdiutil convert PreviewMacApp.temp.dmg \
               -format UDZO \
               -imagekey zlib-level=9 \
               -o PreviewMacApp.dmg
rm PreviewMacApp.temp.dmg
```

## 代码签名（可选）

如果需要为应用签名，可以在构建时指定：

```bash
xcodebuild -workspace PreviewMacApp.xcworkspace \
           -scheme PreviewMacApp \
           -configuration Release \
           CODE_SIGN_IDENTITY="Developer ID Application: Your Name" \
           CODE_SIGN_STYLE=Manual \
           PROVISIONING_PROFILE_SPECIFIER="Your Profile"
```

## 常见问题

### 1. 构建失败：找不到 scheme

确保使用 `.xcworkspace` 而不是 `.xcodeproj`：
```bash
xcodebuild -workspace PreviewMacApp.xcworkspace ...
```

### 2. Pod 依赖问题

重新安装依赖：
```bash
pod deintegrate
pod install
```

### 3. DMG 文件过大

可以尝试：
- 移除不必要的资源文件
- 使用更高的压缩级别
- 清理构建产物

### 4. DMG 无法打开

检查文件权限：
```bash
chmod 644 PreviewMacApp.dmg
```

## 参考资源

- [Apple Developer Documentation - Distributing Your Mac App](https://developer.apple.com/distribute/)
- [hdiutil 手册页](https://ss64.com/osx/hdiutil.html)
- [Creating DMG Files](https://stackoverflow.com/questions/96882/how-do-i-create-a-nice-looking-dmg-for-mac-os-x-using-command-line-tools)

