/**
 * RichTextEditor 富文本编辑器组件
 * 基于 wangEditor 封装
 * 
 * 功能特性:
 * 1. 文本编辑
 *    - 字体大小、颜色
 *    - 对齐方式
 *    - 列表
 *    - 标题
 * 
 * 2. 媒体插入
 *    - 图片上传
 *    - 视频插入
 *    - 表格编辑
 * 
 * 3. 扩展功能
 *    - HTML 源码编辑
 *    - 全屏编辑
 *    - 字数统计
 */

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  height?: number
  mode?: 'default' | 'simple'
  placeholder?: string
  readOnly?: boolean
  onImageUpload?: (file: File) => Promise<string>
  maxLength?: number
  className?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = 500,
  mode = 'default',
  placeholder = '请输入内容...',
  readOnly = false,
  onImageUpload,
  maxLength,
  className = ''
}) => {
  // 编辑器实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // 修改工具栏配置，平铺所有按钮
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [],
    toolbarKeys: [
      // 标题
      'headerSelect',
      '|',
      // 字体
      'fontSize',
      'fontFamily',
      'lineHeight',
      '|',
      // 文字样式
      'bold',
      'italic',
      'underline',
      'through',
      'color',
      'bgColor',
      '|',
      // 对齐方式
      'alignment',
      '|',
      // 列表
      'bulletedList',
      'numberedList',
      'indent',
      '|',
      // 其他格式
      'blockquote',
      'code',
      'clearStyle',
      '|',
      // 插入功能
      'insertTable',
      'insertImage',
      'insertVideo',
      'insertLink',
      'divider',
      '|',
      // 视图
      'fullScreen',
      'sourceCode',
    ]
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    readOnly,
    maxLength,
    MENU_CONF: {
      uploadImage: {
        customUpload: async (file: File, insertFn: (url: string) => void) => {
          if (onImageUpload) {
            try {
              const url = await onImageUpload(file)
              insertFn(url)
            } catch (error) {
              console.error('图片上传失败:', error)
            }
          }
        }
      }
    },
    onChange: (editor: IDomEditor) => {
      onChange(editor.getHtml())
    }
  }

  // 组件销毁时销毁编辑器实例
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy()
        setEditor(null)
      }
    }
  }, [editor])

  return (
    <div className={`rich-editor-container ${className}`}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode={mode}
        className="rich-editor-toolbar"
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        mode={mode}
        className="rich-editor-content"
        style={{ height: `${height}px`, overflowY: 'hidden' }}
      />
      <style>{`
        .rich-editor-container {
          @apply border border-gray-200 rounded-md bg-white;
        }
        .rich-editor-toolbar {
          @apply border-b border-gray-200 bg-white sticky top-0 z-10 p-2;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .rich-editor-toolbar .w-e-bar-divider {
          @apply border-l border-gray-200 mx-1 h-6;
        }
        .rich-editor-toolbar .w-e-bar-item {
          @apply flex items-center;
        }
        .rich-editor-toolbar button {
          @apply px-2 py-1 rounded hover:bg-gray-100 text-gray-700;
        }
        .rich-editor-toolbar button.active {
          @apply bg-blue-50 text-blue-600;
        }
        .rich-editor-content {
          @apply p-4;
        }
        .w-e-text-container {
          @apply bg-white;
        }
        .w-e-text-container [data-slate-editor] {
          @apply min-h-[200px];
        }
        .w-e-panel-content-color {
          @apply p-2;
        }
        .w-e-panel-content-color button {
          @apply w-6 h-6 rounded-sm m-1;
        }
        .w-e-modal {
          @apply rounded-lg shadow-lg;
        }
        .w-e-modal-header {
          @apply bg-gray-50 p-4 rounded-t-lg;
        }
        .w-e-modal-body {
          @apply p-4;
        }
        .w-e-modal-footer {
          @apply bg-gray-50 p-4 rounded-b-lg;
        }
        // 下拉菜单样式
        .w-e-dropdown-content {
          @apply bg-white border border-gray-200 rounded-md shadow-lg py-1;
        }
        .w-e-dropdown-item {
          @apply px-4 py-2 hover:bg-gray-100 cursor-pointer;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor 