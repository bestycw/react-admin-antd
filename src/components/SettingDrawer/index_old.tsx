import { Drawer, Divider, Switch, Radio, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { LayoutBits } from '@/store/ConfigStore'
import React from 'react'

const SettingDrawer = observer(() => {
    const { ConfigStore } = useStore()

    return (
        <Drawer
            title="主题设置"
            placement="right"
            open={ConfigStore.settingDrawerVisible}
            onClose={() => ConfigStore.toggleDrawer('setting')}
        >
            <div className="space-y-4">
                <div>
                    <h3 className="mb-2">布局模式</h3>
                    <Radio.Group
                        value={ConfigStore.currentLayoutMode}
                        onChange={e => ConfigStore.setLayoutMode(e.target.value)}
                    >
                        <Space direction="vertical">
                            <Radio value="VERTICAL">垂直</Radio>
                            <Radio value="HORIZONTAL">水平</Radio>
                            <Radio value="MIX">混合</Radio>
                        </Space>
                    </Radio.Group>
                </div>

                <Divider />

                <div>j
                    <h3 className="mb-2">组件位置</h3>
                    <Space direction="vertical">
                        <div>
                            <span className="mr-2">菜单显示位置：</span>
                            <Space>
                                <Switch
                                    checked={ConfigStore.showHeaderMenu}
                                    onChange={() => ConfigStore.toggleComponentPosition('MENU', 'IN_HEADER')}
                                /> 顶部
                                <Switch
                                    checked={ConfigStore.showSidebarMenu}
                                    onChange={() => ConfigStore.toggleComponentPosition('MENU', 'IN_SIDEBAR')}
                                /> 侧边
                            </Space>
                        </div>
                        <div>
                            <span className="mr-2">Logo显示位置：</span>
                            <Space>
                                <Switch
                                    checked={ConfigStore.showHeaderLogo}
                                    onChange={() => ConfigStore.toggleComponentPosition('LOGO', 'IN_HEADER')}
                                /> 顶部
                                <Switch
                                    checked={ConfigStore.showSidebarLogo}
                                    onChange={() => ConfigStore.toggleComponentPosition('LOGO', 'IN_SIDEBAR')}
                                /> 侧边
                            </Space>
                        </div>
                    </Space>
                </div>

                <Divider />

                <div>
                    <h3 className="mb-2">主题设置</h3>
                    <Space direction="vertical">
                        <div>
                            <span className="mr-2">暗色模式：</span>
                            <Switch
                                checked={ConfigStore.isDarkMode}
                                onChange={() => ConfigStore.toggleDarkMode()}
                            />
                        </div>
                        <div>
                            <span className="mr-2">主题风格：</span>
                            <Radio.Group
                                value={ConfigStore.themeStyle}
                                onChange={e => ConfigStore.setThemeStyle(e.target.value)}
                            >
                                <Radio value="dynamic">动态</Radio>
                                <Radio value="classic">经典</Radio>
                            </Radio.Group>
                        </div>
                    </Space>
                </div>
            </div>
        </Drawer>
    )
})

export default SettingDrawer