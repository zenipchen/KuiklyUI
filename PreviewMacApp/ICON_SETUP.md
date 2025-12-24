# PreviewMacApp 图标设置指南

本指南将帮助您为 PreviewMacApp 设置新的应用图标。

## 前提条件

1. **准备图标源文件**
   - 需要一个高分辨率的 PNG 图片（建议至少 1024x1024 像素）
   - 图片应该是正方形
   - 支持透明背景

2. **系统要求**
   - macOS 系统（自带 `sips` 工具）
   - 或者安装 ImageMagick: `brew install imagemagick`

## 快速开始

### 方法一：使用自动化脚本（推荐）

1. **生成所有尺寸的图标**
   ```bash
   cd PreviewMacApp
   ./generate_app_icon.sh <你的图标图片路径>
   ```
   
   例如：
   ```bash
   ./generate_app_icon.sh ~/Desktop/hummingbird-icon.png
   ```

2. **更新配置文件**
   ```bash
   ./update_icon_config.sh
   ```

3. **在 Xcode 中重新构建项目**
   - 打开 `PreviewMacApp.xcworkspace`
   - 清理构建文件夹 (Product → Clean Build Folder, Shift+Cmd+K)
   - 重新构建项目 (Product → Build, Cmd+B)

### 方法二：手动设置

如果您想手动设置图标：

1. **准备图标文件**
   - 需要生成以下尺寸的 PNG 文件：
     - `icon_16x16.png` (16x16)
     - `icon_16x16@2x.png` (32x32)
     - `icon_32x32.png` (32x32)
     - `icon_32x32@2x.png` (64x64)
     - `icon_128x128.png` (128x128)
     - `icon_128x128@2x.png` (256x256)
     - `icon_256x256.png` (256x256)
     - `icon_256x256@2x.png` (512x512)
     - `icon_512x512.png` (512x512)
     - `icon_512x512@2x.png` (1024x1024)

2. **放置图标文件**
   - 将所有图标文件复制到 `PreviewMacApp/Assets.xcassets/AppIcon.appiconset/` 目录

3. **更新配置文件**
   - 运行 `./update_icon_config.sh` 或手动编辑 `Contents.json`

## 验证图标

设置完成后，可以通过以下方式验证：

1. **在 Xcode 中查看**
   - 打开 `Assets.xcassets`
   - 查看 `AppIcon` 是否显示所有图标

2. **运行应用**
   - 构建并运行应用
   - 在 Dock 和应用程序文件夹中查看图标

3. **检查文件**
   ```bash
   ls -lh PreviewMacApp/Assets.xcassets/AppIcon.appiconset/
   ```

## 故障排除

### 问题：脚本提示找不到图片处理工具

**解决方案：**
- macOS 系统通常自带 `sips` 工具，如果找不到，可以安装 ImageMagick：
  ```bash
  brew install imagemagick
  ```

### 问题：生成的图标模糊

**解决方案：**
- 确保源图片分辨率足够高（至少 1024x1024）
- 使用高质量的源图片

### 问题：图标在 Xcode 中不显示

**解决方案：**
1. 清理构建文件夹 (Shift+Cmd+K)
2. 删除 DerivedData
3. 重新构建项目

### 问题：应用图标没有更新

**解决方案：**
1. 完全退出应用
2. 清理构建文件夹
3. 删除应用（如果已安装）
4. 重新构建并运行

## 图标要求

- **格式**: PNG
- **颜色空间**: RGB
- **透明度**: 支持 Alpha 通道
- **最小尺寸**: 1024x1024 像素（用于生成所有尺寸）
- **推荐尺寸**: 1024x1024 或更高

## 注意事项

1. 图标文件会占用一定的存储空间（所有尺寸加起来约 2-3 MB）
2. 修改图标后需要重新构建应用才能看到效果
3. 如果使用 Xcode 的 Asset Catalog，确保图标文件在正确的目录中

## 相关文件

- `generate_app_icon.sh` - 图标生成脚本
- `update_icon_config.sh` - 配置文件更新脚本
- `PreviewMacApp/Assets.xcassets/AppIcon.appiconset/Contents.json` - 图标配置文件

