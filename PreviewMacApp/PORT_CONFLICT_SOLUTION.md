# 固定端口冲突解决方案

## 问题分析

如果固定端口（如 8765）被占用，会导致：
1. **服务发现端点无法启动**：客户端无法获取 TCP 端口
2. **多个实例冲突**：多个 PreviewMacApp 实例无法同时运行
3. **用户体验差**：启动失败，用户不知道原因

## 解决方案

### 方案 1: 端口范围 + 自动选择（推荐）⭐⭐⭐

**原理**：
- 不固定单个端口，而是使用端口范围（如 8765-8775）
- 启动时自动选择可用端口
- 将选中的端口写入配置文件或通过其他方式告知客户端

**优点**：
- ✅ 避免端口冲突
- ✅ 支持多实例
- ✅ 实现简单

**缺点**：
- ⚠️ 客户端仍需要知道端口（需要通过其他方式发现）

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewDiscoveryServer {
    private let portRange: ClosedRange<Int> = 8765...8775
    private var httpServer: HTTPServer?
    private var actualPort: Int?
    
    func start() {
        // 1. 尝试在端口范围内找到可用端口
        actualPort = findAvailablePort(in: portRange)
        
        guard let port = actualPort else {
            print("❌ 无法在端口范围 \(portRange) 内找到可用端口")
            return
        }
        
        // 2. 启动服务发现 HTTP 端点
        httpServer = HTTPServer()
        httpServer?.GET("/discover") { request in
            return JSONResponse([
                "tcpPort": PreviewTcpServer.shared.port,
                "discoveryPort": port,
                "status": "ok"
            ])
        }
        
        do {
            try httpServer?.start(port: port)
            print("✅ 服务发现端点已启动，端口: \(port)")
            
            // 3. 将端口写入配置文件（供客户端读取）
            saveDiscoveryPort(port)
        } catch {
            print("❌ 启动服务发现端点失败: \(error)")
        }
    }
    
    private func findAvailablePort(in range: ClosedRange<Int>) -> Int? {
        for port in range {
            if isPortAvailable(port) {
                return port
            }
        }
        return nil
    }
    
    private func isPortAvailable(_ port: Int) -> Bool {
        let socket = socket(AF_INET, SOCK_STREAM, 0)
        guard socket >= 0 else { return false }
        
        defer { close(socket) }
        
        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_addr.s_addr = inet_addr("127.0.0.1")
        addr.sin_port = UInt16(port).bigEndian
        
        let result = bind(socket, UnsafePointer<sockaddr>(&addr), socklen_t(MemoryLayout<sockaddr_in>.size))
        return result == 0
    }
    
    private func saveDiscoveryPort(_ port: Int) {
        let configPath = getConfigPath()
        try? String(port).write(toFile: configPath, atomically: true, encoding: .utf8)
    }
}
```

```kotlin
// SDK 端
class PreviewMacAppDiscovery {
    private val portRange = 8765..8775
    
    fun discoverTcpPort(): Int? {
        // 1. 优先从配置文件读取服务发现端口
        val discoveryPort = readDiscoveryPortFromConfig() ?: scanPortRange()
        
        if (discoveryPort == null) {
            // 回退到默认端口
            return tryDiscoveryEndpoint(8765)
        }
        
        // 2. 使用服务发现端口获取 TCP 端口
        return tryDiscoveryEndpoint(discoveryPort)
    }
    
    private fun scanPortRange(): Int? {
        // 扫描端口范围，找到可用的服务发现端点
        for (port in portRange) {
            val tcpPort = tryDiscoveryEndpoint(port)
            if (tcpPort != null) {
                // 保存找到的端口到配置文件
                saveDiscoveryPort(port)
                return tcpPort
            }
        }
        return null
    }
    
    private fun tryDiscoveryEndpoint(port: Int): Int? {
        try {
            val url = "http://localhost:$port/discover"
            val response = httpGet(url, timeout = 500) // 短超时，快速失败
            val json = parseJson(response)
            return json["tcpPort"] as? Int
        } catch (e: Exception) {
            return null
        }
    }
}
```

### 方案 2: 固定端口 + 冲突检测和重试 ⭐⭐

**原理**：
- 优先使用固定端口（8765）
- 如果被占用，自动尝试下一个端口
- 将实际使用的端口告知客户端

**优点**：
- ✅ 大多数情况下使用固定端口（简单）
- ✅ 冲突时自动处理

**缺点**：
- ⚠️ 客户端需要扫描或读取配置

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewDiscoveryServer {
    private let preferredPort = 8765
    private let fallbackPorts = [8766, 8767, 8768, 8769, 8770]
    private var actualPort: Int?
    
    func start() {
        // 1. 尝试使用首选端口
        var port = preferredPort
        
        if !isPortAvailable(port) {
            // 2. 如果被占用，尝试备用端口
            print("⚠️ 端口 \(preferredPort) 被占用，尝试备用端口...")
            
            for fallbackPort in fallbackPorts {
                if isPortAvailable(fallbackPort) {
                    port = fallbackPort
                    print("✅ 使用备用端口: \(port)")
                    break
                }
            }
            
            if port == preferredPort {
                print("❌ 所有端口都被占用")
                return
            }
        }
        
        // 3. 启动服务
        actualPort = port
        startHTTPServer(port: port)
        
        // 4. 保存实际使用的端口
        saveDiscoveryPort(port)
    }
}
```

### 方案 3: 环境变量/配置文件覆盖 ⭐⭐

**原理**：
- 默认使用固定端口（8765）
- 允许通过环境变量或配置文件覆盖
- 用户可以根据需要自定义端口

**优点**：
- ✅ 灵活性高
- ✅ 用户可以自定义
- ✅ 适合企业环境

**缺点**：
- ⚠️ 需要用户配置
- ⚠️ 客户端也需要知道配置

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewDiscoveryServer {
    func start() {
        // 1. 从环境变量读取端口
        let envPort = ProcessInfo.processInfo.environment["KUIKLY_DISCOVERY_PORT"]
        
        // 2. 从配置文件读取端口
        let configPort = readPortFromConfig()
        
        // 3. 使用优先级：环境变量 > 配置文件 > 默认值
        let port = envPort.flatMap { Int($0) } 
                  ?? configPort 
                  ?? 8765
        
        startHTTPServer(port: port)
    }
}
```

```kotlin
// SDK 端
class PreviewMacAppDiscovery {
    fun discoverTcpPort(): Int? {
        // 1. 从环境变量读取
        val envPort = System.getenv("KUIKLY_DISCOVERY_PORT")?.toIntOrNull()
        
        // 2. 从配置文件读取
        val configPort = readPortFromConfig()
        
        // 3. 使用优先级：环境变量 > 配置文件 > 默认值
        val discoveryPort = envPort ?: configPort ?: 8765
        
        return tryDiscoveryEndpoint(discoveryPort)
    }
}
```

### 方案 4: Unix Domain Socket（完全避免端口）⭐⭐⭐

**原理**：
- 服务发现也使用 Unix Domain Socket
- 完全避免端口冲突
- 通过文件路径通信

**优点**：
- ✅ 完全无需端口
- ✅ 性能最优
- ✅ 安全性高

**缺点**：
- ❌ 仅限本地通信

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewUnixDiscoveryServer {
    private let socketPath: String
    
    init() {
        let supportDir = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first!
        socketPath = supportDir
            .appendingPathComponent("Kuikly")
            .appendingPathComponent("preview-discovery.sock")
            .path
    }
    
    func start() {
        // 使用 Unix Domain Socket，完全避免端口冲突
        let listener = try? NWListener(
            using: NWParameters(),
            on: NWEndpoint.unix(path: socketPath)
        )
        listener?.start(queue: .main)
    }
}
```

### 方案 5: mDNS/Bonjour（自动发现）⭐⭐⭐

**原理**：
- 使用 mDNS 服务发现
- 完全自动发现，无需端口配置
- 支持跨网络

**优点**：
- ✅ 完全自动发现
- ✅ 无需端口配置
- ✅ 支持跨网络

**缺点**：
- ⚠️ 需要网络权限
- ⚠️ 可能被防火墙阻止

## 推荐方案：混合方案（多级回退）

结合多种方案的优势，提供多级回退机制：

```
1. 优先：Unix Domain Socket（本地，无需端口）
   ↓ 失败
2. 回退：端口范围扫描（8765-8775，自动选择）
   ↓ 失败
3. 回退：固定端口 + 冲突检测（8765，如果被占用尝试备用端口）
   ↓ 失败
4. 回退：环境变量/配置文件（用户自定义）
   ↓ 失败
5. 最后：mDNS 服务发现（跨网络，自动发现）
```

**实现示例**：

```swift
// PreviewMacApp 端
class PreviewDiscoveryServer {
    func start() {
        // 1. 优先尝试 Unix Domain Socket
        if tryUnixDomainSocket() {
            return
        }
        
        // 2. 尝试端口范围（8765-8775）
        let port = findAvailablePort(in: 8765...8775)
        if let port = port {
            startHTTPServer(port: port)
            saveDiscoveryPort(port)
            return
        }
        
        // 3. 尝试固定端口 + 备用端口
        let ports = [8765, 8766, 8767, 8768, 8769, 8770]
        for port in ports {
            if isPortAvailable(port) {
                startHTTPServer(port: port)
                saveDiscoveryPort(port)
                return
            }
        }
        
        // 4. 使用 mDNS 服务发现
        registerMDNSService()
    }
}
```

```kotlin
// SDK 端
class PreviewMacAppDiscovery {
    fun discoverTcpPort(): Int? {
        // 1. 优先尝试 Unix Domain Socket
        val unixSocket = tryUnixDomainSocket()
        if (unixSocket != null) {
            return getTcpPortFromUnixSocket(unixSocket)
        }
        
        // 2. 从配置文件读取服务发现端口
        val configPort = readDiscoveryPortFromConfig()
        if (configPort != null) {
            val tcpPort = tryDiscoveryEndpoint(configPort)
            if (tcpPort != null) return tcpPort
        }
        
        // 3. 扫描端口范围（8765-8775）
        for (port in 8765..8775) {
            val tcpPort = tryDiscoveryEndpoint(port)
            if (tcpPort != null) {
                saveDiscoveryPort(port)
                return tcpPort
            }
        }
        
        // 4. 尝试 mDNS 服务发现
        return tryMDNSDiscovery()
    }
}
```

## 实施建议

### 阶段 1: 快速实施（端口范围 + 自动选择）

**理由**：
- 实现简单，改动小
- 有效避免端口冲突
- 支持多实例

**实施步骤**：
1. PreviewMacApp 启动时在端口范围（8765-8775）内自动选择可用端口
2. 将选中的端口写入配置文件
3. SDK 优先从配置文件读取，如果失败则扫描端口范围

### 阶段 2: 优化（Unix Domain Socket）

**理由**：
- 完全避免端口冲突
- 性能最优

**实施步骤**：
1. PreviewMacApp 支持 Unix Domain Socket 服务发现
2. SDK 优先尝试 Unix Domain Socket
3. 如果失败，回退到 HTTP 端口范围扫描

### 阶段 3: 完善（mDNS 服务发现）

**理由**：
- 支持跨网络发现
- 完全自动发现

**实施步骤**：
1. PreviewMacApp 注册 mDNS 服务
2. SDK 支持 mDNS 查询
3. 添加到回退链中

## 总结

**固定端口冲突的解决方案**：

1. **端口范围 + 自动选择**：不固定单个端口，使用端口范围自动选择
2. **冲突检测和重试**：固定端口被占用时，自动尝试备用端口
3. **环境变量/配置文件覆盖**：允许用户自定义端口
4. **Unix Domain Socket**：完全避免端口，使用文件路径
5. **mDNS 服务发现**：自动发现，无需端口配置

**推荐实施顺序**：
1. ✅ 端口范围 + 自动选择（最简单，快速解决冲突）
2. ✅ Unix Domain Socket（本地优化，完全避免端口）
3. ✅ mDNS 服务发现（跨网络支持）

