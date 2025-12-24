# TCP 端口重新发现优化

## 问题描述

当 PreviewMacApp 首次启动并建立 TCP 连接后，如果：
1. PreviewMacApp 重启（可能使用了新的端口）
2. 网络临时中断
3. Mac 端崩溃重启

此时，JVM 端的 `TcpTransport` 会检测到连接断开并启动重连机制，但它只会尝试重连到**原来的端口**，而不会重新执行端口发现流程。

### 日志示例（问题场景）

```
[TcpTransport] 🔗 正在尝试连接: 3 -> localhost:9528
[TcpTransport] ❌ TCP 连接失败: Connection refused
[TcpTransport] 🔗 正在尝试连接: 5 -> localhost:9528
[TcpTransport] ❌ TCP 连接失败: Connection refused
[TcpTransport] 🔗 正在尝试连接: 4 -> localhost:9528
[TcpTransport] ❌ TCP 连接失败: Connection refused
...（无限重试，但端口已经变了）
```

**原因**：PreviewMacApp 重启后可能使用了新端口（如 9529），但 JVM 端仍在尝试连接旧端口（9528）。

## 解决方案

### 核心思路

**连续失败次数达到阈值后，触发端口重新发现**

1. 每次连接失败时，`consecutiveFailures` 计数器递增
2. 当 `consecutiveFailures >= rediscoveryThreshold`（默认 3 次）时：
   - 调用 `onPortRediscoveryNeeded` 回调
   - 重新执行端口发现流程
   - 如果发现新端口，更新配置并重试
   - 连接成功后，重置 `consecutiveFailures = 0`

### 代码改动

#### 1. `Transport.Config` - 支持动态端口更新

```kotlin
data class Config(
    val serverHost: String,
    var serverPort: Int,  // ✅ 改为 var，允许动态更新
    val connectTimeout: Long = 1000,
    val readTimeout: Long = 1000
)
```

#### 2. `TcpTransport` - 添加端口重新发现机制

```kotlin
class TcpTransport(private val config: Transport.Config) : Transport {
    
    // 连续失败次数
    @Volatile
    private var consecutiveFailures: Int = 0
    
    // 触发端口重新发现的失败次数阈值
    private val rediscoveryThreshold = 3
    
    // 端口重新发现回调
    var onPortRediscoveryNeeded: (() -> Int?)? = null
    
    private fun tryConnect(): Boolean {
        try {
            // ... 连接逻辑 ...
            
            // 连接成功，重置失败计数
            consecutiveFailures = 0
            return true
        } catch (e: Exception) {
            consecutiveFailures++
            println("[TcpTransport] ❌ TCP 连接失败 (第 $consecutiveFailures 次): ${e.message}")
            
            // 🎯 关键：连续失败次数达到阈值，触发端口重新发现
            if (consecutiveFailures >= rediscoveryThreshold) {
                println("[TcpTransport] 🔍 连续失败 $consecutiveFailures 次，尝试重新发现端口...")
                val newPort = onPortRediscoveryNeeded?.invoke()
                if (newPort != null && newPort != config.serverPort) {
                    println("[TcpTransport] ✅ 发现新端口: $newPort (旧端口: ${config.serverPort})")
                    config.serverPort = newPort
                    consecutiveFailures = 0  // 重置失败计数，使用新端口重试
                }
            }
            
            return false
        }
    }
}
```

#### 3. `KuiklyMacRenderSdk` - 实现端口重新发现回调

```kotlin
init {
    // 设置端口重新发现回调
    if (transportImpl is TcpTransport) {
        transportImpl.onPortRediscoveryNeeded = {
            println("[Mac SDK][$pageName] 🔍 开始端口重新发现...")
            val discovery = PreviewMacAppDiscovery()
            val newPort = discovery.discoverTcpPort()
            if (newPort != null) {
                println("[Mac SDK][$pageName] ✅ 发现新端口: $newPort")
                // 清除端口缓存，下次重新发现
                MacRenderSdkConfig.clearCachedPort()
                newPort
            } else {
                println("[Mac SDK][$pageName] ⚠️ 端口重新发现失败")
                null
            }
        }
    }
}
```

