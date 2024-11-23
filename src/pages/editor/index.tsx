import React, { useState, useCallback } from 'react';
import { Card } from 'antd';
import RichTextEditor from '@/components/RichTextEditor';
import { FileTextOutlined } from '@ant-design/icons';
import type Quill from 'quill';

const EditorPage: React.FC = () => {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File): Promise<string> => {
    // 实现图片上传逻辑
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    });
  };

  const handleEditorReady = useCallback((quill: Quill) => {
    console.log('Editor is ready:', quill);
    // 可以在这里进行额外的编辑器配置
  }, []);

  // 自定义模块示例
  const customModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    }
  };

  return (
    <div className="p-6">
      <Card title="富文本编辑器" className="shadow-md">
        <RichTextEditor
          value={content}
          onChange={setContent}
          height={400}
          onImageUpload={handleImageUpload}
          onReady={handleEditorReady}
          customModules={customModules}
          className="mb-6"
        />
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">预览内容：</h3>
          <div 
            className="prose max-w-none p-4 border border-gray-200 rounded-md bg-gray-50"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Card>
    </div>
  );
};

export default EditorPage;

export const routeConfig = {
  title: '富文本编辑器',
  icon: <FileTextOutlined />,
  layout: true,
  auth: true,
}; 