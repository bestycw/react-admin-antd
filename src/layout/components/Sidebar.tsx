import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import Logo from '@/components/Logo'
import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Sider from 'antd/es/layout/Sider'
import React from 'react'

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const isCollapsed = ConfigStore.sidebarCollapsed
  const showLogo = ConfigStore.layoutMode === 'vertical' || 
    (ConfigStore.layoutMode === 'mix' && ConfigStore.logoPosition === 'sidebar')
  const showUserActions = ConfigStore.layoutMode === 'vertical' || 
    (ConfigStore.layoutMode === 'mix' && ConfigStore.userActionsPosition === 'sidebar')

  return (
    <Sider width={280} collapsedWidth={80} collapsed={isCollapsed} className="!bg-transparent group relative">
      <div className="theme-style flex flex-col" style={{height:'calc(100% - var(--header-margin-height))'}}>
        {showLogo && <Logo collapsed={isCollapsed} className="p-4 h-14 shrink-0" />}

        {/* Menu */}
        <div className="flex-1 overflow-hidden py-4">
          <Menu mode="inline" collapsed={isCollapsed} />
        </div>

        {showUserActions && (
          <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
            <div className="relative overflow-hidden m-2 rounded-2xl">
              <UserActions mode="vertical" collapsed={isCollapsed} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Collapse Toggle Button */}
      <button
        onClick={() => ConfigStore.toggleSidebar()}
        className={`
          absolute -right-4 top-1/2 -translate-y-1/2
          w-8 h-8 flex items-center justify-center
          rounded-full
          transition-all duration-300 ease-in-out
          opacity-0 group-hover:opacity-100

          shadow-lg
          border border-black/[0.02] dark:border-white/[0.02]
          hover:scale-110
          z-10
        `}
      >
        {isCollapsed ? (
          <MenuUnfoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
        ) : (
          <MenuFoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </Sider>
  )
})

export default Sidebar 