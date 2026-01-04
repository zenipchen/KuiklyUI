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

#import "KuiklyContainerManager.h"
#import <OpenKuiklyIOSRender/KuiklyRenderViewControllerBaseDelegator.h>
#import <OpenKuiklyIOSRender/KuiklyRenderView.h>
#import <OpenKuiklyIOSRender/KRPerformanceManager.h>
#import <objc/message.h>

@interface KuiklyContainerManager () <KuiklyRenderViewControllerBaseDelegatorDelegate>

/// 渲染代理器
@property (nonatomic, strong, readwrite) KuiklyRenderViewControllerBaseDelegator *delegator;

/// 页面名称
@property (nonatomic, copy, readwrite) NSString *pageName;

/// 页面数据
@property (nonatomic, copy, readwrite) NSDictionary<NSString *, id> *pageData;

/// 代理对象（弱引用 ViewController）
@property (nonatomic, weak) id delegate;

/// 缓存的 callKotlin 调用
@property (nonatomic, strong) NSMutableArray<NSDictionary *> *pendingCallKotlinCalls;

/// 页面开始加载时间
@property (nonatomic, assign) CFTimeInterval beginTime;

/// 父视图（容器附加到的视图）
@property (nonatomic, weak, nullable) NSView *parentView;

/// 是否正在切换容器
@property (nonatomic, assign) BOOL isSwitchingContainer;

/// 旧的 delegator（用于延迟清理）
@property (nonatomic, strong, nullable) KuiklyRenderViewControllerBaseDelegator *oldDelegator;

/// 旧的 renderView（用于延迟清理）
@property (nonatomic, strong, nullable) KuiklyRenderView *oldRenderView;

@end

@implementation KuiklyContainerManager

#pragma mark - Lifecycle

- (instancetype)initWithPageName:(NSString *)pageName
                        pageData:(nullable NSDictionary<NSString *, id> *)pageData
                        delegate:(id)delegate {
    NSParameterAssert(pageName.length > 0);
    
    self = [super init];
    if (self) {
        _pageName = [pageName copy];
        _pageData = [self mergeExtendedParametersWithOriginalParameters:pageData];
        _delegate = delegate;
        _pendingCallKotlinCalls = [NSMutableArray array];
        _instanceId = [[NSUUID UUID] UUIDString];
        
        NSLog(@"[KuiklyContainerManager] ✅ 初始化: pageName=%@, instanceId=%@", pageName, _instanceId);
    }
    return self;
}

- (void)dealloc {
    [self cleanup];
    NSLog(@"[KuiklyContainerManager] 🧹 dealloc - page: %@", self.pageName);
}

#pragma mark - Public Methods

- (void)createContainerInView:(NSView *)parentView {
    NSParameterAssert(parentView != nil);
    
    NSLog(@"[KuiklyContainerManager] 🏗️ 创建 Kuikly 容器: pageName=%@", self.pageName);
    
    // 保存父视图引用
    self.parentView = parentView;
    
    // 创建 delegator
    [self setupDelegatorWithPageName:self.pageName data:self.pageData];
    
    // 通知视图已加载
    [self.delegator viewDidLoadWithView:(id)parentView];
}

