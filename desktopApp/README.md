# Kuikly Desktop (JVM)

基于 JavaFX WebView 的桌面宿主，复用 `core-render-web` 的渲染能力，逻辑层运行在 JVM（`core`/`compose`），通过 JS Bridge 双向通信：

- Web -> Kotlin: `window.callKotlinMethod(methodId, ...args)`
- Kotlin(JS) -> Web: `com.tencent.kuikly.core.nvi.registerCallNative(pagerId, callback)`（已在宿主注入实现）

## 运行

1. 启动 demo/h5 dev server（供 h5App.js）：
```bash
npm run serve
./gradlew :demo:packLocalJsBundleDebug
./gradlew :h5App:jsBrowserDevelopmentRun -t
```

2. 运行 Desktop：
```bash
./gradlew :desktopApp:run
```

默认从 `http://localhost:8080/h5App.js` 加载。若使用打包产物，可修改 `desktopApp/src/main/resources/index.html` 的脚本地址为本地文件 URL。

## 注意

- 需要 JDK 17+ 与 JavaFX（本项目通过 `org.openjfx` 依赖携带）。
- 如果是 Apple Silicon，请确保依赖的 JavaFX 平台后缀为 `mac-aarch64`（Gradle 已按 OS 选择）。


