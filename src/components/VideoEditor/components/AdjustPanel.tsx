import React, { useState } from 'react';
import { Tabs, Slider, InputNumber, Radio, Space, Switch, Button, Collapse } from 'antd';
import {
  BgColorsOutlined,
  ControlOutlined,
  SoundOutlined,
  FieldTimeOutlined,
  ScissorOutlined,
  BorderOutlined,
  FilterOutlined,
  StarOutlined,
  SwapOutlined
} from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { VideoAdjustments, PresetFilter, VideoEffect, Transition } from '../types';

const { Panel } = Collapse;

// 预设效果定义
const PRESET_FILTERS: Record<string, PresetFilter> = {
  normal: { 
    name: '原始', 
    adjustments: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      temperature: 0
    } 
  },
  warm: { 
    name: '暖色',
    adjustments: {
      brightness: 105,
      contrast: 100,
      saturation: 110,
      sepia: 0,
      temperature: 30
    }
  },
  cold: { 
    name: '冷色',
    adjustments: { temperature: -30, saturation: 105, brightness: 100 }
  },
  vintage: {
    name: '复古',
    adjustments: { 
      saturation: 85, 
      contrast: 110,
      sepia: 30 
    }
  },
  dramatic: {
    name: '戏剧',
    adjustments: { 
      contrast: 120,
      brightness: 95,
      saturation: 110
    }
  }
};

// 特效定义
const VIDEO_EFFECTS = {
  none: { name: '无' },
  fade: { name: '淡入淡出' },
  blur: { name: '模糊' },
  zoom: { name: '缩放' },
  slide: { name: '滑动' },
  flash: { name: '闪光' }
};

// 转场效果定义
const TRANSITIONS = {
  none: { name: '无' },
  fade: { name: '淡入淡出' },
  wipe: { name: '擦除' },
  slide: { name: '滑动' },
  zoom: { name: '缩放' },
  dissolve: { name: '溶解' }
};

interface AdjustPanelProps {
  mediaType?: 'video' | 'audio';
  onAdjust: (adjustments: Partial<VideoAdjustments>) => void;
}

