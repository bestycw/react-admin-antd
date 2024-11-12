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

const Header = observer(() => {
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
    <div className="w-full">
      <ThemeContainer>
        <div className="flex items-center h-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mr-7">
            <div className="p-1.5 rounded-lg transition-all duration-200 dynamic-bg dynamic-bg-hover">
              <img src={logo} alt="Logo" className="w-7 h-7" />
            </div>
            <span className="text-base font-semibold">
              CoffeeAdmin
            </span>
          </div>

          {/* Menu */}
          <div className="flex-1">
            <Menu mode="horizontal" className="!bg-transparent !border-none leading-9 text-sm" />
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <div className={`
              flex items-center gap-1 p-0.5 rounded-full transition-all duration-200
              ${isDynamic ? 'dynamic-bg dynamic-bg-hover' : 'classic-bg classic-bg-hover'}
            `}>
              {/* Theme Toggle */}
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full
                  transition-all duration-200 bg-base-hover text-secondary"
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
                  transition-all duration-200 bg-base-hover text-secondary"
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
                  cursor-pointer transition-all duration-200 bg-base-hover">
                  <Avatar 
                    size="small" 
                    src={UserStore.userInfo?.avatar}
                    icon={<UserOutlined />}
                    className="w-5.5 h-5.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                  <span className="text-sm text-base">
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