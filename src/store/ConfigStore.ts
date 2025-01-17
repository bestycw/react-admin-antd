import { makeAutoObservable, runInAction } from 'mobx'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import getGlobalConfig from '../config/GlobalConfig'
import { configStorage } from '@/utils/storage/configStorage'
import {
    type IConfigStore,
    type ThemeMode,
    type ThemeStyle,
    type LayoutMode,
    type ComponentPosition,
    type PresetColor,
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

// 预设主题色配置
const PRESET_COLORS: PresetColor[] = [
    {
        name: '拂晓蓝（默认）',
        color: '#1890ff',
        description: '拂晓蓝代表包容、科技、普惠'
    },
    {
        name: '薄暮红',
        color: '#f5222d',
        description: '薄暮红代表热情、活力、警示'
    },
    {
        name: '极光绿',
        color: '#52c41a',
        description: '极光绿代表希望、生机、健康'
    },
    {
        name: '日暮橙',
        color: '#faad14',
        description: '日暮橙代表温暖、愉悦、活力'
    },
    {
        name: '酱紫',
        color: '#722ed1',
        description: '酱紫代表高贵、浪漫、优雅'
    }
];

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
    isActionsCollapsed: boolean = false
    searchVisible: boolean = false

    // 预设主题色相关
    presetColors = PRESET_COLORS
    currentPresetColor: string

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.currentPresetColor = configStorage.getPresetColor(PRESET_COLORS[0].color)
        this.initConfig()
    }

    // 初始化配置
    private initConfig() {
        // 初始化布局状态
        this.layoutState = configStorage.getLayoutState(LayoutModes.MIX)

        // 初始化主题相关
        this.setThemeStyle(configStorage.getThemeStyle(this.themeStyle))
        this.setThemeMode(configStorage.getThemeMode(this.themeMode))

        // 初始化 UI 状态
        this.showTabs = configStorage.getShowTabs(true)
        this.sidebarCollapsed = configStorage.getSidebarCollapsed(false)
        this.drawerVisible = configStorage.getDrawerVisible(false)
        this.settingDrawerVisible = configStorage.getSettingDrawerVisible(false)
        this.isActionsCollapsed = configStorage.getActionsCollapsed(false)

        // 初始化监听器
        this.initViewportListener()
        this.initSystemTheme()

        // 初始化主题色
        const savedColor = configStorage.getPresetColor(PRESET_COLORS[0].color)
        this.setPresetColor(savedColor)
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

    get themeConfig(): ThemeConfig {
        return {
            token: this.themeToken,
            algorithm: this.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
        };
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
        configStorage.setThemeMode(mode)
        this.updateThemeMode()
    }

    setThemeStyle(style: ThemeStyle) {
        this.themeStyle = style
        configStorage.setThemeStyle(style)
        document.documentElement.classList.remove('theme-dynamic', 'theme-classic')
        document.documentElement.classList.add(`theme-${style}`)
    }

    setLayoutMode(mode: LayoutMode) {
        this.layoutState = LayoutModes[mode]
        configStorage.setLayoutState(this.layoutState)
    }

    toggleTabs() {
        this.showTabs = !this.showTabs
        configStorage.setShowTabs(this.showTabs)
    }

    toggleComponentPosition(
        component: keyof typeof LayoutFlags,
        position: ComponentPosition
    ) {
        const shift = LayoutFlags[`${component}_SHIFT` as keyof typeof LayoutFlags]
        const positionBit = LayoutFlags[position]
        const mask = 0b11 << shift
        this.layoutState = (this.layoutState & ~mask) | (positionBit << shift)
        configStorage.setLayoutState(this.layoutState)
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
        configStorage.setLayoutState(this.layoutState)
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
        configStorage.clearConfig()
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
                this.layoutState = LayoutModes.HORIZONTAL
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
                    configStorage.setDrawerVisible(this.drawerVisible)
                } else {
                    // 正常模式：控制折叠状态
                    this.sidebarCollapsed = visible ?? !this.sidebarCollapsed
                    configStorage.setSidebarCollapsed(this.sidebarCollapsed)
                }
                break
            case 'setting':
                // 设置抽屉显隐
                this.settingDrawerVisible = visible ?? !this.settingDrawerVisible
                configStorage.setSettingDrawerVisible(this.settingDrawerVisible)
                break
        }
    }

    // 切换用户操作区域的折叠状态
    toggleActionsCollapsed = (isShow:boolean) => {
        this.isActionsCollapsed = isShow
        configStorage.setActionsCollapsed(this.isActionsCollapsed)
    }

    // 切换搜索弹窗显示状态
    toggleSearchVisible = (visible?: boolean) => {
        this.searchVisible = visible ?? !this.searchVisible
    }

    // 设置预设主题色
    setPresetColor(color: string) {
        this.currentPresetColor = color
        this.themeToken = {
            colorPrimary: color,
            borderRadius: this.themeToken.borderRadius,
        }
        configStorage.setPresetColor(color)
    }
}

export default new ConfigStore()


