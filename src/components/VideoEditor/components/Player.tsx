import React, { useRef, useState } from 'react';
// import { Button, Slider } from 'antd';
// import { 
//   PlayCircleOutlined, 
//   PauseCircleOutlined,
//   StepForwardOutlined,
//   StepBackwardOutlined
// } from '@ant-design/icons';

interface PlayerProps {
  media: {
    type: 'video' | 'audio';
    url: string;
  } | null;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

const Player: React.FC<PlayerProps> = ({
  media,
  currentTime,
  onTimeChange,
  onDurationChange
}) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // ... 播放控制逻辑

  return (
    <div className="player">
      {media?.type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={media.url}
          className="media-player"
        />
      ) : (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={media?.url}
          className="media-player"
        />
      )}
      <div className="player-controls">
        {/* 播放控制器 */}
      </div>
    </div>
  );
};

export default Player; 