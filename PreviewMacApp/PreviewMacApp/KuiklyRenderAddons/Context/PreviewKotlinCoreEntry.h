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

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol KRKuiklyKotlinCoreEntryDelegate;
@protocol KuiklyCoreEntryCompanionProtocol;

/**
 * @brief Preview 模式的 Kotlin Core Entry
 * 
 * 实现 KuiklyKotlinCoreEntryProtocol 协议，通过 HTTP 与 JVM 端通信
 * 替代 Kotlin/Native 编译生成的入口类
 * 
 * 类名设计为 SharedKuiklyCoreEntry，这样当 frameworkName 为 "shared" 时，
 * entryClassWithFrameworkName: 方法能够自动找到这个类，无需 Method Swizzling
 */
@interface SharedKuiklyCoreEntry : NSObject

/// 代理（用于 callNative 回调）
@property (nonatomic, weak) id<KRKuiklyKotlinCoreEntryDelegate> hrCoreDelegate;

/// Companion（用于页面存在性检查）
@property (class, readonly) id<KuiklyCoreEntryCompanionProtocol> companion;

/// 实例 ID（用于跨进程通信）
@property (nonatomic, copy) NSString *instanceId;

/// 调用 Kotlin 方法（通过 HTTP 发送到 JVM 端）
- (void)callKotlinMethodMethodId:(int32_t)methodId 
                            arg0:(id _Nullable)arg0 
                            arg1:(id _Nullable)arg1 
                            arg2:(id _Nullable)arg2 
                            arg3:(id _Nullable)arg3 
                            arg4:(id _Nullable)arg4 
                            arg5:(id _Nullable)arg5;

/// 设置 callKotlin 回调（由外部设置，用于发送到 JVM 端）
- (void)setCallKotlinCallback:(void (^)(int32_t methodId, NSArray *args))callback;

@end

NS_ASSUME_NONNULL_END

