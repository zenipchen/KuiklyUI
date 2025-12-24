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
        val PHONE_SMALL = DeviceConfig("手机 (小)", 360, 640, 2.0f)
        val PHONE_MEDIUM = DeviceConfig("手机 (中)", 390, 844, 3.0f)
        val PHONE_LARGE = DeviceConfig("手机 (大)", 414, 896, 3.0f)
        val TABLET_7 = DeviceConfig("平板 7\"", 600, 960, 1.5f)
        val TABLET_10 = DeviceConfig("平板 10\"", 800, 1280, 1.5f)
        
        fun getAllDevices() = listOf(
            PHONE_SMALL,
            PHONE_MEDIUM,
            PHONE_LARGE,
            TABLET_7,
            TABLET_10
        )
    }
    
    override fun toString(): String {
        return "$name (${width}×${height})"
    }
}

