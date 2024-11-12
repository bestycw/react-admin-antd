import { makeAutoObservable } from 'mobx'
import { applyTheme } from '@/utils/theme'
import type { ThemeStyle } from '@/utils/theme'

class ConfigStore {
  isDarkMode: boolean;
  themeStyle: ThemeStyle;

  constructor() {
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.themeStyle = (localStorage.getItem('themeStyle') as ThemeStyle) || 'mac';
    
    makeAutoObservable(this, {}, { autoBind: true });
    
    applyTheme(this.isDarkMode, this.themeStyle);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', String(this.isDarkMode));
    applyTheme(this.isDarkMode, this.themeStyle);
  }

  setThemeStyle(style: ThemeStyle) {
    this.themeStyle = style;
    localStorage.setItem('themeStyle', style);
    applyTheme(this.isDarkMode, this.themeStyle);
  }
}

export default new ConfigStore();
