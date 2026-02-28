package com.tencent.imakuikly.shared.imageGen

import androidx.compose.runtime.*
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.coil3.rememberAsyncImagePainter
import com.tencent.kuikly.compose.extension.bouncesEnable
import com.tencent.kuikly.compose.extension.keyboardHeightChange
import com.tencent.kuikly.compose.extension.nativeRef
import com.tencent.kuikly.compose.foundation.Image
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.border
import com.tencent.kuikly.compose.foundation.clickable
import com.tencent.kuikly.compose.foundation.gestures.detectTapGestures
import com.tencent.kuikly.compose.foundation.gestures.scrollBy
import com.tencent.kuikly.compose.foundation.layout.*
import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
import com.tencent.kuikly.compose.foundation.lazy.LazyRow
import com.tencent.kuikly.compose.foundation.lazy.items
import com.tencent.kuikly.compose.foundation.lazy.itemsIndexed
import com.tencent.kuikly.compose.foundation.lazy.rememberLazyListState
import com.tencent.kuikly.compose.foundation.shape.CircleShape
import com.tencent.kuikly.compose.foundation.shape.RoundedCornerShape
import com.tencent.kuikly.compose.foundation.text.BasicTextField
import com.tencent.kuikly.compose.material3.*
import com.tencent.kuikly.compose.resources.DrawableResource
import com.tencent.kuikly.compose.resources.InternalResourceApi
import com.tencent.kuikly.compose.resources.painterResource
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.draw.clip
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.graphics.ColorFilter
import com.tencent.kuikly.compose.ui.graphics.painter.ColorPainter
import com.tencent.kuikly.compose.ui.input.pointer.pointerInput
import com.tencent.kuikly.compose.ui.layout.ContentScale
import com.tencent.kuikly.compose.ui.layout.onSizeChanged
import com.tencent.kuikly.compose.ui.platform.LocalActivity
import com.tencent.kuikly.compose.ui.platform.LocalDensity
import com.tencent.kuikly.compose.ui.text.TextStyle
import com.tencent.kuikly.compose.ui.text.font.FontWeight
import com.tencent.kuikly.compose.ui.unit.Dp
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.Attr
import com.tencent.kuikly.core.base.DeclarativeBaseView
import com.tencent.kuikly.core.base.ViewConst
import com.tencent.kuikly.core.base.ViewContainer
import com.tencent.kuikly.core.manager.PagerManager
import com.tencent.kuikly.core.module.RouterModule
import com.tencent.kuikly.core.nvi.serialization.json.JSONObject
import com.tencent.kuikly.core.pager.Pager
import com.tencent.kuikly.core.views.AutoHeightTextAreaView
import com.tencent.kuikly.core.views.DivView
import com.tencent.kuikly.core.views.TextConst
import com.tencent.kuikly.core.views.shadow.TextShadow
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.math.max

// 数据模型定义
data class StyleOption(
    val style: String,
    val imageUrl: String
)

data class ProportionOption(
    val proportion: String,
    val iconUrl: String
)

data class PromptOption(
    val category: String,
    val prompts: List<String>
)

fun genText(): String {
    var text = ""
    for (i in 0..200) {
        text += "helloworld"
    }
    return text
}

data class ImageGenState(
    val inputText: String = genText(),
    val selectedStyle: StyleOption? = null,
    val selectedProportion: ProportionOption? = null,
    val referenceImage: String? = null,
    val showedPromptModal: Boolean = false,
    val selectedPrompts: List<String> = emptyList(),
    val canGenerate: Boolean = false,
    val isGenerating: Boolean = false
)

// 假数据
val mockStyleOptions = listOf(
    StyleOption("风格不限", "https://picsum.photos/72/80?random=1"),
    StyleOption("写实风格", "https://picsum.photos/72/80?random=2"),
    StyleOption("卡通风格", "https://picsum.photos/72/80?random=3"),
    StyleOption("油画风格", "https://picsum.photos/72/80?random=4"),
    StyleOption("水彩风格", "https://picsum.photos/72/80?random=5"),
    StyleOption("素描风格", "https://picsum.photos/72/80?random=6"),
    StyleOption("抽象风格", "https://picsum.photos/72/80?random=7"),
    StyleOption("复古风格", "https://picsum.photos/72/80?random=8"),
    StyleOption("科幻风格", "https://picsum.photos/72/80?random=9"),
    StyleOption("梦幻风格", "https://picsum.photos/72/80?random=10"),
    StyleOption("极简风格", "https://picsum.photos/72/80?random=11"),
    StyleOption("波普风格", "https://picsum.photos/72/80?random=12"),
    StyleOption("印象派", "https://picsum.photos/72/80?random=13"),
    StyleOption("野兽派", "https://picsum.photos/72/80?random=14"),
    StyleOption("立体主义", "https://picsum.photos/72/80?random=15"),
    StyleOption("超现实主义", "https://picsum.photos/72/80?random=16"),
    StyleOption("表现主义", "https://picsum.photos/72/80?random=17"),
    StyleOption("新艺术运动", "https://picsum.photos/72/80?random=18"),
    StyleOption("装饰艺术", "https://picsum.photos/72/80?random=19"),
    StyleOption("现代主义", "https://picsum.photos/72/80?random=20")
)

val mockProportionOptions = listOf(
    ProportionOption("1:1", "https://picsum.photos/20/20?random=21"),
    ProportionOption("4:3", "https://picsum.photos/20/20?random=22"),
    ProportionOption("3:4", "https://picsum.photos/20/20?random=23"),
    ProportionOption("16:9", "https://picsum.photos/20/20?random=24"),
    ProportionOption("9:16", "https://picsum.photos/20/20?random=25"),
    ProportionOption("3:2", "https://picsum.photos/20/20?random=26"),
    ProportionOption("2:3", "https://picsum.photos/20/20?random=27"),
    ProportionOption("5:4", "https://picsum.photos/20/20?random=28"),
    ProportionOption("4:5", "https://picsum.photos/20/20?random=29"),
    ProportionOption("21:9", "https://picsum.photos/20/20?random=30")
)

val mockPromptOptions = listOf(
    PromptOption("场景", listOf("海边", "森林", "城市", "沙漠", "雪山", "草原", "花园", "海滩", "山谷", "湖泊")),
    PromptOption("风格", listOf("写实", "卡通", "油画", "水彩", "素描", "抽象", "复古", "科幻", "梦幻", "极简")),
    PromptOption("色彩", listOf("明亮", "温暖", "冷色调", "黑白", "彩色", "单色", "对比色", "柔和", "鲜艳", "淡雅")),
    PromptOption("情感", listOf("快乐", "宁静", "神秘", "浪漫", "激情", "忧郁", "温馨", "震撼", "轻松", "紧张")),
    PromptOption("主题", listOf("人物", "动物", "风景", "建筑", "静物", "抽象", "幻想", "历史", "未来", "自然"))
)

// 状态管理
class StyleListState {
    val items: List<StyleOption> = mockStyleOptions
}

class ProportionListState {
    val items: List<ProportionOption> = mockProportionOptions
}

class PromptListState {
    val items: List<PromptOption> = mockPromptOptions
}

@Page("AIImageGenPage", supportInLocal = true)
internal class ImageGenPagerTest : ComposeContainer() {

    // 创建状态实例
    private val styleListState = StyleListState()
    private val proportionListState = ProportionListState()
    private val promptListState = PromptListState()
    private val state = ImageGenState(
        selectedStyle = mockStyleOptions[0],
        selectedProportion = mockProportionOptions[0],
        canGenerate = true
    )

    override fun onReceivePagerEvent(pagerEvent: String, eventData: JSONObject) {
        super.onReceivePagerEvent(pagerEvent, eventData)
        println("onReceivePagerEvent ${pagerEvent} ${eventData.toString()}")
    }

    override fun willInit() {
        super.willInit()
        setContent { ComposeImageGenImpl() }
    }

    override fun pageWillDestroy() {
        super.pageWillDestroy()
    }

