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

#import "PreviewKotlinCoreEntry.h"

// 前向声明 Swift 类（通过 Bridging Header 访问）
@class PreviewHttpServer;

// 前向声明协议（这些协议在 KuiklyRenderFrameworkContextHandler.m 中定义）
@protocol KRKuiklyKotlinCoreEntryDelegate <NSObject>
- (id _Nullable)callNativeMethodId:(int32_t)methodId arg0:(id _Nullable)arg0 arg1:(id _Nullable)arg1 arg2:(id _Nullable)arg2 arg3:(id _Nullable)arg3 arg4:(id _Nullable)arg4 arg5:(id _Nullable)arg5;
@end

@protocol KuiklyCoreEntryCompanionProtocol <NSObject>
- (BOOL)isPageExistPageName:(NSString *)pageName;
@end

#pragma mark - PreviewKotlinCoreEntryCompanion

/// Companion 实现（用于页面存在性检查）
@interface PreviewKotlinCoreEntryCompanion : NSObject <KuiklyCoreEntryCompanionProtocol>
@end

@implementation PreviewKotlinCoreEntryCompanion

- (BOOL)isPageExistPageName:(NSString *)pageName {
    // 在 Preview 模式下，假设所有页面都存在（因为页面逻辑在 JVM 端）
    NSLog(@"[SharedKuiklyCoreEntry] ✅ 页面存在检查: %@ (Preview 模式，假设存在)", pageName);
    return YES;
}

@end

#pragma mark - SharedKuiklyCoreEntry

@interface SharedKuiklyCoreEntry ()

@property (nonatomic, copy) void (^callKotlinCallback)(int32_t methodId, NSArray *args);
/// 缓存的调用（在回调未设置时）
@property (nonatomic, strong) NSMutableArray<NSDictionary *> *pendingCalls;

@end

@implementation SharedKuiklyCoreEntry

+ (void)load {
    // 确保类被加载
    NSLog(@"[SharedKuiklyCoreEntry] 📦 类已加载");
    NSLog(@"[SharedKuiklyCoreEntry] 📋 类名: %@", NSStringFromClass(self));
}

+ (id<KuiklyCoreEntryCompanionProtocol>)companion {
    static PreviewKotlinCoreEntryCompanion *companion = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        companion = [[PreviewKotlinCoreEntryCompanion alloc] init];
    });
    return companion;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _instanceId = @"default";
        _pendingCalls = [NSMutableArray array];
        NSLog(@"[SharedKuiklyCoreEntry] ✅ 初始化（Preview 模式，通过 HTTP 与 JVM 端通信）");
        NSLog(@"[SharedKuiklyCoreEntry] 📋 类名: %@", NSStringFromClass([self class]));
        NSLog(@"[SharedKuiklyCoreEntry] 📍 线程: %@ (主线程: %@)", [NSThread currentThread], [NSThread isMainThread] ? @"是" : @"否");
    }
    return self;
}

- (void)setCallKotlinCallback:(void (^)(int32_t, NSArray *))callback {
    _callKotlinCallback = [callback copy];
    NSLog(@"[SharedKuiklyCoreEntry] 📝 已设置 callKotlin 回调");
    
    // 执行缓存的调用
    if (callback && self.pendingCalls.count > 0) {
        NSLog(@"[SharedKuiklyCoreEntry] 🔄 执行 %lu 个缓存的调用", (unsigned long)self.pendingCalls.count);
        NSArray *calls = [self.pendingCalls copy];
        [self.pendingCalls removeAllObjects];
        
        for (NSDictionary *call in calls) {
            int32_t methodId = [call[@"methodId"] intValue];
            NSArray *args = call[@"args"];
            NSLog(@"[SharedKuiklyCoreEntry] 🔄 执行缓存的调用: methodId=%d, args.count=%lu", 
                  methodId, (unsigned long)args.count);
            callback(methodId, args);
        }
        NSLog(@"[SharedKuiklyCoreEntry] ✅ 所有缓存的调用已执行");
    }
}

- (void)callKotlinMethodMethodId:(int32_t)methodId 
                            arg0:(id _Nullable)arg0 
                            arg1:(id _Nullable)arg1 
                            arg2:(id _Nullable)arg2 
                            arg3:(id _Nullable)arg3 
                            arg4:(id _Nullable)arg4 
                            arg5:(id _Nullable)arg5 {
    NSLog(@"[SharedKuiklyCoreEntry] ========== callKotlinMethod 被调用 ==========");
    NSLog(@"[SharedKuiklyCoreEntry] 📤 methodId=%d, instanceId=%@", methodId, self.instanceId);
    NSLog(@"[SharedKuiklyCoreEntry] 📋 参数: arg0=%@, arg1=%@, arg2=%@, arg3=%@, arg4=%@, arg5=%@", 
          arg0, arg1, arg2, arg3, arg4, arg5);
    NSLog(@"[SharedKuiklyCoreEntry] 🔍 callKotlinCallback 状态: %@", self.callKotlinCallback ? @"✅ 已设置" : @"❌ 未设置");
    NSLog(@"[SharedKuiklyCoreEntry] 📍 线程: %@ (主线程: %@)", [NSThread currentThread], [NSThread isMainThread] ? @"是" : @"否");
    
    // 收集参数
    NSMutableArray *args = [NSMutableArray arrayWithCapacity:6];
    if (arg0) [args addObject:arg0];
    if (arg1) [args addObject:arg1];
    if (arg2) [args addObject:arg2];
    if (arg3) [args addObject:arg3];
    if (arg4) [args addObject:arg4];
    if (arg5) [args addObject:arg5];
    
    NSLog(@"[SharedKuiklyCoreEntry] 📦 收集的参数数组: %@ (count=%lu)", args, (unsigned long)args.count);
    
    // 通过回调发送到 HTTP 服务器，然后转发到 JVM 端
    if (self.callKotlinCallback) {
        NSLog(@"[SharedKuiklyCoreEntry] ✅ 调用 callKotlinCallback");
        self.callKotlinCallback(methodId, args);
        NSLog(@"[SharedKuiklyCoreEntry] ✅ callKotlinCallback 调用完成");
    } else {
        // 如果没有设置回调，缓存这次调用，等回调设置后再执行
        NSLog(@"[SharedKuiklyCoreEntry] ⚠️ callKotlinCallback 未设置，缓存调用: methodId=%d", methodId);
        [self.pendingCalls addObject:@{
            @"methodId": @(methodId),
            @"args": args
        }];
        NSLog(@"[SharedKuiklyCoreEntry] 💾 已缓存调用，当前缓存数量: %lu", (unsigned long)self.pendingCalls.count);
    }
}

@end

