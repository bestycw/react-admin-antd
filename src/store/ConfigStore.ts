import { makeAutoObservable } from 'mobx'

type ThemeStyle = 'dynamic' | 'classic'
type LayoutMode = 'horizontal' | 'vertical'

class ConfigStore {
  themeStyle: ThemeStyle = 'dynamic'
  isDarkMode: boolean = false
  layoutMode: LayoutMode = 'horizontal'
  sidebarCollapsed: boolean = false

  constructor() {
    makeAutoObservable(this)
    // 从本地存储恢复设置
    const savedTheme = localStorage.getItem('themeStyle') as ThemeStyle
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true'
    const savedLayout = localStorage.getItem('layoutMode') as LayoutMode
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true'
    
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

    if (savedLayout) {
      this.layoutMode = savedLayout
    }

    if (savedCollapsed !== null) {
      this.sidebarCollapsed = savedCollapsed
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

  setLayoutMode = (mode: LayoutMode) => {
    this.layoutMode = mode
    localStorage.setItem('layoutMode', mode)
  }

  toggleSidebar = () => {
    this.sidebarCollapsed = !this.sidebarCollapsed
    localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
  }
}

export default new ConfigStore()
