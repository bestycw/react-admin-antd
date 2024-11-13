// import { Avatar, Dropdown } from 'antd'
// import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
// import { useState } from 'react'
import Menu from './Menu'
import logo from '@/assets/logo.svg'

import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'

const Header = observer(() => {
  const {  ConfigStore } = useStore()

  const isHorizontal = ConfigStore.layoutMode === 'horizontal'
  const {AdminName=''} = GlobalConfig

  return (
    <div className="w-full">
      <div className="theme-style">
        <div className="flex flex-col">
          {/* 顶部导航 */}
          <div className="flex items-center h-14">
            {isHorizontal && (
              /* Logo - 只在水平布局时显示 */
              <div className="flex items-center shrink-0 gap-4 mr-12">
                <div className={`
                  w-12 h-12 flex items-center justify-center
                  p-2.5 rounded-lg transition-all duration-200
                `}>
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
                  {AdminName}
                </span>
              </div>
            )}

            {/* Menu */}
            <div className="flex-1 overflow-hidden">
              <Menu mode="horizontal" />
            </div>

            {/* Actions - 只在水平布局时显示 */}
            {isHorizontal && (
              <div className="flex items-center shrink-0">
                <UserActions mode="horizontal" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default Header