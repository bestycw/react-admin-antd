import React, { useState, useRef } from 'react';
import { Layout } from 'antd';
import MaterialPanel from './components/MaterialPanel';
import PreviewPanel from './components/PreviewPanel';
import PropertyPanel from './components/PropertyPanel';
import Timeline from './components/Timeline';
import styles from './index.module.scss';

// const { Content } = Layout;

const VideoEditor: React.FC = () => {
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  console.log(currentFile)
  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
    if (videoRef.current) {
      const objectUrl = URL.createObjectURL(file);
      videoRef.current.src = objectUrl;
      
      // 清理旧的 URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  const handlePreview = (file: File) => {
    setPreviewFile(file);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
      videoRef.current.play();
    }
  };

  return (
    <div className={styles.editorContainer}>
      {/* 上部分布局 */}
      <div className={styles.mainContent}>
        {/* 左侧素材面板 */}
        <div className={styles.sidePanel}>
          <MaterialPanel 
            onSelect={handleFileSelect} 
            onPreview={handlePreview}
          />
        </div>

        {/* 中间预览区域 */}
        <div className={styles.previewPanel}>
          <PreviewPanel 
            videoRef={videoRef}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            file={previewFile}
          />
        </div>

        {/* 右侧属性面板 */}
        <div className={styles.sidePanel}>
          <PropertyPanel selectedClip={selectedClip} />
        </div>
      </div>

      {/* 下部分时间轴 */}
      <div className={styles.timelinePanel}>
        <Timeline 
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          selectedClip={selectedClip}
          onClipSelect={setSelectedClip}
        />
      </div>
    </div>
  );
};

export default VideoEditor;

export const routeConfig = {
  title: '视频编辑器',
  sort: 1,
  hidden: true
}; 