const AdjustPanel: React.FC<AdjustPanelProps> = ({ mediaType, onAdjust }) => {
  const [adjustments, setAdjustments] = useState<VideoAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    speed: 1,
    volume: 100,
    rotation: 0,
    scale: 100,
    cropSettings: {
      enabled: false,
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
    temperature: 0,
    sepia: 0,
    vignette: 0,
    currentPreset: 'normal',
    currentEffect: 'none',
    currentTransition: 'none',
    effectIntensity: 0,
    transitionDuration: 0.5
  });

  const handleAdjustmentChange = (key: keyof VideoAdjustments, value: number) => {
    const newAdjustments = {
      ...adjustments,
      [key]: value
    };
    setAdjustments(newAdjustments);
    onAdjust({ [key]: value });
  };

  const handleCropChange = (key: keyof typeof adjustments.cropSettings, value: boolean | number) => {
    const newAdjustments = {
      ...adjustments,
      cropSettings: {
        ...adjustments.cropSettings,
        [key]: value
      }
    };
    setAdjustments(newAdjustments);
    onAdjust({ cropSettings: newAdjustments.cropSettings });
  };

  return (
    <div className="adjust-panel">
      <Tabs defaultActiveKey="1">
        {mediaType === 'video' && (
          <Tabs.TabPane 
            tab={<span><BgColorsOutlined />画面调整</span>} 
            key="1"
          >
            <Collapse defaultActiveKey={['color', 'transform']}>
              <Panel header="颜色调整" key="color">
                <div className="adjust-section">
                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">亮度</span>
                      <InputNumber
                        min={0}
                        max={200}
                        value={adjustments.brightness}
                        onChange={value => handleAdjustmentChange('brightness', value || 100)}
                      />
                    </div>
                    <Slider
                      min={0}
                      max={200}
                      value={adjustments.brightness}
                      onChange={value => handleAdjustmentChange('brightness', value)}
                    />
                  </div>

                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">对比度</span>
                      <InputNumber
                        min={0}
                        max={200}
                        value={adjustments.contrast}
                        onChange={value => handleAdjustmentChange('contrast', value || 100)}
                      />
                    </div>
                    <Slider
                      min={0}
                      max={200}
                      value={adjustments.contrast}
                      onChange={value => handleAdjustmentChange('contrast', value)}
                    />
                  </div>

                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">饱和度</span>
                      <InputNumber
                        min={0}
                        max={200}
                        value={adjustments.saturation}
                        onChange={value => handleAdjustmentChange('saturation', value || 100)}
                      />
                    </div>
                    <Slider
                      min={0}
                      max={200}
                      value={adjustments.saturation}
                      onChange={value => handleAdjustmentChange('saturation', value)}
                    />
                  </div>

                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">色相</span>
                      <InputNumber
                        min={-180}
                        max={180}
                        value={adjustments.hue}
                        onChange={value => handleAdjustmentChange('hue', value || 0)}
                      />
                    </div>
                    <Slider
                      min={-180}
                      max={180}
                      value={adjustments.hue}
                      onChange={value => handleAdjustmentChange('hue', value)}
                    />
                  </div>

                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">模糊</span>
                      <InputNumber
                        min={0}
                        max={20}
                        value={adjustments.blur}
                        onChange={value => handleAdjustmentChange('blur', value || 0)}
                      />
                    </div>
                    <Slider
                      min={0}
                      max={20}
                      value={adjustments.blur}
                      onChange={value => handleAdjustmentChange('blur', value)}
                    />
                  </div>
                </div>
              </Panel>

              <Panel header="变换调整" key="transform">
                <div className="adjust-section">
                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">旋转</span>
                      <Radio.Group
                        value={adjustments.rotation}
                        onChange={e => handleAdjustmentChange('rotation', e.target.value)}
                      >
                        <Radio.Button value={0}>0°</Radio.Button>
                        <Radio.Button value={90}>90°</Radio.Button>
                        <Radio.Button value={180}>180°</Radio.Button>
                        <Radio.Button value={270}>270°</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>

                  <div className="adjust-item">
                    <div className="item-header">
                      <span className="item-label">缩放</span>
                      <InputNumber
                        min={50}
                        max={200}
                        value={adjustments.scale}
                        onChange={value => handleAdjustmentChange('scale', value || 100)}
                        addonAfter="%"
                      />
                    </div>
                    <Slider
                      min={50}
                      max={200}
                      value={adjustments.scale}
                      onChange={value => handleAdjustmentChange('scale', value)}
                    />
                  </div>
                </div>
              </Panel>

              <Panel header="裁剪" key="crop">
                <div className="adjust-section">
                  <div className="adjust-item">
                    <Switch
                      checked={adjustments.cropSettings.enabled}
                      onChange={value => handleCropChange('enabled', value)}
                    /> 启用裁剪
                  </div>
                  {adjustments.cropSettings.enabled && (
                    <>
                      <div className="adjust-item">
                        <div className="item-header">
                          <span className="item-label">X 偏移</span>
                          <InputNumber
                            value={adjustments.cropSettings.x}
                            onChange={value => handleCropChange('x', value || 0)}
                            min={0}
                            max={100}
                          />
                        </div>
                        <Slider
                          value={adjustments.cropSettings.x}
                          onChange={value => handleCropChange('x', value)}
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="adjust-item">
                        <div className="item-header">
                          <span className="item-label">Y 偏移</span>
                          <InputNumber
                            value={adjustments.cropSettings.y}
                            onChange={value => handleCropChange('y', value || 0)}
                            min={0}
                            max={100}
                          />
                        </div>
                        <Slider
                          value={adjustments.cropSettings.y}
                          onChange={value => handleCropChange('y', value)}
                          min={0}
                          max={100}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Panel>
            </Collapse>
          </Tabs.TabPane>
        )}

        <Tabs.TabPane 
          tab={<span><ControlOutlined />播放控制</span>} 
          key="2"
        >
          <div className="adjust-section">
            <div className="adjust-item">
              <div className="item-header">
                <span className="item-label">播放速度</span>
                <InputNumber
                  min={0.25}
                  max={2}
                  step={0.25}
                  value={adjustments.speed}
                  onChange={value => handleAdjustmentChange('speed', value || 1)}
                />
              </div>
              <Slider
                min={0.25}
                max={2}
                step={0.25}
                value={adjustments.speed}
                onChange={value => handleAdjustmentChange('speed', value)}
                marks={{
                  0.25: '0.25x',
                  1: '1x',
                  2: '2x'
                }}
              />
            </div>

            <div className="adjust-item">
              <div className="item-header">
                <span className="item-label">音量</span>
                <InputNumber
                  min={0}
                  max={100}
                  value={adjustments.volume}
                  onChange={value => handleAdjustmentChange('volume', value || 0)}
                  addonAfter="%"
                />
              </div>
              <Slider
                min={0}
                max={100}
                value={adjustments.volume}
                onChange={value => handleAdjustmentChange('volume', value)}
              />
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane 
          tab={<span><FilterOutlined />预设效果</span>} 
          key="3"
        >
          <div className="preset-filters">
            {Object.entries(PRESET_FILTERS).map(([key, filter]) => (
              <div
                key={key}
                className={`preset-filter-item ${adjustments.currentPreset === key ? 'active' : ''}`}
                onClick={() => {
                  setAdjustments(prev => ({
                    ...prev,
                    ...filter.adjustments,
                    currentPreset: key
                  }));
                  onAdjust({ ...filter.adjustments, currentPreset: key });
                }}
              >
                <div className="filter-preview" style={{
                  filter: `
                    brightness(${filter.adjustments.brightness || 100}%)
                    contrast(${filter.adjustments.contrast || 100}%)
                    saturate(${filter.adjustments.saturation || 100}%)
                    sepia(${filter.adjustments.sepia || 0}%)
                  `
                }} />
                <span>{filter.name}</span>
              </div>
            ))}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane 
          tab={<span><StarOutlined />特效</span>} 
          key="4"
        >
          <div className="adjust-section">
            <div className="effect-list">
              <Radio.Group
                value={adjustments.currentEffect}
                onChange={e => handleAdjustmentChange('currentEffect', e.target.value)}
              >
                {Object.entries(VIDEO_EFFECTS).map(([key, effect]) => (
                  <Radio.Button key={key} value={key}>
                    {effect.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            {adjustments.currentEffect !== 'none' && (
              <div className="adjust-item">
                <div className="item-header">
                  <span className="item-label">效果强度</span>
                  <InputNumber
                    min={0}
                    max={100}
                    value={adjustments.effectIntensity}
                    onChange={value => handleAdjustmentChange('effectIntensity', value || 0)}
                  />
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={adjustments.effectIntensity}
                  onChange={value => handleAdjustmentChange('effectIntensity', value)}
                />
              </div>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane 
          tab={<span><SwapOutlined />转场</span>} 
          key="5"
        >
          <div className="adjust-section">
            <div className="transition-list">
              <Radio.Group
                value={adjustments.currentTransition}
                onChange={e => handleAdjustmentChange('currentTransition', e.target.value)}
              >
                {Object.entries(TRANSITIONS).map(([key, transition]) => (
                  <Radio.Button key={key} value={key}>
                    {transition.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            {adjustments.currentTransition !== 'none' && (
              <div className="adjust-item">
                <div className="item-header">
                  <span className="item-label">转场时长</span>
                  <InputNumber
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={adjustments.transitionDuration}
                    onChange={value => handleAdjustmentChange('transitionDuration', value || 0.5)}
                    addonAfter="秒"
                  />
                </div>
                <Slider
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={adjustments.transitionDuration}
                  onChange={value => handleAdjustmentChange('transitionDuration', value)}
                  marks={{
                    0.1: '0.1s',
                    1: '1s',
                    2: '2s'
                  }}
                />
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AdjustPanel; 