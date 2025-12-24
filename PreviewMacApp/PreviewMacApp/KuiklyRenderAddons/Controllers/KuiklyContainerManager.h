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

#import <Cocoa/Cocoa.h>
#import <OpenKuiklyIOSRender/KuiklyRenderContextProtocol.h>

NS_ASSUME_NONNULL_BEGIN

@class KuiklyRenderViewControllerBaseDelegator;
@class KuiklyRenderView;

/// Kuikly 容器管理器 - 负责管理 Kuikly 渲染容器的生命周期
@interface KuiklyContainerManager : NSObject

/// 当前的渲染代理器
@property (nonatomic, strong, readonly, nullable) KuiklyRenderViewControllerBaseDelegator *delegator;

/// 当前的渲染视图
@property (nonatomic, strong, readonly, nullable) KuiklyRenderView *renderView;

/// 当前页面名称
@property (nonatomic, copy, readonly) NSString *pageName;

/// 当前页面数据
@property (nonatomic, copy, readonly) NSDictionary<NSString *, id> *pageData;

/// 实例 ID
@property (nonatomic, copy) NSString *instanceId;

/// callKotlin 回调
@property (nonatomic, copy, nullable) void (^callKotlinCallback)(KuiklyRenderContextMethod method, NSArray *args);

/// 初始化方法
/// @param pageName 页面名称
/// @param pageData 页面数据
/// @param delegate 代理对象（用于回调 VC 的生命周期方法）
- (instancetype)initWithPageName:(NSString *)pageName
                        pageData:(nullable NSDictionary<NSString *, id> *)pageData
                        delegate:(id)delegate;

/// 创建 Kuikly 容器
/// @param parentView 父视图
- (void)createContainerInView:(NSView *)parentView;

/// 切换到新的 Kuikly 容器
/// @param pageName 新的页面名称
/// @param pageData 新的页面数据
/// @param parentView 父视图
- (void)switchToPageName:(NSString *)pageName
                pageData:(nullable NSDictionary<NSString *, id> *)pageData
              parentView:(NSView *)parentView;

/// 更新页面数据（不重新创建容器）
/// @param pageData 新的页面数据
- (void)updatePageData:(NSDictionary<NSString *, id> *)pageData;

/// 应用配置
/// @param config 配置字典
- (void)applyConfig:(NSDictionary<NSString *, id> *)config;

/// 发送事件
/// @param event 事件名称
/// @param data 事件数据
- (void)sendEvent:(NSString *)event data:(NSDictionary<NSString *, id> *)data;

/// 处理来自 JVM 的 callNative 调用
/// @param methodId 方法 ID
/// @param args 参数数组
/// @return 返回值
- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args;

/// 清理容器资源
- (void)cleanup;

/// 通知容器视图已加载
/// @param view 视图
- (void)notifyViewDidLoad:(NSView *)view;

/// 通知容器视图布局已更新
- (void)notifyViewDidLayoutSubviews;

/// 通知容器视图即将显示
- (void)notifyViewWillAppear;

/// 通知容器视图已显示
- (void)notifyViewDidAppear;

@end

NS_ASSUME_NONNULL_END
