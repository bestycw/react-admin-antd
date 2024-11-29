import { SettingOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'
// import React from 'react'

export const routeConfig: RouteConfig = {
    title: '系统设置',
    icon: <SettingOutlined />,
    layout: true,
    auth: true,
    sort: 3
}