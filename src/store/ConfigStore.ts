import { makeAutoObservable } from 'mobx'

type ThemeStyle = 'mac' | 'sharp';

class ConfigStore {
  isDarkMode: boolean;
  themeStyle: ThemeStyle;

  constructor() {
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.themeStyle = (localStorage.getItem('themeStyle') as ThemeStyle) || 'mac';
    
    makeAutoObservable(this, {}, { autoBind: true });
    
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.classList.remove('theme-mac', 'theme-sharp');
    document.documentElement.classList.add(`theme-${this.themeStyle}`);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', String(this.isDarkMode));
    this.applyTheme();
  }

  setThemeStyle(style: ThemeStyle) {
    this.themeStyle = style;
    localStorage.setItem('themeStyle', style);
    this.applyTheme();
  }

  get currentTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  get currentStyle() {
    return this.themeStyle;
  }
}

export default new ConfigStore();
