# Kuikly IDEA Plugin 使用手册

## 📚 目录

1. [安装](#安装)
2. [首次使用](#首次使用)
3. [日常工作流](#日常工作流)
4. [高级功能](#高级功能)
5. [故障排除](#故障排除)

## 安装

### 步骤 1: 构建 Plugin

```bash
cd /path/to/KuiklyUI/kuikly-idea-plugin
./gradlew buildPlugin
```

构建产物位于：`build/distributions/kuikly-idea-plugin-1.0.0.zip`

### 步骤 2: 安装到 IDEA

1. 打开 IntelliJ IDEA
2. `File` -> `Settings` -> `Plugins`
3. 点击右上角的 `⚙️` 图标
4. 选择 `Install Plugin from Disk...`
5. 选择构建好的 zip 文件
6. 点击 `OK` 并重启 IDEA

### 步骤 3: 验证安装

重启后，检查：
- `View` -> `Tool Windows` 中是否有 `Kuikly Preview`
- `Main Menu` 中是否有 `Kuikly` 菜单

## 首次使用

### 1. 构建 h5App

在使用 Plugin 之前，必须先构建 h5App：

```bash
cd /path/to/KuiklyUI
./gradlew :h5App:jsBrowserDevelopmentWebpack
```

这个命令会将 Kotlin 代码编译为 JavaScript，生成 `h5App.js` 文件。

**预期输出**:
```
BUILD SUCCESSFUL in 30s
```

**验证**:
检查文件是否存在：
- `h5App/build/dist/js/developmentExecutable/h5App.js`

### 2. 打开 Kuikly 项目

用 IDEA 打开 KuiklyUI 项目：
```
File -> Open -> 选择 KuiklyUI 目录
```

### 3. 打开预览窗口

**方式 1: 通过菜单**
```
View -> Tool Windows -> Kuikly Preview
```

**方式 2: 通过快捷键**
- Windows/Linux: `Ctrl+Alt+P`
- Mac: `Cmd+Option+P`

### 4. 首次加载

首次打开预览窗口时，Plugin 会：
1. 启动本地开发服务器 (端口 8765)
2. 启动文件监听器
3. 扫描项目中的 @Page 注解
4. 显示页面列表

**状态指示**:
- ✅ 正常：状态栏显示 "✅ 找到 X 个页面"
- ❌ 错误：状态栏显示错误信息

## 日常工作流

### 典型的开发流程

```
1. 打开预览窗口
   ↓
2. 选择要开发的页面
   ↓
3. 在编辑器中修改代码
   ↓
4. 保存文件 (Ctrl+S / Cmd+S)
   ↓
5. 等待 2-3 秒（自动编译）
   ↓
6. 预览窗口自动刷新 ✨
```

### 示例：修改一个页面

假设我们要修改 `HelloWorldPage`:

**步骤 1**: 在预览窗口选择 "HelloWorldPage"

**步骤 2**: 打开源文件
```kotlin
// demo/src/commonMain/kotlin/pages/HelloWorldPage.kt

@Page(name = "HelloWorldPage")
class HelloWorldPage : Pager() {
    private val text = observable("Hello Kuikly!")
    
    override fun body() = view(ctx) {
        Text(text = text.get())
    }
}
```

**步骤 3**: 修改代码
```kotlin
private val text = observable("Hello Kuikly! 🎉")  // 添加 emoji
```

**步骤 4**: 保存文件 (Ctrl+S)

**步骤 5**: 观察预览窗口
- 控制台输出：
  ```
  📝 Kotlin file changed, triggering compilation...
  🔨 Running: ./gradlew :h5App:jsBrowserDevelopmentWebpack --quiet
  ✅ Compilation successful (2543ms)
  📤 Reload notification sent
  ```
- 预览窗口自动刷新，显示新文本 ✨

### 使用 Compose DSL

对于 Compose DSL 页面：

```kotlin
@Page(name = "MyComposePage")
class MyComposePage : ComposeContainer() {
    override fun ComposeScene.setContent() {
        MyComposeUI()
    }
}

@HotPreview
@Composable
fun MyComposeUI() {
    Column {
        Text("Hello from Compose!")
        Button(onClick = {}) {
            Text("Click Me")
        }
    }
}
```

修改 `MyComposeUI` 后保存，预览同样会自动刷新。

## 高级功能

### 1. 设备尺寸切换

在设备下拉框中选择不同的设备：

**手机系列**:
- 手机 (小) - 360×640 - 适合测试小屏幕适配
- 手机 (中) - 390×844 - iPhone 13 Pro 尺寸
- 手机 (大) - 414×896 - iPhone 11 Pro Max 尺寸

**平板系列**:
- 平板 7" - 600×960 - 小型平板
- 平板 10" - 800×1280 - 标准平板

**使用场景**:
```
开发响应式布局时，快速切换设备查看效果：
1. 选择 "手机 (小)" - 验证最小尺寸
2. 选择 "手机 (大)" - 验证大屏手机
3. 选择 "平板 10"" - 验证平板布局
```

### 2. Chrome DevTools

点击 "🔧 DevTools" 按钮打开完整的 Chrome 开发者工具。

**Console 面板** - 查看日志：
```javascript
console.log('Debug info')
// 在 Console 中可以看到所有 console.log 输出
```

**Network 面板** - 监控请求：
- 查看图片加载
- 监控 API 请求
- 检查 WebSocket 连接

**Elements 面板** - 检查 DOM：
- 查看生成的 HTML 结构
- 实时修改 CSS 样式
- 定位 UI 元素

**Sources 面板** - 调试 JavaScript：
- 设置断点
- 单步调试
- 查看调用栈

**Performance 面板** - 性能分析：
- 录制性能数据
- 分析卡顿原因
- 优化渲染性能

### 3. 手动刷新

虽然有自动热重载，但有时需要手动刷新：

**场景**:
- 热重载失败
- 想立即看到效果（不等编译）
- 测试页面初始化逻辑

**方法**:
- 点击 "🔄 刷新" 按钮
- 快捷键: `Ctrl+Alt+R` (Win/Linux) 或 `Cmd+Option+R` (Mac)

### 4. 重新扫描页面

当你新创建了一个 @Page 类时：

**步骤**:
1. 点击 "📋 扫描" 按钮
2. 等待扫描完成
3. 在页面下拉框中选择新页面

### 5. 编辑器右键预览

在编辑器中打开带 @Page 注解的类：

**步骤**:
1. 右键点击代码
2. 选择 "预览此页面"
3. 预览窗口自动打开并加载该页面

## 故障排除

### 问题 1: 无法启动服务器

**错误信息**:
```
❌ Failed to start server: Address already in use
```

**原因**: 端口 8765 被占用

**解决**:

Mac/Linux:
```bash
# 查找占用进程
lsof -i :8765

# 示例输出
COMMAND   PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
java    12345 user   123u  IPv6 0x...      0t0  TCP *:8765 (LISTEN)

# 杀死进程
kill -9 12345
```

Windows:
```cmd
# 查找占用进程
netstat -ano | findstr :8765

# 示例输出
TCP    0.0.0.0:8765    0.0.0.0:0    LISTENING    12345

# 杀死进程
taskkill /PID 12345 /F
```

### 问题 2: h5App 未构建

**错误信息**:
```
❌ h5App build output not found!
Please build the project first:
  ./gradlew :h5App:jsBrowserDevelopmentWebpack
```

**解决**:
```bash
cd /path/to/KuiklyUI
./gradlew :h5App:jsBrowserDevelopmentWebpack
```

**验证**:
检查文件是否存在：
```bash
ls h5App/build/dist/js/developmentExecutable/h5App.js
```

### 问题 3: 页面列表为空

**错误信息**:
```
⚠️ 未找到 @Page 注解的页面
```

**原因**:
1. 项目中没有 @Page 注解的类
2. @Page 类不在 demo 目录下
3. 项目索引未完成

**解决**:

**检查 @Page 类**:
```kotlin
// 确保有这样的类存在
@Page(name = "HelloWorldPage")  // ✅ 正确
class HelloWorldPage : Pager() {
    // ...
}

// 常见错误
// @Page  // ❌ 缺少 name 参数
class HelloWorldPage : Pager() {
    // ...
}
```

**检查文件位置**:
```
✅ 正确位置:
demo/src/commonMain/kotlin/com/tencent/kuikly/demo/pages/HelloWorldPage.kt

❌ 错误位置:
core/src/commonMain/kotlin/pages/HelloWorldPage.kt
```

**重建索引**:
```
File -> Invalidate Caches / Restart -> Invalidate and Restart
```

### 问题 4: 热重载不工作

**症状**: 修改代码后预览不更新

**检查清单**:

1. **查看控制台日志**
   - IDEA 的 "Run" 面板
   - 查找编译错误

2. **检查 WebSocket 连接**
   - 打开 DevTools
   - 切换到 Console 面板
   - 查找 "✅ Hot reload connected" 消息
   - 如果显示 "⚠️ Hot reload disconnected"，说明连接断开

3. **手动触发编译**
   ```bash
   ./gradlew :h5App:jsBrowserDevelopmentWebpack
   ```

4. **重启 Plugin**
   - 关闭预览窗口
   - 重新打开

### 问题 5: JCEF 不支持

**错误信息**:
```
❌ JCEF 不支持
Kuikly Preview 需要 JCEF (Java Chromium Embedded Framework) 支持。
请升级到 IntelliJ IDEA 2020.2 或更高版本。
```

**解决**:
1. 检查 IDEA 版本: `Help` -> `About`
2. 如果低于 2020.2，下载最新版本
3. 推荐使用 IDEA 2024.2 或更高版本

### 问题 6: 编译超时

**错误信息**:
```
⚠️ Compilation timeout (60s)
```

**原因**:
- 首次编译较慢
- 项目依赖较多
- 机器性能不足

**解决**:
1. 增加超时时间（修改 `KotlinJsCompiler.kt`）
2. 使用更快的机器
3. 启用 Gradle 守护进程:
   ```properties
   # gradle.properties
   org.gradle.daemon=true
   org.gradle.parallel=true
   org.gradle.caching=true
   ```

## 最佳实践

### 1. 开发流程

**推荐**:
```
1. 启动 IDEA 后立即打开预览窗口
2. 保持预览窗口在右侧显示
3. 编辑器在左侧，边写代码边看效果
4. 使用双屏幕效果更佳
```

### 2. 性能优化

**首次编译**:
```bash
# 首次编译使用 production 模式（更快）
./gradlew :h5App:jsBrowserProductionWebpack

# 开发时使用 development 模式（更快的增量编译）
./gradlew :h5App:jsBrowserDevelopmentWebpack
```

**启用编译缓存**:
```properties
# gradle.properties
kotlin.incremental.js=true
kotlin.incremental.js.ir=true
org.gradle.caching=true
```

### 3. 调试技巧

**使用 Console 日志**:
```kotlin
// Kotlin 代码中
println("Debug: $variable")

// JavaScript 代码中（通过 DevTools Console 查看）
console.log("Debug:", variable)
```

**断点调试**:
1. 打开 DevTools
2. 切换到 Sources 面板
3. 在 h5App.js 中设置断点
4. 刷新页面，触发断点

### 4. 团队协作

**共享配置**:
```bash
# .gitignore
# 不要忽略这些文件，方便团队共享配置
!kuikly-idea-plugin/build.gradle.kts
!kuikly-idea-plugin/src/
```

**统一环境**:
- 团队使用相同版本的 IDEA
- 统一 Kotlin 版本
- 统一 Gradle 版本

## 快捷键汇总

| 功能 | Windows/Linux | Mac |
|------|--------------|-----|
| 打开预览 | Ctrl+Alt+P | Cmd+Option+P |
| 刷新预览 | Ctrl+Alt+R | Cmd+Option+R |
| 保存文件 | Ctrl+S | Cmd+S |
| 查找文件 | Ctrl+Shift+N | Cmd+Shift+O |
| 查找类 | Ctrl+N | Cmd+O |

## 更多帮助

- 📖 [设计文档](../docs/kuikly-idea-plugin-design-web.md)
- 🐛 [问题反馈](https://github.com/Tencent/KuiklyUI/issues)
- 💬 [技术讨论]()

---

**版本**: 1.0.0  
**更新时间**: 2025-10-01  
**维护者**: Tencent Kuikly Team

