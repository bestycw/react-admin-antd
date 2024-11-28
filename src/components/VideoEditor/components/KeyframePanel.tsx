import React from 'react';
import { Button, InputNumber, Select, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Keyframe } from '../types';

interface KeyframePanelProps {
  keyframes: Keyframe[];
  currentTime: number;
  onAddKeyframe: (type: Keyframe['type']) => void;
  onUpdateKeyframe: (id: string, value: number) => void;
  onDeleteKeyframe: (id: string) => void;
}

const KeyframePanel: React.FC<KeyframePanelProps> = ({
  keyframes,
  // currentTime,
  onAddKeyframe,
  onUpdateKeyframe,
  onDeleteKeyframe
}) => {
  return (
    <div className="keyframe-panel">
      <div className="keyframe-header">
        <h3>关键帧</h3>
        <Space>
          <Select
            defaultValue="volume"
            style={{ width: 120 }}
            onChange={(value) => onAddKeyframe(value as Keyframe['type'])}
          >
            <Select.Option value="volume">音量</Select.Option>
            <Select.Option value="scale">缩放</Select.Option>
            <Select.Option value="rotation">旋转</Select.Option>
            <Select.Option value="opacity">透明度</Select.Option>
          </Select>
          <Button 
            icon={<PlusOutlined />}
            onClick={() => onAddKeyframe('volume')}
          >
            添加关键帧
          </Button>
        </Space>
      </div>

      <div className="keyframe-list">
        {keyframes
          .sort((a, b) => a.time - b.time)
          .map(keyframe => (
            <div key={keyframe.id} className="keyframe-item">
              <span className="keyframe-time">{keyframe.time.toFixed(2)}s</span>
              <span className="keyframe-type">{keyframe.type}</span>
              <InputNumber
                value={keyframe.value}
                onChange={(value) => onUpdateKeyframe(keyframe.id, value || 0)}
                min={0}
                max={100}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => onDeleteKeyframe(keyframe.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default KeyframePanel; 