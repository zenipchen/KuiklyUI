package com.tencent.kuikly.mac.sdk

/**
 * 预览配置参数
 * 
 * 用于配置预览的各种参数，包括硬件配置、显示配置等
 */
data class PreviewConfig(
    // General Configuration
    val name: String? = null,
    val group: String? = null,
    
    // Hardware Configuration
    val device: String? = null,  // 设备名称，如 "Pixel 5"
    val width: Int = 400,        // 宽度（像素）
    val height: Int = 800,       // 高度（像素）
    val density: Float = 2.0f,   // 屏幕密度（dpi），如 440dpi = 2.75f (440/160)
    val orientation: String = "portrait",  // 方向: "portrait" 或 "landscape"
    val isRound: Boolean = false,  // 是否为圆角屏幕
    val chinSize: Int = 0,        // 下巴尺寸（像素）
    val cutout: String = "none",  // 刘海类型: "none", "notch", "punch", etc.
    val navigation: String = "gesture",  // 导航方式: "gesture", "button", etc.
    
    // Display Configuration
    val apiLevel: Int? = null,    // API 级别，如 35
    val locale: String? = null,  // 语言环境，如 "en-US"
    val fontScale: Float = 1.0f,  // 字体缩放比例
    val showSystemUi: Boolean = false,  // 是否显示系统 UI
    val showBackground: Boolean = false,  // 是否显示背景
    val backgroundColor: String? = null,  // 背景颜色（十六进制，如 "#FFFFFF"）
    val uiMode: String? = null,  // UI 模式: "Undefined", "Normal", "Night", etc.
    val wallpaper: String? = null  // 壁纸: "None", "Default", etc.
) {
    /**
     * 将配置转换为 Map，用于传递给服务器
     */
    fun toMap(): Map<String, Any> {
        val map = mutableMapOf<String, Any>()
        
        // General
        name?.let { map["name"] = it }
        group?.let { map["group"] = it }
        
        // Hardware
        device?.let { map["device"] = it }
        map["width"] = width
        map["height"] = height
        map["density"] = density
        map["orientation"] = orientation
        map["isRound"] = isRound
        map["chinSize"] = chinSize
        map["cutout"] = cutout
        map["navigation"] = navigation
        
        // Display
        apiLevel?.let { map["apiLevel"] = it }
        locale?.let { map["locale"] = it }
        map["fontScale"] = fontScale
        map["showSystemUi"] = showSystemUi
        map["showBackground"] = showBackground
        backgroundColor?.let { map["backgroundColor"] = it }
        uiMode?.let { map["uiMode"] = it }
        wallpaper?.let { map["wallpaper"] = it }
        
        return map
    }
    
    companion object {
        /**
         * 从 Map 创建配置
         */
        fun fromMap(map: Map<String, Any>): PreviewConfig {
            return PreviewConfig(
                name = map["name"] as? String,
                group = map["group"] as? String,
                device = map["device"] as? String,
                width = (map["width"] as? Number)?.toInt() ?: 400,
                height = (map["height"] as? Number)?.toInt() ?: 800,
                density = (map["density"] as? Number)?.toFloat() ?: 2.0f,
                orientation = map["orientation"] as? String ?: "portrait",
                isRound = map["isRound"] as? Boolean ?: false,
                chinSize = (map["chinSize"] as? Number)?.toInt() ?: 0,
                cutout = map["cutout"] as? String ?: "none",
                navigation = map["navigation"] as? String ?: "gesture",
                apiLevel = (map["apiLevel"] as? Number)?.toInt(),
                locale = map["locale"] as? String,
                fontScale = (map["fontScale"] as? Number)?.toFloat() ?: 1.0f,
                showSystemUi = map["showSystemUi"] as? Boolean ?: false,
                showBackground = map["showBackground"] as? Boolean ?: false,
                backgroundColor = map["backgroundColor"] as? String,
                uiMode = map["uiMode"] as? String,
                wallpaper = map["wallpaper"] as? String
            )
        }
        
        /**
         * 默认配置
         */
        val DEFAULT = PreviewConfig()
        
        /**
         * Pixel 5 配置
         */
        val PIXEL_5 = PreviewConfig(
            device = "Pixel 5",
            width = 1080,
            height = 2340,
            density = 2.75f,  // 440dpi / 160 = 2.75
            orientation = "portrait",
            apiLevel = 35
        )
        
        /**
         * Pixel 6 配置
         */
        val PIXEL_6 = PreviewConfig(
            device = "Pixel 6",
            width = 1080,
            height = 2400,
            density = 3.5f,  // 560dpi / 160 = 3.5
            orientation = "portrait",
            apiLevel = 35
        )
        
        /**
         * Pixel 7 配置
         */
        val PIXEL_7 = PreviewConfig(
            device = "Pixel 7",
            width = 1080,
            height = 2400,
            density = 3.5f,  // 560dpi / 160 = 3.5
            orientation = "portrait",
            apiLevel = 35
        )
        
        /**
         * Pixel 8 配置
         */
        val PIXEL_8 = PreviewConfig(
            device = "Pixel 8",
            width = 1080,
            height = 2400,
            density = 3.5f,  // 560dpi / 160 = 3.5
            orientation = "portrait",
            apiLevel = 35
        )
        
        /**
         * Galaxy S21 配置
         */
        val GALAXY_S21 = PreviewConfig(
            device = "Galaxy S21",
            width = 1080,
            height = 2400,
            density = 3.0f,  // 480dpi / 160 = 3.0
            orientation = "portrait",
            apiLevel = 35
        )
    }
}

