# NavigationBar 完整使用手册

> 基于 Jetpack Compose Navigation 的底部导航栏组件使用指南

## 目录

1. [基础概念](#一基础概念)
2. [基础使用](#二基础使用)
3. [与导航集成](#三与导航集成)
4. [进阶场景](#四进阶场景)
5. [状态管理](#五状态管理)
6. [样式定制](#六样式定制)
7. [完整示例](#七完整示例)

---

## 一、基础概念

### 1.1 核心组件

| 组件 | 说明 | 作用 |
|-----|------|------|
| `NavigationBar` | 底部导航栏容器 | 承载导航项的底部栏 |
| `NavigationBarItem` | 单个导航项 | 包含图标、标签、选中状态 |
| `NavigationBarDefaults` | 默认配置 | 提供默认颜色和样式 |

### 1.2 搭配关系

```
Scaffold (
    ├── topBar: TopAppBar (顶部标题栏)
    ├── bottomBar: NavigationBar (底部导航栏) ← 本手册重点
    ├── content: NavHost (页面内容容器)
    └── floatingActionButton: FAB (浮动按钮)
)
```

### 1.3 关键依赖

```kotlin
dependencies {
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.compose.material3:material3:1.2.0")
}
```

---

## 二、基础使用

### 2.1 最简单的 NavigationBar

```kotlin
@Composable
fun SimpleNavigationBar() {
    var selectedItem by remember { mutableIntStateOf(0) }
    val items = listOf("首页", "分类", "购物车", "我的")
    val icons = listOf(Icons.Default.Home, Icons.Default.Category, 
                       Icons.Default.ShoppingCart, Icons.Default.Person)

    NavigationBar {
        items.forEachIndexed { index, item ->
            NavigationBarItem(
                icon = { Icon(icons[index], contentDescription = item) },
                label = { Text(item) },
                selected = selectedItem == index,
                onClick = { selectedItem = index }
            )
        }
    }
}
```

### 2.2 配合 Scaffold 使用

```kotlin
@Composable
fun MainScreen() {
    var selectedItem by remember { mutableIntStateOf(0) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("我的应用") }
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, null) },
                    label = { Text("首页") },
                    selected = selectedItem == 0,
                    onClick = { selectedItem = 0 }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, null) },
                    label = { Text("我的") },
                    selected = selectedItem == 1,
                    onClick = { selectedItem = 1 }
                )
            }
        }
    ) { innerPadding ->
        // 页面内容，使用 innerPadding 避免被导航栏遮挡
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedItem) {
                0 -> HomeScreen()
                1 -> ProfileScreen()
            }
        }
    }
}
```

---

## 三、与导航集成

### 3.1 基础导航集成

```kotlin
@Composable
fun MainScreenWithNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                // 获取当前导航状态
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route
                
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, null) },
                    label = { Text("首页") },
                    selected = currentRoute == "home",
                    onClick = {
                        navController.navigate("home")
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, null) },
                    label = { Text("我的") },
                    selected = currentRoute == "profile",
                    onClick = {
                        navController.navigate("profile")
                    }
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

### 3.2 最佳实践：状态保存与恢复

```kotlin
@Composable
fun OptimizedNavigationBar(navController: NavController) {
    val items = listOf(
        Screen.Home,
        Screen.Category,
        Screen.Cart,
        Screen.Profile
    )
    
    NavigationBar {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentDestination = navBackStackEntry?.destination
        
        items.forEach { screen ->
            NavigationBarItem(
                icon = { Icon(screen.icon, contentDescription = screen.label) },
                label = { Text(screen.label) },
                selected = currentDestination?.hierarchy?.any { 
                    it.route == screen.route 
                } == true,
                onClick = {
                    navController.navigate(screen.route) {
                        // 弹出到起始页面，避免返回栈堆积
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true  // 保存页面状态
                        }
                        // 避免重复创建同一页面
                        launchSingleTop = true
                        // 恢复之前保存的状态
                        restoreState = true
                    }
                }
            )
        }
    }
}

// 定义屏幕密封类
sealed class Screen(
    val route: String,
    val label: String,
    val icon: ImageVector
) {
    object Home : Screen("home", "首页", Icons.Default.Home)
    object Category : Screen("category", "分类", Icons.Default.Category)
    object Cart : Screen("cart", "购物车", Icons.Default.ShoppingCart)
    object Profile : Screen("profile", "我的", Icons.Default.Person)
}
```

### 3.3 嵌套导航图场景

```kotlin
@Composable
fun AppWithNestedNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = { BottomBar(navController) }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "main",
            modifier = Modifier.padding(innerPadding)
        ) {
            // 主流程
            composable("main") { MainScreen() }
            
            // 嵌套图：购物流程
            navigation(startDestination = "shop/home", route = "shop") {
                composable("shop/home") { ShopHomeScreen() }
                composable("shop/detail/{id}") { DetailScreen() }
                composable("shop/cart") { CartScreen() }
            }
            
            // 嵌套图：个人中心
            navigation(startDestination = "profile/home", route = "profile") {
                composable("profile/home") { ProfileHomeScreen() }
                composable("profile/settings") { SettingsScreen() }
                composable("profile/orders") { OrdersScreen() }
            }
        }
    }
}

@Composable
fun BottomBar(navController: NavController) {
    NavigationBar {
        val currentRoute = navController.currentBackStackEntryAsState()
            .value?.destination?.route
        
        // 匹配嵌套图的路由
        NavigationBarItem(
            icon = { Icon(Icons.Default.ShoppingBag, null) },
            label = { Text("购物") },
            selected = currentRoute?.startsWith("shop") == true,
            onClick = { 
                navController.navigate("shop") {
                    popUpTo("main") { saveState = true }
                    restoreState = true
                }
            }
        )
        
        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, null) },
            label = { Text("我的") },
            selected = currentRoute?.startsWith("profile") == true,
            onClick = { 
                navController.navigate("profile") {
                    popUpTo("main") { saveState = true }
                    restoreState = true
                }
            }
        )
    }
}
```

---

## 四、进阶场景

### 4.1 动态显示/隐藏 NavigationBar

```kotlin
@Composable
fun MainScreenWithDynamicNavBar() {
    val navController = rememberNavController()
    
    // 监听当前路由，决定是否显示底部栏
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    
    // 不需要底部栏的页面
    val routesWithoutNavBar = listOf("splash", "login", "detail/{id}")
    val showBottomBar = currentRoute !in routesWithoutNavBar
    
    Scaffold(
        bottomBar = {
            // 条件显示
            AnimatedVisibility(
                visible = showBottomBar,
                enter = slideInVertically { it },
                exit = slideOutVertically { it }
            ) {
                NavigationBar {
                    // NavigationBarItem...
                }
            }
        }
    ) { innerPadding ->
        NavHost(navController, startDestination = "home") {
            composable("home") { HomeScreen() }
            composable("login") { LoginScreen() }
            composable("detail/{id}") { DetailScreen() }
        }
    }
}
```

### 4.2 带 Badge（角标）的导航项

```kotlin
@Composable
fun NavigationBarWithBadges(navController: NavController, cartItemCount: Int) {
    NavigationBar {
        NavigationBarItem(
            icon = { 
                BadgedBox(
                    badge = {
                        if (cartItemCount > 0) {
                            Badge { Text(cartItemCount.toString()) }
                        }
                    }
                ) {
                    Icon(Icons.Default.ShoppingCart, contentDescription = "购物车")
                }
            },
            label = { Text("购物车") },
            selected = currentRoute == "cart",
            onClick = { navController.navigate("cart") }
        )
        
        // 红点提示
        NavigationBarItem(
            icon = {
                BadgedBox(badge = { Badge() }) {  // 仅显示红点
                    Icon(Icons.Default.Notifications, contentDescription = "消息")
                }
            },
            label = { Text("消息") },
            selected = currentRoute == "messages",
            onClick = { navController.navigate("messages") }
        )
    }
}
```

### 4.3 点击动画与反馈

```kotlin
@Composable
fun AnimatedNavigationBar(navController: NavController) {
    var selectedItem by remember { mutableIntStateOf(0) }
    
    NavigationBar {
        items.forEachIndexed { index, item ->
            NavigationBarItem(
                icon = {
                    // 选中时图标动画
                    AnimatedContent(
                        targetState = selectedItem == index,
                        label = "icon_animation"
                    ) { selected ->
                        if (selected) {
                            Icon(
                                imageVector = item.selectedIcon,
                                contentDescription = item.label,
                                modifier = Modifier.size(28.dp)
                            )
                        } else {
                            Icon(
                                imageVector = item.unselectedIcon,
                                contentDescription = item.label,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                },
                label = { Text(item.label) },
                selected = selectedItem == index,
                onClick = { selectedItem = index },
                // 自定义颜色
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    indicatorColor = MaterialTheme.colorScheme.primaryContainer
                ),
                // 动画配置
                alwaysShowLabel = false  // 仅选中时显示标签
            )
        }
    }
}
```

### 4.4 多模块应用的导航集成

```kotlin
// :app 模块
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = { AppBottomBar(navController) }
    ) { padding ->
        NavHost(navController, startDestination = "home") {
            // 首页模块
            homeNavigation(navController)
            // 分类模块
            categoryNavigation(navController)
            // 购物车模块
            cartNavigation(navController)
            // 个人中心模块
            profileNavigation(navController)
        }
    }
}

// :feature:home 模块
fun NavGraphBuilder.homeNavigation(navController: NavController) {
    composable("home") { HomeScreen(navController) }
    composable("home/search") { SearchScreen() }
    composable("home/recommend") { RecommendScreen() }
}

// :feature:category 模块
fun NavGraphBuilder.categoryNavigation(navController: NavController) {
    navigation(startDestination = "category/list", route = "category") {
        composable("category/list") { CategoryListScreen(navController) }
        composable("category/detail/{id}") { CategoryDetailScreen() }
    }
}
```

---

## 五、状态管理

### 5.1 使用 ViewModel 管理导航状态

```kotlin
class MainViewModel(savedStateHandle: SavedStateHandle) : ViewModel() {
    
    // 保存当前选中的 Tab
    var selectedTab by savedStateHandle.saveable { mutableIntStateOf(0) }
        private set
    
    fun selectTab(index: Int) {
        selectedTab = index
    }
}

@Composable
fun MainScreen(viewModel: MainViewModel = viewModel()) {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, null) },
                        label = { Text(item.label) },
                        selected = viewModel.selectedTab == index,
                        onClick = { viewModel.selectTab(index) }
                    )
                }
            }
        }
    ) { innerPadding ->
        // 使用 selectedTab 切换内容
        when (viewModel.selectedTab) {
            0 -> HomeContent(Modifier.padding(innerPadding))
            1 -> CategoryContent(Modifier.padding(innerPadding))
            // ...
        }
    }
}
```

### 5.2 保存页面状态（滚动位置等）

```kotlin
@Composable
fun StatefulNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = currentRoute == "home",
                    onClick = {
                        navController.navigate("home") {
                            // 关键配置：保存和恢复状态
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = { Icon(Icons.Default.Home, null) },
                    label = { Text("首页") }
                )
            }
        }
    ) { innerPadding ->
        NavHost(navController, startDestination = "home") {
            composable("home") { 
                // 使用 rememberSaveable 保存滚动状态
                HomeScreenWithSavedState() 
            }
        }
    }
}

@Composable
fun HomeScreenWithSavedState() {
    // 自动保存和恢复滚动位置
    val scrollState = rememberLazyListState()
    
    LazyColumn(state = scrollState) {
        items(100) { index ->
            Text("Item $index", modifier = Modifier.padding(16.dp))
        }
    }
}
```

---

## 六、样式定制

### 6.1 自定义颜色

```kotlin
@Composable
fun CustomColorNavigationBar() {
    NavigationBar(
        containerColor = Color(0xFF1A1A2E),  // 背景色
        contentColor = Color.White,           // 内容色
        tonalElevation = 8.dp
    ) {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, null) },
            label = { Text("首页") },
            selected = selected,
            onClick = { },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = Color(0xFFE94560),      // 选中图标色
                selectedTextColor = Color(0xFFE94560),      // 选中文字色
                unselectedIconColor = Color.Gray,           // 未选中图标色
                unselectedTextColor = Color.Gray,           // 未选中文字色
                indicatorColor = Color(0xFF16213E)          // 选中指示器色
            )
        )
    }
}
```

### 6.2 自定义尺寸和间距

```kotlin
@Composable
fun CustomSizeNavigationBar() {
    NavigationBar(
        modifier = Modifier.height(80.dp),  // 自定义高度
        tonalElevation = 0.dp
    ) {
        items.forEach { item ->
            NavigationBarItem(
                icon = { 
                    Icon(
                        item.icon, 
                        null,
                        modifier = Modifier.size(32.dp)  // 自定义图标大小
                    ) 
                },
                label = { 
                    Text(
                        item.label,
                        fontSize = 12.sp  // 自定义文字大小
                    ) 
                },
                selected = selected,
                onClick = { },
                alwaysShowLabel = true  // 始终显示标签
            )
        }
    }
}
```

### 6.3 自定义选中指示器

```kotlin
@Composable
fun CustomIndicatorNavigationBar() {
    NavigationBar {
        items.forEachIndexed { index, item ->
            NavigationBarItem(
                icon = { Icon(item.icon, null) },
                label = { Text(item.label) },
                selected = selectedItem == index,
                onClick = { selectedItem = index },
                // 使用自定义指示器
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (selectedItem == index) 
                            MaterialTheme.colorScheme.primaryContainer 
                        else 
                            Color.Transparent
                    )
            )
        }
    }
}
```

---

## 七、完整示例

### 7.1 完整的电商应用底部导航

```kotlin
@Composable
fun ECommerceApp() {
    val navController = rememberNavController()
    val cartViewModel: CartViewModel = viewModel()
    val unreadMessageCount by remember { mutableIntStateOf(5) }
    
    Scaffold(
        topBar = {
            // 动态标题根据当前页面变化
            val currentRoute = navController.currentBackStackEntryAsState()
                .value?.destination?.route
            TopAppBar(
                title = { 
                    Text(
                        when (currentRoute) {
                            "home" -> "首页"
                            "category" -> "分类"
                            "cart" -> "购物车"
                            "messages" -> "消息"
                            "profile" -> "我的"
                            else -> ""
                        }
                    )
                }
            )
        },
        bottomBar = {
            ECommerceBottomBar(
                navController = navController,
                cartItemCount = cartViewModel.itemCount,
                unreadMessageCount = unreadMessageCount
            )
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { HomeScreen() }
            composable("category") { CategoryScreen() }
            composable("cart") { CartScreen() }
            composable("messages") { MessagesScreen() }
            composable("profile") { ProfileScreen() }
        }
    }
}

@Composable
fun ECommerceBottomBar(
    navController: NavController,
    cartItemCount: Int,
    unreadMessageCount: Int
) {
    val items = listOf(
        BottomNavItem.Home,
        BottomNavItem.Category,
        BottomNavItem.Cart,
        BottomNavItem.Messages,
        BottomNavItem.Profile
    )
    
    NavigationBar {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route
        
        items.forEach { item ->
            NavigationBarItem(
                icon = {
                    when (item) {
                        is BottomNavItem.Cart -> {
                            BadgedBox(
                                badge = {
                                    if (cartItemCount > 0) {
                                        Badge { Text(cartItemCount.toString()) }
                                    }
                                }
                            ) {
                                Icon(item.icon, contentDescription = item.label)
                            }
                        }
                        is BottomNavItem.Messages -> {
                            BadgedBox(
                                badge = {
                                    if (unreadMessageCount > 0) {
                                        Badge { Text(unreadMessageCount.toString()) }
                                    }
                                }
                            ) {
                                Icon(item.icon, contentDescription = item.label)
                            }
                        }
                        else -> {
                            Icon(item.icon, contentDescription = item.label)
                        }
                    }
                },
                label = { Text(item.label) },
                selected = currentRoute == item.route,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary
                ),
                alwaysShowLabel = true
            )
        }
    }
}

