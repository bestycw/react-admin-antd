export type PermissionControlType = 'backend' | 'fontend' | 'mix'
export type ThemeStyle = 'dynamic' | 'classic'
export type LayoutMode = 'vertical' | 'horizontal' | 'mix'
export type MenuPosition = 'header' | 'sidebar' | 'mix'
export type HeaderPosition = 'fixed' | 'static'

export interface GlobalConfigType {
    // 系统基础配置
    AdminName: string
    ApiUrl: string
    PermissionControl: PermissionControlType
    
    // 主题默认配置
    DefaultColorPrimary: string
    DefaultBorderRadius: number
    DefaultDarkMode: boolean
    DefaultThemeStyle: ThemeStyle
    
    // 布局默认配置
    DefaultLayoutMode: LayoutMode
    DefaultShowTabs: boolean
    DefaultShowBreadcrumb: boolean
    DefaultShowFooter: boolean
    DefaultMenuPosition: MenuPosition
    DefaultHeaderPosition: HeaderPosition
    DefaultSidebarCollapsed: boolean
    DefaultShowLogo: boolean
    RequestType: 'axios' | 'fetch'
}

const GlobalConfig: GlobalConfigType = {
    // 系统基础配置
    AdminName: 'Coffee Admin',
    ApiUrl: import.meta.env.VITE_API_URL || '/',
    PermissionControl: 'backend',
    
    // 主题默认配置
    DefaultColorPrimary: '#1677ff',
    DefaultBorderRadius: 6,
    DefaultDarkMode: false,
    DefaultThemeStyle: 'dynamic',
    
    // 布局默认配置
    DefaultLayoutMode: 'mix',
    DefaultShowTabs: true,
    DefaultShowBreadcrumb: true,
    DefaultShowFooter: true,
    DefaultMenuPosition: 'mix',
    DefaultHeaderPosition: 'fixed',
    DefaultShowLogo: true,
    DefaultSidebarCollapsed: false,
    RequestType: 'axios'
}

 function getGlobalConfig<T extends keyof GlobalConfigType>(key: T): GlobalConfigType[T] {
    return GlobalConfig[key]
}

export default getGlobalConfig