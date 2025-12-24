# TCP 通信测试总结

## 已完成的修改

### 1. 默认切换到 TCP 传输层

**修改文件**：
- `KuiklyMacRenderSdk.kt`: 默认使用 `TcpTransport` 替代 `HttpTransport`
- `KuiklyMacPreviewRunner.kt`: 默认端口改为 9528
- `Main.kt`: 默认端口改为 9528
- `run_desktopAppWithMacRender.sh`: 检查端口改为 9528

**变更内容**：
```kotlin
// 之前：默认使用 HttpTransport
private val transportImpl: Transport = transport ?: HttpTransport(...)

// 现在：默认使用 TcpTransport
private val transportImpl: Transport = transport ?: TcpTransport(...)
```

### 2. 端口配置

- **HTTP 端口**: 9527（保留，用于兼容）
- **TCP 端口**: 9528（默认使用）

### 3. Mac 端 TCP 服务器

- `PreviewTcpServer.swift`: 已实现并添加到项目
- 在 `PreviewMacApp.init()` 中自动启动
- 支持所有 HTTP 端点的 TCP 版本

## 测试步骤

### 1. 启动 PreviewMacApp

```bash
cd PreviewMacApp
# 在 Xcode 中运行，或使用构建产物
open build/Build/Products/Debug/PreviewMacApp.app
```

### 2. 验证 TCP 服务器运行

```bash
# 检查端口 9528 是否被监听
lsof -i :9528

# 或使用测试脚本
./test_tcp_connection.sh
```

### 3. 启动桌面应用

```bash
# 方式1：使用启动脚本
./run_desktopAppWithMacRender.sh --with-mac

# 方式2：直接运行
./gradlew :desktopAppWithMacRender:run
```

### 4. 验证 TCP 通信

观察日志输出：
- `[TcpTransport] ✅ TCP 连接已建立`
- `[TcpServer] ✅ TCP 服务已启动，端口: 9528`
- `[TcpServer] 📱 处理渲染请求`

## 预期结果

1. **连接成功**：
   - JVM 端显示：`[TcpTransport] ✅ TCP 连接已建立`
   - Mac 端显示：`[TcpServer] ✅ TCP 服务已启动`

2. **渲染成功**：
   - 页面正常渲染
   - callKotlinMethod 和 callNative 正常通信

3. **性能提升**：
   - 连接复用（长连接）
   - 减少连接建立开销
   - 降低端口占用

## 故障排查

### 问题1：端口 9528 未被监听

**原因**：PreviewMacApp 未启动或 TCP 服务器启动失败

**解决**：
1. 检查 PreviewMacApp 是否运行
2. 查看 Xcode 控制台日志
3. 确认 TCP 服务器已启动

### 问题2：TCP 连接失败

**原因**：防火墙或网络配置问题

**解决**：
1. 检查防火墙设置
2. 确认 localhost 连接正常
3. 查看错误日志

### 问题3：消息解析失败

**原因**：协议格式不匹配

**解决**：
1. 检查消息格式（长度+类型+数据）
2. 确认字节序（大端序）
3. 查看日志中的错误信息

## 回退方案

如果需要回退到 HTTP：

```kotlin
val transport = HttpTransport(
    Transport.Config(
        serverHost = "localhost",
        serverPort = 9527  // HTTP 端口
    )
)

val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9527,
    transport = transport
)
```

