# Kuikly IDEA Plugin 实时预览设计方案

## 1. 项目概述

### 1.1 目标
开发一个 IntelliJ IDEA Plugin，为 Kuikly 项目提供实时预览功能，让开发者在编码时能够即时看到 UI 效果，提高开发效率。

### 1.2 核心功能
- 📱 实时预览 Kuikly 页面（自研 DSL 和 Compose DSL）
- 🔄 代码修改即时更新预览
- 🎯 支持热重载（HotReload）
- 📍 点击预览定位到代码
- 🖼️ 支持多设备预览（手机、平板尺寸）
- 🎨 支持主题切换（亮色/暗色）

### 1.3 技术栈选择
- **Plugin 框架**: IntelliJ Platform Plugin SDK
- **UI 框架**: Compose for Desktop（用于渲染预览）
- **通信机制**: KSP + 反射 + 文件监听
- **构建工具**: Gradle

## 2. 整体架构设计

### 2.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    IDEA Plugin                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           UI Layer (Tool Window)                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │ Preview     │  │ Device       │  │ Theme      │  │  │
│  │  │ Canvas      │  │ Selector     │  │ Switcher   │  │  │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Preview Engine                              │  │
│  │  • Compose for Desktop Runtime                       │  │
│  │  • Kuikly Desktop Renderer (新增)                    │  │
│  │  • Layout & Render Pipeline                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Code Analysis & Hot Reload                      │  │
│  │  • File Watcher                                       │  │
│  │  • PSI Tree Parser                                    │  │
│  │  • Dynamic Class Loading                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Kuikly Project Integration                    │  │
│  │  • KSP Processor Integration                          │  │
│  │  • Gradle Build Integration                           │  │
│  │  • Module Dependency Management                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Kuikly Project (User Code)                      │
│  • @Page Annotated Classes                                  │
│  • @HotPreview Composables                                  │
│  • Custom Views & Components                                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

#### 2.2.1 Preview Engine（预览引擎）
负责实际的 UI 渲染和显示。

**关键点**：
- 基于 Compose for Desktop 实现
- **需要新增 `core-render-desktop` 模块**
- 复用 Kuikly Compose 的渲染管道

#### 2.2.2 Code Analyzer（代码分析器）
负责分析和监听代码变化。

**功能**：
- 监听 Kotlin 文件变化
- 解析 PSI 树找到 @Page 和 @HotPreview
- 触发热重载

#### 2.2.3 Hot Reload Manager（热重载管理器）
负责动态加载和更新代码。

**策略**：
- 增量编译
- 动态类加载
- 状态保持

## 3. 详细设计

### 3.1 新增 core-render-desktop 模块

首先需要为 Kuikly 项目添加桌面渲染支持。

#### 3.1.1 目录结构

```
core-render-desktop/
├── build.gradle.kts
└── src/
    └── jvmMain/
        └── kotlin/
            └── com/tencent/kuikly/core/render/desktop/
                ├── KuiklyDesktopRenderView.kt
                ├── KuiklyDesktopRenderCore.kt
                ├── KuiklyDesktopBridge.kt
                ├── views/
                │   ├── DesktopViewRenderer.kt
                │   ├── DesktopTextRenderer.kt
                │   ├── DesktopImageRenderer.kt
                │   └── ...
                └── compose/
                    └── ComposeDesktopIntegration.kt
```

#### 3.1.2 核心实现

