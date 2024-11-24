import { makeAutoObservable, runInAction } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig as AntdThemeConfig } from 'antd'
import getGlobalConfig from '../config/GlobalConfig'
import StorageManager from '../utils/storageManager'
import {
    type IConfigStore,
    type ThemeMode,
    type ThemeStyle,
    type LayoutMode,
    type StorageKey,
    type ComponentPosition,
    STORAGE_KEYS
} from '../types/config'

// 布局位标记（从左到右：UserActions、Menu、Logo）
export const LayoutFlags = {
    // 组件位置标记 (每个组件占用2位)
    USER_ACTIONS: 0b110000, // 位 5-4
    MENU: 0b001100, // 位 3-2
    LOGO: 0b000011, // 位 1-0

    // 位置标记 (每个组件的2位中)
    IN_SIDEBAR: 0b10, // 第二位
    IN_HEADER: 0b01, // 第一位
    MIX: 0b11, // 两个位置都显示
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

// 抽屉类型
type DrawerType = 'setting' | 'sidebar'

class ConfigStore implements IConfigStore {
    // 布局状态
    private layoutState: number = LayoutModes.MIX

    // 主题相关状态
    themeStyle: ThemeStyle = getGlobalConfig('DefaultThemeStyle')
    themeMode: ThemeMode = 'system'
    private themeToken = {
        colorPrimary: getGlobalConfig('DefaultColorPrimary'),
        borderRadius: getGlobalConfig('DefaultBorderRadius'),
    }

    // UI 状态
    showTabs: boolean = true
    sidebarCollapsed: boolean = false
    isDrawerMode: boolean = false
    drawerVisible: boolean = false
    settingDrawerVisible: boolean = false

    // 用户操作区域的折叠状态
    isActionsCollapsed: boolean = false

    // 搜索弹窗状态
    searchVisible: boolean = false

    isDarkMode = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.initConfig()
    }

    // 存储操作封装
    private storage = {
        get: <T>(key: StorageKey, defaultValue: T) =>
            StorageManager.get(STORAGE_KEYS[key], defaultValue),
        set: <T>(key: StorageKey, value: T) =>
            StorageManager.set(STORAGE_KEYS[key], value),
        remove: (key: StorageKey) =>
            StorageManager.remove(STORAGE_KEYS[key])
    }

    // 初始化配置
    private initConfig() {
        // 初始化布局状态
        this.layoutState = this.storage.get('LAYOUT_STATE', LayoutModes.MIX)

        // 初始化主题相关
        this.setThemeStyle(this.storage.get('THEME_STYLE', this.themeStyle))
        this.setThemeMode(this.storage.get('THEME_MODE', this.themeMode))

        // 初始化 UI 状态
        this.showTabs = this.storage.get('SHOW_TABS', true)
        this.sidebarCollapsed = this.storage.get('SIDEBAR_COLLAPSED', false)

        // 初始化监听器
        this.initViewportListener()
        this.initSystemTheme()
    }

    // 计算属性
    get isDark(): boolean {
        return this.themeMode === 'dark' ||
            (this.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
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

    get themeConfig(): AntdThemeConfig {
        return {
            token: this.themeToken,
            algorithm: this.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }
    }

    // 布局相关计算属性
    get showHeader(): boolean {
        return !this.isDrawerMode && (
            this.showHeaderLogo ||
            this.showHeaderMenu ||
            this.showHeaderUserActions
        )
    }

    get showSidebar(): boolean {
        if (this.isDrawerMode) {
            return this.drawerVisible && (
                this.showSidebarLogo ||
                this.showSidebarMenu ||
                this.showSidebarUserActions
            )
        }
        return this.showSidebarLogo ||
            this.showSidebarMenu ||
            this.showSidebarUserActions
    }

    // 组件显示状态
    get showHeaderLogo() { return this.checkComponentPosition('LOGO', 'IN_HEADER') }
    get showSidebarLogo() { return this.checkComponentPosition('LOGO', 'IN_SIDEBAR') }
    get showHeaderMenu() { return this.checkComponentPosition('MENU', 'IN_HEADER') }
    get showSidebarMenu() { return this.checkComponentPosition('MENU', 'IN_SIDEBAR') }
    get showHeaderUserActions() { return this.checkComponentPosition('USER_ACTIONS', 'IN_HEADER') }
    get showSidebarUserActions() { return this.checkComponentPosition('USER_ACTIONS', 'IN_SIDEBAR') }
    get showLogo() { return this.showHeaderLogo || this.showSidebarLogo }

    // 方法实现
    setThemeMode(mode: ThemeMode) {
        this.themeMode = mode
        this.storage.set('THEME_MODE', mode)
        this.updateThemeMode()
    }

    setThemeStyle(style: ThemeStyle) {
        this.themeStyle = style
        this.storage.set('THEME_STYLE', style)
        document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
        document.documentElement.classList.add(`theme-${style}`)
    }

    setLayoutMode(mode: LayoutMode) {
        this.layoutState = LayoutModes[mode]
        this.storage.set('LAYOUT_STATE', this.layoutState)
    }

    toggleTabs() {
        this.showTabs = !this.showTabs
        this.storage.set('SHOW_TABS', this.showTabs)
    }



    toggleComponentPosition(
        component: keyof typeof LayoutFlags,
        position: ComponentPosition
    ) {
        const shift = LayoutFlags[`${component}_SHIFT` as keyof typeof LayoutFlags]
        const positionBit = LayoutFlags[position]
        const mask = 0b11 << shift
        this.layoutState = (this.layoutState & ~mask) | (positionBit << shift)
        this.storage.set('LAYOUT_STATE', this.layoutState)
    }

    toggleComponentShow(
        component: keyof typeof LayoutFlags,
        isShow: boolean
    ) {
        const shift = LayoutFlags[`${component}_SHIFT` as keyof typeof LayoutFlags]
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
                    newBits = 0b10 // 在两个位置都显示
                    break
            }
        }
        if (this.isDrawerMode) {
            newBits = 0b10
        }
        this.layoutState = (this.layoutState & ~mask) | (newBits << shift)
        StorageManager.set(STORAGE_KEYS.LAYOUT_STATE, this.layoutState)
    }
    // 获取组件在当前布局下的位置
    getComponentPosition(component: keyof typeof LayoutFlags): ComponentPosition {
        const shift = LayoutFlags[`${component}_SHIFT` as keyof typeof LayoutFlags]
        const componentBits = (this.layoutState & (0b11 << shift)) >> shift

        const inHeader = (componentBits & LayoutFlags.IN_HEADER) !== 0
        const inSidebar = (componentBits & LayoutFlags.IN_SIDEBAR) !== 0
        if (inHeader && inSidebar) return 'MIX'
        if (inHeader) return 'IN_HEADER'
        if (inSidebar) return 'IN_SIDEBAR'
        // return
        return 'MIX'
    }

    clearConfig() {
        Object.keys(STORAGE_KEYS).forEach(key =>
            this.storage.remove(key as StorageKey)
        )
    }

    // 私有方法
    private checkComponentPosition(
        component: keyof typeof LayoutFlags,
        position: ComponentPosition
    ): boolean {
        const shift = LayoutFlags[`${component}_SHIFT`as keyof typeof LayoutFlags]
        const positionBit = LayoutFlags[position]
        const componentBits = (this.layoutState & (0b11 << shift)) >> shift
        return (componentBits & positionBit) !== 0
    }

    private updateThemeMode() {
        document.documentElement.classList.toggle('dark', this.isDark)
    }

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

        window.addEventListener('resize', () => {
            runInAction(() => handleResize())
        })
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }

    private initSystemTheme = () => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleThemeChange = () => {
            if (this.themeMode === 'system') {
                this.updateThemeMode()
            }
        }

        darkModeMediaQuery.addEventListener('change', handleThemeChange)
        handleThemeChange()

        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }

    /**
     * 统一控制显示隐藏
     * @param type - 控制类型：'setting' | 'sidebar'
     * @param visible - 是否显示，不传则切换状态
     * 
     * 处理逻辑：
     * 1. sidebar: 
     *    - 抽屉模式：控制抽屉显隐
     *    - 正常模式：控制折叠状态
     * 2. setting: 控制设置抽屉显隐
     */
    toggleVisible = (type: DrawerType, visible?: boolean) => {
        switch (type) {
            case 'sidebar':
                if (this.isDrawerMode) {
                    // 抽屉模式：控制抽屉显隐
                    this.drawerVisible = visible ?? !this.drawerVisible
                    this.storage.set('DRAWER_VISIBLE', this.drawerVisible)
                } else {
                    // 正常模式：控制折叠状态
                    this.sidebarCollapsed = visible ?? !this.sidebarCollapsed
                    this.storage.set('SIDEBAR_COLLAPSED', this.sidebarCollapsed)
                }
                break
            case 'setting':
                // 设置抽屉显隐
                this.settingDrawerVisible = visible ?? !this.settingDrawerVisible
                this.storage.set('SETTING_DRAWER_VISIBLE', this.settingDrawerVisible)
                break
        }
    }

    // 切换用户操作区域的折叠状态
    toggleActionsCollapsed = (isShow:boolean) => {
        this.isActionsCollapsed = isShow
        this.storage.set('ACTIONS_COLLAPSED', this.isActionsCollapsed)
    }

    // 切换搜索弹窗显示状态
    toggleSearchVisible = (visible?: boolean) => {
        this.searchVisible = visible ?? !this.searchVisible
    }

    setDarkMode = (isDark: boolean) => {
        this.isDarkMode = isDark;
    };
}

export default new ConfigStore()


