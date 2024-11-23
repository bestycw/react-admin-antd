import { MenuProps } from 'antd'
import { useStore } from '@/store'
import { useState } from 'react'
import {
  UserOutlined,
  SettingOutlined,
  // SunOutlined,
  // MoonOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BellOutlined,
  TranslationOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import React from 'react'
import { authService } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
// import { useGlobalSearch } from '@/hooks/useGlobalSearch'

export interface ActionItem {
  key: string
  icon: React.ReactNode
  label: string
  badge?: number
  onClick?: () => void
}

export const useUserActions = () => {
  const { UserStore, ConfigStore } = useStore()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentLang, setCurrentLang] = useState('zh_CN')
  const [searchVisible, setSearchVisible] = useState(false)
  const navigate = useNavigate()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // 用户菜单项
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

  // 语言选项
  const languageItems: MenuProps['items'] = [
    {
      key: 'zh_CN',
      label: '简体中文',
      onClick: () => setCurrentLang('zh_CN')
    },
    {
      key: 'en_US',
      label: 'English',
      onClick: () => setCurrentLang('en_US')
    }
  ]

  // 用户菜单点击处理
  const handleUserMenuClick: MenuProps['onClick'] = async({ key }) => {
    if (key === 'logout') {
     await authService.logout()
     navigate('/login')
     UserStore.clearUserInfo()
    }
  }

  // 功能按钮列表
  const actionItems: ActionItem[] = [
    {
      key: 'notification',
      icon: <BellOutlined className="text-gray-600 dark:text-gray-300" />,
      label: '通知',
      badge: 5
    },
    {
      key: 'search',
      icon: <SearchOutlined className="text-gray-600 dark:text-gray-300" />,
      label: '搜索',
      onClick: () => ConfigStore.toggleSearchVisible(true)
    },
    {
      key: 'fullscreen',
      icon: isFullscreen ? 
        <FullscreenExitOutlined className="text-gray-600 dark:text-gray-300" /> : 
        <FullscreenOutlined className="text-gray-600 dark:text-gray-300" />,
      label: isFullscreen ? "退出全屏" : "全屏显示",
      onClick: toggleFullscreen
    },
    {
      key: 'language',
      icon: <TranslationOutlined className="text-gray-600 dark:text-gray-300" />,
      label: '切换语言'
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="text-lg text-gray-600 dark:text-gray-300" />,
      label: '系统设置',
      onClick: () => ConfigStore.toggleVisible('setting')
    }

  ]

  // 用户信息
  const userInfo = {
    username: UserStore.userInfo?.username || '用户',
    email: UserStore.userInfo?.email || 'user@example.com',
    avatar: UserStore.userInfo?.avatar
  }

  return {
    actionItems,
    userMenuItems,
    languageItems,
    handleUserMenuClick,
    userInfo,
    currentLang,
    searchVisible,
    setSearchVisible
  }
}

export default useUserActions 