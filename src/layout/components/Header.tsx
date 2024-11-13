import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import Logo from '@/components/Logo'
import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'
import React, { CSSProperties } from 'react'

interface HeaderProps {
  style?: CSSProperties;
}

const Header = observer(({ style }: HeaderProps) => {
  const { ConfigStore } = useStore()
  const isHorizontal = ConfigStore.layoutMode === 'horizontal'
  const showLogo = isHorizontal || 
    (ConfigStore.layoutMode === 'mix' && ConfigStore.logoPosition === 'header')
  const showUserActions = isHorizontal || 
    (ConfigStore.layoutMode === 'mix' && ConfigStore.userActionsPosition === 'header')

  return (
    <div className="theme-style" style={style}>
      <div className="flex flex-col">
        <div className="flex items-center h-14">
          {showLogo && (
            <div className="shrink-0 mr-12">
              <Logo />
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <Menu mode="horizontal" />
          </div>

          {showUserActions && (
            <div className="flex items-center shrink-0">
              <UserActions mode="horizontal" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default Header