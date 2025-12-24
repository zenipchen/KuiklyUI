# PreviewHttpServer 锁设计优化分析

## 当前锁设计

### 1. **connectionQueue**（串行队列）
- **用途**：管理连接列表
- **操作**：添加、移除连接
- **频率**：低（连接建立/关闭时）
- **问题**：使用串行队列，但操作不频繁，影响不大

### 2. **instanceQueueLock**（串行队列）
- **用途**：管理 `instanceCallKotlinMethodQueues` 字典
- **操作**：获取或创建 instanceId 队列
- **频率**：低（每个 instanceId 只创建一次）
- **问题**：使用 `sync` 可能阻塞，但频率低，影响不大

### 3. **callNativeQueue**（并发队列 + barrier）
- **用途**：管理 `pendingCallNativeFromSdk` 字典
- **写入**：`async(flags: .barrier)` ✅
- **读取**：`sync` ⚠️ **问题：没有 barrier，可能读到不一致数据**
- **读取并移除**：`sync(flags: .barrier)` ✅

### 4. **callNativeResultsQueue**（并发队列 + barrier）
- **用途**：管理 `callNativeResults` 字典
- **写入**：`async(flags: .barrier)` ✅
- **读取**：`sync` ⚠️ **问题：没有 barrier，可能读到不一致数据**

### 5. **callKotlinMethodQueue**（并发队列 + barrier）
- **用途**：管理 `pendingCallKotlinMethodRequests` 和 `sequenceCounters`
- **写入**：`async(flags: .barrier)` ✅
- **读取并清空**：`sync(flags: .barrier)` ✅

## 发现的锁性能问题

### 🔴 **问题 1：读取操作缺少 barrier（数据竞争风险）**

**位置 1**：`getPendingCallNativeFromSdk`（第 872 行）
```swift
func getPendingCallNativeFromSdk() -> [String: CallNativeFromSdkRequest] {
    return callNativeQueue.sync {  // ⚠️ 缺少 barrier
        return pendingCallNativeFromSdk
    }
}
```
**问题**：并发队列的读取操作没有 barrier，可能与写入操作产生数据竞争

**位置 2**：`handlePollCallNativeResult`（第 499 行）
```swift
let result = callNativeResultsQueue.sync {  // ⚠️ 缺少 barrier
    return callNativeResults[requestId]
}
```
**问题**：同样的问题，读取操作没有 barrier

### 🟡 **问题 2：不必要的 barrier 使用**

**位置**：`handlePollCallKotlinMethod`（第 594 行）
```swift
callKotlinMethodQueue.sync(flags: .barrier) {
    // 读取并清空操作
    // ...
    pendingCallKotlinMethodRequests[instanceId] = []
}
```
**分析**：这个操作需要 barrier（因为要修改），但可以优化为只读操作 + 单独的写入操作

### 🟡 **问题 3：锁粒度可能过粗**

**位置**：`handlePollCallKotlinMethod`（第 594-641 行）
```swift
callKotlinMethodQueue.sync(flags: .barrier) {
    // 1. 读取数据
    // 2. 类型检查
    // 3. 排序
    // 4. 转换格式（包含 convertToSerializable 调用）
    // 5. 清空数据
}
```
**问题**：整个操作都在锁内，包括数据转换等耗时操作，锁持有时间过长

### 🟡 **问题 4：多次锁操作可以合并**

**位置**：`handleDestroyRequest`（第 671-692 行）
```swift
// 多次独立的锁操作
callKotlinMethodQueue.async(flags: .barrier) { ... }
instanceQueueLock.async { ... }
callNativeQueue.async(flags: .barrier) { ... }
callNativeResultsQueue.async(flags: .barrier) { ... }
```
**问题**：可以合并为一次操作，减少锁开销

## 优化建议

### 1. **修复数据竞争：读取操作添加 barrier**

```swift
// 优化前
func getPendingCallNativeFromSdk() -> [String: CallNativeFromSdkRequest] {
    return callNativeQueue.sync {  // ⚠️ 缺少 barrier
        return pendingCallNativeFromSdk
    }
}

// 优化后
func getPendingCallNativeFromSdk() -> [String: CallNativeFromSdkRequest] {
    return callNativeQueue.sync(flags: .barrier) {  // ✅ 添加 barrier
        return pendingCallNativeFromSdk
    }
}
```

