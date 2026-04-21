# 页面数据PagerData

每个``Kuikly``页面, 都带有由``Native``侧传递过来的数据, 这份数据在``Kuikly``中被称为``PagerData``。

## 如何获取PagerData

在``Kuikly``中，你可以在``Pager``子类或者组合组件``ComposeView``子类内获取``PagerData``

* 在``Pager``子类中获取``PagerData``

```kotlin{11}
@Page("1")
internal class HelloWorldPage : Pager() {

    ...
    override fun body(): ViewBuilder {
        ...
    }

    override fun created() {
        super.created()
        val pgData = pagerData // 通过pagerData变量获取页面参数
    }
}
```

* 在组合组件子类中获取``PagerData``

```kotlin
class TestComposeView : ComposeView<ComposeAttr, ComposeEvent>() {

    ...
    override fun created() {
        super.created()
        val pgData = pagerData // 在组合组件中获取PagerData
    }
}
```

---

``PagerData``里面包含了两类参数


1. **基础参数**: 每个页面默认都带有的参数
2. **业务扩展参数**: 不同的页面，可根据业务诉求，在打开``Kuikly``页面的时候，由``Native``侧将业务数据传递给``Kuikly``页面，然后存放在``PagerData``类中, 供业务侧使用

::: tip 注意
``PagerData``数据需在Pager创建生命周期(onCreate)或之后调用，在此pager创建之前的时机访问（如全局变量初始化时获取``PagerData``数据），会触发框架保护异常：PagerNotFoundException。
:::

## PagerData基础参数

``PagerData``中的基础参数是由``Kuikly``框架传递的，默认每个页面都含有这些基础参数。

