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

import SwiftUI
import AppKit

@main
struct KuiklyUITools: App {
    @StateObject private var httpServer = PreviewHttpServer.shared
    @StateObject private var tcpServer = PreviewTcpServer.shared
    
    // NSApplicationDelegate 适配器，用于处理应用激活
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            PreviewContentView()
                .environmentObject(httpServer)
                .environmentObject(tcpServer)
                .frame(minWidth: 400, minHeight: 600)
                .onAppear {
                    // 启动服务发现端点（HTTP，用于客户端发现 TCP 端口）
                    print("[KuiklyUITools] 🚀 正在启动服务发现端点...")
                    PreviewDiscoveryServer.shared.start()
                    
                    // 启动 TCP 服务（自动分配端口）
                    print("[KuiklyUITools] 🚀 正在启动 TCP 服务器...")
                    PreviewTcpServer.shared.start()  // 不指定端口，自动分配
                    print("[KuiklyUITools] ✅ TCP 服务器启动命令已发送")
                }
        }
        .commands {
            // 确保应用可以响应 Dock 点击
            CommandGroup(replacing: .appInfo) {
                Button("关于 KuiklyUITools") {
                    NSApp.orderFrontStandardAboutPanel(nil)
                }
            }
        }
    }
    
    init() {
        // HTTP 服务已禁用（仅保留用于兼容性）
        // PreviewHttpServer.shared.start(port: 9527)
        print("[KuiklyUITools] 📱 KuiklyUITools 初始化")
    }
}

/// 应用委托，处理 Dock 点击和应用激活
class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        print("[AppDelegate] 🔄 应用收到重新打开请求，hasVisibleWindows: \(flag)")
        
        // 如果应用有可见窗口，激活它们
        if flag {
            // 激活所有可见窗口
            for window in NSApplication.shared.windows {
                if window.isVisible {
                    window.makeKeyAndOrderFront(nil)
                    window.orderFrontRegardless()
                }
            }
        } else {
            // 如果没有可见窗口，创建新窗口或激活现有窗口
            // 对于 SwiftUI WindowGroup，系统会自动处理
            // 但我们可以确保应用被激活
            NSApplication.shared.activate(ignoringOtherApps: true)
            
            // 尝试激活主窗口
            if let mainWindow = NSApplication.shared.mainWindow {
                mainWindow.makeKeyAndOrderFront(nil)
                mainWindow.orderFrontRegardless()
            } else if let keyWindow = NSApplication.shared.keyWindow {
                keyWindow.makeKeyAndOrderFront(nil)
                keyWindow.orderFrontRegardless()
            } else if let firstWindow = NSApplication.shared.windows.first(where: { $0.isVisible }) {
                firstWindow.makeKeyAndOrderFront(nil)
                firstWindow.orderFrontRegardless()
            }
        }
        
        print("[AppDelegate] ✅ 应用已激活")
        return true
    }
    
    func applicationDidBecomeActive(_ notification: Notification) {
        print("[AppDelegate] ✅ 应用已变为活动状态")
        
        // 确保窗口在前台
        DispatchQueue.main.async {
            for window in NSApplication.shared.windows {
                if window.isVisible {
                    window.makeKeyAndOrderFront(nil)
                }
            }
        }
    }
    
    func applicationWillBecomeActive(_ notification: Notification) {
        print("[AppDelegate] 🔄 应用即将变为活动状态")
    }
}
