import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import CustomDrawer from '../CustomDrawer'
import {
  LayoutOutlined,
  BgColorsOutlined,
  ControlOutlined,
  LockOutlined,
} from '@ant-design/icons'

interface SettingDrawerProps {
  open: boolean
  onClose: () => void
}

const SettingDrawer = observer(({ open, onClose }: SettingDrawerProps) => {
  const { ConfigStore } = useStore()
  // const isDynamic = ConfigStore.themeStyle === 'dynamic'
  // const isDark = ConfigStore.isDarkMode

  const buttonClass = `
    px-3 py-1.5 rounded-full text-sm transition-colors
    text-gray-700 dark:text-gray-200
  `

  const disabledButtonClass = `
    px-3 py-1.5 rounded-full text-sm
    text-gray-500 dark:text-gray-400
    cursor-not-allowed opacity-60
  `

  const sectionTitleClass = "flex items-center gap-2 text-base font-medium mb-4 text-gray-800 dark:text-gray-200"
  const itemLabelClass = "text-gray-600 dark:text-gray-400"
  const dividerClass = "h-px bg-gray-200 dark:bg-gray-700/50 my-6"

  return (
    <CustomDrawer
      title="系统设置"
      open={open}
      onClose={onClose}
    >
      <div className="space-y-6 p-4">
        {/* 主题设置 */}
        <div>
          <h3 className={sectionTitleClass}>
            <BgColorsOutlined /> 主题设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>界面风格</span>
              <button
                onClick={() => ConfigStore.toggleTheme()}
                className={buttonClass}
              >
                {ConfigStore.themeStyle === 'dynamic' ? '灵动' : '经典'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>外观模式</span>
              <button
                onClick={() => ConfigStore.toggleDarkMode()}
                className={buttonClass}
              >
                {ConfigStore.isDarkMode ? '暗色模式' : '亮色模式'}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>主题色</span>
              <div className="flex gap-2">
                {[
                  { color: 'blue', value: '#1890ff' },
                  { color: 'purple', value: '#722ed1' },
                  { color: 'green', value: '#13c2c2' },
                  { color: 'orange', value: '#fa8c16' }
                ].map(({ color, value }) => (
                  <button
                    key={color}
                    onClick={() => ConfigStore.setPrimaryColor(value)}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all
                      ${color === 'blue' ? 'bg-blue-500' : 
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'green' ? 'bg-cyan-500' : 'bg-orange-500'}
                      ${ConfigStore.primaryColor === value 
                        ? 'border-white/50 scale-110 shadow-lg' 
                        : 'border-transparent hover:scale-110'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={dividerClass} />

        {/* 界面设置 */}
        <div>
          <h3 className={sectionTitleClass}>
            <LayoutOutlined /> 界面设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>导航模式</span>
              <button className={disabledButtonClass} disabled>
                顶部导航
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>内容区域</span>
              <button className={buttonClass}>
                流式布局
              </button>
            </div>
          </div>
        </div>

        <div className={dividerClass} />

        {/* 系统设置 */}
        <div>
          <h3 className={sectionTitleClass}>
            <ControlOutlined /> 系统设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>固定头部</span>
              <button className={buttonClass}>
                已开启
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>页面动画</span>
              <button className={buttonClass}>
                已开启
              </button>
            </div>
          </div>
        </div>

        <div className={dividerClass} />

        {/* 权限设置 */}
        <div>
          <h3 className={sectionTitleClass}>
            <LockOutlined /> 权限设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>权限模式</span>
              <button className={disabledButtonClass} disabled>
                前端控制
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>路由验证</span>
              <button className={buttonClass}>
                已开启
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer