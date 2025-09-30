# Kuikly 安全分析规范

## 1. 安全概述

### 1.1 安全目标
- 保护用户数据安全
- 防止恶意攻击
- 符合法律法规要求
- 建立安全开发文化

### 1.2 安全原则
- **最小权限**: 只申请必要的权限
- **数据加密**: 敏感数据必须加密
- **输入验证**: 所有输入都不可信
- **安全默认**: 默认配置应是安全的
- **纵深防御**: 多层安全防护

### 1.3 安全开发生命周期

```
需求分析 → 安全设计 → 安全编码 → 安全测试 → 安全部署 → 安全监控
    ↓          ↓          ↓          ↓          ↓          ↓
 威胁建模    风险评估    代码审查    渗透测试    加固配置    应急响应
```

## 2. 常见安全威胁

### 2.1 OWASP Top 10 Mobile

1. **不当的平台使用**
2. **不安全的数据存储**
3. **不安全的通信**
4. **不安全的认证**
5. **密码学使用不当**
6. **不安全的授权**
7. **客户端代码质量问题**
8. **代码篡改**
9. **逆向工程**
10. **无关功能**

### 2.2 Kotlin/KMP 特定威胁

- 反射滥用
- 序列化漏洞
- 跨平台数据泄漏
- 平台特定安全问题
- 第三方依赖漏洞

## 3. 数据安全

### 3.1 敏感数据识别

**敏感数据类型**:
- 用户凭证（密码、Token）
- 个人信息（身份证、电话）
- 财务信息（银行卡、支付密码）
- 隐私信息（位置、联系人）
- 业务机密（密钥、配置）

### 3.2 数据存储安全

❌ **不安全的存储**:
```kotlin
// 明文存储密码
sharedPreferences.edit()
    .putString("password", password)
    .apply()

// 明文存储 Token
val file = File(context.filesDir, "token.txt")
file.writeText(token)
```

✅ **安全的存储**:
```kotlin
// Android: 使用 EncryptedSharedPreferences
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val encryptedPrefs = EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

encryptedPrefs.edit()
    .putString("token", token)
    .apply()

// iOS: 使用 Keychain
actual fun saveSecureData(key: String, value: String) {
    // 使用 iOS Keychain API
}

// 通用: 自定义加密
fun encrypt(data: String, key: ByteArray): String {
    val cipher = Cipher.getInstance("AES/GCM/NoPadding")
    val secretKey = SecretKeySpec(key, "AES")
    cipher.init(Cipher.ENCRYPT_MODE, secretKey)
    val encrypted = cipher.doFinal(data.toByteArray())
    return Base64.encode(encrypted)
}
```

### 3.3 数据传输安全

❌ **不安全的通信**:
```kotlin
// HTTP 明文传输
val url = "http://api.example.com/user/data"
client.get(url)

// 未验证证书
val client = HttpClient {
    install(HttpsRedirect) {
        allowHttpsFromHttps = false // 允许降级
    }
}
```

✅ **安全的通信**:
```kotlin
// 强制 HTTPS
val client = HttpClient {
    install(HttpsRedirect) {
        checkStatus = true
    }
    
    // 证书固定
    install(CertificatePinning) {
        pin("api.example.com", "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
    }
}

// 使用安全的 URL
val url = "https://api.example.com/user/data"
```

**Android Network Security Config**:
```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set>
            <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

### 3.4 内存安全

❌ **内存中的敏感数据**:
```kotlin
// 密码作为 String 存储
var password: String = "user_password"

// 密码可能长期保留在内存中
```

✅ **安全处理敏感数据**:
```kotlin
// 使用 CharArray 代替 String
var password: CharArray = charArrayOf('p', 'a', 's', 's')

fun clearPassword() {
    password.fill('0') // 使用后立即清除
}

// 使用后销毁
try {
    authenticate(password)
} finally {
    clearPassword()
}
```

## 4. 认证与授权

### 4.1 安全的认证

❌ **不安全的认证**:
```kotlin
// 客户端验证密码
fun login(username: String, password: String): Boolean {
    return password == "123456" // 硬编码密码
}

// 明文传输密码
fun authenticate(username: String, password: String) {
    api.post("/login") {
        setBody("""{"username":"$username","password":"$password"}""")
    }
}
```

✅ **安全的认证**:
```kotlin
// 服务端验证
suspend fun login(username: String, password: String): Result<AuthToken> {
    // 使用 HTTPS
    // 密码经过哈希处理（在服务端）
    val response = api.post("https://api.example.com/login") {
        contentType(ContentType.Application.Json)
        setBody(LoginRequest(username, hashPassword(password)))
    }
    
    return when (response.status) {
        HttpStatusCode.OK -> {
            val token = response.body<AuthToken>()
            // 安全存储 Token
            secureStorage.saveToken(token)
            Result.Success(token)
        }
        else -> Result.Error(AuthException())
    }
}

// 使用强密码策略
fun validatePassword(password: String): Boolean {
    return password.length >= 8 &&
           password.any { it.isUpperCase() } &&
           password.any { it.isLowerCase() } &&
           password.any { it.isDigit() } &&
           password.any { it in "!@#$%^&*()" }
}
```

### 4.2 Token 管理

```kotlin
class TokenManager(private val secureStorage: SecureStorage) {
    private var accessToken: String? = null
    private var refreshToken: String? = null
    private var expiresAt: Long = 0
    
    fun saveTokens(access: String, refresh: String, expiresIn: Long) {
        accessToken = access
        refreshToken = refresh
        expiresAt = System.currentTimeMillis() + expiresIn * 1000
        
        // 持久化存储（加密）
        secureStorage.save("access_token", access)
        secureStorage.save("refresh_token", refresh)
    }
    
    fun getAccessToken(): String? {
        // 检查是否过期
        if (System.currentTimeMillis() >= expiresAt) {
            // 刷新 Token
            refreshAccessToken()
        }
        return accessToken
    }
    
    private suspend fun refreshAccessToken() {
        refreshToken?.let { refresh ->
            // 使用 refresh token 获取新的 access token
            val newTokens = api.refreshToken(refresh)
            saveTokens(newTokens.access, newTokens.refresh, newTokens.expiresIn)
        }
    }
    
    fun clearTokens() {
        accessToken = null
        refreshToken = null
        expiresAt = 0
        secureStorage.clear()
    }
}
```

### 4.3 会话管理

```kotlin
class SessionManager {
    private var sessionId: String? = null
    private var lastActivityTime: Long = 0
    private val sessionTimeout = 30 * 60 * 1000 // 30 分钟
    
    fun createSession(): String {
        sessionId = generateSecureSessionId()
        lastActivityTime = System.currentTimeMillis()
        return sessionId!!
    }
    
    fun validateSession(): Boolean {
        if (sessionId == null) return false
        
        val now = System.currentTimeMillis()
        if (now - lastActivityTime > sessionTimeout) {
            invalidateSession()
            return false
        }
        
        lastActivityTime = now
        return true
    }
    
    fun invalidateSession() {
        sessionId = null
        lastActivityTime = 0
        // 清除相关数据
    }
    
    private fun generateSecureSessionId(): String {
        val random = SecureRandom()
        val bytes = ByteArray(32)
        random.nextBytes(bytes)
        return Base64.encode(bytes)
    }
}
```

## 5. 输入验证

### 5.1 输入校验

❌ **未验证的输入**:
```kotlin
fun processUserInput(input: String) {
    // 直接使用用户输入
    database.execute("SELECT * FROM users WHERE name = '$input'")
}

fun loadUrl(url: String) {
    // 未验证 URL
    webView.loadUrl(url)
}
```

✅ **验证输入**:
```kotlin
fun processUserInput(input: String): Result<Unit> {
    // 验证输入格式
    if (!isValidInput(input)) {
        return Result.Error(InvalidInputException())
    }
    
    // 清理输入
    val sanitized = sanitizeInput(input)
    
    // 使用参数化查询
    database.execute(
        "SELECT * FROM users WHERE name = ?",
        arrayOf(sanitized)
    )
    
    return Result.Success(Unit)
}

fun loadUrl(url: String): Result<Unit> {
    // 验证 URL 格式
    if (!URLUtil.isValidUrl(url)) {
        return Result.Error(InvalidUrlException())
    }
    
    // 验证 URL 域名白名单
    val uri = Uri.parse(url)
    if (!isAllowedDomain(uri.host)) {
        return Result.Error(UnauthorizedDomainException())
    }
    
    webView.loadUrl(url)
    return Result.Success(Unit)
}

fun isValidInput(input: String): Boolean {
    // 长度检查
    if (input.length > MAX_INPUT_LENGTH) return false
    
    // 字符检查
    if (!input.matches(Regex("^[a-zA-Z0-9_]+$"))) return false
    
    return true
}

fun sanitizeInput(input: String): String {
    return input
        .trim()
        .replace(Regex("[^a-zA-Z0-9_]"), "")
}
```

### 5.2 防止注入攻击

```kotlin
// SQL 注入防护
fun queryUser(userId: String): User? {
    // ✅ 使用参数化查询
    return database.query(
        "SELECT * FROM users WHERE id = ?",
        arrayOf(userId)
    ).firstOrNull()
}

// XSS 防护
fun displayUserContent(content: String): String {
    // ✅ HTML 转义
    return content
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#x27;")
}

// 路径遍历防护
fun readUserFile(filename: String): Result<String> {
    // ✅ 验证文件路径
    val file = File(userDataDir, filename)
    
    // 检查路径是否在允许的目录内
    if (!file.canonicalPath.startsWith(userDataDir.canonicalPath)) {
        return Result.Error(SecurityException("Invalid file path"))
    }
    
    return Result.Success(file.readText())
}
```

## 6. 密码学

### 6.1 加密算法选择

**推荐算法**:
- 对称加密: AES-256-GCM
- 非对称加密: RSA-2048, ECC
- 哈希: SHA-256, SHA-3
- 消息认证: HMAC-SHA256

❌ **弱加密**:
```kotlin
// 不要使用 MD5
val md5 = MessageDigest.getInstance("MD5")

// 不要使用 DES
val cipher = Cipher.getInstance("DES")

// 不要使用 ECB 模式
val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
```

✅ **强加密**:
```kotlin
// 使用 AES-GCM
fun encrypt(data: ByteArray, key: ByteArray): ByteArray {
    val cipher = Cipher.getInstance("AES/GCM/NoPadding")
    val secretKey = SecretKeySpec(key, "AES")
    
    // 生成随机 IV
    val iv = ByteArray(12)
    SecureRandom().nextBytes(iv)
    val gcmSpec = GCMParameterSpec(128, iv)
    
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec)
    val encrypted = cipher.doFinal(data)
    
    // 返回 IV + 密文
    return iv + encrypted
}

fun decrypt(encryptedData: ByteArray, key: ByteArray): ByteArray {
    val cipher = Cipher.getInstance("AES/GCM/NoPadding")
    val secretKey = SecretKeySpec(key, "AES")
    
    // 提取 IV
    val iv = encryptedData.sliceArray(0 until 12)
    val ciphertext = encryptedData.sliceArray(12 until encryptedData.size)
    val gcmSpec = GCMParameterSpec(128, iv)
    
    cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec)
    return cipher.doFinal(ciphertext)
}
```

### 6.2 密钥管理

❌ **不安全的密钥管理**:
```kotlin
// 硬编码密钥
const val SECRET_KEY = "1234567890abcdef"

// 明文存储密钥
val key = File("key.txt").readText()
```

✅ **安全的密钥管理**:
```kotlin
// Android: 使用 KeyStore
class KeyManager {
    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply {
        load(null)
    }
    
    fun generateKey(alias: String) {
        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )
        
        val keyGenSpec = KeyGenParameterSpec.Builder(
            alias,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .build()
        
        keyGenerator.init(keyGenSpec)
        keyGenerator.generateKey()
    }
    
    fun getKey(alias: String): SecretKey {
        return keyStore.getKey(alias, null) as SecretKey
    }
}

// iOS: 使用 Keychain
actual class KeyManager {
    actual fun saveKey(alias: String, key: ByteArray) {
        // 使用 iOS Security Framework 保存到 Keychain
    }
    
    actual fun getKey(alias: String): ByteArray? {
        // 从 Keychain 读取
        return null
    }
}
```

## 7. 权限管理

### 7.1 最小权限原则

❌ **过度申请权限**:
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<!-- ... 很多不需要的权限 -->
```

✅ **只申请必要权限**:
```xml
<!-- AndroidManifest.xml -->
<!-- 只申请应用实际需要的权限 -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 7.2 运行时权限请求

```kotlin
class PermissionManager(private val activity: Activity) {
    
    fun requestPermission(
        permission: String,
        rationale: String,
        onGranted: () -> Unit,
        onDenied: () -> Unit
    ) {
        when {
            // 已授权
            ContextCompat.checkSelfPermission(
                activity,
                permission
            ) == PackageManager.PERMISSION_GRANTED -> {
                onGranted()
            }
            
            // 需要解释原因
            ActivityCompat.shouldShowRequestPermissionRationale(
                activity,
                permission
            ) -> {
                // 显示解释对话框
                showRationaleDialog(rationale) {
                    requestPermissionInternal(permission, onGranted, onDenied)
                }
            }
            
            // 直接请求
            else -> {
                requestPermissionInternal(permission, onGranted, onDenied)
            }
        }
    }
    
