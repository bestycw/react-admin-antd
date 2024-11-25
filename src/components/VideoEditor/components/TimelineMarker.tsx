import React from 'react';
import { Button, Input, Popover } from 'antd';
import { FlagOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TimelineMarker } from '../types';

interface TimelineMarkerProps {
  markers: TimelineMarker[];
  currentTime: number;
  duration: number;
  onAddMarker: (marker: TimelineMarker) => void;
  onUpdateMarker: (id: string, text: string) => void;
  onDeleteMarker: (id: string) => void;
}

const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  markers,
  currentTime,
  duration,
  onAddMarker,
  onUpdateMarker,
  onDeleteMarker
}) => {
  return (
    <div className="timeline-markers">
      <Button
        icon={<FlagOutlined />}
        onClick={() => onAddMarker({
          id: `marker-${Date.now()}`,
          time: currentTime,
          text: '新标记'
        })}
      >
        添加标记
      </Button>

      <div className="markers-container">
        {markers.map(marker => (
          <Popover
            key={marker.id}
            content={
              <div className="marker-edit">
                <Input
                  value={marker.text}
                  onChange={e => onUpdateMarker(marker.id, e.target.value)}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDeleteMarker(marker.id)}
                />
              </div>
            }
            trigger="click"
          >
            <div
              className="timeline-marker"
              style={{
                left: `${(marker.time / duration) * 100}%`
              }}
            >
              <div className="marker-flag" />
              <div className="marker-label">{marker.text}</div>
            </div>
          </Popover>
        ))}
      </div>
    </div>
  );
};

export default TimelineMarker; 