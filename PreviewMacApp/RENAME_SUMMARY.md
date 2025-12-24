# PreviewMacApp 重命名为 KuiklyUITools - 完成总结

## ✅ 已完成的更改

### 1. 代码文件更新
- ✅ `PreviewMacApp.swift` → `KuiklyUITools.swift`
  - 结构体名：`PreviewMacApp` → `KuiklyUITools`
  - 日志输出中的名称已更新

### 2. 配置文件更新
- ✅ `PreviewMacApp.entitlements` → `KuiklyUITools.entitlements`
- ✅ `PreviewMacApp-Bridging-Header.h` → `KuiklyUITools-Bridging-Header.h`
  - 头文件保护宏已更新

### 3. Xcode 项目文件更新
- ✅ `project.pbxproj` 中的所有引用已更新：
  - Target 名称：`PreviewMacApp` → `KuiklyUITools`
  - Product 名称：`PreviewMacApp.app` → `KuiklyUITools.app`
  - Bundle Identifier：`com.tencent.kuikly.PreviewMacApp` → `com.tencent.kuikly.KuiklyUITools`
  - 文件路径引用已更新
  - Pods 配置引用已更新

### 4. CocoaPods 配置更新
- ✅ `Podfile` 已更新：
  - Project 名称：`PreviewMacApp.xcodeproj` → `KuiklyUITools.xcodeproj`
  - Target 名称：`PreviewMacApp` → `KuiklyUITools`

### 5. 脚本文件更新
- ✅ `generate_app_icon.sh` - 图标目录路径已更新
- ✅ `update_icon_config.sh` - 图标目录路径已更新
- ✅ `build_dmg.sh` - APP_NAME 和应用名称已更新

## 📝 需要手动执行的步骤

### 1. 重命名文件夹和项目文件
运行重命名脚本（在 PreviewMacApp 目录下）：
```bash
cd /Users/zhenhuachen/Desktop/KuiklyUISecond
./PreviewMacApp/rename_to_kuikly_ui_tools.sh
```

或者手动执行：
```bash
# 重命名主文件夹
mv PreviewMacApp KuiklyUITools

# 重命名 Xcode 项目
cd KuiklyUITools
mv PreviewMacApp.xcodeproj KuiklyUITools.xcodeproj
mv PreviewMacApp.xcworkspace KuiklyUITools.xcworkspace  # 如果存在

# 重命名内部文件夹
mv PreviewMacApp KuiklyUITools
```

### 2. 更新 CocoaPods
```bash
cd KuiklyUITools
pod install
```

### 3. 在 Xcode 中验证
1. 打开 `KuiklyUITools.xcworkspace`
2. 清理项目：Product > Clean Build Folder (Shift+Cmd+K)
3. 重新构建：Product > Build (Cmd+B)
4. 检查所有文件引用是否正确

### 4. 更新文档（可选）
以下文档文件中的引用可能需要更新（如果需要保持文档最新）：
- `README.md`
- `ICON_SETUP.md`
- `DMG_BUILD_GUIDE.md`
- `PORT_CONFLICT_SOLUTION.md`
- `CLIENT_PORT_DISCOVERY.md`
- `DYNAMIC_PORT_SOLUTION.md`
- `DEPLOYMENT_ANALYSIS.md`
- 其他 `.md` 文档文件

## ⚠️ 注意事项

1. **CocoaPods 配置**：重命名后必须运行 `pod install` 来更新 Pods 配置
2. **Xcode 项目**：建议在 Xcode 中打开项目后检查所有文件引用是否正确
3. **构建路径**：如果之前有构建产物，可能需要清理 DerivedData
4. **文档更新**：文档中的引用可以根据需要逐步更新，不影响功能

## 🔍 验证清单

- [ ] 文件夹已重命名
- [ ] Xcode 项目文件已重命名
- [ ] 运行 `pod install` 成功
- [ ] Xcode 项目可以正常打开
- [ ] 项目可以正常编译
- [ ] 应用可以正常运行
- [ ] Bundle Identifier 正确
- [ ] 所有文件引用正确

## 📞 如有问题

如果遇到问题，请检查：
1. Xcode 项目文件中的文件引用是否正确
2. CocoaPods 配置是否正确
3. Bundle Identifier 是否匹配
4. 文件路径是否正确

