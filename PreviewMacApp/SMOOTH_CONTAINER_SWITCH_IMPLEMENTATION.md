# 平滑容器切换实现说明

## 🎯 优化目标

实现平滑的容器切换，避免切换时的空白闪烁，提升用户体验。

## 📋 实现方案

### 核心思路

1. **保留旧容器显示**：切换时先不清理旧容器，保持其可见
2. **创建新容器但隐藏**：新容器创建后先隐藏，在后台渲染
3. **等待新容器渲染完成**：通过 `contentViewDidLoad` 回调判断新容器是否渲染完成
4. **切换显示**：新容器渲染完成后，显示新容器，隐藏旧容器
5. **延迟清理旧容器**：延迟 0.15 秒后清理旧容器，确保新容器完全显示

## 🔧 实现细节

### 1. 新增属性

在 `KuiklyContainerManager` 的私有接口中添加：

```objective-c
/// 是否正在切换容器
@property (nonatomic, assign) BOOL isSwitchingContainer;

/// 旧的 delegator（用于延迟清理）
@property (nonatomic, strong, nullable) KuiklyRenderViewControllerBaseDelegator *oldDelegator;

/// 旧的 renderView（用于延迟清理）
@property (nonatomic, strong, nullable) KuiklyRenderView *oldRenderView;
```

### 2. 优化 switchToPageName 方法

**改动前**：
- 立即清理旧容器
- 创建新容器并立即显示

**改动后**：
- 保存旧容器引用（不立即清理）
- 标记正在切换状态
- 创建新容器（会在 `renderViewDidCreated` 中隐藏）

### 3. 优化 renderViewDidCreated 方法

**改动前**：
- 新容器创建后立即显示

**改动后**：
- 如果正在切换容器，新容器先隐藏
- 等待 `contentViewDidLoad` 回调后再切换显示

### 4. 优化 contentViewDidLoad 方法

**新增功能**：
- 检测到新容器页面加载完成时，执行容器切换
- 调用 `performContainerSwitchAfterRenderComplete` 方法

### 5. 新增 performContainerSwitchAfterRenderComplete 方法

**功能**：
- 显示新容器
- 隐藏旧容器
- 延迟清理旧容器（0.15 秒后）
- 标记切换完成

### 6. 新增 cleanupOldContainer 方法

**功能**：
- 从父视图移除旧 renderView
- 调用旧 renderCore 的 `willDealloc`
- 清理旧 delegator 引用

## 📊 性能优势

### 1. **避免空白闪烁**
- ✅ 旧容器保持显示，直到新容器准备好
- ✅ 用户看不到空白页面

### 2. **平滑过渡**
- ✅ 新容器在后台渲染，不影响用户体验
- ✅ 切换瞬间完成，无延迟感

### 3. **资源管理优化**
- ✅ 延迟清理旧容器，避免过早释放
- ✅ 给新容器时间完全显示

## 🔄 切换流程

```
1. switchToPageName 被调用
   ├─ 保存旧容器引用
   ├─ 标记 isSwitchingContainer = YES
   └─ 创建新容器

2. renderViewDidCreated 被调用
   ├─ 新容器添加到视图层级
   └─ 新容器隐藏（hidden = YES）

3. 新容器在后台渲染
   └─ 旧容器继续显示

4. contentViewDidLoad 被调用（新容器渲染完成）
   └─ 调用 performContainerSwitchAfterRenderComplete

5. performContainerSwitchAfterRenderComplete
   ├─ 显示新容器（hidden = NO）
   ├─ 隐藏旧容器（hidden = YES）
   ├─ 标记 isSwitchingContainer = NO
   └─ 延迟 0.15 秒后清理旧容器

6. cleanupOldContainer（0.15 秒后）
   ├─ 从父视图移除旧 renderView
   ├─ 调用旧 renderCore.willDealloc
   └─ 清理旧 delegator 引用
```

## ⚠️ 注意事项

### 1. **内存管理**
- 旧容器引用会在延迟清理时释放
- 确保不会造成内存泄漏

### 2. **异常处理**
- 如果新容器创建失败，需要清理旧容器引用
- 如果切换过程中发生异常，需要重置状态

### 3. **并发控制**
- `performContainerSwitchAfterRenderComplete` 有防重复调用保护
- 通过 `isSwitchingContainer` 标志控制

### 4. **延迟时间**
- 当前设置为 0.15 秒，可根据实际情况调整
- 太短可能导致闪烁，太长可能影响内存

## 🚀 后续优化建议

### 1. **可配置的延迟时间**
```objective-c
@property (nonatomic, assign) NSTimeInterval containerSwitchDelay;
```

### 2. **切换动画**
- 可以添加淡入淡出动画
- 提升视觉体验

### 3. **超时保护**
- 如果新容器长时间未加载完成，强制切换
- 避免旧容器一直显示

### 4. **性能监控**
- 记录切换耗时
- 监控切换成功率

## 📝 测试建议

1. **正常切换测试**
   - 验证切换是否平滑
   - 验证是否有空白闪烁

2. **快速切换测试**
   - 快速连续切换多个容器
   - 验证是否有资源泄漏

3. **异常情况测试**
   - 新容器创建失败
   - 新容器加载超时

4. **内存测试**
   - 长时间运行后检查内存
   - 验证是否有内存泄漏

## ✅ 预期效果

实施此优化后：
- **用户体验**：消除切换时的空白闪烁
- **视觉体验**：平滑的容器切换
- **性能**：不影响切换性能，甚至可能提升（避免不必要的重绘）













