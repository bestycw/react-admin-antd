import { observer } from 'mobx-react-lite'
import Menu from './Menu'
import Logo from '@/components/Logo'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import CustomDrawer from '@/components/CustomDrawer'
import React, { useMemo } from 'react'
import { useStore } from '@/store'

const { Sider } = Layout

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const isCollapsed = ConfigStore.sidebarCollapsed
  const isDrawerMode = ConfigStore.isDrawerMode
  // const collapsed = ConfigStore.sidebarC1ollapsed
  const menuHeight = useMemo(() => {
    const logoHeight = ConfigStore.showSidebarLogo ? '64px' : '0px'
    const userActionsHeight = ConfigStore.showSidebarUserActions 
      ? (ConfigStore.isActionsCollapsed ? '48px' : '120px')
      : '0px'
    return `calc(100% - ${logoHeight} - ${userActionsHeight})`
  }, [
    ConfigStore.showSidebarLogo, 
    ConfigStore.showSidebarUserActions,
    ConfigStore.isActionsCollapsed
  ])
  // 折叠/抽屉 切换按钮
  // const buttonClass =   // 按钮样式
  const toggleButtonClass = useMemo(() => `
    absolute -right-4 top-1/2 -translate-y-1/2
    w-8 h-8 flex items-center justify-center
    rounded-full
    transition-all duration-300 ease-in-out
    ${isDrawerMode ? 'fixed left-0 opacity-100' : 'opacity-0 group-hover:opacity-100'}
    z-50
    shadow-lg
    border border-black/[0.02] dark:border-white/[0.02]
    hover:scale-110
    cursor-pointer
  `, [isDrawerMode])
  const toggleButton = (
    <button
      onClick={() => ConfigStore.toggleVisible('sidebar')}
      className={toggleButtonClass}
    >
      {(isDrawerMode && !ConfigStore.drawerVisible) || ConfigStore.sidebarCollapsed ? (
        <MenuUnfoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
      ) : (
        <MenuFoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
      )}
    </button>
  )
  const collapsed = isDrawerMode ? false : isCollapsed
  const Content = (
    <div className="theme-style flex flex-col h-full mr-0" style={{height:'calc(100% - var(--header-margin-height))'}}>
      {(ConfigStore.showSidebarLogo || isDrawerMode) && (
        <Logo 
          collapsed={collapsed}
          className="p-4 h-14 shrink-0" 
        />
      )}

      <div className="flex-1 overflow-auto py-4" style={{height:menuHeight}}>
        <Menu 
          mode="inline" 
          collapsed={collapsed}
        />
      </div>

      {(ConfigStore.showSidebarUserActions || isDrawerMode) && (
        <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
          <div className="relative overflow-hidden m-2 rounded-2xl">
            <UserActions 
              mode="vertical" 
              collapsed={collapsed}
            />
          </div>
        </div>
      )}

      {!isDrawerMode && toggleButton}
    </div>
  )

  // 抽屉模式
  if (ConfigStore.isDrawerMode) {
    return (
      <>
        {!ConfigStore.drawerVisible && toggleButton}
        
        <CustomDrawer
          open={ConfigStore.drawerVisible}
          onClose={() => ConfigStore.toggleVisible('sidebar')}
          placement="left"
          showClose={false}
          showMask={true}
          maskClosable={true}
          bodyStyle={{ background: 'transparent' }}
          width={280}
          className="!bg-transparent"
        >
          {Content}
        </CustomDrawer>
      </>
    )
  }
  if(!ConfigStore.showSidebar){
    return null
  }
  // if (ConfigStore.effectiveLayoutMode === 'vertical') {
  //   return null
  // }

  // 常规 Sidebar 模式
  return (
    <Sider 
      width={280} 
      collapsedWidth={80} 
      collapsed={ConfigStore.sidebarCollapsed} 
      className="!bg-transparent group relative h-screen"
    >
      {Content}
    </Sider>
  )
})

export default Sidebar 