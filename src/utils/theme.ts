export type ThemeStyle = 'mac' | 'win';

export const applyTheme = (isDark: boolean, style: ThemeStyle) => {
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', style);
}; 