    @OptIn(InternalResourceApi::class)
    @Composable
    internal fun ComposeImageGenImpl() {
        val localPager = LocalActivity.current.getPager() as Pager
        val keyboardHeight = remember { mutableStateOf(0) }
        
        // 创建状态变量
        var currentState by remember { mutableStateOf(state) }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF7F7F7)),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            TitleBar {  PagerManager.getPager(localPager.pagerId)
                .acquireModule<RouterModule>(RouterModule.MODULE_NAME).closePage() }

            val listState = rememberLazyListState()
            val coroutineScope = rememberCoroutineScope()
            LaunchedEffect(currentState.referenceImage) {
                if (currentState.referenceImage != null) {
                    // 滚动到参考图位置
                    coroutineScope.launch {
                        listState.animateScrollToItem(listState.layoutInfo.totalItemsCount - 1)
                    }
                }
            }

            val cursorPositionHelper = remember { CursorPositionHelper() }
            val density = LocalDensity.current
            LaunchedEffect(keyboardHeight.value) {
                if (keyboardHeight.value > 0) {
                    val result = cursorPositionHelper.cursorPosition(currentState.inputText)
                    val offset = with(density) { result.toPx().toInt() }
                    listState.animateScrollToItem(0, offset)
                }
            }

            LazyColumn(modifier = Modifier.weight(1f), state = listState) {
                item {
                    Spacer(Modifier.height(16.dp))

                    // 风格
                    StyleSection(
                        styles = styleListState.items,
                        selected = currentState.selectedStyle ?: styleListState.items[0],
                        onSelect = { selectedStyle ->
                            currentState = currentState.copy(selectedStyle = selectedStyle)
                        },
                        onLoadMore = { /* 加载更多风格 */ }
                    )

                    Spacer(Modifier.height(16.dp))

                    // 比例
                    ProportionSection(
                        proportions = proportionListState.items,
                        selected = currentState.selectedProportion ?: proportionListState.items[0],
                        onSelect = { selectedProportion ->
                            currentState = currentState.copy(selectedProportion = selectedProportion)
                        },
                        onLoadMore = { /* 加载更多比例 */ }
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                            .height(0.5.dp)
                            .background(Color(0xFFE5E5E5))
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    val isAndroid = LocalActivity.current.pageData.isAndroid
                    val isIOS = LocalActivity.current.pageData.isIOS
                    val scrop = rememberCoroutineScope()
                    val density = LocalDensity.current
                    BasicTextField(
                        value = currentState.inputText,
                        onValueChange = { inputText ->
                            currentState = currentState.copy(
                                inputText = inputText,
                                canGenerate = inputText.isNotBlank()
                            )

                        },
                        onTextLayout = {
                            println("lineCount = " + it.lineCount)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
//                            .padding(horizontal = 16.dp)
                            .keyboardHeightChange {
                                keyboardHeight.value = it.height.toInt()
                            }.nativeRef {
                                cursorPositionHelper.refTo(this)
                            },
                        textStyle = TextStyle(
                            fontSize = 16.sp,
                            color = Color.Black,
                            lineHeight = 22.sp
                        ),
                        decorationBox = { innerTextField ->
                            Box {
                                if (currentState.inputText.isEmpty()) {
                                    Text(
                                        text = "输入想要生成的图片内容,如:做一张穆夏风格的夏日海边度假图",
                                        fontSize = 14.sp,
                                        color = Color.Gray,
                                        lineHeight = 20.sp
                                    )
                                }
                                innerTextField()
                            }
                        }
                    )
                }
                if (currentState.referenceImage != null) {
                    item {
                        Box(Modifier.padding(10.dp)) {
                            Image(
                                painter = rememberAsyncImagePainter(
                                    "https://picsum.photos/20/20?random=21",
                                    placeholder = ColorPainter(Color.Gray)),
                                contentDescription = null,
                                Modifier.size(100.dp).clip(RoundedCornerShape(5.dp))
                            )
                            Box(Modifier
                                .align(Alignment.TopEnd)
                                .offset(x = 10.dp, y = (-10).dp)
                                .size(30.dp)
                                .background(Color.Gray, CircleShape)
                                .clickable {
                                    println("xxxx 删除")
                                currentState = currentState.copy(
                                    referenceImage = null
                                )
                            }) {
                                Text("✕", Modifier.align(Alignment.Center))
                            }
                        }
                    }
                }
            }

            // 底部操作栏
            BottomActionBar(
                state = currentState,
                canGenerate = currentState.canGenerate,
                isGenerating = currentState.isGenerating,
                onGenerate = { /* 生成图片 */ },
                onReference = { /* 选择参考图 */
                    currentState = currentState.copy(
                        referenceImage = "https://picsum.photos/20/20?random=21"
                    )
                },
                onPromptDict = {
                    currentState = currentState.copy(showedPromptModal = true)
                }
            )

            Spacer(Modifier.height(keyboardHeight.value.dp))

            PromptModalView(
                visible = currentState.showedPromptModal,
                prompts = promptListState.items,
                initSelectedTexts = currentState.inputText.split("，").filter { it.isNotBlank() },
                onClickPrompt = { prompt ->
                    val newSelectedPrompts = if (currentState.selectedPrompts.contains(prompt)) {
                        currentState.selectedPrompts - prompt
                    } else {
                        currentState.selectedPrompts + prompt
                    }
                    currentState = currentState.copy(selectedPrompts = newSelectedPrompts)
                },
                onDismiss = {
                    currentState = currentState.copy(showedPromptModal = false)
                },
                selectedPrompts = currentState.selectedPrompts
            )
        }
    }

    @OptIn(InternalResourceApi::class)
    @Composable
    private fun TitleBar(onClose: () -> Unit) {
        Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth().height(44.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "智能生图",
                    fontSize = 17.sp,
                    lineHeight = 24.sp,
                    fontWeight = FontWeight.W500,
                    color = Color.Black
                )

                Box(modifier = Modifier.clickable {
                    onClose()
                }) {
                    Image(
                        modifier = Modifier.size(24.dp),
                        painter = painterResource(DrawableResource("assets://kuikly_close.png")),
                        contentDescription = "close",
                    )
                }
            }

            // 分割线
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(0.5.dp)
                    .background(Color(0xFFE5E5E5))
            )
        }
    }

    @Composable
    private fun StyleSection(
        styles: List<StyleOption>,
        selected: StyleOption,
        onSelect: (StyleOption) -> Unit,
        onLoadMore: () -> Unit
    ) {
        Column {
            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
                Text(
                    text = "风格",
                    fontSize = 14.sp,
                    lineHeight = 16.sp,
                    color = Color.Black,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(styles) { style ->
                    StyleOptionItem(
                        style = style,
                        isSelected = selected == style,
                        onClick = { onSelect(style) }
                    )

                    // 检查是否是倒数第19个item
                    val currentIndex = styles.indexOf(style)
                    if (currentIndex == max(0, styles.size - 19)) {
                        LaunchedEffect(Unit) {
                            onLoadMore()
                        }
                    }
                }
            }
        }
    }

    @OptIn(InternalResourceApi::class)
    @Composable
    private fun StyleOptionItem(
        style: StyleOption,
        isSelected: Boolean,
        onClick: () -> Unit
    ) {
        Box(
            modifier = Modifier
                .width(72.dp)
                .height(80.dp)
                .clickable { onClick() }
                .background(Color(0xFFEFEFEF), RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {

            Image(
                painter = rememberAsyncImagePainter(style.imageUrl),
                contentDescription = style.style,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )

            if (isSelected) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = (-6).dp, y = 6.dp)
                        .size(20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(DrawableResource("assets://kuikly_style_select.png")),
                        contentDescription = style.style,
                        contentScale = ContentScale.Crop
                    )
                }
            }
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
            ) {
                Text(
                    text = style.style,
                    fontSize = 12.sp,
                    color = if (style.style == "风格不限") Color(0xFF079D55) else Color.White,
                    maxLines = 1,
                    modifier = Modifier.align(Alignment.Center)
                )
            }
        }
    }

    @Composable
    private fun ProportionSection(
        proportions: List<ProportionOption>,
        selected: ProportionOption,
        onSelect: (ProportionOption) -> Unit,
        onLoadMore: () -> Unit
    ) {
        Column {
            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
                Text(
                    text = "比例",
                    fontSize = 14.sp,
                    lineHeight = 16.sp,
                    color = Color.Black,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(proportions) { proportion ->
                    ProportionOptionItem(
                        proportion = proportion,
                        isSelected = selected == proportion,
                        onClick = { onSelect(proportion) }
                    )

                    // 检查是否是倒数第19个item
                    val currentIndex = proportions.indexOf(proportion)
                    if (currentIndex == max(0, proportions.size - 19)) {
                        LaunchedEffect(Unit) {
                            onLoadMore()
                        }
                    }
                }
            }
        }
    }

    @Composable
    private fun ProportionOptionItem(
        proportion: ProportionOption,
        isSelected: Boolean,
        onClick: () -> Unit
    ) {
        Box(
            modifier = Modifier
                .width(72.dp)
                .height(32.dp)
                .background(
                    color = if (isSelected) Color(0xFF7ABC98).copy(alpha = 0.10f) else Color(0x0A333333),
                    shape = RoundedCornerShape(8.dp)
                )
                .border(
                    width = 0.5.dp,
                    color = if (isSelected) Color(0xFF079D55) else Color(0xFFE0E0E0),
                    shape = RoundedCornerShape(8.dp)
                )
                .clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Image(
                    painter = rememberAsyncImagePainter(proportion.iconUrl),
                    contentDescription = proportion.proportion,
                    modifier = Modifier.size(20.dp),
                    contentScale = ContentScale.Crop,
                    colorFilter = if (isSelected) ColorFilter.tint(Color(0xFF079D55)) else ColorFilter.tint(Color.Black)
                )

                Text(proportion.proportion, fontSize = 12.sp, color = if (isSelected) Color(0xFF079D55) else Color.Black)
            }

        }

    }

    @OptIn(InternalResourceApi::class)
    @Composable
    private fun BottomActionBar(
        state: ImageGenState,
        canGenerate: Boolean,
        isGenerating: Boolean,
        onGenerate: () -> Unit,
        onReference: () -> Unit,
        onPromptDict: () -> Unit
    ) {
        Column {
            if (state.referenceImage != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp)
                ) {
                    Image(
                        modifier = Modifier.width(120.dp).height(80.dp),
                        painter = painterResource(DrawableResource(state.referenceImage)),
                        contentDescription = "refImage",
                        contentScale = ContentScale.Crop
                    )
                }

            }
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(Color(0xFFF7F7F7))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        ActionButton("参考图", onReference)
                        ActionButton("提示词典", onPromptDict)
                    }
                    Button(
                        onClick = onGenerate,
                        enabled = canGenerate,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (canGenerate && !isGenerating) Color(0xFF333333) else Color(0xFFCCCCCC)
                        ),
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = "生成",
                            fontSize = 14.sp,
                            lineHeight = 16.sp,
                            color = Color.White,
                            fontWeight = FontWeight.W500
                        )
                    }
                }
            }
        }

    }

    @Composable
    private fun ActionButton(
        text: String,
        onClick: () -> Unit
    ) {
        Button(
            onClick = onClick,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0x0A333333)),
            shape = RoundedCornerShape(6.dp),
            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 8.dp)
        ) {
            Text(
                text = text,
                fontSize = 14.sp,
                lineHeight = 16.sp,
                color = Color(0xFF000000).copy(alpha = 0.60f)
            )
        }
    }

    @Composable
    private fun PromptModalView(
        visible: Boolean,
        prompts: List<PromptOption>,
        initSelectedTexts: List<String>,
        selectedPrompts: List<String>,
        onClickPrompt: (String) -> Unit,
        onDismiss: () -> Unit
    ) {
        ModalBottomSheet(
            onDismissRequest = onDismiss,
            visible = visible,
            containerColor = Color.Black.copy(alpha = 0.3F),
        ) {
            Box(
                Modifier
                    .height(598.dp)
                    .background(Color(0x80000000))
            ) {
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxSize()
                        .background(Color.White)
                ) {
                    // 顶部装饰
                    Box(
                        Modifier
                            .align(Alignment.CenterHorizontally)
                            .padding(bottom = 8.dp, top = 4.dp)
                            .width(40.dp)
                            .height(4.dp)
                            .background(Color(0x22000000), RoundedCornerShape(2.dp))
                    )
                    // 主标题
                    Text(
                        "提示词典",
                        color = Color(0xFF222222),
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                    Spacer(Modifier.height(12.dp))

                    // 内容可滑动
                    LazyColumn(
                        modifier = Modifier
                            .weight(1f)
                            .bouncesEnable(false)
                    ) {
                        itemsIndexed(prompts) { index, model ->
                            PromptSection(
                                model = model,
                                selectedPrompts = selectedPrompts,
                                onChipClick = { prompt ->
                                    onClickPrompt(prompt)
                                }
                            )
                            if (index != prompts.lastIndex) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 16.dp)
                                        .height(0.5.dp)
                                        .background(Color(0xFFF0F0F0))
                                )
                            }
                        }
                        item {
                            Spacer(modifier = Modifier.height(34.dp))
                        }
                    }
                }
            }
        }
    }

    @OptIn(ExperimentalLayoutApi::class,
        ExperimentalLayoutApi::class
    )
    @Composable
    fun PromptSection(
        model: PromptOption,
        selectedPrompts: List<String>,
        onChipClick: (String) -> Unit
    ) {
        Text(
            model.category,
            color = Color(0xFFB0B0B0),
            fontSize = 14.sp,
            fontWeight = FontWeight.Normal,
            modifier = Modifier.padding(top = 8.dp, bottom = 12.dp, start = 16.dp)
        )
        FlowRow(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            model.prompts.forEach { prompt ->
                val selected = selectedPrompts.contains(prompt)
                PromptItem(
                    text = prompt,
                    selected = selected,
                    onClick = onChipClick
                )
            }
        }
    }

    @Composable
    fun PromptItem(text: String, selected: Boolean = false, onClick: (String) -> Unit = {}) {
        Box(
            modifier = Modifier
                .background(
                    if (selected) Color(0xFFE6F6ED) else Color(0xFFF6F6F6),
                    RoundedCornerShape(8.dp)
                )
                .pointerInput(Unit) {
                    detectTapGestures(
                        onTap = { onClick(text) }
                    )
                }
                .padding(horizontal = 8.dp, vertical = 8.dp)
        ) {
            Text(
                text,
                color = if (selected) Color(0xFF2DBD7F) else Color(0xFF222222),
                fontSize = 14.sp,
                fontWeight = FontWeight.Normal
            )
        }
    }
}