#### 4. `MacRenderSdkConfig` - 添加清除缓存方法

```kotlin
internal object MacRenderSdkConfig {
    @Volatile
    private var cachedPort: Int? = null
    
    /**
     * 清除缓存的端口（用于重新发现）
     */
    @JvmStatic
    fun clearCachedPort() {
        cachedPort = null
        println("[MacRenderSdkConfig] 🔄 已清除缓存的端口")
    }
}
```

## 工作流程

### 场景 1: PreviewMacApp 重启（端口变化）

```
1. 初始状态：
   JVM 端连接到 localhost:9528
   ✅ 连接正常

2. PreviewMacApp 重启（使用新端口 9529）：
   JVM 端检测到连接断开
   🔌 触发 onDisconnected 回调
   🔄 启动重连定时器（每 1 秒尝试一次）

3. 重连尝试：
   [TcpTransport] 🔗 正在尝试连接: 3 -> localhost:9528
   [TcpTransport] ❌ TCP 连接失败 (第 1 次): Connection refused
   
   [TcpTransport] 🔗 正在尝试连接: 3 -> localhost:9528
   [TcpTransport] ❌ TCP 连接失败 (第 2 次): Connection refused
   
   [TcpTransport] 🔗 正在尝试连接: 3 -> localhost:9528
   [TcpTransport] ❌ TCP 连接失败 (第 3 次): Connection refused

4. 触发端口重新发现：
   [TcpTransport] 🔍 连续失败 3 次，尝试重新发现端口...
   [Mac SDK][HelloWorldPage] 🔍 开始端口重新发现...
   [Discovery] 🔍 扫描端口范围 (8765-8775)...
   [Discovery] ✅ 通过端口扫描发现端口: discovery=8766, tcp=9529
   [Mac SDK][HelloWorldPage] ✅ 发现新端口: 9529
   [TcpTransport] ✅ 发现新端口: 9529 (旧端口: 9528)

5. 使用新端口重连：
   [TcpTransport] 🔗 正在尝试连接: 3 -> localhost:9529
   [TcpTransport] ✅ TCP 连接已建立: 3 -> localhost:9529
   ✅ 连接成功！
```

### 场景 2: 网络临时中断（端口未变）

```
1. 连接中断：
   [TcpTransport] 🔌 连接已断开: instanceId=3
   🔄 启动重连定时器

2. 重连尝试（3 次失败）：
   [TcpTransport] ❌ TCP 连接失败 (第 1 次): Connection refused
   [TcpTransport] ❌ TCP 连接失败 (第 2 次): Connection refused
   [TcpTransport] ❌ TCP 连接失败 (第 3 次): Connection refused

3. 触发端口重新发现：
   [TcpTransport] 🔍 连续失败 3 次，尝试重新发现端口...
   [Discovery] ✅ 通过配置文件发现端口: discovery=8766, tcp=9528
   [TcpTransport] ⚠️ 端口重新发现失败或端口未变化，继续使用原端口
   
4. 继续尝试原端口（网络恢复后）：
   [TcpTransport] 🔗 正在尝试连接: 3 -> localhost:9528
   [TcpTransport] ✅ TCP 连接已建立: 3 -> localhost:9528
   ✅ 连接成功！
```

## 关键参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `rediscoveryThreshold` | 3 | 触发端口重新发现的失败次数 |
| `reconnectIntervalMs` | 1000ms | 重连尝试间隔 |
| `connectTimeout` | 1000ms | 单次连接超时时间 |

**计算**：
- 最快触发时间：`3 次 × 1 秒 = 3 秒`
- 每次端口发现耗时：约 0.5-2 秒（取决于端口范围和网络）

## 优势

### 1. **自动恢复**
- ✅ PreviewMacApp 重启后，JVM 端自动发现新端口并重连
- ✅ 无需手动重启 JVM 应用
- ✅ 无需手动配置端口

### 2. **智能判断**
- ✅ 只在连续失败多次后才触发端口重新发现（避免频繁扫描）
- ✅ 如果端口未变化，继续使用原端口（避免不必要的切换）
- ✅ 连接成功后重置失败计数（避免误触发）

### 3. **向后兼容**
- ✅ 如果端口发现失败，回退到默认端口（9528）
- ✅ 不影响现有功能和 API

### 4. **性能优化**
- ✅ 端口发现结果被缓存，避免重复扫描
- ✅ 只在必要时清除缓存（连接失败 3 次后）
- ✅ 重连间隔合理（1 秒），不会过于频繁

## 测试验证

### 测试用例 1: PreviewMacApp 重启（端口变化）

**步骤**：
1. 启动 PreviewMacApp（端口 9528）
2. JVM 端连接成功
3. 关闭 PreviewMacApp
4. 重新启动 PreviewMacApp（端口变为 9529）
5. 观察 JVM 端日志

**预期结果**：
```
[TcpTransport] ❌ TCP 连接失败 (第 1 次): Connection refused
[TcpTransport] ❌ TCP 连接失败 (第 2 次): Connection refused
[TcpTransport] ❌ TCP 连接失败 (第 3 次): Connection refused
[TcpTransport] 🔍 连续失败 3 次，尝试重新发现端口...
[TcpTransport] ✅ 发现新端口: 9529 (旧端口: 9528)
[TcpTransport] ✅ TCP 连接已建立: 3 -> localhost:9529
```

### 测试用例 2: 网络临时中断（端口未变）

**步骤**：
1. 启动 PreviewMacApp 和 JVM 端
2. 临时关闭 PreviewMacApp（不重启）
3. 3 秒后重新启动 PreviewMacApp（使用相同端口）

**预期结果**：
```
[TcpTransport] ❌ TCP 连接失败 (第 1 次): Connection refused
[TcpTransport] ❌ TCP 连接失败 (第 2 次): Connection refused
[TcpTransport] ❌ TCP 连接失败 (第 3 次): Connection refused
[TcpTransport] 🔍 连续失败 3 次，尝试重新发现端口...
[TcpTransport] ⚠️ 端口重新发现失败或端口未变化，继续使用原端口
[TcpTransport] ✅ TCP 连接已建立: 3 -> localhost:9528
```

### 测试用例 3: 快速重连（失败次数 < 3）

**步骤**：
1. 启动 PreviewMacApp 和 JVM 端
2. 临时关闭 PreviewMacApp 0.5 秒
3. 快速重新启动

**预期结果**：
```
[TcpTransport] ❌ TCP 连接失败 (第 1 次): Connection refused
[TcpTransport] ✅ TCP 连接已建立: 3 -> localhost:9528
（不触发端口重新发现，因为失败次数 < 3）
```

## 配置调整

如果需要调整端口重新发现的触发条件：

```kotlin
// 在 TcpTransport.kt 中修改
private val rediscoveryThreshold = 5  // 失败 5 次后触发（更保守）
private val reconnectIntervalMs = 2000L  // 每 2 秒重试一次（更缓慢）
```

## 故障排除

### 问题 1: 仍然无法重连

**检查**：
1. PreviewMacApp 是否真的在运行？
2. 端口发现是否成功？（查看 `[Discovery]` 日志）
3. 防火墙是否阻止了连接？

### 问题 2: 端口发现太慢

**原因**：扫描端口范围（8765-8775）需要时间

**解决方案**：
1. 确保 `~/Library/Application Support/Kuikly/discovery-port` 文件存在（缓存发现端口）
2. 减小端口扫描范围

### 问题 3: 频繁触发端口重新发现

**原因**：网络不稳定或 PreviewMacApp 频繁重启

**解决方案**：
1. 检查网络连接
2. 增大 `rediscoveryThreshold`（如 5 或 10）
3. 增大 `reconnectIntervalMs`（如 2000ms）

## 总结

通过在连接失败多次后自动触发端口重新发现，实现了：

✅ **自动化**：PreviewMacApp 重启后，JVM 端自动适配新端口  
✅ **鲁棒性**：网络中断后自动恢复连接  
✅ **智能化**：只在必要时触发端口发现，避免资源浪费  
✅ **向后兼容**：不影响现有功能  

这样就解决了 **"第一次断开时，需要重新开始最开始的端口查找逻辑"** 的问题！
