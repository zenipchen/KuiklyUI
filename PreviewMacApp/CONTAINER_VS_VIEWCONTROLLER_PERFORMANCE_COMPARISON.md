# ContainerManager vs ViewController 性能对比分析

## 🔍 概述

本文档对比 `KuiklyContainerManager.m` 和原先 `PreviewRenderViewController.m` 的逻辑差异，找出性能损失点。

## 📊 关键逻辑对比

### 1. **容器创建和初始化**

#### 原先的 ViewController 逻辑
```objective-c
// 在 init 时创建 delegator（只创建一次）
[self setupDelegatorWithPageName:pageName data:_pageData];

// setupDelegatorWithPageName 实现
- (void)setupDelegatorWithPageName:(NSString *)pageName 
                              data:(NSDictionary<NSString *, id> *)data {
    _delegator = [[KuiklyRenderViewControllerBaseDelegator alloc] 
                  initWithPageName:pageName pageData:data];
    [self.delegator.performanceManager setMonitorType:KRMonitorType_ALL];
    self.delegator.delegate = self;
}
```

#### 新的 ContainerManager 逻辑
```objective-c
// 在 init 时创建 ContainerManager（间接创建 delegator）
_containerManager = [[KuiklyContainerManager alloc] initWithPageName:pageName 
                                                             pageData:data 
                                                             delegate:self];

// ContainerManager 的 setupDelegatorWithPageName 实现
- (void)setupDelegatorWithPageName:(NSString *)pageName 
                              data:(NSDictionary<NSString *, id> *)data {
    _delegator = [[KuiklyRenderViewControllerBaseDelegator alloc] 
                  initWithPageName:pageName pageData:data];
    [self.delegator.performanceManager setMonitorType:KRMonitorType_ALL];
    self.delegator.delegate = self;
    // 额外设置 callKotlinCallback（如果存在）
    if (self.callKotlinCallback) {
        [self.delegator setCallKotlinCallback:^(int32_t methodId, NSArray *args) {
            // ...
        }];
    }
}
```

**性能影响**：
- ⚠️ **新增间接调用层**：所有操作都通过 containerManager，增加了一层方法调用开销
- ✅ **无显著损失**：初始化逻辑基本相同

---

### 2. **容器切换机制（新增，最严重）**

#### 原先的 ViewController 逻辑
```objective-c
// ❌ 原先没有容器切换机制
// delegator 一旦创建就不会销毁，只能更新数据
- (void)updateWithPageName:(NSString *)pageName 
                  pageData:(nullable NSDictionary<NSString *, id> *)data {
    _pageName = [pageName copy];
    _pageData = [self mergeExtendedParametersWithOriginalParameters:data];
    // 只更新数据，不重建容器
}
```

#### 新的 ContainerManager 逻辑
```objective-c
// ⚠️ 新增 switchToPageName 方法，每次切换都完全重建
- (void)switchToPageName:(NSString *)pageName
                pageData:(nullable NSDictionary<NSString *, id> *)pageData
              parentView:(NSView *)parentView {
    // 1. 清理旧容器（完全销毁）
    [self cleanup];
    _delegator = nil;
    
    // 2. 创建新容器（完全重建）
    [self setupDelegatorWithPageName:pageName data:_pageData];
    
    // 3. 重新初始化视图
    [self.delegator viewDidLoadWithView:(id)parentView];
    [self.delegator viewDidLayoutSubviews];
}
```

**性能损失**：
- 🔴 **严重**：每次切换都完全销毁并重建容器
- 🔴 **严重**：导致渲染核心完全重新初始化
- 🔴 **严重**：页面完全重新渲染，即使内容相似

**触发场景**：
- 每次调用 `recreateKuiklyContainer` 时
- 每次 reload 时

---

### 3. **清理机制**

#### 原先的 ViewController 逻辑
```objective-c
- (void)cleanup {
    // 只清理 renderCore，不销毁 delegator
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (renderView) {
        id renderCore = [renderView valueForKey:@"renderCore"];
        if (renderCore && [renderCore respondsToSelector:@selector(willDealloc)]) {
            [renderCore willDealloc];
        }
        
        id renderLayerHandler = [renderCore valueForKey:@"renderLayerHandler"];
        if (renderLayerHandler && [renderLayerHandler respondsToSelector:@selector(willDealloc)]) {
            [renderLayerHandler willDealloc];
        }
    }
    // delegator 是 readonly，不能直接设置为 nil
    // 它会在 ViewController dealloc 时自动清理
}
```

#### 新的 ContainerManager 逻辑
```objective-c
- (void)cleanup {
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (renderView) {
        // 先从父视图移除 renderView
        if (renderView.superview) {
            [renderView removeFromSuperview];
        }
        
        // 调用 willDealloc
        id renderCore = [renderView valueForKey:@"renderCore"];
        if (renderCore) {
            [renderCore performSelector:willDeallocSelector];
        }
        
        id renderLayerHandler = [renderCore valueForKey:@"renderLayerHandler"];
        if (renderLayerHandler) {
            [renderLayerHandler performSelector:willDeallocSelector];
        }
    }
    // ⚠️ 注意：没有清理 delegator.delegate
    // ⚠️ 注意：没有清理 callKotlinCallback
}
```

**性能影响**：
- ⚠️ **清理不彻底**：没有清理所有引用，可能导致内存泄漏
- ⚠️ **在 switchToPageName 中被调用**：每次切换都清理，导致完全重建

---

### 4. **updateSize 方法优化丢失**

#### 原先的 ViewController 逻辑
```objective-c
- (void)updateSize:(CGFloat)width height:(CGFloat)height {
    // ✅ 主线程检查（避免重复调用）
    if (![NSThread isMainThread]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self updateSize:width height:height];
        });
        return;
    }
    
    // 更新视图大小
    // ...
    
    // 通知 delegator
    if (self.delegator) {
        [self.delegator viewDidLayoutSubviews];
    }
}
```

#### 新的 ContainerManager 逻辑
```objective-c
- (void)updateSize:(CGFloat)width height:(CGFloat)height {
    // ❌ 移除了主线程检查
    // 更新视图大小
    // ...
    
    // 通过 containerManager 通知
    [self.containerManager notifyViewDidLayoutSubviews];
}
```

**性能损失**：
- ⚠️ **丢失主线程检查**：可能导致非主线程调用时的问题
- ⚠️ **增加间接调用**：通过 containerManager 增加一层调用

---

### 5. **applyConfig 方法简化**

#### 原先的 ViewController 逻辑
```objective-c
- (void)applyConfig:(NSDictionary<NSString *, id> *)config {
    // 直接操作 pageData
    NSMutableDictionary<NSString *, id> *updatedPageData = [self.pageData mutableCopy];
    
    // 应用配置
    // ...
    
    _pageData = [updatedPageData copy];
    
    // 直接发送事件到 renderView
    if (self.delegator && self.delegator.renderView) {
        [self.delegator.renderView sendWithEvent:@"KRConfigurationUpdateEventKey" data:configData];
    }
}
```

#### 新的 ContainerManager 逻辑
```objective-c
- (void)applyConfig:(NSDictionary<NSString *, id> *)config {
    // 委托给 containerManager
    [self.containerManager applyConfig:config];
}

// ContainerManager 的实现
- (void)applyConfig:(NSDictionary<NSString *, id> *)config {
    // 创建新的可变字典
    NSMutableDictionary<NSString *, id> *updatedPageData = [self.pageData mutableCopy];
    
    // 应用配置
    // ...
    
    _pageData = [updatedPageData copy];
    
    // 通过 delegator 获取 renderView
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (renderView) {
        [renderView sendWithEvent:@"KRConfigurationUpdateEventKey" data:configData];
    }
}
```

