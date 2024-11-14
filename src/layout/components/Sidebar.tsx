import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import Logo from '@/components/Logo'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import CustomDrawer from '@/components/CustomDrawer'
import React from 'react'

const { Sider } = Layout

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const isCollapsed = ConfigStore.sidebarCollapsed
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  const showLogo = ConfigStore.showLogo && (
    ConfigStore.layoutMode === 'vertical' || 
    (ConfigStore.layoutMode === 'mix' && ConfigStore.logoPosition === 'sidebar')
  )
  const showUserActions = ConfigStore.layoutMode === 'vertical' || 
    (ConfigStore.layoutMode === 'mix' && ConfigStore.userActionsPosition === 'sidebar')

  // 折叠/抽屉 切换按钮
  const toggleButton = (
    <button
      onClick={() => ConfigStore.isDrawerMode ? ConfigStore.toggleDrawer() : ConfigStore.toggleSidebar()}
      className={`
        fixed left-0 top-20
        w-8 h-8 flex items-center justify-center
        rounded-r-full
        transition-all duration-300 ease-in-out
        ${ConfigStore.isDrawerMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        z-50
        ${isDynamic 
          ? 'bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur-md' 
          : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
        }
        shadow-lg
        border border-black/[0.02] dark:border-white/[0.02]
        hover:scale-110
      `}
    >
      {(ConfigStore.isDrawerMode && !ConfigStore.drawerVisible) || isCollapsed ? (
        <MenuUnfoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
      ) : (
        <MenuFoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
      )}
    </button>
  )

  const sidebarContent = (
    <div className="theme-style flex flex-col h-full" style={{height:'calc(100% - var(--header-margin-height))'}}>
      {showLogo && (
        <Logo 
          collapsed={ConfigStore.isDrawerMode ? false : isCollapsed} 
          className="p-4 h-14 shrink-0" 
        />
      )}

      <div className="flex-1 overflow-hidden py-4">
        <Menu 
          mode="inline" 
          collapsed={ConfigStore.isDrawerMode ? false : isCollapsed} 
        />
      </div>

      {showUserActions && (
        <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
          <div className="relative overflow-hidden m-2 rounded-2xl">
            <UserActions 
              mode="vertical" 
              collapsed={ConfigStore.isDrawerMode ? false : isCollapsed} 
            />
          </div>
        </div>
      )}

      {!ConfigStore.isDrawerMode && toggleButton}
    </div>
  )

  // 抽屉模式
  if (ConfigStore.isDrawerMode) {
    return (
      <>
        {!ConfigStore.drawerVisible && toggleButton}
        
        <CustomDrawer
          open={ConfigStore.drawerVisible}
          onClose={ConfigStore.closeDrawer}
          placement="left"
          showClose={false}
          showMask={true}
          maskClosable={true}
          bodyStyle={{ background: 'transparent' }}
          width={280}
          className="!bg-transparent"
        >
          {sidebarContent}
        </CustomDrawer>
      </>
    )
  }

  // 常规 Sidebar 模式
  return (
    <Sider 
      width={280} 
      collapsedWidth={80} 
      collapsed={isCollapsed} 
      className="!bg-transparent group relative"
      
    >
      {sidebarContent}
    </Sider>
  )
})

export default Sidebar 