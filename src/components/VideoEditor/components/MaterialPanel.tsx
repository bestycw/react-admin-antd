import React, { useState } from 'react';
import { Upload, Tabs, List, Button, message, Tooltip } from 'antd';
import { 
  InboxOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  // FileImageOutlined
} from '@ant-design/icons';
// import type { UploadFile } from 'antd/es/upload/interface';
import { MediaFile } from '../types';

interface MaterialPanelProps {
  onMediaSelect: (file: File, type: 'video' | 'audio') => void;
}

interface MaterialItem {
  uid: string;
  name: string;
  status: 'done' | 'uploading' | 'error';
  type: 'video' | 'audio';
  size: number;
  duration?: number;
  thumbnail?: string;
  originFileObj?: MediaFile;
}

const MaterialPanel: React.FC<MaterialPanelProps> = ({ onMediaSelect }) => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('video');
  const [uploading, setUploading] = useState(false);

  // 处理文件上传前的验证
  const beforeUpload = async (file: File, type: 'video' | 'audio' | 'image') => {
    const isValidType = {
      video: file.type.startsWith('video/'),
      audio: file.type.startsWith('audio/'),
      image: file.type.startsWith('image/')
    }[type];

    if (!isValidType) {
      message.error(`请上传正确的${type === 'video' ? '视频' : type === 'audio' ? '音频' : '图片'}文件！`);
      return false;
    }

    const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
    if (!isLt2G) {
      message.error('文件大小不能超过 2GB！');
      return false;
    }

    try {
      // 生成缩略图和获取时长
      let thumbnail = '';
      let duration = 0;

      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            duration = video.duration;
            // 创建缩略图
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            thumbnail = canvas.toDataURL('image/jpeg');
            URL.revokeObjectURL(video.src);
            resolve(null);
          };
        });
      } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => {
            duration = audio.duration;
            URL.revokeObjectURL(audio.src);
            resolve(null);
          };
        });
      }

      // 添加到素材列表
      const newMaterial: MaterialItem = {
        uid: `-${Date.now()}`,
        name: file.name,
        status: 'done',
        type,
        size: file.size,
        duration,
        thumbnail,
        originFileObj: Object.assign(file, { uid: `-${Date.now()}` })
      };

      setMaterials(prev => [...prev, newMaterial]);
      
      if (type !== 'image') {
        onMediaSelect(file, type);
      }

      return false; // 阻止默认上传行为
    } catch (error) {
      message.error('文件处理失败，请重试！');
      return false;
    }
  };

  // 删除素材
  const handleDelete = (uid: string) => {
    setMaterials(prev => prev.filter(item => item.uid !== uid));
  };

  // 选择素材
  const handleSelect = (material: MaterialItem) => {
    if (material.originFileObj && (material.type === 'video' || material.type === 'audio')) {
      onMediaSelect(material.originFileObj, material.type);
    }
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < sizes.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="material-panel">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="material-tabs"
      >
        <Tabs.TabPane 
          tab={<span><VideoCameraOutlined />视频</span>} 
          key="video"
        >
          <Upload.Dragger
            accept="video/*"
            showUploadList={false}
            beforeUpload={file => beforeUpload(file, 'video')}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传视频</p>
            <p className="ant-upload-hint">支持 MP4, MOV, AVI 等格式</p>
          </Upload.Dragger>
        </Tabs.TabPane>

        <Tabs.TabPane 
          tab={<span><AudioOutlined />音频</span>} 
          key="audio"
        >
          <Upload.Dragger
            accept="audio/*"
            showUploadList={false}
            beforeUpload={file => beforeUpload(file, 'audio')}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传音频</p>
            <p className="ant-upload-hint">支持 MP3, WAV, AAC 等格式</p>
          </Upload.Dragger>
        </Tabs.TabPane>
      </Tabs>

      <div className="materials-list">
        <List
          itemLayout="horizontal"
          dataSource={materials.filter(item => item.type === activeTab)}
          renderItem={item => (
            <List.Item
              className="material-item"
              actions={[
                <Tooltip title="使用素材">
                  <Button
                    type="text"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleSelect(item)}
                  />
                </Tooltip>,
                <Tooltip title="删除素材">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.uid)}
                  />
                </Tooltip>
              ]}
            >
              <List.Item.Meta
                avatar={
                  item.type === 'video' && item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} className="material-thumbnail" />
                  ) : (
                    <div className="material-icon">
                      {item.type === 'video' ? <VideoCameraOutlined /> : <AudioOutlined />}
                    </div>
                  )
                }
                title={item.name}
                description={
                  <div className="material-info">
                    <span>{formatSize(item.size)}</span>
                    {item.duration && (
                      <span className="material-duration">
                        {formatDuration(item.duration)}
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default MaterialPanel; 