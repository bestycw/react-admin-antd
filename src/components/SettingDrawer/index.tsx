import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Segmented } from 'antd'
import { 
  MenuUnfoldOutlined, 
  LayoutOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  PictureOutlined,
  TagsOutlined
} from '@ant-design/icons'
import CustomDrawer from '../CustomDrawer'
import { LayoutMode, ThemeStyle, ThemeMode, MenuPosition } from '@/types/config'

const SettingDrawer = observer(() => {
  const { ConfigStore } = useStore()

  const layoutOptions = [
    {
      value: 'HORIZONTAL',
      icon: <BarsOutlined />,
      label: '侧边导航',
    },
    {
      value: 'VERTICAL',
      icon: <MenuUnfoldOutlined />,
      label: '顶部导航',
    },
    {
      value: 'MIX',
      icon: <AppstoreOutlined />,
      label: '混合导航',
    },
  ]

  const themeStyleOptions = [
    {
      value: 'dynamic',
      icon: <PictureOutlined />,
      label: '动态',
    },
    {
      value: 'classic',
      icon: <LayoutOutlined />,
      label: '经典',
    },
  ]

  const themeModeOptions = [
    {
      value: 'light',
      icon: <SunOutlined />,
      label: '亮色',
    },
    {
      value: 'dark',
      icon: <MoonOutlined />,
      label: '暗色',
    },
    {
      value: 'system',
      icon: <DesktopOutlined />,
      label: '跟随系统',
    },
  ]

  const positionOptions = [
    {
      value: 'IN_HEADER',
      label: '顶部',
    },
    {
      value: 'IN_SIDEBAR',
      label: '侧边',
    },
    {
      value: 'mix',
      label: '混合',
    }
  ]

  return (
    <CustomDrawer
      open={ConfigStore.settingDrawerVisible}
      onClose={() => ConfigStore.toggleDrawer('setting')}
      title="系统配置"
      placement="right"
      width={320}
      showClose={true}
      showMask={true}
      maskClosable={true}
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-6 space-y-8">
        {/* 导航模式 */}
        <div>
          <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">导航模式</div>
          <Segmented
            block
            value={ConfigStore.layoutMode}
            options={layoutOptions}
            onChange={(value) => ConfigStore.setLayoutMode(value as LayoutMode)}
            className="w-full"
          />
        </div>

        {/* 主题风格 */}
        <div>
          <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">主题风格</div>
          <Segmented
            block
            value={ConfigStore.themeStyle}
            options={themeStyleOptions}
            onChange={(value) => ConfigStore.setThemeStyle(value as ThemeStyle)}
            className="w-full"
          />
        </div>

        {/* 主题模式 */}
        <div>
          <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">主题模式</div>
          <Segmented
            block
            value={ConfigStore.themeMode}
            options={themeModeOptions}
            onChange={(value) => ConfigStore.setThemeMode(value as ThemeMode)}
            className="w-full"
          />
        </div>

        {ConfigStore.layoutMode === 'mix' && (
          <>
            {/* Logo 位置 */}
            <div>
              <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Logo 位置</div>
              <Segmented
                block
                value={ConfigStore.positions.logo}
                options={positionOptions.filter(opt => opt.value !== 'mix')}
                onChange={(value) => ConfigStore.toggleComponentPosition('LOGO', value )}
                className="w-full"
              />
            </div>

            {/* 菜单位置 */}
            <div>
              <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">菜单位置</div>
              <Segmented
                block
                value={ConfigStore.positions.menu}
                options={positionOptions}
                onChange={(value) => ConfigStore.toggleComponentPosition('MENU', value )}
                className="w-full"
              />
            </div>

            {/* 用户操作位置 */}
            <div>
              <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">用户操作位置</div>
              <Segmented
                block
                value={ConfigStore.positions.userActions}
                options={positionOptions.filter(opt => opt.value !== 'mix')}
                onChange={(value) => ConfigStore.setPosition('USER_ACTIONS', value )}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* 界面功能 */}
        <div>
          <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">界面功能</div>
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={ConfigStore.toggleShowLogo}
            >
              <div className="flex items-center space-x-3">
                <LayoutOutlined className="text-lg text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">显示 Logo</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${ConfigStore.showLogo ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out mt-0.5 ${ConfigStore.showLogo ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => ConfigStore.setShowTabs(!ConfigStore.showTabs)}
            >
              <div className="flex items-center space-x-3">
                <TagsOutlined className="text-lg text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">显示标签页</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${ConfigStore.showTabs ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out mt-0.5 ${ConfigStore.showTabs ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer