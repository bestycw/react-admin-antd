import { MenuProps } from 'antd'
import { useStore } from '@/store'
import { useState } from 'react'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BellOutlined,
  SearchOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import React from 'react'
import { authService } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'

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
  const navigate = useNavigate()
  const { t } = useLocale()

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
      label: t('user.profile')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('user.logout')
    }
  ]

  // 语言选项
  const languageItems: MenuProps['items'] = [
    {
      key: 'zh-CN',
      label: t('common.language.zh')
    },
    {
      key: 'en-US',
      label: t('common.language.en')
    }
  ]

  // 用户菜单点击处理
  const handleUserMenuClick: MenuProps['onClick'] = async({ key }) => {
    if (key === 'logout') {
      try {
        await authService.logout();
        navigate('/auth/login', { replace: true });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else if (key === 'profile') {
      navigate('/profile');
    }
  }

  // 功能按钮列表
  const actionItems: ActionItem[] = [
    {
      key: 'notification',
      icon: <BellOutlined className="text-gray-600 dark:text-gray-300" />,
      label: t('common.notification'),
      badge: 5
    },
    {
      key: 'search',
      icon: <SearchOutlined className="text-gray-600 dark:text-gray-300" />,
      label: t('common.search'),
      onClick: () => ConfigStore.toggleSearchVisible(true)
    },
    {
      key: 'fullscreen',
      icon: isFullscreen ? 
        <FullscreenExitOutlined className="text-gray-600 dark:text-gray-300" /> : 
        <FullscreenOutlined className="text-gray-600 dark:text-gray-300" />,
      label: isFullscreen ? t('common.exitFullscreen') : t('common.fullscreen'),
      onClick: toggleFullscreen
    },
    {
      key: 'language',
      icon: <GlobalOutlined className="text-gray-600 dark:text-gray-300" />,
      label: t('common.languageSwitch')
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="text-gray-600 dark:text-gray-300" />,
      label: t('common.settings'),
      onClick: () => ConfigStore.toggleVisible('setting')
    }
  ]

  // 用户信息
  const userInfo = {
    username: UserStore.userInfo?.username || t('user.defaultName'),
    email: UserStore.userInfo?.email || 'user@example.com',
    avatar: UserStore.userInfo?.avatar
  }

  return {
    actionItems,
    userMenuItems,
    languageItems,
    handleUserMenuClick,
    userInfo
  }
}

export default useUserActions 