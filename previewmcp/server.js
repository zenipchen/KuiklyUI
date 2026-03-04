/**
 * Kuikly DSL Preview - 编译服务器 (Continuous Build 优化版)
 * 
 * 功能：
 * 1. 接收前端发来的 DSL 代码
 * 2. 将代码写入 demo 项目的指定位置
 * 3. 使用 Continuous Build 模式，后台持续编译，大幅提速
 * 4. 通知前端刷新 H5 预览
 * 
 * 优化策略：
 * 1. Continuous Build: 后台 Gradle 持续监听文件变化，跳过重复配置阶段 (~省 8秒)
 * 2. 单页面编译：使用 -PpageName=PreviewPage 只编译预览页面
 * 3. 并行构建：充分利用多核 CPU
 * 4. 增量编译：利用 Gradle 缓存，只编译变更的代码
 * 5. 跳过 Bundle 打包：直接使用 webpack 产物
 * 
 * 性能对比：
 * - 传统模式: 首次 52秒, 后续 20秒
 * - Continuous Build: 首次 52秒, 后续 3-5秒
 * 
 * 工作流程：
 *   启动 → 启动 Continuous Build 后台进程 → 等待首次编译完成
 *   Editor → POST /compile → 写入 .kt 文件 → 等待 CB 检测变更并编译 → 返回结果
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

// ==================== 配置 ====================
const CONFIG = {
    PORT: 8080,
    // KuiklyUI 根目录（server.js 所在 previewmcp 的父目录）
    PROJECT_ROOT: path.resolve(__dirname, '..'),
    // 预览页面的 Kotlin 源文件路径
    PREVIEW_FILE_PATH: 'demo/src/commonMain/kotlin/com/tencent/kuikly/demo/pages/preview/PreviewPage.kt',
    // 包名
    PACKAGE_NAME: 'com.tencent.kuikly.demo.pages.preview',
    // 预览页面名称（用于单页面编译）
    PREVIEW_PAGE_NAME: 'PreviewPage',
    // Gradle 命令
    GRADLE_CMD: process.platform === 'win32' ? 'gradlew.bat' : './gradlew',
    // 编译任务 - 使用 webpack 任务
    COMPILE_TASK: ':demo:jsBrowserDevelopmentWebpack',
    // Continuous Build 参数
    GRADLE_ARGS_CB: [
        '-PpageName=PreviewPage',
        '-Pkuikly.useLocalKsp=false',
        '--parallel',
        '--build-cache',
        '--continuous'  // 核心：启用 continuous build
        // 注意：不使用 -q，以便检测 BUILD SUCCESSFUL
    ],
    // 静态文件目录
    STATIC_DIR: __dirname,
    // H5 预览相关产物路径
    NATIVEVUE2_JS_PATH: 'demo/build/kotlin-webpack/js/developmentExecutable/nativevue2.js',
    H5APP_JS_PATH: 'h5App/build/kotlin-webpack/js/developmentExecutable/h5App.js',
    H5APP_INDEX_HTML: 'h5App/build/processedResources/js/main/index.html',
    DEMO_ASSETS_PATH: 'demo/src/commonMain/assets',
    // Continuous Build 等待超时
    CB_WAIT_TIMEOUT: 60000,  // 60秒等待 CB 编译完成
};

// Continuous Build 进程
let continuousBuildProcess = null;
let isCBReady = false;
let cbCallbacks = [];  // 等待 CB 编译完成的回调队列

// 当前编译进程
let currentCompileProcess = null;
// 编译队列（确保同一时间只有一个编译任务）
let compileQueue = [];
let isCompiling = false;
// 是否已完成首次编译（首次编译后启用快速模式）
let isFirstCompileDone = false;
// 编译统计
let compileStats = {
    totalCompiles: 0,
    fastCompiles: 0,
    avgFastTime: 0,
    lastCompileTime: 0
};

// ==================== Continuous Build 管理 ====================

/**
 * 启动 Continuous Build 后台进程
 * 这是一个长期运行的 Gradle 进程，会持续监听文件变化并自动编译
 */
function startContinuousBuild() {
    if (continuousBuildProcess) {
        console.log('[CB] Continuous Build 已在运行');
        return;
    }

    const args = [CONFIG.COMPILE_TASK, ...CONFIG.GRADLE_ARGS_CB];
    const cmd = `${CONFIG.GRADLE_CMD} ${args.join(' ')}`;
    
    console.log('[CB] 启动 Continuous Build...');
    console.log(`[CB] 命令: ${cmd}`);
    console.log('[CB] 首次编译可能需要 30-60 秒，请耐心等待...');

    // 设置 Java 环境变量
    const env = {
        ...process.env,
        JAVA_HOME: process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk',
        PATH: `${process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk'}/bin:${process.env.PATH}`
    };

    continuousBuildProcess = spawn(CONFIG.GRADLE_CMD, args, {
        cwd: CONFIG.PROJECT_ROOT,
        env: env,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    let buffer = '';
    
    continuousBuildProcess.stdout.on('data', (data) => {
        const str = data.toString();
        buffer += str;
        
        // 输出关键日志
        const lines = str.split('\n');
        lines.forEach(line => {
            if (line.includes('BUILD SUCCESSFUL') || 
                line.includes('Waiting for changes') ||
                line.includes('Change detected') ||
                line.includes('Executing task')) {
                console.log(`[CB] ${line.trim()}`);
            }
        });

        // 检测首次编译完成
        if (!isCBReady && str.includes('BUILD SUCCESSFUL')) {
            isCBReady = true;
            console.log('[CB] ✅ 首次编译完成，Continuous Build 已就绪！');
            console.log('[CB] 后续编译将自动检测文件变化，预计 3-5 秒完成');
            
            // 通知所有等待的回调
            cbCallbacks.forEach(cb => cb(true));
            cbCallbacks = [];
        }

        // 检测编译完成并通知等待的回调
        if (str.includes('BUILD SUCCESSFUL')) {
            cbCallbacks.forEach(cb => cb(true));
            cbCallbacks = [];
        }
    });

    continuousBuildProcess.stderr.on('data', (data) => {
        const str = data.toString();
        // 只输出错误信息
        if (str.includes('ERROR') || str.includes('FAIL')) {
            console.error(`[CB Error] ${str.trim()}`);
        }
    });

    continuousBuildProcess.on('close', (code) => {
        console.log(`[CB] Continuous Build 已退出 (code: ${code})`);
        continuousBuildProcess = null;
        isCBReady = false;
    });

    continuousBuildProcess.on('error', (err) => {
        console.error('[CB Error] 启动失败:', err.message);
        continuousBuildProcess = null;
    });
}

/**
 * 等待 Continuous Build 完成一次编译
 */
function waitForCBCompile(timeout = CONFIG.CB_WAIT_TIMEOUT) {
    return new Promise((resolve, reject) => {
        if (!continuousBuildProcess) {
            reject(new Error('Continuous Build 未启动'));
            return;
        }

        // 添加回调
        const callback = (success) => {
            clearTimeout(timer);
            resolve({ success, mode: 'continuous-build' });
        };

        // 设置超时
        const timer = setTimeout(() => {
            // 从回调队列中移除
            const index = cbCallbacks.indexOf(callback);
            if (index > -1) cbCallbacks.splice(index, 1);
            reject(new Error(`等待 Continuous Build 编译超时 (${timeout}ms)`));
        }, timeout);

        cbCallbacks.push(callback);
    });
}

/**
 * 停止 Continuous Build
 */
function stopContinuousBuild() {
    if (continuousBuildProcess) {
        console.log('[CB] 停止 Continuous Build...');
        continuousBuildProcess.kill('SIGTERM');
        continuousBuildProcess = null;
        isCBReady = false;
    }
}

// ==================== 工具函数 ====================

/**
 * 确保预览目录存在
 */
function ensurePreviewDir() {
    const filePath = path.join(CONFIG.PROJECT_ROOT, CONFIG.PREVIEW_FILE_PATH);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * 为代码添加必要的 package 声明和 import
 */
function wrapCode(code, type) {
    let wrapped = '';

    // 检查是否已经包含 package 声明
    if (!code.includes('package ')) {
        wrapped += `package ${CONFIG.PACKAGE_NAME}\n\n`;
    }

    // 检查是否需要添加通用 import
    const needsImport = !code.includes('import ');
    if (needsImport) {
        if (type === 'compose') {
            wrapped += `import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.compose.*
import com.tencent.kuikly.compose.foundation.*
import com.tencent.kuikly.compose.foundation.layout.*
import com.tencent.kuikly.compose.foundation.lazy.*
import com.tencent.kuikly.compose.material.*
import com.tencent.kuikly.compose.runtime.*
import com.tencent.kuikly.compose.ui.*
import com.tencent.kuikly.compose.ui.graphics.*
import com.tencent.kuikly.compose.ui.text.font.*
import com.tencent.kuikly.compose.ui.unit.*
import com.tencent.kuikly.compose.ComposeContainer

`;
        } else {
            wrapped += `import com.tencent.kuikly.core.annotations.Page
import com.tencent.kuikly.core.base.*
import com.tencent.kuikly.core.pager.*
import com.tencent.kuikly.core.views.*
import com.tencent.kuikly.core.directives.*
import com.tencent.kuikly.core.reactive.*
import com.tencent.kuikly.core.layout.*
import com.tencent.kuikly.core.nvi.*
import com.tencent.kuikly.demo.pages.base.BasePager

`;
        }
    }

    wrapped += code;
    return wrapped;
}

/**
 * 写入 Kotlin 文件
 */
function writeKotlinFile(code, type) {
    ensurePreviewDir();
    const filePath = path.join(CONFIG.PROJECT_ROOT, CONFIG.PREVIEW_FILE_PATH);
    const wrappedCode = wrapCode(code, type);
    fs.writeFileSync(filePath, wrappedCode, 'utf-8');
    console.log(`[写入] ${filePath}`);
    return filePath;
}

/**
 * 清理 KSP 缓存，避免增量编译时 Storage already registered 错误
 * 注意：优化后只在首次编译时清理，增量编译时不清理以加快速度
 */
function cleanKspCaches(force = false) {
    if (!force && isFirstCompileDone) {
        // 增量编译时不清理缓存
        return;
    }
    const kspCacheDir = path.join(CONFIG.PROJECT_ROOT, 'demo/build/kspCaches');
    if (fs.existsSync(kspCacheDir)) {
        fs.rmSync(kspCacheDir, { recursive: true, force: true });
        console.log(`[清理] 已清理 KSP 缓存: ${kspCacheDir}`);
    }
}

/**
 * 检查是否需要完整编译
 * 如果 nativevue2.js 不存在，说明是首次编译
 */
function needsFullCompile() {
    const jsPath = path.join(CONFIG.PROJECT_ROOT, CONFIG.NATIVEVUE2_JS_PATH);
    return !fs.existsSync(jsPath);
}

/**
 * 执行 Gradle 编译（优化版）
 * @param {boolean} fullCompile - 是否执行完整编译
 */
function runGradleBuild(fullCompile = false) {
    return new Promise((resolve, reject) => {
        const isFullBuild = fullCompile || needsFullCompile();
        
        // 只在首次编译时清理 KSP 缓存
        if (isFullBuild) {
            cleanKspCaches(true);
        }

        const startTime = Date.now();
        const gradleArgs = isFullBuild ? CONFIG.GRADLE_ARGS_FULL : CONFIG.GRADLE_ARGS_FAST;
        const timeout = isFullBuild ? CONFIG.COMPILE_TIMEOUT_FULL : CONFIG.COMPILE_TIMEOUT_FAST;
        
        console.log(`[编译] 模式: ${isFullBuild ? '完整编译' : '增量编译（单页面）'}`);
        
        // 构建完整命令，使用 exec 而不是 spawn 以获得更好的性能
        const cmd = `cd "${CONFIG.PROJECT_ROOT}" && ${CONFIG.GRADLE_CMD} ${CONFIG.COMPILE_TASK} ${gradleArgs.join(' ')}`;
        console.log(`[编译] 执行: ${cmd}`);

        // 设置 Java 环境变量
        const env = {
            ...process.env,
            JAVA_HOME: process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk',
            PATH: `${process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk'}/bin:${process.env.PATH}`
        };

        const proc = exec(cmd, {
            env: env,
            maxBuffer: 50 * 1024 * 1024,  // 50MB buffer
            timeout: timeout
        }, (error, stdout, stderr) => {
            currentCompileProcess = null;
            const elapsed = Date.now() - startTime;
            
            if (stderr) {
                console.error(`[Gradle Error] ${stderr.trim()}`);
            }
            
            console.log(`[编译] 完成，耗时: ${elapsed}ms`);

            if (!error) {
                // 更新编译统计
                compileStats.totalCompiles++;
                compileStats.lastCompileTime = elapsed;
                if (!isFullBuild) {
                    compileStats.fastCompiles++;
                    compileStats.avgFastTime = Math.round(
                        (compileStats.avgFastTime * (compileStats.fastCompiles - 1) + elapsed) / compileStats.fastCompiles
                    );
                }
                // 标记首次编译完成
                if (!isFirstCompileDone) {
                    isFirstCompileDone = true;
                    console.log(`[编译] 首次编译完成，后续将启用增量编译模式`);
                }
                resolve({ success: true, elapsed, stdout, isFullBuild });
            } else {
                // 提取关键错误信息
                const errorMsg = extractCompileError(stdout + '\n' + stderr);
                console.error(`[编译错误] ${JSON.stringify({ success: false, elapsed, error: errorMsg })}`);
                reject({
                    success: false,
                    elapsed,
                    error: errorMsg || `编译失败: ${error.message}`
                });
            }
        });

        currentCompileProcess = proc;
        
        // 实时输出日志
        proc.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    console.log(`[Gradle] ${line.trim()}`);
                }
            });
        });
    });
}

/**
 * 从编译输出中提取关键错误信息
 */
function extractCompileError(output) {
    const lines = output.split('\n');
    const errorLines = [];
    let inError = false;

    for (const line of lines) {
        if (line.includes('error:') || line.includes('Error:') ||
            line.includes('FAILURE:') || line.includes('e: ')) {
            inError = true;
        }
        if (inError) {
            errorLines.push(line.trim());
            if (errorLines.length > 20) break;
        }
        if (inError && line.trim() === '') {
            inError = false;
        }
    }

    return errorLines.join('\n') || null;
}

/**
 * 处理编译请求 - Continuous Build 优化版
 * 
 * 流程：
 * 1. 检查 Continuous Build 是否就绪
 * 2. 写入 Kotlin 文件
 * 3. 等待 CB 自动检测变更并完成编译
 * 4. 返回结果
 */
async function handleCompile(code, type, pageName) {
    const startTime = Date.now();
    
    // 检查 Continuous Build 状态
    if (!continuousBuildProcess) {
        throw new Error('Continuous Build 未启动，请重启服务');
    }
    
    if (!isCBReady) {
        throw new Error('Continuous Build 正在初始化首次编译，请稍后再试');
    }
    
    // 写入文件 - CB 会自动检测文件变化
    writeKotlinFile(code, type);
    console.log(`[编译] 文件已写入，等待 Continuous Build 编译...`);
    
    // 等待 CB 完成编译
    const result = await waitForCBCompile();
    const elapsed = Date.now() - startTime;
    
    // 更新统计
    compileStats.totalCompiles++;
    compileStats.fastCompiles++;
    compileStats.avgFastTime = Math.round(
        (compileStats.avgFastTime * (compileStats.fastCompiles - 1) + elapsed) / compileStats.fastCompiles
    );
    
    console.log(`[编译] 完成，耗时: ${elapsed}ms (Continuous Build 模式)`);
    
    return {
        success: true,
        pageName: pageName || 'PreviewPage',
        previewUrl: null,
        elapsed: elapsed,
        mode: 'continuous-build'
    };
}

