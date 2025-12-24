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
import Darwin

/// 端口管理器 - 负责端口分配和配置管理
class PortManager {
    static let shared = PortManager()
    
    // TCP 端口范围（用于实际通信）
    let tcpPortRange: ClosedRange<Int> = 9528...9600
    
    // 服务发现端口范围（用于 HTTP 服务发现端点）
    let discoveryPortRange: ClosedRange<Int> = 8765...8775
    
    private let configDir: URL
    
    private init() {
        // 配置文件目录：~/Library/Application Support/Kuikly
        let supportDir = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first!
        configDir = supportDir.appendingPathComponent("Kuikly", isDirectory: true)
        
        // 确保目录存在
        try? FileManager.default.createDirectory(
            at: configDir,
            withIntermediateDirectories: true
        )
    }
    
    /// 分配 TCP 端口（用于实际通信）
    func allocateTcpPort() -> Int? {
        return allocatePort(in: tcpPortRange, configFileName: "tcp-port")
    }
    
    /// 分配服务发现端口（用于 HTTP 服务发现端点）
    func allocateDiscoveryPort() -> Int? {
        return allocatePort(in: discoveryPortRange, configFileName: "discovery-port")
    }
    
    /// 在指定范围内分配端口
    private func allocatePort(in range: ClosedRange<Int>, configFileName: String) -> Int? {
        let configPath = configDir.appendingPathComponent(configFileName).path
        
        // 1. 尝试读取已分配的端口
        if let existingPort = readPort(from: configPath) {
            if isPortAvailable(existingPort) {
                print("[PortManager] ✅ 使用已分配的端口: \(existingPort)")
                return existingPort
            } else {
                print("[PortManager] ⚠️ 已分配的端口 \(existingPort) 不可用，重新分配")
            }
        }
        
        // 2. 在范围内查找可用端口
        for port in range {
            if isPortAvailable(port) {
                // 保存到配置文件
                savePort(port, to: configPath)
                print("[PortManager] ✅ 分配新端口: \(port)")
                return port
            }
        }
        
        print("[PortManager] ❌ 在端口范围 \(range) 内未找到可用端口")
        return nil
    }
    
    /// 检查端口是否可用
    private func isPortAvailable(_ port: Int) -> Bool {
        let socket = socket(AF_INET, SOCK_STREAM, 0)
        guard socket >= 0 else {
            return false
        }
        
        defer {
            close(socket)
        }
        
        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_addr.s_addr = inet_addr("127.0.0.1")
        addr.sin_port = UInt16(port).bigEndian
        
        let result = withUnsafePointer(to: &addr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                bind(socket, $0, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }
        
        return result == 0
    }
    
    /// 从配置文件读取端口
    func readTcpPort() -> Int? {
        let configPath = configDir.appendingPathComponent("tcp-port").path
        return readPort(from: configPath)
    }
    
    func readDiscoveryPort() -> Int? {
        let configPath = configDir.appendingPathComponent("discovery-port").path
        return readPort(from: configPath)
    }
    
    private func readPort(from path: String) -> Int? {
        guard let content = try? String(contentsOfFile: path, encoding: .utf8),
              let port = Int(content.trimmingCharacters(in: .whitespacesAndNewlines)) else {
            return nil
        }
        return port
    }
    
    /// 保存端口到配置文件
    private func savePort(_ port: Int, to path: String) {
        do {
            try String(port).write(toFile: path, atomically: true, encoding: .utf8)
        } catch {
            print("[PortManager] ⚠️ 保存端口配置失败: \(error)")
        }
    }
    
    /// 清理端口配置（当服务停止时）
    func clearPorts() {
        let tcpPortPath = configDir.appendingPathComponent("tcp-port").path
        let discoveryPortPath = configDir.appendingPathComponent("discovery-port").path
        
        try? FileManager.default.removeItem(atPath: tcpPortPath)
        try? FileManager.default.removeItem(atPath: discoveryPortPath)
    }
}

