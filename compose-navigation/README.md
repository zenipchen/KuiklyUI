# Kuikly Compose Navigation

Jetpack Navigation Compose 集成模块，为 Kuikly 项目提供声明式导航支持。

## 📦 功能特性

- ✅ **完整的 Navigation Compose 支持** - 集成 Jetpack Navigation Compose 2.7.7
- ✅ **全局导航助手** - 提供全局 NavController 访问
- ✅ **扩展函数** - 简化路由参数获取
- ✅ **类型安全** - 支持类型安全的参数传递
- ✅ **返回栈管理** - 提供便捷的返回栈操作
- ✅ **示例代码** - 包含完整的使用示例

## 🚀 快速开始

### 1. 添加依赖

在你的 `build.gradle.kts` 中添加：

```kotlin
dependencies {
    implementation(project(":compose-navigation"))
}
```

### 2. 基本用法

```kotlin
import com.tencent.kuikly.compose.navigation.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController

@Composable
fun App() {
    val navController = rememberNavController()
    
    // 设置全局 NavController
    KuiklyNavigation.setNavController(navController)
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        kuiklyComposable("home") {
            HomePage()
        }
        
        kuiklyComposable("detail/{id}") { backStackEntry ->
            val id = backStackEntry.getStringArg("id") ?: ""
            DetailPage(id)
        }
    }
}
```

### 3. 页面导航

#### 基础导航
```kotlin
// 导航到指定路由
KuiklyNavigation.navigateTo("detail/123")

// 返回上一页
KuiklyNavigation.navigateBack()

// 导航并清空返回栈
KuiklyNavigation.navigateAndClearBackStack("home")
```

#### 使用 NavController
```kotlin
@Composable
fun MyPage(navController: NavController) {
    Button(onClick = {
        navController.navigate("settings")
    }) {
        Text("Go to Settings")
    }
}
```

### 4. 路由参数

#### 传递参数
```kotlin
// 导航到带参数的路由
navController.navigate("user/123")
navController.navigate("product/456?category=electronics")
```

#### 获取参数
```kotlin
kuiklyComposable("user/{id}") { backStackEntry ->
    val userId = backStackEntry.getStringArg("id") ?: ""
    val age = backStackEntry.getIntArg("age", defaultValue = 18)
    
    UserPage(userId, age)
}
```

## 📖 API 文档

### KuiklyNavigation

全局导航助手，提供便捷的导航操作。

#### 方法

| 方法 | 说明 |
|------|------|
| `setNavController(navController)` | 设置全局 NavController |
| `getNavController()` | 获取全局 NavController |
| `navigateTo(route)` | 导航到指定路由 |
| `navigateBack()` | 返回上一页 |
| `navigateAndClearBackStack(route)` | 导航并清空返回栈 |

### 扩展函数

#### NavGraphBuilder.kuiklyComposable

简化的路由声明函数：

```kotlin
fun NavGraphBuilder.kuiklyComposable(
    route: String,
    content: @Composable (NavBackStackEntry) -> Unit
)
```

#### NavBackStackEntry 扩展

便捷的参数获取函数：

```kotlin
fun getStringArg(key: String): String?
fun getIntArg(key: String, defaultValue: Int = 0): Int
fun getLongArg(key: String, defaultValue: Long = 0L): Long
fun getBooleanArg(key: String, defaultValue: Boolean = false): Boolean
```

## 🎨 完整示例

查看 `KuiklyNavigationSample.kt` 获取完整的使用示例，包括：

- ✅ 首页导航
- ✅ 详情页（带参数）
- ✅ 设置页
- ✅ 返回栈操作
- ✅ 全局导航助手使用

## 🔧 高级用法

### 深层链接

```kotlin
composable(
    route = "profile/{userId}",
    deepLinks = listOf(
        navDeepLink { uriPattern = "kuikly://profile/{userId}" }
    )
) { backStackEntry ->
    ProfilePage(backStackEntry.getStringArg("userId"))
}
```

### 动画过渡

```kotlin
composable(
    route = "detail",
    enterTransition = { slideIntoContainer(towards = AnimatedContentTransitionScope.SlideDirection.Left) },
    exitTransition = { slideOutOfContainer(towards = AnimatedContentTransitionScope.SlideDirection.Left) }
) {
    DetailPage()
}
```

### 条件导航

```kotlin
Button(onClick = {
    if (isLoggedIn) {
        KuiklyNavigation.navigateTo("profile")
    } else {
        KuiklyNavigation.navigateTo("login")
    }
}) {
    Text("My Profile")
}
```

## 📚 依赖版本

- Navigation Compose: 2.7.7
- Lifecycle Runtime Compose: 2.7.0
- Lifecycle ViewModel Compose: 2.7.0
- Activity Compose: 1.8.2

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

遵循 KuiklyUI 主项目许可证。

---

**Made with ❤️ by Tencent KuiklyUI Team**
