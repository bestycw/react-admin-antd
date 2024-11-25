import React, { useState } from 'react';
import { Card } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import VideoEditor from '@/components/VideoEditor';

const VideoEditorPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSave = async (blob: Blob) => {
    // 这里可以处理视频保存逻辑
    // 例如上传到服务器或下载到本地
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited_${videoFile?.name || 'video'}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Card 
        title="视频编辑器" 
        className="shadow-md"
        extra={
          <span className="text-gray-500 text-sm">
            支持视频剪辑、分割、合并等功能
          </span>
        }
      >
        <VideoEditor
          onSave={handleSave}
        />
      </Card>
    </div>
  );
};

export default VideoEditorPage;

export const routeConfig = {
  title: '视频编辑器',
  icon: <VideoCameraOutlined />,
  layout: true,
  auth: true,
  sort: 200  // 设置排序权重
}; 