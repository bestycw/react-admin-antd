import { MenuProps } from 'antd'
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
  TranslationOutlined,
} from '@ant-design/icons'
import React from 'react'

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
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      UserStore.logout()
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
      key: 'theme',
      icon: ConfigStore.isDark ? 
        <SunOutlined className="text-amber-500" /> : 
        <MoonOutlined className="text-blue-500" />,
      label: ConfigStore.isDark ? "亮色模式" : "暗色模式",
      onClick: () => ConfigStore.setThemeMode(ConfigStore.isDark ? 'light' : 'dark')
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
    currentLang
  }
}

export default useUserActions 