- (void)switchToPageName:(NSString *)pageName
                pageData:(nullable NSDictionary<NSString *, id> *)pageData
              parentView:(NSView *)parentView {
    NSParameterAssert(pageName.length > 0);
    NSParameterAssert(parentView != nil);
    
    NSLog(@"[KuiklyContainerManager] 🔄 切换 Kuikly 容器: %@ -> %@", self.pageName, pageName);
    
    // 标记正在切换容器
    self.isSwitchingContainer = YES;
    
    // 保存父视图引用
    self.parentView = parentView;
    
    // 保存旧的 callKotlin 回调
    void (^oldCallKotlinCallback)(KuiklyRenderContextMethod, NSArray *) = self.callKotlinCallback;
    NSLog(@"[KuiklyContainerManager] 🔄 已保存旧的 callKotlinCallback: %p", oldCallKotlinCallback);
    
    // 保存旧容器引用（用于延迟清理）
    KuiklyRenderViewControllerBaseDelegator *oldDelegator = self.delegator;
    KuiklyRenderView *oldRenderView = oldDelegator ? oldDelegator.renderView : nil;
    
    if (oldDelegator) {
        self.oldDelegator = oldDelegator;
        self.oldRenderView = oldRenderView;
        NSLog(@"[KuiklyContainerManager] 🔄 已保存旧容器引用: delegator=%p, renderView=%p", oldDelegator, oldRenderView);
        
        // 保持旧容器可见（不立即清理）
        if (oldRenderView) {
            NSLog(@"[KuiklyContainerManager] 🔄 保持旧容器可见，等待新容器渲染完成");
        }
    }
    
    // 更新 pageName 和 pageData
    _pageName = [pageName copy];
    _pageData = [self mergeExtendedParametersWithOriginalParameters:pageData];
    
    // 创建新容器（但不立即清理旧容器）
    [self setupDelegatorWithPageName:pageName data:_pageData];
    NSLog(@"[KuiklyContainerManager] 🔄 创建新 delegator 完成");
    
    // 恢复 callKotlin 回调
    if (oldCallKotlinCallback) {
        self.callKotlinCallback = oldCallKotlinCallback;
    }
    
    // 设置 parentView（确保 renderViewDidCreated 回调中能访问到）
    self.parentView = parentView;
    
    // 重新初始化视图（新容器会先隐藏，等渲染完成后再显示）
    NSLog(@"[KuiklyContainerManager] 🔄 ========== 初始化新视图 ==========");
    NSLog(@"[KuiklyContainerManager] 🔄 parentView=%p, bounds=%@", parentView, NSStringFromRect(parentView.bounds));
    NSLog(@"[KuiklyContainerManager] 🔄 开始调用 viewDidLoadWithView...");
    [self.delegator viewDidLoadWithView:(id)parentView];
    NSLog(@"[KuiklyContainerManager] 🔄 viewDidLoadWithView 调用完成");
    NSLog(@"[KuiklyContainerManager] 🔄 开始调用 viewDidLayoutSubviews...");
    [self.delegator viewDidLayoutSubviews];
    NSLog(@"[KuiklyContainerManager] 🔄 viewDidLayoutSubviews 完成");
    
    [parentView setNeedsLayout:YES];
    
    NSLog(@"[KuiklyContainerManager] ✅ ========== 容器切换初始化完成，等待新容器渲染 ==========");
}

- (void)updatePageData:(NSDictionary<NSString *, id> *)pageData {
    _pageData = [self mergeExtendedParametersWithOriginalParameters:pageData];
    NSLog(@"[KuiklyContainerManager] 🔄 更新页面数据: %@", pageData);
}

- (void)applyConfig:(NSDictionary<NSString *, id> *)config {
    if (!config || config.count == 0) {
        return;
    }
    
    NSLog(@"[KuiklyContainerManager] 📋 应用配置: %@", config);
    
    // 将配置参数合并到 pageData 中
    NSMutableDictionary<NSString *, id> *updatedPageData = [self.pageData mutableCopy];
    
    // 应用 density
    if (config[@"density"]) {
        NSNumber *densityValue = config[@"density"];
        if ([densityValue isKindOfClass:[NSNumber class]]) {
            CGFloat density = [densityValue floatValue];
            updatedPageData[@"_preview_density"] = @(density);
            NSLog(@"[KuiklyContainerManager] 📋 设置 density: %.2f", density);
        }
    }
    
    // 应用 orientation
    if (config[@"orientation"]) {
        NSString *orientation = config[@"orientation"];
        updatedPageData[@"_preview_orientation"] = orientation;
        NSLog(@"[KuiklyContainerManager] 📋 设置 orientation: %@", orientation);
    }
    
    // 应用其他配置参数
    NSArray<NSString *> *configKeys = @[@"device", @"apiLevel", @"locale", @"fontScale", 
                                        @"showSystemUi", @"showBackground", @"backgroundColor",
                                        @"uiMode", @"wallpaper", @"isRound", @"chinSize",
                                        @"cutout", @"navigation"];
    for (NSString *key in configKeys) {
        if (config[key]) {
            updatedPageData[[NSString stringWithFormat:@"_preview_%@", key]] = config[key];
        }
    }
    
    _pageData = [updatedPageData copy];
    
    // 发送配置更新事件
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (renderView) {
        NSDictionary *configData = @{
            @"density": config[@"density"] ?: @(2.0),
            @"orientation": config[@"orientation"] ?: @"portrait"
        };
        [renderView sendWithEvent:@"KRConfigurationUpdateEventKey" data:configData];
        NSLog(@"[KuiklyContainerManager] ✅ 配置已应用");
    }
}

