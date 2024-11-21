import React, { useEffect, useState } from 'react'
import { Table, Card } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { observer } from 'mobx-react-lite'

// 定义表格数据类型
interface TableItem {
    id: number
    name: string
    age: number
    address: string
    email: string
}

const BasicTable: React.FC = observer(() => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<TableItem[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    })

    // 定义表格列
    const columns: ColumnsType<TableItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 120,
        },
        {
            title: '年龄',
            dataIndex: 'age',
            width: 80,
        },
        {
            title: '地址',
            dataIndex: 'address',
            width: 200,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 180,
        },
    ]

    // 加载数据
    const loadData = async (params = {}) => {
        try {
            setLoading(true)
            const response = await mockFetchData(params)
            setData(response.data)
            setPagination({
                ...pagination,
                total: response.total
            })
        } catch (error) {
            console.error('加载数据失败:', error)
        } finally {
            setLoading(false)
        }
    }

    // 处理表格变化
    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination)
        loadData({
            page: newPagination.current,
            pageSize: newPagination.pageSize,
        })
    }

    // 初始加载
    useEffect(() => {
        loadData({
            page: pagination.current,
            pageSize: pagination.pageSize
        })
    }, [])

    return (
        <div>
            <Card title="基础表格">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>
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
    }))

    return {
        data,
        total,
        page: params.page || 1,
        pageSize: params.pageSize || 10
    }
}

export default BasicTable 