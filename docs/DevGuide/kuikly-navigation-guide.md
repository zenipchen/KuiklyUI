# Kuikly Navigation 导航组件使用指南

Kuikly Navigation 是一套为 KuiklyUI 框架设计的声明式导航组件，提供了类似 Jetpack Compose Navigation 的 API 和体验。

## 目录

1. [快速开始](#一快速开始)
2. [核心概念](#二核心概念)
3. [基础使用](#三基础使用)
4. [与 NavigationBar 集成](#四与-navigationbar-集成)
5. [导航动画](#五导航动画)
6. [嵌套导航](#六嵌套导航)
7. [状态保存与恢复](#七状态保存与恢复)
8. [API 参考](#八api-参考)

---

## 一、快速开始

### 1.1 添加依赖

在 `build.gradle.kts` 中添加：

```kotlin
dependencies {
    implementation(project(":compose"))
}
```

### 1.2 最简示例

```kotlin
import com.tencent.kuikly.compose.navigation.*

@Composable
fun MyApp() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") { HomeScreen() }
        composable("profile") { ProfileScreen() }
    }
}
```

---

## 二、核心概念

### 2.1 三大核心组件

| 组件 | 职责 | 类比 |
|------|------|------|
| `NavController` | 管理导航状态、返回栈 | 遥控器 |
| `NavHost` | 显示当前目的地的页面内容 | 电视屏幕 |
| `NavigationBar` | 底部导航栏，接收用户点击 | 导航按钮 |

### 2.2 工作流程

```
用户点击 NavigationBarItem
        ↓
调用 navController.navigate()
        ↓
NavController 更新返回栈
        ↓
NavHost 自动切换到新页面
```

---

## 三、基础使用

### 3.1 创建导航控制器

```kotlin
val navController = rememberNavController()
```

### 3.2 定义导航图

```kotlin
NavHost(
    navController = navController,
    startDestination = "home"
) {
    composable("home") { HomeScreen() }
    composable("profile") { ProfileScreen() }
    composable("settings") { SettingsScreen() }
}
```

### 3.3 页面跳转

```kotlin
// 简单跳转
navController.navigate("profile")

// 带参数跳转
navController.navigate("product/123")

// 返回上一页
navController.popBackStack()

// 返回到指定页面
navController.popBackStack("home", inclusive = false)
```

### 3.4 获取当前路由

```kotlin
val navBackStackEntry by navController.currentBackStackEntryAsState()
val currentRoute = navBackStackEntry?.route
```

---

## 四、与 NavigationBar 集成

### 4.1 基础集成

```kotlin
@Composable
fun MainScreen() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val currentRoute = navController.currentBackStackEntryAsState()
                    .value?.destination?.route
                
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, null) },
                    label = { Text("首页") },
                    selected = currentRoute == "home",
                    onClick = { navController.navigate("home") }
                )
                
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, null) },
                    label = { Text("我的") },
                    selected = currentRoute == "profile",
                    onClick = { navController.navigate("profile") }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { HomeScreen() }
            composable("profile") { ProfileScreen() }
        }
    }
}
```

### 4.2 最佳实践：状态保存

```kotlin
NavigationBarItem(
    selected = currentRoute == "home",
    onClick = {
        navController.navigate("home") {
            // 弹出到起始页面，避免返回栈堆积
            popUpTo(navController.graph.findStartDestination().id) {
                saveState = true  // 保存页面状态
            }
            // 避免重复创建同一页面
            launchSingleTop = true
            // 恢复之前保存的状态
            restoreState = true
        }
    },
    icon = { Icon(Icons.Default.Home, null) },
    label = { Text("首页") }
)
```

---

## 五、导航动画

### 5.1 预定义动画

```kotlin
NavHost(navController, startDestination = "home") {
    composable(
        "home",
        enterTransition = NavAnimations.fadeIn(),
        exitTransition = NavAnimations.fadeOut()
    ) { HomeScreen() }
    
    composable(
        "detail/{id}",
        enterTransition = NavAnimations.slideInFromRight(),
        exitTransition = NavAnimations.slideOutToLeft(),
        popEnterTransition = NavAnimations.slideInFromLeft(),
        popExitTransition = NavAnimations.slideOutToRight()
    ) { DetailScreen() }
}
```

### 5.2 可用动画

| 动画 | 效果 |
|------|------|
| `NavAnimations.fadeIn()` | 淡入 |
| `NavAnimations.fadeOut()` | 淡出 |
| `NavAnimations.slideInFromRight()` | 从右滑入 |
| `NavAnimations.slideOutToLeft()` | 向左滑出 |
| `NavAnimations.slideInFromLeft()` | 从左滑入 |
| `NavAnimations.slideOutToRight()` | 向右滑出 |
| `NavAnimations.slideInFromBottom()` | 从下滑入 |
| `NavAnimations.slideOutToBottom()` | 向下滑出 |

### 5.3 动画组合

```kotlin
object PageTransitions {
    // 页面推送动画
    val enter = NavAnimations.slideInFromRight()
    val exit = NavAnimations.slideOutToLeft()
    val popEnter = NavAnimations.slideInFromLeft()
    val popExit = NavAnimations.slideOutToRight()
}

object BottomNavTransitions {
    // 底部导航切换动画
    val enter = NavAnimations.fadeIn()
    val exit = NavAnimations.fadeOut()
}
```

---

## 六、嵌套导航

### 6.1 定义嵌套图

```kotlin
NavHost(navController, startDestination = "main") {
    // 主页面
    composable("main") { MainScreen() }
    
    // 嵌套图：购物流程
    navigation(
        startDestination = "shop/home",
        route = "shop"
    ) {
        composable("shop/home") { ShopHomeScreen() }
        composable("shop/detail/{id}") { DetailScreen() }
        composable("shop/cart") { CartScreen() }
    }
    
    // 嵌套图：个人中心
    navigation(
        startDestination = "profile/home",
        route = "profile"
    ) {
        composable("profile/home") { ProfileHomeScreen() }
        composable("profile/settings") { SettingsScreen() }
    }
}
```

### 6.2 导航到嵌套图

```kotlin
// 导航到嵌套图的起始页面
navController.navigate("shop")

// 导航到嵌套图的具体页面
navController.navigate("shop/detail/123")
```

---

## 七、状态保存与恢复

### 7.1 自动状态保存

```kotlin
NavigationBarItem(
    selected = currentRoute == "home",
    onClick = {
        navController.navigate("home") {
            popUpTo("home") { saveState = true }
            restoreState = true
        }
    }
)
```

### 7.2 跨模块导航

```kotlin
// :feature:home 模块
fun NavGraphBuilder.homeNavigation(navController: NavController) {
    composable("home") { HomeScreen(navController) }
    composable("home/search") { SearchScreen() }
}

// :feature:profile 模块
fun NavGraphBuilder.profileNavigation(navController: NavController) {
    navigation(startDestination = "profile/home", route = "profile") {
        composable("profile/home") { ProfileHomeScreen() }
        composable("profile/settings") { SettingsScreen() }
    }
}

// :app 模块
NavHost(navController, startDestination = "home") {
    homeNavigation(navController)
    profileNavigation(navController)
}
```

---

## 八、API 参考

### 8.1 NavController

| 方法 | 说明 |
|------|------|
| `navigate(route)` | 导航到指定路由 |
| `popBackStack()` | 返回上一页 |
| `popBackStack(route, inclusive)` | 返回到指定路由 |
| `currentBackStackEntryAsState()` | 当前返回栈状态 |
| `findStartDestination()` | 获取起始目的地 |

### 8.2 NavGraphBuilder

| 方法 | 说明 |
|------|------|
| `composable(route)` | 定义可组合页面 |
| `navigation(startDestination, route)` | 定义嵌套导航图 |

### 8.3 NavigationBarItem

| 参数 | 说明 |
|------|------|
| `selected` | 是否选中 |
| `onClick` | 点击回调 |
| `icon` | 图标内容 |
| `label` | 标签内容 |
| `enabled` | 是否可用 |
| `alwaysShowLabel` | 是否始终显示标签 |

---

## 九、完整示例

### 9.1 电商应用导航

```kotlin
@Composable
fun ECommerceApp() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = { AppBottomBar(navController) }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(padding)
        ) {
            // 首页
            composable("home") { HomeScreen() }
            
            // 分类（嵌套图）
            navigation("category/list", "category") {
                composable("category/list") { CategoryListScreen() }
                composable("category/detail/{id}") { CategoryDetailScreen() }
            }
            
            // 购物车
            composable("cart") { CartScreen() }
            
            // 我的（嵌套图）
            navigation("profile/home", "profile") {
                composable("profile/home") { ProfileHomeScreen() }
                composable("profile/orders") { OrdersScreen() }
                composable("profile/settings") { SettingsScreen() }
            }
            
            // 商品详情（全屏页面，无底部导航）
            composable(
                "product/{id}",
                enterTransition = NavAnimations.slideInFromRight(),
                exitTransition = NavAnimations.slideOutToRight()
            ) { ProductDetailScreen() }
        }
    }
}

@Composable
fun AppBottomBar(navController: NavController) {
    val items = listOf(
        BottomNavItem("home", "首页", Icons.Default.Home),
        BottomNavItem("category", "分类", Icons.Default.Category),
        BottomNavItem("cart", "购物车", Icons.Default.ShoppingCart),
        BottomNavItem("profile", "我的", Icons.Default.Person)
    )
    
    NavigationBar {
        val currentRoute = navController.currentBackStackEntryAsState()
            .value?.destination?.route
        
        items.forEach { item ->
            NavigationBarItem(
                icon = { Icon(item.icon, null) },
                label = { Text(item.label) },
                selected = currentRoute?.startsWith(item.route) == true,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    }
}

data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector
)
```

---

## 十、Demo 页面

本项目提供了两个 Demo 页面供参考：

1. **NavigationBarDemo** (`navbardemo`) - 基础 NavigationBar 使用示例
2. **NavigationWithAnimationDemo** (`navanimationdemo`) - 带页面跳转动画的完整示例

在 Demo 应用中可以通过页面路由访问这些示例。

---

## 注意事项

1. **状态保持**：使用 `rememberNavController()` 确保配置变更后状态不丢失
2. **返回栈管理**：合理使用 `popUpTo` 避免返回栈无限堆积
3. **动画选择**：底部导航切换建议使用淡入淡出，页面跳转建议使用水平滑动
4. **路由命名**：建议使用简洁的命名，如 `"home"`、`"profile"`、`"product/{id}"`