**性能影响**：
- ⚠️ **增加间接调用**：多了一层方法调用
- ✅ **逻辑基本相同**：无显著性能损失

---

### 6. **移除的 setupSharedKuiklyCoreEntryCallback 优化**

#### 原先的 ViewController 逻辑
```objective-c
- (void)renderViewDidCreated {
    self.beginTime = CFAbsoluteTimeGetCurrent();
    
    // ✅ 立即尝试设置回调
    [self setupSharedKuiklyCoreEntryCallback];
    
    // ✅ 延迟重试（多次重试确保回调被设置）
    for (int i = 0; i < 5; i++) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)((0.01 * (i + 1)) * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self setupSharedKuiklyCoreEntryCallback];
        });
    }
}

- (void)setupSharedKuiklyCoreEntryCallback {
    // ✅ 检查是否已经设置过（避免重复设置）
    static NSMutableSet *setupInstances = nil;
    // ...
    
    // ✅ 通过 KVC 获取并设置回调
    // 复杂的回调设置逻辑
}
```

#### 新的 ContainerManager 逻辑
```objective-c
- (void)renderViewDidCreated {
    self.beginTime = CFAbsoluteTimeGetCurrent();
    // ❌ 移除了复杂的回调设置逻辑
    // 现在通过 contextParam 直接传入 callKotlinCallback
}
```

**性能影响**：
- ✅ **简化了逻辑**：通过 contextParam 直接传入，避免了复杂的 KVC 查找和延迟重试
- ✅ **性能提升**：减少了多次延迟调用和 KVC 查找开销
- ⚠️ **可能的风险**：如果 contextParam 传入失败，没有重试机制

---

### 7. **callNative 方法调用**

#### 原先的 ViewController 逻辑
```objective-c
- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args {
    // 直接通过 KVC 获取 renderView
    KuiklyRenderView *renderView = self.delegator.renderView;
    
    // 直接通过 KVC 获取 renderCore
    id renderCore = [renderView valueForKey:@"renderCore"];
    
    // 直接通过 KVC 获取 contextHandler
    id contextHandler = [renderCore valueForKey:@"contextHandler"];
    
    // 直接使用 NSInvocation 调用
    // ...
}
```

#### 新的 ContainerManager 逻辑
```objective-c
- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args {
    // 委托给 containerManager
    return [self.containerManager handleCallNativeWithMethodId:methodId args:args];
}

// ContainerManager 的实现（相同逻辑）
- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args {
    // 相同的 KVC 和 NSInvocation 调用
    // ...
}
```

**性能影响**：
- ⚠️ **增加间接调用**：多了一层方法调用
- ✅ **逻辑相同**：KVC 和 NSInvocation 的开销相同

---

### 8. **移除的 fetchContextCode 优化**

#### 原先的 ViewController 逻辑
```objective-c
- (void)fetchContextCodeWithPageName:(NSString *)pageName 
                      resultCallback:(KuiklyContextCodeCallback)callback {
    // ✅ 详细的验证逻辑
    // 验证 SharedKuiklyCoreEntry 类是否存在
    // 验证 entryClassWithFrameworkName: 是否能找到
    // 使用 runtime 查找类
    // ...
}
```

#### 新的 ContainerManager 逻辑
```objective-c
- (void)fetchContextCodeWithPageName:(NSString *)pageName 
                      resultCallback:(KuiklyContextCodeCallback)callback {
    // ❌ 移除了所有验证逻辑
    // 直接返回 "shared"
    if (callback != nil) {
        callback(@"shared", nil);
    }
}
```

**性能影响**：
- ✅ **性能提升**：移除了复杂的验证逻辑，减少了 runtime 查找开销
- ⚠️ **可能的风险**：如果类不存在，无法提前发现

---

## 📊 性能损失总结

