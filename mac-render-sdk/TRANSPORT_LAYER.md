# 通信层架构设计文档

## 概述

通信层已重构为可插拔的架构，支持不同的底层实现（HTTP、TCP 等）。通过 `Transport` 接口抽象，可以轻松切换底层通信协议。

## 架构设计

### 核心接口

#### `Transport` 接口

定义了统一的通信接口：

```kotlin
interface Transport {
    fun init(instanceId: String)
    fun get(path: String, requestType: RequestType = RequestType.GENERAL): JsonObject?
    fun post(path: String, body: Map<String, Any?>, requestType: RequestType = RequestType.GENERAL): JsonObject?
    fun getBytes(path: String): ByteArray?
    fun destroy()
}
```

### 实现类

#### 1. `HttpTransport`（当前默认实现）

使用 `HttpURLConnection` 实现 HTTP 通信。

**特点**：
- 简单直接，兼容现有 HTTP 服务器
- 每次请求创建新连接
- 适合开发和测试

**使用示例**：
```kotlin
val transport = HttpTransport(
    Transport.Config(
        serverHost = "localhost",
        serverPort = 9527,
        connectTimeout = 1000,
        readTimeout = 1000
    )
)

val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9527,
    transport = transport
)
```

#### 2. `TcpTransport`（预留实现）

使用 TCP Socket 实现二进制协议通信。

**特点**：
- 长连接，减少连接开销
- 二进制协议，性能更高
- 支持推送消息（Notification）

**协议设计**：
- 消息格式：`长度(4字节) + 类型(1字节) + 数据(JSON/二进制)`
- 消息类型：`REQUEST(0)`, `RESPONSE(1)`, `NOTIFICATION(2)`
- 支持请求/响应配对（通过 requestId）

**使用示例**：
```kotlin
val transport = TcpTransport(
    Transport.Config(
        serverHost = "localhost",
        serverPort = 9528, // TCP 端口
        connectTimeout = 1000,
        readTimeout = 1000
    )
)

val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9528,
    transport = transport
)
```

## 使用方式

### 默认使用（HTTP）

如果不指定 `transport` 参数，SDK 会自动创建 `HttpTransport`：

```kotlin
val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9527
)
// 内部自动创建 HttpTransport
```

### 自定义传输层

```kotlin
// 创建自定义传输层
val customTransport = HttpTransport(
    Transport.Config(
        serverHost = "localhost",
        serverPort = 9527,
        connectTimeout = 2000, // 自定义超时
        readTimeout = 2000
    )
)

// 使用自定义传输层
val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9527,
    transport = customTransport
)
```

## 请求类型

`Transport.RequestType` 用于区分不同类型的请求，便于连接池管理：

- `CALL_KOTLIN_METHOD`：callKotlinMethod 轮询请求
- `CALL_NATIVE`：callNative 请求和结果轮询
- `GENERAL`：其他通用请求（ping, render, destroy, touch, screenshot）

## 扩展新的传输层

### 实现步骤

1. **实现 `Transport` 接口**：
```kotlin
class MyCustomTransport(
    private val config: Transport.Config
) : Transport {
    override fun init(instanceId: String) {
        // 初始化连接
    }
    
    override fun get(path: String, requestType: Transport.RequestType): JsonObject? {
        // 实现 GET 请求
    }
    
    override fun post(path: String, body: Map<String, Any?>, requestType: Transport.RequestType): JsonObject? {
        // 实现 POST 请求
    }
    
    override fun getBytes(path: String): ByteArray? {
        // 实现二进制数据获取
    }
    
    override fun destroy() {
        // 清理资源
    }
}
```

2. **使用自定义传输层**：
```kotlin
val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    transport = MyCustomTransport(config)
)
```

## 优势

### 1. 可插拔性

- 业务逻辑与通信协议解耦
- 可以轻松切换底层实现
- 支持多种协议并存

### 2. 易于测试

- 可以创建 Mock Transport 进行单元测试
- 可以创建测试专用的 Transport 实现

### 3. 易于扩展

- 新增协议只需实现 `Transport` 接口
- 不影响现有代码
- 向后兼容

### 4. 性能优化

- 不同协议可以针对性地优化
- TCP 传输层可以使用长连接和连接池
- HTTP 传输层可以支持 HTTP/2

## 迁移指南

### 从旧版本迁移

旧版本代码：
```kotlin
val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9527
)
```

新版本代码（无需修改）：
```kotlin
// 完全兼容，自动使用 HttpTransport
val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9527
)
```

### 切换到 TCP

当 Mac 端支持 TCP 协议后：

```kotlin
val transport = TcpTransport(
    Transport.Config(
        serverHost = "localhost",
        serverPort = 9528
    )
)

val sdk = KuiklyMacRenderSdk(
    pageName = "HelloWorldPage",
    serverHost = "localhost",
    serverPort = 9528,
    transport = transport
)
```

## 注意事项

1. **TCP 传输层**：当前实现为预留接口，需要 Mac 端实现对应的 TCP 服务器
2. **连接管理**：不同传输层的连接管理策略不同，需要根据实际情况调整
3. **错误处理**：所有传输层方法返回 `null` 表示失败，需要调用方处理
4. **线程安全**：`Transport` 实现应该是线程安全的

## 未来计划

1. **WebSocket 传输层**：支持 WebSocket 协议，实现真正的双向通信
2. **HTTP/2 传输层**：使用 HTTP/2 提升 HTTP 性能
3. **连接池优化**：为不同传输层实现连接池管理
4. **消息压缩**：支持消息压缩，减少网络传输

