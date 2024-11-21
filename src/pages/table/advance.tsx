import React, { useEffect, useState } from 'react'
import { 
    Table, Card, Button, Space, Input, Form, message, 
    Modal, Select, DatePicker, Popconfirm, Tag, Tooltip 
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { observer } from 'mobx-react-lite'
import { 
    SearchOutlined, ReloadOutlined, PlusOutlined,
    EditOutlined, DeleteOutlined, ExportOutlined,
    ImportOutlined, SettingOutlined, DownloadOutlined,
    EyeOutlined, TableOutlined
} from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'

const { RangePicker } = DatePicker

// 路由配置
export const routeConfig: RouteConfig = {
    title: '高级表格',
    icon: <TableOutlined />,
    layout: true,
    auth: true,
    sort: 2,
    roles: ['admin'] // 可以添加权限控制
}

// 定义表格数据类型
interface TableItem {
    id: number
    name: string
    age: number
    address: string
    email: string
    status: 'active' | 'inactive'
    department: string
    role: string
    createdAt: string
    updatedAt: string
}

// 定义搜索表单类型
interface SearchForm {
    name?: string
    status?: 'active' | 'inactive'
    department?: string
    role?: string
    dateRange?: [string, string]
}

const AdvanceTable: React.FC = observer(() => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<TableItem[]>([])
    const [selectedRows, setSelectedRows] = useState<TableItem[]>([])
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [currentRecord, setCurrentRecord] = useState<TableItem | null>(null)
    const [settingVisible, setSettingVisible] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState<string[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条记录`
    })
    const [form] = Form.useForm<SearchForm>()
    const [editForm] = Form.useForm()

    // 定义表格列
    const allColumns: ColumnsType<TableItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
            fixed: 'left',
            sorter: true,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 120,
            fixed: 'left',
            sorter: true,
            render: (text, record) => (
                <a onClick={() => handleView(record)}>{text}</a>
            )
        },
        {
            title: '年龄',
            dataIndex: 'age',
            width: 80,
            sorter: true,
        },
        {
            title: '地址',
            dataIndex: 'address',
            width: 200,
            ellipsis: true,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 180,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            filters: [
                { text: '活跃', value: 'active' },
                { text: '不活跃', value: 'inactive' },
            ],
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                    {status === 'active' ? '活跃' : '不活跃'}
                </Tag>
            )
        },
        {
            title: '部门',
            dataIndex: 'department',
            width: 120,
            filters: [
                { text: '技术部', value: '技术部' },
                { text: '市场部', value: '市场部' },
                { text: '运营部', value: '运营部' },
            ],
        },
        {
            title: '角色',
            dataIndex: 'role',
            width: 120,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 180,
            sorter: true,
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            width: 180,
            sorter: true,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Tooltip title="查看">
                        <Button 
                            type="link" 
                            icon={<EyeOutlined />} 
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button 
                            type="link" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Popconfirm
                            title="确定要删除这条记录吗？"
                            onConfirm={() => handleDelete(record)}
                        >
                            <Button 
                                type="link" 
                                danger 
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ]

    // 获取当前可见列
    const columns = allColumns.filter(col => 
        visibleColumns.includes(col.dataIndex as string) || 
        col.dataIndex === 'id' || 
        col.key === 'action'
    )

    // 加载数据
    const loadData = async (params = {}) => {
        try {
            setLoading(true)
            const response = await mockFetchData(params)
            setData(response.data)
            setPagination(prev => ({
                ...prev,
                total: response.total
            }))
        } catch (error) {
            message.error('加载数据失败')
        } finally {
            setLoading(false)
        }
    }

    // 处理表格变化
    const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
        setPagination(newPagination)
        loadData({
            page: newPagination.current,
            pageSize: newPagination.pageSize,
            ...form.getFieldsValue(),
            ...filters,
            sortField: sorter.field,
            sortOrder: sorter.order
        })
    }

    // 处理搜索
    const handleSearch = async () => {
        setPagination(prev => ({ ...prev, current: 1 }))
        await loadData({
            page: 1,
            pageSize: pagination.pageSize,
            ...form.getFieldsValue()
        })
    }

    // 处理重置
    const handleReset = () => {
        form.resetFields()
        setPagination(prev => ({ ...prev, current: 1 }))
        loadData({
            page: 1,
            pageSize: pagination.pageSize
        })
    }

    // 处理查看
    const handleView = (record: TableItem) => {
        setCurrentRecord(record)
        // TODO: 实现查看详情功能
    }

    // 处理编辑
    const handleEdit = (record: TableItem) => {
        setCurrentRecord(record)
        editForm.setFieldsValue(record)
        setEditModalVisible(true)
    }

    // 处理删除
    const handleDelete = async (record: TableItem) => {
        try {
            // TODO: 调用删除 API
            message.success('删除成功')
            loadData({
                page: pagination.current,
                pageSize: pagination.pageSize
            })
        } catch (error) {
            message.error('删除失败')
        }
    }

    // 处理批量删除
    const handleBatchDelete = async () => {
        try {
            // TODO: 调用批量删除 API
            message.success('批量删除成功')
            setSelectedRows([])
            loadData({
                page: pagination.current,
                pageSize: pagination.pageSize
            })
        } catch (error) {
            message.error('批量删除失败')
        }
    }

    // 处理保存
    const handleSave = async () => {
        try {
            const values = await editForm.validateFields()
            // TODO: 调用保存 API
            message.success('保存成功')
            setEditModalVisible(false)
            loadData({
                page: pagination.current,
                pageSize: pagination.pageSize
            })
        } catch (error) {
            message.error('保存失败')
        }
    }

    // 处理导出
    const handleExport = () => {
        // TODO: 实现导出功能
        message.success('导出成功')
    }

    // 处理导入
    const handleImport = () => {
        // TODO: 实现导入功能
        message.success('导入成功')
    }

    // 处理列选择
    const handleColumnChange = (checkedValues: string[]) => {
        setVisibleColumns(checkedValues)
        localStorage.setItem('tableColumns', JSON.stringify(checkedValues))
    }

    // 初始化
    useEffect(() => {
        // 加载保存的列设置
        const savedColumns = localStorage.getItem('tableColumns')
        if (savedColumns) {
            setVisibleColumns(JSON.parse(savedColumns))
        } else {
            setVisibleColumns(allColumns.map(col => col.dataIndex as string).filter(Boolean))
        }

        loadData({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
    }, [])

    return (
        <div >
            {/* 搜索表单 */}
            <Card className="mb-4">
                <Form
                    form={form}
                    layout="inline"
                    onFinish={handleSearch}
                >
                    <Form.Item name="name" label="姓名">
                        <Input placeholder="请输入姓名" allowClear />
                    </Form.Item>
                    <Form.Item name="status" label="状态">
                        <Select
                            placeholder="请选择状态"
                            allowClear
                            options={[
                                { label: '活跃', value: 'active' },
                                { label: '不活跃', value: 'inactive' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="department" label="部门">
                        <Select
                            placeholder="请选择部门"
                            allowClear
                            options={[
                                { label: '技术部', value: '技术部' },
                                { label: '市场部', value: '市场部' },
                                { label: '运营部', value: '运营部' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="dateRange" label="创建时间">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                            >
                                搜索
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleReset}
                            >
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            {/* 表格 */}
            <Card
                title="高级表格"
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentRecord(null)
                                editForm.resetFields()
                                setEditModalVisible(true)
                            }}
                        >
                            新增
                        </Button>
                        <Button
                            icon={<ImportOutlined />}
                            onClick={handleImport}
                        >
                            导入
                        </Button>
                        <Button
                            icon={<ExportOutlined />}
                            onClick={handleExport}
                        >
                            导出
                        </Button>
                        <Tooltip title="列设置">
                            <Button
                                icon={<SettingOutlined />}
                                onClick={() => setSettingVisible(true)}
                            />
                        </Tooltip>
                        {selectedRows.length > 0 && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleBatchDelete}
                            >
                                批量删除
                            </Button>
                        )}
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    rowSelection={{
                        selectedRowKeys: selectedRows.map(row => row.id),
                        onChange: (_, rows) => setSelectedRows(rows)
                    }}
                    scroll={{ x: 1500 }}
                />
            </Card>

            {/* 编辑弹窗 */}
            <Modal
                title={currentRecord ? '编辑记录' : '新增记录'}
                open={editModalVisible}
                onOk={handleSave}
                onCancel={() => setEditModalVisible(false)}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="age"
                        label="年龄"
                        rules={[{ required: true, message: '请输入年龄' }]}
                    >
                        <Input type="number" />
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
                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select
                            options={[
                                { label: '活跃', value: 'active' },
                                { label: '不活跃', value: 'inactive' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label="部门"
                        rules={[{ required: true, message: '请选择部门' }]}
                    >
                        <Select
                            options={[
                                { label: '技术部', value: '技术部' },
                                { label: '市场部', value: '市场部' },
                                { label: '运营部', value: '运营部' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 列设置弹窗 */}
            <Modal
                title="列设置"
                open={settingVisible}
                onOk={() => setSettingVisible(false)}
                onCancel={() => setSettingVisible(false)}
            >
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择要显示的列"
                    value={visibleColumns}
                    onChange={handleColumnChange}
                    options={allColumns
                        .filter(col => col.dataIndex && col.dataIndex !== 'id' && col.key !== 'action')
                        .map(col => ({
                            label: col.title,
                            value: col.dataIndex as string
                        }))}
                />
            </Modal>
        </div>
    )
})

// Mock 数据函数
const mockFetchData = async (params: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const total = 100
    const data = Array.from({ length: params.pageSize || 10 }).map((_, index) => ({
        id: (params.page - 1) * (params.pageSize || 10) + index + 1,
        name: `用户 ${index + 1}`,
        age: Math.floor(Math.random() * 50) + 18,
        address: `地址 ${index + 1}`,
        email: `user${index + 1}@example.com`,
        status: Math.random() > 0.5 ? 'active' : 'inactive',
        department: ['技术部', '市场部', '运营部'][Math.floor(Math.random() * 3)],
        role: ['管理员', '普通用户', '访客'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    }))

    return {
        data,
        total,
        page: params.page || 1,
        pageSize: params.pageSize || 10
    }
}

export default AdvanceTable
