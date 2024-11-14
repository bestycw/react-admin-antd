import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import Logo from '@/components/Logo'
// import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Sider from 'antd/es/layout/Sider'
import React from 'react'

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const isCollapsed = ConfigStore.sidebarCollapsed

  return (
    <Sider width={280} collapsedWidth={80} collapsed={isCollapsed} className="!bg-transparent group relative">
      <div className="theme-style flex flex-col" style={{height:'calc(100% - var(--header-margin-height))'}}>
        {ConfigStore.showSidebarLogo && (
          <Logo collapsed={isCollapsed} className="p-4 h-14 shrink-0" />
        )}

        <div className="flex-1 overflow-hidden py-4">
          <Menu mode="inline" collapsed={isCollapsed} />
        </div>

        {ConfigStore.showSidebarUserActions && (
          <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
            <div className="relative overflow-hidden m-2 rounded-2xl">
              <UserActions mode="vertical" collapsed={isCollapsed} />
            </div>
          </div>
        )}
      </div>
    </Sider>
  )
})

export default Sidebar 