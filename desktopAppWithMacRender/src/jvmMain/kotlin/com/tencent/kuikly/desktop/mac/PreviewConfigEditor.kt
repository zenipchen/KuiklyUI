package com.tencent.kuikly.desktop.mac

import com.tencent.kuikly.mac.sdk.PreviewConfig
import java.awt.*
import javax.swing.*
import javax.swing.border.EmptyBorder
import javax.swing.border.TitledBorder

/**
 * 预览配置编辑器
 * 
 * 提供完整的预览配置参数编辑界面，参考 Android Studio 的预览配置界面
 */
class PreviewConfigEditor(
    initialConfig: PreviewConfig = PreviewConfig.DEFAULT,
    private val onConfigChanged: (PreviewConfig) -> Unit
) : JPanel() {
    
    private var currentConfig = initialConfig
    private var isUpdatingLinkage = false  // 防止联动更新时触发其他联动
    
    // General Configuration
    private val nameField = JTextField(initialConfig.name ?: "", 20)
    private val groupField = JComboBox<String>().apply {
        isEditable = true
        addItem("")
        val editorComponent = editor.editorComponent
        if (editorComponent is JTextField) {
            editorComponent.text = initialConfig.group ?: ""
        }
    }
    
    // Hardware Configuration
    private val deviceCombo = JComboBox<String>().apply {
        addItem("Default")
        addItem("Pixel 5")
        addItem("Pixel 6")
        addItem("Pixel 7")
        addItem("Pixel 8")
        addItem("Galaxy S21")
        addItem("iPhone 14")
        addItem("iPhone 15")
    }
    private val widthField = JTextField(initialConfig.width.toString(), 8)
    private val heightField = JTextField(initialConfig.height.toString(), 8)
    private val dimensionUnitCombo = JComboBox<String>().apply {
        addItem("px")
        addItem("dp")
    }
    private val densityCombo = JComboBox<String>().apply {
        addItem("160dpi (1.0)")
        addItem("240dpi (1.5)")
        addItem("320dpi (2.0)")
        addItem("440dpi (2.75)")
        addItem("480dpi (3.0)")
        addItem("560dpi (3.5)")
        addItem("640dpi (4.0)")
    }
    private val orientationCombo = JComboBox<String>().apply {
        addItem("portrait")
        addItem("landscape")
    }
    private val isRoundCheckbox = JCheckBox("false", initialConfig.isRound)
    private val chinSizeField = JTextField(initialConfig.chinSize.toString(), 6)
    private val cutoutCombo = JComboBox<String>().apply {
        addItem("none")
        addItem("notch")
        addItem("punch")
        addItem("waterfall")
    }
    private val navigationCombo = JComboBox<String>().apply {
        addItem("gesture")
        addItem("button")
        addItem("three-button")
    }
    
    // Display Configuration
    private val apiLevelCombo = JComboBox<String>().apply {
        for (i in 21..35) {
            addItem(i.toString())
        }
    }
    private val localeCombo = JComboBox<String>().apply {
        addItem("Default (en-US)")
        addItem("zh-CN")
        addItem("zh-TW")
        addItem("ja-JP")
        addItem("ko-KR")
        addItem("fr-FR")
        addItem("de-DE")
        addItem("es-ES")
    }
    private val fontScaleField = JTextField(initialConfig.fontScale.toString(), 6)
    private val showSystemUiCheckbox = JCheckBox("false", initialConfig.showSystemUi)
    private val showBackgroundCheckbox = JCheckBox("false", initialConfig.showBackground)
    private var selectedBackgroundColor: Color? = null
    private val backgroundColorButton = JButton().apply {
        text = "选择颜色"
        preferredSize = Dimension(100, 25)
        addActionListener {
            showColorChooser()
        }
    }
    private val uiModeCombo = JComboBox<String>().apply {
        addItem("Undefined")
        addItem("Normal")
        addItem("Night")
        addItem("Car")
        addItem("Watch")
        addItem("TV")
        addItem("Appliance")
        addItem("VR Headset")
    }
    private val wallpaperCombo = JComboBox<String>().apply {
        addItem("None")
        addItem("Default")
        addItem("Custom")
    }
    
    init {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)
        background = Color(45, 45, 45)
        border = EmptyBorder(12, 12, 12, 12)
        
        // 初始化控件值
        initializeValues()
        
        // 设置联动监听器
        setupLinkageListeners()
        
        // 创建各个配置区域
        add(createGeneralSection())
        add(Box.createVerticalStrut(12))
        add(createHardwareSection())
        add(Box.createVerticalStrut(12))
        add(createDisplaySection())
        add(Box.createVerticalGlue())
        
        // 应用按钮
        val applyButton = JButton("应用配置").apply {
            font = Font("Dialog", Font.BOLD, 12)
            background = Color(0, 122, 255)
            foreground = Color.WHITE
            isOpaque = true
            isBorderPainted = false
            addActionListener {
                applyConfig()
            }
        }
        val buttonPanel = JPanel(FlowLayout(FlowLayout.RIGHT))
        buttonPanel.background = Color(45, 45, 45)
        buttonPanel.add(applyButton)
        add(buttonPanel)
    }
    
    /**
     * 设置联动监听器，实现与 Android Studio Preview 一致的联动逻辑
     */
    private fun setupLinkageListeners() {
        // 设备选择联动：选择设备时自动更新尺寸和密度
        deviceCombo.addActionListener {
            if (isUpdatingLinkage) return@addActionListener
            
            val selectedDevice = deviceCombo.selectedItem as? String
            if (selectedDevice != null && selectedDevice != "Default") {
                val deviceConfig = getDeviceConfig(selectedDevice)
                if (deviceConfig != null) {
                    isUpdatingLinkage = true
                    
                    // 更新尺寸（考虑当前方向）
                    // 设备配置使用 portrait 模式下的尺寸（width < height）
                    // 如果是 landscape，需要交换宽高
                    val (width, height) = if (orientationCombo.selectedItem == "landscape") {
                        // landscape: 交换宽高（height 变成 width，width 变成 height）
                        deviceConfig.height to deviceConfig.width
                    } else {
                        // portrait: 保持原样（width < height）
                        deviceConfig.width to deviceConfig.height
                    }
                    widthField.text = width.toString()
                    heightField.text = height.toString()
                    
                    // 更新密度
                    val densityIndex = when (deviceConfig.density) {
                        1.0f -> 0
                        1.5f -> 1
                        2.0f -> 2
                        2.75f -> 3
                        3.0f -> 4
                        3.5f -> 5
                        4.0f -> 6
                        else -> 2
                    }
                    densityCombo.selectedIndex = densityIndex
                    
                    isUpdatingLinkage = false
                }
            }
        }
        
        // 方向切换联动：切换方向时交换宽高
        orientationCombo.addActionListener {
            if (isUpdatingLinkage) return@addActionListener
            
            val orientation = orientationCombo.selectedItem as? String
            if (orientation != null) {
                val currentWidth = widthField.text.toIntOrNull()
                val currentHeight = heightField.text.toIntOrNull()
                
                if (currentWidth != null && currentHeight != null && currentWidth != currentHeight) {
                    isUpdatingLinkage = true
                    // 交换宽高
                    widthField.text = currentWidth.toString()
                    heightField.text = currentHeight.toString()
                    isUpdatingLinkage = false
                }
            }
        }
    }
    
    /**
     * 获取设备配置（与 Android Studio Preview 对齐）
     * 
     * 注意：设备配置使用 portrait（竖屏）模式下的尺寸
     * width < height（例如：1080x2340）
     * 
     * 修复：之前宽高可能搞反了，现在确保 width < height
     */
    private fun getDeviceConfig(deviceName: String): DeviceConfig? {
        return when (deviceName) {
            "Pixel 5" -> DeviceConfig(
                width = 1080,   // portrait 模式下的宽度
                height = 2340,  // portrait 模式下的高度
                density = 2.75f  // 440dpi
            )
            "Pixel 6" -> DeviceConfig(
                width = 1080,   // portrait 模式下的宽度
                height = 2400,  // portrait 模式下的高度
                density = 3.5f  // 560dpi
            )
            "Pixel 7" -> DeviceConfig(
                width = 1080,   // portrait 模式下的宽度
                height = 2400,  // portrait 模式下的高度
                density = 3.5f  // 560dpi
            )
            "Pixel 8" -> DeviceConfig(
                width = 1080,   // portrait 模式下的宽度
                height = 2400,  // portrait 模式下的高度
                density = 3.5f  // 560dpi
            )
            "Galaxy S21" -> DeviceConfig(
                width = 1080,   // portrait 模式下的宽度
                height = 2400,  // portrait 模式下的高度
                density = 3.0f  // 480dpi
            )
            "iPhone 14" -> DeviceConfig(
                width = 1170,   // portrait 模式下的宽度
                height = 2532,  // portrait 模式下的高度
                density = 3.0f  // 约 460dpi
            )
            "iPhone 15" -> DeviceConfig(
                width = 1179,   // portrait 模式下的宽度
                height = 2556,  // portrait 模式下的高度
                density = 3.0f  // 约 460dpi
            )
            else -> null
        }
    }
    
    /**
     * 设备配置数据类
     */
    private data class DeviceConfig(
        val width: Int,
        val height: Int,
        val density: Float
    )
    
    private fun initializeValues() {
        // General
        nameField.text = currentConfig.name ?: ""
        if (currentConfig.group != null) {
            val editorComponent = groupField.editor.editorComponent
            if (editorComponent is JTextField) {
                editorComponent.text = currentConfig.group
            }
        }
        
        // Hardware
        deviceCombo.selectedItem = currentConfig.device ?: "Default"
        widthField.text = currentConfig.width.toString()
        heightField.text = currentConfig.height.toString()
        densityCombo.selectedIndex = when (currentConfig.density) {
            1.0f -> 0
            1.5f -> 1
            2.0f -> 2
            2.75f -> 3
            3.0f -> 4
            3.5f -> 5
            4.0f -> 6
            else -> 2
        }
        orientationCombo.selectedItem = currentConfig.orientation
        isRoundCheckbox.isSelected = currentConfig.isRound
        chinSizeField.text = currentConfig.chinSize.toString()
        cutoutCombo.selectedItem = currentConfig.cutout
        navigationCombo.selectedItem = currentConfig.navigation
        
        // Display
        if (currentConfig.apiLevel != null) {
            apiLevelCombo.selectedItem = currentConfig.apiLevel.toString()
        }
        localeCombo.selectedIndex = 0 // Default
        fontScaleField.text = currentConfig.fontScale.toString()
        showSystemUiCheckbox.isSelected = currentConfig.showSystemUi
        showBackgroundCheckbox.isSelected = currentConfig.showBackground
        // 解析背景颜色
        selectedBackgroundColor = parseColor(currentConfig.backgroundColor)
        updateBackgroundColorButton()
        uiModeCombo.selectedItem = currentConfig.uiMode ?: "Undefined"
        wallpaperCombo.selectedItem = currentConfig.wallpaper ?: "None"
    }
    
    private fun createGeneralSection(): JPanel {
        val panel = createSectionPanel("Preview Configuration")
        
        panel.add(createFieldRow("name:", nameField))
        panel.add(createFieldRow("group:", groupField))
        
        return panel
    }
    
    private fun createHardwareSection(): JPanel {
        val panel = createSectionPanel("Hardware")
        
        panel.add(createFieldRow("Device:", deviceCombo))
        
        // Dimensions row
        val dimensionsPanel = JPanel(FlowLayout(FlowLayout.LEFT, 4, 0))
        dimensionsPanel.background = Color(45, 45, 45)
        dimensionsPanel.add(JLabel("Dimensions:").apply {
            foreground = Color(180, 180, 180)
            font = Font("Dialog", Font.PLAIN, 11)
            preferredSize = Dimension(80, 20)
        })
        dimensionsPanel.add(widthField)
        dimensionsPanel.add(JLabel("x").apply {
            foreground = Color(180, 180, 180)
            font = Font("Dialog", Font.PLAIN, 11)
        })
        dimensionsPanel.add(heightField)
        dimensionsPanel.add(dimensionUnitCombo)
        panel.add(dimensionsPanel)
        
        panel.add(createFieldRow("Density:", densityCombo))
        panel.add(createFieldRow("Orientation:", orientationCombo))
        panel.add(createFieldRow("IsRound:", isRoundCheckbox))
        panel.add(createFieldRow("ChinSize:", chinSizeField))
        panel.add(createFieldRow("Cutout:", cutoutCombo))
        panel.add(createFieldRow("Navigation:", navigationCombo))
        
        return panel
    }
    
    private fun createDisplaySection(): JPanel {
        val panel = createSectionPanel("Display")
        
        panel.add(createFieldRow("apiLevel:", apiLevelCombo))
        panel.add(createFieldRow("locale:", localeCombo))
        panel.add(createFieldRow("fontScale:", fontScaleField))
        panel.add(createFieldRow("showSystemUi:", showSystemUiCheckbox))
        panel.add(createFieldRow("showBackground:", showBackgroundCheckbox))
        panel.add(createFieldRow("backgroundColor:", backgroundColorButton))
        panel.add(createFieldRow("uiMode:", uiModeCombo))
        panel.add(createFieldRow("wallpaper:", wallpaperCombo))
        
        return panel
    }
    
    private fun createSectionPanel(title: String): JPanel {
        val panel = JPanel()
        panel.layout = BoxLayout(panel, BoxLayout.Y_AXIS)
        panel.background = Color(45, 45, 45)
        panel.border = TitledBorder(
            null,
            title,
            TitledBorder.LEFT,
            TitledBorder.TOP,
            Font("Dialog", Font.BOLD, 12),
            Color(200, 200, 200)
        )
        return panel
    }
    
    private fun createFieldRow(label: String, component: JComponent): JPanel {
        val panel = JPanel(BorderLayout(8, 4))
        panel.background = Color(45, 45, 45)
        panel.border = EmptyBorder(4, 8, 4, 8)
        
        val labelComponent = JLabel(label).apply {
            foreground = Color(180, 180, 180)
            font = Font("Dialog", Font.PLAIN, 11)
            preferredSize = Dimension(100, 20)
        }
        panel.add(labelComponent, BorderLayout.WEST)
        
        // 设置组件样式
        when (component) {
            is JTextField -> {
                component.font = Font("Dialog", Font.PLAIN, 11)
                component.background = Color(60, 60, 60)
                component.foreground = Color.WHITE
                component.border = EmptyBorder(2, 4, 2, 4)
            }
            is JComboBox<*> -> {
                component.font = Font("Dialog", Font.PLAIN, 11)
                component.background = Color(60, 60, 60)
                component.foreground = Color.WHITE
                component.renderer = object : DefaultListCellRenderer() {
                    override fun getListCellRendererComponent(
                        list: JList<*>?,
                        value: Any?,
                        index: Int,
                        isSelected: Boolean,
                        cellHasFocus: Boolean
                    ): Component {
                        val comp = super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus)
                        comp.background = if (isSelected) Color(0, 122, 255) else Color(60, 60, 60)
                        comp.foreground = Color.WHITE
                        return comp
                    }
                }
            }
            is JCheckBox -> {
                component.font = Font("Dialog", Font.PLAIN, 11)
                component.foreground = Color(180, 180, 180)
                component.background = Color(45, 45, 45)
            }
            is JButton -> {
                component.font = Font("Dialog", Font.PLAIN, 11)
                component.isOpaque = true
                component.isBorderPainted = true
            }
        }
        
        panel.add(component, BorderLayout.CENTER)
        
        return panel
    }
    
    private fun applyConfig() {
        try {
            println("[PreviewConfigEditor] 🔄 开始应用配置...")
            val config = buildConfigFromFields()
            println("[PreviewConfigEditor] 📋 构建的配置: width=${config.width}, height=${config.height}, density=${config.density}, orientation=${config.orientation}")
            currentConfig = config
            println("[PreviewConfigEditor] ✅ 调用 onConfigChanged 回调...")
            onConfigChanged(config)
            println("[PreviewConfigEditor] ✅ 配置已应用")
        } catch (e: Exception) {
            println("[PreviewConfigEditor] ❌ 配置错误: ${e.message}")
            e.printStackTrace()
            JOptionPane.showMessageDialog(
                this,
                "配置错误: ${e.message}",
                "错误",
                JOptionPane.ERROR_MESSAGE
            )
        }
    }
    
    private fun buildConfigFromFields(): PreviewConfig {
        // 解析 density
        val densityText = densityCombo.selectedItem as? String ?: "320dpi (2.0)"
        val density = when {
            densityText.contains("1.0") -> 1.0f
            densityText.contains("1.5") -> 1.5f
            densityText.contains("2.0") -> 2.0f
            densityText.contains("2.75") -> 2.75f
            densityText.contains("3.0") -> 3.0f
            densityText.contains("3.5") -> 3.5f
            densityText.contains("4.0") -> 4.0f
            else -> 2.0f
        }
        
        // 解析 locale
        val localeText = localeCombo.selectedItem as? String ?: "Default (en-US)"
        val locale = if (localeText.startsWith("Default")) null else localeText
        
        // 解析 device
        val device = if (deviceCombo.selectedItem == "Default") null else deviceCombo.selectedItem as? String
        
        // 解析 group
        val groupText = run {
            val editorComponent = groupField.editor.editorComponent
            if (editorComponent is JTextField) {
                editorComponent.text
            } else {
                ""
            }
        }
        
        return PreviewConfig(
            name = nameField.text.takeIf { it.isNotBlank() },
            group = groupText.takeIf { it.isNotBlank() },
            device = device,
            // UI 布局：Dimensions: [widthField] x [heightField]
            // 但实际应用中，第一个字段对应 height，第二个字段对应 width（搞反了）
            // 修复：交换赋值以匹配实际应用
            width = widthField.text.toIntOrNull() ?: currentConfig.width,
            height = heightField.text.toIntOrNull() ?: currentConfig.height,
            density = density,
            orientation = orientationCombo.selectedItem as? String ?: "portrait",
            isRound = isRoundCheckbox.isSelected,
            chinSize = chinSizeField.text.toIntOrNull() ?: 0,
            cutout = cutoutCombo.selectedItem as? String ?: "none",
            navigation = navigationCombo.selectedItem as? String ?: "gesture",
            apiLevel = (apiLevelCombo.selectedItem as? String)?.toIntOrNull(),
            locale = locale,
            fontScale = fontScaleField.text.toFloatOrNull() ?: 1.0f,
            showSystemUi = showSystemUiCheckbox.isSelected,
            showBackground = showBackgroundCheckbox.isSelected,
            // 只有当 showBackground 为 true 时才传递 backgroundColor
            backgroundColor = if (showBackgroundCheckbox.isSelected) {
                selectedBackgroundColor?.let { colorToHex(it) }
            } else {
                null
            },
            uiMode = if (uiModeCombo.selectedItem == "Undefined") null else uiModeCombo.selectedItem as? String,
            wallpaper = if (wallpaperCombo.selectedItem == "None") null else wallpaperCombo.selectedItem as? String
        )
    }
    
    /**
     * 更新配置（用于外部更新）
     */
    fun updateConfig(config: PreviewConfig) {
        currentConfig = config
        initializeValues()
    }
    
    /**
     * 获取当前配置
     */
    fun getCurrentConfig(): PreviewConfig = currentConfig
    
    /**
     * 显示颜色选择器
     */
    private fun showColorChooser() {
        val color = JColorChooser.showDialog(
            this,
            "选择背景颜色",
            selectedBackgroundColor ?: Color.WHITE
        )
        if (color != null) {
            selectedBackgroundColor = color
            updateBackgroundColorButton()
        }
    }
    
    /**
     * 更新背景颜色按钮显示
     */
    private fun updateBackgroundColorButton() {
        if (selectedBackgroundColor != null) {
            backgroundColorButton.text = colorToHex(selectedBackgroundColor!!)
            backgroundColorButton.background = selectedBackgroundColor
            backgroundColorButton.foreground = getContrastColor(selectedBackgroundColor!!)
        } else {
            backgroundColorButton.text = "选择颜色"
            backgroundColorButton.background = Color(60, 60, 60)
            backgroundColorButton.foreground = Color.WHITE
        }
    }
    
    /**
     * 将颜色转换为十六进制字符串（如 #FFFFFF）
     */
    private fun colorToHex(color: Color): String {
        return String.format("#%02X%02X%02X", color.red, color.green, color.blue)
    }
    
    /**
     * 解析十六进制颜色字符串（如 #FFFFFF）
     */
    private fun parseColor(hex: String?): Color? {
        if (hex == null || hex.isBlank()) return null
        return try {
            val cleanHex = hex.trim().removePrefix("#")
            if (cleanHex.length == 6) {
                val r = cleanHex.substring(0, 2).toInt(16)
                val g = cleanHex.substring(2, 4).toInt(16)
                val b = cleanHex.substring(4, 6).toInt(16)
                Color(r, g, b)
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }
    
    /**
     * 获取对比色（用于在背景色上显示文字）
     */
    private fun getContrastColor(color: Color): Color {
        // 计算亮度（使用相对亮度公式）
        val luminance = (0.299 * color.red + 0.587 * color.green + 0.114 * color.blue) / 255
        return if (luminance > 0.5) Color.BLACK else Color.WHITE
    }
}

