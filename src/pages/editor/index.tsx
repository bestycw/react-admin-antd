import React, { useState } from 'react'
import { Card } from 'antd'
import RichTextEditor from '@/components/RichTextEditor'
import { FileTextOutlined } from '@ant-design/icons'

const EditorPage: React.FC = () => {
  const [content, setContent] = useState('<p>初始内容...</p>')

  const handleImageUpload = async (file: File): Promise<string> => {
    // 这里实现图片上传逻辑
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
    })
  }

  return (
    <div className="p-6">
      <Card title="富文本编辑器" className="shadow-md">
        <RichTextEditor
          value={content}
          mode={'default'}
          onChange={setContent}
          height={500}
          onImageUpload={handleImageUpload}
          maxLength={50000}
          placeholder="开始编辑..."
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
  )
}

export default EditorPage

export const routeConfig = {
  title: '富文本编辑器',
  icon: <FileTextOutlined />,
  layout: true,
  auth: true,
} 