import { Avatar, Dropdown, Badge, Tooltip } from 'antd'
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

interface VerticalUserActionsProps {
  collapsed?: boolean
}

const VerticalUserActions = observer(({ collapsed = false }: VerticalUserActionsProps) => {
  const { UserStore, ConfigStore } = useStore()
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
      className={`
        flex items-center rounded-lg transition-all duration-200
        hover:bg-black/5 dark:hover:bg-white/5
        ${collapsed 
          ? 'w-10 h-10 justify-center' 
          : 'w-full gap-3 px-3 py-2'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {badge ? (
          <Badge count={badge} size="small">
            {icon}
          </Badge>
        ) : icon}
      </div>
      {!collapsed && (
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      )}
    </button>
  )

  const userButton = (
    <div className={`
      flex items-center cursor-pointer transition-colors w-full
      hover:bg-black/5 dark:hover:bg-white/5
      ${collapsed 
        ? 'h-10 w-10 justify-center' 
        : 'h-10 gap-3 mx-2 px-2 rounded-lg'
      }
    `}>
      <Avatar 
        size={28}
        src={UserStore.userInfo?.avatar}
        icon={<UserOutlined />}
        className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500"
      />
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {UserStore.userInfo?.username || '用户'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {UserStore.userInfo?.email || 'user@example.com'}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-col">
      {/* Action Buttons */}
      <div className={`
        flex flex-col
        ${collapsed ? 'px-1 py-2 gap-2' : 'p-2 gap-1'}
      `}>
        <ActionButton 
          icon={<BellOutlined className="text-gray-600 dark:text-gray-300" />}
          label="通知"
          badge={5}
        />

        <ActionButton 
          icon={ConfigStore.isDarkMode ? 
            <SunOutlined className="text-amber-500" /> : 
            <MoonOutlined className="text-blue-500" />
          }
          label={ConfigStore.isDarkMode ? "亮色模式" : "暗色模式"}
          onClick={() => ConfigStore.toggleDarkMode()}
        />

        <ActionButton 
          icon={isFullscreen ? 
            <FullscreenExitOutlined className="text-gray-600 dark:text-gray-300" /> : 
            <FullscreenOutlined className="text-gray-600 dark:text-gray-300" />
          }
          label={isFullscreen ? "退出全屏" : "全屏显示"}
          onClick={toggleFullscreen}
        />

        <Dropdown menu={{ items: languageItems }} placement="topRight" trigger={['click']}>
          <div>
            <ActionButton 
              icon={<GlobalOutlined className="text-gray-600 dark:text-gray-300" />}
              label="切换语言"
            />
          </div>
        </Dropdown>

        <ActionButton 
          icon={<SettingOutlined className="text-lg text-gray-600 dark:text-gray-300" />}
          label="系统设置"
          onClick={() => ConfigStore.openSettingDrawer()}
        />
      </div>

      {/* User Profile */}
      <div className=" mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick
          }}
          trigger={['click']}
          placement="topRight"
        >
          {collapsed ? (
            <Tooltip title={UserStore.userInfo?.username || '用户'} placement="right">
              {userButton}
            </Tooltip>
          ) : userButton}
        </Dropdown>
      </div>
    </div>
  )
})

export default VerticalUserActions 