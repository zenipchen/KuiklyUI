# 客户端端口发现机制设计

## 问题核心

**如果服务器端口是动态的，客户端如何确定正确的端口？**

这是服务发现（Service Discovery）的核心问题。以下是几种可行的方案：

## 方案对比

### 方案 1: 配置文件 + 固定服务发现端口 ⭐⭐⭐（推荐）

**原理**：
- PreviewMacApp 启动时选择一个可用端口（9528-9600）
- 将端口写入配置文件：`~/Library/Application Support/Kuikly/preview.port`
- 同时启动一个**固定的服务发现端点**（如 HTTP 8765 端口）
- SDK 通过固定端点获取实际 TCP 端口

**客户端发现流程**：
```
1. SDK 启动
   ↓
2. 尝试连接固定服务发现端点（localhost:8765）
   ↓
3. GET /discover → 返回 { "tcpPort": 9529, "status": "ok" }
   ↓
4. 使用返回的 tcpPort 建立 TCP 连接
```

**优点**：
- ✅ 实现简单，只需一个固定端口（8765）
- ✅ 支持多实例查询
- ✅ 可以返回更多信息（版本、状态等）
- ✅ 向后兼容（如果固定端点不可用，回退到配置文件）

**缺点**：
- ⚠️ 仍需要一个固定端口（但只有一个，且可以配置）

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewDiscoveryServer {
    private var httpServer: HTTPServer?
    private var tcpPort: Int = 9528
    
    func start() {
        // 1. 启动 TCP 服务器（动态端口）
        tcpPort = allocateAvailablePort() // 9528-9600
        PreviewTcpServer.shared.start(port: tcpPort)
        
        // 2. 启动服务发现 HTTP 端点（固定端口 8765）
        httpServer = HTTPServer()
        httpServer?.GET("/discover") { request in
            return JSONResponse([
                "tcpPort": self.tcpPort,
                "status": "ok",
                "version": "1.0.0"
            ])
        }
        httpServer?.start(port: 8765)
    }
}
```

```kotlin
// SDK 端
class PreviewMacAppDiscovery {
    private val discoveryPort = 8765  // 固定端口
    
    fun discoverTcpPort(): Int? {
        try {
            // 1. 连接固定服务发现端点
            val url = "http://localhost:$discoveryPort/discover"
            val response = httpGet(url)
            
            // 2. 解析返回的 TCP 端口
            val json = parseJson(response)
            return json["tcpPort"] as? Int
        } catch (e: Exception) {
            // 3. 回退到配置文件
            return readPortFromConfig()
        }
    }
    
    private fun readPortFromConfig(): Int? {
        val configPath = "${System.getProperty("user.home")}/Library/Application Support/Kuikly/preview.port"
        val file = File(configPath)
        return if (file.exists()) {
            file.readText().trim().toIntOrNull()
        } else {
            null
        }
    }
}
```

### 方案 2: mDNS/Bonjour 服务发现 ⭐⭐⭐

**原理**：
- PreviewMacApp 启动时注册 mDNS 服务
- SDK 通过 mDNS 查询找到 PreviewMacApp
- 自动获取 IP 和端口

**客户端发现流程**：
```
1. SDK 启动
   ↓
2. 发起 mDNS 查询：_kuikly-preview._tcp.local
   ↓
3. 收到服务响应：{ host: "localhost", port: 9529 }
   ↓
4. 使用返回的 host:port 建立 TCP 连接
```

**优点**：
- ✅ 完全自动发现，无需配置
- ✅ 支持跨网络发现
- ✅ 支持多实例（通过 instanceId 区分）
- ✅ macOS 原生支持

**缺点**：
- ⚠️ 需要网络权限
- ⚠️ 可能被防火墙阻止
- ⚠️ 需要额外的依赖（JmDNS）

**实现示例**：

```swift
// PreviewMacApp 端
import Network

class PreviewTcpServer {
    private var netService: NetService?
    
    func start(port: UInt16? = nil) {
        // 1. 如果没有指定端口，自动分配
        let actualPort = port ?? findAvailablePort()
        
        // 2. 启动 TCP 服务器
        startTCPServer(port: actualPort)
        
        // 3. 注册 mDNS 服务
        netService = NetService(
            domain: "local.",
            type: "_kuikly-preview._tcp",
            name: "PreviewMacApp",
            port: Int32(actualPort)
        )
        netService?.publish()
    }
}
```

```kotlin
// SDK 端
import javax.jmdns.JmDNS
import javax.jmdns.ServiceInfo

class PreviewMacAppDiscovery {
    fun discoverTcpPort(): Pair<String, Int>? {
        val jmdns = JmDNS.create()
        
        // 查询服务
        val serviceInfo = jmdns.getServiceInfo("_kuikly-preview._tcp", "PreviewMacApp")
        
        return if (serviceInfo != null) {
            Pair(serviceInfo.hostAddresses.first(), serviceInfo.port)
        } else {
            null
        }
    }
}
```

### 方案 3: Unix Domain Socket（无需端口）⭐⭐⭐

**原理**：
- 不使用 TCP 端口，使用文件系统套接字
- 通过文件路径通信
- 客户端通过文件路径连接

**客户端发现流程**：
```
1. SDK 启动
   ↓
2. 构造套接字路径：~/Library/Application Support/Kuikly/preview.sock
   ↓
3. 检查文件是否存在
   ↓
4. 如果存在，直接连接 Unix Domain Socket
```

**优点**：
- ✅ 完全无需端口
- ✅ 性能最优（内核级通信）
- ✅ 安全性高（文件权限控制）
- ✅ 避免端口冲突

**缺点**：
- ❌ 仅限本地通信
- ❌ 需要文件系统权限

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewUnixSocketServer {
    private let socketPath: String
    
    init() {
        let supportDir = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first!
        socketPath = supportDir
            .appendingPathComponent("Kuikly")
            .appendingPathComponent("preview.sock")
            .path
    }
    
    func start() {
        // 确保目录存在
        try? FileManager.default.createDirectory(
            at: URL(fileURLWithPath: socketPath).deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        
        // 删除旧套接字文件
        try? FileManager.default.removeItem(atPath: socketPath)
        
        // 创建 Unix Domain Socket
        let parameters = NWParameters(tls: nil, tcp: nil)
        let listener = try? NWListener(
            using: parameters,
            on: NWEndpoint.unix(path: socketPath)
        )
        listener?.start(queue: .main)
    }
}
```

```kotlin
// SDK 端
import java.net.UnixDomainSocketAddress
import java.nio.channels.SocketChannel

class UnixSocketTransport {
    fun connect(): SocketChannel? {
        val socketPath = "${System.getProperty("user.home")}/Library/Application Support/Kuikly/preview.sock"
        val file = File(socketPath)
        
        // 检查文件是否存在
        if (!file.exists()) {
            return null
        }
        
        // 连接 Unix Domain Socket
        val address = UnixDomainSocketAddress.of(socketPath)
        return SocketChannel.open(address)
    }
}
```

### 方案 4: 配置文件轮询 ⭐⭐

**原理**：
- PreviewMacApp 启动时选择一个可用端口
- 将端口写入配置文件
- SDK 读取配置文件获取端口

**客户端发现流程**：
```
1. SDK 启动
   ↓
2. 读取配置文件：~/Library/Application Support/Kuikly/preview.port
   ↓
3. 如果文件不存在，尝试默认端口 9528
   ↓
4. 使用读取到的端口建立 TCP 连接
```

**优点**：
- ✅ 实现最简单
- ✅ 无需额外依赖
- ✅ 向后兼容

**缺点**：
- ⚠️ 需要文件系统权限
- ⚠️ 配置文件可能被删除
- ⚠️ 多实例需要不同的配置文件路径

**实现示例**：

```swift
// PreviewMacApp 端
class PortManager {
    func allocateAndSavePort() -> UInt16 {
        let port = findAvailablePort() // 9528-9600
        
        // 写入配置文件
        let configPath = getConfigPath()
        try? String(port).write(toFile: configPath, atomically: true, encoding: .utf8)
        
        return port
    }
}
```

