import { Drawer, Divider, Switch, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'

interface SettingDrawerProps {
  open: boolean
  onClose: () => void
}

const SettingDrawer = observer(({ open, onClose }: SettingDrawerProps) => {
  const { ConfigStore } = useStore()

  return (
    <Drawer
      title="系统设置"
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
    >
      <div className="space-y-6">
        {/* 主题设置 */}
        <div>
          <h3 className="text-base font-medium mb-4">主题设置</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>深色模式</span>
              <Switch
                checked={ConfigStore.isDarkMode}
                onChange={(checked) => ConfigStore.setDarkMode(checked)}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>紧凑模式</span>
              <Switch
                checked={ConfigStore.isCompactMode}
                onChange={(checked) => ConfigStore.setCompactMode(checked)}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* 界面设置 */}
        <div>
          <h3 className="text-base font-medium mb-4">界面设置</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>主题色</span>
              <Select
                value={ConfigStore.primaryColor}
                onChange={(value) => ConfigStore.setPrimaryColor(value)}
                style={{ width: 120 }}
                options={[
                  { label: '默认蓝', value: '#1890ff' },
                  { label: '拂晓蓝', value: '#1677ff' },
                  { label: '薄暮红', value: '#f5222d' },
                  { label: '火山橙', value: '#fa541c' },
                  { label: '日暮黄', value: '#faad14' },
                  { label: '极光绿', value: '#52c41a' },
                  { label: '明青色', value: '#13c2c2' },
                  { label: '酱紫色', value: '#722ed1' },
                ]}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>导航模式</span>
              <Select
                value={ConfigStore.navMode}
                onChange={(value) => ConfigStore.setNavMode(value)}
                style={{ width: 120 }}
                options={[
                  { label: '顶部导航', value: 'horizontal' },
                  { label: '侧边导航', value: 'vertical' },
                  { label: '混合导航', value: 'mix' },
                ]}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* 其他设置 */}
        <div>
          <h3 className="text-base font-medium mb-4">其他设置</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>标签页模式</span>
              <Switch
                checked={ConfigStore.isTabMode}
                onChange={(checked) => ConfigStore.setTabMode(checked)}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>固定头部</span>
              <Switch
                checked={ConfigStore.isFixedHeader}
                onChange={(checked) => ConfigStore.setFixedHeader(checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
})

export default SettingDrawer 