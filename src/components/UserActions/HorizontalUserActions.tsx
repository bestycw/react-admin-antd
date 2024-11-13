import { Avatar, Dropdown, Badge } from 'antd'
import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useState } from 'react'
import {
  UserOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BellOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import SettingDrawer from '@/components/SettingDrawer'
import React from 'react'

const HorizontalUserActions = observer(() => {
  const { UserStore, ConfigStore } = useStore()
  const [settingOpen, setSettingOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isDynamic = ConfigStore.themeStyle === 'dynamic'

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  const languageItems: MenuProps['items'] = [
    {
      key: 'zh_CN',
      label: '简体中文'
    },
    {
      key: 'en_US',
      label: 'English'
    }
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      UserStore.logout()
    }
  }

  const ActionButton = ({ icon, onClick, badge }: { 
    icon: React.ReactNode, 
    onClick?: () => void,
    badge?: number 
  }) => (
    <button 
      className="w-8 h-8 flex items-center justify-center rounded-full
        transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10
        text-gray-500 dark:text-gray-400"
      onClick={onClick}
    >
      {badge ? (
        <Badge count={badge} size="small">
          {icon}
        </Badge>
      ) : icon}
    </button>
  )

  return (
    <>
      <div className={`
        flex items-center gap-1.5 p-1 rounded-lg transition-all duration-200
        ${isDynamic ? 'dynamic-bg' : 'classic-bg'}
      `}>
        {/* Theme Toggle */}
        <ActionButton 
          icon={ConfigStore.isDarkMode ? 
            <SunOutlined className="text-lg text-amber-500" /> : 
            <MoonOutlined className="text-lg text-blue-500" />
          }
          onClick={() => ConfigStore.toggleDarkMode()}
        />

        {/* Fullscreen Toggle */}
        <ActionButton 
          icon={isFullscreen ? 
            <FullscreenExitOutlined className="text-lg" /> : 
            <FullscreenOutlined className="text-lg" />
          }
          onClick={toggleFullscreen}
        />

        {/* Notifications */}
        <ActionButton 
          icon={<BellOutlined className="text-lg" />}
          badge={5}
        />

        {/* Language */}
        <Dropdown
          menu={{
            items: languageItems,
          }}
          trigger={['click']}
          placement="top"
        >
          <div>
            <ActionButton 
              icon={<GlobalOutlined className="text-lg" />}
            />
          </div>
        </Dropdown>

        {/* Settings */}
        <ActionButton 
          icon={<SettingOutlined className="text-lg" />}
          onClick={() => setSettingOpen(true)}
        />

        {/* User Menu */}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className={`
            flex items-center gap-2 px-2 py-1 rounded-full
            cursor-pointer transition-all duration-200
            hover:bg-black/5 dark:hover:bg-white/10
          `}>
            <Avatar 
              size="small" 
              src={UserStore.userInfo?.avatar}
              icon={<UserOutlined />}
              className={`
                w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500
              `}
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {UserStore.userInfo?.username || '用户'}
            </span>
          </div>
        </Dropdown>
      </div>

      <SettingDrawer 
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
      />
    </>
  )
})

export default HorizontalUserActions 