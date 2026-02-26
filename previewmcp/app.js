/**
 * Kuikly DSL Editor - Main Application
 * 核心逻辑：编辑器初始化、编译调度、预览管理
 */

(function () {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        COMPILE_SERVER_PORT: 3456,
        DEBOUNCE_DELAY: 1500,     // 自动编译防抖延迟(ms)
    };

    // ==================== 状态管理 ====================
    const state = {
        editor: null,
        currentTab: 'dsl',        // 'dsl' | 'compose'
        isCompiling: false,
        autoCompile: false,
        debounceTimer: null,
        compileAbortController: null,
        currentDevice: 'phone',
    };

    // ==================== Monaco Editor 初始化 ====================
    function initMonacoEditor() {
        require.config({
            paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
        });

        require(['vs/editor/editor.main'], function (monaco) {
            // 注册 Kuikly 语言
            registerKuiklyLanguage(monaco);

            // 创建编辑器
            state.editor = monaco.editor.create(document.getElementById('editor-container'), {
                value: KuiklyExamples['hello-world'].code,
                language: 'kuikly',
                theme: 'kuikly-dark',
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', monospace",
                lineNumbers: 'on',
                minimap: { enabled: true, scale: 2 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                bracketPairColorization: { enabled: true },
                guides: {
                    bracketPairs: true,
                    indentation: true,
                },
                padding: { top: 16 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                renderWhitespace: 'boundary',
            });

            // 监听编辑器内容变化
            state.editor.onDidChangeModelContent(() => {
                if (state.autoCompile) {
                    debouncedCompile();
                }
            });

            // 监听光标位置
            state.editor.onDidChangeCursorPosition((e) => {
                document.getElementById('line-col').textContent =
                    `行 ${e.position.lineNumber}, 列 ${e.position.column}`;
            });

            // 快捷键: Ctrl/Cmd + S 编译
            state.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                triggerCompile();
            });

            // 快捷键: Ctrl/Cmd + Shift + F 格式化
            state.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
                state.editor.getAction('editor.action.formatDocument').run();
            });
        });
    }

    // 注册 Kuikly 语言
    function registerKuiklyLanguage(monaco) {
        // 注册语言
        monaco.languages.register({ id: 'kuikly' });

        // 设置语言配置
        monaco.languages.setLanguageConfiguration('kuikly', KuiklyLanguage.configuration);

        // 设置 Monarch 语法
        monaco.languages.setMonarchTokensProvider('kuikly', KuiklyLanguage.monarchDefinition);

        // 注册补全提供者
        monaco.languages.registerCompletionItemProvider('kuikly',
            KuiklyLanguage.getCompletionProvider(monaco));

        // 注册自定义主题
        monaco.editor.defineTheme('kuikly-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: 'c678dd' },
                { token: 'keyword.kuikly', foreground: 'e06c75', fontStyle: 'bold' },
                { token: 'type.component', foreground: '61afef', fontStyle: 'bold' },
                { token: 'type.compose', foreground: '56b6c2', fontStyle: 'bold' },
                { token: 'type.class', foreground: 'e5c07b' },
                { token: 'type', foreground: 'e5c07b' },
                { token: 'type.identifier', foreground: 'e5c07b' },
                { token: 'function.attr', foreground: '98c379' },
                { token: 'function.event', foreground: 'd19a66' },
                { token: 'function.modifier', foreground: '56b6c2' },
                { token: 'annotation', foreground: 'e06c75' },
                { token: 'string', foreground: '98c379' },
                { token: 'string.escape', foreground: '56b6c2' },
                { token: 'number', foreground: 'd19a66' },
                { token: 'number.float', foreground: 'd19a66' },
                { token: 'number.hex', foreground: 'd19a66' },
                { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
                { token: 'variable', foreground: 'e06c75' },
                { token: 'operator', foreground: '56b6c2' },
                { token: 'delimiter', foreground: 'abb2bf' },
                { token: 'identifier', foreground: 'abb2bf' },
            ],
            colors: {
                'editor.background': '#1e1e2e',
                'editor.foreground': '#cdd6f4',
                'editor.lineHighlightBackground': '#313244',
                'editorCursor.foreground': '#6366f1',
                'editor.selectionBackground': '#45475a',
                'editor.inactiveSelectionBackground': '#313244',
                'editorLineNumber.foreground': '#6c7086',
                'editorLineNumber.activeForeground': '#cdd6f4',
                'editorIndentGuide.background': '#313244',
                'editorIndentGuide.activeBackground': '#45475a',
            }
        });
    }

    // ==================== 编译相关 ====================

    /**
     * 防抖编译
     */
    function debouncedCompile() {
        clearTimeout(state.debounceTimer);
        state.debounceTimer = setTimeout(() => {
            triggerCompile();
        }, CONFIG.DEBOUNCE_DELAY);
    }

    /**
     * 触发编译
     */
    async function triggerCompile() {
        if (state.isCompiling) {
            // 取消正在进行的编译
            if (state.compileAbortController) {
                state.compileAbortController.abort();
            }
        }

        const code = state.editor.getValue();
        if (!code.trim()) return;

        state.isCompiling = true;
        state.compileAbortController = new AbortController();

        updateBuildStatus('compiling', '⏳ 编译中...');
        disableRunButton(true);
        hideError();

        const startTime = Date.now();

        try {
            const response = await fetch(`http://localhost:${CONFIG.COMPILE_SERVER_PORT}/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    type: state.currentTab,
                    pageName: 'PreviewPage'
                }),
                signal: state.compileAbortController.signal
            });

            const result = await response.json();
            const elapsed = Date.now() - startTime;

            if (result.success) {
                updateBuildStatus('success', '✅ 编译成功', `${elapsed}ms`);
                loadPreview(result.previewUrl || result.pageName);
            } else {
                updateBuildStatus('error', '❌ 编译失败');
                showError(result.error || '未知编译错误');
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                updateBuildStatus('warning', '⚠️ 编译已取消');
            } else {
                const elapsed = Date.now() - startTime;
                // 编译服务未启动时，显示提示信息
                updateBuildStatus('error', '❌ 无法连接编译服务', `${elapsed}ms`);
                showError(
                    `无法连接到编译服务器 (localhost:${CONFIG.COMPILE_SERVER_PORT})\n\n` +
                    `请先启动编译服务：\n` +
                    `  cd previewmcp && node server.js\n\n` +
                    `详细信息：${err.message}`
                );
            }
        } finally {
            state.isCompiling = false;
            state.compileAbortController = null;
            disableRunButton(false);
        }
    }

    /**
     * 加载预览
     */
    function loadPreview(pageName) {
        const iframe = document.getElementById('preview-iframe');
        // 直接使用同一服务器的 /preview 路由，传入 page_name 参数
        const previewUrl = `http://localhost:${CONFIG.COMPILE_SERVER_PORT}/preview?page_name=${pageName || 'PreviewPage'}&t=${Date.now()}`;
        
        // 强制重新加载（加 timestamp 避免缓存）
        iframe.src = previewUrl;
    }

    // ==================== UI 更新 ====================

    function updateBuildStatus(type, text, time) {
        const statusText = document.getElementById('status-text');
        const buildTime = document.getElementById('build-time');

        statusText.textContent = text;
        statusText.className = 'status-text ' + type;

        if (time) {
            buildTime.textContent = time;
        } else {
            buildTime.textContent = '';
        }
    }

    function showError(message) {
        const errorPanel = document.getElementById('error-panel');
        const errorContent = document.getElementById('error-content');
        errorContent.textContent = message;
        errorPanel.classList.add('show');
    }

    function hideError() {
        document.getElementById('error-panel').classList.remove('show');
    }

    function disableRunButton(disabled) {
        const runBtn = document.getElementById('run-btn');
        runBtn.disabled = disabled;
        if (disabled) {
            runBtn.innerHTML = '<span>⏳</span> 编译中...';
        } else {
            runBtn.innerHTML = '<span>▶️</span> 编译预览';
        }
    }

    function showLoading(message) {
        let overlay = document.querySelector('.loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">${message || '编译中...'}</div>
            `;
            document.body.appendChild(overlay);
        }
    }

    function hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // ==================== 设备切换 ====================

    function switchDevice(device) {
        state.currentDevice = device;
        const frame = document.getElementById('device-frame');

        // 移除所有设备类
        frame.classList.remove('phone', 'tablet', 'desktop');
        frame.classList.add(device);

        // 更新设备按钮状态
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === device);
        });
    }

    // ==================== 分隔条拖拽 ====================

    function initResizer() {
        const resizer = document.getElementById('resizer');
        const editorPanel = document.querySelector('.editor-panel');

        let startX = 0;
        let startWidth = 0;

        function onMouseDown(e) {
            startX = e.clientX;
            startWidth = editorPanel.getBoundingClientRect().width;
            resizer.classList.add('active');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        function onMouseMove(e) {
            const dx = e.clientX - startX;
            const containerWidth = document.querySelector('.main-content').getBoundingClientRect().width;
            const newWidth = ((startWidth + dx) / containerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) {
                editorPanel.style.width = newWidth + '%';
            }
        }

        function onMouseUp() {
            resizer.classList.remove('active');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            // 通知 Monaco 编辑器布局变化
            if (state.editor) {
                state.editor.layout();
            }
        }

        resizer.addEventListener('mousedown', onMouseDown);
    }

    // ==================== Tab 切换 ====================

    function switchTab(tab) {
        state.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // 更新文件名显示
        document.getElementById('file-name').textContent =
            tab === 'dsl' ? 'PreviewPage.kt' : 'PreviewComposePage.kt';

        // 切换到对应的默认示例
        const defaultExample = tab === 'dsl' ? 'hello-world' : 'compose-box';
        if (state.editor) {
            state.editor.setValue(KuiklyExamples[defaultExample].code);
        }
    }

    // ==================== 示例选择 ====================

    function loadExample(exampleId) {
        const example = KuiklyExamples[exampleId];
        if (!example) return;

        // 切换到对应 Tab
        if (example.type !== state.currentTab) {
            switchTab(example.type);
        }

        if (state.editor) {
            state.editor.setValue(example.code);
        }
    }

    // ==================== 复制代码 ====================

    async function copyCode() {
        if (!state.editor) return;
        const code = state.editor.getValue();
        try {
            await navigator.clipboard.writeText(code);
            const btn = document.getElementById('copy-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>✅</span> 已复制';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    }

    // ==================== 检查编译服务连接 ====================

    async function checkConnection() {
        try {
            const response = await fetch(`http://localhost:${CONFIG.COMPILE_SERVER_PORT}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                document.getElementById('connection-status').textContent = '🟢 编译服务已连接';
                return true;
            }
        } catch (err) {
            // ignore
        }
        document.getElementById('connection-status').textContent = '🔴 编译服务未连接';
        return false;
    }

    // ==================== 事件绑定 ====================

    function bindEvents() {
        // Tab 切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // 示例选择
        document.getElementById('example-select').addEventListener('change', function () {
            if (this.value) {
                loadExample(this.value);
                this.value = '';
            }
        });

        // 运行按钮
        document.getElementById('run-btn').addEventListener('click', () => {
            triggerCompile();
        });

        // 格式化按钮
        document.getElementById('format-btn').addEventListener('click', () => {
            if (state.editor) {
                state.editor.getAction('editor.action.formatDocument').run();
            }
        });

        // 复制按钮
        document.getElementById('copy-btn').addEventListener('click', copyCode);

        // 刷新预览
        document.getElementById('refresh-btn').addEventListener('click', () => {
            const iframe = document.getElementById('preview-iframe');
            if (iframe.src) {
                iframe.contentWindow.location.reload();
            }
        });

        // 开发者工具
        document.getElementById('devtools-btn').addEventListener('click', () => {
            const iframe = document.getElementById('preview-iframe');
            if (iframe.src) {
                window.open(iframe.src, '_blank');
            }
        });

        // 设备切换
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', () => switchDevice(btn.dataset.device));
        });

        // 关闭错误面板
        document.getElementById('error-close').addEventListener('click', hideError);

        // 窗口大小变化时重新布局
        window.addEventListener('resize', () => {
            if (state.editor) {
                state.editor.layout();
            }
        });
    }

    // ==================== 初始化 ====================

    function init() {
        initMonacoEditor();
        initResizer();
        bindEvents();

        // 定期检查编译服务连接
        checkConnection();
        setInterval(checkConnection, 10000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
