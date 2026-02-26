/**
 * Kuikly DSL 示例代码集合
 * 
 * 重要 API 说明（自研 DSL）：
 * - 文本颜色: color(Color.RED) 而不是 textColor()
 * - 字重: fontWeightBold() 而不是 fontWeight(FontWeight.BOLD)
 * - 文字对齐: textAlignCenter() 而不是 textAlign(TextAlign.CENTER)
 * - justifyContent 参数: FlexJustifyContent 而不是 FlexAlign
 * - width/height 只接受 Float，不接受 Percentage
 * - Color 构造函数接受 Long: Color(0xFF6366F1) 不需要 .toInt()
 * - overflow 接受 Boolean: overflow(true) 而不是 overflow(Overflow.HIDDEN)
 */
const KuiklyExamples = {
    // ========== 自研 DSL 示例 ==========
    'hello-world': {
        name: 'Hello World',
        type: 'dsl',
        code: `@Page("PreviewPage")
internal class PreviewPage : BasePager() {

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                backgroundColor(Color.WHITE)
            }

            View {
                attr {
                    flexDirectionColumn()
                    allCenter()
                    flex(1f)
                }

                Text {
                    attr {
                        text("Hello Kuikly!")
                        fontSize(32f)
                        fontWeightBold()
                        color(Color(0xFF6366F1))
                        textAlignCenter()
                    }
                }

                Text {
                    attr {
                        text("欢迎使用 Kuikly DSL Editor")
                        fontSize(16f)
                        color(Color.GRAY)
                        marginTop(12f)
                    }
                }
            }
        }
    }

    override fun createEvent(): ComposeEvent = ComposeEvent()
}`
    },

    'counter': {
        name: '计数器',
        type: 'dsl',
        code: `@Page("PreviewPage")
internal class PreviewPage : BasePager() {

    var count: Int by observable(0)

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                backgroundColor(Color.WHITE)
            }

            View {
                attr {
                    flexDirectionColumn()
                    allCenter()
                    flex(1f)
                }

                Text {
                    attr {
                        text("计数器示例")
                        fontSize(24f)
                        fontWeightBold()
                        color(Color.BLACK)
                    }
                }

                Text {
                    attr {
                        text("\${ctx.count}")
                        fontSize(64f)
                        fontWeightBold()
                        color(Color(0xFF6366F1))
                        marginTop(24f)
                    }
                }

                View {
                    attr {
                        flexDirectionRow()
                        marginTop(32f)
                    }

                    // 减少按钮
                    View {
                        attr {
                            width(80f)
                            height(44f)
                            backgroundColor(Color.RED)
                            borderRadius(12f)
                            allCenter()
                            marginRight(16f)
                        }
                        event {
                            click {
                                ctx.count--
                            }
                        }
                        Text {
                            attr {
                                text("- 1")
                                fontSize(18f)
                                color(Color.WHITE)
                                fontWeightBold()
                            }
                        }
                    }

                    // 增加按钮
                    View {
                        attr {
                            width(80f)
                            height(44f)
                            backgroundColor(Color(0xFF22C55E))
                            borderRadius(12f)
                            allCenter()
                        }
                        event {
                            click {
                                ctx.count++
                            }
                        }
                        Text {
                            attr {
                                text("+ 1")
                                fontSize(18f)
                                color(Color.WHITE)
                                fontWeightBold()
                            }
                        }
                    }
                }
            }
        }
    }

    override fun createEvent(): ComposeEvent = ComposeEvent()
}`
    },

    'list-view': {
        name: '列表视图',
        type: 'dsl',
        code: `@Page("PreviewPage")
internal class PreviewPage : BasePager() {

    val dataList by observableList<String>()

    override fun created() {
        super.created()
        for (i in 0..20) {
            dataList.add("列表项 #\$i")
        }
    }

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                backgroundColor(Color(0xFFF5F5F5))
            }

            // 标题栏
            View {
                attr {
                    height(56f)
                    backgroundColor(Color(0xFF6366F1))
                    allCenter()
                }
                Text {
                    attr {
                        text("列表视图示例")
                        fontSize(18f)
                        fontWeightBold()
                        color(Color.WHITE)
                    }
                }
            }

            List {
                attr {
                    flex(1f)
                }
                vfor({ ctx.dataList }) { item ->
                    View {
                        attr {
                            height(60f)
                            backgroundColor(Color.WHITE)
                            marginBottom(1f)
                            paddingLeft(16f)
                            paddingRight(16f)
                            flexDirectionRow()
                            alignItemsCenter()
                        }

                        View {
                            attr {
                                width(40f)
                                height(40f)
                                borderRadius(20f)
                                backgroundColor(Color(0xFF6366F1))
                                allCenter()
                                marginRight(12f)
                            }
                            Text {
                                attr {
                                    text("K")
                                    color(Color.WHITE)
                                    fontSize(18f)
                                    fontWeightBold()
                                }
                            }
                        }

                        Text {
                            attr {
                                text(item)
                                fontSize(16f)
                                color(Color(0xFF333333))
                            }
                        }
                    }
                }
            }
        }
    }

    override fun createEvent(): ComposeEvent = ComposeEvent()
}`
    },

    'flex-layout': {
        name: 'Flex 布局',
        type: 'dsl',
        code: `@Page("PreviewPage")
internal class PreviewPage : BasePager() {

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                backgroundColor(Color.WHITE)
            }

            // 标题
            View {
                attr {
                    padding(16f)
                    backgroundColor(Color(0xFF6366F1))
                }
                Text {
                    attr {
                        text("Flex 布局示例")
                        fontSize(18f)
                        fontWeightBold()
                        color(Color.WHITE)
                    }
                }
            }

            Scroller {
                attr {
                    flex(1f)
                    padding(16f)
                }

                // Row 布局
                Text {
                    attr {
                        text("横向排列 (Row)")
                        fontSize(14f)
                        color(Color.GRAY)
                        marginBottom(8f)
                    }
                }
                View {
                    attr {
                        flexDirectionRow()
                        justifyContentSpaceBetween()
                        marginBottom(24f)
                    }
                    View {
                        attr {
                            width(80f)
                            height(80f)
                            backgroundColor(Color.RED)
                            borderRadius(8f)
                        }
                    }
                    View {
                        attr {
                            width(80f)
                            height(80f)
                            backgroundColor(Color(0xFF22C55E))
                            borderRadius(8f)
                        }
                    }
                    View {
                        attr {
                            width(80f)
                            height(80f)
                            backgroundColor(Color.BLUE)
                            borderRadius(8f)
                        }
                    }
                }

                // Column 布局
                Text {
                    attr {
                        text("纵向排列 (Column)")
                        fontSize(14f)
                        color(Color.GRAY)
                        marginBottom(8f)
                    }
                }
                View {
                    attr {
                        flexDirectionColumn()
                        alignItemsCenter()
                        marginBottom(24f)
                    }
                    View {
                        attr {
                            height(50f)
                            backgroundColor(Color(0xFFF59E0B))
                            borderRadius(8f)
                            marginBottom(8f)
                            alignSelf(FlexAlign.STRETCH)
                        }
                    }
                    View {
                        attr {
                            width(250f)
                            height(50f)
                            backgroundColor(Color(0xFF8B5CF6))
                            borderRadius(8f)
                            marginBottom(8f)
                        }
                    }
                    View {
                        attr {
                            width(180f)
                            height(50f)
                            backgroundColor(Color(0xFFEC4899))
                            borderRadius(8f)
                        }
                    }
                }

                // Flex 比例布局
                Text {
                    attr {
                        text("Flex 比例分配")
                        fontSize(14f)
                        color(Color.GRAY)
                        marginBottom(8f)
                    }
                }
                View {
                    attr {
                        flexDirectionRow()
                        height(60f)
                    }
                    View {
                        attr {
                            flex(1f)
                            height(60f)
                            backgroundColor(Color(0xFF06B6D4))
                            borderRadius(8f)
                            marginRight(8f)
                        }
                    }
                    View {
                        attr {
                            flex(2f)
                            height(60f)
                            backgroundColor(Color(0xFF6366F1))
                            borderRadius(8f)
                            marginRight(8f)
                        }
                    }
                    View {
                        attr {
                            flex(1f)
                            height(60f)
                            backgroundColor(Color(0xFF06B6D4))
                            borderRadius(8f)
                        }
                    }
                }
            }
        }
    }

    override fun createEvent(): ComposeEvent = ComposeEvent()
}`
    },

    'image-demo': {
        name: '图片示例',
        type: 'dsl',
        code: `@Page("PreviewPage")
internal class PreviewPage : BasePager() {

    override fun body(): ViewBuilder {
        val ctx = this
        return {
            attr {
                backgroundColor(Color(0xFFF5F5F5))
            }

            View {
                attr {
                    height(56f)
                    backgroundColor(Color(0xFF6366F1))
                    allCenter()
                }
                Text {
                    attr {
                        text("图片示例")
                        fontSize(18f)
                        fontWeightBold()
                        color(Color.WHITE)
                    }
                }
            }

            Scroller {
                attr {
                    flex(1f)
                    padding(16f)
                }

                // 圆形头像
                View {
                    attr {
                        alignItemsCenter()
                        marginBottom(24f)
                    }
                    Image {
                        attr {
                            src("https://picsum.photos/200")
                            width(100f)
                            height(100f)
                            borderRadius(50f)
                        }
                    }
                    Text {
                        attr {
                            text("圆形头像")
                            fontSize(14f)
                            color(Color.GRAY)
                            marginTop(8f)
                        }
                    }
                }

                // 图片网格
                View {
                    attr {
                        flexDirectionRow()
                        flexWrap(FlexWrap.WRAP)
                        justifyContentSpaceBetween()
                    }
                    View {
                        attr {
                            width(160f)
                            height(150f)
                            marginBottom(12f)
                            borderRadius(12f)
                            overflow(true)
                        }
                        Image {
                            attr {
                                src("https://picsum.photos/300/200?random=1")
                                width(160f)
                                height(150f)
                            }
                        }
                    }
                    View {
                        attr {
                            width(160f)
                            height(150f)
                            marginBottom(12f)
                            borderRadius(12f)
                            overflow(true)
                        }
                        Image {
                            attr {
                                src("https://picsum.photos/300/200?random=2")
                                width(160f)
                                height(150f)
                            }
                        }
                    }
                    View {
                        attr {
                            width(160f)
                            height(150f)
                            marginBottom(12f)
                            borderRadius(12f)
                            overflow(true)
                        }
                        Image {
                            attr {
                                src("https://picsum.photos/300/200?random=3")
                                width(160f)
                                height(150f)
                            }
                        }
                    }
                    View {
                        attr {
                            width(160f)
                            height(150f)
                            marginBottom(12f)
                            borderRadius(12f)
                            overflow(true)
                        }
                        Image {
                            attr {
                                src("https://picsum.photos/300/200?random=4")
                                width(160f)
                                height(150f)
                            }
                        }
                    }
                }
            }
        }
    }

    override fun createEvent(): ComposeEvent = ComposeEvent()
}`
    },

    // ========== Compose DSL 示例 ==========
    'compose-box': {
        name: 'Box 布局',
        type: 'compose',
        code: `@Page("PreviewPage")
class PreviewPage : ComposeContainer() {

    override fun willInit() {
        super.willInit()
        setContent {
            BoxDemo()
        }
    }

    @Composable
    fun BoxDemo() {
        Column(
            modifier = Modifier.fillMaxSize().background(Color.White).padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "Box 布局示例",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF6366F1)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // 层叠 Box
            Box(
                modifier = Modifier.size(200.dp).background(Color(0xFFE0E0E0)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier.size(150.dp).background(Color(0xFF6366F1))
                )
                Box(
                    modifier = Modifier.size(100.dp).background(Color(0xFF8B5CF6))
                )
                Box(
                    modifier = Modifier.size(50.dp).background(Color.White)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text("层叠效果: 多个 Box 叠加", fontSize = 14.sp, color = Color.Gray)
        }
    }
}`
    },

    'compose-column': {
        name: 'Column 布局',
        type: 'compose',
        code: `@Page("PreviewPage")
class PreviewPage : ComposeContainer() {

    override fun willInit() {
        super.willInit()
        setContent {
            ColumnDemo()
        }
    }

    @Composable
    fun ColumnDemo() {
        Column(
            modifier = Modifier.fillMaxSize().background(Color.White)
        ) {
            // 顶部标题栏
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(Color(0xFF6366F1))
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "Column 布局示例",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            Column(
                modifier = Modifier.fillMaxSize().padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // 卡片1
                Box(
                    modifier = Modifier.fillMaxWidth().background(Color(0xFFF0F0FF))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(48.dp).background(Color(0xFF6366F1)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("1", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("第一项", fontWeight = FontWeight.Bold)
                            Text("这是一个卡片描述", fontSize = 14.sp, color = Color.Gray)
                        }
                    }
                }

                // 卡片2
                Box(
                    modifier = Modifier.fillMaxWidth().background(Color(0xFFF0FFF0))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(48.dp).background(Color(0xFF22C55E)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("2", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("第二项", fontWeight = FontWeight.Bold)
                            Text("这是另一个卡片描述", fontSize = 14.sp, color = Color.Gray)
                        }
                    }
                }

                // 卡片3
                Box(
                    modifier = Modifier.fillMaxWidth().background(Color(0xFFFFF0F0))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(48.dp).background(Color(0xFFEF4444)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("3", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("第三项", fontWeight = FontWeight.Bold)
                            Text("这是第三个卡片描述", fontSize = 14.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}`
    },

    'compose-lazy': {
        name: 'LazyColumn',
        type: 'compose',
        code: `@Page("PreviewPage")
class PreviewPage : ComposeContainer() {

    override fun willInit() {
        super.willInit()
        setContent {
            LazyColumnDemo()
        }
    }

    @Composable
    fun LazyColumnDemo() {
        Column(
            modifier = Modifier.fillMaxSize().background(Color.White)
        ) {
            // 顶部标题
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(Color(0xFF6366F1))
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "LazyColumn 列表",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(30) { index ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(64.dp)
                            .background(Color(0xFFF5F5F5))
                            .padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .background(
                                    Color(
                                        listOf(
                                            0xFF6366F1,
                                            0xFF22C55E,
                                            0xFFEF4444,
                                            0xFFF59E0B,
                                            0xFF8B5CF6
                                        )[index % 5]
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                "\${index + 1}",
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                "列表项 #\${index + 1}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Text(
                                "这是第 \${index + 1} 项的描述",
                                fontSize = 13.sp,
                                color = Color.Gray
                            )
                        }
                    }
                }
            }
        }
    }
}`
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KuiklyExamples;
}
