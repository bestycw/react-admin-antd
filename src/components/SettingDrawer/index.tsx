// import React from 'react'
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
  CheckOutlined,

} from '@ant-design/icons'
import CustomDrawer from '../CustomDrawer'
import { LayoutMode, ThemeStyle, ThemeMode, ComponentPosition } from '@/types/config'

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

  const positionOptions: {
    value: ComponentPosition,
    label: string
  }[] = [
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
      onClose={() => ConfigStore.toggleVisible('setting')}
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
        {/* 主题色 - 新增 */}
        <div className="flex flex-col gap-3">
        <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">主题色</div>
        <div className="flex items-center gap-3">
            {ConfigStore.presetColors.map(preset => (
              <div
                key={preset.color}
                className="group relative cursor-pointer"
                onClick={() => ConfigStore.setPresetColor(preset.color)}
              >
                <div
                  className={`
                                        w-6 h-6 rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        hover:scale-110
                                        ${ConfigStore.currentPresetColor === preset.color
                      ? 'ring-2 ring-current ring-offset-2'
                      : ''
                    }
                                    `}
                  style={{ backgroundColor: preset.color }}
                >
                  {ConfigStore.currentPresetColor === preset.color && (
                    <CheckOutlined className="text-white text-xs" />
                  )}
                </div>
              </div>
            ))}
          </div>
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
                onChange={(value) => ConfigStore.toggleComponentPosition('LOGO', value)}
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
                onChange={(value) => ConfigStore.toggleComponentPosition('MENU', value)}
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
                onChange={(value) => ConfigStore.toggleComponentPosition('USER_ACTIONS', value)}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* 其他设置 */}
        <div >
          <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">其他设置</div>

          {/* <div className="setting-item-content"> */}
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Logo显示控制 */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[rgba(0,0,0,.88)]">显示 Logo</span>
              <Switch
                checked={ConfigStore.showLogo}
                onChange={(checked) => ConfigStore.toggleComponentShow('LOGO', checked)}
                className="ml-auto"
              />
            </div>
            {/* 页签显示控制 */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[rgba(0,0,0,.88)]">显示页签</span>
              <Switch
                checked={ConfigStore.showTabs}
                onChange={() => ConfigStore.toggleTabs()}
                className="ml-auto"
              />
            </div>
          </Space>
        </div>
        {/* </div> */}

      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer