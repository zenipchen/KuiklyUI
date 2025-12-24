///*
// * Tencent is pleased to support the open source community by making KuiklyUI
// * available.
// * Copyright (C) 2025 Tencent. All rights reserved.
// * Licensed under the License of KuiklyUI;
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// * https://github.com/Tencent-TDS/KuiklyUI/blob/main/LICENSE
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//package com.tencent.kuikly.demo.pages.compose
//
//import androidx.compose.runtime.Composable
//import androidx.compose.runtime.DisposableEffect
//import androidx.compose.runtime.LaunchedEffect
//import androidx.compose.runtime.collectAsState
//import androidx.compose.runtime.getValue
//import androidx.compose.runtime.mutableStateOf
//import androidx.compose.runtime.remember
//import androidx.compose.runtime.setValue
//import com.tencent.kuikly.lifecycle.Lifecycle
//import com.tencent.kuikly.lifecycle.LifecycleEventObserver
//import com.tencent.kuikly.lifecycle.ViewModel
//import com.tencent.kuikly.lifecycle.compose.LocalLifecycleOwner
//import com.tencent.kuikly.lifecycle.viewModelScope
//import com.tencent.kuikly.lifecycle.viewmodel.compose.viewModel
//import com.tencent.kuikly.compose.ComposeContainer
//import com.tencent.kuikly.compose.foundation.background
//import com.tencent.kuikly.compose.foundation.layout.Arrangement
//import com.tencent.kuikly.compose.foundation.layout.Box
//import com.tencent.kuikly.compose.foundation.layout.Column
//import com.tencent.kuikly.compose.foundation.layout.Row
//import com.tencent.kuikly.compose.foundation.layout.Spacer
//import com.tencent.kuikly.compose.foundation.layout.fillMaxWidth
//import com.tencent.kuikly.compose.foundation.layout.height
//import com.tencent.kuikly.compose.foundation.layout.padding
//import com.tencent.kuikly.compose.foundation.layout.size
//import com.tencent.kuikly.compose.foundation.lazy.LazyColumn
//import com.tencent.kuikly.compose.foundation.shape.CircleShape
//import com.tencent.kuikly.compose.foundation.shape.RoundedCornerShape
//import com.tencent.kuikly.compose.material3.Button
//import com.tencent.kuikly.compose.material3.Card
//import com.tencent.kuikly.compose.material3.CardDefaults
//import com.tencent.kuikly.compose.material3.DividerDefaults
//import com.tencent.kuikly.compose.material3.HorizontalDivider
//import com.tencent.kuikly.compose.material3.MaterialTheme
//import com.tencent.kuikly.compose.material3.Text
//import com.tencent.kuikly.compose.material3.TextField
//import com.tencent.kuikly.compose.setContent
//import com.tencent.kuikly.compose.ui.Alignment
//import com.tencent.kuikly.compose.ui.Modifier
//import com.tencent.kuikly.compose.ui.graphics.Color
//import com.tencent.kuikly.compose.ui.text.font.FontFamily
//import com.tencent.kuikly.compose.ui.text.font.FontWeight
//import com.tencent.kuikly.compose.ui.text.style.TextAlign
//import com.tencent.kuikly.compose.ui.unit.dp
//import com.tencent.kuikly.compose.ui.unit.sp
//import com.tencent.kuikly.core.annotations.Page
//import com.tencent.kuikly.core.log.KLog
//import com.tencent.kuikly.lifecycle.eventFlow
//import com.tencent.kuikly.lifecycle.lifecycleScope
//import kotlinx.coroutines.delay
//import kotlinx.coroutines.flow.MutableStateFlow
//import kotlinx.coroutines.flow.StateFlow
//import kotlinx.coroutines.flow.asStateFlow
//import kotlinx.coroutines.launch
//import kotlin.time.TimeSource
//
///**
// * ViewModel Demo - 展示 Compose ViewModel 的所有主要功能
// *
// * 功能包括:
// * 1. 基本的 ViewModel 创建和使用
// * 2. StateFlow 状态管理
// * 3. UI 状态和 UI 事件处理
// * 4. ViewModel 生命周期和清理
// * 5. 协程和异步操作
// * 6. 复杂状态管理示例
// * 7. ViewModel 与 Lifecycle 结合使用
// */
//@Page("ViewModelDemo")
//internal class ViewModelDemo : ComposeContainer() {
//
//    override fun willInit() {
//        super.willInit()
//
//        setContent {
//            DemoScaffold("ViewModel 示例", back = true) {
//                // 1. 基本计数器示例
//                BasicCounterDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 2. 用户信息管理示例
//                UserInfoDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 3. 定时器示例 (展示协程和生命周期)
//                TimerDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 4. 加载状态管理示例
//                LoadingStateDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 5. 表单验证示例
//                FormValidationDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 6. ViewModel 与 Lifecycle 结合示例
//                LifecycleAwareDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 7. lifecycleScope 示例
//                LifecycleScopeDemo()
//
//                HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//                // 8. Lifecycle.eventFlow 示例
//                LifecycleEventFlowDemo()
//
//            }
//        }
//    }
//}
//
//private const val TAG = "ViewModelDemo"
//
//// ============================================================
//// 1. 基本计数器示例 - 展示 ViewModel 的基本使用
//// ============================================================
//
//private class CounterViewModel : ViewModel() {
//    // 使用 StateFlow 管理状态
//    private val _count = MutableStateFlow(0)
//    val count: StateFlow<Int> = _count.asStateFlow()
//
//    // UI 事件处理
//    fun increment() {
//        _count.value++
//    }
//
//    fun decrement() {
//        _count.value--
//    }
//
//    fun reset() {
//        _count.value = 0
//    }
//
//    // 清理资源
//    override fun onCleared() {
//        super.onCleared()
//        KLog.i(TAG, "CounterViewModel 被清理")
//    }
//}
//
//@Composable
//private fun BasicCounterDemo() {
//    // 获取或创建 ViewModel 实例
//    val viewModel: CounterViewModel = viewModel { CounterViewModel() }
//
//    // 收集状态
//    val count by viewModel.count.collectAsState()
//
//    DemoCard(title = "1. 基本计数器") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            horizontalAlignment = Alignment.CenterHorizontally
//        ) {
//            Text(
//                text = "计数: $count",
//                fontSize = 32.sp,
//                fontWeight = FontWeight.Bold
//            )
//
//            Spacer(modifier = Modifier.height(16.dp))
//
//            Row(
//                horizontalArrangement = Arrangement.spacedBy(8.dp)
//            ) {
//                Button(onClick = { viewModel.decrement() }) {
//                    Text("-1")
//                }
//                Button(onClick = { viewModel.reset() }) {
//                    Text("重置")
//                }
//                Button(onClick = { viewModel.increment() }) {
//                    Text("+1")
//                }
//            }
//        }
//    }
//}
//
//// ============================================================
//// 2. 用户信息管理示例 - 展示复杂状态管理
//// ============================================================
//
//private data class UserInfo(
//    val name: String = "",
//    val email: String = "",
//    val age: Int = 0
//)
//
//private class UserViewModel : ViewModel() {
//    private val _userInfo = MutableStateFlow(UserInfo())
//    val userInfo: StateFlow<UserInfo> = _userInfo.asStateFlow()
//
//    private val _savedUsers = MutableStateFlow<List<UserInfo>>(emptyList())
//    val savedUsers: StateFlow<List<UserInfo>> = _savedUsers.asStateFlow()
//
//    fun updateName(name: String) {
//        _userInfo.value = _userInfo.value.copy(name = name)
//    }
//
//    fun updateEmail(email: String) {
//        _userInfo.value = _userInfo.value.copy(email = email)
//    }
//
//    fun updateAge(age: Int) {
//        _userInfo.value = _userInfo.value.copy(age = age)
//    }
//
//    fun saveUser() {
//        if (_userInfo.value.name.isNotEmpty()) {
//            _savedUsers.value = _savedUsers.value + _userInfo.value
//            _userInfo.value = UserInfo() // 重置表单
//        }
//    }
//
//    fun clearAll() {
//        _savedUsers.value = emptyList()
//        _userInfo.value = UserInfo()
//    }
//}
//
//@Composable
//private fun UserInfoDemo() {
//    val viewModel: UserViewModel = viewModel { UserViewModel() }
//    val userInfo by viewModel.userInfo.collectAsState()
//    val savedUsers by viewModel.savedUsers.collectAsState()
//
//    DemoCard(title = "2. 用户信息管理") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            verticalArrangement = Arrangement.spacedBy(8.dp)
//        ) {
//            TextField(
//                value = userInfo.name,
//                onValueChange = { viewModel.updateName(it) },
//                label = { Text("姓名") },
//                modifier = Modifier.fillMaxWidth()
//            )
//
//            TextField(
//                value = userInfo.email,
//                onValueChange = { viewModel.updateEmail(it) },
//                label = { Text("邮箱") },
//                modifier = Modifier.fillMaxWidth()
//            )
//
//            TextField(
//                value = if (userInfo.age == 0) "" else userInfo.age.toString(),
//                onValueChange = {
//                    it.toIntOrNull()?.let { age -> viewModel.updateAge(age) }
//                },
//                label = { Text("年龄") },
//                modifier = Modifier.fillMaxWidth()
//            )
//
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.spacedBy(8.dp)
//            ) {
//                Button(
//                    onClick = { viewModel.saveUser() },
//                    modifier = Modifier.weight(1f)
//                ) {
//                    Text("保存用户")
//                }
//                Button(
//                    onClick = { viewModel.clearAll() },
//                    modifier = Modifier.weight(1f)
//                ) {
//                    Text("清空所有")
//                }
//            }
//
//            if (savedUsers.isNotEmpty()) {
//                Spacer(modifier = Modifier.height(8.dp))
//                Text(
//                    text = "已保存的用户 (${savedUsers.size}):",
//                    fontWeight = FontWeight.Bold
//                )
//                savedUsers.forEach { user ->
//                    Text(
//                        text = "• ${user.name} - ${user.email} - ${user.age}岁",
//                        fontSize = 14.sp,
//                        modifier = Modifier.padding(start = 8.dp)
//                    )
//                }
//            }
//        }
//    }
//}
//
//// ============================================================
//// 3. 定时器示例 - 展示协程和生命周期
//// ============================================================
//
//private class TimerViewModel : ViewModel() {
//    private val _seconds = MutableStateFlow(0)
//    val seconds: StateFlow<Int> = _seconds.asStateFlow()
//
//    private val _isRunning = MutableStateFlow(false)
//    val isRunning: StateFlow<Boolean> = _isRunning.asStateFlow()
//
//    // 记录开始时间和已累计的时间（用于暂停后恢复）
//    private var startTimeMillis: Long = 0
//    private var elapsedTimeMillis: Long = 0
//
//    fun start() {
//        if (!_isRunning.value) {
//            _isRunning.value = true
//            // 记录开始时间（减去已累计的时间）
//            startTimeMillis = TimeProvider.currentTimeMillis() - elapsedTimeMillis
//
//            viewModelScope.launch {
//                while (_isRunning.value) {
//                    // 基于实际时间计算当前秒数（避免累积误差）
//                    val currentElapsed = TimeProvider.currentTimeMillis() - startTimeMillis
//                    val currentSeconds = (currentElapsed / 1000).toInt()
//
//                    // 只在秒数变化时更新状态
//                    if (_seconds.value != currentSeconds) {
//                        _seconds.value = currentSeconds
//                    }
//
//                    // 计算距离下一秒还有多少毫秒，精确 delay 到下一秒
//                    val millisUntilNextSecond = 1000 - (currentElapsed % 1000)
//                    delay(millisUntilNextSecond)
//
//                    // delay 后再次检查状态
//                    if (!_isRunning.value) break
//                }
//            }
//        }
//    }
//
//    fun pause() {
//        if (_isRunning.value) {
//            _isRunning.value = false
//            // 保存当前已累计的时间
//            elapsedTimeMillis = TimeProvider.currentTimeMillis() - startTimeMillis
//        }
//    }
//
//    fun reset() {
//        _isRunning.value = false
//        _seconds.value = 0
//        startTimeMillis = 0
//        elapsedTimeMillis = 0
//    }
//
//    override fun onCleared() {
//        super.onCleared()
//        _isRunning.value = false
//        KLog.i(TAG, "TimerViewModel 被清理，定时器已停止")
//    }
//}
//
//@Composable
//private fun TimerDemo() {
//    val viewModel: TimerViewModel = viewModel { TimerViewModel() }
//    val seconds by viewModel.seconds.collectAsState()
//    val isRunning by viewModel.isRunning.collectAsState()
//
//    DemoCard(title = "3. 定时器 (协程示例)") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            horizontalAlignment = Alignment.CenterHorizontally
//        ) {
//            Text(
//                text = formatTime(seconds),
//                fontSize = 40.sp,
//                fontWeight = FontWeight.Bold,
//                color = if (isRunning) MaterialTheme.colorScheme.primary else Color.Gray
//            )
//
//            Spacer(modifier = Modifier.height(16.dp))
//
//            Row(
//                horizontalArrangement = Arrangement.spacedBy(8.dp)
//            ) {
//                if (!isRunning) {
//                    Button(onClick = { viewModel.start() }) {
//                        Text("启动")
//                    }
//                } else {
//                    Button(onClick = { viewModel.pause() }) {
//                        Text("暂停")
//                    }
//                }
//                Button(onClick = { viewModel.reset() }) {
//                    Text("重置")
//                }
//            }
//        }
//    }
//}
//
//// ============================================================
//// 4. 加载状态管理示例
//// ============================================================
//
//private sealed class UiState<out T> {
//    object Idle : UiState<Nothing>()
//    object Loading : UiState<Nothing>()
//    data class Success<T>(val data: T) : UiState<T>()
//    data class Error(val message: String) : UiState<Nothing>()
//}
//
//private class DataLoadingViewModel : ViewModel() {
//    private val _uiState = MutableStateFlow<UiState<String>>(UiState.Idle)
//    val uiState: StateFlow<UiState<String>> = _uiState.asStateFlow()
//
//    fun loadData(shouldFail: Boolean = false) {
//        viewModelScope.launch {
//            _uiState.value = UiState.Loading
//
//            // 模拟网络请求
//            delay(2000)
//
//            _uiState.value = if (shouldFail) {
//                UiState.Error("加载失败：网络错误")
//            } else {
//                UiState.Success("数据加载成功！时间: ${TimeProvider.currentTimeMillis()}")
//            }
//        }
//    }
//
//    fun reset() {
//        _uiState.value = UiState.Idle
//    }
//}
//
//@Composable
//private fun LoadingStateDemo() {
//    val viewModel: DataLoadingViewModel = viewModel { DataLoadingViewModel() }
//    val uiState by viewModel.uiState.collectAsState()
//
//    DemoCard(title = "4. 加载状态管理") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            horizontalAlignment = Alignment.CenterHorizontally,
//            verticalArrangement = Arrangement.spacedBy(12.dp)
//        ) {
//            when (val state = uiState) {
//                is UiState.Idle -> {
//                    Text("点击按钮加载数据", color = Color.Gray)
//                }
//                is UiState.Loading -> {
//                    Text("加载中...", color = MaterialTheme.colorScheme.primary)
//                    Text("⏳", fontSize = 32.sp)
//                }
//                is UiState.Success -> {
//                    Text("✅", fontSize = 32.sp)
//                    Text(
//                        text = state.data,
//                        color = Color(0xFF4CAF50),
//                        fontSize = 14.sp
//                    )
//                }
//                is UiState.Error -> {
//                    Text("❌", fontSize = 32.sp)
//                    Text(
//                        text = state.message,
//                        color = Color(0xFFF44336),
//                        fontSize = 14.sp
//                    )
//                }
//            }
//
//            Spacer(modifier = Modifier.height(8.dp))
//
//            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
//                Button(
//                    onClick = { viewModel.loadData(shouldFail = false) },
//                    enabled = uiState !is UiState.Loading
//                ) {
//                    Text("加载成功")
//                }
//                Button(
//                    onClick = { viewModel.loadData(shouldFail = true) },
//                    enabled = uiState !is UiState.Loading
//                ) {
//                    Text("加载失败")
//                }
//                Button(
//                    onClick = { viewModel.reset() },
//                    enabled = uiState !is UiState.Loading
//                ) {
//                    Text("重置")
//                }
//            }
//        }
//    }
//}
//
//// ============================================================
//// 5. 表单验证示例
//// ============================================================
//
//private data class FormState(
//    val username: String = "",
//    val password: String = "",
//    val usernameError: String? = null,
//    val passwordError: String? = null
//)
//
//private class FormViewModel : ViewModel() {
//    private val _formState = MutableStateFlow(FormState())
//    val formState: StateFlow<FormState> = _formState.asStateFlow()
//
//    private val _submitStatus = MutableStateFlow<String?>(null)
//    val submitStatus: StateFlow<String?> = _submitStatus.asStateFlow()
//
//    fun updateUsername(username: String) {
//        _formState.value = _formState.value.copy(
//            username = username,
//            usernameError = validateUsername(username)
//        )
//    }
//
//    fun updatePassword(password: String) {
//        _formState.value = _formState.value.copy(
//            password = password,
//            passwordError = validatePassword(password)
//        )
//    }
//
//    private fun validateUsername(username: String): String? {
//        return when {
//            username.isEmpty() -> "用户名不能为空"
//            username.length < 3 -> "用户名至少3个字符"
//            !username.matches(Regex("^[a-zA-Z0-9_]+$")) -> "只能包含字母、数字和下划线"
//            else -> null
//        }
//    }
//
//    private fun validatePassword(password: String): String? {
//        return when {
//            password.isEmpty() -> "密码不能为空"
//            password.length < 6 -> "密码至少6个字符"
//            else -> null
//        }
//    }
//
//    fun submit() {
//        val state = _formState.value
//        val usernameError = validateUsername(state.username)
//        val passwordError = validatePassword(state.password)
//
//        if (usernameError == null && passwordError == null) {
//            viewModelScope.launch {
//                _submitStatus.value = "提交中..."
//                delay(1500)
//                _submitStatus.value = "✅ 提交成功！"
//                delay(2000)
//                _submitStatus.value = null
//                _formState.value = FormState() // 重置表单
//            }
//        } else {
//            _formState.value = state.copy(
//                usernameError = usernameError,
//                passwordError = passwordError
//            )
//        }
//    }
//}
//
//@Composable
//private fun FormValidationDemo() {
//    val viewModel: FormViewModel = viewModel { FormViewModel() }
//    val formState by viewModel.formState.collectAsState()
//    val submitStatus by viewModel.submitStatus.collectAsState()
//
//    DemoCard(title = "5. 表单验证") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            verticalArrangement = Arrangement.spacedBy(12.dp)
//        ) {
//            // 用户名输入
//            TextField(
//                value = formState.username,
//                onValueChange = { viewModel.updateUsername(it) },
//                label = { Text("用户名") },
//                isError = formState.usernameError != null,
//                supportingText = {
//                    formState.usernameError?.let {
//                        Text(it, color = Color(0xFFF44336))
//                    }
//                },
//                modifier = Modifier.fillMaxWidth()
//            )
//
//            // 密码输入
//            TextField(
//                value = formState.password,
//                onValueChange = { viewModel.updatePassword(it) },
//                label = { Text("密码") },
//                isError = formState.passwordError != null,
//                supportingText = {
//                    formState.passwordError?.let {
//                        Text(it, color = Color(0xFFF44336))
//                    }
//                },
//                modifier = Modifier.fillMaxWidth()
//            )
//
//            // 提交按钮
//            Button(
//                onClick = { viewModel.submit() },
//                modifier = Modifier.fillMaxWidth(),
//                enabled = submitStatus == null
//            ) {
//                Text(submitStatus ?: "提交")
//            }
//
//            // 验证规则说明
//            Text(
//                text = "验证规则:\n• 用户名：至少3个字符，只能包含字母、数字和下划线\n• 密码：至少6个字符",
//                fontSize = 12.sp,
//                color = Color.Gray,
//                modifier = Modifier.padding(top = 8.dp)
//            )
//        }
//    }
//}
//
//// ============================================================
//// 6. ViewModel 与 Lifecycle 结合示例
//// ============================================================
//
//private data class LifecycleEvent(
//    val event: String,
//    val timestamp: Long = TimeProvider.currentTimeMillis()
//)
//
//private class LifecycleAwareViewModel : ViewModel() {
//    private val _lifecycleEvents = MutableStateFlow<List<LifecycleEvent>>(emptyList())
//    val lifecycleEvents: StateFlow<List<LifecycleEvent>> = _lifecycleEvents.asStateFlow()
//
//    private val _currentState = MutableStateFlow("未知")
//    val currentState: StateFlow<String> = _currentState.asStateFlow()
//
//    private val _isActive = MutableStateFlow(false)
//    val isActive: StateFlow<Boolean> = _isActive.asStateFlow()
//
//    // 任务计数器 - 仅在 RESUMED 状态下运行
//    private val _taskCounter = MutableStateFlow(0)
//    val taskCounter: StateFlow<Int> = _taskCounter.asStateFlow()
//
//    // 记录活跃时间和已累计时间
//    private var activeStartTimeMillis: Long = 0
//    private var totalElapsedTimeMillis: Long = 0
//
//    // 生命周期事件处理
//    fun onLifecycleEvent(event: Lifecycle.Event) {
//        val eventName = when (event) {
//            Lifecycle.Event.ON_CREATE -> "ON_CREATE - 组件创建"
//            Lifecycle.Event.ON_START -> "ON_START - 组件可见"
//            Lifecycle.Event.ON_RESUME -> "ON_RESUME - 组件激活"
//            Lifecycle.Event.ON_PAUSE -> "ON_PAUSE - 组件暂停"
//            Lifecycle.Event.ON_STOP -> "ON_STOP - 组件不可见"
//            Lifecycle.Event.ON_DESTROY -> "ON_DESTROY - 组件销毁"
//            Lifecycle.Event.ON_ANY -> "ON_ANY"
//        }
//
//        _lifecycleEvents.value = _lifecycleEvents.value + LifecycleEvent(eventName)
//        _currentState.value = eventName.substringBefore(" -")
//
//        // 根据生命周期状态控制任务
//        when (event) {
//            Lifecycle.Event.ON_RESUME -> {
//                if (!_isActive.value) {
//                    _isActive.value = true
//                    startBackgroundTask()
//                }
//            }
//            Lifecycle.Event.ON_PAUSE -> {
//                if (_isActive.value) {
//                    _isActive.value = false
//                    // 保存已累计的时间
//                    totalElapsedTimeMillis += TimeProvider.currentTimeMillis() - activeStartTimeMillis
//                }
//            }
//            else -> {}
//        }
//    }
//
//    // 后台任务 - 仅在 RESUMED 时运行，使用基于时间戳的计算避免误差累积
//    private fun startBackgroundTask() {
//        activeStartTimeMillis = TimeProvider.currentTimeMillis()
//        viewModelScope.launch {
//            while (_isActive.value) {
//                // 基于实际时间计算秒数（避免累积误差）
//                val currentElapsed = totalElapsedTimeMillis +
//                                   (TimeProvider.currentTimeMillis() - activeStartTimeMillis)
//                val currentSeconds = (currentElapsed / 1000).toInt()
//
//                // 只在秒数变化时更新状态
//                if (_taskCounter.value != currentSeconds) {
//                    _taskCounter.value = currentSeconds
//                }
//
//                // 计算距离下一秒还有多少毫秒，精确 delay 到下一秒
//                val millisUntilNextSecond = 1000 - (currentElapsed % 1000)
//                delay(millisUntilNextSecond)
//
//                // delay 后再次检查状态
//                if (!_isActive.value) break
//            }
//        }
//    }
//
//    fun clearEvents() {
//        _lifecycleEvents.value = emptyList()
//        _taskCounter.value = 0
//        activeStartTimeMillis = 0
//        totalElapsedTimeMillis = 0
//    }
//
//    override fun onCleared() {
//        super.onCleared()
//        _isActive.value = false
//        KLog.i(TAG, "LifecycleAwareViewModel 被清理")
//    }
//}
//
//@Composable
//private fun LifecycleAwareDemo() {
//    val viewModel: LifecycleAwareViewModel = viewModel { LifecycleAwareViewModel() }
//    val lifecycleEvents by viewModel.lifecycleEvents.collectAsState()
//    val currentState by viewModel.currentState.collectAsState()
//    val isActive by viewModel.isActive.collectAsState()
//    val taskCounter by viewModel.taskCounter.collectAsState()
//
//    // 获取生命周期并监听事件
//    val lifecycleOwner = LocalLifecycleOwner.current
//
//    DisposableEffect(lifecycleOwner) {
//        val observer = LifecycleEventObserver { _, event ->
//            viewModel.onLifecycleEvent(event)
//        }
//
//        lifecycleOwner.lifecycle.addObserver(observer)
//
//        onDispose {
//            lifecycleOwner.lifecycle.removeObserver(observer)
//        }
//    }
//
//    DemoCard(title = "6. ViewModel 与 Lifecycle 结合") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            verticalArrangement = Arrangement.spacedBy(12.dp)
//        ) {
//            // 当前状态指示器
//            Row(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .background(
//                        color = if (isActive) Color(0xFF4CAF50).copy(alpha = 0.2f)
//                        else Color.Gray.copy(alpha = 0.2f),
//                        shape = RoundedCornerShape(8.dp)
//                    )
//                    .padding(12.dp),
//                horizontalArrangement = Arrangement.SpaceBetween,
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Column {
//                    Text(
//                        text = "当前状态",
//                        fontSize = 12.sp,
//                        color = Color.Gray
//                    )
//                    Text(
//                        text = currentState,
//                        fontSize = 18.sp,
//                        fontWeight = FontWeight.Bold,
//                        color = if (isActive) Color(0xFF4CAF50) else Color.Gray
//                    )
//                }
//
//                // 状态指示灯
//                Box(
//                    modifier = Modifier
//                        .size(12.dp)
//                        .background(
//                            color = if (isActive) Color(0xFF4CAF50) else Color.Gray,
//                            shape = CircleShape
//                        )
//                )
//            }
//
//            // 任务计数器 - 仅在 RESUMED 时运行
//            Card(
//                modifier = Modifier.fillMaxWidth(),
//                colors = CardDefaults.cardColors(
//                    containerColor = if (isActive)
//                        MaterialTheme.colorScheme.primaryContainer
//                    else
//                        Color.LightGray.copy(alpha = 0.3f)
//                )
//            ) {
//                Column(
//                    modifier = Modifier.padding(16.dp),
//                    horizontalAlignment = Alignment.CenterHorizontally
//                ) {
//                    Text(
//                        text = "后台任务计数器",
//                        fontSize = 14.sp,
//                        color = Color.Gray
//                    )
//                    Text(
//                        text = "$taskCounter",
//                        fontSize = 32.sp,
//                        fontWeight = FontWeight.Bold,
//                        color = if (isActive) MaterialTheme.colorScheme.primary else Color.Gray
//                    )
//                    Text(
//                        text = if (isActive) "✓ 运行中" else "⏸ 已暂停",
//                        fontSize = 12.sp,
//                        color = if (isActive) Color(0xFF4CAF50) else Color.Gray
//                    )
//                }
//            }
//
//            HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//            // 生命周期事件日志
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.SpaceBetween,
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Text(
//                    text = "生命周期事件日志 (${lifecycleEvents.size})",
//                    fontSize = 14.sp,
//                    fontWeight = FontWeight.Bold
//                )
//                Button(
//                    onClick = { viewModel.clearEvents() },
//                    modifier = Modifier.height(32.dp)
//                ) {
//                    Text("清空", fontSize = 12.sp)
//                }
//            }
//
//            if (lifecycleEvents.isEmpty()) {
//                Text(
//                    text = "等待生命周期事件...",
//                    color = Color.Gray,
//                    fontSize = 12.sp,
//                    modifier = Modifier.padding(vertical = 8.dp)
//                )
//            } else {
//                Column(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .background(
//                            Color.Black.copy(alpha = 0.05f),
//                            shape = RoundedCornerShape(8.dp)
//                        )
//                        .padding(8.dp),
//                    verticalArrangement = Arrangement.spacedBy(4.dp)
//                ) {
//                    lifecycleEvents.takeLast(8).forEach { event ->
//                        Row(
//                            modifier = Modifier.fillMaxWidth(),
//                            horizontalArrangement = Arrangement.SpaceBetween
//                        ) {
//                            Text(
//                                text = "• ${event.event}",
//                                fontSize = 11.sp,
//                                fontFamily = FontFamily.Monospace,
//                                modifier = Modifier.weight(1f)
//                            )
//                            Text(
//                                text = formatTimestamp(event.timestamp),
//                                fontSize = 10.sp,
//                                color = Color.Gray,
//                                fontFamily = FontFamily.Monospace
//                            )
//                        }
//                    }
//
//                    if (lifecycleEvents.size > 8) {
//                        Text(
//                            text = "... 还有 ${lifecycleEvents.size - 8} 条更早的事件",
//                            fontSize = 10.sp,
//                            color = Color.Gray,
//                            modifier = Modifier.padding(top = 4.dp)
//                        )
//                    }
//                }
//            }
//
//            // 说明文字
//            Text(
//                text = """
//                💡 说明:
//                • 当界面可见且活跃(RESUMED)时,计数器会自动运行
//                • 当界面暂停(PAUSED)或不可见时,计数器会自动停止
//                • 所有生命周期事件都会被记录到日志中
//                • 这展示了 ViewModel 如何感知和响应生命周期变化
//                """.trimIndent(),
//                fontSize = 11.sp,
//                color = Color.Gray,
//                lineHeight = 16.sp,
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .background(
//                        Color(0xFFFFF9C4).copy(alpha = 0.3f),
//                        shape = RoundedCornerShape(8.dp)
//                    )
//                    .padding(8.dp)
//            )
//        }
//    }
//}
//
//// ============================================================
//// 7. lifecycleScope 示例 - 展示生命周期绑定的协程作用域
//// ============================================================
//
//@Composable
//private fun LifecycleScopeDemo() {
//    val lifecycleOwner = LocalLifecycleOwner.current
//    val scope = lifecycleOwner.lifecycleScope
//
//    var taskLog by remember { mutableStateOf<List<String>>(emptyList()) }
//    var isTaskRunning by remember { mutableStateOf(false) }
//    var counter by remember { mutableStateOf(0) }
//
//    // 监听生命周期状态
//    var lifecycleState by remember { mutableStateOf("UNKNOWN") }
//
//    DisposableEffect(lifecycleOwner) {
//        val observer = LifecycleEventObserver { _, event ->
//            lifecycleState = when (event) {
//                Lifecycle.Event.ON_CREATE -> "CREATED"
//                Lifecycle.Event.ON_START -> "STARTED"
//                Lifecycle.Event.ON_RESUME -> "RESUMED"
//                Lifecycle.Event.ON_PAUSE -> "PAUSED"
//                Lifecycle.Event.ON_STOP -> "STOPPED"
//                Lifecycle.Event.ON_DESTROY -> "DESTROYED"
//                else -> "UNKNOWN"
//            }
//        }
//        lifecycleOwner.lifecycle.addObserver(observer)
//        onDispose {
//            lifecycleOwner.lifecycle.removeObserver(observer)
//        }
//    }
//
//    DemoCard(title = "7. lifecycleScope 示例") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            verticalArrangement = Arrangement.spacedBy(12.dp)
//        ) {
//            // 当前生命周期状态
//            Card(
//                modifier = Modifier.fillMaxWidth(),
//                colors = CardDefaults.cardColors(
//                    containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
//                )
//            ) {
//                Column(
//                    modifier = Modifier.padding(12.dp)
//                ) {
//                    Text(
//                        text = "当前生命周期: $lifecycleState",
//                        fontSize = 14.sp,
//                        fontWeight = FontWeight.Bold
//                    )
//                    Text(
//                        text = "协程状态: ${if (isTaskRunning) "运行中" else "空闲"}",
//                        fontSize = 12.sp,
//                        color = Color.Gray
//                    )
//                }
//            }
//
//            // 计数器显示
//            Text(
//                text = "计数器: $counter",
//                fontSize = 24.sp,
//                fontWeight = FontWeight.Bold,
//                modifier = Modifier.fillMaxWidth(),
//                textAlign = TextAlign.Center
//            )
//
//            // 操作按钮
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.spacedBy(8.dp)
//            ) {
//                Button(
//                    onClick = {
//                        scope.launch {
//                            taskLog = taskLog + "✓ 启动了简单任务"
//                            delay(1000)
//                            counter++
//                            taskLog = taskLog + "✓ 简单任务完成"
//                        }
//                    },
//                    modifier = Modifier.weight(1f)
//                ) {
//                    Text("简单任务", fontSize = 12.sp)
//                }
//
//                Button(
//                    onClick = {
//                        if (!isTaskRunning) {
//                            isTaskRunning = true
//                            scope.launch {
//                                taskLog = taskLog + "⏰ 启动长时任务..."
//                                try {
//                                    repeat(10) { i ->
//                                        delay(1000)
//                                        counter++
//                                        taskLog = taskLog + "⏰ 长时任务进度: ${i + 1}/10"
//                                    }
//                                    taskLog = taskLog + "✅ 长时任务完成"
//                                } catch (e: Exception) {
//                                    taskLog = taskLog + "❌ 任务被取消: ${e.message}"
//                                } finally {
//                                    isTaskRunning = false
//                                }
//                            }
//                        }
//                    },
//                    modifier = Modifier.weight(1f),
//                    enabled = !isTaskRunning
//                ) {
//                    Text("长时任务", fontSize = 12.sp)
//                }
//            }
//
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.spacedBy(8.dp)
//            ) {
//                Button(
//                    onClick = {
//                        scope.launch {
//                            taskLog = taskLog + "🌐 模拟网络请求..."
//                            delay(2000)
//                            taskLog = taskLog + "✓ 网络请求成功"
//                            counter += 5
//                        }
//                    },
//                    modifier = Modifier.weight(1f)
//                ) {
//                    Text("网络请求", fontSize = 12.sp)
//                }
//
//                Button(
//                    onClick = {
//                        counter = 0
//                        taskLog = emptyList()
//                    },
//                    modifier = Modifier.weight(1f)
//                ) {
//                    Text("清空日志", fontSize = 12.sp)
//                }
//            }
//
//            HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//            // 任务日志
//            Text(
//                text = "任务日志 (${taskLog.size})",
//                fontSize = 14.sp,
//                fontWeight = FontWeight.Bold
//            )
//
//            if (taskLog.isEmpty()) {
//                Text(
//                    text = "点击上方按钮执行任务...",
//                    color = Color.Gray,
//                    fontSize = 12.sp,
//                    modifier = Modifier.padding(vertical = 8.dp)
//                )
//            } else {
//                LazyColumn(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .background(
//                            Color.Black.copy(alpha = 0.05f),
//                            shape = RoundedCornerShape(8.dp)
//                        )
//                        .padding(8.dp)
//                        .height(150.dp),
//                    verticalArrangement = Arrangement.spacedBy(4.dp)
//                ) {
//                    taskLog.takeLast(20).forEach { log ->
//                        item {
//                            Text(
//                                text = log,
//                                fontSize = 11.sp,
//                                fontFamily = FontFamily.Monospace
//                            )
//                        }
//                    }
//                }
//            }
//
//            // 说明文字
//            Text(
//                text = """
//                💡 关键特性:
//                • lifecycleScope 绑定到 LifecycleOwner（Activity/Fragment）
//                • 当生命周期被销毁(DESTROYED)时，所有协程会自动取消
//                • 适合 UI 相关的短期任务（网络请求、动画等）
//                • 与 viewModelScope 的区别：
//                  - viewModelScope: 绑定 ViewModel，配置变化时保留
//                  - lifecycleScope: 绑定生命周期，配置变化时取消
//
//                🧪 测试方法:
//                • 点击"长时任务"，然后旋转屏幕或切换应用
//                • 任务会被自动取消，不会继续执行
//                """.trimIndent(),
//                fontSize = 11.sp,
//                color = Color.Gray,
//                lineHeight = 16.sp,
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .background(
//                        Color(0xFFE3F2FD).copy(alpha = 0.5f),
//                        shape = RoundedCornerShape(8.dp)
//                    )
//                    .padding(8.dp)
//            )
//        }
//    }
//}
//
//// ============================================================
//// 8. Lifecycle.eventFlow 示例
//// ============================================================
//
//@Composable
//private fun LifecycleEventFlowDemo() {
//    val lifecycleOwner = LocalLifecycleOwner.current
//
//    var eventLog by remember { mutableStateOf<List<String>>(emptyList()) }
//    var currentState by remember { mutableStateOf("INITIALIZED") }
//    var eventCount by remember { mutableStateOf(0) }
//
//    // 使用 lifecycle.eventFlow 直接收集生命周期事件，LaunchedEffect 会在组合撤销时自动取消
//    LaunchedEffect(lifecycleOwner) {
//        lifecycleOwner.lifecycle.eventFlow.collect { event ->
//            eventCount++
//            val timestamp = formatTimestamp(TimeProvider.currentTimeMillis())
//            val eventName = when (event) {
//                Lifecycle.Event.ON_CREATE -> "🎬 ON_CREATE"
//                Lifecycle.Event.ON_START -> "👁️ ON_START"
//                Lifecycle.Event.ON_RESUME -> "▶️ ON_RESUME"
//                Lifecycle.Event.ON_PAUSE -> "⏸️ ON_PAUSE"
//                Lifecycle.Event.ON_STOP -> "⏹️ ON_STOP"
//                Lifecycle.Event.ON_DESTROY -> "💥 ON_DESTROY"
//                Lifecycle.Event.ON_ANY -> "🔄 ON_ANY"
//            }
//
//            currentState = when (event) {
//                Lifecycle.Event.ON_CREATE -> "CREATED"
//                Lifecycle.Event.ON_START -> "STARTED"
//                Lifecycle.Event.ON_RESUME -> "RESUMED"
//                Lifecycle.Event.ON_PAUSE -> "PAUSED"
//                Lifecycle.Event.ON_STOP -> "STOPPED"
//                Lifecycle.Event.ON_DESTROY -> "DESTROYED"
//                else -> currentState
//            }
//
//            eventLog = eventLog + "[$timestamp] $eventName → $currentState"
//        }
//    }
//
//    DemoCard(title = "8. Lifecycle.eventFlow 示例") {
//        Column(
//            modifier = Modifier.fillMaxWidth(),
//            verticalArrangement = Arrangement.spacedBy(12.dp)
//        ) {
//            // 状态卡片
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.spacedBy(12.dp)
//            ) {
//                Card(
//                    modifier = Modifier.weight(1f),
//                    colors = CardDefaults.cardColors(
//                        containerColor = when (currentState) {
//                            "RESUMED" -> Color(0xFF4CAF50).copy(alpha = 0.2f)
//                            "STARTED" -> Color(0xFF2196F3).copy(alpha = 0.2f)
//                            "CREATED" -> Color(0xFFFF9800).copy(alpha = 0.2f)
//                            "PAUSED" -> Color(0xFFFFC107).copy(alpha = 0.2f)
//                            "STOPPED" -> Color.Gray.copy(alpha = 0.2f)
//                            else -> Color.LightGray.copy(alpha = 0.2f)
//                        }
//                    )
//                ) {
//                    Column(
//                        modifier = Modifier.padding(16.dp),
//                        horizontalAlignment = Alignment.CenterHorizontally
//                    ) {
//                        Text(
//                            text = "当前状态",
//                            fontSize = 11.sp,
//                            color = Color.Gray
//                        )
//                        Text(
//                            text = currentState,
//                            fontSize = 18.sp,
//                            fontWeight = FontWeight.Bold
//                        )
//                    }
//                }
//
//                Card(
//                    modifier = Modifier.weight(1f),
//                    colors = CardDefaults.cardColors(
//                        containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
//                    )
//                ) {
//                    Column(
//                        modifier = Modifier.padding(16.dp),
//                        horizontalAlignment = Alignment.CenterHorizontally
//                    ) {
//                        Text(
//                            text = "事件计数",
//                            fontSize = 11.sp,
//                            color = Color.Gray
//                        )
//                        Text(
//                            text = "$eventCount",
//                            fontSize = 18.sp,
//                            fontWeight = FontWeight.Bold,
//                            color = MaterialTheme.colorScheme.primary
//                        )
//                    }
//                }
//            }
//
//            HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)
//
//            // 事件日志
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.SpaceBetween,
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Text(
//                    text = "生命周期事件流 (${eventLog.size})",
//                    fontSize = 14.sp,
//                    fontWeight = FontWeight.Bold
//                )
//                Button(
//                    onClick = {
//                        eventLog = emptyList()
//                        eventCount = 0
//                    },
//                    modifier = Modifier.height(32.dp)
//                ) {
//                    Text("清空", fontSize = 12.sp)
//                }
//            }
//
//            if (eventLog.isEmpty()) {
//                Text(
//                    text = "等待生命周期事件...",
//                    color = Color.Gray,
//                    fontSize = 12.sp,
//                    modifier = Modifier.padding(vertical = 8.dp)
//                )
//            } else {
//                LazyColumn(
//                    modifier = Modifier
//                        .fillMaxWidth()
//                        .background(
//                            Color.Black.copy(alpha = 0.05f),
//                            shape = RoundedCornerShape(8.dp)
//                        )
//                        .padding(8.dp)
//                        .height(200.dp),
//                    verticalArrangement = Arrangement.spacedBy(4.dp)
//                ) {
//                    eventLog.forEach { log ->
//                        item {
//                            Text(
//                                text = log,
//                                fontSize = 11.sp,
//                                fontFamily = FontFamily.Monospace
//                            )
//                        }
//                    }
//                }
//            }
//
//            // 生命周期状态流转图
//            Card(
//                modifier = Modifier.fillMaxWidth(),
//                colors = CardDefaults.cardColors(
//                    containerColor = Color(0xFFFFF9C4).copy(alpha = 0.3f)
//                )
//            ) {
//                Column(
//                    modifier = Modifier.padding(12.dp),
//                    verticalArrangement = Arrangement.spacedBy(4.dp)
//                ) {
//                    Text(
//                        text = "生命周期状态流转:",
//                        fontSize = 12.sp,
//                        fontWeight = FontWeight.Bold
//                    )
//                    Text(
//                        text = "INITIALIZED → CREATED → STARTED → RESUMED",
//                        fontSize = 10.sp,
//                        fontFamily = FontFamily.Monospace,
//                        color = Color(0xFF4CAF50)
//                    )
//                    Text(
//                        text = "RESUMED → PAUSED → STOPPED → DESTROYED",
//                        fontSize = 10.sp,
//                        fontFamily = FontFamily.Monospace,
//                        color = Color(0xFFF44336)
//                    )
//                }
//            }
//
//            // 说明文字
//            Text(
//                text = """
//                💡 Lifecycle.eventFlow 特性:
//
//                API 说明:
//                • lifecycle.eventFlow 是一个 Flow\<Lifecycle.Event\>
//                • 基于协程的生命周期观察方式
//                • 比 LifecycleObserver 更 Kotlin 风格
//
//                优势:
//                ✅ 可使用 Flow 操作符
//                ✅ 与协程结构化并发集成
//                ✅ 简洁、声明式
//
//                典型用法:
//                ```kotlin
//                LaunchedEffect(lifecycleOwner) {
//                    lifecycleOwner.lifecycle.eventFlow.collect { event ->
//                        // 处理事件
//                    }
//                }
//                ```
//
//                测试:
//                1. 打开页面观察 CREATE/START/RESUME
//                2. 切到后台观察 PAUSE/STOP
//                3. 返回前台观察 START/RESUME
//                """.trimIndent(),
//                fontSize = 11.sp,
//                color = Color.Gray,
//                lineHeight = 16.sp,
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .background(
//                        Color(0xFFE3F2FD).copy(alpha = 0.5f),
//                        shape = RoundedCornerShape(8.dp)
//                    )
//                    .padding(8.dp)
//            )
//        }
//    }
//}
//
//// ============================================================
//// KMP 兼容的工具函数
//// ============================================================
//
///**
// * 跨平台时间提供器
// * 使用 Kotlin 的 TimeSource.Monotonic 实现跨平台时间获取
// * 注意：这是单调递增的相对时间，适用于计时器、间隔测量等场景
// */
//private object TimeProvider {
//    // 应用启动时的时间标记
//    private val appStartMark = TimeSource.Monotonic.markNow()
//
//    /**
//     * 获取从应用启动以来经过的毫秒数
//     * 这是一个单调递增的相对时间戳，不受系统时钟调整影响
//     */
//    fun currentTimeMillis(): Long {
//        return appStartMark.elapsedNow().inWholeMilliseconds
//    }
//}
//
///**
// * 格式化时间（分:秒）- KMP 兼容版本
// */
//private fun formatTime(seconds: Int): String {
//    val mins = seconds / 60
//    val secs = seconds % 60
//    return "${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}"
//}
//
///**
// * 格式化时间戳（时:分:秒）- KMP 兼容版本
// */
//private fun formatTimestamp(timestamp: Long): String {
//    val seconds = (timestamp / 1000) % 60
//    val minutes = (timestamp / 60000) % 60
//    val hours = (timestamp / 3600000) % 24
//    return "${hours.toString().padStart(2, '0')}:" +
//            "${minutes.toString().padStart(2, '0')}:" +
//            seconds.toString().padStart(2, '0')
//}
//
//// ============================================================
//// 辅助组件
//// ============================================================
//
//@Composable
//private fun DemoCard(
//    title: String,
//    content: @Composable () -> Unit
//) {
//    Card(
//        modifier = Modifier.fillMaxWidth(),
//        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
//        colors = CardDefaults.cardColors(
//            containerColor = MaterialTheme.colorScheme.surface
//        )
//    ) {
//        Column(
//            modifier = Modifier.padding(16.dp)
//        ) {
//            Text(
//                text = title,
//                fontSize = 18.sp,
//                fontWeight = FontWeight.Bold,
//                color = MaterialTheme.colorScheme.primary
//            )
//            Spacer(modifier = Modifier.height(12.dp))
//            content()
//        }
//    }
//}