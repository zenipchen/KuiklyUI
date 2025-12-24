# PreviewHttpServer 性能瓶颈分析

## 🔴 严重瓶颈

### 1. 连接管理效率低
**问题**：
- 每个请求都创建新连接，没有连接复用
- `connections` 数组使用同步队列管理，高并发时成为瓶颈
- 连接关闭后立即销毁，无法复用

**影响**：
- 高并发时连接建立/销毁开销大
- TCP 握手时间（~10-50ms）影响响应速度
- 连接数过多可能导致系统资源耗尽

**代码位置**：
```swift
// 第 46 行：connections 数组
private var connections: [NWConnection] = []
private let connectionQueue = DispatchQueue(label: "com.kuikly.preview.connections")

// 第 132-157 行：每个连接都在独立队列上
private func handleConnection(_ connection: NWConnection) {
    let connectionQueue = DispatchQueue(label: "com.kuikly.preview.connection.\(UUID().uuidString)", ...)
}
```

### 2. 轮询机制效率低
**问题**：
- 客户端需要频繁轮询（每 10ms），产生大量空请求
- 没有长轮询（Long Polling）机制
- 每次轮询都建立新连接

**影响**：
- 每秒产生大量 HTTP 请求（100+ 次/实例）
- 大部分请求返回空结果，浪费带宽和 CPU
- 增加服务器负载

**代码位置**：
```swift
// 第 560-620 行：handlePollCallKotlinMethod
// 第 465-499 行：handlePollCallNativeResult
// 都是立即返回，没有等待机制
```

### 3. 主线程阻塞风险
**问题**：
- 渲染操作在主线程执行（第 303-344 行）
- 截图操作在主线程执行（第 698-712 行）
- 触摸事件在主线程处理（第 679-688 行）

**影响**：
- 高并发时主线程可能被阻塞
- UI 响应变慢
- 请求处理延迟增加

**代码位置**：
```swift
// 第 303 行：渲染在主线程
DispatchQueue.main.async {
    // 创建 ViewController，可能耗时
}

// 第 698 行：截图在主线程
DispatchQueue.main.async { [weak self] in
    // 截图操作
}
```

### 4. 同步操作过多
**问题**：
- 大量使用 `sync` 操作（barrier 同步）
- `callKotlinMethodQueue.sync(flags: .barrier)` 阻塞调用线程
- `callNativeQueue.sync(flags: .barrier)` 阻塞调用线程

**影响**：
- 阻塞调用线程，降低并发性能
- 高并发时可能形成锁竞争
- 响应延迟增加

**代码位置**：
```swift
// 第 567 行：同步读取请求
callKotlinMethodQueue.sync(flags: .barrier) {
    // 读取并清空请求
}

// 第 847 行：同步获取并移除
callNativeQueue.sync(flags: .barrier) {
    // 原子操作
}
```

## 🟡 中等瓶颈

### 5. JSON 序列化开销
**问题**：
- 每次请求都进行 JSON 序列化/反序列化
- `convertToSerializable` 递归处理复杂对象
- 没有缓存机制

**影响**：
- CPU 开销大（特别是复杂对象）
- 内存分配频繁
- 响应时间增加

**代码位置**：
```swift
// 第 502-556 行：convertToSerializable 递归转换
// 第 863 行：每次响应都序列化
guard let jsonData = try? JSONSerialization.data(withJSONObject: json, ...)
```

### 6. 内存累积
**问题**：
- `pendingCallKotlinMethodRequests` 可能累积大量请求
- `callNativeResults` 可能累积未清理的结果
- `pendingCallNativeFromSdk` 可能累积请求

**影响**：
- 内存占用持续增长
- 可能导致内存泄漏
- 影响 GC 性能

**代码位置**：
```swift
// 第 773 行：按 instanceId 存储请求
private var pendingCallKotlinMethodRequests: [String: [(...)]]

// 第 769 行：存储结果
private var callNativeResults: [String: Any] = [:]

// 第 764 行：存储 callNative 请求
private var pendingCallNativeFromSdk: [String: CallNativeFromSdkRequest] = [:]
```

### 7. 字符串操作开销
**问题**：
- HTTP 请求解析使用字符串分割（第 182 行）
- 查询参数解析使用字符串分割（第 270-282 行）
- 响应构建使用字符串拼接（第 869-877 行）

**影响**：
- 字符串操作开销大
- 内存分配频繁
- 性能不如二进制协议

**代码位置**：
```swift
// 第 182 行：字符串分割
let lines = requestString.components(separatedBy: "\r\n")

// 第 270 行：查询参数解析
let pairs = queryString.split(separator: "&")

// 第 869 行：字符串拼接响应
let response = """
HTTP/1.1 \(statusCode) OK\r
...
"""
```

## 🟢 轻微瓶颈

### 8. 没有请求限流
**问题**：
- 没有请求速率限制
- 没有连接数限制
- 可能被恶意请求攻击

**影响**：
- 资源可能被耗尽
- 正常请求可能被阻塞

### 9. 错误处理不完善
**问题**：
- 某些错误只打印日志，不返回错误响应
- 异常情况可能导致连接泄漏

**影响**：
- 调试困难
- 资源泄漏风险

### 10. 没有监控和统计
**问题**：
- 没有请求计数
- 没有响应时间统计
- 没有错误率统计

**影响**：
- 无法监控性能
- 难以定位问题

## 📊 性能影响总结

| 瓶颈 | 严重程度 | 影响范围 | 优化优先级 |
|------|---------|---------|-----------|
| 连接管理 | 🔴 高 | 所有请求 | P0 |
| 轮询机制 | 🔴 高 | 轮询请求 | P0 |
| 主线程阻塞 | 🔴 高 | 渲染/截图 | P0 |
| 同步操作 | 🔴 高 | 所有请求 | P1 |
| JSON 序列化 | 🟡 中 | 所有请求 | P1 |
| 内存累积 | 🟡 中 | 长期运行 | P1 |
| 字符串操作 | 🟡 中 | 所有请求 | P2 |
| 请求限流 | 🟢 低 | 安全 | P2 |
| 错误处理 | 🟢 低 | 稳定性 | P2 |
| 监控统计 | 🟢 低 | 运维 | P3 |

## 🚀 优化建议

### P0 优先级（立即优化）

1. **实现长轮询（Long Polling）**
   - 客户端请求时，如果没有数据，保持连接等待
   - 有数据时立即返回，减少空轮询

2. **连接复用**
   - 使用 HTTP/1.1 Keep-Alive
   - 复用连接处理多个请求

3. **异步处理渲染操作**
   - 将渲染操作移到后台线程
   - 只在必要时切换到主线程

### P1 优先级（短期优化）

4. **减少同步操作**
   - 使用异步队列替代同步操作
   - 使用无锁数据结构（如原子操作）

5. **优化 JSON 序列化**
   - 使用更快的序列化库（如 Codable）
   - 缓存序列化结果

6. **内存管理优化**
   - 定期清理过期请求和结果
   - 限制队列大小

### P2 优先级（长期优化）

7. **使用二进制协议**
   - 考虑使用 Protocol Buffers 或 MessagePack
   - 减少序列化开销

8. **实现请求限流**
   - 限制每个 instanceId 的请求速率
   - 限制总连接数

9. **完善监控**
   - 添加请求计数和响应时间统计
   - 添加错误率监控

