# Kuikly Desktop - 桌面端渲染

基于 JCEF (Chromium) 的 Kuikly 桌面应用，实现跨平台桌面端渲染。

## 架构

```
┌─────────────────────────────────────────┐
│       Desktop Application (JVM)          │
│  ┌───────────────┐    ┌──────────────┐  │
│  │  Logic Layer  │◄──►│ Render Layer │  │
│  │  (JVM/Kotlin) │    │  (Chromium)  │  │
│  │               │    │              │  │
│  │ core + demo   │    │core-render-  │  │
│  │               │    │   web        │  │
│  └───────────────┘    └──────────────┘  │
│         ▲                     ▲          │
│         │    JS Bridge        │          │
│         └─────────────────────┘          │
└─────────────────────────────────────────┘
```

## 技术栈

- **逻辑层**: Kotlin/JVM + Kuikly Core + Compose
- **渲染层**: Chromium (JCEF) + core-render-web
- **UI 框架**: Swing
- **浏览器引擎**: JCEF 122.1.10 (Chromium 内核)
- **通信机制**: JS Bridge (双向)

## 功能特性

- ✅ 跨平台支持 (Windows / macOS / Linux)
- ✅ 完整的 Chromium 内核，支持所有现代 Web 特性
- ✅ 支持大文件加载 (3.69MB+ 的 JS)
- ✅ 复用 Kuikly 现有的 core 和 compose 逻辑
- ✅ 复用 core-render-web 的 Web 渲染能力
- ✅ JS Bridge 双向通信 (Web ↔ JVM)
- ✅ 开发者工具支持 (Chromium DevTools)

## 运行前提

### 1. 启动必要的服务

#### 1.1 启动 dev server (端口 8083)
提供 nativevue2.js 和静态资源：
```bash
npm run serve
```

#### 1.2 启动 h5App 开发服务器 (端口 8080)
```bash
./gradlew :h5App:jsBrowserDevelopmentRun -t
```

或使用生产版本（推荐，文件更小）：
```bash
./gradlew :h5App:jsBrowserProductionWebpack
# 然后配置静态文件服务器
```

### 2. 确保 demo 模块已配置 JVM 目标
`demo/build.gradle.kts` 应包含：
```kotlin
kotlin {
    jvm()
    // ...
}

dependencies {
    add("kspJvm", project(":core-ksp"))
}
```

## 运行方式

### 方式一：通过 Gradle 运行（推荐开发时使用）
```bash
./gradlew :desktopApp:run
```

**注意**：已自动配置必要的 JVM 参数：
- `--add-opens java.desktop/sun.awt=ALL-UNNAMED` (JCEF 需要)
- `--add-opens java.desktop/java.awt=ALL-UNNAMED`
- `--add-opens java.desktop/java.awt.peer=ALL-UNNAMED`
- `-Xmx1024m` (增加内存)

### 方式二：构建可执行 JAR
```bash
./gradlew :desktopApp:build
java --add-opens java.desktop/sun.awt=ALL-UNNAMED \
     --add-opens java.desktop/java.awt=ALL-UNNAMED \
     --add-opens java.desktop/java.awt.peer=ALL-UNNAMED \
     -Xmx1024m \
     -jar desktopApp/build/libs/desktopApp-1.0.0.jar
```

### 方式三：生成分发包
```bash
./gradlew :desktopApp:installDist
./desktopApp/build/install/desktopApp/bin/desktopApp
```

## 首次运行

⚠️ **注意**: 首次运行时，JCEF 会自动下载 Chromium 内核（约 200MB），需要：
- 良好的网络连接
- 至少 500MB 的磁盘空间
- 耐心等待 1-3 分钟

下载完成后，后续启动将非常快速。

## 调试

### 查看控制台日志
运行时会在终端输出详细日志：
- `[Kuikly Desktop]` - 桌面端日志
- `[Kuikly Bridge]` - JS Bridge 通信日志
- `[Desktop NativeBridge]` - Native 桥接日志

### 使用 Chromium DevTools
JCEF 支持 Chromium 开发者工具，可以：
1. 右键点击页面 → "Inspect" (如果支持)
2. 或在代码中启用远程调试端口
3. 访问 `chrome://inspect` 查看页面

### 常见问题排查

#### 页面空白
- 检查 dev server (8083) 和 h5App (8080) 是否正在运行
- 查看终端日志，确认资源加载状态
- 检查浏览器控制台是否有 JS 错误

#### 磁盘空间不足
```bash
# 清理 Gradle 缓存
./gradlew clean
rm -rf ~/.gradle/caches/

# 清理 JCEF 缓存
rm -rf ~/.jcef-bundle/
```

#### 加载缓慢
- 使用生产版本的 h5App.js (251KB vs 3.69MB)
- 检查网络连接
- 考虑本地打包资源文件

## JS Bridge API

### Web → JVM
Web 端调用 JVM 逻辑层：
```javascript
window.callKotlinMethod(methodId, arg0, arg1, arg2, arg3, arg4, arg5)
```

### JVM → Web
JVM 端调用 Web 渲染层：
```kotlin
bridge.callWeb(pagerId, methodName, ...args)
```

### 注册回调
Web 端注册回调供 JVM 调用：
```javascript
com.tencent.kuikly.core.nvi.registerCallNative(pagerId, callback)
```

## 项目结构

```
desktopApp/
├── build.gradle.kts              # Gradle 构建配置
├── README.md                      # 本文档
└── src/main/kotlin/
    └── com/tencent/kuikly/desktop/
        └── Main.kt                # 主程序入口
            ├── main()             # 应用入口
            ├── KuiklyJSBridge     # JS Bridge 实现
            └── DesktopNativeBridge # Native 桥接实现
```

## 性能优化建议

1. **使用生产版本**
   ```bash
   ./gradlew :h5App:jsBrowserProductionWebpack
   ```
   将 3.69MB 减少到 251KB

2. **启用硬件加速**
   默认已启用 GPU 加速

3. **减少 Bridge 调用频率**
   - 批量更新而非逐个更新
   - 使用节流/防抖

4. **优化页面加载**
   - 预加载常用资源
   - 使用 CDN 加速

## 与其他平台对比

| 平台 | 逻辑层 | 渲染层 | 通信机制 |
|------|--------|--------|----------|
| Android | JVM | Native View | JNI |
| iOS | Native | Native View | ObjC Bridge |
| H5 | JS | Web DOM | 直接调用 |
| 小程序 | JS | 小程序组件 | JSBridge |
| **Desktop** | **JVM** | **Chromium** | **JS Bridge** |

## 开发路线图

- [x] 基础框架搭建
- [x] JCEF 集成
- [x] JS Bridge 双向通信
- [x] BridgeManager 集成
- [ ] KuiklyCoreEntry 初始化
- [ ] 完整的页面路由支持
- [ ] 开发者工具集成
- [ ] 性能监控和优化
- [ ] 打包和分发工具

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

与 Kuikly 主项目保持一致。
