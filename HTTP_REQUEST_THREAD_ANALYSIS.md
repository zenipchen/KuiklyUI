# HTTP 请求线程模型分析

## 当前实现

### HTTP 请求方法
- `httpGet(path: String)`: 同步 GET 请求
- `httpPost(path: String, body: Map<String, Any?>)`: 同步 POST 请求  
- `httpGetBytes(path: String)`: 同步 GET 请求（返回字节数组）

**特点**:
- 使用 `HttpURLConnection`，每次请求创建新连接
- 同步阻塞调用
- 没有连接池
- 没有线程安全保护（但 HttpURLConnection 本身是线程安全的）

### 调用来源分析

#### 1. 单线程执行器中的调用
- **`pollCallNativeResult`**: 在 `instanceCallNativePollExecutor`（单线程）中调用 `httpGet`
- **`startPolling`**: 在 `instancePollExecutor`（单线程）中调用 `httpGet`

#### 2. 多线程并发调用
- **`callNative`**: 可能从任何业务线程调用 `httpPost`（**并发**）
- **`captureScreenshot`**: 从截图轮询线程调用 `httpGetBytes`（**并发**）
- **`sendTouchEvent`**: 从触摸事件线程调用 `httpPost`（**并发**）
- **`ping`**: 可能从任何线程调用 `httpGet`（**并发**）
- **`initRender`**: 可能从任何线程调用 `httpPost`（**并发**）
- **`destroy`**: 可能从任何线程调用 `httpPost`（**并发**）

## 结论

### ✅ 多线程并发
HTTP 请求**可能从多个线程并发执行**，包括：
- 业务逻辑线程（callNative）
- 截图轮询线程（captureScreenshot）
- 触摸事件线程（sendTouchEvent）
- 轮询线程（pollCallKotlinMethod, pollCallNativeResult）

### ⚠️ 潜在问题

1. **连接数过多**
   - 每次请求都创建新连接
   - 并发请求时可能同时存在多个连接
   - 没有连接复用，效率较低

2. **资源浪费**
   - TCP 连接建立和销毁开销
   - 没有连接池，无法复用连接

3. **可能的性能瓶颈**
   - 高并发时可能达到系统连接数限制
   - 连接建立时间影响响应速度

## 优化建议

### 方案 1: 使用 HTTP 连接池 ⭐ 推荐
**优点**:
- 复用连接，减少开销
- 提高性能
- 控制连接数

**实现**:
- 使用 `OkHttp` 或 `Apache HttpClient` 连接池
- 或使用 Java 11+ 的 `HttpClient`（内置连接池）

### 方案 2: 单线程 HTTP 客户端
**优点**:
- 简单，避免并发问题
- 连接数可控

**缺点**:
- 可能成为性能瓶颈
- 不适合高并发场景

### 方案 3: 限制并发数
**优点**:
- 控制资源使用
- 避免连接数过多

**实现**:
- 使用线程池限制并发 HTTP 请求数
- 使用信号量控制连接数

## 当前状态总结

| 特性 | 状态 |
|------|------|
| 线程模型 | **多线程并发** |
| 连接管理 | 无连接池，每次新建 |
| 线程安全 | HttpURLConnection 本身安全，但无连接复用 |
| 并发控制 | 无限制 |
| 性能 | 中等（连接建立开销） |

