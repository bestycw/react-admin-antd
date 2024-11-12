import { lazy } from "react";
import { CoRouteObject } from "../../../types/route";
/* eslint-disable react-refresh/only-export-components */
const Demo1 = lazy(() => import('../../../pages/demo1'))


const demo2Route: CoRouteObject = {
    path: '/demo2',
    element: <Demo1 />,
    meta: {
        title: 'demo2',
        icon: 'icon-demo1',
        // roles: ['admin', 'common']
    },
    children: [
        {
            path: '/demo2-2',
            element: <Demo1 />,
            meta: {
                title: 'ddemo2-1',
                icon: 'icon-ddemo2',
                roles: ['admin']
            }
        }
    ]
}
export default demo2Route