- (void)sendEvent:(NSString *)event data:(NSDictionary<NSString *, id> *)data {
    NSLog(@"[KuiklyContainerManager] 📨 发送事件: event=%@", event);
    
    if (self.delegator) {
        [self.delegator sendWithEvent:event data:data ?: @{}];
        NSLog(@"[KuiklyContainerManager] ✅ 事件已发送");
    } else {
        NSLog(@"[KuiklyContainerManager] ⚠️ delegator 为 nil，无法发送事件");
    }
}

- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args {
//    NSLog(@"[KuiklyContainerManager] 📥 handleCallNative: methodId=%ld", (long)methodId);
    
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (!renderView) {
        NSLog(@"[KuiklyContainerManager] ⚠️ renderView 为 nil");
        return nil;
    }
    
    // 通过 KVC 获取 renderCore
    id renderCore = [renderView valueForKey:@"renderCore"];
    if (!renderCore) {
        NSLog(@"[KuiklyContainerManager] ⚠️ renderCore 为 nil");
        return nil;
    }
    
    id instanceId = [renderCore valueForKey:@"instanceId"];
    if (!instanceId) {
        NSLog(@"[KuiklyContainerManager] ⚠️ instanceId 为 nil");
        return nil;
    }
    
    
    // 通过 KVC 获取 contextHandler
    id contextHandler = [renderCore valueForKey:@"contextHandler"];
    if (!contextHandler) {
        NSLog(@"[KuiklyContainerManager] ⚠️ contextHandler 为 nil");
        return nil;
    }
    
    // 调用 callNative 方法
    SEL callNativeSelector = NSSelectorFromString(@"callNativeMethodId:arg0:arg1:arg2:arg3:arg4:arg5:");
    if ([contextHandler respondsToSelector:callNativeSelector]) {
        id arg0 = args.count > 0 ? args[0] : nil;
        id arg1 = args.count > 1 ? args[1] : nil;
        id arg2 = args.count > 2 ? args[2] : nil;
        id arg3 = args.count > 3 ? args[3] : nil;
        id arg4 = args.count > 4 ? args[4] : nil;
        id arg5 = args.count > 5 ? args[5] : nil;
        
        if (arg0 != instanceId) {
            // ！！ 关键逻辑，Compose频繁切换时防止重入
            return nil;
        }
        
        
        NSMethodSignature *signature = [contextHandler methodSignatureForSelector:callNativeSelector];
        if (signature) {
            NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
            invocation.target = contextHandler;
            invocation.selector = callNativeSelector;
            
            int32_t methodIdInt32 = (int32_t)methodId;
            [invocation setArgument:&methodIdInt32 atIndex:2];
            [invocation setArgument:&arg0 atIndex:3];
            [invocation setArgument:&arg1 atIndex:4];
            [invocation setArgument:&arg2 atIndex:5];
            [invocation setArgument:&arg3 atIndex:6];
            [invocation setArgument:&arg4 atIndex:7];
            [invocation setArgument:&arg5 atIndex:8];
            
            [invocation invoke];
            
            if (signature.methodReturnLength > 0) {
                __unsafe_unretained id returnValue = nil;
                [invocation getReturnValue:&returnValue];
//                NSLog(@"[KuiklyContainerManager] ✅ callNative 成功，返回值: %@", returnValue);
                return returnValue;
            } else {
//                NSLog(@"[KuiklyContainerManager] ✅ callNative 成功（无返回值）");
                return nil;
            }
        }
    }
    
    NSLog(@"[KuiklyContainerManager] ⚠️ callNative 调用失败");
    return nil;
}

- (void)cleanup {
    NSLog(@"[KuiklyContainerManager] 🧹 ========== CLEANUP 开始 ==========");
    NSLog(@"[KuiklyContainerManager] 🧹 当前 delegator=%p, renderView=%p", self.delegator, self.delegator.renderView);
    
    // 如果正在切换容器，先清理旧容器
    if (self.isSwitchingContainer) {
        [self cleanupOldContainer];
        self.isSwitchingContainer = NO;
    }
    
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (renderView) {
        NSLog(@"[KuiklyContainerManager] 🧹 renderView 存在: frame=%@, superview=%p, subviews.count=%lu", 
              NSStringFromRect(renderView.frame), renderView.superview, (unsigned long)renderView.subviews.count);
        
        // 🔧 修复：先从父视图移除 renderView
        if (renderView.superview) {
            NSLog(@"[KuiklyContainerManager] 🧹 从父视图移除 renderView (superview=%p)", renderView.superview);
            [renderView removeFromSuperview];
            NSLog(@"[KuiklyContainerManager] 🧹 renderView 已从父视图移除, superview=%p", renderView.superview);
        } else {
            NSLog(@"[KuiklyContainerManager] ⚠️ renderView.superview 为 nil，无需移除");
        }
        
        id renderCore = [renderView valueForKey:@"renderCore"];
        if (renderCore) {
            // 使用 performSelector 避免编译器警告
            SEL willDeallocSelector = NSSelectorFromString(@"willDealloc");
            if ([renderCore respondsToSelector:willDeallocSelector]) {
                NSLog(@"[KuiklyContainerManager] 🧹 调用 renderCore.willDealloc");
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [renderCore performSelector:willDeallocSelector];
#pragma clang diagnostic pop
            }
            
            id renderLayerHandler = [renderCore valueForKey:@"renderLayerHandler"];
            if (renderLayerHandler && [renderLayerHandler respondsToSelector:willDeallocSelector]) {
                NSLog(@"[KuiklyContainerManager] 🧹 调用 renderLayerHandler.willDealloc");
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [renderLayerHandler performSelector:willDeallocSelector];
#pragma clang diagnostic pop
            }
        }
    }
    
    // 清理 delegator 引用
    if (self.delegator) {
        self.delegator.delegate = nil;
    }
    
    // 清理回调
    self.callKotlinCallback = nil;
    
    NSLog(@"[KuiklyContainerManager] 🧹 ========== CLEANUP 完成 ==========");
}

- (void)notifyViewDidLoad:(NSView *)view {
    [self.delegator viewDidLoadWithView:(id)view];
}

- (void)notifyViewDidLayoutSubviews {
    [self.delegator viewDidLayoutSubviews];
}

- (void)notifyViewWillAppear {
    [self.delegator viewWillAppear];
}

- (void)notifyViewDidAppear {
    [self.delegator viewDidAppear];
}

#pragma mark - Getter

- (KuiklyRenderView *)renderView {
    return self.delegator.renderView;
}

#pragma mark - Setter

- (void)setCallKotlinCallback:(void (^)(KuiklyRenderContextMethod, NSArray *))callKotlinCallback {
    _callKotlinCallback = [callKotlinCallback copy];
    NSLog(@"[KuiklyContainerManager] 📝 已设置 callKotlin 回调");
    
    // 执行缓存的调用
    if (callKotlinCallback && self.pendingCallKotlinCalls.count > 0) {
        NSLog(@"[KuiklyContainerManager] 🔄 执行 %lu 个缓存的调用", (unsigned long)self.pendingCallKotlinCalls.count);
        NSArray *calls = [self.pendingCallKotlinCalls copy];
        [self.pendingCallKotlinCalls removeAllObjects];
        
        for (NSDictionary *call in calls) {
            int32_t methodId = [call[@"methodId"] intValue];
            NSArray *args = call[@"args"];
            callKotlinCallback((KuiklyRenderContextMethod)methodId, args);
        }
    }
}

#pragma mark - Private Methods