### 2. **优化锁粒度：减少锁持有时间**

```swift
// 优化前：整个操作都在锁内
callKotlinMethodQueue.sync(flags: .barrier) {
    // 读取、排序、转换、清空都在锁内
    let sortedRequests = instanceRequests.sorted { ... }
    for (requestId, sequence, request) in sortedRequests {
        let serializableArgs = request.args.map { ... }  // 耗时操作
        requests.append([...])
    }
    pendingCallKotlinMethodRequests[instanceId] = []
}

// 优化后：只读操作在锁外
let instanceRequests = callKotlinMethodQueue.sync(flags: .barrier) {
    guard let requests = pendingCallKotlinMethodRequests[instanceId], !requests.isEmpty else {
        pendingCallKotlinMethodRequests[instanceId] = []
        return []
    }
    pendingCallKotlinMethodRequests[instanceId] = []  // 立即清空
    return requests
}

// 在锁外进行耗时操作
let sortedRequests = instanceRequests.sorted { $0.sequence < $1.sequence }
for (requestId, sequence, request) in sortedRequests {
    let serializableArgs = request.args.map { convertToSerializable($0) }
    requests.append([...])
}
```

### 3. **合并多次锁操作**

```swift
// 优化前：多次独立的锁操作
callKotlinMethodQueue.async(flags: .barrier) {
    self.pendingCallKotlinMethodRequests.removeValue(forKey: instanceId)
    self.sequenceCounters.removeValue(forKey: instanceId)
}
instanceQueueLock.async {
    self.instanceCallKotlinMethodQueues.removeValue(forKey: instanceId)
}
callNativeQueue.async(flags: .barrier) {
    self.pendingCallNativeFromSdk = self.pendingCallNativeFromSdk.filter { ... }
}
callNativeResultsQueue.async(flags: .barrier) {
    self.callNativeResults.removeAll()
}

// 优化后：合并为一次操作（如果可能）
// 注意：如果这些数据结构需要不同的锁保护，则不能合并
// 但可以考虑使用一个统一的清理队列
```

### 4. **优化连接管理：使用字典替代数组**

```swift
// 优化前：使用数组，查找效率 O(n)
private var connections: [NWConnection] = []
connectionQueue.sync {
    connections.removeAll { $0 === conn }  // O(n) 操作
}

// 优化后：使用字典，查找效率 O(1)
private var connections: [UUID: NWConnection] = [:]
connectionQueue.sync {
    connections.removeValue(forKey: connectionId)  // O(1) 操作
}
```

### 5. **减少不必要的同步操作**

对于单线程渲染场景，某些操作可能不需要严格的同步：

```swift
// 优化前：每次都同步获取
let instanceQueue = instanceQueueLock.sync {
    if let existingQueue = instanceCallKotlinMethodQueues[instanceId] {
        return existingQueue
    }
    // 创建新队列
}

// 优化后：使用读写锁或原子操作
// 或者：由于单线程渲染，可以简化锁设计
```

## 性能影响评估

### 当前锁开销（单线程渲染场景）

| 锁类型 | 操作频率 | 锁持有时间 | 性能影响 |
|--------|---------|-----------|---------|
| connectionQueue | 低 | 短 | ⚠️ 低 |
| instanceQueueLock | 低 | 短 | ⚠️ 低 |
| callNativeQueue | 中 | 短 | ⚠️ 中（读取缺少 barrier） |
| callNativeResultsQueue | 高 | 短 | ⚠️ 中（读取缺少 barrier） |
| callKotlinMethodQueue | 高 | **长** | 🔴 **高（锁持有时间过长）** |

### 优化优先级

1. **🔴 高优先级**：修复数据竞争（读取操作添加 barrier）
2. **🟡 中优先级**：优化锁粒度（减少锁持有时间）
3. **🟢 低优先级**：合并多次锁操作、优化连接管理

## 总结

主要问题：
1. **数据竞争风险**：读取操作缺少 barrier
2. **锁持有时间过长**：`handlePollCallKotlinMethod` 中数据转换在锁内
3. **锁粒度可以优化**：某些操作可以拆分，减少锁持有时间

由于客户端是单线程渲染，高并发不是主要问题，但锁的设计仍然可以优化以减少延迟和提高响应速度。

