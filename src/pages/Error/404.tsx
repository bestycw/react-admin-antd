import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { WarningOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'

// 路由配置
export const routeConfig: RouteConfig = {
    title: '404',
    icon: <WarningOutlined />,
    layout: false,
    auth: false,
    // hidden: true // 在菜单中隐藏
}

const NotFound: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Result
            status="404"
            title="404"
            subTitle="抱歉，您访问的页面不存在。"
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    返回首页
                </Button>
            }
        />
    )
}

export default NotFound 