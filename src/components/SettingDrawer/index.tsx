import { Divider, Switch, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import CustomDrawer from '../CustomDrawer'

interface SettingDrawerProps {
  open: boolean
  onClose: () => void
}

const SettingDrawer = observer(({ open, onClose }: SettingDrawerProps) => {
  const { ConfigStore } = useStore()

  return (
    <CustomDrawer
      title="系统设置"
      open={open}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* 主题设置 */}
        <div>
          <h3 className="text-base font-medium mb-4 text-gray-800 dark:text-gray-200">
            主题设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">深色模式</span>
              <Switch
                checked={ConfigStore.isDarkMode}
                onChange={() => ConfigStore.toggleTheme()}
                className={`${ConfigStore.isDarkMode ? 'bg-blue-500' : ''}`}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">界面风格</span>
              <Select
                value={ConfigStore.themeStyle}
                onChange={(value) => ConfigStore.setThemeStyle(value)}
                style={{ width: 120 }}
                options={[
                  { label: 'macOS风格', value: 'mac' },
                  { label: '直角风格', value: 'sharp' }
                ]}
                className="setting-select"
              />
            </div>
          </div>
        </div>

        <Divider className="border-gray-200 dark:border-gray-700 my-4" />

        {/* 界面设置 */}
        <div>
          <h3 className="text-base font-medium mb-4 text-gray-800 dark:text-gray-200">
            界面设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">导航模式</span>
              <Select
                value="horizontal"
                style={{ width: 120 }}
                options={[
                  { label: '顶部导航', value: 'horizontal' }
                ]}
                className="setting-select"
              />
            </div>
          </div>
        </div>

        <Divider className="border-gray-200 dark:border-gray-700 my-4" />

        {/* 其他设置 */}
        <div>
          <h3 className="text-base font-medium mb-4 text-gray-800 dark:text-gray-200">
            其他设置
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">固定头部</span>
              <Switch defaultChecked className="bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer 