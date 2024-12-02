import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Button, Slider, Space, Tooltip } from 'antd';
import { 
  DeleteOutlined, 
  LockOutlined, 
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.module.scss';
import FrameExtractor from '@/components/FrameExtractor';

interface TimelineProps {
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  selectedClip: string | null;
  onClipSelect: (clipId: string | null) => void;
  currentFile?: File;
}

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio';
  locked: boolean;
  visible: boolean;
  clips: Clip[];
}

interface Clip {
  id: string;
  start: number;
  duration: number;
  source: string;
  type: 'video' | 'audio';
  thumbnail?: string;
  volume?: number;
  speed?: number;
}

const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  onTimeUpdate,
  selectedClip,
  onClipSelect,
  currentFile,
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [scale, setScale] = useState(1);
  const [duration, setDuration] = useState(300); // 5分钟
  const timelineRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ trackId: string; clipId: string; startX: number } | null>(null);
  const [frameImages, setFrameImages] = useState<Map<number, string>>(new Map());
  const visibleTimeRange = useMemo(() => {
    // 根据当前滚动位置和缩放计算可见时间范围
    const start = Math.max(0, currentTime - 10 * scale);
    const end = Math.min(duration, currentTime + 10 * scale);
    return [start, end] as [number, number];
  }, [currentTime, scale, duration]);

  // 处理时间轴点击
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;
    onTimeUpdate(Math.max(0, Math.min(time, duration)));
  };

  // 处理片段拖动开始
  const handleClipDragStart = (trackId: string, clipId: string, e: React.DragEvent) => {
    const track = tracks.find(t => t.id === trackId);
    if (track?.locked) return;

    dragRef.current = {
      trackId,
      clipId,
      startX: e.clientX,
    };
  };

  // 处理片段拖动
  const handleClipDrag = useCallback((e: React.DragEvent) => {
    if (!dragRef.current || !timelineRef.current) return;

    const { trackId, clipId, startX } = dragRef.current;
    const deltaX = e.clientX - startX;
    const timelineDelta = (deltaX / timelineRef.current.offsetWidth) * duration;

    setTracks(prev => prev.map(track => {
      if (track.id !== trackId) return track;
      return {
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id !== clipId) return clip;
          const newStart = Math.max(0, Math.min(duration - clip.duration, clip.start + timelineDelta));
          return { ...clip, start: newStart };
        }),
      };
    }));

    dragRef.current.startX = e.clientX;
  }, [duration]);

  // 处理轨道锁定/解锁
  const handleTrackLock = (trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, locked: !track.locked } : track
    ));
  };

  // 处理轨道显示/隐藏
  const handleTrackVisibility = (trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, visible: !track.visible } : track
    ));
  };

  // 添加新轨道
  const handleAddTrack = (type: 'video' | 'audio') => {
    const newTrack: Track = {
      id: `${type}-${tracks.length + 1}`,
      name: `${type === 'video' ? '视频轨' : '音频轨'} ${tracks.length + 1}`,
      type,
      locked: false,
      visible: true,
      clips: [],
    };
    setTracks([...tracks, newTrack]);
  };
  console.log(handleAddTrack);
  // 删除轨道
  const handleDeleteTrack = (trackId: string) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  // 计算总时长
  const calculateTotalDuration = useCallback(() => {
    if (tracks.length === 0) return 0;
    
    return Math.max(
      ...tracks.flatMap(track =>
        track.clips.map(clip => clip.start + clip.duration)
      ),
      30 // 最小显示30秒
    );
  }, [tracks]);

  // 当轨道或片段变化时更新总时长
  useEffect(() => {
    const newDuration = calculateTotalDuration();
    setDuration(newDuration);
  }, [tracks, calculateTotalDuration]);

  // 渲染时间刻度
  const renderTimeScale = () => {
    if (tracks.length === 0) return null;

    const scaleMarks = [];
    const mainStep = Math.max(30 / scale, 10); // 主刻度最小间隔10秒
    const subStep = mainStep / 2;  // 次刻度
    const microStep = subStep / 5; // 小刻度

    for (let i = 0; i <= duration; i += microStep) {
      const isMain = Math.abs(i % mainStep) < 0.001;
      const isSub = !isMain && Math.abs(i % subStep) < 0.001;
      
      if (isMain || isSub || i % microStep < 0.001) {
        scaleMarks.push(
          <div
            key={i}
            className={classNames(styles.scaleMark, {
              [styles.mainMark]: isMain,
              [styles.subMark]: isSub,
              [styles.microMark]: !isMain && !isSub,
            })}
            style={{ left: `${(i / duration) * 100}%` }}
          >
            {isMain && (
              <div className={styles.scaleLabel}>
                {formatTime(i)}
              </div>
            )}
          </div>
        );
      }
    }

    return (
      <div className={styles.timeScale}>
        <div className={styles.scaleContainer}>{scaleMarks}</div>
      </div>
    );
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleFrameExtracted = useCallback((time: number, imageData: string) => {
    setFrameImages(prev => new Map(prev).set(time, imageData));
  }, []);

  // 处理视频拖拽
  const handleDrop = useCallback(async (e: React.DragEvent, trackId?: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'video' || data.type === 'audio') {
        const file = window.__materialFiles?.get(data.id);
        if (!file) {
          console.error('File not found');
          return;
        }

        const rect = timelineRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const dropX = e.clientX - rect.left;
        const startTime = Math.max(0, (dropX / rect.width) * duration);

        // 创建视频元素获取帧
        const video = document.createElement('video');
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;
        
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            video.currentTime = 0;
            resolve();
          };
        });

        // 提取缩略图
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');
        
        await new Promise<void>((resolve) => {
          video.onseeked = () => {
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            resolve();
          };
        });

        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);

        const clip: Clip = {
          id: `clip-${Date.now()}`,
          start: startTime,
          duration: data.duration,
          source: objectUrl,
          type: data.type,
          thumbnail: data.type === 'video' ? thumbnail : undefined
        };

        // 如果没有指定轨道ID，创建新轨道
        if (!trackId) {
          const newTrack: Track = {
            id: `${data.type}-${tracks.length + 1}`,
            name: `${data.type === 'video' ? '视频轨' : '音频轨'} ${
              tracks.filter(t => t.type === data.type).length + 1
            }`,
            type: data.type,
            locked: false,
            visible: true,
            clips: [clip]
          };
          setTracks(prev => [...prev, newTrack]);
        } else {
          // 添加到现有轨道
          setTracks(prev => prev.map(track => {
            if (track.id === trackId) {
              return {
                ...track,
                clips: [...track.clips, clip]
              };
            }
            return track;
          }));
        }

        // 提取帧预览（仅对视频）
        if (data.type === 'video') {
          const previewCanvas = document.createElement('canvas');
          previewCanvas.width = 32;
          previewCanvas.height = 18;
          const previewCtx = previewCanvas.getContext('2d');

          for (let time = 0; time < data.duration; time += 0.5) {
            video.currentTime = time;
            await new Promise<void>((resolve) => {
              video.onseeked = () => {
                if (previewCtx) {
                  previewCtx.drawImage(video, 0, 0, previewCanvas.width, previewCanvas.height);
                  const frameImage = previewCanvas.toDataURL('image/jpeg', 0.5);
                  setFrameImages(prev => new Map(prev).set(startTime + time, frameImage));
                }
                resolve();
              };
            });
          }
        }

        // 清理资源
        URL.revokeObjectURL(objectUrl);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  }, [duration, tracks]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 渲染视频片段
  const renderClip = (clip: Clip) => {
    if (clip.type === 'video') {
      return (
        <>
          <div 
            className={styles.clipThumbnail} 
            style={{ backgroundImage: `url(${clip.thumbnail})` }}
          />
          <div className={styles.clipFrames}>
            {renderFramePreviews(clip)}
          </div>
          <div className={styles.clipDuration}>
            {formatTime(clip.duration)}
          </div>
        </>
      );
    }
    return null;
  };

  const renderFramePreviews = (clip: Clip) => {
    const frames = [];
    const frameInterval = 0.5;
    
    for (let time = clip.start; time < clip.start + clip.duration; time += frameInterval) {
      const frameImage = frameImages.get(time);
      if (frameImage) {
        frames.push(
          <div
            key={time}
            className={styles.framePreview}
            style={{
              left: `${((time - clip.start) / clip.duration) * 100}%`,
              backgroundImage: `url(${frameImage})`
            }}
          />
        );
      }
    }

    return frames;
  };

  // 在组件卸载时清理所有资源
  useEffect(() => {
    return () => {
      tracks.forEach(track => {
        track.clips.forEach(clip => {
          if (clip.source) {
            URL.revokeObjectURL(clip.source);
          }
        });
      });
    };
  }, [tracks]);

  return (
    <div className={styles.timelineContainer}>
      {currentFile && (
        <FrameExtractor
          videoFile={currentFile}
          onFrameExtracted={handleFrameExtracted}
          interval={1 / scale}
          visibleRange={visibleTimeRange}
        />
      )}
      {/* 工具栏 */}
      <div className={styles.toolbar}>
        <Space>
          <Button.Group>
            <Button 
              icon={<ZoomOutOutlined />} 
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            />
            <Button 
              icon={<ZoomInOutlined />} 
              onClick={() => setScale(Math.min(2, scale + 0.1))}
            />
          </Button.Group>
          <span className="text-xs text-gray-500">{Math.round(scale * 100)}%</span>
        </Space>
      </div>

      <div className={styles.timelineContent}>
        {/* 轨道标题区域 */}
        <div className={styles.trackHeaders}>
          {tracks.map(track => (
            <div key={track.id} className={styles.trackHeader}>
              <div className={styles.trackTitle}>{track.name}</div>
              <Space>
                <Tooltip title={track.locked ? '解锁' : '锁定'}>
                  <Button
                    type="text"
                    size="small"
                    icon={track.locked ? <LockOutlined /> : <UnlockOutlined />}
                    onClick={() => handleTrackLock(track.id)}
                  />
                </Tooltip>
                <Tooltip title={track.visible ? '隐藏' : '显示'}>
                  <Button
                    type="text"
                    size="small"
                    icon={track.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => handleTrackVisibility(track.id)}
                  />
                </Tooltip>
                <Tooltip title="删除轨道">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTrack(track.id)}
                  />
                </Tooltip>
              </Space>
            </div>
          ))}
        </div>

        {/* 时间轴区域 */}
        <div 
          className={styles.timelineArea} 
          ref={timelineRef} 
          onClick={handleTimelineClick}
          onDrop={e => handleDrop(e)}
          onDragOver={handleDragOver}
        >
          {/* 时间刻度 */}
          {tracks.length > 0 && (
            <>
              {renderTimeScale()}
              {/* 当前时间指示器 */}
              <div 
                className={styles.currentTimeLine}
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </>
          )}

          {/* 轨道内容区域 */}
          <div className={styles.tracksContent}>
            {tracks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.dropHint}>
                  拖入素材以创建轨道
                </div>
              </div>
            ) : (
              tracks.map(track => (
                <div 
                  key={track.id} 
                  className={classNames(styles.trackContent, {
                    [styles.locked]: track.locked,
                    [styles.hidden]: !track.visible,
                  })}
                  onDrop={(e) => handleDrop(e, track.id)}
                  onDragOver={handleDragOver}
                >
                  {track.clips.map(clip => (
                    <div
                      key={clip.id}
                      className={classNames(styles.clip, {
                        [styles.selected]: selectedClip === clip.id,
                      })}
                      style={{
                        left: `${(clip.start / duration) * 100}%`,
                        width: `${(clip.duration / duration) * 100}%`,
                      }}
                      draggable={!track.locked}
                      onDragStart={e => handleClipDragStart(track.id, clip.id, e)}
                      onDrag={handleClipDrag}
                      onClick={() => onClipSelect(clip.id)}
                    >
                      {renderClip(clip)}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 时间滑块 */}
      {tracks.length > 0 && (
        <div className={styles.timelineSlider}>
          <Slider
            value={currentTime}
            min={0}
            max={duration}
            step={0.1}
            onChange={onTimeUpdate}
            tooltip={{ formatter: value => formatTime(value!) }}
          />
        </div>
      )}
    </div>
  );
};

export default Timeline; 