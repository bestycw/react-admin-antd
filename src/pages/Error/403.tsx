import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { StopOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'

// 路由配置
export const routeConfig: RouteConfig = {
    title: '403',
    icon: <StopOutlined />,
    layout: false,
    auth: false,
    // hidden: true // 在菜单中隐藏
}

const Forbidden: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Result
            status="403"
            title="403"
            subTitle="抱歉，您没有访问此页面的权限。"
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    返回首页
                </Button>
            }
        />
    )
}

export default Forbidden 