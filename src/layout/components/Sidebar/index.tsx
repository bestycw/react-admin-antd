import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from '../Menu'
import logo from '@/assets/logo.svg'
import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  const {AdminName=''} = GlobalConfig

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-4 p-4 h-14 shrink-0">
        <div className={`
          w-10 h-10 flex items-center justify-center
          p-2 rounded-lg transition-all duration-200
          ${isDynamic ? 'dynamic-bg' : 'classic-bg'}
        `}>
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-base font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
          {AdminName}
        </span>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-hidden py-4">
        <Menu mode="inline" />
      </div>

      {/* Bottom Actions */}
      <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
        <div className={`
          relative overflow-hidden m-2
          ${isDynamic 
            ? 'bg-white/40 dark:bg-black/20 backdrop-blur-md' 
            : 'bg-gray-50 dark:bg-gray-800'
          }
          rounded-2xl
          before:absolute before:inset-0 before:rounded-2xl
          before:border before:border-white/20 dark:before:border-white/10
          before:pointer-events-none
        `}>
          <UserActions mode="vertical" />
        </div>
      </div>
    </div>
  )
})

export default Sidebar 