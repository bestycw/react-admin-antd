import { makeAutoObservable, runInAction } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import getGlobalConfig from '../config/GlobalConfig'

// 布局位标记（从左到右：UserActions、Menu、Logo）
export const LayoutFlags = {
    // 组件位置标记 (每个组件占用2位)
    USER_ACTIONS: 0b110000, // 位 5-4
    MENU:        0b001100, // 位 3-2
    LOGO:        0b000011, // 位 1-0

    // 位置标记 (每个组件的2位中)
    IN_SIDEBAR:  0b10, // 第二位
    IN_HEADER:   0b01, // 第一位

    // 位移量
    USER_ACTIONS_SHIFT: 4,
    MENU_SHIFT: 2,
    LOGO_SHIFT: 0
} as const

// 预定义布局模式
export const LayoutModes = {
    VERTICAL:   0b010101, // UserActions、Menu、Logo 都在 header
    HORIZONTAL: 0b101010, // UserActions、Menu、Logo 都在 sidebar
    MIX:        0b111111  // UserActions、Menu、Logo 都在两个位置
} as const

export type LayoutMode = keyof typeof LayoutModes

class ConfigStore {
    // 布局状态 (6位二进制，从左到右每2位分别控制 UserActions、Menu、Logo)
    private layoutState: number = LayoutModes.MIX

    // 主题配置
    themeStyle: 'dynamic' | 'classic' = getGlobalConfig('DefaultThemeStyle')
    isDarkMode: boolean = getGlobalConfig('DefaultDarkMode')
    
    // 其他状态
    sidebarCollapsed: boolean = false
    isDrawerMode: boolean = false
    drawerVisible: boolean = false
    settingDrawerVisible: boolean = false
    showTabs: boolean = true

    // 主题相关状态
    private themeToken = {
        colorPrimary: getGlobalConfig('DefaultColorPrimary'),
        borderRadius: getGlobalConfig('DefaultBorderRadius'),
    }

    constructor() {
        makeAutoObservable(this)
        this.initConfig()
    }

    private initConfig() {
        // 从本地存储加载配置
        const savedState = localStorage.getItem('layoutState')
        if (savedState && !isNaN(Number(savedState))) {
            this.layoutState = Number(savedState)
        } else {
            // 设置默认布局模式
            this.layoutState = LayoutModes.MIX // 使用默认的混合布局
        }

        // 从本地存储加载其他配置
        const savedThemeStyle = localStorage.getItem('themeStyle')
        if (savedThemeStyle === 'dynamic' || savedThemeStyle === 'classic') {
            this.themeStyle = savedThemeStyle
        }

        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode !== null) {
            this.isDarkMode = savedDarkMode === 'true'
        }

        const savedShowTabs = localStorage.getItem('showTabs')
        if (savedShowTabs !== null) {
            this.showTabs = savedShowTabs === 'true'
        }

