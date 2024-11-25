import React, { useState, useRef, useEffect } from 'react';
import { Button, Slider, Space, Tooltip } from 'antd';
import {
  ScissorOutlined,
  DeleteOutlined,
  MergeCellsOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { Track, Clip, Keyframe } from '../types';

interface TimelineProps {
  media: {
    type: 'video' | 'audio';
    url: string;
  } | null;
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
  onClipChange: (trackId: string, clip: Clip) => void;
  onTrackChange: (tracks: Track[]) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  media,
  currentTime,
  duration,
  onTimeChange,
  onClipChange,
  onTrackChange
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedClip, setSelectedClip] = useState<{ trackId: string; clipId: string } | null>(null);
  const [scale, setScale] = useState(1); // 时间轴缩放比例
  const timelineRef = useRef<HTMLDivElement>(null);

  // 添加新轨道
  const addTrack = (type: 'video' | 'audio') => {
    setTracks(prev => [...prev, {
      id: `track-${Date.now()}`,
      type,
      clips: [],
      volume: 100,
      muted: false,
      order: prev.length
    }]);
  };

  // 添加片段
  const addClip = (trackId: string, startTime: number) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const newClip: Clip = {
          id: `clip-${Date.now()}`,
          startTime,
          endTime: startTime + 5,
          volume: 100,
          speed: 1,
          order: track.clips.length
        };
        return {
          ...track,
          clips: [...track.clips, newClip]
        };
      }
      return track;
    }));
  };

  // 分割片段
  const splitClip = (trackId: string, clipId: string, splitTime: number) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const clipIndex = track.clips.findIndex(c => c.id === clipId);
        if (clipIndex === -1) return track;

        const clip = track.clips[clipIndex];
        if (splitTime <= clip.startTime || splitTime >= clip.endTime) return track;

        const newClips = [...track.clips];
        newClips.splice(clipIndex, 1, 
          {
            ...clip,
            endTime: splitTime
          },
          {
            ...clip,
            id: `clip-${Date.now()}`,
            startTime: splitTime,
          }
        );

        return { ...track, clips: newClips };
      }
      return track;
    }));
  };

  // 合并片段
  const mergeClips = (trackId: string, clipIds: string[]) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const clipsToMerge = track.clips
          .filter(c => clipIds.includes(c.id))
          .sort((a, b) => a.startTime - b.startTime);

        if (clipsToMerge.length < 2) return track;

        const mergedClip: Clip = {
          id: `clip-${Date.now()}`,
          startTime: clipsToMerge[0].startTime,
          endTime: clipsToMerge[clipsToMerge.length - 1].endTime,
          volume: clipsToMerge[0].volume,
          speed: clipsToMerge[0].speed,
          order: Math.min(...clipsToMerge.map(c => c.order))
        };

        return {
          ...track,
          clips: [
            ...track.clips.filter(c => !clipIds.includes(c.id)),
            mergedClip
          ]
        };
      }
      return track;
    }));
  };

  // 删除片段
  const deleteClip = (trackId: string, clipId: string) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: track.clips.filter(c => c.id !== clipId)
        };
      }
      return track;
    }));
  };

  // 调整片段时间
  const adjustClipTime = (
    trackId: string,
    clipId: string,
    newStartTime: number,
    newEndTime: number
  ) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: track.clips.map(clip => {
            if (clip.id === clipId) {
              return {
                ...clip,
                startTime: Math.max(0, newStartTime),
                endTime: Math.min(duration, newEndTime)
              };
            }
            return clip;
          })
        };
      }
      return track;
    }));
  };

  // 处理轨道拖拽
  const handleTrackDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // 更新顺序
    const reorderedTracks = items.map((track, index) => ({
      ...track,
      order: index
    }));

    setTracks(reorderedTracks);
    onTrackChange(reorderedTracks);
  };

  // 处理片段拖拽
  const handleClipDragEnd = (trackId: string, result: DropResult) => {
    if (!result.destination) return;

    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const clips = Array.from(track.clips);
        const [reorderedItem] = clips.splice(result.source.index, 1);
        clips.splice(result.destination!.index, 0, reorderedItem);

        // 更新顺序
        const reorderedClips = clips.map((clip, index) => ({
          ...clip,
          order: index
        }));

        return { ...track, clips: reorderedClips };
      }
      return track;
    }));
  };

  // 添加关键帧
  const addKeyframe = (trackId: string, clipId: string, type: Keyframe['type']) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: track.clips.map(clip => {
            if (clip.id === clipId) {
              return {
                ...clip,
                keyframes: [
                  ...(clip.keyframes || []),
                  {
                    id: `keyframe-${Date.now()}`,
                    time: currentTime - clip.startTime,
                    value: type === 'volume' ? clip.volume : 100,
                    type
                  }
                ]
              };
            }
            return clip;
          })
        };
      }
      return track;
    }));
  };

  return (
    <div className="timeline" ref={timelineRef}>
      <div className="timeline-header">
        <Space>
          <Button 
            icon={<VideoCameraOutlined />} 
            onClick={() => addTrack('video')}
          >
            添加视频轨道
          </Button>
          <Button 
            icon={<SoundOutlined />} 
            onClick={() => addTrack('audio')}
          >
            添加音频轨道
          </Button>
          <Button 
            icon={<ScissorOutlined />}
            disabled={!selectedClip}
            onClick={() => {
              if (selectedClip) {
                splitClip(selectedClip.trackId, selectedClip.clipId, currentTime);
              }
            }}
          >
            分割
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            disabled={!selectedClip}
            onClick={() => {
              if (selectedClip) {
                deleteClip(selectedClip.trackId, selectedClip.clipId);
              }
            }}
          >
            删除
          </Button>
        </Space>
        <Space>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={scale}
            onChange={setScale}
            style={{ width: 100 }}
          />
        </Space>
      </div>

      <div className="timeline-ruler">
        {/* 时间刻度 */}
        {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
          <div key={i} className="ruler-mark">
            <span>{formatTime(i)}</span>
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={handleTrackDragEnd}>
        <Droppable droppableId="tracks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="timeline-tracks"
            >
              {tracks.map((track, index) => (
                <Draggable
                  key={track.id}
                  draggableId={track.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="track">
                        <div 
                          className="track-header"
                          {...provided.dragHandleProps}
                        >
                          <span>{track.type === 'video' ? '视频轨道' : '音频轨道'}</span>
                          <Button 
                            type="text" 
                            icon={<DeleteOutlined />}
                            onClick={() => setTracks(prev => prev.filter(t => t.id !== track.id))}
                          />
                        </div>
                        <Droppable
                          droppableId={`track-${track.id}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="track-content"
                            >
                              {track.clips.map((clip, index) => (
                                <Draggable
                                  key={clip.id}
                                  draggableId={clip.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`clip ${clip.selected ? 'selected' : ''} ${track.type}`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        left: `${(clip.startTime / duration) * 100}%`,
                                        width: `${((clip.endTime - clip.startTime) / duration) * 100}%`
                                      }}
                                    >
                                      {/* 关键帧标记 */}
                                      {clip.keyframes?.map(keyframe => (
                                        <div
                                          key={keyframe.id}
                                          className={`keyframe ${keyframe.type}`}
                                          style={{
                                            left: `${(keyframe.time / (clip.endTime - clip.startTime)) * 100}%`
                                          }}
                                        />
                                      ))}
                                      {track.type === 'video' && clip.thumbnail && (
                                        <img src={clip.thumbnail} alt="thumbnail" />
                                      )}
                                      {track.type === 'audio' && clip.waveform && (
                                        <div className="waveform">
                                          {clip.waveform.map((value, i) => (
                                            <div 
                                              key={i} 
                                              className="waveform-bar" 
                                              style={{ height: `${value}%` }} 
                                            />
                                          ))}
                                        </div>
                                      )}
                                      <div className="clip-info">
                                        <span>{formatTime(clip.endTime - clip.startTime)}</span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="timeline-cursor" style={{ left: `${(currentTime / duration) * 100}%` }} />
    </div>
  );
};

// 格式化时间
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default Timeline; 