```kotlin
// SDK 端
class ConfigBasedDiscovery {
    fun discoverTcpPort(): Int {
        val configPath = "${System.getProperty("user.home")}/Library/Application Support/Kuikly/preview.port"
        val file = File(configPath)
        
        return if (file.exists()) {
            file.readText().trim().toIntOrNull() ?: 9528
        } else {
            9528  // 默认端口
        }
    }
}
```

## 推荐方案：混合方案

结合多种方案的优势，提供多级回退机制：

```
1. 优先：Unix Domain Socket（本地，性能最优，无需端口）
   ↓ 失败
2. 回退：固定服务发现端点（HTTP 8765，获取 TCP 端口）
   ↓ 失败
3. 回退：mDNS 服务发现（跨网络，自动发现）
   ↓ 失败
4. 最后：配置文件读取（兼容性，向后兼容）
   ↓ 失败
5. 默认：固定端口 9528（向后兼容）
```

**实现示例**：

```kotlin
// SDK 端
class PreviewMacAppDiscovery {
    fun discover(): ConnectionInfo? {
        // 1. 尝试 Unix Domain Socket
        val unixSocket = tryUnixDomainSocket()
        if (unixSocket != null) {
            return ConnectionInfo(type = "unix", path = unixSocket)
        }
        
        // 2. 尝试固定服务发现端点
        val tcpPort = tryDiscoveryEndpoint()
        if (tcpPort != null) {
            return ConnectionInfo(type = "tcp", host = "localhost", port = tcpPort)
        }
        
        // 3. 尝试 mDNS 发现
        val mdnInfo = tryMDNSDiscovery()
        if (mdnInfo != null) {
            return ConnectionInfo(type = "tcp", host = mdnInfo.host, port = mdnInfo.port)
        }
        
        // 4. 尝试配置文件
        val configPort = tryConfigFile()
        if (configPort != null) {
            return ConnectionInfo(type = "tcp", host = "localhost", port = configPort)
        }
        
        // 5. 默认端口
        return ConnectionInfo(type = "tcp", host = "localhost", port = 9528)
    }
}
```

## 实施建议

### 阶段 1: 快速实施（配置文件 + 固定服务发现端点）

**理由**：
- 实现简单，改动小
- 只需一个固定端口（8765）用于服务发现
- 向后兼容（如果服务发现失败，回退到配置文件或默认端口）

**实施步骤**：
1. PreviewMacApp 启动固定 HTTP 服务发现端点（8765）
2. PreviewMacApp 动态分配 TCP 端口（9528-9600）
3. SDK 通过服务发现端点获取 TCP 端口
4. 如果服务发现失败，回退到配置文件或默认端口

### 阶段 2: 优化（Unix Domain Socket）

**理由**：
- 完全无需端口
- 性能最优
- 安全性高

**实施步骤**：
1. PreviewMacApp 支持 Unix Domain Socket
2. SDK 优先尝试 Unix Domain Socket
3. 如果失败，回退到 TCP + 服务发现

### 阶段 3: 完善（mDNS 服务发现）

**理由**：
- 支持跨网络发现
- 完全自动发现

**实施步骤**：
1. PreviewMacApp 注册 mDNS 服务
2. SDK 支持 mDNS 查询
3. 添加到回退链中

## 总结

**客户端发现服务器端口的核心思路**：

1. **固定服务发现端点**：使用一个固定的 HTTP 端口（如 8765）提供服务发现 API
2. **配置文件**：服务器将端口写入配置文件，客户端读取
3. **服务发现协议**：使用 mDNS/Bonjour 自动发现
4. **Unix Domain Socket**：不使用端口，使用文件路径

**推荐实施顺序**：
1. ✅ 固定服务发现端点（最简单，只需一个固定端口）
2. ✅ Unix Domain Socket（本地优化，无需端口）
3. ✅ mDNS 服务发现（跨网络支持）