**KuiklyDesktopRenderView.kt**:
```kotlin
package com.tencent.kuikly.core.render.desktop

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import com.tencent.kuikly.core.pager.Pager
import javax.swing.JPanel

/**
 * Kuikly 桌面渲染视图
 * 桥接 Kuikly Core 和 Compose Desktop
 */
class KuiklyDesktopRenderView : JPanel() {
    
    private val composePanel = ComposePanel()
    private var currentPager: Pager? = null
    
    init {
        add(composePanel)
    }
    
    /**
     * 渲染 Kuikly Pager
     */
    fun renderPager(pager: Pager) {
        currentPager = pager
        composePanel.setContent {
            KuiklyPagerRenderer(pager)
        }
    }
    
    /**
     * 刷新渲染
     */
    fun refresh() {
        currentPager?.let { renderPager(it) }
    }
}

/**
 * 将 Kuikly Pager 渲染为 Compose Desktop UI
 */
@Composable
private fun KuiklyPagerRenderer(pager: Pager) {
    // 这里需要实现 Kuikly DSL 到 Compose 的转换
    // 可以复用 compose 模块的 ComposeSceneMediator 逻辑
    Box(modifier = Modifier) {
        // 渲染 Pager 的 body()
        when (pager) {
            is ComposeContainer -> {
                // Compose DSL 页面直接渲染
                pager.willInit()
                // setContent 会被调用
            }
            else -> {
                // 自研 DSL 页面需要转换
                RenderCustomDSL(pager)
            }
        }
    }
}

/**
 * 渲染自研 DSL
 */
@Composable
private fun RenderCustomDSL(pager: Pager) {
    // 将 ViewBuilder DSL 转换为 Compose
    // 这是关键部分，需要实现 DSL 到 Compose 的映射
    
    DisposableEffect(pager) {
        pager.willInit()
        onDispose {
            // 清理资源
        }
    }
    
    // 遍历 pager.body() 生成的 View 树
    // 转换为对应的 Compose 组件
    Box {
        Text("Desktop Render: ${pager::class.simpleName}")
        // TODO: 实现完整的 DSL 到 Compose 转换
    }
}
```

**KuiklyDesktopBridge.kt**:
```kotlin
package com.tencent.kuikly.core.render.desktop

import com.tencent.kuikly.core.base.RenderView
import com.tencent.kuikly.core.nvi.NativeBridge

/**
 * 桌面平台 Bridge 实现
 */
class KuiklyDesktopBridge : NativeBridge() {
    
    override fun createRenderView(): RenderView {
        return DesktopRenderView()
    }
    
    override fun platformName(): String = "Desktop"
    
    override fun isDesktop(): Boolean = true
    
    // 实现其他 Bridge 接口...
}

class DesktopRenderView : RenderView {
    // 实现 RenderView 接口
    // 适配桌面平台的渲染
}
```

#### 3.1.3 build.gradle.kts

```kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose") version "1.7.3"
}

kotlin {
    jvm {
        withJava()
    }
    
    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation(project(":core"))
                implementation(project(":compose"))
                
                // Compose for Desktop
                implementation(compose.desktop.currentOs)
                implementation(compose.foundation)
                implementation(compose.material3)
            }
        }
    }
}
```

### 3.2 IDEA Plugin 实现

#### 3.2.1 Plugin 项目结构

```
kuikly-idea-plugin/
├── build.gradle.kts
├── src/
│   └── main/
│       ├── kotlin/
│       │   └── com/tencent/kuikly/plugin/
│       │       ├── KuiklyPlugin.kt
│       │       ├── ui/
│       │       │   ├── KuiklyPreviewToolWindow.kt
│       │       │   ├── PreviewPanel.kt
│       │       │   └── DeviceSelector.kt
│       │       ├── analyzer/
│       │       │   ├── KuiklyFileWatcher.kt
│       │       │   ├── PageAnnotationScanner.kt
│       │       │   └── HotPreviewScanner.kt
│       │       ├── engine/
│       │       │   ├── PreviewEngine.kt
│       │       │   ├── HotReloadManager.kt
│       │       │   └── DynamicClassLoader.kt
│       │       └── actions/
│       │           ├── OpenPreviewAction.kt
│       │           └── RefreshPreviewAction.kt
│       └── resources/
│           ├── META-INF/
│           │   └── plugin.xml
│           └── icons/
│               └── kuikly.svg
└── README.md
```

#### 3.2.2 plugin.xml 配置

```xml
<idea-plugin>
    <id>com.tencent.kuikly.plugin</id>
    <name>Kuikly Preview</name>
    <vendor email="kuikly@tencent.com" url="https://kuikly.tds.qq.com">
        Tencent Kuikly Team
    </vendor>
    
    <description><![CDATA[
        Kuikly real-time preview plugin for IntelliJ IDEA.
        Provides instant UI preview for Kuikly pages during development.
        
        Features:
        - Real-time preview for @Page annotated classes
        - Hot preview for @HotPreview Composables
        - Multiple device size emulation
        - Theme switching (Light/Dark)
        - Click to navigate to source code
    ]]></description>
    
    <depends>com.intellij.modules.platform</depends>
    <depends>org.jetbrains.kotlin</depends>
    <depends>org.jetbrains.compose</depends>
    
    <extensions defaultExtensionNs="com.intellij">
        <!-- Tool Window -->
        <toolWindow
            id="Kuikly Preview"
            anchor="right"
            icon="/icons/kuikly.svg"
            factoryClass="com.tencent.kuikly.plugin.ui.KuiklyPreviewToolWindowFactory"/>
        
        <!-- File Type -->
        <fileType
            name="Kuikly Page"
            implementationClass="com.tencent.kuikly.plugin.KuiklyPageFileType"
            fieldName="INSTANCE"
            language="kotlin"
            extensions="kt"/>
        
        <!-- Annotator -->
        <annotator
            language="kotlin"
            implementationClass="com.tencent.kuikly.plugin.analyzer.PageAnnotationAnnotator"/>
    </extensions>
    
    <actions>
        <!-- Main Menu -->
        <group id="KuiklyPreviewMenu" text="Kuikly" popup="true">
            <add-to-group group-id="MainMenu" anchor="last"/>
            
            <action
                id="Kuikly.OpenPreview"
                class="com.tencent.kuikly.plugin.actions.OpenPreviewAction"
                text="Open Preview"
                description="Open Kuikly preview window"
                icon="/icons/kuikly.svg">
                <keyboard-shortcut first-keystroke="ctrl alt P" keymap="$default"/>
            </action>
            
            <action
                id="Kuikly.RefreshPreview"
                class="com.tencent.kuikly.plugin.actions.RefreshPreviewAction"
                text="Refresh Preview"
                description="Refresh Kuikly preview">
                <keyboard-shortcut first-keystroke="ctrl alt R" keymap="$default"/>
            </action>
        </group>
        
        <!-- Editor Popup Menu -->
        <action
            id="Kuikly.PreviewThisPage"
            class="com.tencent.kuikly.plugin.actions.PreviewCurrentPageAction"
            text="Preview This Page"
            description="Preview current Kuikly page"
            icon="/icons/kuikly.svg">
            <add-to-group group-id="EditorPopupMenu" anchor="first"/>
        </action>
    </actions>
</idea-plugin>
```

#### 3.2.3 核心代码实现

**KuiklyPreviewToolWindow.kt**:
```kotlin
package com.tencent.kuikly.plugin.ui

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory
import javax.swing.*

/**
 * Kuikly 预览工具窗口工厂
 */
class KuiklyPreviewToolWindowFactory : ToolWindowFactory {
    
    override fun createToolWindowContent(
        project: Project,
        toolWindow: ToolWindow
    ) {
        val previewPanel = KuiklyPreviewPanel(project)
        val content = ContentFactory.getInstance()
            .createContent(previewPanel, "Preview", false)
        toolWindow.contentManager.addContent(content)
    }
}

/**
 * Kuikly 预览面板
 */
class KuiklyPreviewPanel(
    private val project: Project
) : JPanel() {
    
    private val previewEngine = PreviewEngine(project)
    private val deviceSelector = DeviceSelector()
    private val themeSelector = ThemeSelector()
    private val pageSelector = PageSelector(project)
    
    init {
        layout = BorderLayout()
        
        // 工具栏
        val toolbar = createToolbar()
        add(toolbar, BorderLayout.NORTH)
        
        // 预览区域
        val previewArea = previewEngine.getRenderView()
        add(previewArea, BorderLayout.CENTER)
        
        // 状态栏
        val statusBar = createStatusBar()
        add(statusBar, BorderLayout.SOUTH)
        
        // 初始化
        initialize()
    }
    
    private fun createToolbar(): JComponent {
        val toolbar = JPanel(FlowLayout(FlowLayout.LEFT))
        
        // 页面选择器
        toolbar.add(JLabel("Page:"))
        toolbar.add(pageSelector)
        
        // 设备选择器
        toolbar.add(JLabel("Device:"))
        toolbar.add(deviceSelector)
        
        // 主题选择器
        toolbar.add(JLabel("Theme:"))
        toolbar.add(themeSelector)
        
        // 刷新按钮
        val refreshButton = JButton("Refresh")
        refreshButton.addActionListener {
            refreshPreview()
        }
        toolbar.add(refreshButton)
        
        return toolbar
    }
    
    private fun createStatusBar(): JComponent {
        val statusBar = JPanel(FlowLayout(FlowLayout.LEFT))
        statusBar.add(JLabel("Ready"))
        return statusBar
    }
    
    private fun initialize() {
        // 扫描项目中的 @Page 和 @HotPreview
        scanKuiklyPages()
        
        // 监听文件变化
        setupFileWatcher()
    }
    
    private fun scanKuiklyPages() {
        val scanner = PageAnnotationScanner(project)
        val pages = scanner.findAllPages()
        pageSelector.updatePages(pages)
    }
    
    private fun setupFileWatcher() {
        val watcher = KuiklyFileWatcher(project) { changedFile ->
            // 文件变化时触发热重载
            onFileChanged(changedFile)
        }
        watcher.start()
    }
    
    private fun onFileChanged(file: VirtualFile) {
        // 热重载逻辑
        SwingUtilities.invokeLater {
            refreshPreview()
        }
    }
    
    fun refreshPreview() {
        val selectedPage = pageSelector.getSelectedPage() ?: return
        previewEngine.renderPage(
            selectedPage,
            deviceSelector.getSelectedDevice(),
            themeSelector.getSelectedTheme()
        )
    }
}
```

