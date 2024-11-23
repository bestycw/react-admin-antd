import React, { useEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillModules {
  toolbar: {
    container: any[];
    handlers?: Record<string, (() => void) | undefined>;
  };
  clipboard: {
    matchVisual: boolean;
  };
}

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  height?: number | string;
  theme?: 'snow' | 'bubble';
  customModules?: Partial<QuillModules>;
  customFormats?: string[];
  onImageUpload?: (file: File) => Promise<string>;
  onReady?: (quill: Quill) => void;
}

const defaultModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  },
  clipboard: {
    matchVisual: false
  }
};

const defaultFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'align',
  'list', 'bullet', 'indent',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  readOnly = false,
  className = '',
  height = 400,
  theme = 'snow',
  customModules,
  customFormats,
  onImageUpload,
  onReady
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  // 自定义图片处理器
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && onImageUpload && quillRef.current) {
        try {
          const url = await onImageUpload(file);
          const range = quillRef.current.getSelection(true);
          quillRef.current.insertEmbed(range.index, 'image', url);
          quillRef.current.setSelection(range.index + 1);
        } catch (err) {
          console.error('图片上传失败:', err);
        }
      }
    };
  }, [onImageUpload]);

  // 初始化编辑器
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const modules = {
      ...defaultModules,
      ...customModules,
      toolbar: {
        ...(customModules?.toolbar || defaultModules.toolbar),
        handlers: {
          image: onImageUpload ? imageHandler : undefined
        }
      }
    };

    const formats = customFormats || defaultFormats;

    const quill = new Quill(editorRef.current, {
      theme,
      modules,
      formats,
      placeholder,
      readOnly,
    });

    // 设置初始内容
    quill.root.innerHTML = value;

    // 监听内容变化
    quill.on('text-change', () => {
      const content = quill.root.innerHTML;
      if (content !== value) {
        onChange(content);
      }
    });

    quillRef.current = quill;

    // 调用 onReady 回调
    if (onReady) {
      onReady(quill);
    }

    // 清理函数
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
      }
    };
  }, []); // 仅在组件挂载时初始化一次

  // 更新内容
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value;
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  // 更新只读状态
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div className={`rich-editor-container ${className}`}>
      <div ref={editorRef} style={{ height }} />
      <style>{`
        .rich-editor-container {
          @apply w-full;
        }
        .ql-container {
          @apply text-base border border-gray-200 rounded-b font-sans;
        }
        .ql-toolbar {
          @apply bg-gray-50 border border-gray-200 rounded-t;
        }
        .ql-editor {
          @apply prose max-w-none;
          min-height: ${typeof height === 'number' ? `${height}px` : height};
        }
        .ql-editor.ql-blank::before {
          @apply text-gray-400 font-normal not-italic;
        }
        .ql-snow .ql-tooltip {
          @apply bg-white shadow-lg border border-gray-200 rounded;
        }
        .ql-snow .ql-picker {
          @apply text-gray-700;
        }
        .ql-snow .ql-stroke {
          @apply stroke-gray-700;
        }
        .ql-snow .ql-fill {
          @apply fill-gray-700;
        }
        .ql-snow.ql-toolbar button:hover,
        .ql-snow .ql-toolbar button:hover {
          @apply bg-gray-100;
        }
        .ql-snow.ql-toolbar button.ql-active,
        .ql-snow .ql-toolbar button.ql-active {
          @apply bg-blue-50;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 