sealed class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector
) {
    object Home : BottomNavItem("home", "首页", Icons.Default.Home)
    object Category : BottomNavItem("category", "分类", Icons.Default.Category)
    object Cart : BottomNavItem("cart", "购物车", Icons.Default.ShoppingCart)
    object Messages : BottomNavItem("messages", "消息", Icons.Default.Notifications)
    object Profile : BottomNavItem("profile", "我的", Icons.Default.Person)
}
```

### 7.2 带悬浮按钮的复杂布局

```kotlin
@Composable
fun ComplexLayoutWithNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        topBar = { TopAppBar(title = { Text("应用") }) },
        bottomBar = { MainBottomBar(navController) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* 发布操作 */ },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, "发布")
            }
        },
        floatingActionButtonPosition = FabPosition.Center,  // FAB 居中显示
        content = { innerPadding ->
            Box(modifier = Modifier.padding(innerPadding)) {
                NavHost(navController, startDestination = "home") {
                    composable("home") { HomeScreen() }
                    composable("discover") { DiscoverScreen() }
                    // 占位页面（FAB 中间位置）
                    composable("placeholder") { EmptyScreen() }
                    composable("messages") { MessagesScreen() }
                    composable("profile") { ProfileScreen() }
                }
            }
        }
    )
}

@Composable
fun MainBottomBar(navController: NavController) {
    NavigationBar {
        // 首页
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, null) },
            label = { Text("首页") },
            selected = currentRoute == "home",
            onClick = { navController.navigate("home") }
        )
        // 发现
        NavigationBarItem(
            icon = { Icon(Icons.Default.Explore, null) },
            label = { Text("发现") },
            selected = currentRoute == "discover",
            onClick = { navController.navigate("discover") }
        )
        // 占位（FAB 位置）
        NavigationBarItem(
            icon = { },  // 空图标
            label = { Text("") },  // 空标签
            selected = false,
            onClick = { },
            enabled = false  // 禁用点击
        )
        // 消息
        NavigationBarItem(
            icon = { Icon(Icons.Default.Message, null) },
            label = { Text("消息") },
            selected = currentRoute == "messages",
            onClick = { navController.navigate("messages") }
        )
        // 我的
        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, null) },
            label = { Text("我的") },
            selected = currentRoute == "profile",
            onClick = { navController.navigate("profile") }
        )
    }
}
```

---

## 八、常见问题

### Q1: NavigationBarItem 最多支持几个？

Material Design 建议 **3-5 个**，超过 5 个建议使用 **NavigationRail** 或 **NavigationDrawer**。

### Q2: 如何禁用某个导航项？

```kotlin
NavigationBarItem(
    enabled = false,  // 禁用
    icon = { Icon(Icons.Default.Home, null) },
    label = { Text("首页") },
    selected = false,
    onClick = { }
)
```

### Q3: 如何实现双击 Tab 返回顶部？

```kotlin
NavigationBarItem(
    selected = selected,
    onClick = {
        if (selected) {
            // 已选中时双击返回顶部
            coroutineScope.launch {
                listState.animateScrollToItem(0)
            }
        } else {
            selected = true
        }
    },
    // ...
)
```

### Q4: 如何在特定页面隐藏 NavigationBar？

参考 [4.1 动态显示/隐藏 NavigationBar](#41-动态显示隐藏-navigationbar)。

---

## 九、总结

| 场景 | 推荐方案 |
|-----|---------|
| 基础底部导航 | `NavigationBar` + `NavHost` |
| 状态保存 | `saveState` + `restoreState` |
| 角标提示 | `BadgedBox` + `Badge` |
| 动态显示/隐藏 | `AnimatedVisibility` |
| 多模块应用 | `navigation` 函数定义嵌套图 |
| 大屏适配 | `NavigationSuiteScaffold` |

---

> **提示**：本手册基于 Jetpack Compose Navigation 2.7.x 版本编写，建议保持依赖更新以获得最佳体验。
