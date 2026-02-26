/**
 * Kuikly DSL Language Definition for Monaco Editor
 * 提供语法高亮、代码补全
 */

const KuiklyLanguage = {
    id: 'kuikly',

    // 语言配置
    configuration: {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['<', '>']
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" }
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' }
        ],
        indentationRules: {
            increaseIndentPattern: /^.*\{[^}]*$/,
            decreaseIndentPattern: /^\s*\}/
        }
    },

    // Monarch 语法定义
    monarchDefinition: {
        defaultToken: '',
        tokenPostfix: '.kuikly',

        keywords: [
            'package', 'import', 'class', 'interface', 'object', 'fun', 'val', 'var',
            'if', 'else', 'when', 'for', 'while', 'do', 'return', 'break', 'continue',
            'is', 'as', 'in', 'out', 'throw', 'try', 'catch', 'finally',
            'override', 'open', 'abstract', 'sealed', 'data', 'enum',
            'companion', 'internal', 'private', 'protected', 'public', 'lateinit',
            'by', 'lazy', 'this', 'super', 'null', 'true', 'false', 'it', 'get', 'set'
        ],

        kuiklyKeywords: [
            'attr', 'event', 'ref', 'body', 'vfor', 'vforIndex', 'vif',
            'observable', 'observableList', 'createAttr', 'createEvent',
            'willInit', 'viewDidLoad', 'pageDidAppear', 'pageDidDisappear',
            'created', 'mounted', 'updated', 'destroyed', 'setContent'
        ],

        kuiklyComponents: [
            'View', 'Text', 'RichText', 'Span', 'ImageSpan', 'Image', 'List',
            'Scroller', 'Input', 'TextArea', 'Canvas', 'Video', 'Audio',
            'Refresh', 'Modal', 'Slider', 'Switch', 'Checkbox', 'Radio',
            'Progress', 'ActivityIndicator', 'WebView', 'Blur', 'LinearGradient',
            'RadialGradient', 'Shadow', 'PAGView', 'Lottie', 'SVG'
        ],

        composeComponents: [
            'Box', 'Row', 'Column', 'LazyColumn', 'LazyRow', 'LazyVerticalGrid',
            'Spacer', 'Divider', 'Card', 'Surface', 'Scaffold', 'TopAppBar',
            'BottomNavigation', 'FloatingActionButton', 'Button', 'IconButton',
            'TextButton', 'OutlinedButton', 'TextField', 'OutlinedTextField',
            'Checkbox', 'RadioButton', 'Switch', 'Slider', 'CircularProgressIndicator',
            'LinearProgressIndicator', 'AlertDialog', 'DropdownMenu', 'Icon'
        ],

        kuiklyClasses: [
            'Pager', 'BasePager', 'ComposeContainer', 'ComposeView', 'ComposeAttr',
            'ComposeEvent', 'ViewBuilder', 'ViewContainer', 'DeclarativeBaseView',
            'Color', 'Percentage'
        ],

        attrMethods: [
            // 尺寸
            'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'size',
            // 间距
            'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
            'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
            // 背景
            'backgroundColor', 'backgroundImage', 'backgroundGradient',
            // 边框
            'borderWidth', 'borderColor', 'borderRadius', 'borderStyle', 'border',
            // 通用样式
            'opacity', 'visibility', 'hidden', 'zIndex', 'overflow',
            // Flex 布局（通用方法）
            'flex', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf',
            // Flex 布局（便捷方法）
            'flexDirectionRow', 'flexDirectionColumn',
            'justifyContentCenter', 'justifyContentFlexStart', 'justifyContentFlexEnd',
            'justifyContentSpaceAround', 'justifyContentSpaceEvenly', 'justifyContentSpaceBetween',
            'alignItemsCenter', 'alignItemsFlexStart', 'alignItemsFlexEnd', 'alignItemsStretch',
            'alignSelfCenter', 'allCenter',
            // 定位
            'position', 'positionAbsolute', 'positionRelative', 'absolutePosition',
            'top', 'bottom', 'left', 'right',
            // 变换
            'transform',
            // Text 属性 (TextAttr)
            'text', 'value', 'color', 'fontSize',
            'fontWeightNormal', 'fontWeightMedium', 'fontWeightSemiBold', 'fontWeightBold',
            'fontWeightExtraBold', 'fontWeightBlack',
            'fontWeight400', 'fontWeight500', 'fontWeight600', 'fontWeight700', 'fontWeight800', 'fontWeight900',
            'textAlignLeft', 'textAlignCenter', 'textAlignRight',
            'lineHeight', 'lineSpacing', 'letterSpacing', 'lines',
            'fontStyleItalic', 'fontStyleNormal',
            'textDecorationUnderLine', 'textDecorationLineThrough',
            'textOverFlowTail', 'textOverFlowClip', 'textOverFlowMiddle',
            'fontFamily',
            // Image 属性
            'src', 'resizeMode', 'placeholder', 'tintColor'
        ],

        eventMethods: [
            'click', 'doubleClick', 'longPress', 'touchStart', 'touchMove', 'touchEnd',
            'scroll', 'scrollToTop', 'scrollToBottom', 'loadMore',
            'focus', 'blur', 'textChange', 'submit'
        ],

        modifierMethods: [
            'fillMaxSize', 'fillMaxWidth', 'fillMaxHeight', 'wrapContentSize',
            'size', 'width', 'height', 'padding', 'background', 'clip',
            'border', 'clickable', 'offset', 'rotate', 'scale', 'alpha',
            'shadow', 'zIndex'
        ],

        annotations: [
            'Page', 'Composable', 'Preview'
        ],

        typeKeywords: [
            'Unit', 'Boolean', 'Byte', 'Short', 'Int', 'Long', 'Float', 'Double',
            'Char', 'String', 'Array', 'List', 'Map', 'Set', 'Any', 'Nothing',
            'Modifier', 'Dp', 'Sp'
        ],

        operators: [
            '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
            '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%'
        ],

        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
            root: [
                [/\s+/, 'white'],
                [/\/\/.*$/, 'comment'],
                [/\/\*/, 'comment', '@comment'],

                // 注解
                [/@[A-Z]\w*/, {
                    cases: {
                        '@annotations': 'annotation',
                        '@default': 'annotation'
                    }
                }],

                // 字符串
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string_double'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/'/, 'string', '@string_single'],
                [/"""/, 'string', '@string_multi'],

                // 数字
                [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+[Ll]?/, 'number.hex'],
                [/\d+[lLfFdD]?/, 'number'],

                // 标识符和关键字
                [/[A-Z][\w$]*/, {
                    cases: {
                        '@kuiklyComponents': 'type.component',
                        '@composeComponents': 'type.compose',
                        '@kuiklyClasses': 'type.class',
                        '@typeKeywords': 'type',
                        '@default': 'type.identifier'
                    }
                }],

                [/[a-z_$][\w$]*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@kuiklyKeywords': 'keyword.kuikly',
                        '@attrMethods': 'function.attr',
                        '@eventMethods': 'function.event',
                        '@modifierMethods': 'function.modifier',
                        '@default': 'identifier'
                    }
                }],

                [/[{}()\[\]]/, '@brackets'],
                [/@symbols/, {
                    cases: {
                        '@operators': 'operator',
                        '@default': ''
                    }
                }],

                [/[;,.]/, 'delimiter']
            ],

            comment: [
                [/[^\/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],

            string_double: [
                [/[^\\"$]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/\$\{/, { token: 'delimiter.bracket', next: '@string_template' }],
                [/\$\w+/, 'variable'],
                [/"/, 'string', '@pop']
            ],

            string_single: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/'/, 'string', '@pop']
            ],

            string_multi: [
                [/[^"]+/, 'string'],
                [/"""/, 'string', '@pop'],
                [/"/, 'string']
            ],

            string_template: [
                [/\{/, 'delimiter.bracket', '@string_template_nested'],
                [/\}/, 'delimiter.bracket', '@pop'],
                [/./, 'identifier']
            ],

            string_template_nested: [
                [/\{/, 'delimiter.bracket', '@push'],
                [/\}/, 'delimiter.bracket', '@pop'],
                [/./, 'identifier']
            ]
        }
    },

    // 代码补全提供者
    getCompletionProvider: function(monaco) {
        return {
            triggerCharacters: ['.', '@', ' '],
            provideCompletionItems: function(model, position) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const lineContent = model.getLineContent(position.lineNumber);
                const textBeforeCursor = lineContent.substring(0, position.column - 1);
                const suggestions = [];

                // 检测上下文
                const inAttrBlock = /attr\s*\{[^}]*$/.test(textBeforeCursor);
                const inEventBlock = /event\s*\{[^}]*$/.test(textBeforeCursor);
                const inBody = /body\s*\(\s*\)\s*\{[\s\S]*$/.test(model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                }));

                // 属性块内补全
                if (inAttrBlock) {
                    KuiklyLanguage.attrMethods.forEach(method => {
                        suggestions.push({
                            label: method,
                            kind: monaco.languages.CompletionItemKind.Method,
                            insertText: method + '(${1})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: `设置 ${method} 属性`,
                            range: range
                        });
                    });
                }

                // 事件块内补全
                if (inEventBlock) {
                    KuiklyLanguage.eventMethods.forEach(method => {
                        suggestions.push({
                            label: method,
                            kind: monaco.languages.CompletionItemKind.Method,
                            insertText: method + ' {\n\t${1}\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: `添加 ${method} 事件处理`,
                            range: range
                        });
                    });
                }

                // 组件补全
                if (inBody && !inAttrBlock && !inEventBlock) {
                    KuiklyLanguage.kuiklyComponents.forEach(comp => {
                        suggestions.push({
                            label: comp,
                            kind: monaco.languages.CompletionItemKind.Class,
                            insertText: comp + ' {\n\tattr {\n\t\t${1}\n\t}\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: `${comp} 组件`,
                            range: range
                        });
                    });
                }

                // 注解补全
                if (textBeforeCursor.endsWith('@')) {
                    KuiklyLanguage.annotations.forEach(ann => {
                        suggestions.push({
                            label: ann,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: ann,
                            documentation: `@${ann} 注解`,
                            range: range
                        });
                    });
                }

                // 关键字补全
                if (!inAttrBlock && !inEventBlock) {
                    KuiklyLanguage.keywords.forEach(keyword => {
                        suggestions.push({
                            label: keyword,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: keyword,
                            range: range
                        });
                    });

                    KuiklyLanguage.kuiklyKeywords.forEach(keyword => {
                        suggestions.push({
                            label: keyword,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: keyword,
                            range: range
                        });
                    });
                }

                return { suggestions };
            }
        };
    },

    // 代码片段
    getSnippets: function(monaco) {
        return [
            {
                label: 'Page - 自研 DSL 页面模板',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    '@Page("${1:PageName}")',
                    'internal class ${1:PageName} : BasePager() {',
                    '    ',
                    '    override fun body(): ViewBuilder {',
                    '        val ctx = this',
                    '        return {',
                    '            attr {',
                    '                backgroundColor(Color.WHITE)',
                    '            }',
                    '            ',
                    '            View {',
                    '                attr {',
                    '                    width(100f)',
                    '                    height(100f)',
                    '                    backgroundColor(Color.RED)',
                    '                }',
                    '            }',
                    '        }',
                    '    }',
                    '    ',
                    '    override fun createEvent(): ComposeEvent = ComposeEvent()',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建一个自研 DSL 页面模板',
                range: undefined
            },
            {
                label: 'Page - Compose DSL 页面模板',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    '@Page("${1:PageName}")',
                    'class ${1:PageName} : ComposeContainer() {',
                    '    ',
                    '    override fun willInit() {',
                    '        super.willInit()',
                    '        setContent {',
                    '            ${2:Content}()',
                    '        }',
                    '    }',
                    '    ',
                    '    @Composable',
                    '    fun ${2:Content}() {',
                    '        Column {',
                    '            Text("Hello Kuikly")',
                    '        }',
                    '    }',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建一个 Compose DSL 页面模板',
                range: undefined
            },
            {
                label: 'View - 基础视图组件',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'View {',
                    '    attr {',
                    '        width(${1:100f})',
                    '        height(${2:100f})',
                    '        backgroundColor(${3:Color.RED})',
                    '    }',
                    '    event {',
                    '        click {',
                    '            ${4}',
                    '        }',
                    '    }',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建一个 View 组件',
                range: undefined
            },
            {
                label: 'Text - 文本组件',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'Text {',
                    '    attr {',
                    '        text("${1:Hello World}")',
                    '        fontSize(${2:16f})',
                    '        color(${3:Color.BLACK})',
                    '    }',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建一个 Text 组件',
                range: undefined
            },
            {
                label: 'Image - 图片组件',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'Image {',
                    '    attr {',
                    '        src("${1:https://example.com/image.png}")',
                    '        width(${2:100f})',
                    '        height(${3:100f})',
                    '    }',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建一个 Image 组件',
                range: undefined
            },
            {
                label: 'observable - 响应式状态',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'var ${1:count} by observable(${2:0})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建一个响应式状态变量',
                range: undefined
            },
            {
                label: 'vfor - 循环渲染',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'vfor({ ${1:items} }) { item ->',
                    '    ${2:View {',
                    '        attr { }',
                    '    }}',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建循环渲染',
                range: undefined
            },
            {
                label: 'vif - 条件渲染',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'vif({ ${1:condition} }) {\n\t${2}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: '创建条件渲染',
                range: undefined
            }
        ];
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KuiklyLanguage;
}
