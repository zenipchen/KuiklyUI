/*
 * Tencent is pleased to support the open source community by making KuiklyUI
 * available.
 * Copyright (C) 2025 Tencent. All rights reserved.
 * Licensed under the License of KuiklyUI;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://github.com/Tencent-TDS/KuiklyUI/blob/main/LICENSE
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Foundation
import Network

/// TCP 消息类型
enum TcpMessageType: UInt8 {
    case request = 0
    case response = 1
    case notification = 2
    case binaryResponse = 3  // 二进制响应（用于截图等）
}

/// TCP 服务器 - 用于接收来自 SDK 的 TCP 请求
class PreviewTcpServer: ObservableObject {
    @MainActor static let shared = PreviewTcpServer()
    
    @Published var port: Int = 9528  // TCP 服务端口（默认 9528，与 HTTP 的 9527 区分）
    @Published var isRunning: Bool = false
    
    private var listener: NWListener?
    // 按 instanceId 管理连接（一个 instanceId 独享一个长连接）
    private var connections: [String: NWConnection] = [:]  // instanceId -> NWConnection
    private var connectionToInstanceId: [UUID: String] = [:]  // connectionId -> instanceId（用于反向查找）
    private let connectionQueue = DispatchQueue(label: "com.kuikly.preview.tcp.connections")
    
    // 请求处理映射（requestId -> 处理闭包）
    private var pendingRequests: [Int64: (JsonObject) -> Void] = [:]
    private let pendingRequestsLock = DispatchQueue(label: "com.kuikly.preview.tcp.pendingRequests")
    
    // 渲染核心管理器（共享 HTTP 服务器的实例）
    weak var renderCoreManager: PreviewRenderCoreManager?
    
    // 为每个 instanceId 维护单线程队列，确保 callKotlinMethod 按顺序执行
    private var instanceCallKotlinMethodQueues: [String: DispatchQueue] = [:]
    private let instanceQueueLock = DispatchQueue(label: "com.kuikly.preview.tcp.instanceQueueLock")
    
    private init() {
        // 使用 HTTP 服务器的 renderCoreManager（即使 HTTP 服务器未启动监听器，也会初始化 renderCoreManager）
        // 确保 HTTP 服务器的 renderCoreManager 已初始化
        DispatchQueue.main.async {
            // 访问 shared 会触发初始化
            let _ = PreviewHttpServer.shared
            self.renderCoreManager = PreviewHttpServer.shared.renderCoreManager
        }
        
        // 监听 callKotlinMethod 通知请求
        NotificationCenter.default.addObserver(
            forName: NSNotification.Name("SendCallKotlinMethodNotification"),
            object: nil,
            queue: .main
        ) { [weak self] notification in
            guard let self = self,
                  let userInfo = notification.userInfo,
                  let instanceId = userInfo["instanceId"] as? String,
                  let requestId = userInfo["requestId"] as? String,
                  let sequence = userInfo["sequence"] as? Int64,
                  let methodId = userInfo["methodId"] as? Int,
                  let args = userInfo["args"] as? [Any?] else {
                return
            }
            
            // 使用 Task 确保在主 actor 上执行
            Task { @MainActor in
                _ = self.sendCallKotlinMethodNotification(
                    instanceId: instanceId,
                    requestId: requestId,
                    sequence: sequence,
                    methodId: methodId,
                    args: args
                )
            }
        }
    }
    
    /// 启动 TCP 服务
    func start(port: Int? = nil) {
        // 如果未指定端口，使用 PortManager 自动分配
        let actualPort: Int
        if let specifiedPort = port {
            actualPort = specifiedPort
        } else {
            // 使用 PortManager 自动分配端口
            guard let allocatedPort = PortManager.shared.allocateTcpPort() else {
                print("[TcpServer] ❌ 无法分配 TCP 端口")
                return
            }
            actualPort = allocatedPort
        }
        
        self.port = actualPort
        
        let networkQueue = DispatchQueue(label: "com.kuikly.preview.tcp.network", qos: .userInitiated)
        
        do {
            let parameters = NWParameters.tcp
            parameters.allowLocalEndpointReuse = true
            
            // 配置 TCP 选项
            let tcpOptions = NWProtocolTCP.Options()
            tcpOptions.enableKeepalive = true
            tcpOptions.keepaliveIdle = 60  // 60 秒空闲后发送 keepalive（避免连接过早关闭）
            tcpOptions.keepaliveInterval = 10  // 每 10 秒发送一次 keepalive
            tcpOptions.keepaliveCount = 3  // 最多发送 3 次 keepalive，如果无响应则关闭连接
            parameters.defaultProtocolStack.internetProtocol = .init(tcpOptions)
            
            listener = try NWListener(using: parameters, on: NWEndpoint.Port(rawValue: UInt16(actualPort))!)
            
            listener?.stateUpdateHandler = { [weak self] state in
                switch state {
                case .ready:
                    DispatchQueue.main.async {
                        self?.isRunning = true
                        print("[TcpServer] ✅ TCP 服务已启动，端口: \(actualPort)")
                    }
                case .failed(let error):
                    DispatchQueue.main.async {
                        self?.isRunning = false
                        print("[TcpServer] ❌ TCP 服务启动失败: \(error)")
                    }
                case .cancelled:
                    DispatchQueue.main.async {
                        self?.isRunning = false
                        print("[TcpServer] ⚠️ TCP 服务已取消")
                    }
                default:
                    break
                }
            }
            
            listener?.newConnectionHandler = { [weak self] connection in
                self?.handleNewConnection(connection)
            }
            
            listener?.start(queue: networkQueue)
        } catch {
            print("[TcpServer] ❌ 启动失败: \(error)")
        }
    }
    
    /// 停止 TCP 服务
    func stop() {
        listener?.cancel()
        connectionQueue.sync {
            for (_, connection) in connections {
                connection.cancel()
            }
            connections.removeAll()
        }
        DispatchQueue.main.async {
            self.isRunning = false
        }
        print("[TcpServer] 🛑 TCP 服务已停止")
    }
    
    /// 处理新连接
    private func handleNewConnection(_ connection: NWConnection) {
        let connectionId = UUID()
        
        connection.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                // 连接就绪，开始接收数据（instanceId 会在首次请求中确定）
                self?.receiveData(from: connection, connectionId: connectionId)
            case .failed, .cancelled:
                // 连接断开，清理相关资源
                self?.handleConnectionClosed(connectionId: connectionId)
            default:
                break
            }
        }
        
        connection.start(queue: connectionQueue)
    }
    
    /// 处理连接关闭，清理 instanceId 相关资源
    private func handleConnectionClosed(connectionId: UUID) {
        // 注意：handleConnectionClosed 可能在 connectionQueue 上被调用（通过 stateUpdateHandler）
        // 也可能在其他线程上被调用（通过 receiveData 的错误回调）
        // 使用 async 避免死锁，并确保线程安全
        connectionQueue.async { [weak self] in
            guard let self = self else { return }
            
            guard let instanceId = self.connectionToInstanceId[connectionId] else {
                print("[TcpServer] ⚠️ 连接关闭，但未找到对应的 instanceId: \(connectionId)")
                return
            }
            
            print("[TcpServer] 🔌 连接断开，清理 instanceId: \(instanceId)")
            
            // 移除连接映射
            self.connections.removeValue(forKey: instanceId)
            self.connectionToInstanceId.removeValue(forKey: connectionId)
            
            // 在主线程清理渲染资源
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                
                print("[TcpServer] 🧹 清理 instanceId 相关资源: \(instanceId)")
                
                // 销毁渲染实例
                self.renderCoreManager?.destroyInstance(instanceId: instanceId)
                
                // 清理 HTTP 服务器的相关数据
                PreviewHttpServer.shared.renderRequests.removeValue(forKey: instanceId)
                
                // 清理 callKotlinMethod 请求队列
                PreviewHttpServer.shared.clearCallKotlinMethodRequests(instanceId: instanceId)
                
                print("[TcpServer] ✅ instanceId 资源清理完成: \(instanceId)")
            }
        }
    }
    
    /// 接收数据
    private func receiveData(from connection: NWConnection, connectionId: UUID) {
        // 读取消息长度（4字节）
        connection.receive(minimumIncompleteLength: 4, maximumLength: 4) { [weak self] data, _, isComplete, error in
            guard let self = self else { return }
            
            if let error = error {
                print("[TcpServer] ❌ 接收长度失败: \(error)")
                self.handleConnectionClosed(connectionId: connectionId)
                return
            }
            
            if isComplete {
                print("[TcpServer] 🔌 连接已关闭")
                self.handleConnectionClosed(connectionId: connectionId)
                return
            }
            
            guard let data = data, data.count == 4 else {
                print("[TcpServer] ⚠️ 长度数据不完整，继续接收")
                // 继续接收，不关闭连接
                if connection.state == .ready {
                    self.receiveData(from: connection, connectionId: connectionId)
                }
                return
            }
            
            // 解析长度（大端序）
            let length = UInt32(data[0]) << 24 | UInt32(data[1]) << 16 | UInt32(data[2]) << 8 | UInt32(data[3])
            
            // 读取消息类型（1字节）
            connection.receive(minimumIncompleteLength: 1, maximumLength: 1) { [weak self] typeData, _, _, typeError in
                guard let self = self else { return }
                
                if let typeError = typeError {
                    print("[TcpServer] ❌ 接收类型失败: \(typeError)")
                    self.handleConnectionClosed(connectionId: connectionId)
                    return
                }
                
                guard let typeData = typeData, typeData.count == 1 else {
                    print("[TcpServer] ⚠️ 类型数据不完整")
                    return
                }
                
                let messageType = TcpMessageType(rawValue: typeData[0])
                guard let messageType = messageType else {
                    print("[TcpServer] ⚠️ 未知消息类型: \(typeData[0])")
                    // 继续接收下一条消息
                    if connection.state == .ready {
                        self.receiveData(from: connection, connectionId: connectionId)
                    }
                    return
                }
                
                // 读取消息数据
                let dataLength = Int(length)
                guard dataLength > 0 && dataLength <= 10 * 1024 * 1024 else { // 限制最大 10MB
                    print("[TcpServer] ⚠️ 消息长度异常: \(dataLength) (原始值: \(length), 十六进制: 0x\(String(length, radix: 16)))")
                    print("[TcpServer] ⚠️ 长度字节: [\(data[0]), \(data[1]), \(data[2]), \(data[3])]")
                    // 如果长度异常，可能是消息边界错位，尝试跳过当前字节并重新同步
                    // 但这里我们选择继续接收，让客户端重连
                    if connection.state == .ready {
                        self.receiveData(from: connection, connectionId: connectionId)
                    }
                    return
                }
                
                connection.receive(minimumIncompleteLength: dataLength, maximumLength: dataLength) { [weak self] messageData, _, _, dataError in
                    guard let self = self else { return }
                    
                    if let dataError = dataError {
                        print("[TcpServer] ❌ 接收数据失败: \(dataError)")
                        self.handleConnectionClosed(connectionId: connectionId)
                        return
                    }
                    
                    guard let messageData = messageData, messageData.count == dataLength else {
                        print("[TcpServer] ⚠️ 数据不完整")
                        return
                    }
                    
                    // 解析 JSON
                    guard let jsonString = String(data: messageData, encoding: .utf8),
                          let json = self.parseJson(jsonString) else {
                        print("[TcpServer] ❌ JSON 解析失败")
                        // 继续接收下一条消息
                        if connection.state == .ready {
                            self.receiveData(from: connection, connectionId: connectionId)
                        }
                        return
                    }
                    
                    // 处理消息
                    self.handleMessage(type: messageType, json: json, connection: connection, connectionId: connectionId)
                    
                    // 继续接收下一条消息（长连接）
                    if connection.state == .ready {
                        self.receiveData(from: connection, connectionId: connectionId)
                    }
                }
            }
        }
    }
    
    /// 处理消息
    private func handleMessage(type: TcpMessageType, json: JsonObject, connection: NWConnection, connectionId: UUID) {
        switch type {
        case .request:
            handleRequest(json: json, connection: connection, connectionId: connectionId)
        case .response:
            // 服务器不应收到响应消息
            print("[TcpServer] ⚠️ 收到意外的响应消息")
        case .notification:
            // 客户端不应发送通知到服务器
            print("[TcpServer] ⚠️ 收到意外的通知消息")
        case .binaryResponse:
            // 服务器不应收到二进制响应消息（这是服务器发送给客户端的）
            print("[TcpServer] ⚠️ 收到意外的二进制响应消息")
        }
    }
    
    /// 处理请求
    private func handleRequest(json: JsonObject, connection: NWConnection, connectionId: UUID) {
        guard let requestType = json["type"] as? String,
              let path = json["path"] as? String,
              let requestId = json["requestId"] as? Int64 else {
            sendErrorResponse(connection: connection, requestId: 0, message: "Invalid request format")
            return
        }
        
        let body = json["body"] as? [String: Any]
        
        // 从请求中提取 instanceId（通常在 body 中）
        let instanceId = body?["instanceId"] as? String ?? json["instanceId"] as? String
        
        // 如果是首次请求（如 /render），建立 instanceId 和连接的映射
        // 注意：由于 handleRequest 在 connectionQueue 上执行，不能使用 sync，否则会死锁
        if let instanceId = instanceId, !instanceId.isEmpty {
            // 如果该 instanceId 已有连接，检查是否是同一个连接
            if let oldConnection = connections[instanceId] {
                // 如果是同一个连接，不需要重新映射（避免重复映射）
                if oldConnection === connection {
                    // 连接已存在且是同一个，无需操作
                    // print("[TcpServer] ✅ instanceId=\(instanceId) 使用现有连接")
                } else {
                    // 如果是不同的连接，关闭旧连接（可能是客户端重连）
                    print("[TcpServer] ⚠️ instanceId=\(instanceId) 检测到新连接，关闭旧连接")
                    oldConnection.cancel()
                    // 查找并移除旧的 connectionId 映射
                    for (oldConnectionId, oldInstanceId) in connectionToInstanceId where oldInstanceId == instanceId {
                        connectionToInstanceId.removeValue(forKey: oldConnectionId)
                    }
                    // 建立新的映射
                    connections[instanceId] = connection
                    connectionToInstanceId[connectionId] = instanceId
                    print("[TcpServer] ✅ 建立新连接映射: instanceId=\(instanceId) -> connectionId=\(connectionId)")
                }
            } else {
                // 首次建立映射
                connections[instanceId] = connection
                connectionToInstanceId[connectionId] = instanceId
                print("[TcpServer] ✅ 建立连接映射: instanceId=\(instanceId) -> connectionId=\(connectionId)")
            }
        }
        
        // 路由请求
        switch requestType {
        case "GET":
            handleGetRequest(path: path, requestId: requestId, queryParams: parseQueryString(from: path), connection: connection)
        case "POST":
            handlePostRequest(path: path, requestId: requestId, body: body ?? [:], connection: connection)
        default:
            sendErrorResponse(connection: connection, requestId: requestId, message: "Unsupported request type: \(requestType)")
        }
    }
    
    /// 处理 GET 请求
    private func handleGetRequest(path: String, requestId: Int64, queryParams: [String: String], connection: NWConnection) {
        let basePath = path.split(separator: "?").first ?? ""
        
        switch basePath {
        case "/ping":
            sendResponse(connection: connection, requestId: requestId, json: ["status": "ok", "message": "pong"])
            
        case "/pollCallNativeResult":
            handlePollCallNativeResult(queryParams: queryParams, requestId: requestId, connection: connection)
            
        case "/pollCallKotlinMethod":
            handlePollCallKotlinMethod(queryParams: queryParams, requestId: requestId, connection: connection)
            
        case "/screenshot":
            handleScreenshotRequest(queryParams: queryParams, requestId: requestId, connection: connection)
            
        case "/listInstances":
            handleListInstancesRequest(requestId: requestId, connection: connection)
            
        default:
            sendErrorResponse(connection: connection, requestId: requestId, message: "Not Found: \(basePath)")
        }
    }
    
    /// 处理 POST 请求
    private func handlePostRequest(path: String, requestId: Int64, body: [String: Any], connection: NWConnection) {
        switch path {
        case "/render":
            handleRenderRequest(body: body, requestId: requestId, connection: connection)
            
        case "/callKotlinMethod":
            handleCallKotlinMethod(body: body, requestId: requestId, connection: connection)
            
        case "/callNative":
            handleCallNativeRequest(body: body, requestId: requestId, connection: connection)
            
        case "/callNativeResult":
            handleCallNativeResult(body: body, requestId: requestId, connection: connection)
            
        case "/destroy":
            handleDestroyRequest(body: body, requestId: requestId, connection: connection)
            
        case "/touch":
            handleTouchRequest(body: body, requestId: requestId, connection: connection)
            
        case "/sendEvent":
            handleSendEventRequest(body: body, requestId: requestId, connection: connection)
            
        case "/updateSize":
            handleUpdateSizeRequest(body: body, requestId: requestId, connection: connection)
            
        case "/updatePreviewConfig":
            handleUpdatePreviewConfigRequest(body: body, requestId: requestId, connection: connection)
            
        default:
            sendErrorResponse(connection: connection, requestId: requestId, message: "Not Found: \(path)")
        }
    }
    
    /// 发送响应
    private func sendResponse(connection: NWConnection, requestId: Int64, json: JsonObject) {
        var responseJson = json
        responseJson["requestId"] = requestId
        
        sendMessage(connection: connection, type: .response, json: responseJson)
    }
    
    /// 发送错误响应
    private func sendErrorResponse(connection: NWConnection, requestId: Int64, message: String) {
        let errorJson: JsonObject = [
            "status": "error",
            "message": message,
            "requestId": requestId
        ]
        sendResponse(connection: connection, requestId: requestId, json: errorJson)
    }
    
    /// 发送消息
    private func sendMessage(connection: NWConnection, type: TcpMessageType, json: JsonObject) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: json),
              let jsonString = String(data: jsonData, encoding: .utf8),
              let jsonBytes = jsonString.data(using: .utf8) else {
            print("[TcpServer] ❌ JSON 序列化失败")
            return
        }
        
        let length = UInt32(jsonBytes.count)
        var message = Data()
        
        // 写入长度（4字节，大端序）
        message.append(contentsOf: [
            UInt8((length >> 24) & 0xFF),
            UInt8((length >> 16) & 0xFF),
            UInt8((length >> 8) & 0xFF),
            UInt8(length & 0xFF)
        ])
        
        // 写入类型（1字节）
        message.append(type.rawValue)
        
        // 写入数据
        message.append(jsonBytes)
        
        connectionQueue.async {
            connection.send(content: message, completion: .contentProcessed { error in
                if let error = error {
                    print("[TcpServer] ❌ 发送消息失败: \(error)")
                }
            })
        }
    }
    
    /// 通过 TCP 长连接发送 callKotlinMethod 通知（Mac → JVM）
    /// @return 是否发送成功
    @MainActor
    func sendCallKotlinMethodNotification(instanceId: String, requestId: String, sequence: Int64, methodId: Int, args: [Any?]) -> Bool {
        return connectionQueue.sync {
            guard let connection = connections[instanceId] else {
                // 该 instanceId 没有 TCP 长连接，返回 false 使用队列存储
                return false
            }
            
            // 构建通知消息
            let notification: JsonObject = [
                "type": "callKotlinMethod",
                "instanceId": instanceId,
                "requestId": requestId,
                "sequence": sequence,
                "methodId": methodId,
                "args": args
            ]
            
            // 发送 NOTIFICATION 消息
            sendMessage(connection: connection, type: .notification, json: notification)
            
            print("[TcpServer] 📤 通过 TCP 长连接发送 callKotlinMethod: instanceId=\(instanceId), sequence=\(sequence), methodId=\(methodId)")
            return true
        }
    }
    
    /// 通过 TCP 长连接发送 refresh 通知（Mac → JVM）
    /// @return 是否发送成功
    @MainActor
    func sendRefreshNotification(instanceId: String) -> Bool {
        return connectionQueue.sync {
            guard let connection = connections[instanceId] else {
                // 该 instanceId 没有 TCP 长连接
                print("[TcpServer] ⚠️ 无法发送 refresh 通知: instanceId=\(instanceId) 没有 TCP 连接")
                return false
            }
            
            // 构建通知消息
            let notification: JsonObject = [
                "type": "refresh",
                "instanceId": instanceId
            ]
            
            // 发送 NOTIFICATION 消息
            sendMessage(connection: connection, type: .notification, json: notification)
            
            print("[TcpServer] 🔄 通过 TCP 长连接发送 refresh 通知: instanceId=\(instanceId)")
            return true
        }
    }
    
    // MARK: - 请求处理（直接实现，复用 HTTP 服务器的数据结构）
    
    // 获取 HTTP 服务器实例（在主线程访问）
    @MainActor
    private func getHttpServer() -> PreviewHttpServer {
        return PreviewHttpServer.shared
    }
    
    private func handleRenderRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let pageName = body["pageName"] as? String else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid render request: missing pageName")
            return
        }
        
        let pageData = body["pageData"] as? [String: Any] ?? [:]
        let instanceId = body["instanceId"] as? String ?? "default"
        let width = body["width"] as? Int ?? 400
        let height = body["height"] as? Int ?? 800
        
        print("[TcpServer] 📱 处理渲染请求: pageName=\(pageName), instanceId=\(instanceId), size=\(width)x\(height)")
        
        // 先发送响应
        sendResponse(connection: connection, requestId: requestId, json: ["status": "ok", "message": "Render started", "instanceId": instanceId])
        
        // 在主线程处理渲染请求（复用 HTTP 服务器的逻辑）
        DispatchQueue.main.async {
            let httpServer = PreviewHttpServer.shared
            
            // 提取配置参数
            let config = PreviewConfigModel(from: body)
            
            // 检查 renderRequests 中是否已有该实例（可能被 updatePreviewConfig 更新过）
            let finalWidth: CGFloat
            let finalHeight: CGFloat
            let finalConfig: PreviewConfigModel
            
            if let existingRequest = httpServer.renderRequests[instanceId] {
                // 如果已存在，保留 updatePreviewConfig 更新的尺寸，只更新 pageName、pageData 和合并配置
                finalWidth = existingRequest.width
                finalHeight = existingRequest.height
                // 合并配置：新配置优先，缺失的字段使用原有配置
                finalConfig = httpServer.mergeConfig(existingRequest.config, with: config)
                NSLog("[TcpServer] 🔄 发现已存在的 renderRequest，保留尺寸 %.0fx%.0f，合并配置", finalWidth, finalHeight)
            } else {
                // 如果不存在，使用请求中的尺寸和配置
                finalWidth = CGFloat(width)
                finalHeight = CGFloat(height)
                finalConfig = config
            }
            
            let request = RenderRequest(pageName: pageName, pageData: pageData, width: finalWidth, height: finalHeight, config: finalConfig)
            httpServer.renderRequests[instanceId] = request
            
            // 检查是否已存在相同 instanceId 的 ViewController
            if let existingVC = self.renderCoreManager?.getViewController(forInstanceId: instanceId) {
                NSLog("[TcpServer] 🔄 发现相同 instanceId 的 ViewController，重新创建 Kuikly 容器 (instanceId=%@)", instanceId)
                
                // 注意：不更新视图大小，保持 updatePreviewConfig 更新的尺寸
                // 因为 renderRequests 中已经保留了更新后的尺寸，PreviewRenderViewPage 会根据 renderRequests 自动更新
                
                // 重新创建 Kuikly 容器（不替换 ViewController）
                existingVC.recreateKuiklyContainer(withPageName: pageName, pageData: pageData)
                
                // 应用配置参数（使用合并后的配置）
                if let configDict = httpServer.configToDictionary(finalConfig) {
                    NSLog("[TcpServer] 📋 应用配置: %@", configDict)
                    existingVC.applyConfig(configDict)
                }
                
                NSLog("[TcpServer] ✅ 已重新创建 Kuikly 容器 (instanceId=%@, 保持尺寸: %.0fx%.0f)", instanceId, finalWidth, finalHeight)
            } else {
                
                // 没有旧实例，创建新的 ViewController
                NSLog("[TcpServer] 🆕 创建新的 ViewController (instanceId=%@)", instanceId)
                let viewController = PreviewRenderViewController(pageName: pageName, pageData: pageData, width: CGFloat(width), height: CGFloat(height))
                
                // ⚠️ 重要：先设置到管理器并配置回调，再加载视图
                self.renderCoreManager?.setViewController(viewController, forInstanceId: instanceId)
                NSLog("[TcpServer] ✅ 已设置 ViewController 到管理器 (instanceId=%@)", instanceId)
                
                // 最后加载视图（触发 renderViewDidCreated）
                _ = viewController.view
                NSLog("[TcpServer] ✅ ViewController 视图已加载 (instanceId=%@, 尺寸: %dx%d)", instanceId, width, height)
            }
        }
    }
    
    private func handleCallKotlinMethod(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let methodId = body["methodId"] as? Int else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid callKotlinMethod request")
            return
        }
        
        let args = body["args"] as? [Any?] ?? []
        let instanceId = body["instanceId"] as? String ?? "default"
        
        // 获取或创建该 instanceId 的单线程队列
        let instanceQueue = getOrCreateInstanceQueue(instanceId: instanceId)
        
        instanceQueue.async {
            DispatchQueue.main.async {
                self.renderCoreManager?.callKotlinMethod(methodId: methodId, args: args, instanceId: instanceId)
            }
        }
        
        sendResponse(connection: connection, requestId: requestId, json: ["status": "ok"])
    }
    
    private func handleCallNativeRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let methodId = body["methodId"] as? Int else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid callNative request")
            return
        }
        
        // 从 body 中获取 requestId（可能是 String 或 Int），统一转换为 Int64
        // 客户端发送的是 String，但我们需要使用 TCP 请求的 requestId（Int64）来匹配响应
        let requestIdStr = (body["requestId"] as? String) ?? String(requestId)
        
        let args = body["args"] as? [Any?] ?? []
        let instanceId = body["instanceId"] as? String ?? "default"
        
        print("[TcpServer] 📞 callNative: requestId=\(requestId) (body.requestId=\(requestIdStr)), instanceId=\(instanceId), methodId=\(methodId)")
        
        // 使用异步处理，避免阻塞 connectionQueue
        // 派发到全局队列异步处理
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let strongSelf = self else { return }
            
            // 同步处理请求并等待结果
            let semaphore = DispatchSemaphore(value: 0)
            var resultString: String = ""
            
            // 在 Context 线程处理 callNative（必须，否则会触发断言）
            let contextQueue = KuiklyRenderThreadManager.contextQueue()
            let queue = DispatchQueue(label: "context", target: contextQueue)
            
            // 将 [Any?] 转换为 [Any]
            let anyArgs = args.compactMap { $0 }
            
            queue.async {
                // 调用渲染层处理 callNative（现在在 Context 线程上）
                let callResult = strongSelf.renderCoreManager?.handleCallNativeFromJVM(
                    instanceId: instanceId,
                    methodId: methodId,
                    args: anyArgs
                )
                
                // 序列化结果（在后台线程执行，避免阻塞主线程）
                DispatchQueue.global(qos: .userInitiated).async {
                    if let callResult = callResult {
                        if let string = callResult as? String {
                            resultString = string
                        } else if JSONSerialization.isValidJSONObject([callResult]),
                                  let jsonData = try? JSONSerialization.data(withJSONObject: [callResult]),
                                  let jsonString = String(data: jsonData, encoding: .utf8) {
                            resultString = String(jsonString.dropFirst().dropLast())
                        } else {
                            resultString = String(describing: callResult)
                        }
                    } else {
                        resultString = ""
                    }
                    
                    semaphore.signal()
                }
            }
            
            // 等待结果（最多等待 5 秒）
            let timeout = semaphore.wait(timeout: .now() + 5.0)
            
            if timeout == .timedOut {
                print("[TcpServer] ⚠️ callNative 处理超时: requestId=\(requestId)")
                strongSelf.sendErrorResponse(connection: connection, requestId: requestId, message: "Timeout")
                return
            }
            
            // 将结果转换为可序列化的类型（在后台线程执行）
            let serializableResult: Any = strongSelf.convertToSerializable(resultString)
            
            print("[TcpServer] ✅ callNative 处理完成: requestId=\(requestId), result=\(resultString.isEmpty ? "(空)" : resultString)")
            
            // 发送 TCP 响应（二进制格式，不是 HTTP）
            // 注意：使用 TCP 请求的 requestId（Int64），而不是 body 中的 String
            let responseJson: JsonObject = [
                "status": "ok",
                "requestId": requestId,  // 使用 Int64 类型的 requestId，与客户端匹配
                "result": serializableResult
            ]
            strongSelf.sendResponse(connection: connection, requestId: requestId, json: responseJson)
        }
    }
    
    /// 将任意值转换为可 JSON 序列化的类型（复用 HTTP 服务器的逻辑）
    private func convertToSerializable(_ value: Any) -> Any {
        return PreviewHttpServer.shared.convertToSerializable(value)
    }
    
    private func handleCallNativeResult(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let requestIdStr = body["requestId"] as? String else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid callNativeResult request")
            return
        }
        
        let result = body["result"]
        
        DispatchQueue.main.async {
            self.renderCoreManager?.handleCallNativeResult(requestId: requestIdStr, result: result)
        }
        
        sendResponse(connection: connection, requestId: requestId, json: ["status": "ok"])
    }
    
    private func handlePollCallNativeResult(queryParams: [String: String], requestId: Int64, connection: NWConnection) {
        // TCP 的 callNative 现在是同步的，不需要轮询
        // 此方法保留用于兼容性，但应该不会被调用
        sendErrorResponse(connection: connection, requestId: requestId, message: "callNative is now synchronous, polling is not needed")
    }
    
    private func handlePollCallKotlinMethod(queryParams: [String: String], requestId: Int64, connection: NWConnection) {
        let instanceId = queryParams["instanceId"] ?? "default"
        
        // 复用 HTTP 服务器的请求队列
        let requests: [[String: Any]] = DispatchQueue.main.sync {
            return PreviewHttpServer.shared.getCallKotlinMethodRequests(instanceId: instanceId)
        }
        
        sendResponse(connection: connection, requestId: requestId, json: [
            "status": "ok",
            "requests": requests
        ])
    }
    
    private func handleDestroyRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let instanceId = body["instanceId"] as? String else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid destroy request")
            return
        }
        
        DispatchQueue.main.async {
            self.renderCoreManager?.destroyInstance(instanceId: instanceId)
            PreviewHttpServer.shared.renderRequests.removeValue(forKey: instanceId)
        }
        
        sendResponse(connection: connection, requestId: requestId, json: ["status": "ok"])
    }
    
    private func handleScreenshotRequest(queryParams: [String: String], requestId: Int64, connection: NWConnection) {
        let instanceId = queryParams["instanceId"]
        
        print("[TcpServer] 📸 处理截图请求, instanceId=\(instanceId ?? "default"), requestId=\(requestId)")
        
        // 在主线程获取截图
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            // 获取渲染视图的截图
            if let imageData = self.renderCoreManager?.captureScreenshot(instanceId: instanceId) {
                print("[TcpServer] 📸 截图成功: \(imageData.count) 字节 (instanceId=\(instanceId ?? "default"))")
                // 发送二进制响应
                self.sendBinaryResponse(connection: connection, requestId: requestId, binaryData: imageData)
            } else {
                print("[TcpServer] ⚠️ 截图失败: renderCoreManager 或视图为空 (instanceId=\(instanceId ?? "default"))")
                self.sendErrorResponse(connection: connection, requestId: requestId, message: "No render view available")
            }
        }
    }
    
    /// 发送二进制响应
    private func sendBinaryResponse(connection: NWConnection, requestId: Int64, binaryData: Data) {
        // 格式：requestId(8字节，大端序) + 二进制数据
        var message = Data()
        
        // 写入 requestId（8字节，大端序）
        let requestIdBytes: [UInt8] = [
            UInt8((requestId >> 56) & 0xFF),
            UInt8((requestId >> 48) & 0xFF),
            UInt8((requestId >> 40) & 0xFF),
            UInt8((requestId >> 32) & 0xFF),
            UInt8((requestId >> 24) & 0xFF),
            UInt8((requestId >> 16) & 0xFF),
            UInt8((requestId >> 8) & 0xFF),
            UInt8(requestId & 0xFF)
        ]
        message.append(contentsOf: requestIdBytes)
        
        // 追加二进制数据
        message.append(binaryData)
        
        let totalLength = UInt32(message.count)
        var fullMessage = Data()
        
        // 写入长度（4字节，大端序）
        fullMessage.append(contentsOf: [
            UInt8((totalLength >> 24) & 0xFF),
            UInt8((totalLength >> 16) & 0xFF),
            UInt8((totalLength >> 8) & 0xFF),
            UInt8(totalLength & 0xFF)
        ])
        
        // 写入类型（1字节）
        fullMessage.append(TcpMessageType.binaryResponse.rawValue)
        
        // 写入数据（requestId + 二进制数据）
        fullMessage.append(message)
        
        connectionQueue.async {
            connection.send(content: fullMessage, completion: .contentProcessed { error in
                if let error = error {
                    print("[TcpServer] ❌ 发送二进制响应失败: \(error)")
                } else {
                    print("[TcpServer] ✅ 二进制响应已发送: requestId=\(requestId), size=\(binaryData.count) 字节")
                }
            })
        }
    }
    
    private func handleListInstancesRequest(requestId: Int64, connection: NWConnection) {
        // 在主线程获取实例列表（因为 renderRequests 在主线程访问）
        var instances: [[String: Any]] = []
        
        DispatchQueue.main.sync {
            let httpServer = PreviewHttpServer.shared
            for (instanceId, request) in httpServer.renderRequests {
                instances.append([
                    "instanceId": instanceId,
                    "pageName": request.pageName,
                    "width": Int(request.width),
                    "height": Int(request.height),
                    "timestamp": request.timestamp.timeIntervalSince1970
                ])
            }
        }
        
        // 在 connectionQueue 上发送响应（确保线程安全）
        sendResponse(connection: connection, requestId: requestId, json: [
            "status": "ok",
            "instances": instances,
            "count": instances.count
        ])
    }
    
    private func handleTouchRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let instanceId = body["instanceId"] as? String,
              let type = body["type"] as? String,
              let x = body["x"] as? Double,
              let y = body["y"] as? Double else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid touch request")
            return
        }
        
        DispatchQueue.main.async {
            self.renderCoreManager?.handleTouchEvent(
                instanceId: instanceId,
                type: type,
                x: CGFloat(x),
                y: CGFloat(y)
            )
        }
        
        sendResponse(connection: connection, requestId: requestId, json: ["status": "ok", "received": true])
    }
    
    private func handleSendEventRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let instanceId = body["instanceId"] as? String,
              let event = body["event"] as? String else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid sendEvent request")
            return
        }
        
        let data = body["data"] as? [String: Any] ?? [:]
        
        print("[TcpServer] 📨 收到 sendEvent 请求: instanceId=\(instanceId), event=\(event), data=\(data)")
        
        // 在主线程处理事件发送
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            let success = self.renderCoreManager?.sendEvent(
                instanceId: instanceId,
                event: event,
                data: data
            ) ?? false
            
            if success {
                print("[TcpServer] ✅ sendEvent 成功: instanceId=\(instanceId), event=\(event)")
                self.sendResponse(connection: connection, requestId: requestId, json: [
                    "status": "ok",
                    "message": "Event sent"
                ])
            } else {
                print("[TcpServer] ⚠️ sendEvent 失败: instanceId=\(instanceId), event=\(event)")
                self.sendErrorResponse(connection: connection, requestId: requestId, message: "No render view available for instanceId: \(instanceId)")
            }
        }
    }
    
    private func handleUpdateSizeRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let instanceId = body["instanceId"] as? String,
              let width = body["width"] as? Int,
              let height = body["height"] as? Int else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid updateSize request")
            return
        }
        
        print("[TcpServer] 📐 收到更新大小请求: instanceId=\(instanceId), size=\(width)x\(height)")
        
        // 在主线程处理大小更新
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            let success = self.renderCoreManager?.updateSize(
                instanceId: instanceId,
                width: CGFloat(width),
                height: CGFloat(height)
            ) ?? false
            
            if success {
                print("[TcpServer] ✅ 预览大小更新成功: instanceId=\(instanceId), size=\(width)x\(height)")
                self.sendResponse(connection: connection, requestId: requestId, json: [
                    "status": "ok",
                    "message": "Size updated",
                    "width": width,
                    "height": height
                ])
            } else {
                print("[TcpServer] ⚠️ 预览大小更新失败: instanceId=\(instanceId), size=\(width)x\(height)")
                self.sendErrorResponse(connection: connection, requestId: requestId, message: "No render view available for instanceId: \(instanceId)")
            }
        }
    }
    
    private func handleUpdatePreviewConfigRequest(body: [String: Any], requestId: Int64, connection: NWConnection) {
        guard let instanceId = body["instanceId"] as? String else {
            sendErrorResponse(connection: connection, requestId: requestId, message: "Invalid updatePreviewConfig request")
            return
        }
        
        print("[TcpServer] 📋 收到更新预览配置请求: instanceId=\(instanceId)")
        
        // 解析配置参数
        let config = PreviewConfigModel.fromDictionary(body)
        
        // 在主线程处理配置更新
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            let success = self.renderCoreManager?.updatePreviewConfig(
                instanceId: instanceId,
                config: config
            ) ?? false
            
            if success {
                print("[TcpServer] ✅ 预览配置更新成功: instanceId=\(instanceId)")
                self.sendResponse(connection: connection, requestId: requestId, json: [
                    "status": "ok",
                    "message": "Preview config updated"
                ])
            } else {
                print("[TcpServer] ⚠️ 预览配置更新失败: instanceId=\(instanceId)")
                self.sendErrorResponse(connection: connection, requestId: requestId, message: "No render view available for instanceId: \(instanceId)")
            }
        }
    }
    
    /// 获取或创建指定 instanceId 的单线程队列
    private func getOrCreateInstanceQueue(instanceId: String) -> DispatchQueue {
        return instanceQueueLock.sync {
            if let existingQueue = instanceCallKotlinMethodQueues[instanceId] {
                return existingQueue
            }
            
            let newQueue = DispatchQueue(label: "com.kuikly.preview.tcp.callKotlinMethod.\(instanceId)", attributes: [])
            instanceCallKotlinMethodQueues[instanceId] = newQueue
            return newQueue
        }
    }
    
    // MARK: - 辅助方法
    
    private func parseJson(_ jsonString: String) -> JsonObject? {
        guard let data = jsonString.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? JsonObject else {
            return nil
        }
        return json
    }
    
    private func parseQueryString(from path: String) -> [String: String] {
        guard let queryStart = path.firstIndex(of: "?") else {
            return [:]
        }
        let queryString = String(path[path.index(after: queryStart)...])
        var params: [String: String] = [:]
        let pairs = queryString.split(separator: "&")
        for pair in pairs {
            let keyValue = pair.split(separator: "=", maxSplits: 1)
            if keyValue.count == 2 {
                let key = String(keyValue[0])
                let value = String(keyValue[1]).removingPercentEncoding ?? String(keyValue[1])
                params[key] = value
            }
        }
        return params
    }
    
    private func convertToJsonString(_ dict: [String: Any]) -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: dict),
              let string = String(data: data, encoding: .utf8) else {
            return "{}"
        }
        return string
    }
}

// MARK: - 类型别名

typealias JsonObject = [String: Any]

