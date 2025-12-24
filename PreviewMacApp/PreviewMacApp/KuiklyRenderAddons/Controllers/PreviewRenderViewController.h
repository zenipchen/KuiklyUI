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

/**
 * @brief 预览渲染视图控制器
 *
 * 该控制器用于预览模式下的 Kuikly 页面渲染。
 * 它接收来自 HTTP 服务的渲染指令，使用 core-render-ios 进行离屏/在屏渲染。
 * 
 * 跨进程架构：
 * - Kotlin 逻辑层运行在 JVM 进程中
 * - 渲染层（本控制器）运行在 Mac 进程中
 * - 通过 HTTP 进行 callKotlinMethod 和 callNative 的双向通信
 */
@interface PreviewRenderViewController : NSViewController

/// 当前页面名称（只读）
@property (nonatomic, copy, readonly) NSString *pageName;

/// 实例 ID（用于跨进程通信，标识渲染实例）
@property (nonatomic, copy, readonly) NSString *instanceId;

/**
 * @brief 指定初始化方法
 *
 * @param pageName 页面名称，对应Kotlin侧@Page注解的值，不能为nil
 * @param pageData 页面参数字典，Kotlin侧可通过pageData.params获取，可以为nil
 * @param width 视图宽度，默认 400
 * @param height 视图高度，默认 800
 * @return 初始化的 PreviewRenderViewController 实例
 */
- (instancetype)initWithPageName:(NSString *)pageName 
                        pageData:(nullable NSDictionary<NSString *, id> *)pageData
                           width:(CGFloat)width
                          height:(CGFloat)height NS_DESIGNATED_INITIALIZER;

/**
 * @brief 便捷初始化方法（使用默认尺寸 400x800）
 *
 * @param pageName 页面名称，对应Kotlin侧@Page注解的值，不能为nil
 * @param pageData 页面参数字典，Kotlin侧可通过pageData.params获取，可以为nil
 * @return 初始化的 PreviewRenderViewController 实例
 */
- (instancetype)initWithPageName:(NSString *)pageName 
                        pageData:(nullable NSDictionary<NSString *, id> *)pageData;

/**
 * @brief 动态更新页面内容
 *
 * 仅更新 pageName 和 pageData，不重新创建 Kuikly 容器。
 *
 * @param pageName 新的页面名称，不能为nil
 * @param pageData 新的页面参数，可以为nil
 */
- (void)updateWithPageName:(NSString *)pageName 
                  pageData:(nullable NSDictionary<NSString *, id> *)pageData;

/**
 * @brief 重新创建 Kuikly 容器
 *
 * 清理旧的 Kuikly 容器并重新创建，用于在相同 instanceId 的情况下替换界面。
 *
 * @param pageName 新的页面名称，不能为nil
 * @param pageData 新的页面参数，可以为nil
 */
- (void)recreateKuiklyContainerWithPageName:(NSString *)pageName 
                                    pageData:(nullable NSDictionary<NSString *, id> *)pageData;

/**
 * @brief 处理来自 SDK 的 callKotlinMethod 调用
 *
 * @param methodId 方法 ID
 * @param args 参数列表
 */
- (void)handleCallKotlinMethodWithMethodId:(NSInteger)methodId 
                                      args:(NSArray * _Nullable)args;

/**
 * @brief 清理资源
 */
- (void)cleanup;

/**
 * @brief 处理触摸事件
 *
 * @param type 事件类型: "down", "move", "up", "cancel"
 * @param x X 坐标
 * @param y Y 坐标
 */
- (void)handleTouchEventWithType:(NSString *)type x:(CGFloat)x y:(CGFloat)y;

/**
 * @brief 发送页面事件到 Kuikly 容器
 *
 * 该方法用于从外部（JVM 端）向 Kuikly 页面发送事件，类似于 Android 的
 * `KuiklyRenderViewDelegator.sendEvent` 和 iOS 的 `KuiklyRenderViewControllerDelegator.sendWithEvent`。
 *
 * 事件会被发送到 Kuikly 渲染核心，最终触发 Pager 的 `onReceivePagerEvent` 方法。
 *
 * @param event 事件名称
 * @param data 事件数据
 */
- (void)sendEvent:(NSString *)event data:(NSDictionary<NSString *, id> *)data;

/**
 * @brief 更新预览大小
 *
 * 动态调整渲染视图的大小。
 *
 * @param width 新的宽度
 * @param height 新的高度
 */
- (void)updateSize:(CGFloat)width height:(CGFloat)height;

/**
 * @brief 应用预览配置
 *
 * 应用预览配置参数，如 density、orientation 等。
 *
 * @param config 配置参数字典
 */
- (void)applyConfig:(NSDictionary<NSString *, id> *)config;

#pragma mark - Cross-Process Communication

/**
 * @brief 设置实例 ID（可选，用于外部指定实例 ID，与 JVM 端保持一致）
 *
 * @param instanceId 实例 ID
 */
- (void)setInstanceId:(NSString *)instanceId;

/**
 * @brief 设置 callKotlin 回调（用于将渲染层的 Kotlin 调用发送到 JVM 端）
 *
 * 当渲染层需要调用 Kotlin 方法时，会通过此回调通知外部，
 * 外部（PreviewRenderCoreManager/PreviewHttpServer）负责将调用通过 HTTP 发送到 JVM 端。
 *
 * @param callback 回调 block，参数为方法类型和参数数组
 */
- (void)setCallKotlinCallback:(void (^)(KuiklyRenderContextMethod method, NSArray *args))callback;

/**
 * @brief 处理来自 JVM 端的 callNative 调用
 *
 * 当 JVM 端（Kotlin 逻辑层）需要调用原生方法时，通过 HTTP 发送到 Mac 端，
 * 然后调用此方法处理，结果会返回给调用方。
 *
 * @param methodId 方法 ID
 * @param args 参数数组
 * @return 返回值（如果有）
 */
- (id _Nullable)handleCallNativeWithMethodId:(NSInteger)methodId args:(NSArray *)args;

#pragma mark - Unavailable Initializers

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)coder NS_UNAVAILABLE;
- (instancetype)initWithNibName:(nullable NSNibName)nibNameOrNil 
                         bundle:(nullable NSBundle *)nibBundleOrNil NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END