        // 初始化响应式布局
        this.initViewportListener()
        // 初始化系统主题监听
        this.initSystemTheme()
    }

    // 初始化视口监听器
    private initViewportListener = () => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 768) {
                this.isDrawerMode = true
                this.drawerVisible = false
                this.sidebarCollapsed = false
            } else {
                this.isDrawerMode = false
                this.sidebarCollapsed = width < 1024
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize() // 初始化时执行一次

        // 返回清理函数
        return () => window.removeEventListener('resize', handleResize)
    }

    // 初始化系统主题监听
    private initSystemTheme = () => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
            this.isDarkMode = e.matches
            document.documentElement.classList.toggle('dark', this.isDarkMode)
            this.updateThemeAlgorithm()
        }

        darkModeMediaQuery.addEventListener('change', handleThemeChange)
        handleThemeChange(darkModeMediaQuery) // 初始化时执行一次

        // 返回清理函数
        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }

    // 更新主题算法
    private updateThemeAlgorithm() {
        this.themeToken = {
            colorPrimary: getGlobalConfig('DefaultColorPrimary'),
            borderRadius: getGlobalConfig('DefaultBorderRadius'),
        }
    }

    // 侧边栏控制
    handleSidebarToggle = () => {
        if (this.isDrawerMode) {
            this.drawerVisible = !this.drawerVisible
        } else {
            this.sidebarCollapsed = !this.sidebarCollapsed
            localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
        }
    }

    // 标签页控制
    toggleTabs = () => {
        this.showTabs = !this.showTabs
        localStorage.setItem('showTabs', String(this.showTabs))
    }

    // 抽屉控制
    toggleDrawer = (type: 'setting' | 'sidebar') => {
        if (type === 'setting') {
            this.settingDrawerVisible = !this.settingDrawerVisible
        } else if (type === 'sidebar' && this.isDrawerMode) {
            this.drawerVisible = !this.drawerVisible
        }
    }

    // 布局模式控制
    setLayoutMode = (mode: LayoutMode) => {
        this.layoutState = LayoutModes[mode]
        localStorage.setItem('layoutState', String(this.layoutState))
    }

    // 组件位置控制
    toggleComponentPosition = (
        component: keyof typeof LayoutFlags,
        position: 'IN_HEADER' | 'IN_SIDEBAR'
    ) => {
        const shift = LayoutFlags[`${component}_SHIFT`]
        const positionBit = LayoutFlags[position]
        const mask = 0b11 << shift
        const currentBits = (this.layoutState & mask) >> shift
        const newBits = currentBits ^ positionBit
        this.layoutState = (this.layoutState & ~mask) | (newBits << shift)
        localStorage.setItem('layoutState', String(this.layoutState))
    }

    // 主题控制方法
    setThemeStyle = (style: 'dynamic' | 'classic') => {
        this.themeStyle = style
        // 更新 DOM 类名
        document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
        document.documentElement.classList.add(`theme-${style}`)
        localStorage.setItem('themeStyle', style)
    }

    toggleDarkMode = () => {
        this.isDarkMode = !this.isDarkMode
        // 更新 DOM 类名
        document.documentElement.classList.toggle('dark', this.isDarkMode)
        localStorage.setItem('darkMode', String(this.isDarkMode))
    }

    // 计算属性 - 主题配置
    get themeConfig(): ThemeConfig {
        const isDynamic = this.themeStyle === 'dynamic'
        return {
            token: this.themeToken,
            algorithm: this.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            components: isDynamic ? {
                Menu: {
                    itemBg: 'transparent',
                    subMenuItemBg: 'transparent',
                    itemSelectedBg: 'transparent',
                },
                Layout: {
                    bodyBg: 'transparent',
                    headerBg: 'transparent',
                    siderBg: 'transparent',
                }
            } : undefined
        }
    }

    // 组件显示状态
    get showHeaderLogo() { return this.checkComponentPosition('LOGO', 'IN_HEADER') }
    get showSidebarLogo() { return this.checkComponentPosition('LOGO', 'IN_SIDEBAR') }
    get showHeaderMenu() { return this.checkComponentPosition('MENU', 'IN_HEADER') }
    get showSidebarMenu() { return this.checkComponentPosition('MENU', 'IN_SIDEBAR') }
    get showHeaderUserActions() { return this.checkComponentPosition('USER_ACTIONS', 'IN_HEADER') }
    get showSidebarUserActions() { return this.checkComponentPosition('USER_ACTIONS', 'IN_SIDEBAR') }

    private checkComponentPosition(
        component: keyof typeof LayoutFlags,
        position: 'IN_HEADER' | 'IN_SIDEBAR'
    ): boolean {
        const shift = LayoutFlags[`${component}_SHIFT`]
        const positionBit = LayoutFlags[position]
        const componentBits = (this.layoutState & (0b11 << shift)) >> shift
        return (componentBits & positionBit) !== 0
    }

    get currentLayoutMode(): LayoutMode {
        switch (this.layoutState) {
            case LayoutModes.VERTICAL:
                return 'VERTICAL'
            case LayoutModes.HORIZONTAL:
                return 'HORIZONTAL'
            default:
                return 'MIX'
        }
    }
}

export default new ConfigStore()
