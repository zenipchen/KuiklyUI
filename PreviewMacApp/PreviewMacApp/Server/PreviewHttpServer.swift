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
import Combine

/// 预览配置模型
struct PreviewConfigModel {
    let name: String?
    let group: String?
    let device: String?
    let width: Int?
    let height: Int?
    let density: Float?
    let orientation: String?
    let isRound: Bool?
    let chinSize: Int?
    let cutout: String?
    let navigation: String?
    let apiLevel: Int?
    let locale: String?
    let fontScale: Float?
    let showSystemUi: Bool?
    let showBackground: Bool?
    let backgroundColor: String?
    let uiMode: String?
    let wallpaper: String?
    
    init(from json: [String: Any]) {
        self.name = json["name"] as? String
        self.group = json["group"] as? String
        self.device = json["device"] as? String
        // 支持多种数字类型解析（Int, NSNumber, Double）
        if let widthValue = json["width"] {
            if let widthInt = widthValue as? Int {
                self.width = widthInt
            } else if let widthNumber = widthValue as? NSNumber {
                self.width = widthNumber.intValue
            } else if let widthDouble = widthValue as? Double {
                self.width = Int(widthDouble)
            } else {
                self.width = nil
            }
        } else {
            self.width = nil
        }
        if let heightValue = json["height"] {
            if let heightInt = heightValue as? Int {
                self.height = heightInt
            } else if let heightNumber = heightValue as? NSNumber {
                self.height = heightNumber.intValue
            } else if let heightDouble = heightValue as? Double {
                self.height = Int(heightDouble)
            } else {
                self.height = nil
            }
        } else {
            self.height = nil
        }
        self.density = (json["density"] as? NSNumber)?.floatValue
        self.orientation = json["orientation"] as? String
        self.isRound = json["isRound"] as? Bool
        self.chinSize = (json["chinSize"] as? NSNumber)?.intValue
        self.cutout = json["cutout"] as? String
        self.navigation = json["navigation"] as? String
        self.apiLevel = (json["apiLevel"] as? NSNumber)?.intValue
        self.locale = json["locale"] as? String
        self.fontScale = (json["fontScale"] as? NSNumber)?.floatValue
        self.showSystemUi = json["showSystemUi"] as? Bool
        self.showBackground = json["showBackground"] as? Bool
        self.backgroundColor = json["backgroundColor"] as? String
        self.uiMode = json["uiMode"] as? String
        self.wallpaper = json["wallpaper"] as? String
    }
    
    /// 从字典创建配置模型（排除 instanceId）
    static func fromDictionary(_ dict: [String: Any]) -> PreviewConfigModel {
        var configDict = dict
        configDict.removeValue(forKey: "instanceId")  // 移除 instanceId，它不是配置参数
        return PreviewConfigModel(from: configDict)
    }
}

/// 渲染请求模型
struct RenderRequest: Identifiable {
    let id = UUID()
    let pageName: String
    let pageData: [String: Any]
    let width: CGFloat
    let height: CGFloat
    let config: PreviewConfigModel?
    let timestamp: Date = Date()
    
    init(pageName: String, pageData: [String: Any], width: CGFloat = 400, height: CGFloat = 800, config: PreviewConfigModel? = nil) {
        self.pageName = pageName
        self.pageData = pageData
        self.width = width
        self.height = height
        self.config = config
    }
}

/// HTTP 服务器 - 用于接收来自 SDK 的渲染指令
class PreviewHttpServer: ObservableObject {
    @MainActor static let shared = PreviewHttpServer()
    
    @Published var port: Int = 9527  // HTTP 服务端口
    @Published var isRunning: Bool = false
    @Published var renderRequests: [String: RenderRequest] = [:]  // 多实例渲染请求 (instanceId -> RenderRequest)
    
    private var listener: NWListener?
    private var connections: [UUID: NWConnection] = [:]  // 优化：使用字典替代数组，O(1) 查找
    private let connectionQueue = DispatchQueue(label: "com.kuikly.preview.connections")
    
    // 渲染核心管理器（公开以便截图使用）
    var renderCoreManager: PreviewRenderCoreManager?
    
    // 为每个 instanceId 维护单线程队列，确保 callKotlinMethod 按顺序执行（JVM -> Mac）
    private var instanceCallKotlinMethodQueues: [String: DispatchQueue] = [:]
    private let instanceQueueLock = DispatchQueue(label: "com.kuikly.preview.instanceQueueLock")
    
    private init() {
        renderCoreManager = PreviewRenderCoreManager()
    }
    
    /// 启动 HTTP 服务
    func start(port: Int = 9527) {
        self.port = port
        
        // 创建专用的网络队列，避免阻塞主队列
        let networkQueue = DispatchQueue(label: "com.kuikly.preview.network", qos: .userInitiated)
        
        do {
            let parameters = NWParameters.tcp
            parameters.allowLocalEndpointReuse = true
            
            // 配置 TCP 选项，允许重用端口
            let tcpOptions = NWProtocolTCP.Options()
            tcpOptions.enableKeepalive = true
            tcpOptions.keepaliveIdle = 1
            parameters.defaultProtocolStack.internetProtocol = .init(tcpOptions)
            
            listener = try NWListener(using: parameters, on: NWEndpoint.Port(rawValue: UInt16(port))!)
            
            listener?.stateUpdateHandler = { [weak self] state in
                switch state {
                case .ready:
                    DispatchQueue.main.async {
                        self?.isRunning = true
                        print("[PreviewServer] ✅ HTTP 服务已启动，端口: \(port)")
                    }
                case .failed(let error):
                    DispatchQueue.main.async {
                        self?.isRunning = false
                        print("[PreviewServer] ❌ HTTP 服务启动失败: \(error)")
                    }
                case .cancelled:
                    DispatchQueue.main.async {
                        self?.isRunning = false
                        print("[PreviewServer] ⚠️ HTTP 服务已取消")
                    }
                default:
                    break
                }
            }
            
            listener?.newConnectionHandler = { [weak self] connection in
                self?.handleConnection(connection)
            }
            
            // 在专用网络队列上启动监听器
            listener?.start(queue: networkQueue)
            
        } catch {
            print("[PreviewServer] ❌ 创建监听器失败: \(error)")
        }
    }
    
    /// 停止 HTTP 服务
    func stop() {
        listener?.cancel()
        connectionQueue.sync {
            connections.values.forEach { $0.cancel() }
            connections.removeAll()
        }
        
        // 清理所有渲染实例
        DispatchQueue.main.async {
            self.renderRequests.removeAll()
            self.renderCoreManager?.destroy()
        }
        
        isRunning = false
        print("[PreviewServer] 🛑 HTTP 服务已停止")
    }
    
    /// 处理新连接
    private func handleConnection(_ connection: NWConnection) {
        let connectionId = UUID()
        connectionQueue.sync {
            connections[connectionId] = connection
        }
        
        // 设置连接超时（1秒）
        let timeout: TimeInterval = 1.0
        let timeoutTimer = DispatchSource.makeTimerSource(queue: connectionQueue)
        timeoutTimer.schedule(deadline: .now() + timeout)
        timeoutTimer.setEventHandler { [weak connection] in
            connection?.cancel()
            print("[PreviewServer] ⏱️ 连接超时，已取消: \(timeout)秒")
        }
        timeoutTimer.resume()
        
        connection.stateUpdateHandler = { [weak self, weak connection, weak timeoutTimer] state in
            switch state {
            case .ready:
                // 连接成功，取消超时定时器
                timeoutTimer?.cancel()
                if let conn = connection {
                    self?.receiveData(from: conn)
                }
            case .failed, .cancelled:
                // 连接失败或取消，取消超时定时器
                timeoutTimer?.cancel()
                if let conn = connection {
                    self?.connectionQueue.sync {
                        // 优化：使用字典，O(1) 查找和删除
                        self?.connections.removeValue(forKey: connectionId)
                    }
                }
            default:
                break
            }
        }
        
        // 在专用队列上启动连接，避免阻塞
        let connectionQueue = DispatchQueue(label: "com.kuikly.preview.connection.\(UUID().uuidString)", qos: .userInitiated)
        connection.start(queue: connectionQueue)
    }
    
    /// 接收数据（带超时控制）
    private func receiveData(from connection: NWConnection) {
        // 设置接收数据超时（1秒）
        let timeout: TimeInterval = 1.0
        let timeoutTimer = DispatchSource.makeTimerSource(queue: DispatchQueue.global())
        timeoutTimer.schedule(deadline: .now() + timeout)
        timeoutTimer.setEventHandler { [weak connection] in
            connection?.cancel()
            print("[PreviewServer] ⏱️ 接收数据超时，已取消连接: \(timeout)秒")
        }
        timeoutTimer.resume()
        
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self, weak timeoutTimer] data, _, isComplete, error in
            // 取消超时定时器
            timeoutTimer?.cancel()
            
            if let data = data, !data.isEmpty {
                self?.handleRequest(data: data, connection: connection)
            }
            
            if isComplete || error != nil {
                connection.cancel()
            } else {
                self?.receiveData(from: connection)
            }
        }
    }
    
    /// 处理 HTTP 请求
    private func handleRequest(data: Data, connection: NWConnection) {
        guard let requestString = String(data: data, encoding: .utf8) else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid request data")
            return
        }
        
        // 解析 HTTP 请求
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
        
        // 提取请求体
        let bodyStartIndex = requestString.range(of: "\r\n\r\n")?.upperBound
        let body = bodyStartIndex != nil ? String(requestString[bodyStartIndex!...]) : ""
        
        // 路由请求
        routeRequest(method: method, path: path, body: body, connection: connection)
    }
    
    /// 路由请求
    private func routeRequest(method: String, path: String, body: String, connection: NWConnection) {
//        print("[PreviewServer] 📥 收到请求: \(method) \(path)")
        
        // 解析路径和查询参数
        let pathComponents = path.split(separator: "?", maxSplits: 1)
        let basePath = String(pathComponents.first ?? "")
        let queryString = pathComponents.count > 1 ? String(pathComponents[1]) : ""
        let queryParams = parseQueryString(queryString)
        
        switch basePath {
        case "/ping":
            // 健康检查
            sendJsonResponse(connection: connection, json: ["status": "ok", "message": "pong"])
            
        case "/render":
            // 创建渲染视图
            handleRenderRequest(body: body, connection: connection)
            
        case "/callKotlinMethod":
            // 处理来自 SDK 的 callKotlinMethod 调用
            handleCallKotlinMethod(body: body, connection: connection)
            
        case "/callNative":
            // 处理来自 SDK 的 callNative 请求
            handleCallNativeRequest(body: body, connection: connection)
            
        case "/callNativeResult":
            // 接收 callNative 的结果
            handleCallNativeResult(body: body, connection: connection)
            
        case "/pollCallNativeResult":
            // SDK 轮询获取 callNative 结果
            handlePollCallNativeResult(queryParams: queryParams, connection: connection)
            
        case "/pollCallKotlinMethod":
            // SDK 轮询获取待执行的 callKotlinMethod
            handlePollCallKotlinMethod(queryParams: queryParams, connection: connection)
            
        case "/pollCallNativeFromSdk":
            // 渲染层轮询获取待处理的 callNative 请求
            handlePollCallNativeFromSdk(queryParams: queryParams, connection: connection)
            
        case "/destroy":
            // 销毁渲染视图
            handleDestroyRequest(body: body, connection: connection)
            
        case "/screenshot":
            // 获取渲染视图截图
            handleScreenshotRequest(queryParams: queryParams, connection: connection)
            
        case "/listInstances":
            // 列出所有渲染实例
            handleListInstancesRequest(connection: connection)
            
        case "/touch":
            // 处理触摸事件
            handleTouchRequest(body: body, connection: connection)
            
        case "/sendEvent":
            // 发送页面事件到 Kuikly 容器
            handleSendEventRequest(body: body, connection: connection)
            
        case "/updateSize":
            // 更新预览大小
            handleUpdateSizeRequest(body: body, connection: connection)
            
        case "/updatePreviewConfig":
            // 更新预览配置
            handleUpdatePreviewConfigRequest(body: body, connection: connection)
            
        default:
            sendErrorResponse(connection: connection, statusCode: 404, message: "Not Found: \(basePath)")
        }
    }
    
    /// 解析查询字符串
    private func parseQueryString(_ queryString: String) -> [String: String] {
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
    
    /// 处理渲染请求
    private func handleRenderRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let pageName = json["pageName"] as? String else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid render request")
            return
        }
        
        let pageData = json["pageData"] as? [String: Any] ?? [:]
        let instanceId = json["instanceId"] as? String ?? "default"
        let width = json["width"] as? Int ?? 400
        let height = json["height"] as? Int ?? 800
        
        // 提取配置参数
        let config = PreviewConfigModel(from: json)
        
        NSLog("[PreviewServer] 📱 处理渲染请求: pageName=%@, instanceId=%@, size=%dx%d", pageName, instanceId, width, height)
        if let device = config.device {
            NSLog("[PreviewServer] 📋 预览配置: device=%@, density=%@, orientation=%@", device, config.density != nil ? String(format: "%.2f", config.density!) : "nil", config.orientation ?? "nil")
        }
        
        // 先发送响应，然后在主线程创建 ViewController
        sendJsonResponse(connection: connection, json: ["status": "ok", "message": "Render started", "instanceId": instanceId])
        
        DispatchQueue.main.async {
            NSLog("[PreviewServer] 🔧 在主线程处理渲染请求 (instanceId=%@)...", instanceId)
            
            // 检查 renderRequests 中是否已有该实例（可能被 updatePreviewConfig 更新过）
            let finalWidth: CGFloat
            let finalHeight: CGFloat
            let finalConfig: PreviewConfigModel
            
            if let existingRequest = self.renderRequests[instanceId] {
                // 如果已存在，保留 updatePreviewConfig 更新的尺寸，只更新 pageName、pageData 和合并配置
                finalWidth = existingRequest.width
                finalHeight = existingRequest.height
                // 合并配置：新配置优先，缺失的字段使用原有配置
                finalConfig = self.mergeConfig(existingRequest.config, with: config)
                NSLog("[PreviewServer] 🔄 发现已存在的 renderRequest，保留尺寸 %.0fx%.0f，合并配置", finalWidth, finalHeight)
            } else {
                // 如果不存在，使用请求中的尺寸和配置
                finalWidth = CGFloat(width)
                finalHeight = CGFloat(height)
                finalConfig = config
            }
            
            let request = RenderRequest(pageName: pageName, pageData: pageData, width: finalWidth, height: finalHeight, config: finalConfig)
            
            // 存储渲染请求（支持多实例）
            self.renderRequests[instanceId] = request
            
            // 检查是否已存在相同 instanceId 的 ViewController
            if let existingVC = self.renderCoreManager?.getViewController(forInstanceId: instanceId) {
                NSLog("[PreviewServer] 🔄 发现相同 instanceId 的 ViewController，复用 VC 并更换 Kuikly 容器")
                NSLog("[PreviewServer] 📍 instanceId=%@, 旧页面=%@, 新页面=%@", instanceId, existingVC.pageName ?? "unknown", pageName)
                
                // 注意：不更新视图大小，保持 updatePreviewConfig 更新的尺寸
                // 因为 renderRequests 中已经保留了更新后的尺寸，PreviewRenderViewPage 会根据 renderRequests 自动更新
                
                // 重新创建 Kuikly 容器（不替换 ViewController）
                NSLog("[PreviewServer] 🔄 开始更换 Kuikly 容器...")
                existingVC.recreateKuiklyContainer(withPageName: pageName, pageData: pageData)
                
                // 应用配置参数（使用合并后的配置）
                if let configDict = self.configToDictionary(finalConfig) {
                    NSLog("[PreviewServer] 📋 应用配置: %@", configDict)
                    existingVC.applyConfig(configDict)
                }
                
                NSLog("[PreviewServer] ✅ 已完成容器更换 (instanceId=%@, 页面=%@, 尺寸=%dx%d)", instanceId, pageName, width, height)
            } else {
                // 没有旧实例，创建新的 ViewController
                NSLog("[PreviewServer] 🆕 创建新的 ViewController (instanceId=%@)", instanceId)
                let viewController = PreviewRenderViewController(pageName: pageName, pageData: pageData, width: CGFloat(width), height: CGFloat(height))
                
                // ⚠️ 重要：先设置到管理器并配置回调，再加载视图
                // 这样可以确保在 renderViewDidCreated 回调时 callKotlinCallback 已经设置
                self.renderCoreManager?.setViewController(viewController, forInstanceId: instanceId)
                NSLog("[PreviewServer] ✅ 已设置 ViewController 到管理器 (instanceId=%@)", instanceId)
                
                // 应用配置参数
                if let configDict = self.configToDictionary(config) {
                    viewController.applyConfig(configDict)
                }
                
                // 最后加载视图（触发 renderViewDidCreated）
                _ = viewController.view
                NSLog("[PreviewServer] ✅ ViewController 视图已加载 (instanceId=%@, 尺寸: %dx%d)", instanceId, width, height)
            }
        }
    }
    
    /// 处理 callKotlinMethod 请求
    /// 使用实例级别的单线程队列，确保按顺序执行
    private func handleCallKotlinMethod(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let methodId = json["methodId"] as? Int else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid callKotlinMethod request")
            return
        }
        
        let args = json["args"] as? [Any?] ?? []
        let instanceId = json["instanceId"] as? String ?? "default"  // 解析 instanceId 参数，默认使用 "default"
        
//        print("[PreviewServer] 📞 callKotlinMethod: methodId=\(methodId), instanceId=\(instanceId), args.count=\(args.count)")
        
        // 获取或创建该 instanceId 的单线程队列
        let instanceQueue = getOrCreateInstanceQueue(instanceId: instanceId)
        
        // 在实例级别的单线程队列中执行，确保按顺序处理
        instanceQueue.async {
            // 在主线程调用渲染核心的 callKotlinMethod
            DispatchQueue.main.async {
                self.renderCoreManager?.callKotlinMethod(methodId: methodId, args: args, instanceId: instanceId)
            }
        }
        
        sendJsonResponse(connection: connection, json: ["status": "ok"])
    }
    
    /// 获取或创建指定 instanceId 的单线程队列
    private func getOrCreateInstanceQueue(instanceId: String) -> DispatchQueue {
        return instanceQueueLock.sync {
            if let existingQueue = instanceCallKotlinMethodQueues[instanceId] {
                return existingQueue
            }
            
            // 创建新的单线程队列
            let newQueue = DispatchQueue(label: "com.kuikly.preview.callKotlinMethod.\(instanceId)", attributes: [])
            instanceCallKotlinMethodQueues[instanceId] = newQueue
            print("[PreviewServer] 🔧 为 instanceId=\(instanceId) 创建单线程队列")
            return newQueue
        }
    }
    
    /// 处理 callNative 结果
    private func handleCallNativeResult(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let requestId = json["requestId"] as? String else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid callNativeResult request")
            return
        }
        
        let result = json["result"]
        
        print("[PreviewServer] 📨 callNativeResult: requestId=\(requestId), result=\(String(describing: result))")
        
        // 传递结果给渲染核心
        DispatchQueue.main.async {
            self.renderCoreManager?.handleCallNativeResult(requestId: requestId, result: result)
        }
        
        sendJsonResponse(connection: connection, json: ["status": "ok"])
    }
    
    /// 处理 callNative 请求 (SDK -> Mac)
    /// 同步处理请求并直接返回结果
    func handleCallNativeRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let requestId = json["requestId"] as? String,
              let methodId = json["methodId"] as? Int else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid callNative request")
            return
        }
        
        let args = json["args"] as? [Any?] ?? []
        let instanceId = json["instanceId"] as? String ?? "default"
        
        print("[PreviewServer] 📞 callNative: requestId=\(requestId), instanceId=\(instanceId), methodId=\(methodId)")
        
        // 同步处理请求并等待结果
        let semaphore = DispatchSemaphore(value: 0)
        var resultString: String = ""
        
        // 在 Context 线程处理 callNative（必须，否则会触发断言）
        let contextQueue = KuiklyRenderThreadManager.contextQueue()
        let queue = DispatchQueue(label: "context", target: contextQueue)
        
        // 将 [Any?] 转换为 [Any]
        let anyArgs = args.compactMap { $0 }
        
        queue.async { [weak self] in
            guard let self = self else {
                semaphore.signal()
                return
            }
            
            // 调用渲染层处理 callNative（现在在 Context 线程上）
            let callResult = self.renderCoreManager?.handleCallNativeFromJVM(
                instanceId: instanceId,
                methodId: methodId,
                args: anyArgs
            )
            
            // 序列化结果（在主线程执行，避免阻塞 Context 线程）
            DispatchQueue.main.async {
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
            print("[PreviewServer] ⚠️ callNative 处理超时: requestId=\(requestId)")
            sendJsonResponse(connection: connection, json: [
                "status": "error",
                "message": "Timeout",
                "requestId": requestId,
                "result": ""
            ])
        } else {
            // 将结果转换为可序列化的类型
            let serializableResult: Any = convertToSerializable(resultString)
            
            print("[PreviewServer] ✅ callNative 处理完成: requestId=\(requestId), result=\(resultString.isEmpty ? "(空)" : resultString)")
            
            sendJsonResponse(connection: connection, json: [
                "status": "ok",
                "requestId": requestId,
                "result": serializableResult
            ])
        }
    }
    
    /// 处理渲染层轮询 callNative 请求
    /// 返回待处理的 callNative 请求，供渲染层处理
    /// 注意：此端点已废弃，现在使用定时器轮询（pollCallNativeRequests），保留此端点仅用于兼容
    private func handlePollCallNativeFromSdk(queryParams: [String: String], connection: NWConnection) {
        let instanceId = queryParams["instanceId"] ?? ""
        
        var requests: [[String: Any]] = []
        
        // 使用 barrier 确保原子操作，获取并移除该 instanceId 的请求
        // 注意：由于定时器已经在处理，这里返回空数组，避免重复处理
        callNativeQueue.sync(flags: .barrier) {
            print("[PreviewServer] ⚠️ /pollCallNativeFromSdk 端点被调用，但已使用定时器轮询，返回空数组避免重复处理")
            // 不再返回请求，避免与定时器轮询冲突
            // 如果需要使用此端点，应该禁用定时器轮询
        }
        
        sendJsonResponse(connection: connection, json: [
            "status": "ok",
            "requests": requests
        ])
    }
    
    /// 处理 SDK 轮询 callNative 结果
    private func handlePollCallNativeResult(queryParams: [String: String], connection: NWConnection) {
        guard let requestId = queryParams["requestId"] else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Missing requestId")
            return
        }
        
        // 线程安全地获取并移除结果（原子操作，减少锁次数）
        let result = callNativeResultsQueue.sync(flags: .barrier) {
            return callNativeResults.removeValue(forKey: requestId)
        }
        
        // 检查是否有结果
        if let result = result {
            
            // 将结果转换为可序列化的类型（防止 Date 等不可序列化类型）
            let serializableResult: Any = convertToSerializable(result)
            
            print("[PreviewServer] 📤 返回 callNative 结果: requestId=\(requestId), resultType=\(type(of: result)), serializedType=\(type(of: serializableResult))")
            
            sendJsonResponse(connection: connection, json: [
                "status": "ok",
                "requestId": requestId,
                "result": serializableResult
            ])
        } else {
            sendJsonResponse(connection: connection, json: [
                "status": "pending",
                "requestId": requestId
            ])
        }
    }
    
    /// 将任意值转换为可 JSON 序列化的类型
    internal func convertToSerializable(_ value: Any) -> Any {
        // 处理 nil
        if value is NSNull {
            return NSNull()
        }
        
        // 如果是 Date，转换为时间戳
        if let date = value as? Date {
            return date.timeIntervalSince1970
        }
        
        // 如果是字符串，直接返回
        if let string = value as? String {
            return string
        }
        
        // 如果是 NSNumber，需要转换为 Swift 原生类型
        // JSONSerialization 可能无法正确处理某些 Objective-C 类型
        if let number = value as? NSNumber {
            // 使用 objCType 判断类型
            let objCType = String(cString: number.objCType)
            switch objCType {
            case "c", "B": // char, bool
                return number.boolValue
            case "i", "l", "q": // int, long, long long
                return number.int64Value
            case "I", "L", "Q": // unsigned int, unsigned long, unsigned long long
                return number.uint64Value
            case "f", "d": // float, double
                return number.doubleValue
            default:
                // 默认转换为 double
                return number.doubleValue
            }
        }
        
        // 如果是 Swift Bool，直接返回
        if value is Bool {
            return value
        }
        
        // 如果是数组，递归转换每个元素
        if let array = value as? [Any] {
            return array.map { convertToSerializable($0) }
        }
        
        // 如果是字典，递归转换每个值
        if let dict = value as? [String: Any] {
            return dict.mapValues { convertToSerializable($0) }
        }
        
        // 其他类型转换为字符串
        print("[PreviewServer] ⚠️ 无法序列化类型: \(type(of: value))，转换为字符串")
        return String(describing: value)
    }
    
    /// 处理 SDK 轮询 callKotlinMethod 请求（支持长轮询）
    /// 按序号排序返回请求，确保调用顺序
    /// 优化：使用长轮询减少空轮询，降低 CPU 和网络开销
    private func handlePollCallKotlinMethod(queryParams: [String: String], connection: NWConnection) {
        let instanceId = queryParams["instanceId"] ?? ""
        let timeout: TimeInterval = 0.5 // 长轮询超时时间：500ms
        
        // 长轮询：等待一段时间，如果有数据立即返回，无数据则等待超时
        let startTime = Date()
        var instanceRequests: [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)] = []
        
        // 使用信号量等待新请求到达或超时
        let semaphore = DispatchSemaphore(value: 0)
        var hasNewRequest = false
        
        // 检查是否有待处理的请求
        instanceRequests = callKotlinMethodQueue.sync(flags: .barrier) {
            guard let rawValue = pendingCallKotlinMethodRequests[instanceId] else {
                pendingCallKotlinMethodRequests[instanceId] = []
                return []
            }
            
            guard let requests = rawValue as? [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)] else {
                pendingCallKotlinMethodRequests[instanceId] = []
                return []
            }
            
            if !requests.isEmpty {
                // 有数据，立即返回
                pendingCallKotlinMethodRequests[instanceId] = []
                return requests
            }
            
            return []
        }
        
        // 如果有数据，立即返回
        if !instanceRequests.isEmpty {
            return sendCallKotlinMethodResponse(connection: connection, instanceId: instanceId, requests: instanceRequests)
        }
        
        // 无数据，使用长轮询等待新请求
        // 创建一个观察者，当有新请求时通知
        var observer: NSObjectProtocol?
        observer = NotificationCenter.default.addObserver(
            forName: NSNotification.Name("CallKotlinMethodRequestAdded"),
            object: nil,
            queue: nil
        ) { [weak self] notification in
            guard let self = self,
                  let notifiedInstanceId = notification.userInfo?["instanceId"] as? String,
                  notifiedInstanceId == instanceId else {
                return
            }
            
            // 检查是否有新请求
            let requests: [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)] = self.callKotlinMethodQueue.sync(flags: .barrier) {
                guard let rawValue = self.pendingCallKotlinMethodRequests[instanceId] else {
                    return []
                }
                
                guard let reqs = rawValue as? [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)] else {
                    return []
                }
                
                if !reqs.isEmpty {
                    self.pendingCallKotlinMethodRequests[instanceId] = []
                    return reqs
                }
                
                return []
            }
            
            if !requests.isEmpty {
                hasNewRequest = true
                instanceRequests = requests
                semaphore.signal()
            }
        }
        
        // 等待新请求或超时
        let waitResult = semaphore.wait(timeout: .now() + timeout)
        
        // 移除观察者
        if let observer = observer {
            NotificationCenter.default.removeObserver(observer)
        }
        
        // 如果超时，再次检查是否有请求（可能在等待期间到达）
        if waitResult == .timedOut && !hasNewRequest {
            instanceRequests = callKotlinMethodQueue.sync(flags: .barrier) {
                guard let rawValue = pendingCallKotlinMethodRequests[instanceId] else {
                    return []
                }
                
                guard let requests = rawValue as? [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)] else {
                    return []
                }
                
                if !requests.isEmpty {
                    pendingCallKotlinMethodRequests[instanceId] = []
                    return requests
                }
                
                return []
            }
        }
        
        // 发送响应
        sendCallKotlinMethodResponse(connection: connection, instanceId: instanceId, requests: instanceRequests)
    }
    
    /// 发送 callKotlinMethod 响应（提取公共逻辑）
    private func sendCallKotlinMethodResponse(connection: NWConnection, instanceId: String, requests: [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)]) {
        guard !requests.isEmpty else {
            sendJsonResponse(connection: connection, json: [
                "status": "ok",
                "requests": []
            ])
            return
        }
        
        // 按序号排序，确保顺序执行
        let sortedRequests = requests.sorted { $0.sequence < $1.sequence }
        
        // 转换为返回格式
        var responseRequests: [[String: Any]] = []
        for (requestId, sequence, request) in sortedRequests {
            // 处理 args，确保所有元素都是可序列化的类型
            let serializableArgs = request.args.map { arg -> Any? in
                guard let arg = arg else { return NSNull() }
                return self.convertToSerializable(arg)
            }
            
            responseRequests.append([
                "requestId": requestId,
                "sequence": sequence,
                "methodId": request.methodId,
                "args": serializableArgs
            ])
        }
        
        print("[PreviewServer] 📥 JVM 端轮询 callKotlinMethod: instanceId=\(instanceId), 返回 \(responseRequests.count) 个请求 (序号范围: \(sortedRequests.first?.sequence ?? -1) - \(sortedRequests.last?.sequence ?? -1))")
        
        sendJsonResponse(connection: connection, json: [
            "status": "ok",
            "requests": responseRequests
        ])
    }
    
    /// 处理销毁请求
    private func handleDestroyRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let instanceId = json["instanceId"] as? String else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid destroy request")
            return
        }
        
        print("[PreviewServer] 🧹 收到销毁请求: instanceId=\(instanceId)")
        
        DispatchQueue.main.async {
            // 移除该实例的渲染请求
            self.renderRequests.removeValue(forKey: instanceId)
            print("[PreviewServer] 🧹 已移除渲染请求: instanceId=\(instanceId)")
            
            // 销毁渲染实例（这会调用 cleanup 清理所有资源）
            self.renderCoreManager?.destroyInstance(instanceId: instanceId)
            print("[PreviewServer] 🧹 已销毁渲染实例: instanceId=\(instanceId)")
        }
        // 清空该 instanceId 相关的所有数据
        // 使用队列确保线程安全地清空该 instanceId 的请求和序号
        callKotlinMethodQueue.async(flags: .barrier) {
            self.pendingCallKotlinMethodRequests.removeValue(forKey: instanceId)
            self.sequenceCounters.removeValue(forKey: instanceId)
            print("[PreviewServer] 🧹 已清空 instanceId=\(instanceId) 的请求和序号")
        }
        
        // 清理该 instanceId 的单线程队列
        instanceQueueLock.async {
            self.instanceCallKotlinMethodQueues.removeValue(forKey: instanceId)
            print("[PreviewServer] 🧹 已清理 instanceId=\(instanceId) 的单线程队列")
        }
        // 清空该 instanceId 的 callNative 请求
        callNativeQueue.async(flags: .barrier) {
            // 移除该 instanceId 的所有 callNative 请求
            self.pendingCallNativeFromSdk = self.pendingCallNativeFromSdk.filter { $0.value.instanceId != instanceId }
            print("[PreviewServer] 🧹 已清空 instanceId=\(instanceId) 的 callNative 请求")
        }
        // 清空该 instanceId 的 callNative 结果（如果有）
        // 注意：callNativeResults 是按 requestId 存储的，不是按 instanceId，所以这里清空所有
        callNativeResultsQueue.async(flags: .barrier) {
            self.callNativeResults.removeAll()
        }
        
        sendJsonResponse(connection: connection, json: ["status": "ok", "message": "Destroyed", "instanceId": instanceId])
    }
    
    /// 处理触摸事件请求
    private func handleTouchRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let instanceId = json["instanceId"] as? String,
              let type = json["type"] as? String,
              let x = json["x"] as? Double,
              let y = json["y"] as? Double else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid touch request")
            return
        }
        
        print("[PreviewHttpServer] 👆 收到触摸事件: instanceId=\(instanceId), type=\(type), x=\(x), y=\(y)")
        
        // 在主线程处理触摸事件
        DispatchQueue.main.async {
            let hasManager = self.renderCoreManager != nil
            print("[PreviewHttpServer] 👆 主线程处理触摸, hasManager=\(hasManager)")
            self.renderCoreManager?.handleTouchEvent(
                instanceId: instanceId,
                type: type,
                x: CGFloat(x),
                y: CGFloat(y)
            )
        }
        
        // 响应
        sendJsonResponse(connection: connection, json: ["status": "ok", "received": true])
    }
    
    /// 处理发送页面事件请求
    private func handleSendEventRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let instanceId = json["instanceId"] as? String,
              let event = json["event"] as? String else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid sendEvent request")
            return
        }
        
        let data = json["data"] as? [String: Any] ?? [:]
        
        print("[PreviewHttpServer] 📨 收到 sendEvent 请求: instanceId=\(instanceId), event=\(event), data=\(data)")
        
        // 在主线程处理事件发送
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            let success = self.renderCoreManager?.sendEvent(
                instanceId: instanceId,
                event: event,
                data: data
            ) ?? false
            
            if success {
                print("[PreviewHttpServer] ✅ sendEvent 成功: instanceId=\(instanceId), event=\(event)")
                self.sendJsonResponse(connection: connection, json: ["status": "ok", "message": "Event sent"])
            } else {
                print("[PreviewHttpServer] ⚠️ sendEvent 失败: instanceId=\(instanceId), event=\(event)")
                self.sendErrorResponse(connection: connection, statusCode: 404, message: "No render view available for instanceId: \(instanceId)")
            }
        }
    }
    
    /// 处理更新预览大小请求
    private func handleUpdateSizeRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let instanceId = json["instanceId"] as? String,
              let width = json["width"] as? Int,
              let height = json["height"] as? Int else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid updateSize request")
            return
        }
        
        print("[PreviewHttpServer] 📐 收到更新大小请求: instanceId=\(instanceId), size=\(width)x\(height)")
        
        // 在主线程处理大小更新
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            let success = self.renderCoreManager?.updateSize(
                instanceId: instanceId,
                width: CGFloat(width),
                height: CGFloat(height)
            ) ?? false
            
            if success {
                print("[PreviewHttpServer] ✅ 预览大小更新成功: instanceId=\(instanceId), size=\(width)x\(height)")
                self.sendJsonResponse(connection: connection, json: ["status": "ok", "message": "Size updated", "width": width, "height": height])
            } else {
                print("[PreviewHttpServer] ⚠️ 预览大小更新失败: instanceId=\(instanceId), size=\(width)x\(height)")
                self.sendErrorResponse(connection: connection, statusCode: 404, message: "No render view available for instanceId: \(instanceId)")
            }
        }
    }
    
    /// 处理更新预览配置请求
    private func handleUpdatePreviewConfigRequest(body: String, connection: NWConnection) {
        guard let bodyData = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: bodyData) as? [String: Any],
              let instanceId = json["instanceId"] as? String else {
            sendErrorResponse(connection: connection, statusCode: 400, message: "Invalid updatePreviewConfig request")
            return
        }
        
        print("[PreviewHttpServer] 📋 收到更新预览配置请求: instanceId=\(instanceId)")
        print("[PreviewHttpServer] 📋 请求 JSON: \(json)")
        
        // 解析配置参数
        let config = PreviewConfigModel.fromDictionary(json)
        print("[PreviewHttpServer] 📋 解析后的配置: width=\(String(describing: config.width)), height=\(String(describing: config.height))")
        
        // 在主线程处理配置更新
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            let success = self.renderCoreManager?.updatePreviewConfig(
                instanceId: instanceId,
                config: config
            ) ?? false
            
            if success {
                print("[PreviewHttpServer] ✅ 预览配置更新成功: instanceId=\(instanceId)")
                self.sendJsonResponse(connection: connection, json: ["status": "ok", "message": "Preview config updated"])
            } else {
                print("[PreviewHttpServer] ⚠️ 预览配置更新失败: instanceId=\(instanceId)")
                self.sendErrorResponse(connection: connection, statusCode: 404, message: "No render view available for instanceId: \(instanceId)")
            }
        }
    }
    
    /// 处理截图请求
    private func handleScreenshotRequest(queryParams: [String: String], connection: NWConnection) {
        let instanceId = queryParams["instanceId"]
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            print("[PreviewServer] 📸 处理截图请求, instanceId=\(instanceId ?? "default"), renderCoreManager=\(String(describing: self.renderCoreManager))")
            
            // 获取渲染视图的截图
            if let imageData = self.renderCoreManager?.captureScreenshot(instanceId: instanceId) {
                print("[PreviewServer] 📸 截图成功: \(imageData.count) 字节 (instanceId=\(instanceId ?? "default"))")
                // 发送图片数据
                self.sendImageResponse(connection: connection, imageData: imageData)
            } else {
                print("[PreviewServer] ⚠️ 截图失败: renderCoreManager 或视图为空 (instanceId=\(instanceId ?? "default"))")
                self.sendErrorResponse(connection: connection, statusCode: 404, message: "No render view available")
            }
        }
    }
    
    /// 处理列出所有实例的请求
    private func handleListInstancesRequest(connection: NWConnection) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            var instances: [[String: Any]] = []
            
            // 遍历所有渲染请求，构建实例列表
            for (instanceId, request) in self.renderRequests {
                instances.append([
                    "instanceId": instanceId,
                    "pageName": request.pageName,
                    "width": Int(request.width),
                    "height": Int(request.height),
                    "timestamp": request.timestamp.timeIntervalSince1970
                ])
            }
            
            print("[PreviewServer] 📋 列出所有实例: \(instances.count) 个")
            
            self.sendJsonResponse(connection: connection, json: [
                "status": "ok",
                "instances": instances,
                "count": instances.count
            ])
        }
    }
    
    /// 发送图片响应
    private func sendImageResponse(connection: NWConnection, imageData: Data) {
        let response = """
        HTTP/1.1 200 OK\r
        Content-Type: image/png\r
        Content-Length: \(imageData.count)\r
        Access-Control-Allow-Origin: *\r
        Connection: close\r
        \r\n
        """
        
        var responseData = response.data(using: .utf8) ?? Data()
        responseData.append(imageData)
        
        connection.send(content: responseData, completion: .contentProcessed { _ in
            connection.cancel()
        })
    }
    
    // MARK: - 存储来自 SDK 的 callNative 请求
    // 使用队列存储 callNative 请求，支持高并发
    private var pendingCallNativeFromSdk: [String: CallNativeFromSdkRequest] = [:]
    private let callNativeQueue = DispatchQueue(label: "com.kuikly.preview.callNative", attributes: .concurrent)
    
    // 存储 callNative 结果 (供 SDK 轮询获取)
    // 注意：只存储可序列化的类型（String、Number、Bool、Array、Dictionary）
    private var callNativeResults: [String: Any] = [:]
    private let callNativeResultsQueue = DispatchQueue(label: "com.kuikly.preview.callNativeResults", attributes: .concurrent)
    
    // 存储待发送给 SDK 的 callKotlinMethod 请求（按 instanceId 分组，使用序号排序）
    private var pendingCallKotlinMethodRequests: [String: [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)]] = [:]
    // 为每个 instanceId 维护独立的序号计数器
    private var sequenceCounters: [String: Int64] = [:]
    private let callKotlinMethodQueue = DispatchQueue(label: "com.kuikly.preview.callKotlinMethod", attributes: .concurrent)
    
    /// 添加 callKotlinMethod 请求 (渲染层 -> SDK)
    /// 为每个 instanceId 分配递增序号，确保按顺序执行
    /// 如果使用 TCP 长连接，直接通过 TCP 发送 NOTIFICATION 消息
    func addCallKotlinMethodRequest(instanceId: String, methodId: Int, args: [Any?]) {
        let requestId = UUID().uuidString
        let request = CallKotlinMethodRequest(
            methodId: methodId,
            args: args
        )
        
        // 使用串行队列确保线程安全，按顺序添加并分配序号
        callKotlinMethodQueue.async(flags: .barrier) {
            // 为当前 instanceId 分配递增序号
            let currentSequence = (self.sequenceCounters[instanceId] ?? -1) + 1
            self.sequenceCounters[instanceId] = currentSequence
            
            print("[PreviewServer] 📤 添加 callKotlinMethod 请求: instanceId=\(instanceId), requestId=\(requestId), sequence=\(currentSequence), methodId=\(methodId), args.count=\(args.count)")
            
            // 尝试通过 TCP 长连接发送（如果存在）
            // 使用 DispatchQueue.main.sync 确保在主线程访问 PreviewTcpServer.shared
            let tcpSent = DispatchQueue.main.sync {
                return PreviewTcpServer.shared.sendCallKotlinMethodNotification(
                    instanceId: instanceId,
                    requestId: requestId,
                    sequence: currentSequence,
                    methodId: methodId,
                    args: args
                )
            }
            
            if tcpSent {
                print("[PreviewServer] ✅ 已通过 TCP 长连接发送 callKotlinMethod: instanceId=\(instanceId)")
                // TCP 发送成功，不需要存储到队列
                return
            }
            
            // TCP 发送失败，回退到队列存储（用于 HTTP 轮询）
            // 初始化该 instanceId 的请求数组（如果不存在）
            if self.pendingCallKotlinMethodRequests[instanceId] == nil {
                self.pendingCallKotlinMethodRequests[instanceId] = []
            }
            
            // 添加请求，包含序号
            self.pendingCallKotlinMethodRequests[instanceId]?.append((
                requestId: requestId,
                sequence: currentSequence,
                request: request
            ))
            
            print("[PreviewServer] 📤 当前待处理请求数: \(self.pendingCallKotlinMethodRequests[instanceId]?.count ?? 0)")
            
            // 通知长轮询等待的请求
            NotificationCenter.default.post(
                name: NSNotification.Name("CallKotlinMethodRequestAdded"),
                object: nil,
                userInfo: ["instanceId": instanceId]
            )
        }
    }
    
    /// 清理指定 instanceId 的 callKotlinMethod 请求
    func clearCallKotlinMethodRequests(instanceId: String) {
        callKotlinMethodQueue.async(flags: .barrier) {
            self.pendingCallKotlinMethodRequests.removeValue(forKey: instanceId)
            self.sequenceCounters.removeValue(forKey: instanceId)
            print("[PreviewServer] 🧹 已清理 instanceId=\(instanceId) 的 callKotlinMethod 请求")
        }
    }
    
    /// 获取 callKotlinMethod 请求（用于 HTTP 轮询，TCP 长连接不需要）
    internal func getCallKotlinMethodRequests(instanceId: String) -> [[String: Any]] {
        return callKotlinMethodQueue.sync(flags: .barrier) {
            guard let rawValue = pendingCallKotlinMethodRequests[instanceId] else {
                return []
            }
            
            guard let requests = rawValue as? [(requestId: String, sequence: Int64, request: CallKotlinMethodRequest)] else {
                return []
            }
            
            guard !requests.isEmpty else {
                return []
            }
            
            // 立即清空，减少锁持有时间
            pendingCallKotlinMethodRequests[instanceId] = []
            
            // 按序号排序
            let sortedRequests = requests.sorted { $0.sequence < $1.sequence }
            
            // 转换为返回格式
            return sortedRequests.map { (requestId, sequence, request) in
                let serializableArgs = request.args.map { arg -> Any? in
                    guard let arg = arg else { return NSNull() }
                    return self.convertToSerializable(arg)
                }
                
                return [
                    "requestId": requestId,
                    "sequence": sequence,
                    "methodId": request.methodId,
                    "args": serializableArgs
                ]
            }
        }
    }
    
    /// 设置 callNative 结果
    /// 注意：result 应该是可序列化的类型（String、Number、Bool 等），避免存储 Date 等不可序列化类型
    func setCallNativeResult(requestId: String, result: Any?) {
        // 确保存储的值是可序列化的，并记录类型以便调试
        let finalResult: Any
        if let result = result {
            // 如果是 Date，转换为时间戳字符串
            if let date = result as? Date {
                print("[PreviewServer] ⚠️ setCallNativeResult 收到 Date 对象，转换为时间戳: requestId=\(requestId)")
                finalResult = String(date.timeIntervalSince1970)
            } else {
                // 检查是否包含 Date 对象（在字典或数组中）
                finalResult = convertToSerializable(result)
                if result is Date || (result is [Any] && (result as? [Any])?.contains(where: { $0 is Date }) == true) {
                    print("[PreviewServer] ⚠️ setCallNativeResult 检测到 Date 对象，已转换: requestId=\(requestId), originalType=\(type(of: result))")
                }
            }
        } else {
            finalResult = ""
        }
        
        // 线程安全地存储结果
        callNativeResultsQueue.async(flags: .barrier) {
            self.callNativeResults[requestId] = finalResult
            print("[PreviewServer] 💾 存储 callNative 结果: requestId=\(requestId), type=\(type(of: finalResult))")
        }
    }
    
    /// 获取待处理的 callNative 请求（线程安全）
    func getPendingCallNativeFromSdk() -> [String: CallNativeFromSdkRequest] {
        // 优化：添加 barrier 确保读取一致性（虽然单线程客户端影响不大，但为了正确性）
        return callNativeQueue.sync(flags: .barrier) {
            return pendingCallNativeFromSdk
        }
    }
    
    /// 获取并移除待处理的 callNative 请求（原子操作，避免重复处理）
    func getAndRemovePendingCallNativeFromSdk() -> [String: CallNativeFromSdkRequest] {
        return callNativeQueue.sync(flags: .barrier) {
            let requests = pendingCallNativeFromSdk
            pendingCallNativeFromSdk.removeAll()
            return requests
        }
    }
    
    /// 移除已处理的 callNative 请求（线程安全）
    func removePendingCallNativeFromSdk(requestId: String) {
        callNativeQueue.async(flags: .barrier) {
            self.pendingCallNativeFromSdk.removeValue(forKey: requestId)
        }
    }
    
    /// 发送 JSON 响应
    private func sendJsonResponse(connection: NWConnection, json: [String: Any], statusCode: Int = 200) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: json),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            sendErrorResponse(connection: connection, statusCode: 500, message: "Failed to serialize response")
            return
        }
        
        let response = """
        HTTP/1.1 \(statusCode) OK\r
        Content-Type: application/json\r
        Content-Length: \(jsonData.count)\r
        Access-Control-Allow-Origin: *\r
        Connection: close\r
        \r
        \(jsonString)
        """
        
        connection.send(content: response.data(using: .utf8), completion: .contentProcessed { _ in
            connection.cancel()
        })
    }
    
    /// 发送错误响应
    private func sendErrorResponse(connection: NWConnection, statusCode: Int, message: String) {
        let json: [String: Any] = ["status": "error", "message": message]
        sendJsonResponse(connection: connection, json: json, statusCode: statusCode)
    }
    
    /// 发送 callNative 请求到 SDK (用于渲染层调用逻辑层)
    func sendCallNative(methodId: Int, args: [Any?], requestId: String, completion: @escaping (Any?) -> Void) {
        // 这里需要通过某种方式通知 SDK，SDK 需要轮询或者我们使用长连接
        // 暂时先存储回调，等待 SDK 来获取
        pendingCallNativeRequests[requestId] = CallNativeRequest(
            methodId: methodId,
            args: args,
            completion: completion
        )
        
        print("[PreviewServer] 📤 发送 callNative: requestId=\(requestId), methodId=\(methodId)")
    }
    
    // 存储等待的 callNative 请求
    private var pendingCallNativeRequests: [String: CallNativeRequest] = [:]
    
    /// 获取待处理的 callNative 请求
    func getPendingCallNativeRequests() -> [String: [String: Any]] {
        var result: [String: [String: Any]] = [:]
        for (requestId, request) in pendingCallNativeRequests {
            result[requestId] = [
                "methodId": request.methodId,
                "args": request.args
            ]
        }
        return result
    }
    
    /// 完成 callNative 请求
    func completeCallNative(requestId: String, result: Any?) {
        if let request = pendingCallNativeRequests.removeValue(forKey: requestId) {
            request.completion(result)
        }
    }
    
    /// 合并配置
    func mergeConfig(_ base: PreviewConfigModel?, with update: PreviewConfigModel) -> PreviewConfigModel {
        guard let base = base else { return update }

        var mergedDict: [String: Any] = [:]

        // 使用 update 的值，如果为 nil 则使用 base 的值
        mergedDict["name"] = update.name ?? base.name
        mergedDict["group"] = update.group ?? base.group
        mergedDict["device"] = update.device ?? base.device
        mergedDict["width"] = update.width ?? base.width
        mergedDict["height"] = update.height ?? base.height
        mergedDict["density"] = update.density ?? base.density
        mergedDict["orientation"] = update.orientation ?? base.orientation
        mergedDict["isRound"] = update.isRound ?? base.isRound
        mergedDict["chinSize"] = update.chinSize ?? base.chinSize
        mergedDict["cutout"] = update.cutout ?? base.cutout
        mergedDict["navigation"] = update.navigation ?? base.navigation
        mergedDict["apiLevel"] = update.apiLevel ?? base.apiLevel
        mergedDict["locale"] = update.locale ?? base.locale
        mergedDict["fontScale"] = update.fontScale ?? base.fontScale
        mergedDict["showSystemUi"] = update.showSystemUi ?? base.showSystemUi
        mergedDict["showBackground"] = update.showBackground ?? base.showBackground
        // 只有当 showBackground 为 true 时才保留 backgroundColor
        let showBackground = update.showBackground ?? base.showBackground ?? false
        if showBackground {
            mergedDict["backgroundColor"] = update.backgroundColor ?? base.backgroundColor
        } else {
            mergedDict["backgroundColor"] = nil
        }
        mergedDict["uiMode"] = update.uiMode ?? base.uiMode
        mergedDict["wallpaper"] = update.wallpaper ?? base.wallpaper

        return PreviewConfigModel(from: mergedDict)
    }
    
    /// 将配置模型转换为字典
    func configToDictionary(_ config: PreviewConfigModel) -> [String: Any]? {
        var dict: [String: Any] = [:]
        var hasConfig = false
        
        if let name = config.name {
            dict["name"] = name
            hasConfig = true
        }
        if let group = config.group {
            dict["group"] = group
            hasConfig = true
        }
        if let device = config.device {
            dict["device"] = device
            hasConfig = true
        }
        if let density = config.density {
            dict["density"] = density
            hasConfig = true
        }
        if let orientation = config.orientation {
            dict["orientation"] = orientation
            hasConfig = true
        }
        if let isRound = config.isRound {
            dict["isRound"] = isRound
            hasConfig = true
        }
        if let chinSize = config.chinSize {
            dict["chinSize"] = chinSize
            hasConfig = true
        }
        if let cutout = config.cutout {
            dict["cutout"] = cutout
            hasConfig = true
        }
        if let navigation = config.navigation {
            dict["navigation"] = navigation
            hasConfig = true
        }
        if let apiLevel = config.apiLevel {
            dict["apiLevel"] = apiLevel
            hasConfig = true
        }
        if let locale = config.locale {
            dict["locale"] = locale
            hasConfig = true
        }
        if let fontScale = config.fontScale {
            dict["fontScale"] = fontScale
            hasConfig = true
        }
        if let showSystemUi = config.showSystemUi {
            dict["showSystemUi"] = showSystemUi
            hasConfig = true
        }
        if let showBackground = config.showBackground {
            dict["showBackground"] = showBackground
            hasConfig = true
        }
        if let backgroundColor = config.backgroundColor {
            dict["backgroundColor"] = backgroundColor
            hasConfig = true
        }
        if let uiMode = config.uiMode {
            dict["uiMode"] = uiMode
            hasConfig = true
        }
        if let wallpaper = config.wallpaper {
            dict["wallpaper"] = wallpaper
            hasConfig = true
        }
        
        return hasConfig ? dict : nil
    }
}

/// CallNative 请求模型 (渲染层 -> SDK)
struct CallNativeRequest {
    let methodId: Int
    let args: [Any?]
    let completion: (Any?) -> Void
}

/// 来自 SDK 的 CallNative 请求模型 (SDK -> 渲染层)
struct CallNativeFromSdkRequest {
    let requestId: String
    let methodId: Int
    let args: [Any?]
    let instanceId: String
}

/// CallKotlinMethod 请求模型 (渲染层 -> SDK)
struct CallKotlinMethodRequest {
    let methodId: Int
    let args: [Any?]
}