    private fun requestPermissionInternal(
        permission: String,
        onGranted: () -> Unit,
        onDenied: () -> Unit
    ) {
        ActivityCompat.requestPermissions(
            activity,
            arrayOf(permission),
            REQUEST_CODE
        )
    }
}
```

## 8. 代码混淆与加固

### 8.1 ProGuard/R8 配置

```proguard
# 基本混淆
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontoptimize
-verbose

# 保留行号信息（便于定位崩溃）
-keepattributes SourceFile,LineNumberTable

# 保留泛型信息
-keepattributes Signature

# 保留注解
-keepattributes *Annotation*

# 混淆类名和成员名
-repackageclasses ''
-allowaccessmodification

# 保留 Kotlin 元数据
-keep class kotlin.Metadata { *; }

# 保留 Serializable 类
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 移除日志
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
```

### 8.2 字符串加密

```kotlin
// 敏感字符串加密
object SecureStrings {
    // 编译时加密的字符串
    private const val ENCRYPTED_API_KEY = "U2FsdGVkX1..."
    
    fun getApiKey(): String {
        return decrypt(ENCRYPTED_API_KEY)
    }
    
    private fun decrypt(encrypted: String): String {
        // 解密逻辑
        return ""
    }
}

// 使用
val apiKey = SecureStrings.getApiKey()
```

## 9. 安全测试

### 9.1 静态代码分析

**工具**:
- Android Lint
- Detekt
- SpotBugs
- SonarQube

**配置 Detekt**:
```yaml
# detekt.yml
security:
  active: true
  HardcodedPassword:
    active: true
  InsecureRandom:
    active: true
  WeakCryptography:
    active: true
```

### 9.2 动态安全测试

**检查项**:
- [ ] 网络流量抓包分析
- [ ] 存储数据安全检查
- [ ] Root/越狱检测绕过测试
- [ ] 调试保护测试
- [ ] 代码注入测试

### 9.3 渗透测试

```kotlin
// Root 检测
fun isDeviceRooted(): Boolean {
    val paths = arrayOf(
        "/system/app/Superuser.apk",
        "/sbin/su",
        "/system/bin/su",
        "/system/xbin/su"
    )
    
    return paths.any { File(it).exists() }
}

// 调试检测
fun isDebuggable(context: Context): Boolean {
    return (context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
}

// 模拟器检测
fun isEmulator(): Boolean {
    return Build.FINGERPRINT.contains("generic") ||
           Build.MODEL.contains("sdk") ||
           Build.PRODUCT.contains("emulator")
}
```

## 10. 安全监控

### 10.1 异常监控

```kotlin
class SecurityMonitor {
    fun logSecurityEvent(event: SecurityEvent) {
        when (event) {
            is RootDetected -> {
                // 记录 Root 检测事件
                analytics.logEvent("security_root_detected")
            }
            is InvalidTokenAttempt -> {
                // 记录无效 Token 尝试
                analytics.logEvent("security_invalid_token")
            }
            is SuspiciousActivity -> {
                // 记录可疑活动
                analytics.logEvent("security_suspicious_activity")
            }
        }
    }
}
```

### 10.2 安全告警

```kotlin
class SecurityAlertManager {
    suspend fun checkSecurityThreats() {
        // 检查 Root
        if (isDeviceRooted()) {
            showSecurityAlert("设备已被 Root，应用可能存在安全风险")
        }
        
        // 检查调试
        if (isDebuggable()) {
            // 生产环境不应该是可调试的
            reportSecurityIssue("App is debuggable in production")
        }
        
        // 检查证书固定
        if (!verifyCertificatePinning()) {
            showSecurityAlert("网络连接可能不安全")
        }
    }
}
```

## 11. 安全检查清单

### 11.1 开发阶段

- [ ] 没有硬编码的敏感信息
- [ ] 所有输入都经过验证
- [ ] 使用强加密算法
- [ ] 安全存储敏感数据
- [ ] 使用 HTTPS 通信
- [ ] 正确处理权限
- [ ] 实现安全的认证授权
- [ ] 避免使用已知漏洞的依赖

### 11.2 测试阶段

- [ ] 静态代码分析通过
- [ ] 安全测试用例通过
- [ ] 渗透测试通过
- [ ] 第三方安全审计通过

### 11.3 发布阶段

- [ ] 代码混淆已启用
- [ ] 调试代码已移除
- [ ] 日志输出已控制
- [ ] 安全配置已检查
- [ ] 应急响应计划已准备

---

**文档维护者**: Kuikly 安全团队  
**最后更新**: 2025-09-30
