import { makeAutoObservable } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import getGlobalConfig from '../config/GlobalConfig'

// 布局位标记（从左到右：UserActions、Menu、Logo）
const LayoutBits = {
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
const LayoutModes = {
    VERTICAL:   0b010101, // UserActions、Menu、Logo 都在 header
    HORIZONTAL: 0b101010, // UserActions、Menu、Logo 都在 sidebar
    MIX:        0b111111  // UserActions、Menu、Logo 都在两个位置
} as const

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

    constructor() {
        makeAutoObservable(this)
        this.initConfig()
    }

    private initConfig() {
        // 从本地存储加载配置
        const savedState = localStorage.getItem('layoutState')
        if (savedState) {
            this.layoutState = Number(savedState)
        }
    }

    // 设置布局模式
    setLayoutMode(mode: keyof typeof LayoutModes) {
        this.layoutState = LayoutModes[mode]
        this.saveConfig()
    }

    // 切换组件在某个位置的显示状态
    toggleComponentPosition(
        component: keyof typeof LayoutBits, 
        position: 'IN_SIDEBAR' | 'IN_HEADER'
    ) {
        const shift = LayoutBits[`${component}_SHIFT`]
        const positionBit = LayoutBits[position]
        const mask = 0b11 << shift
        const currentBits = (this.layoutState & mask) >> shift
        
        // 切换指定位置的位
        const newBits = currentBits ^ positionBit
        
        // 更新状态
        this.layoutState = (this.layoutState & ~mask) | (newBits << shift)
        this.saveConfig()
    }

    // 保存配置
    private saveConfig() {
        localStorage.setItem('layoutState', String(this.layoutState))
    }

    // 检查组件在指定位置是否显示
    private checkComponentPosition(
        component: keyof typeof LayoutBits,
        position: 'IN_SIDEBAR' | 'IN_HEADER'
    ): boolean {
        const shift = LayoutBits[`${component}_SHIFT`]
        const positionBit = LayoutBits[position]
        const componentBits = (this.layoutState & (0b11 << shift)) >> shift
        return (componentBits & positionBit) !== 0
    }

    // 计算属性 - 组件显示状态
    get showHeaderLogo() { return this.checkComponentPosition('LOGO', 'IN_HEADER') }
    get showSidebarLogo() { return this.checkComponentPosition('LOGO', 'IN_SIDEBAR') }
    get showHeaderMenu() { return this.checkComponentPosition('MENU', 'IN_HEADER') }
    get showSidebarMenu() { return this.checkComponentPosition('MENU', 'IN_SIDEBAR') }
    get showHeaderUserActions() { return this.checkComponentPosition('USER_ACTIONS', 'IN_HEADER') }
    get showSidebarUserActions() { return this.checkComponentPosition('USER_ACTIONS', 'IN_SIDEBAR') }

    // 获取当前布局模式
    get currentLayoutMode(): keyof typeof LayoutModes {
        switch (this.layoutState) {
            case LayoutModes.VERTICAL:
                return 'VERTICAL'
            case LayoutModes.HORIZONTAL:
                return 'HORIZONTAL'
            default:
                return 'MIX'
        }
    }

    // 主题相关方法
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode
        this.saveConfig()
    }

    setThemeStyle(style: 'dynamic' | 'classic') {
        this.themeStyle = style
        this.saveConfig()
    }

    // 获取主题配置
    get themeConfig(): ThemeConfig {
        return {
            token: {
                colorPrimary: getGlobalConfig('DefaultColorPrimary'),
                borderRadius: getGlobalConfig('DefaultBorderRadius'),
            },
            algorithm: this.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }
    }

    // 抽屉控制
    toggleDrawer(type: 'setting' | 'sidebar') {
        if (type === 'setting') {
            this.settingDrawerVisible = !this.settingDrawerVisible
        } else if (type === 'sidebar' && this.isDrawerMode) {
            this.drawerVisible = !this.drawerVisible
        }
    }

    // 侧边栏控制
    toggleSidebar() {
        if (!this.isDrawerMode) {
            this.sidebarCollapsed = !this.sidebarCollapsed
            localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
        }
    }
}

export default new ConfigStore()
