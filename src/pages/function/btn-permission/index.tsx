// 按钮权限
import React, { useState, useEffect } from 'react'
import { Button, Card, Space, Select, message, Row, Col, Divider, Alert } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, DownloadOutlined } from '@ant-design/icons'
import Permission from '@/components/Permission'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'

const { Option } = Select

export default observer(function BtnPermission() {
    const { UserStore } = useStore()
    const [currentRole, setCurrentRole] = useState('admin')

    // 模拟不同角色的选项
    const roleOptions = [
        { label: '管理员', value: 'admin', desc: '拥有所有权限' },
        { label: '普通用户', value: 'user', desc: '拥有新增和编辑权限' },
        { label: '访客', value: 'guest', desc: '仅拥有查看权限' }
    ]

    // 初始化和切换角色时设置权限
    useEffect(() => {
        UserStore.setDemoPermissions(currentRole);
    }, [currentRole]);

    // 在组件卸载时恢复用户信息
    useEffect(() => {
        return () => {
            UserStore.restoreUserInfo();
        }
    }, []);

    const handleRoleChange = (value: string) => {
        setCurrentRole(value)
        message.success(`切换为${roleOptions.find(role => role.value === value)?.label}角色`)
    }

    // 重置用户信息的处理函数
    const handleReset = () => {
        UserStore.restoreUserInfo();
        setCurrentRole('admin');
        message.success('已重置用户信息');
    }

    const currentRoleInfo = roleOptions.find(role => role.value === currentRole)
    return (
        <div >
            <Card title="按钮权限演示">
                <Alert
                    message="权限演示说明"
                    description={
                        <div>
                            <p>当前用户角色：{UserStore.userRoles[0] === 'admin' ? '管理员' : UserStore.userRoles[0] === 'user' ? '普通用户' : '访客'}</p>
                            <p>当前角色说明：{currentRoleInfo?.desc}</p>
                            <p>当前拥有的权限码：{JSON.stringify(UserStore.userInfo?.permissions['/function/btn-permission'])}</p>
                            <p className="text-red-500">注意：权限修改功能仅用于演示，实际项目中权限应该由后端控制</p>
                        </div>
                    }
                    type="info"
                    showIcon
                    className="mb-4"
                />
                
                <div className="mb-4 flex items-center">
                    <span className="mr-2">切换角色：</span>
                    <Select
                        value={currentRole}
                        onChange={handleRoleChange}
                        style={{ width: 120 }}
                        className="mr-4"
                    >
                        {roleOptions.map(role => (
                            <Option key={role.value} value={role.value}>
                                {role.label}
                            </Option>
                        ))}
                    </Select>
                    <Button onClick={handleReset}>重置</Button>
                </div>

                <Space direction="vertical" style={{ width: '100%' }}>
                    {/* 基础操作按钮组 */}
                    <Card title="基础操作按钮" size="small">
                        <Space wrap>
                            <Permission permissions={['create']}>
                                <Button type="primary" icon={<PlusOutlined />}>
                                    新增
                                </Button>
                            </Permission>

                            <Permission permissions={['edit']}>
                                <Button icon={<EditOutlined />}>
                                    编辑
                                </Button>
                            </Permission>

                            <Permission permissions="delete">
                                <Button danger icon={<DeleteOutlined />}>
                                    删除
                                </Button>
                            </Permission>
                        </Space>
                    </Card>

                    {/* 组合权限按钮 */}
                    <Card title="组合权限按钮" size="small">
                        <Space wrap>
                            <Permission permissions={['edit', 'delete']} mode="every">
                                <Button type="primary" icon={<SettingOutlined />}>
                                    高级操作（需要编辑和删除权限）
                                </Button>
                            </Permission>

                            <Permission permissions={['edit', 'create']} mode="some">
                                <Button icon={<DownloadOutlined />}>
                                    导出（需要编辑或新增权限）
                                </Button>
                            </Permission>
                        </Space>
                    </Card>

                    {/* 角色权限按钮 */}
                    <Card title="角色权限按钮" size="small">
                        <Space wrap>
                            <Permission roles="admin">
                                <Button type="primary" danger>
                                    管理员专属按钮
                                </Button>
                            </Permission>

                            <Permission roles={['admin', 'user']}>
                                <Button type="dashed">
                                    管理员和用户可见
                                </Button>
                            </Permission>
                        </Space>
                    </Card>

                    {/* 角色和权限组合 */}
                    <Card title="角色和权限组合" size="small">
                        <Space wrap>
                            <Permission roles="admin" permissions="super_action">
                                <Button type="primary">
                                    超级操作（管理员且有super_action权限）
                                </Button>
                            </Permission>

                            <Permission 
                                roles={['admin', 'user']} 
                                permissions={['edit', 'delete']}
                                mode="every"
                            >
                                <Button>
                                    特殊操作（管理员或用户，且同时具有编辑和删除权限）
                                </Button>
                            </Permission>
                        </Space>
                    </Card>

                    {/* 带有 fallback 的示例 */}
                    <Card title="带有 fallback 的按钮" size="small">
                        <Permission
                            permissions={['special_action']}
                            fallback={
                                <Button type="dashed" disabled>
                                    无权限查看
                                </Button>
                            }
                        >
                            <Button type="primary">
                                特殊功能按钮
                            </Button>
                        </Permission>
                    </Card>
                </Space>
            </Card>
        </div>
    )
})

export const routeConfig = {
    title: 'route.function.btn-permission',
    sort: 1,
}