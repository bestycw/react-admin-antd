import React, { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, message } from 'antd'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'
import { observer } from 'mobx-react-lite'
import { PermissionsCode } from '../../types/permission'
import Permissions from '@/components/Permission'
// 路由配置
export const routeConfig: RouteConfig = {
    title: '用户管理',  
    icon: <UserOutlined />,
    layout: true,
    auth: true,
    // roles: ['admin'],
    sort: 2
}

interface UserItem {
    id: number
    username: string
    email: string
    roles: string[]
    status: 'active' | 'inactive'
    createdAt: string
}

const UserManagement: React.FC = observer(() => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<UserItem[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserItem | null>(null)
    const [form] = Form.useForm()
    console.log(setLoading,setData)
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: string[]) => roles.join(', '),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => status === 'active' ? '活跃' : '禁用',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: UserItem) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Permissions code={PermissionsCode.SYSTEM.USER.EDIT}>
                        <Button 
                            type="link" 
                            onClick={() => handleToggleStatus(record)}
                        >
                            {record.status === 'active' ? '禁用' : '启用'}
                        </Button>
                    </Permissions>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    // 处理编辑
    const handleEdit = (user: UserItem) => {
        setCurrentUser(user)
        form.setFieldsValue(user)
        setModalVisible(true)
    }

    // 处理状态切换
    const handleToggleStatus = (user: UserItem) => {
        // TODO: 实现状态切换逻辑
        console.log(user)
        message.success('状态更新成功')
    }

    // 处理删除
    const handleDelete = (user: UserItem) => {
        console.log(user)
        // TODO: 实现删除逻辑
        message.success('删除成功')
    }

    // 处理保存
    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            console.log(values)
            // TODO: 实现保存逻辑
            message.success('保存成功')
            setModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('Validate Failed:', error)
        }
    }

    return (
        <div className="p-6">
            <Card
                title="用户管理"
                extra={
                    <Permissions code={PermissionsCode.SYSTEM.USER.ADD}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setCurrentUser(null)
                            form.resetFields()
                            setModalVisible(true)
                        }}
                    >
                        新增用户    
                    </Button>
                    </Permissions>
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
                title={currentUser ? '编辑用户' : '新增用户'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {!currentUser && (
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="roles"
                        label="角色"
                        rules={[{ required: true, message: '请选择角色' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择角色"
                            options={[
                                { label: '管理员', value: 'admin' },
                                { label: '普通用户', value: 'user' },
                                { label: '访客', value: 'guest' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select
                            options={[
                                { label: '活跃', value: 'active' },
                                { label: '禁用', value: 'inactive' }
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
})

export default UserManagement 