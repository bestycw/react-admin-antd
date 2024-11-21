import { TableOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@/types/route'
import React from 'react'

export const routeConfig: RouteConfig = {
    title: '表格管理1',
    icon: <TableOutlined />,
    layout: true,
    auth: true,
    sort: 2
}