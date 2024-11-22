import { makeAutoObservable } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import getGlobalConfig from '../config/GlobalConfig'
import StorageManager from '../utils/storageManager'
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

// 存储键定义
const STORAGE_KEYS = {
    LAYOUT_STATE: 'layoutState',
    THEME_MODE: 'themeMode',
    THEME_STYLE: 'themeStyle',
    SHOW_TABS: 'showTabs',
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
    DRAWER_VISIBLE: 'drawerVisible',
    SETTING_DRAWER_VISIBLE: 'settingDrawerVisible'
} as const

class ConfigStore {
    // 布局状态
    private layoutState: number = LayoutModes.MIX

    // 主题相关状态
    themeStyle: 'dynamic' | 'classic' = getGlobalConfig('DefaultThemeStyle')
    themeMode: ThemeMode = 'system'
    private themeToken = {
        colorPrimary: getGlobalConfig('DefaultColorPrimary'),
        borderRadius: getGlobalConfig('DefaultBorderRadius'),
    }

    // 其他状态
    showTabs: boolean = true
    sidebarCollapsed: boolean = false
    isDrawerMode: boolean = false
    drawerVisible: boolean = false
    settingDrawerVisible: boolean = false

    constructor() {
        makeAutoObservable(this)
        this.initConfig()
    }

    private initConfig() {
        // 初始化布局状态
        this.layoutState = StorageManager.get(
            STORAGE_KEYS.LAYOUT_STATE,
            LayoutModes.MIX
        )

        // 初始化主题风格
        const savedThemeStyle = StorageManager.get(
            STORAGE_KEYS.THEME_STYLE,
            getGlobalConfig('DefaultThemeStyle')
        )
        this.setThemeStyle(savedThemeStyle)

        // 初始化主题模式
        const savedThemeMode = StorageManager.get<ThemeMode>(
            STORAGE_KEYS.THEME_MODE,
            'system'
        )
        this.setThemeMode(savedThemeMode)

        // 初始化标签页显示
        this.showTabs = StorageManager.get(
            STORAGE_KEYS.SHOW_TABS,
            true
        )

        // 初始化侧边栏状态
        this.sidebarCollapsed = StorageManager.get(
            STORAGE_KEYS.SIDEBAR_COLLAPSED,
            false
        )

        // 初始化响应式布局和系统主题
        this.initViewportListener()
        this.initSystemTheme()
    }

    // 设置主题模式
    setThemeMode = (mode: ThemeMode) => {
        this.themeMode = mode
        StorageManager.set(STORAGE_KEYS.THEME_MODE, mode)
        this.updateThemeMode()
    }

    // 设置主题风格
    setThemeStyle = (style: 'dynamic' | 'classic') => {
        this.themeStyle = style
        StorageManager.set(STORAGE_KEYS.THEME_STYLE, style)
        document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
        document.documentElement.classList.add(`theme-${style}`)
    }

    // 切换标签页显示
    toggleTabs = () => {
        this.showTabs = !this.showTabs
        StorageManager.set(STORAGE_KEYS.SHOW_TABS, this.showTabs)
    }

    // 切换侧边栏折叠状态
    toggleSidebar = () => {
        if (!this.isDrawerMode) {
            this.sidebarCollapsed = !this.sidebarCollapsed
            StorageManager.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, this.sidebarCollapsed)
        }
    }

    // 切换组件位置
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
        // this.layoutState = (this.layoutState & ~mask) | (newBits << shift)
        StorageManager.set(STORAGE_KEYS.LAYOUT_STATE, this.layoutState)
    }

    // 切换组件显示状态
    toggleComponentShow = (
        component: keyof typeof LayoutFlags,
        isShow: boolean
    ) => {
        const shift = LayoutFlags[`${component}_SHIFT`]
        const mask = 0b11 << shift

        let newBits = 0b00
        if (isShow) {
            switch (this.currentLayoutMode) {
                case 'VERTICAL':
                    newBits = 0b01 // 只在 header 显示
                    break
                case 'HORIZONTAL':
                    newBits = 0b10 // 只在 sidebar 显示
                    break
                case 'MIX':
                    newBits = 0b11 // 在两个位置都显示
                    break
            }
        }
        if (this.isDrawerMode) {
            newBits = 0b10
        }
        this.layoutState = (this.layoutState & ~mask) | (newBits << shift)
        StorageManager.set(STORAGE_KEYS.LAYOUT_STATE, this.layoutState)
    }

    // 初始化视口监听器
    private initViewportListener = () => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 768) {
                this.isDrawerMode = true
                this.drawerVisible = false
                this.sidebarCollapsed = false
                this.setLayoutMode('HORIZONTAL')
            } else {
                this.isDrawerMode = false
                this.sidebarCollapsed = StorageManager.get(STORAGE_KEYS.SIDEBAR_COLLAPSED, width < 1024)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize() // 初始化时执行一次

        return () => window.removeEventListener('resize', handleResize)
    }

    // 初始化系统主题监听
    private initSystemTheme = () => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleThemeChange = () => {
            if (this.themeMode === 'system') {
                this.updateThemeMode()
            }
        }

        darkModeMediaQuery.addEventListener('change', handleThemeChange)
        handleThemeChange() // 初始化时执行一次

        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }

    // 更新主题模式
    private updateThemeMode = () => {
        const isDark = this.themeMode === 'dark' ||
            (this.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        document.documentElement.classList.toggle('dark', isDark)
        this.updateThemeAlgorithm()
    }

    // 更新主题算法
    private updateThemeAlgorithm = () => {
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

    // 抽屉控制
    toggleDrawer = (type: 'setting' | 'sidebar') => {
        if (type === 'setting') {
            this.settingDrawerVisible = !this.settingDrawerVisible
            StorageManager.set(STORAGE_KEYS.SETTING_DRAWER_VISIBLE, this.settingDrawerVisible)
        } else if (type === 'sidebar' && this.isDrawerMode) {
            this.drawerVisible = !this.drawerVisible
            StorageManager.set(STORAGE_KEYS.DRAWER_VISIBLE, this.drawerVisible)
        }
    }

    // 设置布局模式
    setLayoutMode = (mode: LayoutMode) => {
        this.layoutState = this.isDrawerMode ? LayoutModes.HORIZONTAL : LayoutModes[mode]
        StorageManager.set(STORAGE_KEYS.LAYOUT_STATE, this.layoutState)
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
    get showLogo() { return this.showHeaderLogo || this.showSidebarLogo }
    // get showTabs() { return this.showHeaderMenu || this.showSidebarMenu }
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
        // // 抽屉模式下，果有任何组件需要在侧边显示，就显示抽屉
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

        const inHeader = (componentBits & LayoutFlags.IN_HEADER) !== 0
        const inSidebar = (componentBits & LayoutFlags.IN_SIDEBAR) !== 0
        if (inHeader && inSidebar) return 'MIX'
        if (inHeader) return 'IN_HEADER'
        if (inSidebar) return 'IN_SIDEBAR'
        return
        // return 'none'
    }

    // 清除所有配置
    clearConfig = () => {
        Object.values(STORAGE_KEYS).forEach(key => {
            StorageManager.remove(key)
        })
    }
}

export default new ConfigStore()
