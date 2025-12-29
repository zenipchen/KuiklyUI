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
import SwiftUI

/// SwiftUI 包装器，用于在 SwiftUI 视图中嵌入 PreviewRenderViewController
/// 🎯 优化：使用 NSViewRepresentable + Coordinator 缓存 NSView，避免 group 变化时重建
struct PreviewRenderViewPage: NSViewRepresentable {
    typealias NSViewType = NSView
    
    var instanceId: String
    var pageName: String
    var data: [String: Any]
    var width: CGFloat
    var height: CGFloat
    var renderCoreManager: PreviewRenderCoreManager?
    
    init(instanceId: String, pageName: String, data: [String: Any], width: CGFloat = 400, height: CGFloat = 800, renderCoreManager: PreviewRenderCoreManager? = nil) {
        self.instanceId = instanceId
        self.pageName = pageName
        self.data = data
        self.width = width
        self.height = height
        self.renderCoreManager = renderCoreManager
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    func makeNSView(context: Context) -> NSView {
        print("[PreviewRenderViewPage] 🔨 makeNSView: instanceId=\(instanceId), pageName=\(pageName), size=\(width)x\(height)")
        
        // 🎯 关键：创建一个容器视图，用于持有 ViewController 的 view
        let containerView = NSView()
        containerView.wantsLayer = true
        
        // 获取或创建 ViewController
        let viewController: PreviewRenderViewController
        if let existingVC = renderCoreManager?.getViewController(forInstanceId: instanceId) {
            print("[PreviewRenderViewPage] ✅ 复用已存在的 ViewController (instanceId=\(instanceId))")
            viewController = existingVC
        } else {
            print("[PreviewRenderViewPage] ⚠️ ViewController 不存在，创建新的 (instanceId=\(instanceId))")
            viewController = PreviewRenderViewController(pageName: pageName, pageData: data, width: width, height: height)
            viewController.setInstanceId(instanceId)
        }
        
        // 🎯 关键：将 ViewController 的 view 添加到容器中
        // 如果 view 已经有父视图，先移除
        viewController.view.removeFromSuperview()
        containerView.addSubview(viewController.view)
        
        // 设置约束，让 ViewController 的 view 填满容器
        viewController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            viewController.view.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            viewController.view.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            viewController.view.topAnchor.constraint(equalTo: containerView.topAnchor),
            viewController.view.bottomAnchor.constraint(equalTo: containerView.bottomAnchor)
        ])
        
        // 保存 ViewController 引用到 Coordinator
        context.coordinator.viewController = viewController
        context.coordinator.instanceId = instanceId
        
        return containerView
    }
    
    func updateNSView(_ containerView: NSView, context: Context) {
        print("[PreviewRenderViewPage] 🔄 updateNSView: instanceId=\(instanceId), pageName=\(pageName), size=\(width)x\(height)")
        
        // 🎯 检查 instanceId 是否变化（理论上不应该变化）
        if context.coordinator.instanceId != instanceId {
            print("[PreviewRenderViewPage] ⚠️ instanceId 变化: \(context.coordinator.instanceId ?? "nil") -> \(instanceId)")
            
            // 获取新的 ViewController
            if let newVC = renderCoreManager?.getViewController(forInstanceId: instanceId) {
                // 移除旧的 view
                context.coordinator.viewController?.view.removeFromSuperview()
                
                // 添加新的 view
                newVC.view.removeFromSuperview()
                containerView.addSubview(newVC.view)
                
                newVC.view.translatesAutoresizingMaskIntoConstraints = false
                NSLayoutConstraint.activate([
                    newVC.view.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
                    newVC.view.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
                    newVC.view.topAnchor.constraint(equalTo: containerView.topAnchor),
                    newVC.view.bottomAnchor.constraint(equalTo: containerView.bottomAnchor)
                ])
                
                context.coordinator.viewController = newVC
                context.coordinator.instanceId = instanceId
            }
        }
        
        guard let viewController = context.coordinator.viewController else {
            print("[PreviewRenderViewPage] ⚠️ ViewController 为空")
            return
        }
        
        // 更新页面数据
        viewController.update(withPageName: pageName, pageData: data)
        
        // 检查尺寸是否变化
        let density: CGFloat = {
            if let request = PreviewHttpServer.shared.renderRequests[instanceId],
               let configDensity = request.config?.density {
                return CGFloat(configDensity)
            }
            if let pageDataDensity = data["_preview_density"] as? NSNumber {
                return CGFloat(pageDataDensity.floatValue)
            }
            return 2.0
        }()
        
        let widthInPoints = width / density
        let heightInPoints = height / density
        
        let currentWidth = viewController.view.frame.width
        let currentHeight = viewController.view.frame.height
        
        if abs(currentWidth - widthInPoints) > 0.1 || abs(currentHeight - heightInPoints) > 0.1 {
            print("[PreviewRenderViewPage] 📐 检测到尺寸变化: \(currentWidth)x\(currentHeight) -> \(widthInPoints)x\(heightInPoints)")
            viewController.updateSize(widthInPoints, height: heightInPoints)
        }
    }
    
    /// Coordinator 用于持有 ViewController 引用
    class Coordinator {
        var viewController: PreviewRenderViewController?
        var instanceId: String?
    }
}

// MARK: - PreviewRenderViewController Swift Extension

extension PreviewRenderViewController {
    /// Swift 便捷方法：处理 callKotlinMethod
    func handleCallKotlinMethod(methodId: Int, args: [Any?]) {
        let nsArgs = args.map { arg -> Any in
            if let value = arg {
                return value
            }
            return NSNull()
        }
        self.handleCallKotlinMethod(withMethodId: methodId, args: nsArgs)
    }
    
    /// Swift 便捷方法：处理触摸事件
    func handleTouchEvent(type: String, x: CGFloat, y: CGFloat) {
        self.handleTouchEvent(withType: type, x: x, y: y)
    }
}

