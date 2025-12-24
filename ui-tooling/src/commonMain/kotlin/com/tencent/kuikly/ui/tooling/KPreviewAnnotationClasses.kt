package com.tencent.kuikly.ui.tooling

/**
 * Copied from the Android sources: androidx.compose.ui.tooling.preview.MultiPreviews.android.kt
 */

/*@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(name = "Phone", device = PHONE, showSystemUi = true)
@KPreview(name = "Phone - Landscape",
    device = "spec:width = 411dp, height = 891dp, orientation = landscape, dpi = 420",
    showSystemUi = true)
@KPreview(name = "Unfolded Foldable", device = FOLDABLE, showSystemUi = true)
@KPreview(name = "Tablet", device = TABLET, showSystemUi = true)
@KPreview(name = "Desktop", device = DESKTOP, showSystemUi = true)
annotation class KPreviewScreenSizes

    // Reference devices
    const val PHONE = "spec:id=reference_phone,shape=Normal,width=411,height=891,unit=dp,dpi=420"
    const val FOLDABLE =
        "spec:id=reference_foldable,shape=Normal,width=673,height=841,unit=dp,dpi=420"
    const val TABLET = "spec:id=reference_tablet,shape=Normal,width=1280,height=800,unit=dp,dpi=240"
    const val DESKTOP =
        "spec:id=reference_desktop,shape=Normal,width=1920,height=1080,unit=dp,dpi=160"

    // TV devices (not adding 4K since it will be very heavy for preview)
    const val TV_720p = "spec:shape=Normal,width=1280,height=720,unit=dp,dpi=420"
    const val TV_1080p = "spec:shape=Normal,width=1920,height=1080,unit=dp,dpi=420"
*/

private const val mdpi = 160f

@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(name = "Phone", widthDp = 411, heightDp = 891, density = 420/mdpi)
@KPreview(name = "Phone - Landscape", widthDp = 891, heightDp = 411, density = 420/mdpi)
@KPreview(name = "Unfolded Foldable", widthDp = 673, heightDp = 841, density = 420/mdpi)
@KPreview(name = "Tablet", widthDp = 1280, heightDp = 800, density = 240/mdpi)
@KPreview(name = "Desktop", widthDp = 1920, heightDp = 1080, density = 160/mdpi)
annotation class KPreviewScreenSizes

/**
 * A MultiPreview annotation for displaying a @[Composable] method using seven standard font sizes.
 */
@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(name = "85%", fontScale = 0.85f)
@KPreview(name = "100%", fontScale = 1.0f)
@KPreview(name = "115%", fontScale = 1.15f)
@KPreview(name = "130%", fontScale = 1.3f)
@KPreview(name = "150%", fontScale = 1.5f)
@KPreview(name = "180%", fontScale = 1.8f)
@KPreview(name = "200%", fontScale = 2f)
annotation class KPreviewFontScale

/**
 * A MultiPreview annotation for displaying a @[Composable] method using light and dark themes.
 *
 * Note that the app theme should support dark and light modes for these KPreviews to be different.
 */
@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(name = "Light", darkMode = false)
@KPreview(name = "Dark", darkMode = true)
annotation class KPreviewLightDark

/**
 * A MultiKPreview annotation for displaying a @[Composable] method using four different wallpaper colors.
 *
 * Note that the app should use a dynamic theme for these KPreviews to be different.
 */
/*@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(name = "Red", wallpaper = RED_DOMINATED_EXAMPLE)
@KPreview(name = "Blue", wallpaper = BLUE_DOMINATED_EXAMPLE)
@KPreview(name = "Green", wallpaper = GREEN_DOMINATED_EXAMPLE)
@KPreview(name = "Yellow", wallpaper = YELLOW_DOMINATED_EXAMPLE)
annotation class KPreviewDynamicColors
*/
//TODO dynamic themes are not supported by multiplatform i think. So not sure if this is possible to support.


/**
 * Annotation classes to check if the App handles WindowInsets correctly.
 * Also known as edge-to-edge support.
 * @see https://developer.android.com/develop/ui/compose/system/insets
 */
@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(
    name = "Phone portrait Gesture", widthDp = 411, heightDp = 891,
    displayCutout = DisplayCutoutMode.CameraTop,
    statusBar = true,
    navigationBar = NavigationBarMode.GestureBottom,
)
@KPreview(
    name = "Phone portrait 3button", widthDp = 411, heightDp = 891,
    displayCutout = DisplayCutoutMode.CameraTop,
    statusBar = true,
    navigationBar = NavigationBarMode.ThreeButtonBottom,
)
@KPreview(
    name = "Phone landscape gesture", widthDp = 891, heightDp = 411,
    displayCutout = DisplayCutoutMode.CameraLeft,
    statusBar = true,
    navigationBar = NavigationBarMode.GestureBottom,
)
@KPreview(
    name = "Phone landscape nav left", widthDp = 891, heightDp = 411,
    displayCutout = DisplayCutoutMode.CameraRight,
    statusBar = true,
    navigationBar = NavigationBarMode.ThreeButtonLeft,
)
@KPreview(
    name = "Phone landscape nav right", widthDp = 891, heightDp = 411,
    displayCutout = DisplayCutoutMode.CameraLeft,
    statusBar = true,
    navigationBar = NavigationBarMode.ThreeButtonRight,
)
@KPreview(
    name = "Tablet caption bar", widthDp = 673, heightDp = 841,
    captionBar = true
)
annotation class KPreviewWindowInsets

/**
 * Annotation classes to check if the App handles WindowInsets correctly.
 * It simulates `window.isNavigationBarContrastEnforced = false`
 * @see https://developer.android.com/develop/ui/compose/system/system-bars
 *
 */
@Retention(AnnotationRetention.BINARY)
@Target(
    AnnotationTarget.ANNOTATION_CLASS,
    AnnotationTarget.FUNCTION
)
@KPreview(
    name = "Phone portrait Gesture", widthDp = 411, heightDp = 891,
    displayCutout = DisplayCutoutMode.CameraTop,
    statusBar = true,
    navigationBar = NavigationBarMode.GestureBottom,
)
@KPreview(
    name = "Phone portrait 3button", widthDp = 411, heightDp = 891,
    displayCutout = DisplayCutoutMode.CameraTop,
    statusBar = true,
    navigationBar = NavigationBarMode.ThreeButtonBottom,
    navigationBarContrastEnforced = false
)
@KPreview(
    name = "Phone landscape gesture", widthDp = 891, heightDp = 411,
    displayCutout = DisplayCutoutMode.CameraLeft,
    statusBar = true,
    navigationBar = NavigationBarMode.GestureBottom,
    navigationBarContrastEnforced = false
)
@KPreview(
    name = "Phone landscape nav left", widthDp = 891, heightDp = 411,
    displayCutout = DisplayCutoutMode.CameraRight,
    statusBar = true,
    navigationBar = NavigationBarMode.ThreeButtonLeft,
    navigationBarContrastEnforced = false
)
@KPreview(
    name = "Phone landscape nav right", widthDp = 891, heightDp = 411,
    displayCutout = DisplayCutoutMode.CameraLeft,
    statusBar = true,
    navigationBar = NavigationBarMode.ThreeButtonRight,
    navigationBarContrastEnforced = false
)
@KPreview(
    name = "Tablet caption bar", widthDp = 673, heightDp = 841,
    captionBar = true
)
annotation class KPreviewWindowInsetsNC