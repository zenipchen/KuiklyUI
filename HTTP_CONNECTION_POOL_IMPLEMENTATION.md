# HTTP 连接池实现总结

## 实现方案

### 核心设计
1. **按 instanceId 隔离**：每个 instanceId 使用独立的连接池
2. **按请求类型分离**：callKotlinMethod 和 callNative 使用不同的连接池
3. **使用 Java 11+ HttpClient**：内置连接池支持，无需额外依赖

## 连接池分类

### 1. callKotlinMethod 连接池
**用途**：
- `/pollCallKotlinMethod` 轮询请求

**特点**：
- 高频轮询请求
- 需要保持连接活跃
- 独立连接池避免与其他请求竞争

### 2. callNative 连接池
**用途**：
- `/callNative` 请求
- `/pollCallNativeResult` 轮询请求

**特点**：
- 业务逻辑请求
- 需要快速响应
- 独立连接池避免阻塞

### 3. 通用连接池
**用途**：
- `/ping` 连接检查
- `/render` 初始化渲染
- `/destroy` 销毁实例
- `/touch` 触摸事件
- `/screenshot` 截图请求

**特点**：
- 低频或一次性请求
- 共享连接池资源

## 实现细节

### HttpClientManager
- **位置**：`mac-render-sdk/src/jvmMain/kotlin/com/tencent/kuikly/mac/sdk/HttpClientManager.kt`
- **功能**：
  - 管理所有连接池实例
  - 按 `instanceId + RequestType` 创建独立连接池
  - 提供连接池清理功能

### 连接池配置
```kotlin
HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(5))
    .executor(Executors.newFixedThreadPool(4) { ... })
    .build()
```

### 使用示例

#### callKotlinMethod 请求
```kotlin
// 使用 callKotlinMethod 专用连接池
val response = httpGet("/pollCallKotlinMethod?instanceId=$instanceId", 
    useCallKotlinMethodPool = true)
```

#### callNative 请求
```kotlin
// 使用 callNative 专用连接池
httpPost("/callNative", requestBody, useCallNativePool = true)

// pollCallNativeResult 也使用 callNative 连接池
val response = httpGet("/pollCallNativeResult?requestId=$requestId", 
    useCallNativePool = true)
```

#### 通用请求
```kotlin
// 使用通用连接池（默认）
val response = httpGet("/ping")
httpPost("/render", requestBody)
httpPost("/destroy", requestBody)
```

## 优势

### 1. 连接隔离
- 不同 instanceId 的连接互不影响
- 不同请求类型的连接互不阻塞

### 2. 性能提升
- 连接复用，减少 TCP 握手开销
- 避免连接竞争，提高并发性能

### 3. 资源管理
- 自动管理连接生命周期
- 支持按 instanceId 清理连接池

### 4. 无额外依赖
- 使用 Java 11+ 标准库
- 无需引入第三方 HTTP 客户端库

## 连接池清理

当实例销毁时，自动清理对应的连接池：

```kotlin
fun destroy() {
    // ...
    HttpClientManager.removeClients(instanceId)
    // ...
}
```

## 性能对比

### 优化前
- 每次请求创建新连接
- 连接建立时间：~10-50ms
- 高并发时连接数过多

### 优化后
- 连接复用，减少建立时间
- 连接建立时间：首次 ~10-50ms，后续 ~0ms（复用）
- 连接数可控，按 instanceId 和类型隔离

## 注意事项

1. **Java 版本要求**：需要 Java 11+（HttpClient 是 Java 11 引入的）
2. **连接池大小**：由 Java HttpClient 自动管理，通常为每个目标主机维护多个连接
3. **超时设置**：连接超时 5 秒，读取超时 5-10 秒
4. **线程安全**：HttpClient 是线程安全的，可以安全地在多线程环境中使用

## 测试建议

1. **多实例测试**：验证不同 instanceId 的连接池隔离
2. **并发测试**：验证 callKotlinMethod 和 callNative 连接池不互相影响
3. **性能测试**：对比优化前后的请求延迟和吞吐量
4. **资源清理测试**：验证实例销毁时连接池正确清理

