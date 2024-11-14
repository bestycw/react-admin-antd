import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import logo from '@/assets/logo.svg'
import GlobalConfig from '@/config/GlobalConfig'
import React from 'react'

interface LogoProps {
  collapsed?: boolean
  className?: string
}

const Logo = observer(({ collapsed = false, className = '' }: LogoProps) => {
  const { ConfigStore } = useStore()
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  const {AdminName=''} = GlobalConfig

  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'} ${className}`}>
      <div className={`
        w-10 h-10 flex items-center justify-center
        p-2 rounded-lg transition-all duration-200
        ${isDynamic ? 'dynamic-bg' : 'classic-bg'}
      `}>
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
      </div>
      {!collapsed && (
        <span className="text-base font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
          {AdminName}
        </span>
      )}
    </div>
  )
})

export default Logo 