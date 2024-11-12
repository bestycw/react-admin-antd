import { lazy } from "react";
import { CoRouteObject } from "../../../types/route";
/* eslint-disable react-refresh/only-export-components */
const Demo1 = lazy(() => import('../../../pages/demo1'))


const demo1Route: CoRouteObject = {
    path: '/dashboard',
    element: <Demo1 />,
    meta: {
        title: 'Dashboard',
        // icon: 'icon-demo1',
        // roles: ['admin', 'common']
    }
}
export default demo1Route