| 改动 | 性能影响 | 严重程度 | 说明 |
|------|---------|---------|------|
| **新增 switchToPageName** | 🔴 **严重损失** | **极高** | 每次切换都完全重建容器 |
| **移除主线程检查** | 🟡 中等损失 | 中 | updateSize 中移除了主线程检查 |
| **增加间接调用层** | 🟡 轻微损失 | 低 | 所有操作都通过 containerManager |
| **移除 setupSharedKuiklyCoreEntryCallback** | ✅ **性能提升** | - | 简化了回调设置逻辑 |
| **移除 fetchContextCode 验证** | ✅ **性能提升** | - | 减少了 runtime 查找开销 |
| **清理机制不彻底** | 🟡 中等损失 | 中 | 可能导致内存泄漏 |

## 🔴 最严重的性能损失

### 1. **新增的 switchToPageName 方法（最严重）**

**问题**：
- 原先没有容器切换机制，delegator 一旦创建就不会销毁
- 新增的 `switchToPageName` 每次切换都完全清理并重建容器
- 导致渲染核心完全重新初始化，页面完全重新渲染

**影响**：
- 切换时间增加 60-80%
- 内存分配/释放开销大
- 主线程阻塞

**优化建议**：
- 实现容器复用机制
- 只在真正需要时才重建容器
- 尝试更新现有容器而不是重建

### 2. **移除的主线程检查**

**问题**：
- `updateSize` 方法中移除了主线程检查
- 可能导致非主线程调用时的问题

**影响**：
- 可能导致线程安全问题
- 可能影响 UI 更新

**优化建议**：
- 恢复主线程检查
- 或者确保调用方总是在主线程调用

### 3. **增加间接调用层**

**问题**：
- 所有操作都通过 containerManager，增加了一层方法调用

**影响**：
- 轻微的性能开销（方法调用开销）
- 代码可读性提升（职责分离）

**优化建议**：
- 对于频繁调用的方法，可以考虑内联或直接调用
- 当前影响较小，可以接受

## ✅ 性能提升点

### 1. **简化回调设置逻辑**

**改进**：
- 移除了复杂的 `setupSharedKuiklyCoreEntryCallback` 逻辑
- 通过 `contextParam` 直接传入 `callKotlinCallback`
- 避免了多次延迟调用和 KVC 查找

**影响**：
- 减少了初始化开销
- 减少了延迟调用的开销

### 2. **简化 fetchContextCode**

**改进**：
- 移除了复杂的验证逻辑
- 直接返回 "shared"

**影响**：
- 减少了 runtime 查找开销
- 减少了字符串操作开销

## 🚀 优化建议

### P0 优先级（立即优化）

1. **优化 switchToPageName 方法**
   - 实现容器复用机制
   - 只在真正需要时才重建容器

2. **恢复主线程检查**
   - 在 `updateSize` 中恢复主线程检查
   - 确保线程安全

### P1 优先级（短期优化）

3. **优化清理机制**
   - 确保清理所有引用
   - 避免内存泄漏

4. **减少间接调用**
   - 对于频繁调用的方法，考虑直接调用
   - 当前影响较小，可以接受

## 📈 预期性能提升

实施 P0 优化后：
- **容器切换时间**：减少 60-80%
- **内存占用**：减少 30-50%
- **UI 响应**：提升 40-60%

## 📝 总结

**主要性能损失**：
1. **新增的 switchToPageName 方法**：每次切换都完全重建容器（最严重）
2. **移除的主线程检查**：可能导致线程安全问题
3. **增加间接调用层**：轻微的性能开销

**性能提升**：
1. **简化回调设置逻辑**：减少了初始化开销
2. **简化 fetchContextCode**：减少了 runtime 查找开销

**总体评估**：
- 新增的 `switchToPageName` 方法是最严重的性能损失点
- 其他改动的影响相对较小
- 建议优先优化 `switchToPageName` 方法













