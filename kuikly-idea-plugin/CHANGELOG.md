# 更新日志

## [1.0.0] - 2025-10-01

### ✨ 新增功能
- 🎯 实时预览 Kuikly 页面
- 🔥 代码修改自动热重载
- 📱 支持多种设备尺寸（手机、平板）
- 🔧 集成 Chrome DevTools
- 📋 自动扫描 @Page 注解的页面
- ⌨️ 快捷键支持

### 🛠️ 技术实现
- 基于 JCEF (Chromium) 的浏览器渲染
- Ktor 嵌入式 HTTP 服务器
- WebSocket 实时通信
- Gradle 增量编译集成
- 文件系统监听 (VFS)

### 📦 依赖
- IntelliJ Platform 2024.2
- Kotlin 2.0.21
- Ktor 2.3.7
- Kotlinx Coroutines 1.7.3

### 🐛 已知问题
- [ ] 首次编译较慢（30-60秒）
- [ ] 暂不支持自定义设备尺寸
- [ ] 刷新动作无法直接触发预览面板刷新

### 🔮 计划功能
- [ ] 支持 @HotPreview Composable 预览
- [ ] 支持多页面并排预览
- [ ] 支持主题切换（亮色/暗色）
- [ ] 点击预览定位到代码
- [ ] 性能优化和缓存

---

版本格式遵循 [Semantic Versioning](https://semver.org/)

