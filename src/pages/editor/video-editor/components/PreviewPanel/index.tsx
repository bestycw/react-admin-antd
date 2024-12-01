import React, { useRef, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import styles from './index.module.scss';

interface PreviewPanelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  file: File | null;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  videoRef,
  currentTime,
  onTimeUpdate,
  file
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  return (
    <div className={styles.previewPanel}>
      <div className={styles.header}>
        <span className={styles.title}>预览</span>
        {file && <span className={styles.fileName}>{file.name}</span>}
      </div>
      <div className={styles.content}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
          />
          {!file && (
            <div className={styles.placeholder}>
              请选择或拖入视频
            </div>
          )}
        </div>
        {file && (
          <div className={styles.controls}>
            <Space>
              <Button
                type="text"
                icon={<StepBackwardOutlined />}
                onClick={() => onTimeUpdate(Math.max(0, currentTime - 1))}
              />
              <Button
                type="text"
                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={handlePlayPause}
              />
              <Button
                type="text"
                icon={<StepForwardOutlined />}
                onClick={() => onTimeUpdate(currentTime + 1)}
              />
              <span className={styles.timeDisplay}>
                {formatTime(currentTime)}
              </span>
            </Space>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel; 