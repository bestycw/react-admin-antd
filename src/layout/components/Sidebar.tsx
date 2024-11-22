import { observer } from 'mobx-react-lite'
import Menu from './Menu'
import Logo from '@/components/Logo'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import CustomDrawer from '@/components/CustomDrawer'
import { useSidebarControl } from '@/hooks/useSidebarControl'
import React from 'react'
import { useStore } from '@/store'

const { Sider } = Layout

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const {
    isCollapsed,
    isDrawerMode,
    getCollapsedState,
    toggleButtonClass,
  } = useSidebarControl()

  // 折叠/抽屉 切换按钮
  const toggleButton = (
    <button
      onClick={() => ConfigStore.handleSidebarToggle()}
      className={toggleButtonClass}
    >
      {(isDrawerMode && !ConfigStore.drawerVisible) || ConfigStore.sidebarCollapsed ? (
        <MenuUnfoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
      ) : (
        <MenuFoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
      )}
    </button>
  )

  const drawerContent = (
    <div className="theme-style flex flex-col m-0" style={{ height: 'calc(100% - var(--header-margin-height))' }}>
      {ConfigStore.showDrawerLogo && (
        <Logo 
          collapsed={false} 
          className="p-4 h-14 shrink-0" 
        />
      )}

      {ConfigStore.showDrawerMenu && (
        <div className="flex-1 overflow-hidden py-4">
          <Menu 
            mode="inline" 
            collapsed={false} 
          />
        </div>
      )}
      {ConfigStore.showDrawerUserActions && (
        <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
          <div className="relative overflow-hidden m-2 rounded-2xl">
            <UserActions 
              mode="vertical" 
              collapsed={false} 
            />
          </div>
        </div>
      )}
    </div>
  )

  const sidebarContent = (
    <div className="theme-style flex flex-col h-full mr-0" style={{height:'calc(100% - var(--header-margin-height))'}}>
      {ConfigStore.showSidebarLogo && (
        <Logo 
          collapsed={getCollapsedState('logo')} 
          className="p-4 h-14 shrink-0" 
        />
      )}

      <div className="flex-1 overflow-hidden py-4">
        <Menu 
          mode="inline" 
          collapsed={getCollapsedState('menu')} 
        />
      </div>

      {ConfigStore.showSidebarUserActions && (
        <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
          <div className="relative overflow-hidden m-2 rounded-2xl">
            <UserActions 
              mode="vertical" 
              collapsed={getCollapsedState('userActions')} 
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
          onClose={() => ConfigStore.toggleDrawer('sidebar')}
          placement="left"
          showClose={false}
          showMask={true}
          maskClosable={true}
          bodyStyle={{ background: 'transparent' }}
          width={280}
          className="!bg-transparent"
        >
          {drawerContent}
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
      className="!bg-transparent group relative"
    >
      {sidebarContent}
    </Sider>
  )
})

export default Sidebar 