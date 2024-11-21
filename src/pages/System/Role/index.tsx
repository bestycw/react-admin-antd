import React, { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Tree, Space, message } from 'antd'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'

// 路由配置
export const routeConfig: RouteConfig = {
    title: '角色管理',
    icon: <SettingOutlined />,
    layout: true,
    auth: true,
    roles: ['admin'],
    sort: 1
}

interface RoleItem {
    id: number
    name: string
    description: string
    permissions: string[]
    createdAt: string
}

const RoleManagement: React.FC = observer(() => {
    const { UserStore } = useStore()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<RoleItem[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [permissionModalVisible, setPermissionModalVisible] = useState(false)
    const [currentRole, setCurrentRole] = useState<RoleItem | null>(null)
    const [form] = Form.useForm()

    // 将路由转换为树形结构
    const getPermissionTree = () => {
        const routes = UserStore.allRoutes
        const convertToTreeData = (routes: any[]): any[] => {
            return routes.map(route => ({
                title: route.meta?.title || route.path,
                key: route.path,
                children: route.children ? convertToTreeData(route.children) : undefined,
                disabled: !route.meta?.title // 如果没有标题，说明是布局路由，禁用选择
            }))
        }
        return convertToTreeData(routes)
    }

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: RoleItem) => (
                <Space>
                    <Button type="link" onClick={() => handleConfigPermission(record)}>
                        配置权限
                    </Button>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    // 处理配置权限
    const handleConfigPermission = (role: RoleItem) => {
        setCurrentRole(role)
        setPermissionModalVisible(true)
    }

    // 处理编辑
    const handleEdit = (role: RoleItem) => {
        setCurrentRole(role)
        form.setFieldsValue(role)
        setModalVisible(true)
    }

    // 处理删除
    const handleDelete = (role: RoleItem) => {
        // TODO: 实现删除逻辑
        message.success('删除成功')
    }

    // 处理保存
    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            // TODO: 实现保存逻辑
            message.success('保存成功')
            setModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('Validate Failed:', error)
        }
    }

    // 处理权限保存
    const handlePermissionSave = (checkedKeys: any) => {
        // TODO: 实现权限保存逻辑
        message.success('权限配置成功')
        setPermissionModalVisible(false)
    }

    return (
        <div className="p-6">
            <Card
                title="角色管理"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setCurrentRole(null)
                            form.resetFields()
                            setModalVisible(true)
                        }}
                    >
                        新增角色
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            {/* 编辑弹窗 */}
            <Modal
                title={currentRole ? '编辑角色' : '新增角色'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="角色名称"
                        rules={[{ required: true, message: '请输入角色名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 权限配置弹窗 */}
            <Modal
                title="配置权限"
                open={permissionModalVisible}
                onOk={handlePermissionSave}
                onCancel={() => setPermissionModalVisible(false)}
                width={600}
            >
                <Tree
                    checkable
                    defaultExpandAll
                    treeData={getPermissionTree()}
                    defaultCheckedKeys={currentRole?.permissions}
                />
            </Modal>
        </div>
    )
})

export default RoleManagement 