import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Menu from './Menu'
import logo from '@/assets/logo.svg'
import GlobalConfig from '@/config/GlobalConfig'
import UserActions from '@/components/UserActions'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Sider from 'antd/es/layout/Sider'

const Sidebar = observer(() => {
  const { ConfigStore } = useStore()
  const {AdminName=''} = GlobalConfig
  const isCollapsed = ConfigStore.sidebarCollapsed

  return (
    <Sider 
      width={280} 
      collapsedWidth={80}
      collapsed={isCollapsed}
      className="!bg-transparent group relative"
    >
      <div className="theme-style flex flex-col" style={{height:'calc(100% - var(--header-margin-height))'}}>
        {/* Logo */}
        <div className={`
          flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} p-4 h-14 shrink-0
        `}>
          <div className={`
            w-10 h-10 flex items-center justify-center
            p-2 rounded-lg transition-all duration-200
          `}>
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
              {AdminName}
            </span>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-hidden py-4">
          <Menu mode="inline" inlineCollapsed={isCollapsed} />
        </div>

        {/* Bottom Actions */}
        <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
          <div className={`
            relative overflow-hidden m-2
            rounded-2xl
            before:absolute before:inset-0 before:rounded-2xl
            before:border before:border-white/20 dark:before:border-white/10
            before:pointer-events-none
          `}>
            <UserActions mode="vertical" collapsed={isCollapsed} />
          </div>
        </div>
      </div>

      {/* Floating Collapse Toggle Button */}
      <button
        onClick={() => ConfigStore.toggleSidebar()}
        className={`
          absolute -right-4 top-1/2 -translate-y-1/2
          w-8 h-8 flex items-center justify-center
          rounded-full
          transition-all duration-300 ease-in-out
          opacity-0 group-hover:opacity-100

          shadow-lg
          border border-black/[0.02] dark:border-white/[0.02]
          hover:scale-110
          z-10
        `}
      >
        {isCollapsed ? (
          <MenuUnfoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
        ) : (
          <MenuFoldOutlined className="text-sm text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </Sider>
  )
})

export default Sidebar 