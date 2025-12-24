# PreviewMacApp 动态端口分配方案

## 问题分析

当前架构中，TCP 端口是硬编码的（9528），这会导致以下问题：
1. **端口冲突**：如果多个 PreviewMacApp 实例运行，会端口冲突
2. **防火墙限制**：固定端口可能被防火墙阻止
3. **多用户环境**：同一台机器多个用户无法同时使用
4. **测试环境**：无法同时运行多个测试实例

## 解决方案对比

### 方案 1: mDNS/Bonjour 服务发现 ⭐⭐⭐（推荐）

**原理**：
- PreviewMacApp 启动时注册 mDNS 服务
- SDK 通过服务发现找到 PreviewMacApp
- 自动获取 IP 和端口

**优点**：
- ✅ 自动发现，无需配置
- ✅ 支持多实例（通过 instanceId 区分）
- ✅ 跨网络发现（同一局域网）
- ✅ macOS 原生支持，无需额外依赖

**缺点**：
- ⚠️ 需要网络权限
- ⚠️ 可能被防火墙阻止

**实现**：
```swift
// PreviewMacApp 端
import Network

class PreviewTcpServer {
    private var netService: NetService?
    
    func start(port: UInt16? = nil) {
        // 如果没有指定端口，自动分配
        let actualPort = port ?? findAvailablePort()
        
        // 启动 TCP 服务器
        startTCPServer(port: actualPort)
        
        // 注册 mDNS 服务
        netService = NetService(
            domain: "local.",
            type: "_kuikly-preview._tcp",
            name: "PreviewMacApp-\(instanceId)",
            port: Int32(actualPort)
        )
        netService?.publish()
    }
    
    private func findAvailablePort() -> UInt16 {
        // 查找可用端口
        let socket = socket(AF_INET, SOCK_STREAM, 0)
        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_addr.s_addr = inet_addr("127.0.0.1")
        addr.sin_port = 0  // 0 表示自动分配
        
        bind(socket, UnsafePointer<sockaddr>(&addr), socklen_t(MemoryLayout<sockaddr_in>.size))
        var len = socklen_t(MemoryLayout<sockaddr_in>.size)
        getsockname(socket, UnsafePointer<sockaddr>(&addr), &len)
        close(socket)
        
        return UInt16(bigEndian: addr.sin_port)
    }
}
```

```kotlin
// SDK 端
import javax.jmdns.JmDNS
import javax.jmdns.ServiceInfo

class PreviewMacAppDiscovery {
    fun discover(): Pair<String, Int>? {
        val jmdns = JmDNS.create()
        val serviceInfo = jmdns.getServiceInfo("_kuikly-preview._tcp", "PreviewMacApp")
        
        return if (serviceInfo != null) {
            Pair(serviceInfo.hostAddresses.first(), serviceInfo.port)
        } else {
            null
        }
    }
}
```

### 方案 2: Unix Domain Socket ⭐⭐⭐（本地推荐）

**原理**：
- 使用文件系统套接字（Unix Domain Socket）
- 通过文件路径通信，无需端口
- 仅限本地通信

**优点**：
- ✅ 无需端口，避免冲突
- ✅ 性能更好（内核级通信）
- ✅ 安全性更高（文件权限控制）
- ✅ 支持多实例（不同路径）

**缺点**：
- ❌ 仅限本地通信
- ❌ 需要文件系统权限

**实现**：
```swift
// PreviewMacApp 端
import Network

class PreviewUnixSocketServer {
    private var listener: NWListener?
    private let socketPath: String
    
    init(instanceId: String) {
        let supportDir = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first!
        socketPath = supportDir
            .appendingPathComponent("Kuikly")
            .appendingPathComponent("preview-\(instanceId).sock")
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
        parameters.allowLocalEndpointReuse = true
        
        listener = try? NWListener(using: parameters, on: NWEndpoint.unix(path: socketPath))
        listener?.newConnectionHandler = { connection in
            self.handleConnection(connection)
        }
        listener?.start(queue: .main)
    }
}
```

```kotlin
// SDK 端
import java.net.Socket
import java.nio.channels.SocketChannel
import java.nio.file.Paths

class UnixSocketTransport {
    private val socketPath: String
    
    fun connect(instanceId: String): SocketChannel {
        val supportDir = System.getProperty("user.home") + "/Library/Application Support/Kuikly"
        socketPath = "$supportDir/preview-$instanceId.sock"
        
        val socket = SocketChannel.open(UnixDomainSocketAddress.of(socketPath))
        return socket
    }
}
```

### 方案 3: 配置文件 + 固定端口范围 ⭐⭐

**原理**：
- PreviewMacApp 启动时选择一个可用端口（在固定范围内）
- 将端口写入配置文件
- SDK 读取配置文件获取端口

**优点**：
- ✅ 实现简单
- ✅ 无需额外依赖
- ✅ 支持多实例

**缺点**：
- ⚠️ 需要文件系统权限
- ⚠️ 配置文件可能被删除
- ⚠️ 需要处理文件锁

**实现**：
```swift
// PreviewMacApp 端
class PortManager {
    private let portRange: ClosedRange<UInt16> = 9528...9600
    private let configPath: String
    
    init(instanceId: String) {
        let supportDir = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first!
        configPath = supportDir
            .appendingPathComponent("Kuikly")
            .appendingPathComponent("preview-\(instanceId).port")
            .path
    }
    
    func allocatePort() -> UInt16? {
        // 尝试读取已分配的端口
        if let existingPort = readPort() {
            if isPortAvailable(existingPort) {
                return existingPort
            }
        }
        
        // 分配新端口
        for port in portRange {
            if isPortAvailable(port) {
                writePort(port)
                return port
            }
        }
        
        return nil
    }
    
    private func isPortAvailable(_ port: UInt16) -> Bool {
        // 检查端口是否可用
        let socket = socket(AF_INET, SOCK_STREAM, 0)
        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_addr.s_addr = inet_addr("127.0.0.1")
        addr.sin_port = port.bigEndian
        
        let result = bind(socket, UnsafePointer<sockaddr>(&addr), socklen_t(MemoryLayout<sockaddr_in>.size))
        close(socket)
        
        return result == 0
    }
    
    private func writePort(_ port: UInt16) {
        try? String(port).write(toFile: configPath, atomically: true, encoding: .utf8)
    }
    
    private func readPort() -> UInt16? {
        guard let content = try? String(contentsOfFile: configPath, encoding: .utf8),
              let port = UInt16(content.trimmingCharacters(in: .whitespacesAndNewlines)) else {
            return nil
        }
        return port
    }
}
```

```kotlin
// SDK 端
class ConfigBasedPortDiscovery {
    fun discoverPort(instanceId: String): Int? {
        val configPath = "${System.getProperty("user.home")}/Library/Application Support/Kuikly/preview-$instanceId.port"
        val file = File(configPath)
        
        return if (file.exists()) {
            file.readText().trim().toIntOrNull()
        } else {
            null
        }
    }
}
```

### 方案 4: HTTP 服务发现端点 ⭐⭐

**原理**：
- PreviewMacApp 启动一个固定的 HTTP 端点（如 8765）
- SDK 通过 HTTP 请求获取 TCP 端口信息
- 支持多实例查询

**优点**：
- ✅ 实现简单
- ✅ 支持多实例查询
- ✅ 可以返回更多信息（版本、状态等）

**缺点**：
- ⚠️ 仍然需要一个固定端口（HTTP 端点）
- ⚠️ 需要 HTTP 服务器

**实现**：
```swift
// PreviewMacApp 端
class PreviewHttpDiscoveryServer {
    func start() {
        // 启动 HTTP 服务发现服务器（固定端口 8765）
        let server = HTTPServer()
        server.GET("/discover") { request in
            // 返回所有实例的端口信息
            let instances = getAllInstances()
            return JSONResponse(instances.map { instance in
                [
                    "instanceId": instance.id,
                    "port": instance.tcpPort,
                    "status": instance.status
                ]
            })
        }
        server.start(port: 8765)
    }
}
```

```kotlin
// SDK 端
class HttpDiscovery {
    fun discover(instanceId: String? = null): Int? {
        val url = "http://localhost:8765/discover"
        val response = httpGet(url)
        
        val instances = parseJson(response)
        return if (instanceId != null) {
            instances.find { it["instanceId"] == instanceId }?["port"] as? Int
        } else {
            instances.firstOrNull()?["port"] as? Int
        }
    }
}
```

## 推荐方案

### 🏆 本地环境：Unix Domain Socket（方案 2）

**理由**：
1. **无需端口**：完全避免端口冲突
2. **性能最优**：内核级通信，延迟最低
3. **安全性高**：文件权限控制
4. **实现简单**：macOS 原生支持

**适用场景**：
- IDE Plugin 和 PreviewMacApp 在同一台机器
- 不需要跨网络通信

### 🏆 跨网络环境：mDNS/Bonjour（方案 1）

**理由**：
1. **自动发现**：无需配置
2. **支持多实例**：通过 instanceId 区分
3. **跨网络**：同一局域网内自动发现
4. **原生支持**：macOS 内置

**适用场景**：
- 需要跨网络通信
- 多设备协作

## 混合方案（最佳实践）

结合两种方案的优势：

```
1. 优先尝试 Unix Domain Socket（本地，性能最优）
2. 如果失败，回退到 mDNS 发现（跨网络）
3. 最后回退到配置文件（兼容性）
```

## 实施建议

### 阶段 1: 支持动态端口（短期）

1. **修改 PreviewMacApp**：
   - 支持端口范围配置（9528-9600）
   - 自动选择可用端口
   - 写入配置文件

2. **修改 SDK**：
   - 支持从配置文件读取端口
   - 支持端口范围扫描

### 阶段 2: 实现服务发现（中期）

1. **实现 mDNS 服务发现**
2. **实现 Unix Domain Socket 支持**
3. **提供多种发现方式的回退机制**

### 阶段 3: 优化和稳定（长期）

1. **性能优化**
2. **错误处理和重试机制**
3. **监控和日志**

