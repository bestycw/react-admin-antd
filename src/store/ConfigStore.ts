import { makeAutoObservable } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

type ThemeStyle = 'dynamic' | 'classic'
type LayoutMode = 'vertical' | 'horizontal' | 'mix'
type UserActionsPosition = 'header' | 'sidebar'
type LogoPosition = 'header' | 'sidebar'
type ThemeMode = 'light' | 'dark' | 'system'

class ConfigStore {
  themeStyle: ThemeStyle = 'dynamic'
  themeMode: ThemeMode = 'system'
  isDarkMode: boolean = false
  layoutMode: LayoutMode = 'vertical'
  userActionsPosition: UserActionsPosition = 'header'
  logoPosition: LogoPosition = 'header'
  showLogo: boolean = true
  sidebarCollapsed: boolean = false
  settingDrawerVisible: boolean = false

  // antd 主题配置
  themeConfig: ThemeConfig = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
    algorithm: theme.defaultAlgorithm,
  }

  // 添加一个标记来区分是自动折叠还是手动折叠
  private isAutoCollapsed = false

  // 添加抽屉模式状态
  isDrawerMode: boolean = false
  drawerVisible: boolean = false

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
      computedRequiresReaction: true,
    })
    this.initSettings()
    this.initSystemTheme()
    this.initViewportListener()
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

  private initViewportListener() {
    // 初始检查
    this.checkViewportWidth()

    // 添加resize监听
    window.addEventListener('resize', this.checkViewportWidth)
  }

  private checkViewportWidth = () => {
    // 所有布局模式下，当视口宽度小于 768px 时切换到抽屉模式
    if (window.innerWidth < 768) {
      // 切换到抽屉模式
      this.isDrawerMode = true
      this.drawerVisible = false
      // 确保不会保持折叠状态
      this.isAutoCollapsed = false
      this.sidebarCollapsed = false
    } else if (window.innerWidth < 1024) {
      // 中等宽度时使用折叠模式
      this.isDrawerMode = false
      if (!this.sidebarCollapsed) {
        this.isAutoCollapsed = true
        this.sidebarCollapsed = true
      }
    } else {
      // 恢复正常模式
      this.isDrawerMode = false
      if (this.isAutoCollapsed) {
        this.isAutoCollapsed = false
        this.sidebarCollapsed = false
      }
    }

    // 保存当前状态
    localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
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
    // 同步更新 antd 主题算法
    this.setThemeAlgorithm(this.isDarkMode)
  }

  setLayoutMode = (mode: LayoutMode) => {
    this.layoutMode = mode
    localStorage.setItem('layoutMode', mode)
    
    // 根据布局模式调整其他设置
    if (mode === 'vertical') {
      // 垂直布局（顶部导航）时的默认设置
      this.userActionsPosition = 'header'
      this.logoPosition = 'header'
    } else if (mode === 'horizontal') {
      // 水平布局（侧边导航）时的默认设置
      this.userActionsPosition = 'sidebar'
      this.logoPosition = 'sidebar'
    }
    // mix 模式保持当前设置

    // 重置状态并检查视口
    this.isDrawerMode = window.innerWidth < 768
    this.drawerVisible = false
    this.isAutoCollapsed = false
    this.sidebarCollapsed = false
    this.checkViewportWidth()
  }

  toggleSidebar = () => {
    if (!this.isDrawerMode) {
      this.isAutoCollapsed = false // 手动切换时清除自动折叠标记
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
    }
  }

  setSidebarCollapsed = (collapsed: boolean) => {
    if (!this.isDrawerMode) {
      this.sidebarCollapsed = collapsed
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    }
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
    if (this.isDrawerMode) return false
    
    return this.showLogo && (
      this.layoutMode === 'vertical' || 
      (this.layoutMode === 'mix' && this.logoPosition === 'header')
    )
  }

  get showSidebarLogo() {
    if (this.isDrawerMode) return false
    
    return this.showLogo && (
      this.layoutMode === 'horizontal' || 
      (this.layoutMode === 'mix' && this.logoPosition === 'sidebar')
    )
  }

  get showHeaderUserActions() {
    if (this.isDrawerMode) return false
    
    return this.layoutMode === 'vertical' || 
      (this.layoutMode === 'mix' && this.userActionsPosition === 'header')
  }

  get showSidebarUserActions() {
    if (this.isDrawerMode) return false
    
    return this.layoutMode === 'horizontal' || 
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

  // 置主题色
  setThemeColor = (color: string) => {
    this.themeConfig = {
      ...this.themeConfig,
      token: {
        ...this.themeConfig.token,
        colorPrimary: color,
      }
    }
  }

  // 设置主题算法
  setThemeAlgorithm = (isDark: boolean) => {
    this.themeConfig = {
      ...this.themeConfig,
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }
  }

  // 清理方法
  dispose() {
    window.removeEventListener('resize', this.checkViewportWidth)
  }

  // 添加抽屉控制方法
  toggleDrawer = () => {
    if (this.isDrawerMode) {
      this.drawerVisible = !this.drawerVisible
    }
  }

  closeDrawer = () => {
    this.drawerVisible = false
  }

  // 新增抽屉内容显示控制
  get showDrawerLogo() {
    return this.isDrawerMode && this.showLogo
  }

  get showDrawerUserActions() {
    return this.isDrawerMode
  }

  get showDrawerMenu() {
    return this.isDrawerMode
  }
}

export default new ConfigStore()
