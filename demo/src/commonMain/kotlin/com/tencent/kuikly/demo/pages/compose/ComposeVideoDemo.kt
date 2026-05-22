/*
 * Tencent is pleased to support the open source community by making KuiklyUI
 * available.
 * Copyright (C) 2025 Tencent. All rights reserved.
 * Licensed under the License of KuiklyUI;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://github.com/Tencent-TDS/KuiklyUI/blob/main/LICENSE
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

@file:OptIn(ExperimentalFoundationApi::class)

package com.tencent.kuikly.demo.pages.compose

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.key
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import com.tencent.kuikly.compose.BackHandler
import com.tencent.kuikly.compose.ComposeContainer
import com.tencent.kuikly.compose.animation.core.FloatExponentialDecaySpec
import com.tencent.kuikly.compose.animation.core.generateDecayAnimationSpec
import com.tencent.kuikly.compose.animation.core.tween
import com.tencent.kuikly.compose.foundation.ExperimentalFoundationApi
import com.tencent.kuikly.compose.foundation.background
import com.tencent.kuikly.compose.foundation.clickable
import com.tencent.kuikly.compose.foundation.gestures.AnchoredDraggableState
import com.tencent.kuikly.compose.foundation.gestures.DraggableAnchors
import com.tencent.kuikly.compose.foundation.gestures.Orientation
import com.tencent.kuikly.compose.foundation.gestures.anchoredDraggable
import com.tencent.kuikly.compose.foundation.gestures.snapTo
import com.tencent.kuikly.compose.foundation.layout.Arrangement
import com.tencent.kuikly.compose.foundation.layout.Box
import com.tencent.kuikly.compose.foundation.layout.Column
import com.tencent.kuikly.compose.foundation.layout.Row
import com.tencent.kuikly.compose.foundation.layout.Spacer
import com.tencent.kuikly.compose.foundation.layout.fillMaxSize
import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
import com.tencent.kuikly.compose.foundation.layout.height
import com.tencent.kuikly.compose.foundation.layout.offset
import com.tencent.kuikly.compose.foundation.layout.padding
import com.tencent.kuikly.compose.foundation.layout.size
import com.tencent.kuikly.compose.foundation.shape.CircleShape
import com.tencent.kuikly.compose.foundation.shape.RoundedCornerShape
import com.tencent.kuikly.compose.material3.Button
import com.tencent.kuikly.compose.material3.CircularProgressIndicator
import com.tencent.kuikly.compose.material3.Surface
import com.tencent.kuikly.compose.material3.Text
import com.tencent.kuikly.compose.setContent
import com.tencent.kuikly.compose.ui.Alignment
import com.tencent.kuikly.compose.ui.Modifier
import com.tencent.kuikly.compose.ui.draw.clip
import com.tencent.kuikly.compose.ui.graphics.Brush
import com.tencent.kuikly.compose.ui.graphics.Color
import com.tencent.kuikly.compose.ui.layout.onSizeChanged
import com.tencent.kuikly.compose.ui.text.font.FontWeight
import com.tencent.kuikly.compose.ui.unit.IntOffset
import com.tencent.kuikly.compose.ui.unit.dp
import com.tencent.kuikly.compose.ui.unit.sp
import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.module.Module
import com.tencent.kuikly.core.views.VideoPlayControl
import com.tencent.kuikly.demo.pages.base.BridgeModule
import kotlin.math.roundToInt

private const val DemoVideoUrl1 = "http://vjs.zencdn.net/v/oceans.mp4"
private const val DemoVideoUrl2 = "https://media.w3.org/2010/05/sintel/trailer.mp4"
private const val DemoVideoUrl3 = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"

private val DemoVideoFeed = listOf(
    VideoFeedItem(
        id = 0,
        videoUrl = DemoVideoUrl1,
        avatarText = "K",
        author = "@kuikly_compose",
        description = "方案 A：把单视频 Demo 升级为整页吸附的竖向短视频流，上下滑即可切换下一条。",
        hashtag = "#Kuikly #Compose #VerticalFeed",
        music = "♫ Oceans Demo · 上滑切换下一条",
        likeCount = "24.8w",
        commentCount = "1.2w",
        collectLabel = "收藏",
        shareLabel = "分享",
    ),
    VideoFeedItem(
        id = 1,
        videoUrl = DemoVideoUrl2,
        avatarText = "A",
        author = "@android_video",
        description = "当前页保持原有的全屏按钮；进入横屏时仍然是当前视频实例，不会因为切布局而重新开播。",
        hashtag = "#Fullscreen #Landscape #Video",
        music = "♫ Sintel Trailer · 当前页支持横屏沉浸式播放",
        likeCount = "18.6w",
        commentCount = "8.3k",
        collectLabel = "稍后看",
        shareLabel = "转发",
    ),
    VideoFeedItem(
        id = 2,
        videoUrl = DemoVideoUrl3,
        avatarText = "D",
        author = "@demo_feed",
        description = "上下滑切页使用 anchoredDraggable 做一屏一页吸附，手感更接近短视频信息流。",
        hashtag = "#AnchoredDraggable #Feed #Demo",
        music = "♫ Joyrides · 一屏一页吸附切换",
        likeCount = "9.7w",
        commentCount = "4.1k",
        collectLabel = "收藏",
        shareLabel = "分享",
    ),
)

@Page("ComposeVideoDemo")
internal class ComposeVideoDemo : ComposeContainer() {
    override fun createExternalModules(): Map<String, Module>? {
        val externalModules = hashMapOf<String, Module>()
        externalModules[BridgeModule.MODULE_NAME] = BridgeModule()
        return externalModules
    }

    private fun getBridgeModule(): BridgeModule {
        return acquireModule(BridgeModule.MODULE_NAME)
    }

    override fun willInit() {
        super.willInit()
        setContent {
            ComposeVideoDemoImpl(
                onEnterSystemFullscreen = {
                    if (getPager().pageData.isAndroid) {
                        getBridgeModule().enterLandscapeFullscreen()
                    }
                },
                onExitSystemFullscreen = {
                    if (getPager().pageData.isAndroid) {
                        getBridgeModule().exitLandscapeFullscreen()
                    }
                },
            )
        }
    }

    override fun pageWillDestroy() {
        if (getPager().pageData.isAndroid) {
            getBridgeModule().exitLandscapeFullscreen()
        }
        super.pageWillDestroy()
    }
}

@Composable
fun ComposeVideoDemoImpl(
    onEnterSystemFullscreen: () -> Unit = {},
    onExitSystemFullscreen: () -> Unit = {},
) {
    val feedItems = remember { DemoVideoFeed }
    var currentIndex by rememberSaveable { mutableStateOf(0) }
    var playControl by rememberSaveable { mutableStateOf(VideoPlayControl.PLAY) }
    var isFullscreen by rememberSaveable { mutableStateOf(false) }
    var isBuffering by rememberSaveable { mutableStateOf(false) }
    var pageHeightPx by remember { mutableStateOf(1f) }

    val dragState = remember {
        AnchoredDraggableState(
            initialValue = 0,
            anchors = DraggableAnchors { 0 at 0f },
            positionalThreshold = { totalDistance -> totalDistance * 0.35f },
            velocityThreshold = { 1200f },
            snapAnimationSpec = tween(260),
            decayAnimationSpec = FloatExponentialDecaySpec().generateDecayAnimationSpec(),
        )
    }

    val pagingEnabled = !isFullscreen && feedItems.size > 1

    LaunchedEffect(pageHeightPx, currentIndex, pagingEnabled) {
        dragState.updateAnchors(
            buildFeedAnchors(
                pageHeightPx = pageHeightPx,
                currentIndex = currentIndex,
                lastIndex = feedItems.lastIndex,
                pagingEnabled = pagingEnabled,
            ),
        )
        dragState.snapTo(0)
    }

    LaunchedEffect(dragState, currentIndex, isFullscreen) {
        snapshotFlow { dragState.currentValue to dragState.isAnimationRunning }
            .collect { (anchorValue, isAnimationRunning) ->
                if (isFullscreen || isAnimationRunning || anchorValue == 0) {
                    return@collect
                }

                val targetIndex = when (anchorValue) {
                    -1 -> (currentIndex + 1).coerceAtMost(feedItems.lastIndex)
                    1 -> (currentIndex - 1).coerceAtLeast(0)
                    else -> currentIndex
                }

                if (targetIndex != currentIndex) {
                    currentIndex = targetIndex
                    playControl = VideoPlayControl.PLAY
                    isBuffering = false
                }
                dragState.snapTo(0)
            }
    }

    if (isFullscreen) {
        BackHandler {
            isFullscreen = false
            onExitSystemFullscreen()
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color.Black,
    ) {
        Box(
            modifier =
                Modifier
                    .fillMaxSize()
                    .background(Color.Black)
                    .onSizeChanged { pageHeightPx = it.height.toFloat().coerceAtLeast(1f) }
                    .let { modifier ->
                        if (pagingEnabled) {
                            modifier.anchoredDraggable(
                                state = dragState,
                                orientation = Orientation.Vertical,
                            )
                        } else {
                            modifier
                        }
                    },
        ) {
            visibleFeedIndices(
                currentIndex = currentIndex,
                lastIndex = feedItems.lastIndex,
                isFullscreen = isFullscreen,
            ).forEach { index ->
                val item = feedItems[index]
                key(item.id) {
                    val isCurrentPage = index == currentIndex
                    val pageOffsetPx = if (isFullscreen) {
                        0f
                    } else {
                        ((index - currentIndex) * pageHeightPx) + dragState.offset
                    }

                    VideoFeedPage(
                        item = item,
                        isCurrentPage = isCurrentPage,
                        isFullscreen = isCurrentPage && isFullscreen,
                        playControl = if (isCurrentPage) playControl else VideoPlayControl.PAUSE,
                        isBuffering = isCurrentPage && isBuffering,
                        pageIndicator = "${currentIndex + 1}/${feedItems.size}",
                        modifier =
                            Modifier
                                .fillMaxSize()
                                .offset { IntOffset(0, pageOffsetPx.roundToInt()) },
                        onTogglePlay = {
                            playControl = playControl.toggle()
                        },
                        onEnterFullscreen = {
                            isFullscreen = true
                            onEnterSystemFullscreen()
                        },
                        onExitFullscreen = {
                            isFullscreen = false
                            onExitSystemFullscreen()
                        },
                    )
                }
            }
        }
    }
}

@Composable
private fun VideoFeedPage(
    item: VideoFeedItem,
    isCurrentPage: Boolean,
    isFullscreen: Boolean,
    playControl: VideoPlayControl,
    isBuffering: Boolean,
    pageIndicator: String,
    modifier: Modifier = Modifier,
    onTogglePlay: () -> Unit,
    onEnterFullscreen: () -> Unit,
    onExitFullscreen: () -> Unit,
) {
    Box(
        modifier = modifier.background(Color.Black),
    ) {
        Video(
            src = item.videoUrl,
            playControl = playControl,
            resizeMode = if (isFullscreen) VideoResizeMode.Contain else VideoResizeMode.Cover,
            modifier = Modifier.fillMaxSize(),
        )

        if (!isCurrentPage) {
            return
        }

        if (isFullscreen) {
            FullscreenVideoPlayer(
                playControl = playControl,
                isBuffering = isBuffering,
                item = item,
                onTogglePlay = onTogglePlay,
                onExitFullscreen = onExitFullscreen,
            )
        } else {
            DouyinStyleVideoPage(
                item = item,
                playControl = playControl,
                isBuffering = isBuffering,
                pageIndicator = pageIndicator,
                onTogglePlay = onTogglePlay,
                onEnterFullscreen = onEnterFullscreen,
            )
        }
    }
}

@Composable
private fun DouyinStyleVideoPage(
    item: VideoFeedItem,
    playControl: VideoPlayControl,
    isBuffering: Boolean,
    pageIndicator: String,
    onTogglePlay: () -> Unit,
    onEnterFullscreen: () -> Unit,
) {
    Box(
        modifier = Modifier.fillMaxSize(),
    ) {
        Box(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .align(Alignment.TopCenter)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Black.copy(alpha = 0.62f), Color.Transparent),
                        ),
                    ),
        )

        Box(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(320.dp)
                    .align(Alignment.BottomCenter)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f)),
                        ),
                    ),
        )

        PlaybackStateOverlay(
            isBuffering = isBuffering,
            modifier = Modifier.fillMaxSize(),
        )

        RecommendationTabs(
            pageIndicator = pageIndicator,
            modifier =
                Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 18.dp),
        )

        CreatorInfoPanel(
            item = item,
            modifier =
                Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 16.dp, end = 104.dp, bottom = 24.dp),
        )

        ActionRail(
            item = item,
            modifier =
                Modifier
                    .align(Alignment.BottomEnd)
                    .padding(end = 12.dp, bottom = 24.dp),
            playControl = playControl,
            onTogglePlay = onTogglePlay,
            onEnterFullscreen = onEnterFullscreen,
        )
    }
}

@Composable
private fun RecommendationTabs(
    pageIndicator: String,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(24.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "关注",
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 18.sp,
            )
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "推荐",
                    color = Color.White,
                    fontSize = 19.sp,
                    fontWeight = FontWeight.Bold,
                )
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier =
                        Modifier
                            .size(width = 22.dp, height = 3.dp)
                            .clip(RoundedCornerShape(50))
                            .background(Color.White),
                )
            }
            Text(
                text = "附近",
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 18.sp,
            )
        }

        Surface(
            shape = RoundedCornerShape(999.dp),
            color = Color.Black.copy(alpha = 0.32f),
        ) {
            Text(
                text = "第 $pageIndicator 条 · 上滑切换下一条",
                color = Color.White,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                fontSize = 12.sp,
            )
        }
    }
}

@Composable
private fun CreatorInfoPanel(
    item: VideoFeedItem,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Surface(
                modifier = Modifier.size(36.dp),
                shape = CircleShape,
                color = Color.White.copy(alpha = 0.15f),
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(item.avatarText, color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(modifier = Modifier.size(10.dp))
            Text(
                text = item.author,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
            )
            Spacer(modifier = Modifier.size(10.dp))
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Color.White,
            ) {
                Text(
                    text = "关注",
                    color = Color.Black,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    fontWeight = FontWeight.Bold,
                )
            }
        }

        Text(
            text = item.description,
            color = Color.White,
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
        )

        Text(
            text = item.hashtag,
            color = Color.White.copy(alpha = 0.92f),
            fontSize = 14.sp,
        )

        Surface(
            shape = RoundedCornerShape(18.dp),
            color = Color.White.copy(alpha = 0.12f),
        ) {
            Text(
                text = item.music,
                color = Color.White,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                fontSize = 13.sp,
            )
        }
    }
}

@Composable
private fun ActionRail(
    item: VideoFeedItem,
    modifier: Modifier = Modifier,
    playControl: VideoPlayControl,
    onTogglePlay: () -> Unit,
    onEnterFullscreen: () -> Unit,
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        ActionItem(symbol = "❤", label = item.likeCount)
        ActionItem(symbol = "💬", label = item.commentCount)
        ActionItem(symbol = "☆", label = item.collectLabel)
        ActionItem(symbol = "↗", label = item.shareLabel)

        Button(onClick = onTogglePlay) {
            Text(if (playControl == VideoPlayControl.PLAY) "暂停播放" else "继续播放")
        }

        Button(onClick = onEnterFullscreen) {
            Text("全屏播放")
        }
    }
}

@Composable
private fun ActionItem(
    symbol: String,
    label: String,
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Surface(
            modifier = Modifier.size(52.dp),
            shape = CircleShape,
            color = Color.Black.copy(alpha = 0.32f),
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text(
                    text = symbol,
                    color = Color.White,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                )
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = label,
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
        )
    }
}

@Composable
private fun FullscreenVideoPlayer(
    playControl: VideoPlayControl,
    isBuffering: Boolean,
    item: VideoFeedItem,
    onTogglePlay: () -> Unit,
    onExitFullscreen: () -> Unit,
) {
    Box(
        modifier = Modifier.fillMaxSize(),
    ) {
        PlaybackStateOverlay(
            isBuffering = isBuffering,
            modifier = Modifier.fillMaxSize(),
        )

        Row(
            modifier =
                Modifier
                    .align(Alignment.TopEnd)
                    .padding(horizontal = 16.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Surface(
                modifier =
                    Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .clickable(onClick = onTogglePlay),
                color = Color.Black.copy(alpha = 0.45f),
            ) {
                Text(
                    text = if (playControl == VideoPlayControl.PLAY) "暂停" else "播放",
                    color = Color.White,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                    fontWeight = FontWeight.Bold,
                )
            }
            Surface(
                modifier =
                    Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .clickable(onClick = onExitFullscreen),
                color = Color.Black.copy(alpha = 0.45f),
            ) {
                Text(
                    text = "退出全屏",
                    color = Color.White,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                    fontWeight = FontWeight.Bold,
                )
            }
        }

        Column(
            modifier =
                Modifier
                    .align(Alignment.BottomStart)
                    .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(
                text = item.author,
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = item.description,
                color = Color.White.copy(alpha = 0.86f),
                fontSize = 14.sp,
            )
            Text(
                text = "横屏时使用 contain 模式，避免裁切过多内容；按系统返回键也可退出。",
                color = Color.White.copy(alpha = 0.72f),
                fontSize = 13.sp,
            )
        }
    }
}

@Composable
private fun PlaybackStateOverlay(
    isBuffering: Boolean,
    modifier: Modifier = Modifier,
) {
    if (isBuffering) {
        Column(
            modifier = modifier.background(Color.Black.copy(alpha = 0.18f)),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            CircularProgressIndicator(color = Color.White)
            Spacer(modifier = Modifier.height(12.dp))
            Text("视频缓冲中...", color = Color.White)
        }
    }
}

private fun buildFeedAnchors(
    pageHeightPx: Float,
    currentIndex: Int,
    lastIndex: Int,
    pagingEnabled: Boolean,
): DraggableAnchors<Int> = DraggableAnchors {
    if (pagingEnabled && currentIndex < lastIndex) {
        -1 at -pageHeightPx
    }
    0 at 0f
    if (pagingEnabled && currentIndex > 0) {
        1 at pageHeightPx
    }
}

private fun visibleFeedIndices(
    currentIndex: Int,
    lastIndex: Int,
    isFullscreen: Boolean,
): List<Int> {
    if (isFullscreen) {
        return listOf(currentIndex)
    }

    val indices = mutableListOf<Int>()
    if (currentIndex > 0) {
        indices += currentIndex - 1
    }
    indices += currentIndex
    if (currentIndex < lastIndex) {
        indices += currentIndex + 1
    }
    return indices
}

private fun VideoPlayControl.toggle(): VideoPlayControl =
    if (this == VideoPlayControl.PLAY) {
        VideoPlayControl.PAUSE
    } else {
        VideoPlayControl.PLAY
    }

private data class VideoFeedItem(
    val id: Int,
    val videoUrl: String,
    val avatarText: String,
    val author: String,
    val description: String,
    val hashtag: String,
    val music: String,
    val likeCount: String,
    val commentCount: String,
    val collectLabel: String,
    val shareLabel: String,
)