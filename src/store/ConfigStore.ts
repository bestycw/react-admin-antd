import { makeAutoObservable } from 'mobx'

type ThemeStyle = 'dynamic' | 'classic'

class ConfigStore {
  themeStyle: ThemeStyle = 'dynamic'
  isDarkMode: boolean = false

  constructor() {
    makeAutoObservable(this)
    // 从本地存储恢复设置
    const savedTheme = localStorage.getItem('themeStyle') as ThemeStyle
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true'
    
    if (savedTheme) {
      this.themeStyle = savedTheme
      document.documentElement.classList.add(`theme-${savedTheme}`)
    } else {
      document.documentElement.classList.add('theme-dynamic')
    }
    
    if (savedDarkMode) {
      this.isDarkMode = savedDarkMode
      document.documentElement.classList.add('dark')
    }
  }

  setThemeStyle = (style: ThemeStyle) => {
    this.themeStyle = style
    document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
    document.documentElement.classList.add(`theme-${style}`)
    localStorage.setItem('themeStyle', style)
  }

  toggleTheme = () => {
    this.setThemeStyle(this.themeStyle === 'dynamic' ? 'classic' : 'dynamic')
  }

  toggleDarkMode = () => {
    this.isDarkMode = !this.isDarkMode
    document.documentElement.classList.toggle('dark', this.isDarkMode)
    localStorage.setItem('isDarkMode', String(this.isDarkMode))
  }
}

export default new ConfigStore()
