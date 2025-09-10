@core-ksp/ 帮忙基于 core-ksp，增加一个基于 HotPreview 注解，针对 Composable 函数 生成 独立Pager 额外用于预览，例如
AccessibilityDemo 它的生成结果可以是

@Page("AccessibilityDemoPreview")
internal class AccessibilityDemoPreviewPager : ComposeContainer() {
    override fun willInit() {
        super.willInit()
        setContent {
            AccessibilityDemo()
        }
    }
}

注意这个 Pager 的生成也要参与@Page 注解的处理，希望能够收集到这个映射