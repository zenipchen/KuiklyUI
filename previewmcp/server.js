/**
 * Kuikly DSL Preview - 编译服务器 (HMR 热更新终极优化版)
 * 
 * 功能：
 * 1. 接收前端发来的 DSL 代码
 * 2. 将代码写入 demo 项目的指定位置
 * 3. 支持三种编译模式：
 *    - 传统模式: 单次编译 (~20秒)
 *    - Continuous Build: 后台持续编译 (~14秒)
 *    - HMR 模式: Webpack Dev Server 热更新 (~3秒) ⭐推荐
 * 4. 通知前端刷新 H5 预览
 * 
 * 优化策略：
 * 1. HMR 热更新: Webpack Dev Server 通过 WebSocket 推送变更，无需刷新页面 (~省 10秒)
 * 2. 禁用 Source Map: 预览模式不需要调试，节省 ~2秒
 * 3. Webpack 持久缓存: 启用 filesystem 缓存，加速二次编译
 * 4. Continuous Build: 备选方案，后台 Gradle 持续监听文件变化
 * 
 * 性能对比：
 * - 传统模式: 首次 52秒, 后续 20秒
 * - Continuous Build: 首次 52秒, 后续 14秒
 * - HMR 模式: 首次 30秒, 后续 3秒 ⭐
 * 
 * 工作流程（HMR 模式）：
 *   启动 → 启动 HMR Dev Server (端口 8081) → 等待就绪
 *   Editor → POST /compile → 写入 .kt 文件 → HMR 自动检测变更 → WebSocket 推送更新 → 页面无刷新更新
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
    
    // ========== 编译模式配置 ==========
    // 可选模式: 'hmr' | 'continuous' | 'traditional'
    // - 'hmr': HMR 热更新模式 (推荐, 最快)
    // - 'continuous': Continuous Build 模式 (稳定)
    // - 'traditional': 传统单次编译模式
    COMPILE_MODE: process.env.COMPILE_MODE || 'hmr',
    
    // 编译任务配置
    COMPILE_TASK: ':demo:jsBrowserDevelopmentWebpack',
    HMR_TASK: ':demo:jsBrowserDevelopmentRun',  // HMR 模式使用 Dev Server
    
    // Continuous Build 参数
    GRADLE_ARGS_CB: [
        '-PpageName=PreviewPage',
        '-Pkuikly.useLocalKsp=false',
        '--parallel',
        '--build-cache',
        '--continuous'  // 核心：启用 continuous build
        // 注意：不使用 -q，以便检测 BUILD SUCCESSFUL
    ],
    
    // HMR 模式参数
    GRADLE_ARGS_HMR: [
        '-PpageName=PreviewPage',
        '-Pkuikly.useLocalKsp=false',
        '-PpreviewMode=true',  // 启用预览模式 (禁用 source map)
        '-PdevServerHost=0.0.0.0',  // 允许外部访问
        '--parallel',
        '--build-cache'
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
    // HMR Dev Server 端口 (Gradle 默认 8081)
    HMR_DEV_SERVER_PORT: 8081,
    // HMR 等待超时
    HMR_WAIT_TIMEOUT: 120000,  // 120秒等待 HMR 首次编译
    
    // 传统模式编译参数
    GRADLE_ARGS_FAST: [
        '-PpageName=PreviewPage',
        '-Pkuikly.useLocalKsp=false',
        '-PpreviewMode=true',
        '--parallel',
        '--build-cache'
    ],
    GRADLE_ARGS_FULL: [
        '-PpageName=PreviewPage',
        '-Pkuikly.useLocalKsp=false',
        '-PpreviewMode=true',
        '--parallel',
        '--build-cache',
        '--rerun-tasks'
    ],
    // 编译超时
    COMPILE_TIMEOUT_FAST: 120000,   // 2分钟
    COMPILE_TIMEOUT_FULL: 300000,   // 5分钟
};

// Continuous Build 进程
let continuousBuildProcess = null;
let isCBReady = false;
let cbCallbacks = [];  // 等待 CB 编译完成的回调队列

// HMR Dev Server 进程
let hmrProcess = null;
let isHMRReady = false;
let hmrCallbacks = [];  // 等待 HMR 就绪的回调队列

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

// ==================== HMR Dev Server 管理 ====================

/**
 * 启动 HMR Dev Server
 * 使用 Gradle 的 jsBrowserDevelopmentRun 任务，启动 Webpack Dev Server 带 HMR
 */
function startHMRServer() {
    if (hmrProcess) {
        console.log('[HMR] Dev Server 已在运行');
        return;
    }

    const args = [CONFIG.HMR_TASK, ...CONFIG.GRADLE_ARGS_HMR];
    const cmd = `${CONFIG.GRADLE_CMD} ${args.join(' ')}`;
    
    console.log('[HMR] 启动 Dev Server (HMR 模式)...');
    console.log(`[HMR] 命令: ${cmd}`);
    console.log('[HMR] 首次编译可能需要 30-60 秒，请耐心等待...');
    console.log(`[HMR] Dev Server 将运行在 http://localhost:${CONFIG.HMR_DEV_SERVER_PORT}`);

    // 设置 Java 环境变量
    const env = {
        ...process.env,
        JAVA_HOME: process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk',
        PATH: `${process.env.JAVA_HOME || '/usr/lib/jvm/java-17-konajdk'}/bin:${process.env.PATH}`
    };

    hmrProcess = spawn(CONFIG.GRADLE_CMD, args, {
        cwd: CONFIG.PROJECT_ROOT,
        env: env,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    let buffer = '';
    
    hmrProcess.stdout.on('data', (data) => {
        const str = data.toString();
        buffer += str;
        
        // 输出关键日志
        const lines = str.split('\n');
        lines.forEach(line => {
            // 检测 Webpack Dev Server 启动
            if (line.includes('Project is running at') || 
                line.includes('webpack compiled') ||
                line.includes('Compiled successfully') ||
                line.includes('HMR')) {
                console.log(`[HMR] ${line.trim()}`);
            }
            // 检测编译完成
            if (line.includes('BUILD SUCCESSFUL')) {
                console.log(`[HMR] ${line.trim()}`);
            }
        });

        // 检测首次编译完成 (webpack compiled 或 BUILD SUCCESSFUL)
        if (!isHMRReady && (str.includes('webpack compiled') || str.includes('Compiled successfully'))) {
            isHMRReady = true;
            console.log('[HMR] ✅ Dev Server 已就绪！');
            console.log(`[HMR] 访问 http://localhost:${CONFIG.HMR_DEV_SERVER_PORT} 查看预览`);
            console.log('[HMR] 后续代码变更将自动热更新，无需刷新页面');
            
            // 通知所有等待的回调
            hmrCallbacks.forEach(cb => cb(true));
            hmrCallbacks = [];
        }
    });

    hmrProcess.stderr.on('data', (data) => {
        const str = data.toString();
        
        // 检测 Webpack 编译输出 (Webpack 输出到 stderr)
        if (str.includes('asset') && str.includes('MiB') && str.includes('[emitted]')) {
            console.log(`[HMR] ${str.trim()}`);
            
            // 检测到编译输出，说明 Webpack 已就绪
            if (!isHMRReady) {
                isHMRReady = true;
                console.log('[HMR] ✅ Dev Server 已就绪！');
                console.log(`[HMR] 访问 http://localhost:${CONFIG.HMR_DEV_SERVER_PORT} 查看预览`);
                console.log('[HMR] 后续代码变更将自动热更新，无需刷新页面');
                
                // 通知所有等待的回调
                hmrCallbacks.forEach(cb => cb(true));
                hmrCallbacks = [];
            }
        }
        // 过滤掉常见的非错误日志
        else if (!str.includes('DeprecationWarning') && !str.includes('ExperimentalWarning')) {
            console.error(`[HMR Error] ${str.trim()}`);
        }
    });

    hmrProcess.on('exit', (code) => {
        console.log(`[HMR] Dev Server 已退出 (code: ${code})`);
        hmrProcess = null;
        isHMRReady = false;
    });

    hmrProcess.on('error', (err) => {
        console.error('[HMR Error] 启动失败:', err.message);
        hmrProcess = null;
    });
}

/**
 * 检查 HMR Dev Server 是否就绪（通过检测 nativevue2.js 是否存在）
 */
function checkHMRReady() {
    const jsPath = path.join(CONFIG.PROJECT_ROOT, 'demo/build/kotlin-webpack/js/developmentExecutable/nativevue2.js');
    return fs.existsSync(jsPath);
}

/**
 * 等待 HMR Dev Server 就绪
 */
function waitForHMR(timeout = CONFIG.HMR_WAIT_TIMEOUT) {
    return new Promise((resolve, reject) => {
        if (!hmrProcess) {
            reject(new Error('HMR Dev Server 未启动'));
            return;
        }

        // 如果已经就绪，直接返回
        if (isHMRReady || checkHMRReady()) {
            isHMRReady = true;
            resolve({ success: true, mode: 'hmr' });
            return;
        }

        // 添加回调
        const callback = (success) => {
            clearTimeout(timer);
            resolve({ success, mode: 'hmr' });
        };

        // 设置超时
        const timer = setTimeout(() => {
            const index = hmrCallbacks.indexOf(callback);
            if (index > -1) hmrCallbacks.splice(index, 1);
            reject(new Error(`等待 HMR Dev Server 就绪超时 (${timeout}ms)`));
        }, timeout);

        hmrCallbacks.push(callback);
    });
}

/**
 * 停止 HMR Dev Server
 */
function stopHMRServer() {
    if (hmrProcess) {
        console.log('[HMR] 停止 Dev Server...');
        hmrProcess.kill('SIGTERM');
        hmrProcess = null;
        isHMRReady = false;
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
 * 执行编译 - 根据配置模式选择不同策略
 * @param {boolean} fullCompile - 是否执行完整编译
 */
async function runCompile(fullCompile = false) {
    const mode = CONFIG.COMPILE_MODE;
    
    switch (mode) {
        case 'hmr':
            return runHMRCompile();
        case 'continuous':
            return runCBCompile();
        case 'traditional':
        default:
            return runTraditionalCompile(fullCompile);
    }
}

/**
 * HMR 模式编译 - 使用 Webpack Dev Server 热更新
 */
async function runHMRCompile() {
    const startTime = Date.now();
    
    // 确保 HMR Server 已启动
    if (!hmrProcess) {
        startHMRServer();
    }
    
    // 等待 HMR Server 就绪
    try {
        await waitForHMR();
        const elapsed = Date.now() - startTime;
        return { 
            success: true, 
            elapsed, 
            mode: 'hmr',
            message: 'HMR 热更新模式 - 代码变更将自动推送到浏览器'
        };
    } catch (error) {
        throw {
            success: false,
            elapsed: Date.now() - startTime,
            error: `HMR 模式失败: ${error.message}`
        };
    }
}

/**
 * Continuous Build 模式编译
 */
async function runCBCompile() {
    const startTime = Date.now();
    
    // 确保 CB 已启动
    if (!continuousBuildProcess) {
        startContinuousBuild();
    }
    
    // 等待 CB 完成一次编译
    try {
        const result = await waitForCBCompile();
        const elapsed = Date.now() - startTime;
        return { 
            success: true, 
            elapsed, 
            mode: 'continuous',
            ...result 
        };
    } catch (error) {
        throw {
            success: false,
            elapsed: Date.now() - startTime,
            error: `CB 模式失败: ${error.message}`
        };
    }
}

/**
 * 传统模式编译 - 单次 Gradle 构建
 * @param {boolean} fullCompile - 是否执行完整编译
 */
function runTraditionalCompile(fullCompile = false) {
    return new Promise((resolve, reject) => {
        const isFullBuild = fullCompile || needsFullCompile();
        
        // 只在首次编译时清理 KSP 缓存
        if (isFullBuild) {
            cleanKspCaches(true);
        }

        const startTime = Date.now();
        const gradleArgs = isFullBuild ? CONFIG.GRADLE_ARGS_FULL : CONFIG.GRADLE_ARGS_FAST;
        const timeout = isFullBuild ? CONFIG.COMPILE_TIMEOUT_FULL : CONFIG.COMPILE_TIMEOUT_FAST;
        
        console.log(`[编译] 模式: 传统模式 - ${isFullBuild ? '完整编译' : '增量编译（单页面）'}`);
        
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
                resolve({ success: true, elapsed, mode: 'traditional', stdout, isFullBuild });
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
 * 处理编译请求 - 多模式支持版
 * 
 * 支持三种模式：
 * - hmr: HMR 热更新模式 (推荐，最快)
 * - continuous: Continuous Build 模式 (稳定)
 * - traditional: 传统单次编译模式
 * 
 * 流程：
 * 1. 根据配置模式选择编译策略
 * 2. 写入 Kotlin 文件
 * 3. 等待编译完成
 * 4. 返回结果
 */
async function handleCompile(code, type, pageName) {
    const startTime = Date.now();
    const mode = CONFIG.COMPILE_MODE;
    
    // 根据不同模式处理
    if (mode === 'hmr') {
        // HMR 模式：写入文件后，HMR 自动检测变更
        if (!hmrProcess) {
            startHMRServer();
        }
        
        if (!isHMRReady) {
            throw new Error('HMR Dev Server 正在初始化首次编译，请稍后再试');
        }
        
        writeKotlinFile(code, type);
        console.log(`[编译] 文件已写入，HMR 将自动检测变更并热更新...`);
        
        // HMR 模式下不需要等待，立即返回
        const elapsed = Date.now() - startTime;
        
        return {
            success: true,
            pageName: pageName || 'PreviewPage',
            previewUrl: `http://localhost:${CONFIG.HMR_DEV_SERVER_PORT}`,
            elapsed: elapsed,
            mode: 'hmr',
            message: 'HMR 热更新模式 - 代码变更将自动推送到浏览器，无需手动刷新'
        };
        
    } else if (mode === 'continuous') {
        // Continuous Build 模式
        if (!continuousBuildProcess) {
            throw new Error('Continuous Build 未启动，请重启服务');
        }
        
        if (!isCBReady) {
            throw new Error('Continuous Build 正在初始化首次编译，请稍后再试');
        }
        
        writeKotlinFile(code, type);
        console.log(`[编译] 文件已写入，等待 Continuous Build 编译...`);
        
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
        
    } else {
        // 传统模式
        writeKotlinFile(code, type);
        console.log(`[编译] 开始传统模式编译...`);
        
        const result = await runTraditionalCompile();
        
        return {
            success: true,
            pageName: pageName || 'PreviewPage',
            previewUrl: null,
            elapsed: result.elapsed,
            mode: 'traditional'
        };
    }
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

    // 预览入口页面
    if (url.pathname === '/preview') {
        // HMR 模式：使用 iframe 嵌入 HMR Dev Server，避免跨域问题
        if (CONFIG.COMPILE_MODE === 'hmr') {
            // 主动检测 HMR 是否就绪
            if (!isHMRReady && !checkHMRReady()) {
                res.writeHead(503, { 'Content-Type': 'text/html' });
                res.end(`<html><body style="color:white;background:#1e1e2e;padding:20px;font-family:monospace">
                    <h2>⏳ HMR Dev Server 正在初始化...</h2>
                    <p>请等待首次编译完成后再刷新页面</p>
                    <p>首次编译大约需要 30-60 秒</p>
                    <script>setTimeout(()=>location.reload(), 3000);</script>
                </body></html>`);
                return;
            }
            // 标记为就绪
            isHMRReady = true;
            // 返回加载完整 H5 渲染引擎的预览页面
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const host = req.headers.host.split(':')[0];
            res.end(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Kuikly Preview (HMR)</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; }
        /* 隐藏输入框边框的样式 */
        input:focus { outline: none; }
        /* toast提示框的样式 */
        .toast-wrapper {
            position: fixed;
            z-index: 100000;
            height: 30px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 70px;
            background-color: white;
        }
        .toast-content {
            display: flex;
            font-size: 12px;
            line-height: 30px;
            min-width: 150px;
            border: 1px solid gray;
            border-radius: 5px;
            justify-content: center;
        }
        /* 隐藏滚动条的样式 */
        .list-no-scrollbar {
            scrollbar-width: none;
        }
        .list-no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* 转菊花的动画样式 */
        @keyframes activityIndicatorRotate {
            0% { transform: rotate(0deg) }
            100% { transform: rotate(360deg) }
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script src="http://${host}:${CONFIG.HMR_DEV_SERVER_PORT}/nativevue2.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/libpag@4.3.51/lib/libpag.umd.min.js"></script>
    <script src="http://${host}:8080/h5App.js"></script>
</body>
</html>`);
            return;
        }
        
        // 传统模式：动态生成 HTML
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
    const mode = CONFIG.COMPILE_MODE;
    const modeDisplay = {
        'hmr': 'HMR 热更新模式 ⭐',
        'continuous': 'Continuous Build 模式',
        'traditional': '传统单次编译模式'
    }[mode] || mode;
    
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         Kuikly DSL Preview Server (${modeDisplay})    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  编辑器地址:  http://localhost:${CONFIG.PORT}                        ║
║  项目根目录:  ${CONFIG.PROJECT_ROOT}
║                                                               ║
║  编译服务:    http://localhost:${CONFIG.PORT}/compile                ║
║  预览页面:    http://localhost:${CONFIG.PORT}/preview                ║
║  健康检查:    http://localhost:${CONFIG.PORT}/health                 ║
║                                                               ║
║  编译模式:    ${modeDisplay}
║  预览页文件:  ${CONFIG.PREVIEW_FILE_PATH}
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
${mode === 'hmr' ? `
║  🚀 HMR 热更新模式 (推荐):                                     ║
║     • Webpack Dev Server: 通过 WebSocket 推送变更            ║
║     • 无需页面刷新: 代码变更后自动更新 (Hot Module Replacement) ║
║     • 预期速度: 首次 ~30秒, 后续 ~3秒                         ║
║                                                               ║
║  📍 HMR Dev Server 地址: http://localhost:${CONFIG.HMR_DEV_SERVER_PORT}
║                                                               ║
` : mode === 'continuous' ? `
║  🚀 Continuous Build 模式:                                     ║
║     • 后台持续编译: Gradle 持续监听文件变化                   ║
║     • 跳过配置阶段: 首次后省去 ~8秒 Gradle 配置               ║
║     • 预期速度: 首次 ~50秒, 后续 ~14秒                        ║
║                                                               ║
` : `
║  📝 传统单次编译模式:                                          ║
║     • 每次请求都执行完整 Gradle 构建                          ║
║     • 预期速度: 每次 ~20秒                                    ║
║                                                               ║
`}╠═══════════════════════════════════════════════════════════════╣
║  ⚠️  首次启动需要 30-60 秒初始化，请等待就绪消息后再使用        ║
║                                                               ║
║  切换模式: COMPILE_MODE=hmr|continuous|traditional node server.js║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

    // 根据模式启动相应的服务
    if (mode === 'hmr') {
        console.log('\n[启动] 正在初始化 HMR Dev Server...');
        startHMRServer();
    } else if (mode === 'continuous') {
        console.log('\n[启动] 正在初始化 Continuous Build...');
        startContinuousBuild();
    } else {
        console.log('\n[启动] 传统模式已就绪，将在收到编译请求时执行构建');
    }
});

// 优雅退出
process.on('SIGINT', () => {
    console.log('\n[服务器] 正在关闭...');
    stopContinuousBuild();
    stopHMRServer();
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
    stopHMRServer();
    if (currentCompileProcess) {
        currentCompileProcess.kill('SIGTERM');
    }
    server.close(() => process.exit(0));
});
