import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Segmented, Space, Switch } from 'antd'
import { 
  MenuUnfoldOutlined, 
  LayoutOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  PictureOutlined,
  TagsOutlined,
  SettingOutlined
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
      value: 'MIX',
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
            value={ConfigStore.currentLayoutMode}
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

        {ConfigStore.currentLayoutMode === 'MIX' && (
          <>
            {/* Logo 位置 */}
            <div>
              <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Logo 位置</div>
              <Segmented
                block
                value={ConfigStore.getComponentPosition('LOGO')}
                options={positionOptions.filter(opt => opt.value !== 'MIX')}
                onChange={(value) => ConfigStore.toggleComponentPosition('LOGO', value )}
                className="w-full"
              />
            </div>

            {/* 菜单位置 */}
            <div>
              <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">菜单位置</div>
              <Segmented
                block
                value={ConfigStore.getComponentPosition('MENU')}
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
                value={ConfigStore.getComponentPosition('USER_ACTIONS')}
                options={positionOptions.filter(opt => opt.value !== 'MIX')}
                onChange={(value) => ConfigStore.toggleComponentPosition('USER_ACTIONS', value )}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* 其他设置 */}
        <div className="setting-item">
          <h4 className="mb-4 flex items-center">
            <SettingOutlined className="mr-2" />
            其他设置
          </h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="flex items-center justify-between">
              <span>显示 Logo</span>
              <Switch
                checked={ConfigStore.showLogo}
                onChange={() => ConfigStore.toggleLogo()}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>显示页签</span>
              <Switch
                checked={ConfigStore.showTabs}
                onChange={() => ConfigStore.toggleTabs()}
              />
            </div>
          </Space>
        </div>

      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer