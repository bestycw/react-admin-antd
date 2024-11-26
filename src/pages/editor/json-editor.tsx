import React, { useState, useRef } from 'react';
import { Card, Button, Space, message, Alert } from 'antd';
import { CodeOutlined, CopyOutlined, FormatPainterOutlined, UndoOutlined } from '@ant-design/icons';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

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

  // 添加错误装饰器
  const addErrorDecoration = (line: number, column: number, message: string) => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    // 创建错误装饰器
    const decorations = editor.deltaDecorations([], [
      {
        range: new monaco.Range(line, column, line, column + 1),
        options: {
          isWholeLine: true,
          className: 'errorLine',
          glyphMarginClassName: 'errorGlyph',
          hoverMessage: { value: message },
          inlineClassName: 'errorText',
          minimap: {
            color: '#ff0000',
            position: 1
          },
          overviewRuler: {
            color: '#ff0000',
            position: monaco.editor.OverviewRulerLane.Right
          },
          glyphMarginHoverMessage: { value: message }
        }
      },
      {
        range: new monaco.Range(line, column, line, column + 1),
        options: {
          beforeContentClassName: 'errorSquiggles',
        }
      }
    ]);

    return decorations;
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

    // 添加错误监听
    let errorDecorations: string[] = [];
    editor.onDidChangeModelDecorations(() => {
      const model = editor.getModel();
      if (!model) return;

      const markers = monaco.editor.getModelMarkers({ resource: model.uri });
      const errors = markers.filter(marker => marker.severity === monaco.MarkerSeverity.Error);

      // 清除旧的错误装饰器
      errorDecorations = editor.deltaDecorations(errorDecorations, []);

      // 添加新的错误装饰器
      if (errors.length > 0) {
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
            },
            glyphMarginHoverMessage: { value: error.message }
          }
        }));

        errorDecorations = editor.deltaDecorations([], decorations);
        
        // 更新错误状态
        setError({
          message: errors[0].message,
          line: errors[0].startLineNumber,
          column: errors[0].startColumn
        });
      } else {
        setError(null);
      }
    });
  };

  // 格式化 JSON
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(value);
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
      }
      message.error('格式化失败：无效的 JSON 格式');
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
          .errorSquiggles {
            background: url("data:image/svg+xml,%3Csvg width='6' height='3' viewBox='0 0 6 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L2 2L4 0L6 2' stroke='%23ff0000' stroke-width='1'/%3E%3C/svg%3E") repeat-x bottom;
            padding-bottom: 3px;
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
          />
        )}
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={value}
            onChange={(value) => setValue(value || '')}
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