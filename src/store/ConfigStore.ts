import { makeAutoObservable, runInAction } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import { ThemeStyle, LayoutMode, UserActionsPosition, LogoPosition, ThemeMode, MenuPosition } from '@/types/config'

type ComponentPosition = {
  logo: LogoPosition;
  menu: MenuPosition;
  userActions: UserActionsPosition;
}

class ConfigStore {
  // 基础配置
  themeStyle: ThemeStyle = 'dynamic'
  themeMode: ThemeMode = 'system'
  isDarkMode: boolean = false
  layoutMode: LayoutMode = 'vertical'
  showLogo: boolean = true

  // 组件位置配置
  positions: ComponentPosition = {
    logo: 'header',
    menu: 'sidebar',
    userActions: 'header'
  }

  // 侧边栏状态
  sidebarCollapsed: boolean = false
  private isAutoCollapsed = false
  isDrawerMode: boolean = false
  drawerVisible: boolean = false
  settingDrawerVisible: boolean = false

  // antd 主题配置
  themeConfig: ThemeConfig = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
    algorithm: theme.defaultAlgorithm,
  }

  // 保存原始位置配置
  private originalPositions: ComponentPosition | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.initSettings()
    this.initSystemTheme()
    this.initViewportListener()
  }

  private initSettings() {
    // 从本地存储恢复设置
    const settings = {
      themeStyle: localStorage.getItem('themeStyle') as ThemeStyle,
      themeMode: localStorage.getItem('themeMode') as ThemeMode,
      layoutMode: localStorage.getItem('layoutMode') as LayoutMode,
      showLogo: localStorage.getItem('showLogo') !== 'false',
      positions: {
        logo: localStorage.getItem('logoPosition') as LogoPosition,
        menu: localStorage.getItem('menuPosition') as MenuPosition,
        userActions: localStorage.getItem('userActionsPosition') as UserActionsPosition,
      }
    }

    // 应用设置
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== null) {
        if (key === 'positions') {
          this.positions = { ...this.positions, ...value }
        } else {
          this[key] = value
        }
      }
    })

    // 初始化主题样式
    document.documentElement.classList.add(`theme-${this.themeStyle || 'dynamic'}`)
  }

  private initSystemTheme() {
    // 监听系统主题变化
    if (this.themeMode === 'system') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        this.isDarkMode = e.matches
        document.documentElement.classList.toggle('dark', this.isDarkMode)
        this.setThemeAlgorithm(this.isDarkMode)
      }
      
      darkModeMediaQuery.addEventListener('change', handleThemeChange)
      handleThemeChange(darkModeMediaQuery)
    }
  }

  private initViewportListener() {
    const checkViewportWidth = () => {
      if (window.innerWidth < 768) {
        if (!this.isDrawerMode) {
          // 进入抽屉模式时保存当前配置
          this.originalPositions = { ...this.positions }
          // 强制所有组件到侧边栏
          this.positions = {
            logo: 'sidebar',
            menu: 'sidebar',
            userActions: 'sidebar'
          }
        }
        this.isDrawerMode = true
        this.drawerVisible = false
        this.isAutoCollapsed = false
        this.sidebarCollapsed = false
      } else {
        if (this.isDrawerMode) {
          // 退出抽屉模式时恢复原始配置
          if (this.originalPositions) {
            this.positions = { ...this.originalPositions }
            this.originalPositions = null
          }
        }
        this.isDrawerMode = false
        if (window.innerWidth < 1024) {
          if (!this.sidebarCollapsed) {
            this.isAutoCollapsed = true
            this.sidebarCollapsed = true
          }
        } else {
          if (this.isAutoCollapsed) {
            this.isAutoCollapsed = false
            this.sidebarCollapsed = false
          }
        }
      }
    }

    // 初始检查
   checkViewportWidth()

    // 添加resize监听
    window.addEventListener('resize', () => {
      runInAction(checkViewportWidth)
    })
  }

  // 重置抽屉状态
  private resetDrawerState() {
    this.isDrawerMode = window.innerWidth < 768
    this.drawerVisible = false
    this.isAutoCollapsed = false
    this.sidebarCollapsed = false
  }

  // 设置主题算法
  private setThemeAlgorithm(isDark: boolean) {
    this.themeConfig = {
      ...this.themeConfig,
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }
  }

  // 计算显示位置
  private shouldShowInPosition(component: keyof ComponentPosition, position: 'header' | 'sidebar'): boolean {
    // 抽屉模式特殊处理
    if (this.isDrawerMode) {
 
      // 其他组件不在 header 和 sidebar 显示
      return false
    }
    
    const isInPosition = this.positions[component] === position

    // 菜单特殊处理
    if (component === 'menu') {
      // 混合显示模式
      if (this.positions.menu === 'mix') {
        return position === 'header' || position === 'sidebar'
      }
      // 普通显示模式
      return (this.layoutMode === 'vertical' && position === 'header') || 
             (this.layoutMode === 'horizontal' && position === 'sidebar') ||
             (this.layoutMode === 'mix' && isInPosition)
    }

    // 其他组件
    const showInHeader = this.layoutMode === 'vertical' || 
      (this.layoutMode === 'mix' && isInPosition)
    const showInSidebar = this.layoutMode === 'horizontal' || 
      (this.layoutMode === 'mix' && isInPosition)

    return position === 'header' ? showInHeader : showInSidebar
  }

  // 获取有效的布局模式
  get effectiveLayoutMode(): LayoutMode {
    if (this.layoutMode === 'mix') {
      const allInHeader = Object.values(this.positions).every(pos => pos === 'header')
      const allInSidebar = Object.values(this.positions).every(pos => pos === 'sidebar' || !this.showLogo)
      
      if (allInHeader) return 'vertical'
      if (allInSidebar) return 'horizontal'
    }
    return this.layoutMode
  }

  // 组件显示状态
  get showHeaderLogo() { return this.shouldShowInPosition('logo', 'header') && this.showLogo }
  get showSidebarLogo() { return this.shouldShowInPosition('logo', 'sidebar') && this.showLogo }
  get showHeaderMenu() { return this.shouldShowInPosition('menu', 'header') }
  get showSidebarMenu() { return this.shouldShowInPosition('menu', 'sidebar') }
  get showHeaderUserActions() { return this.shouldShowInPosition('userActions', 'header') }
  get showSidebarUserActions() { return this.shouldShowInPosition('userActions', 'sidebar') }
  get showDrawerLogo() { return this.isDrawerMode && this.showLogo }
  get showDrawerMenu() { return this.isDrawerMode }
  get showDrawerUserActions() { return this.isDrawerMode }

  // 设置方法
  setPosition(component: keyof ComponentPosition, position: 'header' | 'sidebar') {
    if (this.isDrawerMode) {
      // 抽屉模式下不允许改变位置
      return
    }
    this.positions[component] = position
    localStorage.setItem(`${component}Position`, position)
  }

  setLayoutMode = (mode: LayoutMode) => {
    this.layoutMode = mode
    localStorage.setItem('layoutMode', mode)
    this.resetDrawerState()
  }

  toggleShowLogo = () => {
    this.showLogo = !this.showLogo
    localStorage.setItem('showLogo', String(this.showLogo))
  }

  // 清理方法
  dispose() {
    window.removeEventListener('resize', this.initViewportListener)
  }

  // 抽屉控制方法
  toggleDrawer = (drawerName: 'setting' | 'sidebar') => {
    if (drawerName === 'setting') {
      this.settingDrawerVisible = !this.settingDrawerVisible
    } else if (drawerName === 'sidebar' && this.isDrawerMode) {
      this.drawerVisible = !this.drawerVisible
    }
  }
  // 侧边栏控制方法
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

  // 添加新的方法
  handleSidebarToggle = () => {
    if (this.isDrawerMode) {
      this.toggleDrawer('sidebar')
    } else {
      this.toggleSidebar()
    }
  }

  // 主题相关方法
  setThemeStyle = (style: ThemeStyle) => {
    this.themeStyle = style
    document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
    document.documentElement.classList.add(`theme-${style}`)
    localStorage.setItem('themeStyle', style)
  }

  setThemeMode = (mode: ThemeMode) => {
    this.themeMode = mode
    localStorage.setItem('themeMode', mode)
    this.updateThemeMode()
  }

  toggleDarkMode = () => {
    this.isDarkMode = !this.isDarkMode
    document.documentElement.classList.toggle('dark', this.isDarkMode)
    this.setThemeAlgorithm(this.isDarkMode)
  }

  private updateThemeMode = () => {
    if (this.themeMode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.isDarkMode = isDark
    } else {
      this.isDarkMode = this.themeMode === 'dark'
    }
    document.documentElement.classList.toggle('dark', this.isDarkMode)
    this.setThemeAlgorithm(this.isDarkMode)
  }
}

export default new ConfigStore()
