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
import Foundation
import AppKit

struct PreviewContentView: View {
    @EnvironmentObject var httpServer: PreviewHttpServer
    @State private var displayMode: DisplayMode = .grid  // 显示模式：网格或列表
    @State private var isGrouped: Bool = true  // 是否按 group 分组显示
    
    // 全局缩放比例（所有实例共享）
    @State private var globalScale: CGFloat = 1.0
    
    // 窗口置顶状态（默认开启）
    @State private var isAlwaysOnTop = true
    
    // 缩放限制
    private let minScale: CGFloat = 0.25
    private let maxScale: CGFloat = 4.0
    private let scaleStep: CGFloat = 0.25
    
    enum DisplayMode {
        case grid    // 网格布局
        case list    // 列表布局
    }
    
    var body: some View {
        ZStack {
            Color(NSColor.windowBackgroundColor)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // 顶部状态栏
                StatusBar(
                    serverPort: httpServer.port,
                    isRunning: httpServer.isRunning,
                    instanceCount: httpServer.renderRequests.count,
                    displayMode: $displayMode,
                    isGrouped: $isGrouped,
                    scale: $globalScale,
                    minScale: minScale,
                    maxScale: maxScale,
                    scaleStep: scaleStep,
                    isAlwaysOnTop: $isAlwaysOnTop,
                    onZoomIn: zoomIn,
                    onZoomOut: zoomOut,
                    onResetZoom: resetZoom,
                    onToggleAlwaysOnTop: toggleAlwaysOnTop
                )
                
                Divider()
                
                // 渲染视图区域（预览面板尺寸不变，实例会缩放并重排列）
                if httpServer.renderRequests.isEmpty {
                    WelcomeView(instanceCount: 0)
                } else {
                    // 多实例渲染视图（根据缩放后的尺寸重新排列）
                    MultiInstanceRenderView(
                        renderRequests: httpServer.renderRequests,
                        renderCoreManager: httpServer.renderCoreManager,
                        displayMode: displayMode,
                        isGrouped: isGrouped,
                        globalScale: globalScale
                    )
                }
            }
        }
        .background(WindowAccessor(isAlwaysOnTop: $isAlwaysOnTop))
        .onAppear {
            // 启动时设置窗口为置顶状态
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                if let window = NSApplication.shared.windows.first(where: { $0.isVisible }) {
                    window.level = .floating
                    print("[PreviewContentView] ✅ 启动时窗口已设置为置顶")
                }
            }
        }
    }
    
    // 放大
    private func zoomIn() {
        withAnimation(.easeInOut(duration: 0.2)) {
            globalScale = min(globalScale + scaleStep, maxScale)
        }
    }
    
    // 缩小
    private func zoomOut() {
        withAnimation(.easeInOut(duration: 0.2)) {
            globalScale = max(globalScale - scaleStep, minScale)
        }
    }
    
    // 重置缩放
    private func resetZoom() {
        withAnimation(.easeInOut(duration: 0.2)) {
            globalScale = 1.0
        }
    }
    
    // 切换窗口置顶
    private func toggleAlwaysOnTop() {
        isAlwaysOnTop.toggle()
        
        // 获取当前窗口 - 尝试多种方式
        var window: NSWindow?
        
        // 方法1: 通过主窗口
        if let mainWindow = NSApplication.shared.mainWindow {
            window = mainWindow
        }
        // 方法2: 通过关键窗口
        else if let keyWindow = NSApplication.shared.keyWindow {
            window = keyWindow
        }
        // 方法3: 从窗口列表中找到第一个可见窗口
        else if let firstWindow = NSApplication.shared.windows.first(where: { $0.isVisible }) {
            window = firstWindow
        }
        
        // 设置窗口层级
        if let window = window {
            if isAlwaysOnTop {
                window.level = .floating
                print("[PreviewContentView] ✅ 窗口已置顶")
            } else {
                window.level = .normal
                print("[PreviewContentView] ✅ 窗口已取消置顶")
            }
        } else {
            print("[PreviewContentView] ⚠️ 无法找到窗口")
        }
    }
}

/// 状态栏视图
struct StatusBar: View {
    let serverPort: Int
    let isRunning: Bool
    let instanceCount: Int
    @Binding var displayMode: PreviewContentView.DisplayMode
    @Binding var isGrouped: Bool  // 是否按 group 分组显示
    
    // 缩放相关参数
    @Binding var scale: CGFloat
    let minScale: CGFloat
    let maxScale: CGFloat
    let scaleStep: CGFloat
    
    // 窗口置顶状态
    @Binding var isAlwaysOnTop: Bool
    
    let onZoomIn: () -> Void
    let onZoomOut: () -> Void
    let onResetZoom: () -> Void
    let onToggleAlwaysOnTop: () -> Void
    
    var body: some View {
        HStack {
            Circle()
                .fill(isRunning ? Color.green : Color.red)
                .frame(width: 8, height: 8)
            
            Text("Tcp ")
                .font(.system(size: 12, weight: .medium))

            Text("Port: \(serverPort)")
                .font(.system(size: 11, weight: .regular))
                .foregroundColor(.secondary)
            
            if instanceCount > 0 {
                Text("(\(instanceCount) instance\(instanceCount > 1 ? "s" : ""))")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // 缩放控制按钮（仅在有待预览实例时显示）
            if instanceCount > 0 {
                HStack(spacing: 8) {
                    // 缩放比例显示
                    Text("\(Int(scale * 100))%")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.secondary)
                        .frame(minWidth: 40)
                    
                    // 缩小按钮
                    Button(action: onZoomOut) {
                        Image(systemName: "minus.magnifyingglass")
                            .font(.system(size: 12))
                    }
                    .buttonStyle(.plain)
                    .disabled(scale <= minScale)
                    
//                     // 重置按钮
//                     Button(action: onResetZoom) {
//                         Image(systemName: "arrow.counterclockwise")
//                             .font(.system(size: 12))
//                     }
//                     .buttonStyle(.plain)
                    
                    // 放大按钮
                    Button(action: onZoomIn) {
                        Image(systemName: "plus.magnifyingglass")
                            .font(.system(size: 12))
                    }
                    .buttonStyle(.plain)
                    .disabled(scale >= maxScale)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color(NSColor.controlBackgroundColor))
                .cornerRadius(4)
            }
            
            // 显示模式切换按钮
            if instanceCount > 1 {
//                 HStack(spacing: 8) {
//                     // 分组显示切换按钮
//                     Button(action: {
//                         isGrouped.toggle()
//                     }) {
//                         Image(systemName: isGrouped ? "square.grid.3x3.fill" : "square.grid.3x3")
//                             .font(.system(size: 12))
//                             .foregroundColor(isGrouped ? .blue : .secondary)
//                     }
//                     .buttonStyle(.plain)
//                     .help(isGrouped ? "取消分组显示" : "按 group 分组显示")
//
//                     // 布局模式切换按钮
//                 Picker("显示模式", selection: $displayMode) {
//                     Image(systemName: "square.grid.2x2").tag(PreviewContentView.DisplayMode.grid)
//                     Image(systemName: "list.bullet").tag(PreviewContentView.DisplayMode.list)
//                 }
//                 .pickerStyle(.segmented)
//                 .frame(width: 100)
//                 }
            }
            
            // 置顶按钮和提示
            HStack(spacing: 4) {
                Button(action: onToggleAlwaysOnTop) {
                    Image(systemName: isAlwaysOnTop ? "pin.fill" : "pin")
                        .font(.system(size: 12))
                        .foregroundColor(isAlwaysOnTop ? .blue : .secondary)
                }
                .buttonStyle(.plain)
                .help(isAlwaysOnTop ? "取消置顶" : "窗口置顶")
                
                if isAlwaysOnTop {
                    Text("可在此关闭置顶")
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                }
            }
            

        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(NSColor.controlBackgroundColor))
    }
}

/// 欢迎视图
struct WelcomeView: View {
    let instanceCount: Int
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "rectangle.on.rectangle.angled")
                .font(.system(size: 64))
                .foregroundColor(.accentColor)
            
            Text("Kuikly Preview")
                .font(.title)
                .fontWeight(.bold)
            
            if instanceCount == 0 {
                Text("等待 IDE 发送渲染请求...")
                    .font(.body)
                    .foregroundColor(.secondary)
            } else {
                Text("已加载 \(instanceCount) 个渲染实例")
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            
            VStack(alignment: .leading, spacing: 8) {
                Label("TCP 服务已启动", systemImage: "checkmark.circle.fill")
                    .foregroundColor(.green)
                Label("等待 IDE 发送渲染请求", systemImage: "arrow.down.circle")
                    .foregroundColor(.blue)
                if instanceCount > 0 {
                    Label("支持多实例渲染", systemImage: "square.stack.3d.up")
                        .foregroundColor(.blue)
                }
            }
            .font(.system(size: 13))
            .padding()
            .background(Color(NSColor.controlBackgroundColor))
            .cornerRadius(8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

/// 分组数据结构 - 用于 ForEach 的稳定 ID
private struct GroupData: Identifiable {
    let group: String?
    let instanceIds: [String]
    
    // 🎯 使用 group 名称作为稳定 ID，nil 用特殊字符串表示
    var id: String { stableId }
    var stableId: String { group ?? "__ungrouped__" }
}

/// 按 group 分组实例
private func groupInstancesByGroup(_ renderRequests: [String: RenderRequest]) -> [GroupData] {
    var grouped: [String?: [String]] = [:]
    
    for (instanceId, request) in renderRequests {
        let group = request.config?.group
        if grouped[group] == nil {
            grouped[group] = []
        }
        grouped[group]?.append(instanceId)
    }
    
    // 排序：有 group 的在前，按 group 名称排序；无 group 的（nil）在最后
    let sortedGroups = grouped.keys.sorted { group1, group2 in
        if group1 == nil {
            return false  // nil 排在最后
        }
        if group2 == nil {
            return true   // group1 排在前面
        }
        return group1! < group2!  // 按 group 字符串排序
    }
    
    // 每个 group 内的 instanceId 也排序
    return sortedGroups.map { group in
        let instanceIds = grouped[group]?.sorted() ?? []
        return GroupData(group: group, instanceIds: instanceIds)
    }
}

/// 多实例渲染视图
/// 🎯 优化：分组模式下每个 group 独立 Flow 布局，同时通过稳定的 instanceId 避免重建
struct MultiInstanceRenderView: View {
    let renderRequests: [String: RenderRequest]
    let renderCoreManager: PreviewRenderCoreManager?
    let displayMode: PreviewContentView.DisplayMode
    let isGrouped: Bool  // 是否按 group 分组显示
    let globalScale: CGFloat  // 全局缩放比例
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                if isGrouped {
                    // 🎯 分组模式：每个 group 独立 Flow 布局
                    let groupedInstances = groupInstancesByGroup(renderRequests)
                    
                    ForEach(groupedInstances, id: \.stableId) { groupData in
                        VStack(alignment: .leading, spacing: 12) {
                            // 🎨 优化后的分组标题
                            if let groupName = groupData.group, !groupName.isEmpty {
                                HStack(spacing: 8) {
                                    // 分组图标
                                    Image(systemName: "folder.fill")
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(.accentColor)
                                    
                                    // 分组名称
                                    Text(groupName)
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(.primary)
                                    
                                    // 实例数量标签
                                    Text("\(groupData.instanceIds.count)")
                                        .font(.system(size: 10, weight: .medium))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(
                                            Capsule()
                                                .fill(Color.accentColor.opacity(0.8))
                                        )
                                    
                                    Spacer()
                                }
                                .padding(.horizontal, 4)
                                .padding(.bottom, 4)
                            }
                            
                            // 该 group 内的实例使用 Flow 布局
                            let flowItems = groupData.instanceIds.compactMap { instanceId -> FlowItem? in
                                guard let request = renderRequests[instanceId] else { return nil }
                                return FlowItem(id: instanceId, request: request)
                            }
                            
                            FlowLayout(flowItems, spacing: 20, scale: globalScale) { item in
                                // 🎯 关键：使用 .id() 修饰符，让 SwiftUI 能跨父视图追踪同一实例
                                InstanceRenderCard(
                                    instanceId: item.id,
                                    request: item.request,
                                    renderCoreManager: renderCoreManager,
                                    scale: globalScale
                                )
                                .id("card_\(item.id)")  // 全局唯一 ID
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                } else {
                    // 🎯 非分组模式：所有实例平铺 Flow 布局
                    let allInstanceIds = renderRequests.keys.sorted()
                    let flowItems = allInstanceIds.compactMap { instanceId -> FlowItem? in
                        guard let request = renderRequests[instanceId] else { return nil }
                        return FlowItem(id: instanceId, request: request)
                    }
                    
                    FlowLayout(flowItems, spacing: 20, scale: globalScale) { item in
                        InstanceRenderCard(
                            instanceId: item.id,
                            request: item.request,
                            renderCoreManager: renderCoreManager,
                            scale: globalScale
                        )
                        .id("card_\(item.id)")  // 全局唯一 ID
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding(20)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

/// Flow 布局项 - 用于 FlowLayout
private struct FlowItem: Identifiable {
    let id: String
    let request: RenderRequest
}

/// 尺寸偏好键 - 用于收集子视图的尺寸
private struct SizePreferenceKey: PreferenceKey {
    static var defaultValue: CGSize = .zero
    static func reduce(value: inout CGSize, nextValue: () -> CGSize) {
        value = nextValue()
    }
}

/// 尺寸读取器 - 用于获取视图的实际尺寸
private struct SizeReader: View {
    var body: some View {
        GeometryReader { geometry in
            Color.clear
                .preference(key: SizePreferenceKey.self, value: geometry.size)
        }
    }
}

/// Flow 布局视图 - 从左到右、从上到下自动换行
/// 使用 GeometryReader 和 PreferenceKey 实现真正的 Flow 布局，兼容 macOS 12.0+
/// 🎯 优化版本：避免窗口大小变化时重建预览实例，同时支持实例尺寸动态变化
struct FlowLayout<Data: RandomAccessCollection, Content: View>: View where Data.Element: Identifiable {
    var data: Data
    var spacing: CGFloat
    var content: (Data.Element) -> Content
    var scale: CGFloat  // 缩放比例，用于计算原始尺寸
    
    @State private var itemSizes: [Data.Element.ID: CGSize] = [:]
    @State private var availableWidth: CGFloat = 0
    @State private var totalHeight: CGFloat = 0  // 🎯 新增：存储计算出的总高度
    @State private var dataVersion: Int = 0  // 数据版本号，用于检测数据变化
    
    init(_ data: Data, spacing: CGFloat = 8, scale: CGFloat = 1.0, @ViewBuilder content: @escaping (Data.Element) -> Content) {
        self.data = data
        self.spacing = spacing
        self.scale = scale
        self.content = content
    }
    
    var body: some View {
        // 🎯 关键修复：将 GeometryReader 包装在一个有固定高度的容器中
        // 这样 ScrollView 就能知道内容的实际高度
        GeometryReader { geometry in
            let containerWidth = geometry.size.width
            let calculatedHeight = calculateTotalHeight(containerWidth: containerWidth)
            
            // 🎯 关键优化：使用稳定的布局方式，避免因换行变化导致视图重建
            // 始终使用 ZStack + offset，同时持续监听尺寸变化
            ZStack(alignment: .topLeading) {
                ForEach(Array(data), id: \.id) { item in
                    let position = calculateItemPosition(for: item.id, in: containerWidth)
                    content(item)
                        .background(
                            // 🎯 持续监听每个 item 的尺寸变化（而不是只在初始化时收集一次）
                            GeometryReader { itemGeometry in
                                Color.clear
                                    .preference(key: ItemSizePreferenceKey.self, 
                                               value: [AnyHashable(item.id): itemGeometry.size])
                            }
                        )
                        .offset(x: position.x, y: position.y)
                }
            }
            .frame(height: calculatedHeight, alignment: .topLeading)
            .onPreferenceChange(ItemSizePreferenceKey.self) { sizes in
                // 🎯 持续更新尺寸（支持实例尺寸动态变化）
                for (anyId, size) in sizes {
                    if let id = anyId.base as? Data.Element.ID {
                        // 收集到的尺寸是缩放后的，需要除以 scale 得到原始尺寸
                        let originalSize = CGSize(width: size.width / scale, height: size.height / scale)
                        
                        // 如果尺寸变化了，更新并触发重新布局
                        if itemSizes[id] != originalSize {
                            itemSizes[id] = originalSize
                        }
                    }
                }
                // 🎯 更新总高度
                DispatchQueue.main.async {
                    let newHeight = calculateTotalHeight(containerWidth: availableWidth > 0 ? availableWidth : containerWidth)
                    if totalHeight != newHeight {
                        totalHeight = newHeight
                    }
                }
            }
            .onChange(of: containerWidth) { newWidth in
                availableWidth = newWidth
                // 🎯 容器宽度变化时重新计算高度
                DispatchQueue.main.async {
                    totalHeight = calculateTotalHeight(containerWidth: newWidth)
                }
            }
            .onChange(of: data.count) { newCount in
                // 🎯 数据数量变化时，递增版本号（触发重新布局）
                dataVersion += 1
            }
            .onAppear {
                availableWidth = containerWidth
                totalHeight = calculatedHeight
            }
        }
        // 🎯 关键修复：设置 FlowLayout 的固有高度，让 ScrollView 能正确计算滚动区域
        .frame(height: totalHeight > 0 ? totalHeight : nil)
    }
    
    /// 计算单个 item 的位置（使用稳定的算法，不依赖行索引）
    private func calculateItemPosition(for itemId: Data.Element.ID, in containerWidth: CGFloat) -> CGPoint {
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var currentRowMaxHeight: CGFloat = 0
        
        for item in data {
            guard let itemSize = itemSizes[item.id] else { continue }
            let scaledWidth = itemSize.width * scale
            let scaledHeight = itemSize.height * scale
            
            // 检查是否需要换行
            if currentX > 0 && currentX + scaledWidth > containerWidth {
                // 换行
                currentX = 0
                currentY += currentRowMaxHeight + spacing
                currentRowMaxHeight = 0
            }
            
            // 如果是当前要查找的 item，返回其位置
            if item.id == itemId {
                return CGPoint(x: currentX, y: currentY)
            }
            
            // 更新当前行的状态
            currentX += scaledWidth + spacing
            currentRowMaxHeight = max(currentRowMaxHeight, scaledHeight)
        }
        
        return .zero
    }
    
    /// 计算总高度
    private func calculateTotalHeight(containerWidth: CGFloat) -> CGFloat {
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var currentRowMaxHeight: CGFloat = 0
        
        for item in data {
            guard let itemSize = itemSizes[item.id] else { continue }
            let scaledWidth = itemSize.width * scale
            let scaledHeight = itemSize.height * scale
            
            // 检查是否需要换行
            if currentX > 0 && currentX + scaledWidth > containerWidth {
                // 换行
                currentX = 0
                currentY += currentRowMaxHeight + spacing
                currentRowMaxHeight = 0
            }
            
            currentX += scaledWidth + spacing
            currentRowMaxHeight = max(currentRowMaxHeight, scaledHeight)
        }
        
        // 返回总高度
        return currentY + currentRowMaxHeight
    }
    
    // 保留原有方法以供参考（但不再使用）
    func calculateRows(containerWidth: CGFloat) -> [[Data.Element]] {
        var rows: [[Data.Element]] = []
        var currentRow: [Data.Element] = []
        var currentRowWidth: CGFloat = 0
        
        for item in data {
            let itemWidth = itemSizes[item.id]?.width ?? 300  // 默认宽度，会通过 PreferenceKey 更新
            
            if currentRowWidth > 0 && currentRowWidth + itemWidth + spacing > containerWidth {
                rows.append(currentRow)
                currentRow = [item]
                currentRowWidth = itemWidth
            } else {
                currentRow.append(item)
                currentRowWidth += itemWidth + (currentRow.count > 1 ? spacing : 0)
            }
        }
        
        if !currentRow.isEmpty {
            rows.append(currentRow)
        }
        
        return rows
    }
}

/// Item 尺寸偏好键 - 使用 AnyHashable 支持不同的 ID 类型
private struct ItemSizePreferenceKey: PreferenceKey {
    static var defaultValue: [AnyHashable: CGSize] = [:]
    static func reduce(value: inout [AnyHashable: CGSize], nextValue: () -> [AnyHashable: CGSize]) {
        value.merge(nextValue(), uniquingKeysWith: { $1 })
    }
}

/// 单个 group 的 Flow 布局视图（保留用于其他场景，但主渲染不再使用）
struct GroupGridView: View {
    let group: String?
    let instanceIds: [String]
    let renderRequests: [String: RenderRequest]
    let renderCoreManager: PreviewRenderCoreManager?
    let globalScale: CGFloat
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // 🎨 优化后的分组标题
            if let groupName = group, !groupName.isEmpty {
                HStack(spacing: 8) {
                    Image(systemName: "folder.fill")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.accentColor)
                    
                    Text(groupName)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.primary)
                    
                    Text("\(instanceIds.count)")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(
                            Capsule()
                                .fill(Color.accentColor.opacity(0.8))
                        )
                    
                    Spacer()
                }
                .padding(.horizontal, 4)
                .padding(.bottom, 4)
            }
            
            // Flow 布局
            let flowItems = instanceIds.compactMap { instanceId -> FlowItem? in
                guard let request = renderRequests[instanceId] else { return nil }
                return FlowItem(id: instanceId, request: request)
            }
            
            FlowLayout(flowItems, spacing: 20, scale: globalScale) { item in
                InstanceRenderCard(
                    instanceId: item.id,
                    request: item.request,
                    renderCoreManager: renderCoreManager,
                    scale: globalScale
                )
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// 单个实例渲染卡片
struct InstanceRenderCard: View {
    let instanceId: String
    let request: RenderRequest
    let renderCoreManager: PreviewRenderCoreManager?
    let scale: CGFloat  // 缩放比例
    
    @State private var isHovered = false  // 悬停状态
    
    /// 触发刷新：通过 TCP NOTIFICATION 通知 desktopAppWithMacRender 调用 refresh
    private func triggerRefresh(instanceId: String) {
        print("[InstanceRenderCard] 🔄 触发刷新: instanceId=\(instanceId)")
        
        // 通过 TCP 长连接发送 refresh 通知（不再使用 HTTP RefreshServer）
        Task { @MainActor in
            let success = PreviewTcpServer.shared.sendRefreshNotification(instanceId: instanceId)
            if success {
                print("[InstanceRenderCard] ✅ refresh 通知已通过 TCP 发送: instanceId=\(instanceId)")
            } else {
                print("[InstanceRenderCard] ⚠️ refresh 通知发送失败: instanceId=\(instanceId) 没有 TCP 连接")
            }
        }
    }
    
    var body: some View {
        // 计算原始尺寸（未缩放）
        let titleBarHeight: CGFloat = 36  // 优化后的标题栏高度（更紧凑）
        let contentPadding: CGFloat = 8   // 内容区域的内边距
        
        // 将像素值转换为点值（macOS 使用点值）
        let density: CGFloat = {
            if let configDensity = request.config?.density {
                return CGFloat(configDensity)
            }
            if let pageDataDensity = request.pageData["_preview_density"] as? NSNumber {
                return CGFloat(pageDataDensity.floatValue)
            }
            return 1
        }()
        let widthInPoints = request.width / density
        let heightInPoints = request.height / density
        
        // 原始卡片尺寸（未缩放，使用点值）
        let originalCardWidth = widthInPoints + contentPadding * 2
        let originalCardHeight = titleBarHeight + heightInPoints + contentPadding
        
        VStack(alignment: .leading, spacing: 0) {
            // 🎨 优化后的标题栏
            HStack(spacing: 8) {
                // 预览图标
                Image(systemName: "rectangle.on.rectangle")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.accentColor)
                
                // 名称和尺寸
                VStack(alignment: .leading, spacing: 1) {
                    Text(getDisplayName(for: request))
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.primary)
                        .lineLimit(1)
                    
                    Text("\(Int(request.width)) × \(Int(request.height))")
                        .font(.system(size: 9, weight: .regular))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // 刷新按钮（悬停时显示）
                if isHovered {
                    Button(action: {
                        triggerRefresh(instanceId: instanceId)
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.accentColor)
                    }
                    .buttonStyle(.plain)
                    .help("刷新预览")
                    .transition(.opacity)
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 8)
            
            // 分隔线
            Rectangle()
                .fill(Color.gray.opacity(0.15))
                .frame(height: 1)
            
            // 🎨 渲染视图区域
            PreviewRenderViewPage(
                instanceId: instanceId,
                pageName: request.pageName,
                data: request.pageData,
                width: request.width,
                height: request.height,
                renderCoreManager: renderCoreManager
            )
            .frame(width: widthInPoints, height: heightInPoints)
            .background(getBackgroundColor(for: request))
            .padding(.horizontal, contentPadding)
            .padding(.bottom, contentPadding)
            .id("\(instanceId)_\(request.pageName)")
        }
        .frame(width: originalCardWidth, height: originalCardHeight)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color(NSColor.windowBackgroundColor))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(
                    isHovered ? Color.accentColor.opacity(0.4) : Color.gray.opacity(0.15),
                    lineWidth: isHovered ? 1.5 : 1
                )
        )
        .shadow(
            color: Color.black.opacity(isHovered ? 0.15 : 0.08),
            radius: isHovered ? 8 : 4,
            x: 0,
            y: isHovered ? 4 : 2
        )
        .scaleEffect(scale)
        .frame(width: originalCardWidth * scale, height: originalCardHeight * scale)
        .onHover { hovering in
            withAnimation(.easeInOut(duration: 0.15)) {
                isHovered = hovering
            }
        }
    }
    
    /// 获取显示名称
    /// 规则：
    /// 1. 如果 config.name 存在，使用 name
    /// 2. 如果 config.group 存在，使用 group-name 格式
    /// 3. 否则使用 pageName
    private func getDisplayName(for request: RenderRequest) -> String {
        if let config = request.config {
            // 如果 name 存在，优先使用 name
            if let name = config.name, !name.isEmpty {
                // 如果 group 也存在，使用 group-name 格式
                if let group = config.group, !group.isEmpty {
                    return "\(group)-\(name)"
                }
                return name
            }
            // 如果只有 group，使用 group-pageName 格式
            if let group = config.group, !group.isEmpty {
                return "\(group)-\(request.pageName)"
            }
        }
        // 默认使用 pageName
        return request.pageName
    }
    
    /// 获取背景色
    /// 规则：
    /// 1. 如果 showBackground 为 true 且 backgroundColor 存在，使用 backgroundColor
    /// 2. 否则使用白色
    private func getBackgroundColor(for request: RenderRequest) -> Color {
        if let config = request.config,
           let showBackground = config.showBackground,
           showBackground,
           let backgroundColorHex = config.backgroundColor,
           !backgroundColorHex.isEmpty {
            // 将十六进制颜色字符串转换为 Color
            return colorFromHex(backgroundColorHex) ?? Color.white
        }
        // 默认使用白色
        return Color.white
    }
    
    /// 将十六进制颜色字符串转换为 SwiftUI Color
    /// 支持格式：#RRGGBB 或 #RRGGBBAA
    private func colorFromHex(_ hex: String) -> Color? {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        
        guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else {
            return nil
        }
        
        let r, g, b, a: CGFloat
        
        if hexSanitized.count == 6 {
            // #RRGGBB
            r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
            g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
            b = CGFloat(rgb & 0x0000FF) / 255.0
            a = 1.0
        } else if hexSanitized.count == 8 {
            // #RRGGBBAA
            r = CGFloat((rgb & 0xFF000000) >> 24) / 255.0
            g = CGFloat((rgb & 0x00FF0000) >> 16) / 255.0
            b = CGFloat((rgb & 0x0000FF00) >> 8) / 255.0
            a = CGFloat(rgb & 0x000000FF) / 255.0
        } else {
            return nil
        }
        
        return Color(red: r, green: g, blue: b, opacity: a)
    }
}

/// 窗口访问器 - 用于访问和设置窗口属性
struct WindowAccessor: NSViewRepresentable {
    @Binding var isAlwaysOnTop: Bool
    
    func makeNSView(context: Context) -> NSView {
        let view = NSView()
        DispatchQueue.main.async {
            if let window = view.window {
                updateWindowLevel(window)
            }
        }
        return view
    }
    
    func updateNSView(_ nsView: NSView, context: Context) {
        DispatchQueue.main.async {
            if let window = nsView.window {
                updateWindowLevel(window)
            }
        }
    }
    
    private func updateWindowLevel(_ window: NSWindow) {
        if isAlwaysOnTop {
            window.level = .floating
        } else {
            window.level = .normal
        }
    }
}

#Preview {
    PreviewContentView()
        .environmentObject(PreviewHttpServer.shared)
}


