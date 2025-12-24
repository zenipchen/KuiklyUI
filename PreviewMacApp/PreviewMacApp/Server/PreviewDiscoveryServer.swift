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

/// 服务发现服务器 - 提供 HTTP 端点用于客户端发现 TCP 端口
class PreviewDiscoveryServer: ObservableObject {
    @MainActor static let shared = PreviewDiscoveryServer()
    
    @Published var port: Int = 8765
    @Published var isRunning: Bool = false
    
    private var listener: NWListener?
    private var connections: [UUID: NWConnection] = [:]
    private let connectionQueue = DispatchQueue(label: "com.kuikly.preview.discovery.connections")
    
    private init() {}
    
    /// 启动服务发现服务器
    func start() {
        // 使用 PortManager 分配端口
        guard let allocatedPort = PortManager.shared.allocateDiscoveryPort() else {
            print("[DiscoveryServer] ❌ 无法分配服务发现端口")
            return
        }
        
        self.port = allocatedPort
        
        let networkQueue = DispatchQueue(label: "com.kuikly.preview.discovery.network", qos: .userInitiated)
        
        do {
            let parameters = NWParameters.tcp
            parameters.allowLocalEndpointReuse = true
            
            listener = try NWListener(using: parameters, on: NWEndpoint.Port(rawValue: UInt16(port))!)
            
            listener?.stateUpdateHandler = { [weak self] state in
                switch state {
                case .ready:
                    DispatchQueue.main.async {
                        self?.isRunning = true
                        print("[DiscoveryServer] ✅ 服务发现端点已启动，端口: \(allocatedPort)")
                    }
                case .failed(let error):
                    DispatchQueue.main.async {
                        self?.isRunning = false
                        print("[DiscoveryServer] ❌ 服务发现端点启动失败: \(error)")
                    }
                case .cancelled:
                    DispatchQueue.main.async {
                        self?.isRunning = false
                        print("[DiscoveryServer] ⚠️ 服务发现端点已取消")
                    }
                case .waiting(let error):
                    print("[DiscoveryServer] ⏳ 服务发现端点等待中: \(error)")
                @unknown default:
                    break
                }
            }
            
            listener?.newConnectionHandler = { [weak self] connection in
                self?.handleConnection(connection)
            }
            
            listener?.start(queue: networkQueue)
        } catch {
            print("[DiscoveryServer] ❌ 创建监听器失败: \(error)")
        }
    }
    
    /// 停止服务发现服务器
    func stop() {
        listener?.cancel()
        listener = nil
        
        connectionQueue.async {
            self.connections.values.forEach { $0.cancel() }
            self.connections.removeAll()
        }
        
        DispatchQueue.main.async {
            self.isRunning = false
        }
    }
    
    /// 处理连接
    private func handleConnection(_ connection: NWConnection) {
        let connectionId = UUID()
        
        connectionQueue.async {
            self.connections[connectionId] = connection
        }
        
        connection.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                self?.receiveData(from: connection, connectionId: connectionId)
            case .failed(let error):
                print("[DiscoveryServer] ❌ 连接失败: \(error)")
                self?.connectionQueue.async {
                    self?.connections.removeValue(forKey: connectionId)
                }
            case .cancelled:
                self?.connectionQueue.async {
                    self?.connections.removeValue(forKey: connectionId)
                }
            case .waiting(let error):
                print("[DiscoveryServer] ⏳ 连接等待中: \(error)")
            @unknown default:
                break
            }
        }
        
        connection.start(queue: connectionQueue)
    }
    
    /// 接收数据
    private func receiveData(from connection: NWConnection, connectionId: UUID) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, isComplete, error in
            if let error = error {
                print("[DiscoveryServer] ❌ 接收数据错误: \(error)")
                self?.connectionQueue.async {
                    self?.connections.removeValue(forKey: connectionId)
                }
                return
            }
            
            if let data = data, !data.isEmpty {
                self?.handleRequest(data: data, connection: connection)
            }
            
            if !isComplete {
                self?.receiveData(from: connection, connectionId: connectionId)
            }
        }
    }
    
    /// 处理 HTTP 请求
    private func handleRequest(data: Data, connection: NWConnection) {
        guard let requestString = String(data: data, encoding: .utf8) else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid request data")
            return
        }
        
        let lines = requestString.components(separatedBy: "\r\n")
        guard let firstLine = lines.first else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Empty request")
            return
        }
        
        let parts = firstLine.components(separatedBy: " ")
        guard parts.count >= 2 else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Malformed request line")
            return
        }
        
        let method = parts[0]
        let path = parts[1]
        
        // 只处理 GET /discover 请求
        if method == "GET" && path == "/discover" {
            handleDiscoverRequest(connection: connection)
        } else {
            sendErrorResponse(connection: connection, statusCode: 404, message: "Not Found")
        }
    }
    
    /// 处理 /discover 请求
    private func handleDiscoverRequest(connection: NWConnection) {
        // 获取 TCP 端口（需要在主线程访问）
        let tcpPort = DispatchQueue.main.sync {
            PreviewTcpServer.shared.port
        }
        
        let response: [String: Any] = [
            "tcpPort": tcpPort,
            "discoveryPort": port,
            "status": "ok",
            "version": "1.0.0"
        ]
        
        sendJsonResponse(connection: connection, json: response)
    }
    
    /// 发送 JSON 响应
    private func sendJsonResponse(connection: NWConnection, json: [String: Any]) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: json),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            sendErrorResponse(connection: connection, statusCode: 500, message: "JSON serialization failed")
            return
        }
        
        let response = """
        HTTP/1.1 200 OK\r
        Content-Type: application/json\r
        Content-Length: \(jsonData.count)\r
        Access-Control-Allow-Origin: *\r
        \r
        \(jsonString)
        """
        
        if let responseData = response.data(using: .utf8) {
            connection.send(content: responseData, completion: .contentProcessed { error in
                if let error = error {
                    print("[DiscoveryServer] ❌ 发送响应失败: \(error)")
                }
                connection.cancel()
            })
        }
    }
    
    /// 发送错误响应
    private func sendErrorResponse(connection: NWConnection, statusCode: Int, message: String) {
        let response = """
        HTTP/1.1 \(statusCode) \(message)\r
        Content-Type: text/plain\r
        Content-Length: \(message.count)\r
        \r
        \(message)
        """
        
        if let responseData = response.data(using: .utf8) {
            connection.send(content: responseData, completion: .contentProcessed { error in
                if let error = error {
                    print("[DiscoveryServer] ❌ 发送错误响应失败: \(error)")
                }
                connection.cancel()
            })
        }
    }
}

