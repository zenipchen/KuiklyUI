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
struct PreviewRenderViewPage: NSViewControllerRepresentable {
    typealias NSViewControllerType = PreviewRenderViewController
    
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
    
    func makeNSViewController(context: Context) -> PreviewRenderViewController {
        print("[PreviewRenderViewPage] 🔨 makeNSViewController: instanceId=\(instanceId), pageName=\(pageName), size=\(width)x\(height)")
        
        // 优先从 RenderCoreManager 获取已存在的 ViewController
        if let existingVC = renderCoreManager?.getViewController(forInstanceId: instanceId) {
            print("[PreviewRenderViewPage] ✅ 使用已存在的 ViewController (instanceId=\(instanceId))")
            return existingVC
        }
        
        // 如果不存在，创建一个新的（这种情况不应该发生，因为 HTTP Server 已经创建了）
        print("[PreviewRenderViewPage] ⚠️ ViewController 不存在，创建新的 (instanceId=\(instanceId))")
        let viewController = PreviewRenderViewController(pageName: pageName, pageData: data, width: width, height: height)
        viewController.setInstanceId(instanceId)
        return viewController
    }
    
    func updateNSViewController(_ nsViewController: PreviewRenderViewController, context: Context) {
        print("[PreviewRenderViewPage] 🔄 updateNSViewController: instanceId=\(instanceId), pageName=\(pageName), size=\(width)x\(height)")
        
        // 更新页面数据
        nsViewController.update(withPageName: pageName, pageData: data)
        
        // 检查尺寸是否变化，如果变化则更新视图大小
        // ⚠️ 重要：从 RenderRequest 的 config 中获取 density，而不是从 pageData
        // 因为 config 是经过 mergeConfig 处理的，包含了正确的 density 信息
        
        // 从 renderRequests 中获取 request，从 config 中获取 density
        let density: CGFloat = {
            if let request = PreviewHttpServer.shared.renderRequests[instanceId],
               let configDensity = request.config?.density {
                print("[PreviewRenderViewPage] 📐 从 config 获取 density: \(configDensity)")
                return CGFloat(configDensity)
            }
            // 如果 config 中没有 density，从 pageData 中获取（兼容旧逻辑）
            if let pageDataDensity = data["_preview_density"] as? NSNumber {
                print("[PreviewRenderViewPage] ⚠️ config 中没有 density，从 pageData 获取: \(pageDataDensity)")
                return CGFloat(pageDataDensity.floatValue)
            }
            print("[PreviewRenderViewPage] ⚠️ 未找到 density，使用默认值 2.0")
            return 2.0 // 默认 density
        }()
        
        // 判断 width/height 是像素值还是点值
        // 如果 width/height 很大（>1000），可能是像素值，需要转换
        // 否则，可能是点值（来自 updatePreviewConfig），直接使用
        let widthInPoints: CGFloat
        let heightInPoints: CGFloat
        
        
        widthInPoints = width / density
        heightInPoints = height / density
        print("[PreviewRenderViewPage] 📐 检测到像素值，转换为点值: \(width)x\(height) / \(density) = \(widthInPoints)x\(heightInPoints)")
    
        let currentWidth = nsViewController.view.frame.width
        let currentHeight = nsViewController.view.frame.height
        
        if abs(currentWidth - widthInPoints) > 0.1 || abs(currentHeight - heightInPoints) > 0.1 {
            print("[PreviewRenderViewPage] 📐 检测到尺寸变化: \(currentWidth)x\(currentHeight) -> \(widthInPoints)x\(heightInPoints) (像素: \(width)x\(height))")
            nsViewController.updateSize(widthInPoints, height: heightInPoints)
        }
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

