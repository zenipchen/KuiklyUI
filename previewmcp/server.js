/**
 * Kuikly DSL Preview - 编译服务器
 * 
 * 功能：
 * 1. 接收前端发来的 DSL 代码
 * 2. 将代码写入 demo 项目的指定位置
 * 3. 调用 Gradle 编译生成 JS Bundle
 * 4. 通知前端刷新 H5 预览
 * 
 * 工作流程：
 *   Editor → POST /compile → 写入 .kt 文件 → Gradle 编译 demo → 
 *   packLocalJsBundleDebug → H5 iframe 刷新加载最新 nativevue2.js
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
    // Gradle 命令
    GRADLE_CMD: process.platform === 'win32' ? 'gradlew.bat' : './gradlew',
    // 编译任务
    COMPILE_TASK: ':demo:packLocalJsBundleDebug',
    // 额外的 Gradle 参数
    GRADLE_ARGS: ['-Pkuikly.useLocalKsp=false', '--no-daemon'],
    // 编译超时时间（ms）- 首次编译需要下载依赖，设置为10分钟
    COMPILE_TIMEOUT: 600000,
    // 静态文件目录
    STATIC_DIR: __dirname,
    // H5 预览相关产物路径
    NATIVEVUE2_JS_PATH: 'demo/build/dist/js/developmentExecutable/nativevue2.js',
    H5APP_JS_PATH: 'h5App/build/kotlin-webpack/js/developmentExecutable/h5App.js',
    H5APP_INDEX_HTML: 'h5App/build/processedResources/js/main/index.html',
    DEMO_ASSETS_PATH: 'demo/src/commonMain/assets',
};

// 当前编译进程
let currentCompileProcess = null;
// 编译队列（确保同一时间只有一个编译任务）
let compileQueue = [];
let isCompiling = false;

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
 */
function cleanKspCaches() {
    const kspCacheDir = path.join(CONFIG.PROJECT_ROOT, 'demo/build/kspCaches');
    if (fs.existsSync(kspCacheDir)) {
        fs.rmSync(kspCacheDir, { recursive: true, force: true });
        console.log(`[清理] 已清理 KSP 缓存: ${kspCacheDir}`);
    }
}

/**
 * 执行 Gradle 编译
 */
function runGradleBuild() {
    return new Promise((resolve, reject) => {
        // 编译前清理 KSP 缓存
        cleanKspCaches();

        const startTime = Date.now();
        console.log(`[编译] 开始执行: ${CONFIG.GRADLE_CMD} ${CONFIG.COMPILE_TASK}`);

        const args = [CONFIG.COMPILE_TASK, ...CONFIG.GRADLE_ARGS];
        // 设置 Java 环境变量
        const env = {
            ...process.env,
            JAVA_HOME: process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk',
            PATH: `${process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk'}/bin:${process.env.PATH}`
        };

        const proc = spawn(CONFIG.GRADLE_CMD, args, {
            cwd: CONFIG.PROJECT_ROOT,
            shell: true,
            env: env,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        currentCompileProcess = proc;

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
            const str = data.toString();
            stdout += str;
            // 输出编译进度
            const lines = str.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    console.log(`[Gradle] ${line.trim()}`);
                }
            });
        });

        proc.stderr.on('data', (data) => {
            const str = data.toString();
            stderr += str;
            console.error(`[Gradle Error] ${str.trim()}`);
        });

        proc.on('close', (code) => {
            currentCompileProcess = null;
            const elapsed = Date.now() - startTime;
            console.log(`[编译] 完成，退出码: ${code}, 耗时: ${elapsed}ms`);

            if (code === 0) {
                resolve({ success: true, elapsed, stdout });
            } else {
                // 提取关键错误信息
                const errorMsg = extractCompileError(stdout + '\n' + stderr);
                reject({
                    success: false,
                    elapsed,
                    error: errorMsg || `编译失败，退出码: ${code}`
                });
            }
        });

        proc.on('error', (err) => {
            currentCompileProcess = null;
            reject({
                success: false,
                error: `无法启动 Gradle: ${err.message}`
            });
        });

        // 超时处理
        setTimeout(() => {
            if (currentCompileProcess === proc) {
                proc.kill('SIGTERM');
                reject({
                    success: false,
                    error: `编译超时（${CONFIG.COMPILE_TIMEOUT / 1000}秒）`
                });
            }
        }, CONFIG.COMPILE_TIMEOUT);
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
 * 处理编译请求
 */
async function handleCompile(code, type, pageName) {
    // 写入文件
    writeKotlinFile(code, type);

    // 执行编译
    const result = await runGradleBuild();
    return {
        success: true,
        pageName: pageName || 'PreviewPage',
        previewUrl: null,  // iframe 会通过 page_name 参数加载
        elapsed: result.elapsed
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

    // 健康检查
    if (url.pathname === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            isCompiling: isCompiling,
            projectRoot: CONFIG.PROJECT_ROOT
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
╔══════════════════════════════════════════════════════╗
║         Kuikly DSL Preview Server                    ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  编辑器地址:  http://localhost:${CONFIG.PORT}               ║
║  项目根目录:  ${CONFIG.PROJECT_ROOT}
║                                                      ║
║  编译服务:    http://localhost:${CONFIG.PORT}/compile        ║
║  预览页面:    http://localhost:${CONFIG.PORT}/preview        ║
║  健康检查:    http://localhost:${CONFIG.PORT}/health         ║
║                                                      ║
║  预览页文件:  ${CONFIG.PREVIEW_FILE_PATH}
║                                                      ║
║  所有服务已集成，无需额外启动其他服务！                ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
`);
});

// 优雅退出
process.on('SIGINT', () => {
    console.log('\n[服务器] 正在关闭...');
    if (currentCompileProcess) {
        currentCompileProcess.kill('SIGTERM');
    }
    server.close(() => {
        console.log('[服务器] 已关闭');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    if (currentCompileProcess) {
        currentCompileProcess.kill('SIGTERM');
    }
    server.close(() => process.exit(0));
});
