import { Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useState } from 'react'
import Menu from './Menu'
import logo from '@/assets/logo.svg'
import SettingDrawer from '@/components/SettingDrawer'
import {
  UserOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

const Header = observer(() => {
  const { UserStore, ConfigStore } = useStore()
  const [settingOpen, setSettingOpen] = useState(false)

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
    <div className={`${ConfigStore.themeStyle === 'mac' ? 'mac-header' : 'sharp-header'}`}>
      <div className="max-w-screen-2xl mx-2 px-3">
        <div className={`${ConfigStore.themeStyle === 'mac' ? 'mac-glass' : 'sharp-glass'} mt-3`}>
          <div className="px-3">
            <div className="flex h-16 items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center space-x-3 mr-8">
                <div className="mac-panel p-2">
                  <img src={logo} alt="Logo" className="h-8 w-8" />
                </div>
                <span className="mac-title">CoffeeAdmin</span>
              </div>

              {/* Menu */}
              <div className="flex-1">
                <Menu mode="horizontal" className="mac-menu" />
              </div>

              {/* Actions */}
              <div className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  ConfigStore.themeStyle === 'mac' 
                    ? 'bg-gray-100/50 dark:bg-gray-800/50 rounded-full' 
                    : 'bg-gray-100 dark:bg-gray-800'
                } p-1.5`}>
                  {/* Theme Toggle */}
                  <button 
                    className={ConfigStore.themeStyle === 'mac' ? 'mac-icon-button' : 'sharp-icon-button'}
                    onClick={() => ConfigStore.toggleTheme()}
                  >
                    {ConfigStore.isDarkMode ? (
                      <SunOutlined className="text-lg text-amber-500" />
                    ) : (
                      <MoonOutlined className="text-lg text-blue-500" />
                    )}
                  </button>

                  {/* Settings */}
                  <button 
                    className="mac-icon-button"
                    onClick={() => setSettingOpen(true)}
                  >
                    <SettingOutlined className="text-lg text-gray-600 dark:text-gray-300" />
                  </button>

                  {/* User Menu */}
                  <Dropdown
                    menu={{
                      items: userMenuItems,
                      onClick: handleUserMenuClick
                    }}
                    trigger={['click']}
                  >
                    <div className="flex items-center space-x-2 px-2 py-1 rounded-full cursor-pointer
                      hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md">
                      <Avatar 
                        size="small" 
                        src={UserStore.userInfo?.avatar}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                      <span className="text-gray-700 dark:text-gray-200">
                        {UserStore.userInfo?.username || '用户'}
                      </span>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SettingDrawer 
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
      />
    </div>
  )
})

export default Header