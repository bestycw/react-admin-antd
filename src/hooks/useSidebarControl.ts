import { useStore } from '@/store'
import { useCallback, useMemo } from 'react'

export const useSidebarControl = () => {
  const { ConfigStore } = useStore()

  // 基础状态
  const isCollapsed = ConfigStore.sidebarCollapsed
  const isDrawerMode = ConfigStore.isDrawerMode
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  const drawerVisible = ConfigStore.drawerVisible

  // 折叠状态控制
  const getCollapsedState = useCallback((component: 'menu' | 'logo' | 'userActions') => {
    if (isDrawerMode) return false
    return isCollapsed
  }, [isDrawerMode, isCollapsed])

  // 切换按钮控制
  const handleToggle = useCallback(() => {
    if (isDrawerMode) {
      ConfigStore.toggleDrawer()
    } else {
      ConfigStore.toggleSidebar()
    }
  }, [isDrawerMode, ConfigStore])

  // 按钮样式
  const toggleButtonClass = useMemo(() => `
    absolute -right-4 top-1/2 -translate-y-1/2
    w-8 h-8 flex items-center justify-center
    rounded-full
    transition-all duration-300 ease-in-out
    ${isDrawerMode ? 'fixed left-0 opacity-100' : 'opacity-0 group-hover:opacity-100'}
    z-50
    ${isDynamic 
      ? 'bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur-md' 
      : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
    }
    shadow-lg
    border border-black/[0.02] dark:border-white/[0.02]
    hover:scale-110
    cursor-pointer
  `, [isDrawerMode, isDynamic])

  return {
    // 状态
    isCollapsed,
    isDrawerMode,
    isDynamic,
    drawerVisible,
    
    // 方法
    getCollapsedState,
    handleToggle,
    closeDrawer: ConfigStore.closeDrawer,
    
    // 样式
    toggleButtonClass,
  }
} 