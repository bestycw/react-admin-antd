import { lazy } from "react";
import { CoRouteObject } from "../../../types/route";
/* eslint-disable react-refresh/only-export-components */
const Demo1 = lazy(() => import('../../../pages/demo1'))


const demo2Route: CoRouteObject = {
    path: '/table',
    element: <Demo1 />,
    meta: {
        title: '表格',
        // icon: 'icon-demo2',
        // isPermission: true,
        // roles: ['admin', 'common']
    },
    children: [
        {
            path: '/table-common',
            element: <Demo1 />,
            meta: {
                title: '普通表格',
                // icon: 'icon-demo2',
                // roles: ['admin', 'common']
            }
        }
    ]
}
export default demo2Route