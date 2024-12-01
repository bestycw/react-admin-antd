import React, { useState, useEffect } from 'react';
import { Upload, List, message, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

interface MaterialPanelProps {
  onSelect: (file: File) => void;
  onPreview: (file: File) => void;
}

interface MaterialItem {
  file: File;
  thumbnail: string;
  duration: number;
}

const MaterialPanel: React.FC<MaterialPanelProps> = ({ onSelect, onPreview }) => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  const handleBeforeUpload = async (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('video/')) {
      message.error('只能上传视频文件！');
      return false;
    }
    // 检查文件大小（例如限制为500MB）
    if (file.size > 500 * 1024 * 1024) {
      message.error('文件大小不能超过500MB！');
      return false;
    }

    try {
      // 创建视频元素获取时长和第一帧
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.currentTime = 0; // 跳到第一帧
        };
        
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 160;
          canvas.height = 90;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg');
            
            setMaterials(prev => [...prev, {
              file,
              thumbnail,
              duration: video.duration
            }]);
            
            URL.revokeObjectURL(video.src);
            resolve();
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        
        video.onerror = reject;
      });
      
    } catch (error) {
      message.error('处理视频失败');
      console.error(error);
    }

    return false; // 阻止默认上传
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e: React.DragEvent, material: MaterialItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'video',
      fileName: material.file.name,
      duration: material.duration,
      thumbnail: material.thumbnail,
      id: material.file.name + '-' + material.file.size
    }));
    
    window.__materialFiles = window.__materialFiles || new Map();
    window.__materialFiles.set(
      material.file.name + '-' + material.file.size,
      material.file
    );
    
    const img = new Image();
    img.src = material.thumbnail;
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  useEffect(() => {
    return () => {
      window.__materialFiles?.clear();
      delete window.__materialFiles;
    };
  }, []);

  return (
    <div className={styles.materialPanel}>
      <div className={styles.header}>
        <span className={styles.title}>素材库</span>
        <Upload
          accept="video/*"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
        >
          <div className={styles.uploadButton}>
            <PlusOutlined />
          </div>
        </Upload>
      </div>
      <div className={styles.content}>
        <List
          grid={{ column: 2, gutter: 8 }}
          dataSource={materials}
          renderItem={material => (
            <List.Item 
              className={styles.materialItem}
              draggable
              onDragStart={(e) => handleDragStart(e, material)}
            >
              <div 
                className={styles.thumbnail}
                onClick={() => onPreview(material.file)}
              >
                <img src={material.thumbnail} alt="" />
                <div className={styles.duration}>
                  {formatDuration(material.duration)}
                </div>
              </div>
              <Tooltip title={material.file.name}>
                <div className={styles.fileName}>
                  {material.file.name}
                </div>
              </Tooltip>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default MaterialPanel; 