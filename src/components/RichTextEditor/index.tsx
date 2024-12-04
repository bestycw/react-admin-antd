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
    <div className={`rich-editor-container border border-gray-200 rounded-md bg-white ${className}`}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode={mode}
        className="rich-editor-toolbar border-b border-gray-200 bg-white  z-10 p-2"
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        mode={mode}
        className="rich-editor-content p-4"
        style={{ height: `${height}px`, overflowY: 'hidden' }}
      />

      <style>{`
        .rich-editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .rich-editor-toolbar .w-e-bar-item button {
          min-width: 32px;
          height: 32px;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rich-editor-toolbar .w-e-bar-item button:hover {
          background-color: #f3f4f6;
        }
        .rich-editor-toolbar .w-e-bar-item button.active {
          background-color: #ebf5ff;
          color: #2563eb;
        }
        .w-e-text-container {
          background-color: white;
        }
        .w-e-text-container [data-slate-editor] {
          min-height: 200px;
        }
        .w-e-panel-content-color {
          padding: 8px;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
        }
        .w-e-panel-content-color button {
          width: 24px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #e5e7eb;
        }
        .w-e-modal {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        .w-e-modal-header {
          background-color: #f9fafb;
          padding: 16px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          font-weight: 500;
        }
        .w-e-modal-body {
          padding: 16px;
        }
        .w-e-modal-footer {
          background-color: #f9fafb;
          padding: 16px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .w-e-button-container button {
          padding: 8px 16px;
          border-radius: 4px;
        }
        .w-e-button-container button.primary {
          background-color: #3b82f6;
          color: white;
        }
        .w-e-button-container button.primary:hover {
          background-color: #2563eb;
        }
        .w-e-dropdown-content {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 4px 0;
          min-width: 120px;
        }
        .w-e-dropdown-item {
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
        }
        .w-e-dropdown-item:hover {
          background-color: #f3f4f6;
        }
        .w-e-select-list {
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor 