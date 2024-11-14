import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import CustomDrawer from '../CustomDrawer'
import { Switch, Tooltip } from 'antd'
import {
  LayoutOutlined,
  BgColorsOutlined,
  CheckOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import React from 'react'

const SettingDrawer = observer(() => {
  const { ConfigStore } = useStore()

  // 样式类
  const sectionTitleClass = "flex items-center gap-2 text-base font-medium mb-4"
  const itemLabelClass = "text-sm text-gray-600 dark:text-gray-300"

  // 主题模式选项
  const themeModeOptions = [
    { value: 'light', label: '浅色', icon: <SunOutlined /> },
    { value: 'dark', label: '深色', icon: <MoonOutlined /> },
    { value: 'system', label: '系统', icon: <DesktopOutlined /> }
  ]

  // 布局模式选项
  const layoutOptions = [
    { value: 'horizontal', label: '顶部导航', icon: <MenuUnfoldOutlined /> },
    { value: 'vertical', label: '侧边导航', icon: <MenuFoldOutlined /> },
    { value: 'mix', label: '混合导航', icon: <AppstoreOutlined /> }
  ]

  // 统一的设置处理函数，不自动关闭抽屉
  const handleLayoutChange = (mode: 'horizontal' | 'vertical' | 'mix') => {
    ConfigStore.setLayoutMode(mode)
  }

  const handleUserActionsPositionChange = (checked: boolean) => {
    ConfigStore.setUserActionsPosition(checked ? 'header' : 'sidebar')
  }

  const handleLogoPositionChange = (checked: boolean) => {
    ConfigStore.setLogoPosition(checked ? 'header' : 'sidebar')
  }

  return (
    <CustomDrawer 
      title="系统设置" 
      open={ConfigStore.settingDrawerVisible}
      onClose={ConfigStore.closeSettingDrawer}
      maskClosable={false}
    >
      <div className="space-y-6 p-4">
        {/* 主题设置 */}
        <div>
          <h3 className={sectionTitleClass}>
            <BgColorsOutlined /> 主题设置
          </h3>
          <div className="space-y-4">
            {/* 界面风格 */}
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>界面风格</span>
              <Switch
                checked={ConfigStore.themeStyle === 'dynamic'}
                onChange={() => ConfigStore.toggleTheme()}
                checkedChildren="灵动"
                unCheckedChildren="经典"
              />
            </div>

            {/* 主题模式 */}
            <div className="space-y-2">
              <span className={itemLabelClass}>主题模式</span>
              <div className="grid grid-cols-3 gap-2">
                {themeModeOptions.map(option => (
                  <Tooltip key={option.value} title={option.label}>
                    <button
                      onClick={() => ConfigStore.setThemeMode(option.value as 'light' | 'dark' | 'system')}
                      className={`
                        relative p-3 rounded-lg text-center transition-all
                        ${ConfigStore.themeMode === option.value
                          ? 'text-primary-500 bg-primary-50 dark:bg-primary-500/10'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="text-xl mb-1">{option.icon}</div>
                      <div className="text-xs">{option.label}</div>
                      {ConfigStore.themeMode === option.value && (
                        <CheckOutlined className="absolute right-2 top-2 text-xs text-primary-500" />
                      )}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 界面设置 */}
        <div>
          <h3 className={sectionTitleClass}>
            <LayoutOutlined /> 界面设置
          </h3>
          <div className="space-y-4">
            {/* Logo 显示 */}
            <div className="flex justify-between items-center">
              <span className={itemLabelClass}>显示 Logo</span>
              <Switch
                checked={ConfigStore.showLogo}
                onChange={() => ConfigStore.toggleShowLogo()}
              />
            </div>

            {/* 布局模式 */}
            <div className="space-y-2">
              <span className={itemLabelClass}>布局模式</span>
              <div className="grid grid-cols-3 gap-2">
                {layoutOptions.map(option => (
                  <Tooltip key={option.value} title={option.label}>
                    <button
                      onClick={() => handleLayoutChange(option.value as 'horizontal' | 'vertical' | 'mix')}
                      className={`
                        relative p-3 rounded-lg text-center transition-all
                        ${ConfigStore.layoutMode === option.value
                          ? 'text-primary-500 bg-primary-50 dark:bg-primary-500/10'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="text-xl mb-1">{option.icon}</div>
                      <div className="text-xs">{option.label}</div>
                      {ConfigStore.layoutMode === option.value && (
                        <CheckOutlined className="absolute right-2 top-2 text-xs text-primary-500" />
                      )}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Mix 布局特有设置 */}
            {ConfigStore.layoutMode === 'mix' && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className={itemLabelClass}>Logo 位置</span>
                  <Switch
                    checked={ConfigStore.logoPosition === 'header'}
                    onChange={handleLogoPositionChange}
                    checkedChildren="顶部"
                    unCheckedChildren="侧边"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className={itemLabelClass}>用户操作区</span>
                  <Switch
                    checked={ConfigStore.userActionsPosition === 'header'}
                    onChange={handleUserActionsPositionChange}
                    checkedChildren="顶部"
                    unCheckedChildren="侧边"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomDrawer>
  )
})

export default SettingDrawer