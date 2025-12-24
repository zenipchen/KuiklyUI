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
import AppKit

/// 预览渲染核心管理器
/// 负责管理 Kuikly 渲染核心，处理来自 SDK 的渲染指令
/// 支持多实例渲染
class PreviewRenderCoreManager: NSObject {
    
    /// 渲染视图控制器字典 (instanceId -> ViewController)
    private var viewControllers: [String: PreviewRenderViewController] = [:]
    
    /// 当前活跃的 instanceId (用于兼容单实例场景)
    private var currentInstanceId: String?
    
    /// 请求 ID 生成器
    private var requestIdCounter: Int = 0
    
    /// 等待 callNative 结果的回调
    private var pendingCallNativeCallbacks: [String: (Any?) -> Void] = [:]
    
    /// 轮询 callNative 请求的定时器
    private var callNativePollTimer: Timer?
    
    override init() {
        super.init()
        print("[RenderCoreManager] ✅ 初始化完成 (多实例模式)")
        startCallNativePolling()
    }
    
    /// 启动 callNative 轮询
    private func startCallNativePolling() {
        // 停止旧的定时器
        callNativePollTimer?.invalidate()
        
        // 创建新的定时器，每 10ms 轮询一次（与 callKotlinMethod 轮询频率一致）
        callNativePollTimer = Timer.scheduledTimer(withTimeInterval: 0.01, repeats: true) { [weak self] _ in
            self?.pollCallNativeRequests()
        }
        
        // 将定时器添加到主运行循环
        if let timer = callNativePollTimer {
            RunLoop.main.add(timer, forMode: .common)
        }
        
        print("[RenderCoreManager] ✅ callNative 轮询已启动")
    }
    
    /// 轮询并处理 callNative 请求
    private func pollCallNativeRequests() {
        // 获取所有待处理的 callNative 请求（原子操作，避免重复处理）
        let pendingRequests = PreviewHttpServer.shared.getAndRemovePendingCallNativeFromSdk()
        
        guard !pendingRequests.isEmpty else {
            return
        }
        
        // 处理每个请求
        for (requestId, request) in pendingRequests {
            let instanceId = request.instanceId
            let methodId = request.methodId
            let args = request.args
            
            print("[RenderCoreManager] 📥 处理 callNative 请求: requestId=\(requestId), instanceId=\(instanceId), methodId=\(methodId)")
            
            // 在 Context 线程处理 callNative（必须，否则会触发断言）
            // 注意：使用 Context Queue 确保在正确的线程上执行
            let contextQueue = KuiklyRenderThreadManager.contextQueue()
            
            // 将 [Any?] 转换为 [Any]
            let anyArgs = args.compactMap { $0 }
            
            // 在 Context 线程上执行 callNative
            let queue = DispatchQueue(label: "context", target: contextQueue)
            queue.async { [weak self] in
                guard let self = self else { return }
                
                // 调用渲染层处理 callNative（现在在 Context 线程上）
                let result = self.handleCallNativeFromJVM(
                    instanceId: instanceId,
                    methodId: methodId,
                    args: anyArgs
                )
                
                // 序列化结果（在主线程执行，避免阻塞 Context 线程）
                DispatchQueue.main.async {
                    let resultString: String
                    if let result = result {
                        if let string = result as? String {
                            resultString = string
                        } else if JSONSerialization.isValidJSONObject([result]),
                                  let jsonData = try? JSONSerialization.data(withJSONObject: [result]),
                                  let jsonString = String(data: jsonData, encoding: .utf8) {
                            resultString = String(jsonString.dropFirst().dropLast())
                        } else {
                            resultString = String(describing: result)
                        }
                    } else {
                        resultString = ""
                    }
                    
                    // 设置结果，供 SDK 轮询获取
                    PreviewHttpServer.shared.setCallNativeResult(requestId: requestId, result: resultString)
                    
                    print("[RenderCoreManager] ✅ callNative 处理完成: requestId=\(requestId), result=\(resultString.isEmpty ? "(空)" : resultString)")
                }
            }
        }
    }
    
    /// 初始化渲染（仅发送通知，不销毁实例）
    /// 注意：销毁旧实例应该在创建新 ViewController 之前由调用方处理
    func initRender(pageName: String, pageData: [String: Any], instanceId: String? = nil) {
        let instId = instanceId ?? "default"
        print("[RenderCoreManager] 📱 初始化渲染: pageName=\(pageName), instanceId=\(instId), pageData=\(pageData)")
        
        // 通知视图层创建新的渲染视图
        NotificationCenter.default.post(
            name: .previewRenderInit,
            object: nil,
            userInfo: ["pageName": pageName, "pageData": pageData, "instanceId": instId]
        )
    }
    
    /// 设置当前视图控制器 (兼容单实例模式)
    func setCurrentViewController(_ viewController: PreviewRenderViewController?) {
        setViewController(viewController, forInstanceId: currentInstanceId ?? "default")
    }
    
    /// 设置指定实例的视图控制器
    func setViewController(_ viewController: PreviewRenderViewController?, forInstanceId instanceId: String) {
        if let vc = viewController {
            // 设置实例 ID
            vc.setInstanceId(instanceId)
            
            // 配置 callKotlin 回调，将调用发送到 HTTP 服务器
            vc.setCallKotlinCallback { [weak self] method, args in
                self?.handleCallKotlinFromRenderer(instanceId: instanceId, method: method, args: args)
            }
            
            viewControllers[instanceId] = vc
            currentInstanceId = instanceId
            print("[RenderCoreManager] ✅ 设置 ViewController: instanceId=\(instanceId) (已配置跨进程通信)")
        } else {
            viewControllers.removeValue(forKey: instanceId)
            print("[RenderCoreManager] 🧹 移除 ViewController: instanceId=\(instanceId)")
        }
    }
    
    /// 处理来自渲染层的 callKotlin 调用（需要发送到 JVM 端）
    private func handleCallKotlinFromRenderer(instanceId: String, method: KuiklyRenderContextMethod, args: [Any]) {
        print("[RenderCoreManager] 📤 渲染层 callKotlin: instanceId=\(instanceId), method=\(method.rawValue), args.count=\(args.count)")
        
        // 将 [Any] 转换为 [Any?]（因为 addCallKotlinMethodRequest 需要 [Any?]）
        let optionalArgs: [Any?] = args.map { $0 }
        
        // 通过 HTTP 服务器发送到 JVM 端，传入 instanceId 以确保序号正确
        DispatchQueue.main.async {
            PreviewHttpServer.shared.addCallKotlinMethodRequest(
                instanceId: instanceId,
                methodId: Int(method.rawValue),
                args: optionalArgs
            )
            print("[RenderCoreManager] ✅ 已添加 callKotlinMethod 请求到队列，等待 JVM 端轮询 (instanceId=\(instanceId))")
        }
    }
    
    /// 处理来自 JVM 端的 callNative 调用（需要转发给渲染层）
    func handleCallNativeFromJVM(instanceId: String, methodId: Int, args: [Any]) -> Any? {
        print("[RenderCoreManager] 📥 JVM 端 callNative: instanceId=\(instanceId), methodId=\(methodId)")
        
        guard let viewController = viewControllers[instanceId] ?? viewControllers.values.first else {
            print("[RenderCoreManager] ⚠️ 无法处理 callNative：没有可用的渲染视图控制器 (instanceId=\(instanceId))")
            return nil
        }
        
        // 调用 ViewController 的 handleCallNativeWithMethodId 方法
        return viewController.handleCallNative(withMethodId: methodId, args: args)
    }
    
    /// 获取指定实例的视图控制器
    func getViewController(forInstanceId instanceId: String) -> PreviewRenderViewController? {
        return viewControllers[instanceId]
    }
    
    /// 获取当前视图控制器 (兼容单实例模式)
    func getCurrentViewController() -> PreviewRenderViewController? {
        if let instId = currentInstanceId {
            return viewControllers[instId]
        }
        return viewControllers.values.first
    }
    
    /// 处理来自 SDK 的 callKotlinMethod
    func callKotlinMethod(methodId: Int, args: [Any?], instanceId: String? = nil) {
        let instId = instanceId ?? currentInstanceId ?? "default"
        print("[RenderCoreManager] 📞 callKotlinMethod: methodId=\(methodId), instanceId=\(instId)")
        
        // 将调用转发给对应实例的渲染视图控制器
        viewControllers[instId]?.handleCallKotlinMethod(methodId: methodId, args: args)
    }
    
    /// 处理来自 SDK 的 callNative 结果
    func handleCallNativeResult(requestId: String, result: Any?) {
        print("[RenderCoreManager] 📨 handleCallNativeResult: requestId=\(requestId)")
        
        if let callback = pendingCallNativeCallbacks.removeValue(forKey: requestId) {
            callback(result)
        }
    }
    
    /// 调用 Native 方法 (渲染层 -> 逻辑层)
    func callNative(methodId: Int, args: [Any?], completion: @escaping (Any?) -> Void) {
        requestIdCounter += 1
        let requestId = "req_\(requestIdCounter)"
        
        pendingCallNativeCallbacks[requestId] = completion
        
        // 发送到 HTTP 服务，让 SDK 获取
        DispatchQueue.main.async {
            PreviewHttpServer.shared.sendCallNative(
                methodId: methodId,
                args: args,
                requestId: requestId,
                completion: completion
            )
        }
    }
    
    /// 销毁指定实例的渲染
    func destroyInstance(instanceId: String) {
        print("[RenderCoreManager] 🧹 销毁渲染实例: \(instanceId)")
        
        if let vc = viewControllers[instanceId] {
            vc.cleanup()
            viewControllers.removeValue(forKey: instanceId)
        }
        
        if currentInstanceId == instanceId {
            currentInstanceId = viewControllers.keys.first
        }
        
        NotificationCenter.default.post(name: .previewRenderDestroy, object: nil, userInfo: ["instanceId": instanceId])
    }
    
    /// 销毁所有渲染实例
    func destroy() {
        print("[RenderCoreManager] 🧹 销毁所有渲染实例")
        
        // 停止轮询
        callNativePollTimer?.invalidate()
        callNativePollTimer = nil
        
        for (_, vc) in viewControllers {
            vc.cleanup()
        }
        viewControllers.removeAll()
        currentInstanceId = nil
        pendingCallNativeCallbacks.removeAll()
        
        NotificationCenter.default.post(name: .previewRenderDestroy, object: nil)
    }
    
    /// 处理触摸事件
    func handleTouchEvent(instanceId: String, type: String, x: CGFloat, y: CGFloat) {
        print("[RenderCoreManager] 👆 处理触摸事件: instanceId=\(instanceId), type=\(type), x=\(x), y=\(y)")
        print("[RenderCoreManager] 👆 可用的 viewControllers: \(viewControllers.keys)")
        
        guard let viewController = viewControllers[instanceId] ?? viewControllers.values.first else {
            print("[RenderCoreManager] ⚠️ 无法处理触摸事件：没有可用的渲染视图控制器 (instanceId=\(instanceId))")
            return
        }
        
        print("[RenderCoreManager] 👆 找到 viewController，调用 handleTouchEvent")
        viewController.handleTouchEvent(type: type, x: x, y: y)
    }
    
    /// 发送页面事件到 Kuikly 容器
    /// 
    /// 该方法用于从外部（JVM 端）向 Kuikly 页面发送事件，类似于 Android 的
    /// `KuiklyRenderViewDelegator.sendEvent` 和 iOS 的 `KuiklyRenderViewControllerDelegator.sendWithEvent`。
    /// 
    /// 事件会被转发给渲染视图控制器，然后发送到 Kuikly 渲染核心，最终触发 Pager 的
    /// `onReceivePagerEvent` 方法。
    /// 
    /// - Parameters:
    ///   - instanceId: 实例 ID
    ///   - event: 事件名称
    ///   - data: 事件数据
    /// - Returns: 是否发送成功
    func sendEvent(instanceId: String, event: String, data: [String: Any]) -> Bool {
        print("[RenderCoreManager] 📨 发送页面事件: instanceId=\(instanceId), event=\(event), data=\(data)")
        
        guard let viewController = viewControllers[instanceId] ?? viewControllers.values.first else {
            print("[RenderCoreManager] ⚠️ 无法发送事件：没有可用的渲染视图控制器 (instanceId=\(instanceId))")
            return false
        }
        
        viewController.sendEvent(event, data: data)
        print("[RenderCoreManager] ✅ 事件已发送到渲染视图控制器: instanceId=\(instanceId), event=\(event)")
        return true
    }
    
    /// 更新预览大小
    /// 
    /// 动态调整指定实例的渲染视图大小。
    /// 
    /// - Parameters:
    ///   - instanceId: 实例 ID
    ///   - width: 新的宽度
    ///   - height: 新的高度
    /// - Returns: 是否更新成功
    func updateSize(instanceId: String, width: CGFloat, height: CGFloat) -> Bool {
        // 调用 updatePreviewConfig 实现
        let config = PreviewConfigModel(from: ["width": Int(width), "height": Int(height)])
        return updatePreviewConfig(instanceId: instanceId, config: config)
    }
    
    /// 更新预览配置
    /// 
    /// - Parameters:
    ///   - instanceId: 实例 ID
    ///   - config: 预览配置模型
    /// - Returns: 是否更新成功
    func updatePreviewConfig(instanceId: String, config: PreviewConfigModel) -> Bool {
        print("[RenderCoreManager] 📋 更新预览配置: instanceId=\(instanceId), config=\(config)")
        
        guard let viewController = viewControllers[instanceId] else {
            print("[RenderCoreManager] ⚠️ 无法更新配置：没有可用的渲染视图控制器 (instanceId=\(instanceId))")
            return false
        }
        
        // 更新视图尺寸（如果配置中包含尺寸信息）
        updateViewSizeIfNeeded(viewController: viewController, config: config, instanceId: instanceId)
        
        // 应用其他配置参数
        applyConfigToViewController(viewController: viewController, config: config)
        
        // 更新 renderRequests 中的配置信息，以便 SwiftUI 视图重新布局
        updateRenderRequests(instanceId: instanceId, config: config)
        
        print("[RenderCoreManager] ✅ 预览配置已更新: instanceId=\(instanceId)")
        return true
    }
    
    /// 更新视图尺寸（如果需要）
    private func updateViewSizeIfNeeded(viewController: PreviewRenderViewController, config: PreviewConfigModel, instanceId: String) {
        guard let width = config.width, let height = config.height else {
            print("[RenderCoreManager] ⚠️ 尺寸参数缺失: width=\(String(describing: config.width)), height=\(String(describing: config.height))")
            return
        }
        
        // 获取 density（优先从 config 中获取）
        let density = getDensity(from: config, instanceId: instanceId)
        
        // 像素值转换为点值
        let widthInPoints = CGFloat(width) / density
        let heightInPoints = CGFloat(height) / density
        
        print("[RenderCoreManager] 📐 更新视图尺寸: 像素 \(width)x\(height) -> 点值 \(Int(widthInPoints))x\(Int(heightInPoints)) (density: \(density))")
        viewController.updateSize(widthInPoints, height: heightInPoints)
    }
    
    /// 获取 density 值
    /// 优先级：config.density > request.config.density > 默认值 1.0
    private func getDensity(from config: PreviewConfigModel, instanceId: String) -> CGFloat {
        if let configDensity = config.density {
            print("[RenderCoreManager] 📐 使用 config.density: \(configDensity)")
            return CGFloat(configDensity)
        }
        
        if let request = PreviewHttpServer.shared.renderRequests[instanceId],
           let requestConfigDensity = request.config?.density {
            print("[RenderCoreManager] 📐 使用 request.config.density: \(requestConfigDensity)")
            return CGFloat(requestConfigDensity)
        }
        
        print("[RenderCoreManager] ⚠️ 未找到 density，使用默认值 1.0")
        return 1.0
    }
    
    /// 应用配置到视图控制器
    private func applyConfigToViewController(viewController: PreviewRenderViewController, config: PreviewConfigModel) {
        let configDict = configToDictionary(config)
        guard !configDict.isEmpty else { return }
        
        viewController.applyConfig(configDict)
    }
    
    /// 更新 renderRequests 中的配置信息
    private func updateRenderRequests(instanceId: String, config: PreviewConfigModel) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            guard let request = PreviewHttpServer.shared.renderRequests[instanceId] else {
                print("[RenderCoreManager] ⚠️ 未找到 renderRequest: instanceId=\(instanceId)")
                return
            }
            
            // 确保 config 包含 density（如果缺失则从 request.config 补充）
            let finalConfig = self.ensureConfigHasDensity(config, from: request)
            
            // 合并配置
            let mergedConfig = self.mergeConfig(request.config, with: finalConfig)
            
            // 确定最终尺寸
            let finalWidth = CGFloat(config.width ?? Int(request.width))
            let finalHeight = CGFloat(config.height ?? Int(request.height))
            
            // 创建并更新 RenderRequest
            let updatedRequest = RenderRequest(
                pageName: request.pageName,
                pageData: request.pageData,
                width: finalWidth,
                height: finalHeight,
                config: mergedConfig
            )
            
            // 重要：创建新的字典实例以触发 SwiftUI 更新
            // SwiftUI 的 @Published 不会检测字典内部值的变化，需要替换整个字典
            var updatedRequests = PreviewHttpServer.shared.renderRequests
            updatedRequests[instanceId] = updatedRequest
            PreviewHttpServer.shared.renderRequests = updatedRequests
            
            print("[RenderCoreManager] ✅ 已更新 renderRequests 中的配置: instanceId=\(instanceId), size=\(updatedRequest.width)x\(updatedRequest.height)")
        }
    }
    
    /// 确保配置包含 density（如果缺失则从 request.config 补充）
    private func ensureConfigHasDensity(_ config: PreviewConfigModel, from request: RenderRequest) -> PreviewConfigModel {
        // 如果 config 已有 density，直接返回
        guard config.density == nil else {
            return config
        }
        
        // 尝试从 request.config 获取 density
        guard let requestDensity = request.config?.density else {
            print("[RenderCoreManager] ℹ️ config 和 request.config 都没有 density")
            return config
        }
        
        print("[RenderCoreManager] 🔧 从 request.config 补充 density: \(requestDensity)")
        
        // 创建包含 density 的新 config
        var configDict = configToDictionary(config)
        configDict["density"] = requestDensity
        
        let finalConfig = PreviewConfigModel(from: configDict)
        print("[RenderCoreManager] ✅ 补充后 finalConfig.density=\(String(describing: finalConfig.density))")
        
        return finalConfig
    }
    
    /// 将 PreviewConfigModel 转换为字典
    private func configToDictionary(_ config: PreviewConfigModel) -> [String: Any] {
        var dict: [String: Any] = [:]
        
        if let name = config.name { dict["name"] = name }
        if let group = config.group { dict["group"] = group }
        if let device = config.device { dict["device"] = device }
        if let width = config.width { dict["width"] = width }
        if let height = config.height { dict["height"] = height }
        if let density = config.density { dict["density"] = density }
        if let orientation = config.orientation { dict["orientation"] = orientation }
        if let isRound = config.isRound { dict["isRound"] = isRound }
        if let chinSize = config.chinSize { dict["chinSize"] = chinSize }
        if let cutout = config.cutout { dict["cutout"] = cutout }
        if let navigation = config.navigation { dict["navigation"] = navigation }
        if let apiLevel = config.apiLevel { dict["apiLevel"] = apiLevel }
        if let locale = config.locale { dict["locale"] = locale }
        if let fontScale = config.fontScale { dict["fontScale"] = fontScale }
        if let showSystemUi = config.showSystemUi { dict["showSystemUi"] = showSystemUi }
        if let showBackground = config.showBackground { dict["showBackground"] = showBackground }
        // 只有当 showBackground 为 true 时才传递 backgroundColor
        if let showBackground = config.showBackground, showBackground, let backgroundColor = config.backgroundColor {
            dict["backgroundColor"] = backgroundColor
        }
        if let uiMode = config.uiMode { dict["uiMode"] = uiMode }
        if let wallpaper = config.wallpaper { dict["wallpaper"] = wallpaper }
        
        return dict
    }
    
    /// 合并配置
    func mergeConfig(_ base: PreviewConfigModel?, with update: PreviewConfigModel) -> PreviewConfigModel {
        guard let base = base else { return update }
        
        var mergedDict: [String: Any] = [:]
        
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
    
    /// 获取渲染视图截图
    func captureScreenshot(instanceId: String? = nil) -> Data? {
        let instId = instanceId ?? currentInstanceId ?? "default"
        guard let viewController = viewControllers[instId] ?? viewControllers.values.first else {
            print("[RenderCoreManager] ⚠️ 无法截图：没有可用的渲染视图控制器 (instanceId=\(instId))")
            return nil
        }
        
        let view = viewController.view
        
        // 强制布局
        view.needsLayout = true
        view.layoutSubtreeIfNeeded()
        
        // 获取视图的 bounds
        let bounds = view.bounds
        guard bounds.width > 0 && bounds.height > 0 else {
            print("[RenderCoreManager] ⚠️ 无法截图：视图尺寸无效 (instanceId=\(instId), bounds=\(bounds))")
            return nil
        }
        
        print("[RenderCoreManager] 📸 准备截图: instanceId=\(instId), bounds=\(bounds), frame=\(view.frame)")
        
        // 方法1: 使用 bitmapImageRepForCachingDisplay（适用于已显示的视图）
        if let bitmapRep = view.bitmapImageRepForCachingDisplay(in: bounds) {
            view.cacheDisplay(in: bounds, to: bitmapRep)
            
            // 检查位图的实际尺寸
            let actualWidth = bitmapRep.pixelsWide
            let actualHeight = bitmapRep.pixelsHigh
            print("[RenderCoreManager] 📸 位图尺寸: \(actualWidth)x\(actualHeight)")
            
            if actualWidth == Int(bounds.width) && actualHeight == Int(bounds.height) {
                if let pngData = bitmapRep.representation(using: .png, properties: [:]) {
                    print("[RenderCoreManager] 📸 截图成功(方法1)：\(pngData.count) 字节, 尺寸: \(actualWidth)x\(actualHeight) (instanceId=\(instId))")
                    return pngData
                }
            }
        }
        
        // 方法2: 使用 NSImage 和 lockFocus（适用于离屏视图）
        print("[RenderCoreManager] 📸 使用备用截图方法...")
        let width = Int(bounds.width)
        let height = Int(bounds.height)
        
        let image = NSImage(size: bounds.size)
        image.lockFocus()
        
        // 填充白色背景
        NSColor.white.setFill()
        NSRect(x: 0, y: 0, width: width, height: height).fill()
        
        // 尝试绘制视图
        if let ctx = NSGraphicsContext.current?.cgContext {
            // 确保视图有 layer
            if view.wantsLayer, let layer = view.layer {
                layer.render(in: ctx)
            } else {
                // 如果没有 layer，尝试使用 display
                view.display()
            }
        }
        
        image.unlockFocus()
        
        // 转换为 PNG
        guard let tiffData = image.tiffRepresentation,
              let bitmapRep = NSBitmapImageRep(data: tiffData),
              let pngData = bitmapRep.representation(using: .png, properties: [:]) else {
            print("[RenderCoreManager] ⚠️ 无法截图：转换 PNG 失败 (instanceId=\(instId))")
            return nil
        }
        
        print("[RenderCoreManager] 📸 截图成功(方法2)：\(pngData.count) 字节, 尺寸: \(width)x\(height) (instanceId=\(instId))")
        return pngData
    }
}

// MARK: - Notifications

extension Notification.Name {
    static let previewRenderInit = Notification.Name("previewRenderInit")
    static let previewRenderDestroy = Notification.Name("previewRenderDestroy")
}