| 参数              | 描述                                                   | 类型 |
|-----------------|------------------------------------------------------|--|
| pageViewWidth   | 页面根View宽度                                            | Float |
| pageViewHeight  | 页面根View高度                                            | Float |
| statusBarHeight | 状态栏高度                                                | Float |
| deviceWidth     | 屏幕宽度                                                 | Float |
| deviceHeight    | 屏幕高度                                                 | Float |
| appVersion      | app版本号                                               | String |
| isIOS           | 是否为iOS平台                                             | Boolean |
| isMacOS         | 是否为MacOS平台                                           | Boolean |
| isIphoneX       | 是否为iphoneX机型                                         | Boolean |
| params          | 存放业务扩展的数据                                            | JSONObject |
| safeAreaInsets  | 安全区域: 被系统界面（如状态栏、导航栏、工具栏或底部 Home 指示器、刘海屏底部边距）遮挡的视图区域 | EdgeInsets |
| androidBottomBavBarHeight | （Android 专属）虚拟导航栏高度（dp）。手势导航模式下为 0，三键导航模式下为实际高度。需由容器层通过 `pageData` 传入，详见[Android 虚拟导航栏规避](#android-虚拟导航栏规避)。 | Float |


:::tip 提示
iOS 端可通过实现 `viewControllerHostWindow` 方法，指定当前页面获取 safeAreaInsets 的参考窗口。这在多 Window 场景（如悬浮窗、分屏模式）确保获取到正确的安全区域。[参考示例](../QuickStart/iOS.md#实现kuikly承载容器)
:::

## PagerData业务扩展参数

``PagerData``的业务扩展参数，是``Native``侧在打开``Kuikly``页面时，传递给``Kuikly``页面的参数，这些扩展参数会被统一存放在``PagerData.params``字段中。

<br/>

例如如果``Native``在打开``Kuikly``页面的时候，传递了``test:1``数据，那在``Kuikly``页面中可以这样获取

```kotlin{10}
internal class HelloWorldPage : Pager() {

    ...
    override fun body(): ViewBuilder {
        ...
    }

    override fun created() {
        super.created()
        val test = pagerData.params.optInt("test") // 获取业务参数
    }
}
```

更好的方式是，新建``PagerData``的扩展类，然后将业务参数通过扩展的形式封装在``PagerData``扩展类中

```kotlin
// PagerDataExt.kt

internal val PageData.test: Int
    get() = params.optInt("test")
```

## 下一步

在学习了``Kuikly``的页面数据``PagerData``概念后, 下一步，我们接着学习[Pager生命周期](pager-lifecycle.md), 了解``Pager``的生命周期




---

## Android 虚拟导航栏规避

### 背景

Android 开启沉浸式模式后，Kuikly 页面会延伸到虚拟导航栏（手势导航栏 / 三键导航栏）区域之下，导致页面底部内容或底部弹窗被遮挡。

### 正确做法

**第一步：Android 容器层通过 `pageData` 传入导航栏高度**

> ✅ 正确：在 `createPageData()` 里传入高度  
> ❌ 错误：在容器层对 `KuiklyRenderView` 的父容器直接 `setPadding()` 来规避

```kotlin
// KuiklyRenderActivity.kt（或业务 Activity）

private fun createPageData(): Map<String, Any> {
    val param = mutableMapOf<String, Any>()
    // ... 其他参数 ...

    // ✅ 将虚拟导航栏高度（dp）传给 Kuikly 侧
    param["androidBottomNavBarHeight"] = getNavigationBarHeightDp()
    return param
}

@SuppressLint("InternalInsetResource")
private fun getNavigationBarHeightDp(): Float {
    // Android 11+：通过 WindowInsets 精确获取真实底部占用高度
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        val insets = window.decorView.rootWindowInsets
        if (insets != null) {
            val navInsetPx = insets.getInsets(
                android.view.WindowInsets.Type.navigationBars()
            ).bottom
            return navInsetPx / resources.displayMetrics.density
        }
    }
    // 低版本回退：通过系统资源 ID 获取
    val resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android")
    val heightPx = if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 0
    return heightPx / resources.displayMetrics.density
}
```

**第二步：Kuikly 页面使用 `pagerData.androidBottomBavBarHeight` 添加底部 padding**

```kotlin
@Page("MyPage")
internal class MyPage : BasePager() {
    override fun body(): ViewBuilder {
        // 手势导航模式下为 0，三键导航模式下为实际导航栏高度（dp）
        val navBarHeight = pagerData.androidBottomBavBarHeight
        return {
            // 页面主内容区
            View {
                attr {
                    flex(1f)
                    // ✅ 在 Kuikly 侧加底部 padding，规避导航栏遮挡
                    paddingBottom(navBarHeight)
                }
                // ... 业务内容 ...
            }
        }
    }
}
```

**第三步：底部弹窗也应在 Kuikly 侧自行规避**

```kotlin
internal class MyBottomSheetAttr : ComposeAttr() {
    var bottomNavBarHeight: Float = 0f
}

internal class MyBottomSheet : ComposeView<MyBottomSheetAttr, ComposeEvent>() {
    override fun body(): ViewBuilder {
        val ctx = this
        return {
            View {
                attr {
                    // ✅ 弹窗内容区同样通过 paddingBottom 规避
                    paddingBottom(16f + ctx.attr.bottomNavBarHeight)
                    // ... 其他样式 ...
                }
                // ... 弹窗内容 ...
            }
        }
    }
}

// 在父页面中使用时，将 navBarHeight 传入弹窗
// MyBottomSheet {
//     attr {
//         bottomNavBarHeight = pagerData.androidBottomBavBarHeight
//     }
// }
```

### 为什么不能在容器层规避？

| 方案 | 问题 |
|------|------|
| 容器层对根 View 加 `setPadding()` | Kuikly 侧无法感知导航栏高度，底部弹窗（`Modal`）等浮层无法自行规避 |
| 容器层传 `pageData` + Kuikly 侧自行加 padding | ✅ 推荐。页面和弹窗各自按需规避，逻辑清晰 |

### 参考 Demo

完整演示代码见 `demo` 模块：  
`GestureNavBarDemoPage.kt`（页面规避 + 底部弹窗规避）
