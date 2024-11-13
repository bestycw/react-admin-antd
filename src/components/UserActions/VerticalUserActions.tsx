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

const VerticalUserActions = observer(() => {
  const { UserStore, ConfigStore } = useStore()
  const [settingOpen, setSettingOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const ActionButton = ({ icon, label, badge, onClick }: {
    icon: React.ReactNode
    label: string
    badge?: number
    onClick?: () => void
  }) => (
    <button 
      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg
        hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-7">
        {badge ? (
          <Badge count={badge} size="small">
            {icon}
          </Badge>
        ) : icon}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    </button>
  )

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col gap-0.5 p-2">
        <ActionButton 
          icon={<BellOutlined className="text-lg text-gray-600 dark:text-gray-300" />}
          label="通知"
          badge={5}
        />

        <ActionButton 
          icon={ConfigStore.isDarkMode ? 
            <SunOutlined className="text-lg text-amber-500" /> : 
            <MoonOutlined className="text-lg text-blue-500" />
          }
          label={ConfigStore.isDarkMode ? "亮色模式" : "暗色模式"}
          onClick={() => ConfigStore.toggleDarkMode()}
        />

        <ActionButton 
          icon={isFullscreen ? 
            <FullscreenExitOutlined className="text-lg text-gray-600 dark:text-gray-300" /> : 
            <FullscreenOutlined className="text-lg text-gray-600 dark:text-gray-300" />
          }
          label={isFullscreen ? "退出全屏" : "全屏显示"}
          onClick={toggleFullscreen}
        />

        <Dropdown menu={{ items: languageItems }} placement="topRight" trigger={['click']}>
          <div>
            <ActionButton 
              icon={<GlobalOutlined className="text-lg text-gray-600 dark:text-gray-300" />}
              label="切换语言"
            />
          </div>
        </Dropdown>

        <ActionButton 
          icon={<SettingOutlined className="text-lg text-gray-600 dark:text-gray-300" />}
          label="系统设置"
          onClick={() => setSettingOpen(true)}
        />
      </div>

      {/* User Profile */}
      <div className="mt-1 pt-2 border-t border-black/[0.03] dark:border-white/[0.03]">
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick
          }}
          trigger={['click']}
          placement="topRight"
        >
          <div className="flex items-center gap-2 mx-2 p-1.5 rounded-lg cursor-pointer
            hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Avatar 
              size="default"
              src={UserStore.userInfo?.avatar}
              icon={<UserOutlined />}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {UserStore.userInfo?.username || '用户'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {UserStore.userInfo?.email || 'user@example.com'}
              </div>
            </div>
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

export default VerticalUserActions 