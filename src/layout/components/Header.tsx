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
    <>
      <div className="sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-2 px-3">
          <div className="modern-glass backdrop-blur-xl rounded-lg mt-3">
            <div className="px-3">
              <div className="flex h-16 items-center">
                {/* 左侧 Logo */}
                <div className="flex-shrink-0 flex items-center space-x-3 mr-8">
                  <div className="flex items-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/10 rounded-xl p-2">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                  </div>
                  <span className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                    CoffeeAdmin
                  </span>
                </div>

                {/* 菜单靠左 */}
                <div className="flex-1">
                  <Menu mode="horizontal" className="bg-transparent" />
                </div>

                {/* 右侧功能区 */}
                <div className="flex-shrink-0 flex items-center">
                  <div className="flex items-center space-x-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-full p-1.5">
                    {/* 主题切换 */}
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
                        hover:bg-white dark:hover:bg-gray-700 hover:shadow-md"
                      onClick={() => ConfigStore.toggleTheme()}
                    >
                      {ConfigStore.isDarkMode ? (
                        <SunOutlined className="text-lg text-amber-500" />
                      ) : (
                        <MoonOutlined className="text-lg text-blue-500" />
                      )}
                    </button>

                    {/* 系统设置 */}
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
                        hover:bg-white dark:hover:bg-gray-700 hover:shadow-md"
                      onClick={() => setSettingOpen(true)}
                    >
                      <SettingOutlined className="text-lg text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* 用户信息 */}
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
      </div>

      <SettingDrawer 
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
      />
    </>
  )
})

export default Header