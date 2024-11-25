import React from 'react';
import { Card, Radio, Space, InputNumber } from 'antd';
import type { Transition } from '../types';

interface TransitionPreviewProps {
  transition: Transition;
  onTransitionChange: (transition: Transition) => void;
}

const TRANSITION_TYPES = {
  none: { name: '无' },
  fade: { name: '淡入淡出' },
  wipe: { name: '擦除' },
  slide: { name: '滑动' },
  zoom: { name: '缩放' },
  dissolve: { name: '溶解' }
};

const TransitionPreview: React.FC<TransitionPreviewProps> = ({
  transition,
  onTransitionChange
}) => {
  return (
    <Card title="过渡效果" size="small" className="transition-preview">
      <Space direction="vertical" className="w-full">
        <Radio.Group
          value={transition.type}
          onChange={e => onTransitionChange({ ...transition, type: e.target.value })}
        >
          {Object.entries(TRANSITION_TYPES).map(([key, value]) => (
            <Radio.Button key={key} value={key}>
              {value.name}
            </Radio.Button>
          ))}
        </Radio.Group>
        
        {transition.type !== 'none' && (
          <div className="transition-duration">
            <span>持续时间：</span>
            <InputNumber
              min={0.1}
              max={2}
              step={0.1}
              value={transition.duration}
              onChange={value => onTransitionChange({ ...transition, duration: value || 0.5 })}
              addonAfter="秒"
            />
          </div>
        )}

        <div className="transition-preview-window">
          {/* 过渡效果预览窗口 */}
          <div className={`preview-animation ${transition.type}`} />
        </div>
      </Space>
    </Card>
  );
};

export default TransitionPreview; 