- (void)setupDelegatorWithPageName:(NSString *)pageName 
                              data:(NSDictionary<NSString *, id> *)data {
    NSLog(@"[KuiklyContainerManager] 🔧 ========== 创建新 Delegator ==========");
    NSLog(@"[KuiklyContainerManager] 🔧 pageName=%@, data=%@", pageName, data);
    
    _delegator = [[KuiklyRenderViewControllerBaseDelegator alloc] 
                  initWithPageName:pageName pageData:data];
    
    NSLog(@"[KuiklyContainerManager] 🔧 delegator 创建完成: %p", _delegator);
    
    [self.delegator.performanceManager setMonitorType:KRMonitorType_ALL];
    self.delegator.delegate = self;
    
    // 🎯 关键：立即设置 callKotlinCallback（在 viewDidLoadWithView 之前）
    if (self.callKotlinCallback) {
        __weak typeof(self) weakSelf = self;
        [self.delegator setCallKotlinCallback:^(int32_t methodId, NSArray *args) {
            __strong typeof(weakSelf) strongSelf = weakSelf;
            if (!strongSelf) {
                NSLog(@"[KuiklyContainerManager] ⚠️ callKotlinCallback: self 已释放");
                return;
            }
            
//            NSLog(@"[KuiklyContainerManager] 📞 callKotlinCallback 被调用: methodId=%d, args.count=%lu", 
//                  methodId, (unsigned long)args.count);
            
            // 调用原始的 callKotlinCallback
            if (strongSelf.callKotlinCallback) {
                strongSelf.callKotlinCallback((KuiklyRenderContextMethod)methodId, args);
            } else {
                NSLog(@"[KuiklyContainerManager] ⚠️ callKotlinCallback 为 nil");
            }
        }];
        NSLog(@"[KuiklyContainerManager] ✅ callKotlinCallback 已传入 delegator");
    } else {
        NSLog(@"[KuiklyContainerManager] ⚠️ callKotlinCallback 为 nil，未设置到 delegator");
    }
    
    NSLog(@"[KuiklyContainerManager] ✅ delegator 已完全初始化");
}

- (NSDictionary<NSString *, id> *)mergeExtendedParametersWithOriginalParameters:(nullable NSDictionary<NSString *, id> *)parameters {
    NSMutableDictionary<NSString *, id> *mergedParameters = [parameters ?: @{} mutableCopy];
    mergedParameters[@"_preview_mode"] = @YES;
    mergedParameters[@"inspectionMode"] = @1;
    return [mergedParameters copy];
}

#pragma mark - KuiklyRenderViewControllerBaseDelegatorDelegate

- (NSView *)createLoadingView {
    // 转发给 delegate (ViewController)
    if ([self.delegate respondsToSelector:@selector(createLoadingView)]) {
        return [self.delegate createLoadingView];
    }
    
    // 默认实现
    NSView *loadingView = [[NSView alloc] initWithFrame:NSZeroRect];
    loadingView.wantsLayer = YES;
    loadingView.layer.backgroundColor = NSColor.windowBackgroundColor.CGColor;
    
    NSProgressIndicator *indicator = [[NSProgressIndicator alloc] initWithFrame:CGRectMake(0, 0, 32, 32)];
    indicator.style = NSProgressIndicatorStyleSpinning;
    indicator.translatesAutoresizingMaskIntoConstraints = NO;
    [indicator startAnimation:nil];
    [loadingView addSubview:indicator];
    
    [NSLayoutConstraint activateConstraints:@[
        [indicator.centerXAnchor constraintEqualToAnchor:loadingView.centerXAnchor],
        [indicator.centerYAnchor constraintEqualToAnchor:loadingView.centerYAnchor]
    ]];
    
    return loadingView;
}

- (NSView *)createErrorView {
    // 转发给 delegate (ViewController)
    if ([self.delegate respondsToSelector:@selector(createErrorView)]) {
        return [self.delegate createErrorView];
    }
    
    // 默认实现
    NSView *errorView = [[NSView alloc] initWithFrame:NSZeroRect];
    errorView.wantsLayer = YES;
    errorView.layer.backgroundColor = NSColor.windowBackgroundColor.CGColor;
    
    NSTextField *errorLabel = [NSTextField labelWithString:@"加载失败"];
    errorLabel.translatesAutoresizingMaskIntoConstraints = NO;
    errorLabel.textColor = NSColor.redColor;
    errorLabel.font = [NSFont systemFontOfSize:16.0];
    errorLabel.alignment = NSTextAlignmentCenter;
    [errorView addSubview:errorLabel];
    
    [NSLayoutConstraint activateConstraints:@[
        [errorLabel.centerXAnchor constraintEqualToAnchor:errorView.centerXAnchor],
        [errorLabel.centerYAnchor constraintEqualToAnchor:errorView.centerYAnchor]
    ]];
    
    return errorView;
}

- (void)fetchContextCodeWithPageName:(NSString *)pageName 
                      resultCallback:(KuiklyContextCodeCallback)callback {
    NSLog(@"[KuiklyContainerManager] 🔍 fetchContextCode: pageName=%@", pageName);
    
    // 转发给 delegate (ViewController)
    if ([self.delegate respondsToSelector:@selector(fetchContextCodeWithPageName:resultCallback:)]) {
        [self.delegate fetchContextCodeWithPageName:pageName resultCallback:callback];
        return;
    }
    
    // 默认实现：返回 "shared"
    if (callback != nil) {
        callback(@"shared", nil);
    }
}

- (void)contentViewDidLoad {
    CFTimeInterval loadDuration = (CFAbsoluteTimeGetCurrent() - self.beginTime) * 1000.0;
    NSLog(@"[KuiklyContainerManager] ✅ 页面加载完成，耗时: %.2f ms", loadDuration);
    
    // 转发给 delegate
    if ([self.delegate respondsToSelector:@selector(contentViewDidLoad)]) {
        [self.delegate contentViewDidLoad];
    }
}

- (void)renderViewDidCreated {
    self.beginTime = CFAbsoluteTimeGetCurrent();
    NSLog(@"[KuiklyContainerManager] 🎬 renderViewDidCreated");
    
    // 确保 renderView 被添加到视图层级
    KuiklyRenderView *renderView = self.delegator.renderView;
    if (!renderView) {
        NSLog(@"[KuiklyContainerManager] ⚠️ renderView 为 nil");
        return;
    }
    
    if (!self.parentView) {
        NSLog(@"[KuiklyContainerManager] ⚠️ parentView 为 nil，无法添加到视图层级");
        return;
    }
    
    // 如果正在切换容器，新容器先隐藏
    BOOL shouldHideNewContainer = self.isSwitchingContainer && self.oldRenderView != nil;
    
    // 启用 layer-backed 渲染，避免闪烁
    renderView.wantsLayer = YES;
    
    // 如果正在切换，在添加到视图层级之前就设置隐藏，避免短暂可见
    if (shouldHideNewContainer) {
        renderView.hidden = YES;
        NSLog(@"[KuiklyContainerManager] 🔄 新容器在添加前已隐藏，等待渲染完成");
    }
    
    // 如果 renderView 不在视图层级中，手动添加
    if (!renderView.superview) {
        NSLog(@"[KuiklyContainerManager] ➕ 将 renderView 添加到视图层级 (parentView=%p)", self.parentView);
        
        // 如果正在切换，将新容器添加到旧容器后面，避免影响旧容器的布局
        if (shouldHideNewContainer && self.oldRenderView && self.oldRenderView.superview == self.parentView) {
            // 找到旧容器在 subviews 中的位置，将新容器插入到它后面
            NSArray *subviews = self.parentView.subviews;
            NSUInteger oldIndex = [subviews indexOfObject:self.oldRenderView];
            if (oldIndex != NSNotFound && oldIndex + 1 < subviews.count) {
                NSView *relativeView = subviews[oldIndex + 1];
                [self.parentView addSubview:renderView positioned:NSWindowBelow relativeTo:relativeView];
            } else {
                // 如果旧容器是最后一个，直接添加到后面
                [self.parentView addSubview:renderView positioned:NSWindowBelow relativeTo:self.oldRenderView];
            }
            NSLog(@"[KuiklyContainerManager] 🔄 新容器已添加到旧容器后面");
        } else {
            [self.parentView addSubview:renderView];
        }
        
        // 确保新容器的 frame 和旧容器完全一致，避免位置跳变
        if (shouldHideNewContainer && self.oldRenderView) {
            renderView.frame = self.oldRenderView.frame;
        } else {
            renderView.frame = self.parentView.bounds;
        }
        renderView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
        
        NSLog(@"[KuiklyContainerManager] ✅ renderView 已添加到视图层级 (superview: %p, hidden: %d, frame: %@)", 
              (__bridge void *)renderView.superview, renderView.hidden, NSStringFromRect(renderView.frame));
    } else {
        NSLog(@"[KuiklyContainerManager] ✅ renderView 已在视图层级中 (superview: %p)", (__bridge void *)renderView.superview);
        // 确保在最前面并更新 frame
        if (renderView.superview != self.parentView) {
            [renderView removeFromSuperview];
            [self.parentView addSubview:renderView];
        }
        // 确保 frame 一致
        if (shouldHideNewContainer && self.oldRenderView) {
            renderView.frame = self.oldRenderView.frame;
        } else {
            renderView.frame = self.parentView.bounds;
        }
        renderView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
    }
    
    // 如果不在切换状态，直接显示
    if (!shouldHideNewContainer) {
        renderView.hidden = NO;
        self.parentView.hidden = NO;
        NSLog(@"[KuiklyContainerManager] ✅ renderView 和容器视图已设置为可见");
    }
    
    // 强制刷新视图
    [renderView setNeedsDisplay:YES];
    [renderView setNeedsLayout:YES];
    [self.parentView setNeedsDisplay:YES];
    [self.parentView setNeedsLayout:YES];
    
    // 重要：renderView 创建后，需要通知 delegator 当前视图大小
    [self.delegator viewDidLayoutSubviews];
    
    // 发送大小改变事件到 Kuikly 渲染核心（确保新创建的 renderView 知道当前大小）
    NSDictionary *sizeData = @{
        @"width": @(self.parentView.frame.size.width),
        @"height": @(self.parentView.frame.size.height)
    };
    [renderView sendWithEvent:@"KRRootViewSizeDidChangedEventKey" data:sizeData];
    NSLog(@"[KuiklyContainerManager] 📐 已通知 renderView 当前视图大小: %.0fx%.0f", 
          self.parentView.frame.size.width, self.parentView.frame.size.height);
    
    // 如果正在切换容器，等待新容器渲染完成后再切换显示
    // 切换会在 contentViewDidLoad 回调中执行
    if (shouldHideNewContainer) {
        NSLog(@"[KuiklyContainerManager] 🔄 新容器已创建但隐藏，等待页面加载完成...");
    } else {
        // 转发给 delegate
        if ([self.delegate respondsToSelector:@selector(renderViewDidCreated)]) {
            [self.delegate renderViewDidCreated];
        }
    }
}

/// 在新容器渲染完成后执行容器切换
- (void)performContainerSwitchAfterRenderComplete {
    // 防止重复调用
    if (!self.isSwitchingContainer) {
        NSLog(@"[KuiklyContainerManager] ⚠️ 不在切换状态，忽略切换请求");
        return;
    }
    
    NSLog(@"[KuiklyContainerManager] 🔄 ========== 执行容器切换 ==========");
    
    KuiklyRenderView *newRenderView = self.delegator.renderView;
    if (!newRenderView) {
        NSLog(@"[KuiklyContainerManager] ⚠️ 新 renderView 为 nil，无法切换");
        self.isSwitchingContainer = NO;
        return;
    }
    
    // 确保新容器的 frame 和旧容器完全一致，避免位置跳变
    if (self.oldRenderView) {
        NSRect oldFrame = self.oldRenderView.frame;
        if (!NSEqualRects(newRenderView.frame, oldFrame)) {
            NSLog(@"[KuiklyContainerManager] 🔄 调整新容器 frame 以匹配旧容器: %@ -> %@", 
                  NSStringFromRect(newRenderView.frame), NSStringFromRect(oldFrame));
            newRenderView.frame = oldFrame;
        }
    }
    
    // 使用 CATransaction 批量更新，避免中间状态可见（减少闪烁）
    [CATransaction begin];
    [CATransaction setDisableActions:YES]; // 禁用动画，立即切换
    [CATransaction setCompletionBlock:^{
        // 切换完成后，确保新容器使用正确的 bounds
        dispatch_async(dispatch_get_main_queue(), ^{
            if (!NSEqualRects(newRenderView.frame, self.parentView.bounds)) {
                newRenderView.frame = self.parentView.bounds;
            }
        });
    }];
    
    // 先隐藏旧容器
    if (self.oldRenderView) {
        NSLog(@"[KuiklyContainerManager] 🔄 隐藏旧容器 (frame: %@)", NSStringFromRect(self.oldRenderView.frame));
        self.oldRenderView.hidden = YES;
    }
    
    // 再显示新容器（确保旧容器先隐藏，避免同时可见）
    newRenderView.hidden = NO;
    self.parentView.hidden = NO;
    
    [CATransaction commit];
    
    NSLog(@"[KuiklyContainerManager] ✅ 新容器已显示，旧容器已隐藏 (新容器 frame: %@)", NSStringFromRect(newRenderView.frame));
    
    // 标记切换完成（在清理前标记，避免重复调用）
    self.isSwitchingContainer = NO;
    
    // 延迟清理旧容器（给新容器时间完全显示，避免闪烁）
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self cleanupOldContainer];
    });
    
    // 转发给 delegate（如果之前没有转发过）
    if ([self.delegate respondsToSelector:@selector(renderViewDidCreated)]) {
        [self.delegate renderViewDidCreated];
    }
    
    NSLog(@"[KuiklyContainerManager] ✅ ========== 容器切换完成 ==========");
}

