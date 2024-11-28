import React, { useState } from 'react';
import { Card, Slider, InputNumber, Space, Button } from 'antd';
import {  ScissorOutlined, UndoOutlined } from '@ant-design/icons';
import type { CropSettings } from '../types';

interface ClipTransformProps {
  scale: number;
  cropSettings: CropSettings;
  onScaleChange: (scale: number) => void;
  onCropChange: (settings: CropSettings) => void;
}

const ClipTransform: React.FC<ClipTransformProps> = ({
  scale,
  cropSettings,
  onScaleChange,
  onCropChange
}) => {
  const [showCropTool, setShowCropTool] = useState(false);

  return (
    <Card title="变换" size="small" className="clip-transform">
      <Space direction="vertical" className="w-full">
        <div className="scale-control">
          <div className="control-header">
            <span>缩放</span>
            <InputNumber
              min={50}
              max={200}
              value={scale}
              onChange={value => onScaleChange(value || 100)}
              addonAfter="%"
            />
          </div>
          <Slider
            min={50}
            max={200}
            value={scale}
            onChange={onScaleChange}
          />
        </div>

        <div className="crop-control">
          <Button
            icon={<ScissorOutlined />}
            onClick={() => setShowCropTool(!showCropTool)}
          >
            裁剪
          </Button>
          {showCropTool && (
            <div className="crop-tool">
              <div className="crop-preview">
                {/* 裁剪预览窗口 */}
                <div 
                  className="crop-frame"
                  style={{
                    left: `${cropSettings.x}%`,
                    top: `${cropSettings.y}%`,
                    width: `${cropSettings.width}%`,
                    height: `${cropSettings.height}%`
                  }}
                />
              </div>
              <Space>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => onCropChange({
                    enabled: false,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                  })}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={() => setShowCropTool(false)}
                >
                  应用
                </Button>
              </Space>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default ClipTransform; 