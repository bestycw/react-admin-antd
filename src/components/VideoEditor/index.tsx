import React, { useState } from 'react';
import MaterialPanel from './components/MaterialPanel';
import Player from './components/Player';
import AdjustPanel from './components/AdjustPanel';
import Timeline from './components/Timeline';
import KeyframePanel from './components/KeyframePanel';
import TransitionPreview from './components/TransitionPreview';
import ClipTransform from './components/ClipTransform';
import TimelineMarker from './components/TimelineMarker';
import { 
  VideoAdjustments, 
  Track, 
  Clip, 
  Keyframe,
  Transition,
  CropSettings,
  Marker,
  TrackGroup
} from './types';
import './style.scss';

interface VideoEditorProps {
  onSave?: (blob: Blob) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ onSave }) => {
  const [currentMedia, setCurrentMedia] = useState<{
    type: 'video' | 'audio';
    file: File;
    url: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackGroups, setTrackGroups] = useState<TrackGroup[]>([]);
  const [selectedClip, setSelectedClip] = useState<{
    trackId: string;
    clipId: string;
  } | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  // 获取当前选中的片段
  const getCurrentClip = () => {
    if (!selectedClip) return null;
    const track = tracks.find(t => t.id === selectedClip.trackId);
    if (!track) return null;
    return track.clips.find(c => c.id === selectedClip.clipId) || null;
  };

  // 处理轨道分组
  const handleCreateGroup = (trackIds: string[], name: string) => {
    const newGroup: TrackGroup = {
      id: `group-${Date.now()}`,
      name,
      trackIds,
      collapsed: false
    };
    setTrackGroups(prev => [...prev, newGroup]);
    setTracks(prev => prev.map(track => 
      trackIds.includes(track.id) ? { ...track, groupId: newGroup.id } : track
    ));
  };

  // 处理过渡效果
  const handleTransitionChange = (transition: Transition) => {
    const currentClip = getCurrentClip();
    if (!currentClip || !selectedClip) return;

    setTracks(prev => prev.map(track => {
      if (track.id === selectedClip.trackId) {
        return {
          ...track,
          clips: track.clips.map(clip => {
            if (clip.id === selectedClip.clipId) {
              return { ...clip, transition };
            }
            return clip;
          })
        };
      }
      return track;
    }));
  };

  // 处理片段变换
  const handleClipTransform = (scale: number, cropSettings: CropSettings) => {
    const currentClip = getCurrentClip();
    if (!currentClip || !selectedClip) return;

    setTracks(prev => prev.map(track => {
      if (track.id === selectedClip.trackId) {
        return {
          ...track,
          clips: track.clips.map(clip => {
            if (clip.id === selectedClip.clipId) {
              return { ...clip, scale, cropSettings };
            }
            return clip;
          })
        };
      }
      return track;
    }));
  };

  // 处理调整
  const handleAdjust = (adjustments: Partial<VideoAdjustments>) => {
    if (selectedClip) {
      setTracks(prev => prev.map(track => {
        if (track.id === selectedClip.trackId) {
          return {
            ...track,
            clips: track.clips.map(clip => {
              if (clip.id === selectedClip.clipId) {
                return {
                  ...clip,
                  filters: {
                    ...clip.filters,
                    ...adjustments
                  }
                };
              }
              return clip;
            })
          };
        }
        return track;
      }));
    }
  };

  // 处理关键帧添加
  const handleKeyframeAdd = (type: Keyframe['type']) => {
    if (selectedClip) {
      setTracks(prev => prev.map(track => {
        if (track.id === selectedClip.trackId) {
          return {
            ...track,
            clips: track.clips.map(clip => {
              if (clip.id === selectedClip.clipId) {
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
    }
  };

  // 处理关键帧更新
  const handleKeyframeUpdate = (id: string, value: number) => {
    if (selectedClip) {
      setTracks(prev => prev.map(track => {
        if (track.id === selectedClip.trackId) {
          return {
            ...track,
            clips: track.clips.map(clip => {
              if (clip.id === selectedClip.clipId) {
                return {
                  ...clip,
                  keyframes: (clip.keyframes || []).map(kf =>
                    kf.id === id ? { ...kf, value } : kf
                  )
                };
              }
              return clip;
            })
          };
        }
        return track;
      }));
    }
  };

  // 处理关键帧删除
  const handleKeyframeDelete = (id: string) => {
    if (selectedClip) {
      setTracks(prev => prev.map(track => {
        if (track.id === selectedClip.trackId) {
          return {
            ...track,
            clips: track.clips.map(clip => {
              if (clip.id === selectedClip.clipId) {
                return {
                  ...clip,
                  keyframes: (clip.keyframes || []).filter(kf => kf.id !== id)
                };
              }
              return clip;
            })
          };
        }
        return track;
      }));
    }
  };

  return (
    <div className="video-editor">
      <div className="editor-main">
        <MaterialPanel 
          onMediaSelect={(file, type) => {
            setCurrentMedia({
              type,
              file,
              url: URL.createObjectURL(file)
            });
          }} 
        />
        <div className="editor-center">
          <Player 
            media={currentMedia}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            onDurationChange={setDuration}
          />
          {selectedClip && (
            <div className="editor-tools">
              <TransitionPreview
                transition={getCurrentClip()?.transition || { type: 'none', duration: 0.5 }}
                onTransitionChange={handleTransitionChange}
              />
              <ClipTransform
                scale={getCurrentClip()?.scale || 100}
                cropSettings={getCurrentClip()?.cropSettings || {
                  enabled: false,
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100
                }}
                onScaleChange={(scale) => handleClipTransform(scale, getCurrentClip()?.cropSettings!)}
                onCropChange={(cropSettings) => handleClipTransform(getCurrentClip()?.scale!, cropSettings)}
              />
            </div>
          )}
        </div>
        <AdjustPanel 
          mediaType={currentMedia?.type}
          onAdjust={handleAdjust}
        />
      </div>
      <div className="editor-timeline">
        <TimelineMarker
          markers={markers}
          currentTime={currentTime}
          duration={duration}
          onAddMarker={(marker) => setMarkers(prev => [...prev, marker])}
          onUpdateMarker={(id, text) => setMarkers(prev => 
            prev.map(m => m.id === id ? { ...m, text } : m)
          )}
          onDeleteMarker={(id) => setMarkers(prev => 
            prev.filter(m => m.id !== id)
          )}
        />
        <Timeline 
          media={currentMedia}
          currentTime={currentTime}
          duration={duration}
          tracks={tracks}
          trackGroups={trackGroups}
          markers={markers}
          onTimeChange={setCurrentTime}
          onClipChange={(trackId: string, clip: Clip) => {
            setTracks(prev => prev.map(track => 
              track.id === trackId 
                ? { ...track, clips: track.clips.map(c => c.id === clip.id ? clip : c) }
                : track
            ));
          }}
          onTrackChange={setTracks}
          onClipSelect={setSelectedClip}
          onCreateGroup={handleCreateGroup}
        />
      </div>
      {selectedClip && (
        <KeyframePanel
          keyframes={getCurrentClip()?.keyframes || []}
          currentTime={currentTime}
          onAddKeyframe={handleKeyframeAdd}
          onUpdateKeyframe={handleKeyframeUpdate}
          onDeleteKeyframe={handleKeyframeDelete}
        />
      )}
    </div>
  );
};

export default VideoEditor; 