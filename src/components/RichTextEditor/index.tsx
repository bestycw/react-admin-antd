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

  // 丰富工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['divider', 'fullScreen']
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    readOnly,
    maxLength,
    autoFocus: false,
    scroll: true,
    MENU_CONF: {
      // 字体配置
      fontSize: {
        options: [
          '12px', '13px', '14px', '15px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'
        ]
      },
      fontFamily: {
        options: [
          '默认字体',
          'Arial',
          'Tahoma',
          'Verdana',
          'Times New Roman',
          'Georgia',
          '微软雅黑',
          '宋体',
          '黑体',
          '楷体',
          '仿宋'
        ]
      },
      lineHeight: {
        options: ['1', '1.5', '1.75', '2', '2.5', '3']
      },
      // 上传图片配置
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
      },
      // 代码块配置
      codeBlock: {
        languages: [
          { text: 'Plain Text', value: 'text' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'TypeScript', value: 'typescript' },
          { text: 'HTML', value: 'html' },
          { text: 'CSS', value: 'css' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'SQL', value: 'sql' }
        ]
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
    <div className={`border border-gray-200 rounded-md bg-white ${className}`}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode={mode}
        className="rich-editor-toolbar  border-b border-gray-200 bg-white top-0 z-10 p-2;
"
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
   
        .rich-editor-toolbar {
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
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
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
          @apply p-2 grid grid-cols-8 gap-1;
        }
        .w-e-panel-content-color button {
          @apply w-6 h-6 rounded-sm border border-gray-200;
        }
        .w-e-modal {
          @apply rounded-lg shadow-lg border border-gray-200;
        }
        .w-e-modal-header {
          @apply bg-gray-50 p-4 rounded-t-lg font-medium;
        }
        .w-e-modal-body {
          @apply p-4;
        }
        .w-e-modal-footer {
          @apply bg-gray-50 p-4 rounded-b-lg flex justify-end gap-2;
        }
        .w-e-button-container button {
          @apply px-4 py-2 rounded;
        }
        .w-e-button-container button.primary {
          @apply bg-blue-500 text-white hover:bg-blue-600;
        }
        .w-e-dropdown-content {
          @apply bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[120px];
        }
        .w-e-dropdown-item {
          @apply px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm;
        }
        .w-e-select-list {
          @apply max-h-[300px] overflow-y-auto;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor 