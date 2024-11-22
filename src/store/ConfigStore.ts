import { makeAutoObservable } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import getGlobalConfig from '../config/GlobalConfig'

// 布局位标记（从左到右：UserActions、Menu、Logo）
export const LayoutFlags = {
    // 组件位置标记 (每个组件占用2位)
    USER_ACTIONS: 0b110000, // 位 5-4
    MENU: 0b001100, // 位 3-2
    LOGO: 0b000011, // 位 1-0

    // 位置标记 (每个组件的2位中)
    IN_SIDEBAR: 0b10, // 第二位
    IN_HEADER: 0b01, // 第一位
    MIX: 0b11, // 第一位和第二位都为1
    // 位移量
    USER_ACTIONS_SHIFT: 4,
    MENU_SHIFT: 2,
    LOGO_SHIFT: 0
} as const

// 预定义布局模式
export const LayoutModes = {
    VERTICAL: 0b010101, // UserActions、Menu、Logo 都在 header
    HORIZONTAL: 0b101010, // UserActions、Menu、Logo 都在 sidebar
    MIX: 0b101110  // UserActions、Menu、Logo 都在两个位置
} as const

export type LayoutMode = keyof typeof LayoutModes

// 主题模式类型
type ThemeMode = 'light' | 'dark' | 'system'

class ConfigStore {
    // 布局状态 (6位二进制，从左到右每2位分别控制 UserActions、Menu、Logo)
    private layoutState: number = LayoutModes.MIX

    // 主题配置
    themeStyle: 'dynamic' | 'classic' = getGlobalConfig('DefaultThemeStyle')
    themeMode: ThemeMode = 'system'

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
            this.layoutState = LayoutModes.MIX
        }

        // 初始化主题风格
        const savedThemeStyle = localStorage.getItem('themeStyle')
        if (savedThemeStyle === 'dynamic' || savedThemeStyle === 'classic') {
            this.setThemeStyle(savedThemeStyle)
        } else {
            this.setThemeStyle(this.themeStyle) // 使用默认值初始化
        }

        // 初始化主题模式
        const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode
        if (savedThemeMode) {
            this.setThemeMode(savedThemeMode)
        } else {
            this.setThemeMode('system')
        }

        // 初始化标签页显示
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
            if (this.themeMode === 'system') {
                this.updateThemeMode()
            }
        }

        darkModeMediaQuery.addEventListener('change', handleThemeChange)
        handleThemeChange(darkModeMediaQuery)

        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }

    // 更新主题模式
    private updateThemeMode = () => {
        const isDark = this.themeMode === 'dark' || 
            (this.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        document.documentElement.classList.toggle('dark', isDark)
        this.updateThemeAlgorithm(isDark)
    }

    // 更新主题算法
    private updateThemeAlgorithm = (isDark: boolean) => {
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

    /**
     * 设置组件在指定位置的显示状态
     * @param component - 要设置的组件（'MENU' | 'LOGO' | 'USER_ACTIONS'）
     * @param position - 要设置的位置（'IN_HEADER' | 'IN_SIDEBAR'）
     * 
     * 实现原理：
     * 1. 获取组件的位移量（每个组件占用2位）
     * 2. 获取位置的位标记（IN_HEADER: 01, IN_SIDEBAR: 10）
     * 3. 创建掩码，用于清除原有位置信息
     * 4. 将新的位值设置到对应位置
     * 
     * 示例：
     * MENU 组件（占用第3、4位）设置为 header 位置
     * 原状态：      00|10|00 (MENU在sidebar显示)
     * 掩码：        11|00|11
     * 新位值：      00|01|00 (MENU改为在header显示)
     */
    toggleComponentPosition = (
        component: keyof typeof LayoutFlags,
        position: 'IN_HEADER' | 'IN_SIDEBAR'
    ) => {
        // 获取组件的位移量
        const shift = LayoutFlags[`${component}_SHIFT`]
        // 获取位置的位标记
        const positionBit = LayoutFlags[position]
        // 创建掩码 (11 << shift)
        const mask = 0b11 << shift
        // 设置新的位值
        this.layoutState = (this.layoutState & ~mask) | (positionBit << shift)
        console.log(this.layoutState)
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

    // toggleDarkMode = () => {
    //     this.isDarkMode = !this.isDarkMode
    //     // 更新 DOM 类名
    //     document.documentElement.classList.toggle('dark', this.isDarkMode)
    //     localStorage.setItem('darkMode', String(this.isDarkMode))
    // }

    // 设置主题模式
    setThemeMode = (mode: ThemeMode) => {
        this.themeMode = mode
        localStorage.setItem('themeMode', mode)
        this.updateThemeMode()
    }

    // 计算属性 - 主题配置
    get themeConfig(): ThemeConfig {
        const isDark = this.themeMode === 'dark' || 
            (this.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        return {
            token: this.themeToken,
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }
    }

    // 计算属性 - 是否暗色模式
    get isDark(): boolean {
        return this.themeMode === 'dark' || 
            (this.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
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

    // 计算属性 - 否显示 Header
    get showHeader(): boolean {
        if (this.isDrawerMode) {
            return false
        }
        return this.showHeaderLogo || 
               this.showHeaderMenu || 
               this.showHeaderUserActions
    }

    // 计算属性 - 是否显示 Sidebar
    get showSidebar(): boolean {
        // // 抽屉模式下，如果有任何组件需要在侧边显示，就显示抽屉
        if (this.isDrawerMode) {
            return this.drawerVisible && (
                this.showSidebarLogo ||
                this.showSidebarMenu ||
                this.showSidebarUserActions
            )
        }

        // 非抽屉模式下，如果有任何组件需要在侧边显示，就显示侧边栏
        return this.showSidebarLogo ||
               this.showSidebarMenu ||
               this.showSidebarUserActions
    }

    // 获取组件在当前布局下的位置
    getComponentPosition(component: keyof typeof LayoutFlags): 'IN_HEADER' | 'IN_SIDEBAR' | 'MIX' | undefined {
        const shift = LayoutFlags[`${component}_SHIFT`]
        const componentBits = (this.layoutState & (0b11 << shift)) >> shift
        // console.log(component,componentBits)
        // 检查组件在 header 和 sidebar 的显示状态
        const inHeader = (componentBits & LayoutFlags.IN_HEADER) !== 0
        const inSidebar = (componentBits & LayoutFlags.IN_SIDEBAR) !== 0
        // console.log(component,inHeader,inSidebar)
        if (inHeader && inSidebar) return 'MIX'
        if (inHeader) return 'IN_HEADER'
        if (inSidebar) return 'IN_SIDEBAR'
        return 
        // return 'none'
    }
}

export default new ConfigStore()