internal class CursorPositionHelper : RememberObserver {

    var nativeRef: Int = -1
    var shadow: TextShadow? = null
    var textArea: AutoHeightTextAreaView? = null

    override fun onAbandoned() {
        println("CursorPositionHelper onAbandoned called, cleaning up")
        shadow?.removeFromParentComponent()
        shadow = null
        textArea = null
    }

    override fun onForgotten() {
        println("CursorPositionHelper onForgotten called, cleaning up")
        shadow?.removeFromParentComponent()
        shadow = null
        textArea = null
    }

    override fun onRemembered() {
        if (nativeRef == -1) {
            println("CursorPositionHelper onRemembered called, initializing nativeRef")
            nativeRef = DivView().nativeRef
        }
    }

    fun refTo(ref: DeclarativeBaseView<*, *>) {
        if (nativeRef == -1) {
            println("CursorPositionHelper refTo called before onRemembered")
            return
        }
        textArea = ref.findTextArea()
        if (textArea == null) {
            println("CursorPositionHelper refTo called but textArea not found")
            return
        }
        if (shadow == null) {
            println("CursorPositionHelper refTo called, creating TextShadow")
            shadow = TextShadow(ref.pagerId, nativeRef, ViewConst.TYPE_RICH_TEXT)
        }
    }

    private fun DeclarativeBaseView<*, *>.findTextArea(): AutoHeightTextAreaView? {
        if (this is AutoHeightTextAreaView) {
            return this
        } else if (this is ViewContainer) {
            for (i in 0 until childrenSize()) {
                getChild(i).findTextArea()?.also {
                    return it
                }
            }
        }
        return null
    }

    private fun isShadowProp(propKey: String): Boolean {
        return !(propKey == Attr.StyleConst.TRANSFORM
                || propKey == Attr.StyleConst.OPACITY
                || propKey == Attr.StyleConst.VISIBILITY
                || propKey == Attr.StyleConst.BACKGROUND_COLOR
                || propKey == TextConst.TEXT_COLOR
                || propKey == TextConst.TINT_COLOR
                || propKey == TextConst.TEXT_SHADOW
                || propKey == TextConst.VALUE
                || propKey == TextConst.VALUES)
    }

    suspend fun cursorPosition(value: String): Dp {
        val result = textArea?.let { v ->
            val index = suspendCancellableCoroutine<Int> { c ->
                v.cursorIndex { c.resume(it) }
            }
            if (index == 0) {
                println("CursorPositionHelper cursorPosition index is 0")
                return@let 0.dp
            }
            val constraints = v.renderView?.currentFrame ?: return@let 0.dp
            println("CursorPositionHelper cursorPosition constraints: $constraints")
            if (index >= value.length) {
                println("CursorPositionHelper cursorPosition index is at end")
                return@let constraints.height.dp
            }
            // sync prop to shadow
            v.getViewAttr().copyPropsMap().forEach { (key, value) ->
                if (isShadowProp(key)) {
                    shadow?.setProp(key, value)
                }
            }
            shadow?.setProp(TextConst.VALUE, value.subSequence(0, index))

            val measured = shadow?.calculateRenderViewSize(constraints.width, constraints.height)
            println("CursorPositionHelper cursorPosition measured: ${measured?.height}")
            return@let (measured?.height ?: 0f).dp
        } ?: 0.dp
        println("CursorPositionHelper cursorPosition result: $result")
        return result
    }

}