**PreviewEngine.kt**:
```kotlin
package com.tencent.kuikly.plugin.engine

import com.intellij.openapi.project.Project
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.render.desktop.KuiklyDesktopRenderView
import javax.swing.JComponent

/**
 * 预览引擎
 * 负责实际的渲染工作
 */
class PreviewEngine(
    private val project: Project
) {
    
    private val renderView = KuiklyDesktopRenderView()
    private val hotReloadManager = HotReloadManager(project)
    private val classLoader = DynamicClassLoader(project)
    
    /**
     * 获取渲染视图
     */
    fun getRenderView(): JComponent {
        return renderView
    }
    
    /**
     * 渲染页面
     */
    fun renderPage(
        pageInfo: PageInfo,
        device: DeviceConfig,
        theme: ThemeConfig
    ) {
        try {
            // 动态加载页面类
            val pagerClass = classLoader.loadClass(pageInfo.fullClassName)
            val pager = pagerClass.getDeclaredConstructor().newInstance() as Pager
            
            // 应用设备配置
            renderView.setSize(device.width, device.height)
            
            // 应用主题配置
            // TODO: 实现主题切换
            
            // 渲染
            renderView.renderPager(pager)
            
        } catch (e: Exception) {
            showError("Failed to render page: ${e.message}")
        }
    }
    
    private fun showError(message: String) {
        // 显示错误信息
    }
}
```

**PageAnnotationScanner.kt**:
```kotlin
package com.tencent.kuikly.plugin.analyzer

import com.intellij.openapi.project.Project
import com.intellij.psi.PsiManager
import com.intellij.psi.search.FileTypeIndex
import com.intellij.psi.search.GlobalSearchScope
import org.jetbrains.kotlin.idea.KotlinFileType
import org.jetbrains.kotlin.psi.KtClass
import org.jetbrains.kotlin.psi.KtFile

/**
 * 扫描项目中的 @Page 注解
 */
class PageAnnotationScanner(
    private val project: Project
) {
    
    /**
     * 查找所有带 @Page 注解的类
     */
    fun findAllPages(): List<PageInfo> {
        val pages = mutableListOf<PageInfo>()
        val psiManager = PsiManager.getInstance(project)
        
        // 查找所有 Kotlin 文件
        val kotlinFiles = FileTypeIndex.getFiles(
            KotlinFileType.INSTANCE,
            GlobalSearchScope.projectScope(project)
        )
        
        kotlinFiles.forEach { virtualFile ->
            val psiFile = psiManager.findFile(virtualFile) as? KtFile ?: return@forEach
            
            // 查找 @Page 注解的类
            psiFile.classes.forEach { ktClass ->
                val pageAnnotation = ktClass.findAnnotation(
                    "com.tencent.kuikly.core.annotations.Page"
                )
                
                if (pageAnnotation != null) {
                    val pageName = pageAnnotation.findAttributeValue("name")?.text
                        ?.removeSurrounding("\"") ?: ktClass.name
                    
                    pages.add(
                        PageInfo(
                            name = pageName,
                            className = ktClass.name ?: "",
                            fullClassName = ktClass.fqName?.asString() ?: "",
                            file = virtualFile
                        )
                    )
                }
            }
        }
        
        return pages
    }
    
    /**
     * 查找所有带 @HotPreview 注解的 Composable 函数
     */
    fun findAllHotPreviews(): List<HotPreviewInfo> {
        // 类似实现
        return emptyList()
    }
}

/**
 * 页面信息
 */
data class PageInfo(
    val name: String,
    val className: String,
    val fullClassName: String,
    val file: VirtualFile
)

data class HotPreviewInfo(
    val name: String,
    val functionName: String,
    val file: VirtualFile
)
```

**HotReloadManager.kt**:
```kotlin
package com.tencent.kuikly.plugin.engine

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile

/**
 * 热重载管理器
 * 负责监听文件变化并触发重新加载
 */
class HotReloadManager(
    private val project: Project
) {
    
    private val compilationQueue = mutableListOf<VirtualFile>()
    private var isCompiling = false
    
    /**
     * 文件发生变化
     */
    fun onFileChanged(file: VirtualFile) {
        compilationQueue.add(file)
        
        if (!isCompiling) {
            startIncrementalCompilation()
        }
    }
    
    /**
     * 增量编译
     */
    private fun startIncrementalCompilation() {
        isCompiling = true
        
        // 使用 Kotlin 编译器 API 进行增量编译
        // 或者调用 Gradle 的增量编译任务
        
        // 编译完成后重新加载类
        val files = compilationQueue.toList()
        compilationQueue.clear()
        
        files.forEach { file ->
            reloadClasses(file)
        }
        
        isCompiling = false
    }
    
    /**
     * 重新加载类
     */
    private fun reloadClasses(file: VirtualFile) {
        // 使用自定义 ClassLoader 重新加载编译后的类
        // 保持状态（如果可能）
    }
}
```

**DynamicClassLoader.kt**:
```kotlin
package com.tencent.kuikly.plugin.engine

import com.intellij.openapi.project.Project
import java.net.URLClassLoader

/**
 * 动态类加载器
 * 支持热重载
 */
class DynamicClassLoader(
    private val project: Project
) : URLClassLoader(arrayOf()) {
    
    /**
     * 加载编译后的类
     */
    override fun loadClass(name: String): Class<*> {
        // 从项目的编译输出目录加载类
        val compiledClass = findCompiledClass(name)
        
        if (compiledClass != null) {
            return defineClass(name, compiledClass, 0, compiledClass.size)
        }
        
        return super.loadClass(name)
    }
    
    private fun findCompiledClass(name: String): ByteArray? {
        // 查找编译后的 .class 文件
        // 通常在 build/classes/kotlin/main/ 目录下
        val classPath = name.replace('.', '/') + ".class"
        
        // 读取字节码
        return null // TODO: 实现
    }
    
    /**
     * 清除缓存，用于热重载
     */
    fun clearCache() {
        // 清除已加载的类缓存
    }
}
```

### 3.3 设备和主题配置

**DeviceConfig.kt**:
```kotlin
package com.tencent.kuikly.plugin.ui

/**
 * 设备配置
 */
data class DeviceConfig(
    val name: String,
    val width: Int,
    val height: Int,
    val density: Float = 1.0f
) {
    companion object {
        val PHONE_SMALL = DeviceConfig("Phone (小)", 360, 640, 2.0f)
        val PHONE_MEDIUM = DeviceConfig("Phone (中)", 390, 844, 3.0f)
        val PHONE_LARGE = DeviceConfig("Phone (大)", 414, 896, 3.0f)
        val TABLET_7 = DeviceConfig("Tablet 7\"", 600, 960, 1.5f)
        val TABLET_10 = DeviceConfig("Tablet 10\"", 800, 1280, 1.5f)
        val DESKTOP = DeviceConfig("Desktop", 1280, 800, 1.0f)
        
        fun getAllDevices() = listOf(
            PHONE_SMALL,
            PHONE_MEDIUM,
            PHONE_LARGE,
            TABLET_7,
            TABLET_10,
            DESKTOP
        )
    }
}

/**
 * 主题配置
 */
enum class ThemeConfig {
    LIGHT,
    DARK,
    SYSTEM;
    
    override fun toString(): String {
        return when (this) {
            LIGHT -> "亮色"
            DARK -> "暗色"
            SYSTEM -> "跟随系统"
        }
    }
}

/**
 * 设备选择器
 */
class DeviceSelector : JComboBox<DeviceConfig>() {
    init {
        DeviceConfig.getAllDevices().forEach { addItem(it) }
        selectedItem = DeviceConfig.PHONE_MEDIUM
        
        renderer = object : DefaultListCellRenderer() {
            override fun getListCellRendererComponent(
                list: JList<*>?,
                value: Any?,
                index: Int,
                isSelected: Boolean,
                cellHasFocus: Boolean
            ): Component {
                val component = super.getListCellRendererComponent(
                    list, value, index, isSelected, cellHasFocus
                )
                if (value is DeviceConfig) {
                    text = "${value.name} (${value.width}×${value.height})"
                }
                return component
            }
        }
    }
    
    fun getSelectedDevice(): DeviceConfig {
        return selectedItem as DeviceConfig
    }
}

/**
 * 主题选择器
 */
class ThemeSelector : JComboBox<ThemeConfig>() {
    init {
        ThemeConfig.values().forEach { addItem(it) }
        selectedItem = ThemeConfig.LIGHT
    }
    
    fun getSelectedTheme(): ThemeConfig {
        return selectedItem as ThemeConfig
    }
}
```

## 4. 构建配置

### 4.1 kuikly-idea-plugin/build.gradle.kts

```kotlin
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.21"
    id("org.jetbrains.intellij") version "1.17.4"
    id("org.jetbrains.compose") version "1.7.3"
}

group = "com.tencent.kuikly"
version = "1.0.0"

repositories {
    mavenCentral()
    google()
}

dependencies {
    // Kuikly 核心依赖
    implementation(project(":core"))
    implementation(project(":compose"))
    implementation(project(":core-render-desktop"))
    
    // Compose for Desktop
    implementation(compose.desktop.currentOs)
    implementation(compose.foundation)
    implementation(compose.material3)
    
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test")
}

intellij {
    version.set("2024.2")
    type.set("IC") // IntelliJ IDEA Community Edition
    plugins.set(listOf("org.jetbrains.kotlin", "org.jetbrains.compose"))
}

tasks {
    patchPluginXml {
        sinceBuild.set("232")
        untilBuild.set("242.*")
    }
    
    signPlugin {
        certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
        privateKey.set(System.getenv("PRIVATE_KEY"))
        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
    }
    
    publishPlugin {
        token.set(System.getenv("PUBLISH_TOKEN"))
    }
    
    runIde {
        jvmArgs = listOf("-Xmx2048m")
    }
}
```

## 5. 实施计划

### 5.1 阶段一：基础设施（2-3 周）
- [ ] 创建 `core-render-desktop` 模块
- [ ] 实现基础的桌面渲染器
- [ ] 实现 Kuikly DSL 到 Compose Desktop 的转换
- [ ] 测试桌面渲染功能

### 5.2 阶段二：Plugin 基础（2-3 周）
- [ ] 搭建 IDEA Plugin 项目结构
- [ ] 实现 Tool Window UI
- [ ] 实现 @Page 注解扫描
- [ ] 实现基础预览功能

### 5.3 阶段三：热重载（2-3 周）
- [ ] 实现文件监听
- [ ] 实现增量编译集成
- [ ] 实现动态类加载
- [ ] 实现状态保持

### 5.4 阶段四：增强功能（2-3 周）
- [ ] 多设备尺寸支持
- [ ] 主题切换
- [ ] 点击预览定位代码
- [ ] 性能优化
- [ ] 错误提示优化

### 5.5 阶段五：测试和发布（1-2 周）
- [ ] 完整功能测试
- [ ] 编写文档
- [ ] 发布到 JetBrains Marketplace

**总计**: 9-14 周

## 6. 技术难点与解决方案

### 6.1 难点一：自研 DSL 到 Compose 的转换

**问题**：
Kuikly 自研 DSL（ViewBuilder）与 Compose 是两套不同的 UI 体系，需要实现转换。

**解决方案**：
1. 构建 DSL AST 解析器
2. 创建 View -> Compose 映射表
3. 实现运行时转换引擎

```kotlin
// 示例映射
View       -> Box
Text       -> Text
Image      -> Image
ListView   -> LazyColumn
```

### 6.2 难点二：热重载时的状态保持

**问题**：
代码修改后重新加载，如何保持 UI 状态（如滚动位置、输入内容）。

**解决方案**：
1. 使用 Compose 的 `rememberSaveable`
2. 序列化关键状态
3. 智能识别代码变更范围，局部刷新

### 6.3 难点三：动态类加载

**问题**：
Java ClassLoader 的父委托模型导致类无法真正"重新加载"。

**解决方案**：
1. 为每次热重载创建新的 ClassLoader
2. 使用 OSGI 或类似的模块化系统
3. 或者采用进程隔离方案

### 6.4 难点四：性能优化

**问题**：
频繁的文件监听、编译、重载可能影响性能。

**解决方案**：
1. 防抖处理文件变更事件
2. 增量编译，只编译变更文件
3. 异步加载和渲染
4. 缓存编译结果

## 7. 使用示例

### 7.1 开发者工作流

**步骤 1**: 安装 Plugin
```
IDEA -> Preferences -> Plugins -> Marketplace
搜索 "Kuikly Preview" -> Install -> Restart
```

**步骤 2**: 打开 Kuikly 项目
```
File -> Open -> 选择 KuiklyUI 项目
```

**步骤 3**: 打开预览窗口
```
View -> Tool Windows -> Kuikly Preview
或使用快捷键: Ctrl+Alt+P (Win/Linux) / Cmd+Option+P (Mac)
```

**步骤 4**: 选择要预览的页面
```
在预览窗口的 Page 下拉框中选择页面
或者在代码编辑器中右键 -> Preview This Page
```

**步骤 5**: 实时编码和预览
```
修改代码 -> 自动保存 -> 预览自动更新
或点击刷新按钮手动刷新
```

### 7.2 快捷键

| 功能 | Windows/Linux | Mac |
|------|--------------|-----|
| 打开预览 | Ctrl+Alt+P | Cmd+Option+P |
| 刷新预览 | Ctrl+Alt+R | Cmd+Option+R |
| 预览当前页面 | 右键菜单 | 右键菜单 |

## 8. 未来扩展

### 8.1 短期规划（3-6 个月）
- [ ] 支持 iOS 模拟器预览
- [ ] 支持 Android 模拟器预览
- [ ] 支持鸿蒙模拟器预览
- [ ] 交互式预览（点击、滚动等）
- [ ] 性能分析工具集成

### 8.2 长期规划（6-12 个月）
- [ ] AI 辅助 UI 设计
- [ ] 拖拽式可视化编辑
- [ ] 组件库可视化浏览
- [ ] 协同预览（多人同时查看）
- [ ] 云端预览（无需本地环境）

## 9. 参考资料

### 9.1 官方文档
- [IntelliJ Platform Plugin SDK](https://plugins.jetbrains.com/docs/intellij/welcome.html)
- [Compose for Desktop](https://www.jetbrains.com/lp/compose-desktop/)
- [Kotlin Compiler API](https://kotlinlang.org/docs/compiler-reference.html)

### 9.2 类似项目
- [Flutter Dev Tools](https://docs.flutter.dev/tools/devtools/overview)
- [Jetpack Compose Preview](https://developer.android.com/jetpack/compose/tooling/previews)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

### 9.3 技术博客
- [Hot Reload in IntelliJ Platform](https://blog.jetbrains.com/platform/)
- [Custom Tool Windows in IntelliJ](https://plugins.jetbrains.com/docs/intellij/tool-windows.html)

---

**文档维护者**: Kuikly 团队  
**创建时间**: 2025-09-30  
**文档版本**: v1.0  

如有问题或建议，请联系 kuikly@tencent.com
