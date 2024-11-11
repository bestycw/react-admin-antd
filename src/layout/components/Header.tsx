import { useState } from 'react'
import { Avatar, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import logo from '@/assets/logo.svg'
import SettingDrawer from '@/components/SettingDrawer'
import {
  UserOutlined,
  SettingOutlined,
  GlobalOutlined,
  LogoutOutlined
} from '@ant-design/icons'

const Header = observer(() => {
  const { UserStore } = useStore()
  const [settingOpen, setSettingOpen] = useState(false)

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置'
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
      <div className="flex h-14 bg-white border-b border-gray-200 items-center justify-between">
        {/* 左侧 Logo */}
        <div className="flex-shrink-0 w-48 px-4 flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-lg font-semibold text-gray-800">CoffeeAdmin</span>
        </div>

        {/* 中间菜单 */}
        <div className="flex-1 flex justify-center px-4">
          <Menu mode="horizontal" />
        </div>

        {/* 右侧功能区 */}
        <div className="flex-shrink-0 flex items-center space-x-4 px-4">
          {/* 语言切换 */}
          <button className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full">
            <GlobalOutlined className="text-lg text-gray-600" />
          </button>

          {/* 系统设置 */}
          <button 
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full"
            onClick={() => setSettingOpen(true)}
          >
            <SettingOutlined className="text-lg text-gray-600" />
          </button>

          {/* 用户信息 */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick
            }}
            trigger={['click']}
          >
            <Space className="cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100">
              <Avatar 
                size="small" 
                src={UserStore.userInfo?.avatar}
                icon={<UserOutlined />}
              />
              <span className="text-gray-700">
                {UserStore.userInfo?.username || '用户'}
              </span>
            </Space>
          </Dropdown>
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