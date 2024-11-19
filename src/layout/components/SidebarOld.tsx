import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import logo from '@/assets/logo.svg'
import getGlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  // const {AdminName=''} = GlobalConfig

  return (

    <div className="theme-style flex flex-col" style={{height:'calc(100% - var(--header-margin-height))'}}>
      {/* Logo */}
      <div className="flex items-center gap-4 p-4 h-14">
        <div className={`
          w-10 h-10 flex items-center justify-center
          p-2 rounded-lg transition-all duration-200
          ${isDynamic ? 'dynamic-bg' : 'classic-bg'}
        `}>
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-base font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
          {getGlobalConfig('AdminName')}
        </span>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-hidden py-4">
        <Menu mode="inline" />
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <UserActions mode="vertical" />
      </div>
    </div>


  )
})

export default Sidebar 