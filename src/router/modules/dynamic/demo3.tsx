import { lazy } from "react";
import { CoRouteObject } from "../../../types/route";
/* eslint-disable react-refresh/only-export-components */
const Demo1 = lazy(() => import('../../../pages/demo1'))


const demo3Route: CoRouteObject = {
    path: '/demo3',
    element: <Demo1 />,
    meta: {
        title: 'demo3',
        icon: 'icon-demo3',
        // roles: ['admin', 'common']
    },
    children: [
        {
            path: '/demo3-1',
            element: <Demo1 />,
            meta: {
                title: 'demo3-1',
                icon: 'icon-demo3',
                // roles: ['admin', 'common']
            }
        }
    ]
}
export default demo3Route