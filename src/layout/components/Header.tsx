import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Logo from '@/components/Logo'
import UserActions from '@/components/UserActions'
import React from 'react'
import Menu from './Menu'

interface HeaderProps {
  className?: string
  style?: React.CSSProperties
}

const Header = observer(({ className = '', style }: HeaderProps) => {
  const { ConfigStore } = useStore()

  // 抽屉模式下不显示 Header
  if (ConfigStore.isDrawerMode) {
    return null
  }

  return (
    <header 
      className={`
        theme-style flex items-center justify-between h-14 px-4
        border-b border-black/[0.02] dark:border-white/[0.02]
        sticky top-0 z-10
        ${className}
      `}
      style={style}
    >
      {/* Logo */}
      {ConfigStore.showHeaderLogo && (
        <Logo collapsed={false} className="h-14 py-4" />
      )}

      {/* Menu */}
      {ConfigStore.layoutMode === 'vertical' && (
        <div className="flex-1 ml-4">
          <Menu mode="horizontal" />
        </div>
      )}

      {/* User Actions */}
      {ConfigStore.showHeaderUserActions && (
        <div className="ml-4 ml-auto">
          <UserActions mode="horizontal" />
        </div>
      )}
    </header>
  )
})

export default Header