import { TableOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import { CoRouteObject } from '../../../types/route'
import React from 'react'
const BasicTable = lazy(() => import('../../../pages/table/basic'))
const AdvanceTable = lazy(() => import('../../../pages/table/advance'))
const tableRoute: CoRouteObject = {
    path: '/table',
    meta: {
        title: '表格页面',
        icon: <TableOutlined />,
    },
    children: [
        {
            path: '/table/basic',
            element: <BasicTable />,
            meta: {
                title: '基础表格',
            },
        },
        {
            path: '/table/advance',
            element: <AdvanceTable />,
            meta: {
                title: '高级表格',
            },
        },
    ],
}

export default tableRoute