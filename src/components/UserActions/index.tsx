import { Avatar, Dropdown } from 'antd'
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
} from '@ant-design/icons'
import SettingDrawer from '@/components/SettingDrawer'

interface UserActionsProps {
  mode?: 'horizontal' | 'vertical'
}

const UserActions = observer(({ mode = 'horizontal' }: UserActionsProps) => {
  const { UserStore, ConfigStore } = useStore()
  const [settingOpen, setSettingOpen] = useState(false)
  const isDynamic = ConfigStore.themeStyle === 'dynamic'

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

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      UserStore.logout()
    }
  }

  return (
    <>
      <div className={`
        flex items-center ${mode === 'horizontal' ? 'gap-1.5 p-1' : 'justify-between p-2'} 
        rounded-lg transition-all duration-200
        ${isDynamic ? 'dynamic-bg' : 'classic-bg'}
      `}>
        {/* Theme Toggle */}
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => ConfigStore.toggleDarkMode()}
        >
          {ConfigStore.isDarkMode ? (
            <SunOutlined className="text-lg text-amber-500" />
          ) : (
            <MoonOutlined className="text-lg text-blue-500" />
          )}
        </button>

        {/* Settings */}
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10
            text-gray-500 dark:text-gray-400"
          onClick={() => setSettingOpen(true)}
        >
          <SettingOutlined className="text-lg" />
        </button>

        {/* User Menu */}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick
          }}
          trigger={['click']}
          placement={mode === 'vertical' ? 'topRight' : 'bottomRight'}
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
                ${mode === 'horizontal' ? 'w-7 h-7' : 'w-6 h-6'}
                bg-gradient-to-r from-blue-500 to-indigo-500
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

export default UserActions 