import React, { useState, useRef } from 'react';
import { Card, Button, Space, message, Alert } from 'antd';
import { CodeOutlined, CopyOutlined, FormatPainterOutlined, UndoOutlined } from '@ant-design/icons';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { tryParseJsObject } from '@/utils/json';

const defaultValue = {
  name: "JSON Editor Demo",
  description: "A powerful JSON editor based on Monaco Editor",
  features: [
    "Syntax highlighting",
    "Error validation",
    "Auto formatting",
    "IntelliSense"
  ],
  version: 1.0,
  isEnabled: true
};

interface JSONError {
  message: string;
  line: number;
  column: number;
}

const JsonEditor: React.FC = () => {
  const [value, setValue] = useState<string>(JSON.stringify(defaultValue, null, 2));
  const [error, setError] = useState<JSONError | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [decorationIds, setDecorationIds] = useState<string[]>([]);

  // 处理内容变化
  const handleEditorChange = (value: string | undefined) => {
    setValue(value || '');
    
    // 当内容变化时，尝试验证新的内容
    try {
      JSON.parse(value || '');
      // 如果解析成功，清除错误状态和装饰器
      setError(null);
      if (editorRef.current && decorationIds.length) {
        const newDecorations = editorRef.current.deltaDecorations(decorationIds, []);
        setDecorationIds(newDecorations);
      }
    } catch {
      // 解析失败时不显示错误，等待用户完成输入
      // 只有在点击验证或格式化时才显示错误
    }
  };

  // 编辑器加载完成时的处理
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // 添加错误装饰器样式
    monaco.editor.defineTheme('jsonTheme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editorError.foreground': '#ff0000',
        'editorError.border': '#ff0000',
      }
    });

    monaco.editor.setTheme('jsonTheme');

    // 配置 JSON 语言特性
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemas: [{
        uri: "http://myserver/schema.json",
        fileMatch: ["*"],
        schema: {
          type: "object",
          properties: {
            name: { 
              type: "string",
              description: "The name of the project"
            },
            description: { 
              type: "string",
              description: "Project description"
            },
            features: {
              type: "array",
              items: { type: "string" },
              description: "List of features"
            },
            version: { 
              type: "number",
              description: "Project version"
            },
            isEnabled: { 
              type: "boolean",
              description: "Project status"
            }
          },
          required: ["name", "version"]
        }
      }]
    });

    // 使用防抖处理错误装饰器更新
    let decorationTimeout: NodeJS.Timeout;
    
    editor.onDidChangeModelDecorations(() => {
      // 清除之前的超时
      clearTimeout(decorationTimeout);
      
      // 设置新的超时
      decorationTimeout = setTimeout(() => {
        const model = editor.getModel();
        if (!model) return;

        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const errors = markers.filter(marker => marker.severity === monaco.MarkerSeverity.Error);

        // 清除旧的装饰器
        if (decorationIds.length) {
          const newDecorations = editor.deltaDecorations(decorationIds, []);
          setDecorationIds(newDecorations);
        }

        // 只有在有错误且编辑器内容未改变时才添加新的装饰器
        if (errors.length > 0 && error) {
          // 创建新的装饰器
          const decorations = errors.map(error => ({
            range: new monaco.Range(
              error.startLineNumber,
              error.startColumn,
              error.endLineNumber,
              error.endColumn
            ),
            options: {
              isWholeLine: true,
              className: 'errorLine',
              glyphMarginClassName: 'errorGlyph',
              hoverMessage: { value: error.message },
              inlineClassName: 'errorText',
              minimap: {
                color: '#ff0000',
                position: 1
              },
              overviewRuler: {
                color: '#ff0000',
                position: monaco.editor.OverviewRulerLane.Right
              }
            }
          }));

          // 应用新的装饰器
          const newDecorations = editor.deltaDecorations([], decorations);
          setDecorationIds(newDecorations);
        }
      }, 100);
    });

    // 组件卸载时清理
    return () => {
      clearTimeout(decorationTimeout);
      if (editorRef.current && decorationIds.length) {
        editorRef.current.deltaDecorations(decorationIds, []);
      }
    };
  };

  // 尝试将类 JSON 字符串转换为标准 JSON


  // 格式化 JSON
  const formatJSON = () => {
    try {
      // 尝试转换并格式化
      const processed = tryParseJsObject(value);
      const parsed = JSON.parse(processed);
      const formatted = JSON.stringify(parsed, null, 2);
      setValue(formatted);
      setError(null);
      message.success('格式化成功');
    } catch (e) {
      if (e instanceof Error) {
        const match = e.message.match(/at position (\d+)/);
        if (match) {
          const pos = parseInt(match[1]);
          const lines = value.substring(0, pos).split('\n');
          setError({
            message: e.message,
            line: lines.length,
            column: lines[lines.length - 1].length + 1
          });
        }
        message.error(`格式化失败：${e.message}`);
      }
    }
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      message.success('已复制到剪贴板');
    });
  };

  // 重置编辑器内容
  const resetContent = () => {
    setValue(JSON.stringify(defaultValue, null, 2));
    setError(null);
    message.info('已重置内容');
  };

  // 验证 JSON
  const validateJSON = () => {
    try {
      JSON.parse(value);
      setError(null);
      message.success('JSON 格式有效');
    } catch (e) {
      if (e instanceof Error) {
        const match = e.message.match(/at position (\d+)/);
        if (match) {
          const pos = parseInt(match[1]);
          const lines = value.substring(0, pos).split('\n');
          setError({
            message: e.message,
            line: lines.length,
            column: lines[lines.length - 1].length + 1
          });
        }
        message.error(`JSON 格式无效: ${e.message}`);
      }
    }
  };

  // 跳转到错误位置
  const goToError = () => {
    if (error && editorRef.current) {
      editorRef.current.revealLineInCenter(error.line);
      editorRef.current.setPosition({
        lineNumber: error.line,
        column: error.column
      });
      editorRef.current.focus();
    }
  };

  // 添加示例转换按钮
  const convertExample = () => {
    const jsObject = `{
  name: 'JSON Editor',
  version: 1.0,
  features: ['Format', 'Validate'],
  config: {
    theme: 'light',
    enabled: true,
    options: undefined,
  },
  author: "John Doe",
  lastUpdate: new Date(),  // 这个会被移除
  // 这是一个注释，会被移除
  tags: ['editor', 'json',],  // 最后的逗号会被处理
}`;
    setValue(jsObject);
  };

  return (
    <div className="p-6">
      <style>
        {`
          .errorLine {
            background-color: #ff000010;
            border-left: 3px solid #ff0000;
          }
          .errorGlyph {
            background-color: #ff0000;
            border-radius: 50%;
            margin-left: 5px;
          }
          .errorText {
            border-bottom: 2px dotted #ff0000;
          }
        `}
      </style>
      <Card 
        title="JSON 编辑器" 
        className="shadow-md"
        extra={
          <Space>
            <Button 
              icon={<FormatPainterOutlined />} 
              onClick={formatJSON}
              title="格式化"
            >
              格式化
            </Button>
            <Button 
              icon={<CopyOutlined />} 
              onClick={copyToClipboard}
              title="复制"
            >
              复制
            </Button>
            <Button 
              icon={<UndoOutlined />} 
              onClick={resetContent}
              title="重置"
            >
              重置
            </Button>
            <Button 
              type="primary"
              icon={<CodeOutlined />} 
              onClick={validateJSON}
              title="验证"
            >
              验证
            </Button>
            <Button
              onClick={convertExample}
              title="加载示例"
            >
              示例
            </Button>
          </Space>
        }
      >
        {error && (
          <Alert
            message="JSON 错误"
            description={
              <div>
                <p>{error.message}</p>
                <p>
                  位置: 第 {error.line} 行, 第 {error.column} 列
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={goToError}
                  >
                    跳转到错误位置
                  </Button>
                </p>
              </div>
            }
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => {
              setError(null);
              if (editorRef.current && decorationIds.length) {
                const newDecorations = editorRef.current.deltaDecorations(decorationIds, []);
                setDecorationIds(newDecorations);
              }
            }}
          />
        )}
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              theme: 'vs-light',
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
              renderValidationDecorations: 'on',
              suggest: {
                showWords: true,
                showSnippets: true,
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default JsonEditor;

export const routeConfig = {
  title: 'JSON 编辑器',
  icon: <CodeOutlined />,
  layout: true,
  auth: true,
}; 