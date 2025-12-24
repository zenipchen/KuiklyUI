# PreviewHttpServer 性能瓶颈分析

## 发现的性能瓶颈

### 1. ⚠️ **同步处理请求（最严重）**
**位置**：`routeRequest` 方法（第 233 行）

**问题**：
- 所有请求都在 `connectionQueue` 上**同步处理**
- 没有请求处理线程池
- 如果某个请求处理时间长，会阻塞后续请求的接收

**影响**：
- 高并发场景下性能严重下降
- 请求延迟累积
- 无法充分利用多核 CPU

**代码位置**：
```swift
// 在 receiveData 的回调中直接调用
self?.handleRequest(data: data, connection: connection)
// -> routeRequest
// -> handleXXXRequest (同步执行)
```

### 2. ⚠️ **主线程同步调用**
**位置**：多处使用 `DispatchQueue.main.sync`

**问题**：
- `/callNative` 请求使用 `main.sync`（第 457 行，TCP 服务器）
- `/pollCallNativeResult` 使用 `main.sync`（第 494 行，TCP 服务器）
- `/pollCallKotlinMethod` 使用 `main.sync`（第 508 行，TCP 服务器）

**影响**：
- 如果主线程繁忙，会阻塞请求处理线程
- 可能导致死锁或长时间阻塞
- 影响整体响应速度

### 3. ⚠️ **数据接收效率低**
**位置**：`receiveData` 方法（第 174 行）

**问题**：
- 使用 `receive(minimumIncompleteLength: 1, maximumLength: 65536)`
- 需要多次接收才能获取完整 HTTP 请求
- 没有缓冲区，每次接收都可能触发多次回调

**影响**：
- 增加系统调用次数
- 增加内存分配和拷贝
- 降低接收效率

### 4. ⚠️ **HTTP 解析开销**
**位置**：`handleRequest` 方法（第 202 行）

**问题**：
- 每次请求都需要完整解析 HTTP 协议
- 字符串分割和解析（`components(separatedBy:)`）
- 没有使用高效的 HTTP 解析库

**影响**：
- CPU 开销较大
- 字符串操作频繁
- 内存分配较多

### 5. ⚠️ **连接管理效率**
**位置**：`handleConnection` 方法（第 132 行）

**问题**：
- 每个连接创建独立的 `DispatchQueue`
- 连接列表使用数组，查找效率低（O(n)）
- 连接超时定时器可能泄漏

**影响**：
- 连接数多时，队列管理开销大
- 连接查找效率低
- 内存占用增加

### 6. ⚠️ **JSON 序列化开销**
**位置**：`sendJsonResponse` 方法（第 895 行）

**问题**：
- 每次响应都需要序列化 JSON
- 没有响应缓存
- 重复序列化相同数据

**影响**：
- CPU 开销较大
- 内存分配频繁

### 7. ⚠️ **没有连接复用**
**位置**：整个服务器实现

**问题**：
- HTTP/1.0 模式（`Connection: close`）
- 每个请求都创建新连接
- 没有 Keep-Alive 支持

**影响**：
- TCP 连接建立开销大
- 无法复用连接
- 增加延迟

### 8. ⚠️ **阻塞式接收循环**
**位置**：`receiveData` 方法（第 174 行）

**问题**：
- 接收循环是阻塞的
- 处理完一个请求后才接收下一个
- 没有流水线处理

**影响**：
- 无法并发处理多个请求
- 吞吐量受限

## 性能瓶颈优先级

### 🔴 **高优先级（严重影响性能）**
1. **同步处理请求** - 阻塞接收循环
2. **主线程同步调用** - 可能导致死锁和阻塞
3. **没有请求处理线程池** - 无法并发处理

### 🟡 **中优先级（影响性能）**
4. **数据接收效率低** - 增加系统调用
5. **HTTP 解析开销** - CPU 开销大
6. **连接管理效率** - 查找效率低

### 🟢 **低优先级（轻微影响）**
7. **JSON 序列化开销** - 相对较小
8. **没有连接复用** - HTTP/1.0 模式

## 优化建议

### 1. **添加请求处理线程池**（最重要）
```swift
// 创建请求处理线程池
private let requestProcessingQueue = DispatchQueue(
    label: "com.kuikly.preview.http.requestProcessing",
    attributes: .concurrent
)

// 在 receiveData 中派发请求处理
private func receiveData(from connection: NWConnection) {
    connection.receive(...) { data, _, isComplete, error in
        // 立即继续接收下一条消息
        if !isComplete && error == nil {
            self.receiveData(from: connection)
        }
        
        // 派发到请求处理队列
        if let data = data {
            self.requestProcessingQueue.async { [weak self] in
                self?.handleRequest(data: data, connection: connection)
            }
        }
    }
}
```

### 2. **避免主线程同步调用**
- 将 `main.sync` 改为 `main.async`
- 使用回调或通知机制获取结果
- 避免阻塞请求处理线程

### 3. **优化数据接收**
- 使用缓冲区累积数据
- 一次性接收更多数据
- 减少系统调用次数

### 4. **优化 HTTP 解析**
- 使用高效的 HTTP 解析库
- 缓存解析结果
- 减少字符串操作

### 5. **优化连接管理**
- 使用字典存储连接（O(1) 查找）
- 复用连接队列
- 及时清理超时连接

### 6. **支持 HTTP Keep-Alive**
- 实现连接复用
- 减少连接建立开销
- 提高吞吐量

## 对比 TCP 服务器

| 特性 | HTTP 服务器 | TCP 服务器 |
|------|------------|------------|
| 请求处理 | ❌ 同步 | ✅ 异步（已优化） |
| 线程池 | ❌ 无 | ✅ 有 |
| 主线程同步 | ⚠️ 有 | ⚠️ 有 |
| 接收效率 | ⚠️ 低 | ✅ 高 |
| 连接复用 | ❌ 无 | ✅ 有（长连接） |

## 总结

PreviewHttpServer 的主要性能瓶颈是**同步处理请求**和**没有请求处理线程池**，这与 TCP 服务器优化前的问题相同。建议采用与 TCP 服务器相同的优化方案：添加请求处理线程池，实现异步并发处理。