/// 清理旧容器
- (void)cleanupOldContainer {
    NSLog(@"[KuiklyContainerManager] 🧹 ========== 清理旧容器 ==========");
    
    if (self.oldRenderView) {
        // 从父视图移除旧 renderView
        if (self.oldRenderView.superview) {
            NSLog(@"[KuiklyContainerManager] 🧹 从父视图移除旧 renderView");
            [self.oldRenderView removeFromSuperview];
        }
        
        // 清理旧 renderCore
        id renderCore = [self.oldRenderView valueForKey:@"renderCore"];
        if (renderCore) {
            SEL willDeallocSelector = NSSelectorFromString(@"willDealloc");
            if ([renderCore respondsToSelector:willDeallocSelector]) {
                NSLog(@"[KuiklyContainerManager] 🧹 调用旧 renderCore.willDealloc");
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [renderCore performSelector:willDeallocSelector];
#pragma clang diagnostic pop
            }
            
            id renderLayerHandler = [renderCore valueForKey:@"renderLayerHandler"];
            if (renderLayerHandler && [renderLayerHandler respondsToSelector:willDeallocSelector]) {
                NSLog(@"[KuiklyContainerManager] 🧹 调用旧 renderLayerHandler.willDealloc");
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [renderLayerHandler performSelector:willDeallocSelector];
#pragma clang diagnostic pop
            }
        }
        
        self.oldRenderView = nil;
    }
    
    // 清理旧 delegator 引用
    if (self.oldDelegator) {
        self.oldDelegator.delegate = nil;
        self.oldDelegator = nil;
    }
    
    NSLog(@"[KuiklyContainerManager] ✅ ========== 旧容器清理完成 ==========");
}


- (void)onUnhandledException:(NSString *)exReason 
                       stack:(NSString *)callstackStr 
                        mode:(KuiklyContextMode)mode {
    NSLog(@"[KuiklyContainerManager] ❌ 未处理异常: %@", exReason);
    
    // 转发给 delegate
    if ([self.delegate respondsToSelector:@selector(onUnhandledException:stack:mode:)]) {
        [self.delegate onUnhandledException:exReason stack:callstackStr mode:mode];
    }
}

- (void)onPageLoadComplete:(BOOL)isSucceed 
                     error:(nullable NSError *)error 
                      mode:(KuiklyContextMode)mode {
    if (error != nil) {
        NSLog(@"[KuiklyContainerManager] ❌ 页面加载失败: %@", error.localizedDescription);
    } else {
        NSLog(@"[KuiklyContainerManager] ✅ 页面加载成功（首帧渲染完成）");
    }
    
    // 如果正在切换容器，且新容器首帧渲染完成（isSucceed == YES），延迟5000ms后执行切换
    if (self.isSwitchingContainer && isSucceed && self.delegator && self.delegator.renderView) {
        NSLog(@"[KuiklyContainerManager] 🔄 新容器首帧渲染完成（onFirstFramePaint），延迟5000ms后执行切换");
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self performContainerSwitchAfterRenderComplete];
        });
    }
    
    // 转发给 delegate
    if ([self.delegate respondsToSelector:@selector(onPageLoadComplete:error:mode:)]) {
        [self.delegate onPageLoadComplete:isSucceed error:error mode:mode];
    }
}

- (NSDictionary<NSString *, NSObject *> *)contextPageData {
    // 转发给 delegate
    if ([self.delegate respondsToSelector:@selector(contextPageData)]) {
        return [self.delegate contextPageData];
    }
    
    // 默认实现
    return @{
        @"appId": @"preview",
        @"sysLang": NSLocale.preferredLanguages.firstObject ?: @"en",
        @"platform": @"macOS-Preview",
        @"previewMode": @YES
    };
}

- (NSString *)turboDisplayKey {
    return nil; // 预览模式禁用 TurboDisplay
}

@end
