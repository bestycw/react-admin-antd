import { generateRoutes } from './generator'
import { CoRouteObject } from '../types/route.d'
import Layout from '../layout'
import { Navigate } from 'react-router-dom'
import AuthBoundary from '@/components/AuthBoundary'

// 生成路由配置
export function createRoutes(): CoRouteObject[] {
    // 生成动态路由
    const { layoutRoutes, independentRoutes } = generateRoutes()

    const rootRoute: CoRouteObject = {
        path: '/',
        root: true,
        redirect: '/dashboard',
        element:
            <AuthBoundary><Layout />
            </AuthBoundary>,
        children: layoutRoutes
    }

    // 创建根路由
    const routes: CoRouteObject[] = [

        rootRoute,
        ...independentRoutes,
        {
            path: '/*',
            element: <Navigate to="/error/404" replace />

        }

    ]

    return routes
}

export default createRoutes()
