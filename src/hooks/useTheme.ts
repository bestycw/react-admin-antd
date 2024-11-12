import { useStore } from '@/store'

export const useTheme = () => {
  const { ConfigStore } = useStore()
  
  return {
    theme: ConfigStore.themeStyle, // 'mac' | 'win'
    isDarkMode: ConfigStore.isDarkMode,
    toggleTheme: ConfigStore.toggleTheme,
    toggleDarkMode: ConfigStore.toggleDarkMode
  }
} 