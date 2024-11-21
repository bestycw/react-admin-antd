import React from 'react'
import { Card } from 'antd'
import { DashboardOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'

// 路由配置
export const routeConfig: RouteConfig = {
    title: '仪表盘',
    icon: <DashboardOutlined />,
    layout: true,
    auth: true,
    sort: 0 // 放在最前面
}

const Dashboard: React.FC = () => {
    return (
        <div className="p-6">
            <Card title="仪表盘">
                欢迎使用管理系统
            </Card>
        </div>
    )
}

export default Dashboard 
