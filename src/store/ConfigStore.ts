import { makeAutoObservable } from 'mobx'

type ThemeStyle = 'dynamic' | 'classic'
type LayoutMode = 'horizontal' | 'vertical' | 'mix'
type UserActionsPosition = 'header' | 'sidebar'
type LogoPosition = 'header' | 'sidebar'
type ThemeMode = 'light' | 'dark' | 'system'

class ConfigStore {
  themeStyle: ThemeStyle = 'dynamic'
  themeMode: ThemeMode = 'system'
  isDarkMode: boolean = false
  layoutMode: LayoutMode = 'mix'
  userActionsPosition: UserActionsPosition = 'header'
  logoPosition: LogoPosition = 'header'
  showLogo: boolean = true
  sidebarCollapsed: boolean = false
  settingDrawerVisible: boolean = false

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
      computedRequiresReaction: true,
    })
    this.initSettings()
    this.initSystemTheme()
  }

  private initSettings() {
    // 从本地存储恢复设置
    const savedTheme = localStorage.getItem('themeStyle') as ThemeStyle
    const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode
    const savedLayout = localStorage.getItem('layoutMode') as LayoutMode
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true'
    const savedPosition = localStorage.getItem('userActionsPosition') as UserActionsPosition
    const savedLogoPosition = localStorage.getItem('logoPosition') as LogoPosition
    const savedShowLogo = localStorage.getItem('showLogo') !== 'false'
    
    if (savedTheme) {
      this.themeStyle = savedTheme
      document.documentElement.classList.add(`theme-${savedTheme}`)
    } else {
      document.documentElement.classList.add('theme-dynamic')
    }
    
    if (savedThemeMode) {
      this.themeMode = savedThemeMode
    }

    if (savedLayout) {
      this.layoutMode = savedLayout
    }

    if (savedCollapsed !== null) {
      this.sidebarCollapsed = savedCollapsed
    }

    if (savedPosition) {
      this.userActionsPosition = savedPosition
    }

    if (savedLogoPosition) {
      this.logoPosition = savedLogoPosition
    }

    if (savedShowLogo !== null) {
      this.showLogo = savedShowLogo
    }
  }

  private initSystemTheme() {
    // 监听系统主题变化
    if (this.themeMode === 'system') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        this.isDarkMode = e.matches
        document.documentElement.classList.toggle('dark', this.isDarkMode)
      }
      
      darkModeMediaQuery.addEventListener('change', handleThemeChange)
      handleThemeChange(darkModeMediaQuery)
    }
  }

  setThemeStyle = (style: ThemeStyle) => {
    this.themeStyle = style
    document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
    document.documentElement.classList.add(`theme-${style}`)
    localStorage.setItem('themeStyle', style)
  }

  setThemeMode = (mode: ThemeMode) => {
    this.themeMode = mode
    localStorage.setItem('themeMode', mode)

    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.isDarkMode = isDark
    } else {
      this.isDarkMode = mode === 'dark'
    }
    document.documentElement.classList.toggle('dark', this.isDarkMode)
  }

  toggleShowLogo = () => {
    this.showLogo = !this.showLogo
    localStorage.setItem('showLogo', String(this.showLogo))
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

  setSidebarCollapsed = (collapsed: boolean) => {
    this.sidebarCollapsed = collapsed
    localStorage.setItem('sidebarCollapsed', String(collapsed))
  }

  setUserActionsPosition = (position: UserActionsPosition) => {
    this.userActionsPosition = position
    localStorage.setItem('userActionsPosition', position)
  }

  setLogoPosition = (position: LogoPosition) => {
    this.logoPosition = position
    localStorage.setItem('logoPosition', position)
  }

  get showHeaderLogo() {
    return this.showLogo && (
      this.layoutMode === 'horizontal' || 
      (this.layoutMode === 'mix' && this.logoPosition === 'header')
    )
  }

  get showSidebarLogo() {
    return this.showLogo && (
      this.layoutMode === 'vertical' || 
      (this.layoutMode === 'mix' && this.logoPosition === 'sidebar')
    )
  }

  get showHeaderUserActions() {
    return this.layoutMode === 'horizontal' || 
      (this.layoutMode === 'mix' && this.userActionsPosition === 'header')
  }

  get showSidebarUserActions() {
    return this.layoutMode === 'vertical' || 
      (this.layoutMode === 'mix' && this.userActionsPosition === 'sidebar')
  }

  toggleSettingDrawer = () => {
    this.settingDrawerVisible = !this.settingDrawerVisible
  }

  closeSettingDrawer = () => {
    this.settingDrawerVisible = false
  }

  openSettingDrawer = () => {
    this.settingDrawerVisible = true
  }
}

export default new ConfigStore()
