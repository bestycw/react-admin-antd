import { Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useState } from 'react'
import Menu from './Menu'
import logo from '@/assets/logo.svg'
import SettingDrawer from '@/components/SettingDrawer'
import { ThemeContainer } from '@/components/ThemeContainer'
import {
  UserOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import GlobalConfig from '@/config/GlobalConfig'

const Header = observer(() => {
  const { UserStore, ConfigStore } = useStore()
  const [settingOpen, setSettingOpen] = useState(false)
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  const {AdminName=''} = GlobalConfig

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined className="text-gray-400" />,
      label: <span className="text-gray-600 dark:text-gray-300">个人信息</span>
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-400" />,
      label: <span className="text-red-500 dark:text-red-400">退出登录</span>
    }
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      UserStore.logout()
    }
  }

  return (
    <div className="w-full">
      <ThemeContainer>
        <div className="flex items-center h-10">
          {/* Logo */}
          <div className="flex items-center shrink-0 gap-3 mr-10">
            <div className={`
              w-10 h-10 flex items-center justify-center
              p-2 rounded-lg transition-all duration-200
              ${isDynamic ? 'dynamic-bg' : 'classic-bg'}
            `}>
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
              {AdminName}
            </span>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-hidden">
            <Menu mode="horizontal" className="!bg-transparent !border-none leading-9 text-sm" />
          </div>

          {/* Actions */}
          <div className="flex items-center shrink-0">
            <div className={`
              flex items-center gap-1 p-0.5 rounded-full transition-all duration-200
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
              >
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                  cursor-pointer transition-all duration-200
                  hover:bg-black/5 dark:hover:bg-white/10">
                  <Avatar 
                    size="small" 
                    src={UserStore.userInfo?.avatar}
                    icon={<UserOutlined />}
                    className="w-5.5 h-5.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {UserStore.userInfo?.username || '用户'}
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </ThemeContainer>

      <SettingDrawer 
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
      />
    </div>
  )
})

export default Header