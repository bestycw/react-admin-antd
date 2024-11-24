/**
 * CodeEditor 代码编辑器组件
 * 基于 Monaco Editor (VS Code的编辑器)
 * 
 * 功能特性:
 * 1. 代码编辑
 *    - 语法高亮
 *    - 自动补全
 *    - 错误提示
 *    - 代码折叠
 * 
 * 2. 编辑功能
 *    - 撤销/重做
 *    - 查找/替换
 *    - 多光标编辑
 *    - 代码格式化
 * 
 * 3. 视图功能
 *    - 缩放
 *    - 自定义主题
 *    - 行号显示
 *    - 小地图
 */

import React, { useRef, useCallback } from 'react'
import Editor, { OnMount, OnChange } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Spin } from 'antd'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  theme?: 'vs-dark' | 'light'
  height?: number | string
  width?: number | string
  options?: editor.IStandaloneEditorConstructionOptions
  readOnly?: boolean
  onSave?: (value: string) => void
  className?: string
}

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto'
  },
  automaticLayout: true,
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  renderLineHighlight: 'all',
  renderWhitespace: 'selection',
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  mouseWheelZoom: true,
  bracketPairColorization: {
    enabled: true
  },
  padding: {
    top: 16,
    bottom: 16
  },
  folding: true,
  foldingStrategy: 'indentation',
  showFoldingControls: 'always'
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
  height = 500,
  width = '100%',
  options = {},
  readOnly = false,
  onSave,
  className = ''
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // 编辑器加载完成的回调
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor

    // 添加快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave(editor.getValue())
      }
    })

    // 添加右键菜单
    editor.addAction({
      id: 'format-code',
      label: '格式化代码',
      keybindings: [
        monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF
      ],
      run: (ed:any) => {
        ed.getAction('editor.action.formatDocument')?.run()
      }
    })
  }, [onSave])

  // 内容变化的回调
  const handleEditorChange: OnChange = useCallback((value) => {
    if (onChange) {
      onChange(value || '')
    }
  }, [onChange])

  return (
    <div className={`code-editor-container border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <Editor
        value={value}
        defaultLanguage={language}
        language={language}
        theme={theme}
        height={height}
        width={width}
        options={{
          ...defaultOptions,
          ...options,
          readOnly
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <Spin tip="编辑器加载中..." />
          </div>
        }
      />
    </div>
  )
}

export default CodeEditor 