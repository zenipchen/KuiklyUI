# TCP 服务器请求处理方式分析

## 当前实现

### 1. **接收线程**
- **队列**：`connectionQueue`（串行队列）
- **位置**：`PreviewTcpServer.swift:35`
- **作用**：所有连接的接收操作都在这个队列上执行

### 2. **请求处理方式**

#### ✅ **同步处理**（大部分请求）
以下请求在 `connectionQueue` 上**同步处理**，会阻塞后续请求的接收：

1. **`/ping`** - 直接返回，很快
2. **`/pollCallNativeResult`** - 同步读取结果
3. **`/pollCallKotlinMethod`** - 同步读取请求队列
4. **`/callNative`** - 使用 `DispatchQueue.main.sync`（同步等待）
5. **`/callNativeResult`** - 派发到主线程异步处理，但先发送响应
6. **`/destroy`** - 派发到主线程异步处理，但先发送响应
7. **`/touch`** - 派发到主线程异步处理，但先发送响应
8. **`/screenshot`** - 需要检查实现
9. **`/listInstances`** - 派发到主线程异步处理

#### ⚠️ **异步处理**（少数请求）
以下请求会派发到其他队列异步处理：

1. **`/render`** - 先发送响应，然后派发到 `DispatchQueue.main.async`
2. **`/callKotlinMethod`** - 派发到 `instanceQueue.async`（每个 instanceId 的单线程队列）

## 性能问题

### 问题 1：同步处理阻塞接收
- **影响**：如果某个请求处理时间较长（如 `/callNative` 使用 `main.sync`），会阻塞 `connectionQueue`
- **后果**：后续请求无法及时接收，导致延迟累积

### 问题 2：没有请求处理线程池
- **当前**：所有请求处理都在 `connectionQueue` 上
- **问题**：无法并发处理多个请求
- **影响**：高并发场景下性能下降

### 问题 3：主线程同步调用
- **`/callNative`** 使用 `DispatchQueue.main.sync`
- **问题**：如果主线程繁忙，会阻塞 `connectionQueue`
- **影响**：可能导致死锁或长时间阻塞

## 优化实现 ✅

### 已实现：请求处理线程池
```swift
// 创建请求处理线程池（并发队列）
private let requestProcessingQueue = DispatchQueue(
    label: "com.kuikly.preview.tcp.requestProcessing",
    attributes: .concurrent
)

// 在 receiveData 中派发请求处理
private func receiveData(...) {
    // ... 接收数据 ...
    
    // 立即继续接收下一条消息（不等待请求处理完成）
    if connection.state == .ready {
        self.receiveData(from: connection, connectionId: connectionId)
    }
    
    // 派发到请求处理队列（异步处理，不阻塞接收）
    self.requestProcessingQueue.async { [weak self] in
        self?.handleMessage(type: messageType, json: json, connection: connection, connectionId: connectionId)
    }
}
```

### 优化效果
- ✅ 接收循环不阻塞，能及时接收新请求
- ✅ 支持并发处理多个请求
- ✅ 避免同步处理导致的延迟累积
- ✅ 提高整体吞吐量

### 方案 2：异步处理所有请求
- 所有请求处理都派发到异步队列
- 接收循环不等待请求处理完成
- 支持并发处理多个请求

### 方案 3：混合方案
- 快速请求（如 `/ping`）：同步处理
- 慢速请求（如 `/render`、`/callNative`）：异步处理
- 使用请求队列管理并发数量

## 当前代码位置

- **接收数据**：`PreviewTcpServer.swift:148` - `receiveData`
- **处理消息**：`PreviewTcpServer.swift:239` - `handleMessage`
- **处理请求**：`PreviewTcpServer.swift:253` - `handleRequest`
- **连接队列**：`PreviewTcpServer.swift:35` - `connectionQueue`

