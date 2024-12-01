import React, { useRef, useEffect, useCallback } from 'react';
import { frameCache } from '@/utils/frameCache';

interface FrameExtractorProps {
  videoFile: File;
  onFrameExtracted: (time: number, imageData: string) => void;
  interval?: number;
  visibleRange?: [number, number];
}

const FrameExtractor: React.FC<FrameExtractorProps> = ({
  videoFile,
  onFrameExtracted,
  interval = 0.1,
  visibleRange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const extractFrame = useCallback(async (time: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cacheKey = `${videoFile.name}-${time}`;
    const cachedFrame = frameCache.get(cacheKey);
    
    if (cachedFrame) {
      onFrameExtracted(time, cachedFrame);
      return;
    }

    video.currentTime = time;
    await new Promise<void>((resolve) => {
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.5);
        frameCache.add(cacheKey, imageData);
        onFrameExtracted(time, imageData);
        resolve();
      };
    });
  }, [videoFile, onFrameExtracted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const objectUrl = URL.createObjectURL(videoFile);
    video.src = objectUrl;

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      const [startTime, endTime] = visibleRange || [0, duration];
      
      const frameTimes: number[] = [];
      for (let time = startTime; time <= endTime; time += interval) {
        frameTimes.push(time);
      }

      // 分批处理
      const batchSize = 5;
      for (let i = 0; i < frameTimes.length; i += batchSize) {
        const batch = frameTimes.slice(i, i + batchSize);
        await Promise.all(batch.map(extractFrame));
      }
    };

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile, interval, visibleRange, extractFrame]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} />
      <canvas ref={canvasRef} width={64} height={36} />
    </div>
  );
};

export default FrameExtractor; 