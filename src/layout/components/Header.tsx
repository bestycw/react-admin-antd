import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import logo from '@/assets/logo.svg'
import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'

const Header = observer(() => {
  const { ConfigStore } = useStore()
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  const isHorizontal = ConfigStore.layoutMode === 'horizontal'
  const {AdminName=''} = GlobalConfig

  return (
    <div className="w-full">
      <div className="theme-style">
        <div className="flex flex-col">
          <div className="flex items-center h-14">
            {isHorizontal && (
              <div className="flex items-center shrink-0 gap-4 mr-12">
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
            )}

            <div className="flex-1 overflow-hidden">
              <Menu mode="horizontal" />
            </div>

            {isHorizontal && (
              <div className="flex items-center shrink-0">
                <UserActions mode="horizontal" />
              </div>
            )}
          </div>

          {/* <Tags /> */}
        </div>
      </div>
    </div>
  )
})

export default Header