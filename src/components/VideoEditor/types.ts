// 基础类型定义
export interface VideoEditorProps {
  onSave?: (blob: Blob) => void;
}

export interface MediaFile extends File {
  uid: string;
  duration?: number;
  thumbnail?: string;
}

// 调整面板相关类型
export interface VideoFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  temperature: number;
}

export interface CropSettings {
  enabled: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VideoAdjustments extends VideoFilter {
  hue: number;
  blur: number;
  speed: number;
  volume: number;
  rotation: number;
  scale: number;
  cropSettings: CropSettings;
  currentPreset: string;
  currentEffect: string;
  currentTransition: string;
  effectIntensity: number;
  transitionDuration: number;
}

export interface PresetFilter {
  name: string;
  adjustments: Partial<VideoFilter>;
}

export interface VideoEffect {
  name: string;
  config?: Record<string, any>;
}

export interface Transition {
  type: 'none' | 'fade' | 'wipe' | 'slide' | 'zoom' | 'dissolve';
  duration: number;
}

// 时间轴相关类型
export interface Track {
  id: string;
  type: 'video' | 'audio';
  clips: Clip[];
  volume: number;
  muted: boolean;
  order: number;
  groupId?: string;
}

export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
  waveform?: number[];
  volume: number;
  speed: number;
  selected?: boolean;
  filters?: Partial<VideoFilter>;
  effect?: string;
  transition?: Transition;
  keyframes?: Keyframe[];
  order: number;
  scale: number;
  cropSettings: CropSettings;
}

export interface Keyframe {
  id: string;
  time: number;
  value: number;
  type: 'volume' | 'scale' | 'rotation' | 'opacity';
}

// 素材相关类型
export interface MaterialItem {
  uid: string;
  name: string;
  type: 'video' | 'audio';
  size: number;
  duration?: number;
  thumbnail?: string;
  waveform?: number[];
  url: string;
}

export interface Marker {
  id: string;
  time: number;
  text: string;
} 