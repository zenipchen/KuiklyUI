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

#import "PreviewRenderViewController.h"
#import "PreviewKotlinCoreEntry.h"
#import "KuiklyContainerManager.h"
#import <OpenKuiklyIOSRender/KuiklyRenderViewControllerBaseDelegator.h>
#import <OpenKuiklyIOSRender/KuiklyRenderContextProtocol.h>
#import <OpenKuiklyIOSRender/KuiklyRenderCore.h>
#import <OpenKuiklyIOSRender/KRPerformanceDataProtocol.h>
#import <OpenKuiklyIOSRender/KRPerformanceManager.h>
#import <OpenKuiklyIOSRender/KRConvertUtil.h>
#import <OpenKuiklyIOSRender/KRRouterModule.h>
#import <OpenKuiklyIOSRender/KuiklyRenderView.h>
#import <objc/message.h>

#pragma mark - PreviewRouterHandler

@interface PreviewRouterHandler : NSObject <KRRouterProtocol>
@end

@implementation PreviewRouterHandler

- (void)openPageWithName:(NSString *)pageName
                pageData:(NSDictionary * _Nullable)pageData
              controller:(UIViewController *)controller {
    NSLog(@"[PreviewRouter] 🚀 打开页面: %@, 参数: %@", pageName, pageData);
    // 在预览模式下，我们只打印日志，不实际导航
    // TODO: 可以通过 HTTP 通知 JVM 端打开新的预览窗口
}

- (void)closePage:(UIViewController *)controller {
    NSLog(@"[PreviewRouter] 🚪 关闭页面");
    // 在预览模式下，不实际关闭
}

@end

#pragma mark - Constants

/// 默认的framework名称
static NSString * const kDefaultFrameworkName = @"shared";
/// 默认应用ID
static NSString * const kDefaultAppId = @"preview";
/// 平台标识
static NSString * const kPlatformIdentifier = @"macOS-Preview";
/// UI元素尺寸
static const CGFloat kLoadingIndicatorSize = 32.0;
static const CGFloat kErrorLabelFontSize = 16.0;

#pragma mark - PreviewRenderViewController

@interface PreviewRenderViewController () <KuiklyRenderViewControllerBaseDelegatorDelegate>

/// 隐藏窗口（用于支持真实的事件传递）
@property (nonatomic, strong) NSWindow *offscreenWindow;

/// Kuikly 容器管理器
@property (nonatomic, strong) KuiklyContainerManager *containerManager;

/// 视图宽度
@property (nonatomic, assign, readonly) CGFloat viewWidth;

/// 视图高度
@property (nonatomic, assign, readonly) CGFloat viewHeight;

/// 视图是否可见
@property (nonatomic, assign, getter=isViewVisible) BOOL viewVisible;

@end

@implementation PreviewRenderViewController

#pragma mark - Lifecycle

- (instancetype)initWithPageName:(NSString *)pageName 
                        pageData:(nullable NSDictionary<NSString *, id> *)data
                           width:(CGFloat)width
                          height:(CGFloat)height {
    NSParameterAssert(pageName.length > 0);
    
    self = [super initWithNibName:nil bundle:nil];
    if (self) {
        _viewWidth = width > 0 ? width : 400;
        _viewHeight = height > 0 ? height : 800;
        _viewVisible = NO;
        
        // 创建容器管理器
        _containerManager = [[KuiklyContainerManager alloc] initWithPageName:pageName 
                                                                     pageData:data 
                                                                     delegate:self];
        
        [self registerNotifications];
        
        NSLog(@"[PreviewRenderVC] ✅ 初始化完成: pageName=%@, instanceId=%@, size=%.0fx%.0f", 
              pageName, _containerManager.instanceId, _viewWidth, _viewHeight);
    }
    return self;
}

/// 设置实例 ID（用于外部指定实例 ID，与 JVM 端保持一致）
- (void)setInstanceId:(NSString *)instanceId {
    self.containerManager.instanceId = [instanceId copy];
    NSLog(@"[PreviewRenderVC] 🔧 设置实例 ID: %@", instanceId);
}

- (NSString *)instanceId {
    return self.containerManager.instanceId;
}

- (NSString *)pageName {
    return self.containerManager.pageName;
}

- (NSDictionary<NSString *, id> *)pageData {
    return self.containerManager.pageData;
}

- (KuiklyRenderViewControllerBaseDelegator *)delegator {
    return self.containerManager.delegator;
}

/// 便捷初始化方法（使用默认尺寸 400x800）
- (instancetype)initWithPageName:(NSString *)pageName 
                        pageData:(nullable NSDictionary<NSString *, id> *)data {
    return [self initWithPageName:pageName pageData:data width:400 height:800];
}

- (void)dealloc {
    [self unregisterNotifications];
    NSLog(@"[PreviewRenderVC] 🧹 dealloc - page: %@", self.pageName);
}

#pragma mark - View Lifecycle

- (void)loadView {
    self.view = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, self.viewWidth, self.viewHeight)];
    self.view.wantsLayer = YES;
    NSLog(@"[PreviewRenderVC] 📐 创建视图: %.0fx%.0f", self.viewWidth, self.viewHeight);
    
    // 创建隐藏窗口以支持真实的事件传递
    [self setupOffscreenWindow];
}

/// 创建隐藏窗口用于事件传递
- (void)setupOffscreenWindow {
    NSRect frame = NSMakeRect(-10000, -10000, self.viewWidth, self.viewHeight);
    self.offscreenWindow = [[NSWindow alloc] initWithContentRect:frame
                                                       styleMask:NSWindowStyleMaskBorderless
                                                         backing:NSBackingStoreBuffered
                                                           defer:NO];
    self.offscreenWindow.contentView = self.view;
    self.offscreenWindow.releasedWhenClosed = NO;
    // 设置为透明和不可见，但保持活跃以接收事件
    self.offscreenWindow.alphaValue = 0.0;
    self.offscreenWindow.level = NSFloatingWindowLevel;
    [self.offscreenWindow orderFront:nil];
    
    NSLog(@"[PreviewRenderVC] 🪟 创建隐藏窗口用于事件传递");
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // 注册路由处理器（只需注册一次）
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        PreviewRouterHandler *router = [[PreviewRouterHandler alloc] init];
        [KRRouterModule registerRouterHandler:router];
        NSLog(@"[PreviewRenderVC] 🔧 已注册路由处理器");
    });
    
    [self setupView];
    
    // 创建 Kuikly 容器
    [self.containerManager createContainerInView:self.view];
    
    NSLog(@"[PreviewRenderVC] 📱 viewDidLoad");
}

- (void)viewDidLayout {
    [super viewDidLayout];
    [self.containerManager notifyViewDidLayoutSubviews];
}

- (void)viewWillAppear {
    [super viewWillAppear];
    self.viewVisible = YES;
    [self.containerManager notifyViewWillAppear];
}

- (void)viewDidAppear {
    [super viewDidAppear];
    [self.containerManager notifyViewDidAppear];
}

- (void)viewWillDisappear {
    [super viewWillDisappear];
    self.viewVisible = NO;
//    [self.delegator viewWillDisappear];
}

- (void)viewDidDisappear {
    [super viewDidDisappear];
//    [self.delegator viewDidDisappear];
}

#pragma mark - Public Methods

- (void)updateWithPageName:(NSString *)pageName 
                  pageData:(nullable NSDictionary<NSString *, id> *)data {
    NSParameterAssert(pageName.length > 0);
    
    if ([self shouldUpdateWithPageName:pageName data:data]) {
        [self.containerManager updatePageData:data];
        NSLog(@"[PreviewRenderVC] 🔄 更新页面: %@ with data: %@", pageName, data);
    }
}

/// 切换到新的 Kuikly 容器
- (void)switchToPageName:(NSString *)pageName 
                pageData:(nullable NSDictionary<NSString *, id> *)data {
    NSParameterAssert(pageName.length > 0);
    
    NSLog(@"[PreviewRenderVC] 🔄 切换页面: %@", pageName);
    [self.containerManager switchToPageName:pageName pageData:data parentView:self.view];
}

- (void)recreateKuiklyContainerWithPageName:(NSString *)pageName 
                                    pageData:(nullable NSDictionary<NSString *, id> *)data {
    NSParameterAssert(pageName.length > 0);
    
    NSLog(@"[PreviewRenderVC] 🔄 重新创建容器（使用新方法 switchToPageName）: %@", pageName);
    [self switchToPageName:pageName pageData:data];
}

- (void)handleCallKotlinMethodWithMethodId:(NSInteger)methodId args:(NSArray *)args {
    NSLog(@"[PreviewRenderVC] 📞 handleCallKotlinMethod: methodId=%ld", (long)methodId);
    // 由容器管理器处理
}

- (void)cleanup {
    NSLog(@"[PreviewRenderVC] 🧹 cleanup");
    [self.containerManager cleanup];
}

- (void)handleTouchEventWithType:(NSString *)type x:(CGFloat)x y:(CGFloat)y {
    NSLog(@"[PreviewRenderVC] 👆 触摸事件: type=%@, x=%.1f, y=%.1f", type, x, y);
    
    if (!self.offscreenWindow) {
        NSLog(@"[PreviewRenderVC] ⚠️ 隐藏窗口未创建");
        return;
    }
    
    // 翻转 Y 坐标（macOS 坐标系从左下角开始，而传入的是从左上角开始）
    CGFloat flippedY = self.viewHeight - y;
    NSPoint locationInWindow = NSMakePoint(x, flippedY);
    
    // 确定事件类型
    NSEventType eventType;
    if ([type isEqualToString:@"down"]) {
        eventType = NSEventTypeLeftMouseDown;
    } else if ([type isEqualToString:@"move"]) {
        eventType = NSEventTypeLeftMouseDragged;
    } else if ([type isEqualToString:@"up"]) {
        eventType = NSEventTypeLeftMouseUp;
    } else {
        NSLog(@"[PreviewRenderVC] ⚠️ 未知事件类型: %@", type);
        return;
    }
    
    // 创建真实的 NSEvent
    NSEvent *event = [NSEvent mouseEventWithType:eventType
                                        location:locationInWindow
                                   modifierFlags:0
                                       timestamp:[[NSProcessInfo processInfo] systemUptime]
                                    windowNumber:self.offscreenWindow.windowNumber
                                         context:nil
                                     eventNumber:0
                                      clickCount:1
                                        pressure:1.0];
    
    NSLog(@"[PreviewRenderVC] 👆 发送真实鼠标事件到窗口: type=%ld, location=(%.1f, %.1f)", 
          (long)eventType, locationInWindow.x, locationInWindow.y);
    
    // 将事件发送到窗口，让它走正常的事件响应链
    [self.offscreenWindow sendEvent:event];
    
    NSLog(@"[PreviewRenderVC] ✅ 鼠标事件已发送");
}

- (void)sendEvent:(NSString *)event data:(NSDictionary<NSString *, id> *)data {
    NSLog(@"[PreviewRenderVC] 📨 发送页面事件: event=%@", event);
    [self.containerManager sendEvent:event data:data];
}

- (void)updateSize:(CGFloat)width height:(CGFloat)height {
//    // ✅ 主线程检查（避免重复调用）
//    if (![NSThread isMainThread]) {
//        dispatch_async(dispatch_get_main_queue(), ^{
//            [self updateSize:width height:height];
//        });
//        return;
//    }

    NSLog(@"[PreviewRenderVC] 📐 更新预览大小: %.0fx%.0f", width, height);
    
    // 更新视图大小
    NSRect newFrame = NSMakeRect(0, 0, width, height);
    self.view.frame = newFrame;
    self.view.hidden = NO;
    [self.view layoutSubviews];
    
    // 更新隐藏窗口大小
    if (self.offscreenWindow) {
        NSRect windowFrame = NSMakeRect(-10000, -10000, width, height);
        [self.offscreenWindow setFrame:windowFrame display:YES];
    }
    

    // 通知容器管理器
    [self.containerManager notifyViewDidLayoutSubviews];
    NSLog(@"[PreviewRenderVC] ✅ 预览大小已更新: %.0fx%.0f", width, height);
}

- (void)applyConfig:(NSDictionary<NSString *, id> *)config {
    if (!config || config.count == 0) {
        return;
    }
    
    NSLog(@"[PreviewRenderVC] 📋 应用预览配置: %@", config);
    [self.containerManager applyConfig:config];
}


#pragma mark - Private Setup Methods

- (void)setupView {
    self.view.wantsLayer = YES;
    self.view.layer.backgroundColor = NSColor.windowBackgroundColor.CGColor;
}

#pragma mark - Public Methods for Cross-Process Communication

/// 设置 callKotlin 回调（由外部设置，用于发送到 JVM 端）
- (void)setCallKotlinCallback:(void (^)(KuiklyRenderContextMethod, NSArray *))callback {
    self.containerManager.callKotlinCallback = callback;
    NSLog(@"[PreviewRenderVC] 📝 已设置 callKotlin 回调");
}

- (void (^)(KuiklyRenderContextMethod, NSArray *))callKotlinCallback {
    return self.containerManager.callKotlinCallback;
}

/// 处理来自 JVM 端的 callNative 调用
- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args {
    NSLog(@"[PreviewRenderVC] 📥 handleCallNative: methodId=%ld", (long)methodId);
    return [self.containerManager handleCallNativeWithMethodId:methodId args:args];
}

- (void)registerNotifications {
    NSNotificationCenter *center = NSNotificationCenter.defaultCenter;
    [center addObserver:self
               selector:@selector(handleKuiklyException:)
                   name:kKuiklyFatalExceptionNotification
                 object:nil];
}

- (void)unregisterNotifications {
    [NSNotificationCenter.defaultCenter removeObserver:self];
}

#pragma mark - Private Helper Methods

- (BOOL)shouldUpdateWithPageName:(NSString *)pageName 
                            data:(nullable NSDictionary<NSString *, id> *)data {
    BOOL pageNameChanged = ![self.pageName isEqualToString:pageName];
    BOOL dataChanged = ![self.pageData isEqualToDictionary:data ?: @{}];
    return pageNameChanged || dataChanged;
}

#pragma mark - Exception Handling

- (void)handleKuiklyException:(NSNotification *)notification {
    NSDictionary *userInfo = notification.userInfo;
    NSString *exceptionString = userInfo[@"exception"];
    
    if (exceptionString.length == 0) {
        return;
    }
    
    NSLog(@"[PreviewRenderVC] ❌ Kuikly异常: %@", exceptionString);
}

#pragma mark - KuiklyRenderViewControllerBaseDelegatorDelegate

- (NSView *)createLoadingView {
    NSView *loadingView = [[NSView alloc] initWithFrame:NSZeroRect];
    loadingView.wantsLayer = YES;
    loadingView.layer.backgroundColor = NSColor.windowBackgroundColor.CGColor;
    
    NSProgressIndicator *indicator = [self createLoadingIndicator];
    [loadingView addSubview:indicator];
    
    [NSLayoutConstraint activateConstraints:@[
        [indicator.centerXAnchor constraintEqualToAnchor:loadingView.centerXAnchor],
        [indicator.centerYAnchor constraintEqualToAnchor:loadingView.centerYAnchor]
    ]];
    
    return loadingView;
}

- (NSView *)createErrorView {
    NSView *errorView = [[NSView alloc] initWithFrame:NSZeroRect];
    errorView.wantsLayer = YES;
    errorView.layer.backgroundColor = NSColor.windowBackgroundColor.CGColor;
    
    NSTextField *errorLabel = [self createErrorLabel];
    [errorView addSubview:errorLabel];
    
    [NSLayoutConstraint activateConstraints:@[
        [errorLabel.centerXAnchor constraintEqualToAnchor:errorView.centerXAnchor],
        [errorLabel.centerYAnchor constraintEqualToAnchor:errorView.centerYAnchor]
    ]];
    
    return errorView;
}

- (void)fetchContextCodeWithPageName:(NSString *)pageName 
                      resultCallback:(KuiklyContextCodeCallback)callback {
    NSLog(@"[PreviewRenderVC] 🔍 fetchContextCode: pageName=%@", pageName);
    
    if (callback != nil) {
        callback(kDefaultFrameworkName, nil);
    }
}

- (void)contentViewDidLoad {
    NSLog(@"[PreviewRenderVC] ✅ 页面加载完成");
}

- (void)renderViewDidCreated {
    NSLog(@"[PreviewRenderVC] 🎬 renderViewDidCreated");
}

- (void)onUnhandledException:(NSString *)exReason 
                       stack:(NSString *)callstackStr 
                        mode:(KuiklyContextMode)mode {
    NSLog(@"[PreviewRenderVC] ❌ 未处理异常: %@\nStack:\n%@", exReason, callstackStr);
}

- (void)onPageLoadComplete:(BOOL)isSucceed 
                     error:(nullable NSError *)error 
                      mode:(KuiklyContextMode)mode {
    if (error != nil) {
        NSLog(@"[PreviewRenderVC] ❌ 页面加载失败: %@", error.localizedDescription);
    } else {
        NSLog(@"[PreviewRenderVC] ✅ 页面加载成功");
    }
}

- (NSDictionary<NSString *, NSObject *> *)contextPageData {
    return @{
        @"appId": kDefaultAppId,
        @"sysLang": NSLocale.preferredLanguages.firstObject ?: @"en",
        @"platform": kPlatformIdentifier,
        @"previewMode": @YES
    };
}

- (NSString *)turboDisplayKey {
    return nil; // 预览模式禁用 TurboDisplay
}

#pragma mark - UI Factory Methods

- (NSProgressIndicator *)createLoadingIndicator {
    CGRect frame = CGRectMake(0, 0, kLoadingIndicatorSize, kLoadingIndicatorSize);
    NSProgressIndicator *indicator = [[NSProgressIndicator alloc] initWithFrame:frame];
    indicator.style = NSProgressIndicatorStyleSpinning;
    indicator.translatesAutoresizingMaskIntoConstraints = NO;
    [indicator startAnimation:nil];
    return indicator;
}

- (NSTextField *)createErrorLabel {
    NSTextField *label = [NSTextField labelWithString:@"加载失败"];
    label.translatesAutoresizingMaskIntoConstraints = NO;
    label.textColor = NSColor.redColor;
    label.font = [NSFont systemFontOfSize:kErrorLabelFontSize];
    label.alignment = NSTextAlignmentCenter;
    return label;
}

@end

