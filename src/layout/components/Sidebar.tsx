import { observer } from 'mobx-react-lite'
import Menu from './Menu'
import Logo from '@/components/Logo'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import CustomDrawer from '@/components/CustomDrawer'
import { useSidebarControl } from '@/hooks/useSidebarControl'
import React from 'react'

const { Sider } = Layout

const Sidebar = observer(() => {
  const {
    isCollapsed,
    isDrawerMode,
    drawerVisible,
    showLogo,
    showUserActions,
    getCollapsedState,
    handleToggle,
    closeDrawer,
    toggleButtonClass,
  } = useSidebarControl()

  // 折叠/抽屉 切换按钮
  const toggleButton = (
    <button
      onClick={handleToggle}
      className={toggleButtonClass}
    >
      {(isDrawerMode && !drawerVisible) || isCollapsed ? (
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

      {showUserActions && (
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
  if (isDrawerMode) {
    return (
      <>
        {!drawerVisible && toggleButton}
        
        <CustomDrawer
          open={drawerVisible}
          onClose={closeDrawer}
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