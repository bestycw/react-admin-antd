import StorageManager from './storageManager';
import type { ThemeMode, ThemeStyle, LayoutMode } from '@/types/config';

// 存储键定义
export const CONFIG_STORAGE_KEYS = {
  LAYOUT_STATE: 'config:layoutState',
  THEME_MODE: 'config:themeMode',
  THEME_STYLE: 'config:themeStyle',
  SHOW_TABS: 'config:showTabs',
  SIDEBAR_COLLAPSED: 'config:sidebarCollapsed',
  DRAWER_VISIBLE: 'config:drawerVisible',
  SETTING_DRAWER_VISIBLE: 'config:settingDrawerVisible',
  ACTIONS_COLLAPSED: 'config:actionsCollapsed',
  PRESET_COLOR: 'config:presetColor'
} as const;

type StorageKey = keyof typeof CONFIG_STORAGE_KEYS;

class ConfigStorage {
  // 存储操作封装
  private storage = {
    get: <T>(key: StorageKey, defaultValue: T): T => 
      StorageManager.get(CONFIG_STORAGE_KEYS[key], defaultValue, { type: 'local' }),

    set: <T>(key: StorageKey, value: T): void => 
      StorageManager.set(CONFIG_STORAGE_KEYS[key], value, { type: 'local' }),

    remove: (key: StorageKey): void => 
      StorageManager.remove(CONFIG_STORAGE_KEYS[key], { type: 'local' })
  };

  // 布局相关
  getLayoutState(defaultValue = 0): number {
    return this.storage.get('LAYOUT_STATE', defaultValue);
  }

  setLayoutState(value: number): void {
    this.storage.set('LAYOUT_STATE', value);
  }

  // 主题相关
  getThemeMode(defaultValue: ThemeMode = 'system'): ThemeMode {
    return this.storage.get('THEME_MODE', defaultValue);
  }

  setThemeMode(value: ThemeMode): void {
    this.storage.set('THEME_MODE', value);
  }

  getThemeStyle(defaultValue: ThemeStyle = 'dynamic'): ThemeStyle {
    return this.storage.get('THEME_STYLE', defaultValue);
  }

  setThemeStyle(value: ThemeStyle): void {
    this.storage.set('THEME_STYLE', value);
  }

  // UI 状态相关
  getShowTabs(defaultValue = true): boolean {
    return this.storage.get('SHOW_TABS', defaultValue);
  }

  setShowTabs(value: boolean): void {
    this.storage.set('SHOW_TABS', value);
  }

  getSidebarCollapsed(defaultValue = false): boolean {
    return this.storage.get('SIDEBAR_COLLAPSED', defaultValue);
  }

  setSidebarCollapsed(value: boolean): void {
    this.storage.set('SIDEBAR_COLLAPSED', value);
  }

  getDrawerVisible(defaultValue = false): boolean {
    return this.storage.get('DRAWER_VISIBLE', defaultValue);
  }

  setDrawerVisible(value: boolean): void {
    this.storage.set('DRAWER_VISIBLE', value);
  }

  getSettingDrawerVisible(defaultValue = false): boolean {
    return this.storage.get('SETTING_DRAWER_VISIBLE', defaultValue);
  }

  setSettingDrawerVisible(value: boolean): void {
    this.storage.set('SETTING_DRAWER_VISIBLE', value);
  }

  getActionsCollapsed(defaultValue = false): boolean {
    return this.storage.get('ACTIONS_COLLAPSED', defaultValue);
  }

  setActionsCollapsed(value: boolean): void {
    this.storage.set('ACTIONS_COLLAPSED', value);
  }

  // 主题色相关
  getPresetColor(defaultValue: string): string {
    return this.storage.get('PRESET_COLOR', defaultValue);
  }

  setPresetColor(value: string): void {
    this.storage.set('PRESET_COLOR', value);
  }

  // 清除所有配置
  clearConfig(): void {
    Object.keys(CONFIG_STORAGE_KEYS).forEach(key => 
      this.storage.remove(key as StorageKey)
    );
  }
}

export const configStorage = new ConfigStorage();
export default configStorage; 