// ==================== HTTP 服务器 ====================

/**
 * 解析 POST body
 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

/**
 * MIME 类型映射
 */
function getMimeType(ext) {
    const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    return types[ext] || 'application/octet-stream';
}

/**
 * 提供静态文件
 */
function serveStaticFile(res, urlPath) {
    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    filePath = path.join(CONFIG.STATIC_DIR, filePath);

    // 安全检查
    if (!filePath.startsWith(CONFIG.STATIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not Found');
        return;
    }

    const ext = path.extname(filePath);
    const mimeType = getMimeType(ext);
    const content = fs.readFileSync(filePath);

    res.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache'
    });
    res.end(content);
}

/**
 * 设置 CORS 头
 */
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * 创建 HTTP 服务器
 */
const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    // 处理 CORS 预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${CONFIG.PORT}`);

    // ===== API 路由 =====

    // 健康检查（增加编译统计信息）
    if (url.pathname === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            isCompiling: isCompiling,
            projectRoot: CONFIG.PROJECT_ROOT,
            compileMode: isFirstCompileDone ? 'incremental' : 'full',
            stats: compileStats
        }));
        return;
    }

    // 编译接口
    if (url.pathname === '/compile' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { code, type, pageName } = body;

            if (!code) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: '代码不能为空' }));
                return;
            }

            console.log(`\n========== 新的编译请求 ==========`);
            console.log(`类型: ${type}, 页面: ${pageName}`);
            console.log(`代码长度: ${code.length} 字符`);

            isCompiling = true;
            const result = await handleCompile(code, type || 'dsl', pageName);
            isCompiling = false;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            isCompiling = false;
            console.error('[编译错误]', err);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: err.error || err.message || '编译失败'
            }));
        }
        return;
    }

    // 获取当前预览代码
    if (url.pathname === '/code' && req.method === 'GET') {
        const filePath = path.join(CONFIG.PROJECT_ROOT, CONFIG.PREVIEW_FILE_PATH);
        if (fs.existsSync(filePath)) {
            const code = fs.readFileSync(filePath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, code }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: '预览文件不存在' }));
        }
        return;
    }

    // 取消编译
    if (url.pathname === '/cancel' && req.method === 'POST') {
        if (currentCompileProcess) {
            currentCompileProcess.kill('SIGTERM');
            currentCompileProcess = null;
            isCompiling = false;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: '编译已取消' }));
        return;
    }

    // ===== H5 预览相关路由 =====

    // 预览入口页面：动态生成 HTML，将 nativevue2.js 和 h5App.js 都指向本服务
    if (url.pathname === '/preview') {
        const h5IndexPath = path.join(CONFIG.PROJECT_ROOT, CONFIG.H5APP_INDEX_HTML);
        if (fs.existsSync(h5IndexPath)) {
            let html = fs.readFileSync(h5IndexPath, 'utf-8');
            // 将 nativevue2.js 的地址改为从本服务加载
            html = html.replace(
                'http://127.0.0.1:8083/nativevue2.js',
                `/nativevue2.js?t=${Date.now()}`
            );
            // 将 h5App.js 的地址改为从本服务加载
            html = html.replace(
                'h5App.js',
                `/h5App.js?t=${Date.now()}`
            );
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(html);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<html><body style="color:white;background:#1e1e2e;padding:20px;font-family:monospace">
                <h2>⚠️ h5App 未编译</h2>
                <p>请先执行以下命令编译 h5App：</p>
                <pre style="background:#313244;padding:12px;border-radius:8px">cd ${CONFIG.PROJECT_ROOT} && ./gradlew :h5App:jsBrowserDevelopmentWebpack</pre>
            </body></html>`);
        }
        return;
    }

    // 提供 nativevue2.js（demo 编译产物）
    if (url.pathname === '/nativevue2.js') {
        const jsPath = path.join(CONFIG.PROJECT_ROOT, CONFIG.NATIVEVUE2_JS_PATH);
        if (fs.existsSync(jsPath)) {
            const content = fs.readFileSync(jsPath);
            res.writeHead(200, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(content);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('nativevue2.js not found. Please compile demo first.');
        }
        return;
    }

    // 提供 h5App.js（h5App 编译产物）
    if (url.pathname === '/h5App.js') {
        const jsPath = path.join(CONFIG.PROJECT_ROOT, CONFIG.H5APP_JS_PATH);
        if (fs.existsSync(jsPath)) {
            const content = fs.readFileSync(jsPath);
            res.writeHead(200, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(content);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('h5App.js not found. Please compile h5App first.');
        }
        return;
    }

    // 提供 assets 资源（demo 中的资源文件）
    if (url.pathname.startsWith('/assets/')) {
        const assetPath = path.join(CONFIG.PROJECT_ROOT, CONFIG.DEMO_ASSETS_PATH, url.pathname.replace('/assets/', ''));
        if (fs.existsSync(assetPath)) {
            const ext = path.extname(assetPath);
            const content = fs.readFileSync(assetPath);
            res.writeHead(200, {
                'Content-Type': getMimeType(ext),
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        } else {
            res.writeHead(404);
            res.end('Asset not found');
        }
        return;
    }

    // ===== 静态文件 =====
    serveStaticFile(res, url.pathname);
});

// ==================== 启动服务器 ====================

server.listen(CONFIG.PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         Kuikly DSL Preview Server (Continuous Build 优化版)   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  编辑器地址:  http://localhost:${CONFIG.PORT}                        ║
║  项目根目录:  ${CONFIG.PROJECT_ROOT}
║                                                               ║
║  编译服务:    http://localhost:${CONFIG.PORT}/compile                ║
║  预览页面:    http://localhost:${CONFIG.PORT}/preview                ║
║  健康检查:    http://localhost:${CONFIG.PORT}/health                 ║
║                                                               ║
║  预览页文件:  ${CONFIG.PREVIEW_FILE_PATH}
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  🚀 编译优化 (Continuous Build 模式):                          ║
║     • 后台持续编译: Gradle 持续监听文件变化                   ║
║     • 跳过配置阶段: 首次后省去 ~8秒 Gradle 配置               ║
║     • 快速响应: 文件变更后 3-5 秒完成编译                     ║
║                                                               ║
║  ⚠️  首次启动需要 30-60 秒初始化 Continuous Build             ║
║     请等待 '[CB] ✅ 首次编译完成' 消息后再使用                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

    // 启动 Continuous Build
    console.log('\n[启动] 正在初始化 Continuous Build...');
    startContinuousBuild();
});

// 优雅退出
process.on('SIGINT', () => {
    console.log('\n[服务器] 正在关闭...');
    stopContinuousBuild();
    if (currentCompileProcess) {
        currentCompileProcess.kill('SIGTERM');
    }
    server.close(() => {
        console.log('[服务器] 已关闭');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    stopContinuousBuild();
    if (currentCompileProcess) {
        currentCompileProcess.kill('SIGTERM');
    }
    server.close(() => process.exit(0));
});
