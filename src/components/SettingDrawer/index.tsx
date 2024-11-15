import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Divider, Switch, Segmented } from 'antd'
import { 
  MenuUnfoldOutlined, 
  LayoutOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from '@ant-design/icons'
import CustomDrawer from '../CustomDrawer'
import { LayoutMode, ThemeStyle, ThemeMode,  MenuPosition } from '@/types/config'

const SettingDrawer = observer(() => {
  const { ConfigStore } = useStore()

  const layoutOptions = [
    {
      value: 'horizontal',
      icon: <BarsOutlined />,
      label: '侧边导航',
    },
    {
      value: 'vertical',
      icon: <MenuUnfoldOutlined />,
      label: '顶部导航',
    },
    {
      value: 'mix',
      icon: <AppstoreOutlined />,
      label: '混合导航',
    },
  ]

  const themeStyleOptions = [
    {
      value: 'dynamic',
      icon: <LayoutOutlined />,
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
      label: '亮色',
    },
    {
      value: 'dark',
      label: '暗色',
    },
    {
      value: 'system',
      label: '跟随系统',
    },
  ]

  const positionOptions = [
    {
      value: 'header',
      label: '顶部',
    },
    {
      value: 'sidebar',
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
      onClose={ConfigStore.closeSettingDrawer}
      title="系统配置"
      placement="right"
      width={320}
      showClose={true}
      showMask={true}
      maskClosable={true}
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-6 space-y-6">
        {/* 导航模式 */}
        <div>
          <div className="mb-3 text-sm text-gray-900 dark:text-gray-100">导航模式</div>
          <Segmented
            block
            value={ConfigStore.layoutMode}
            options={layoutOptions}
            onChange={(value) => ConfigStore.setLayoutMode(value as LayoutMode)}
          />
        </div>

        <Divider className="!my-6" />

        {/* 主题风格 */}
        <div>
          <div className="mb-3 text-sm text-gray-900 dark:text-gray-100">主题风格</div>
          <Segmented
            block
            value={ConfigStore.themeStyle}
            options={themeStyleOptions}
            onChange={(value) => ConfigStore.setThemeStyle(value as ThemeStyle)}
          />
        </div>

        <Divider className="!my-6" />

        {/* 主题模式 */}
        <div>
          <div className="mb-3 text-sm text-gray-900 dark:text-gray-100">主题模式</div>
          <Segmented
            block
            value={ConfigStore.themeMode}
            options={themeModeOptions}
            onChange={(value) => ConfigStore.setThemeMode(value as ThemeMode)}
          />
        </div>

        {ConfigStore.layoutMode === 'mix' && (
          <>
            <Divider className="!my-6" />
            
            {/* Logo 位置 */}
            <div>
              <div className="mb-3 text-sm text-gray-900 dark:text-gray-100">Logo 位置</div>
              <Segmented
                block
                value={ConfigStore.positions.logo}
                options={positionOptions.filter(opt => opt.value !== 'mix')}
                onChange={(value) => ConfigStore.setPosition('logo', value as 'header' | 'sidebar')}
              />
            </div>

            {/* 菜单位置 */}
            <div className="mt-6">
              <div className="mb-3 text-sm text-gray-900 dark:text-gray-100">菜单位置</div>
              <Segmented
                block
                value={ConfigStore.positions.menu}
                options={positionOptions}
                onChange={(value) => ConfigStore.setPosition('menu', value as MenuPosition)}
              />
            </div>

            {/* 用户操作位置 */}
            <div className="mt-6">
              <div className="mb-3 text-sm text-gray-900 dark:text-gray-100">用户操作位置</div>
              <Segmented
                block
                value={ConfigStore.positions.userActions}
                options={positionOptions.filter(opt => opt.value !== 'mix')}
                onChange={(value) => ConfigStore.setPosition('userActions', value as 'header' | 'sidebar')}
              />
            </div>
          </>
        )}

        <Divider className="!my-6" />

        {/* 其他设置 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900 dark:text-gray-100">显示 Logo</span>
            <Switch 
              checked={ConfigStore.showLogo} 
              onChange={ConfigStore.toggleShowLogo}
              size="small"
            />
          </div>
        </div>
      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer