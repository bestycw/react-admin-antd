import { generateRoutes } from './generator'
import { CoRouteObject } from '../types/route.d'
import Layout from '../layout'
import { Navigate, Routes, useLocation } from 'react-router-dom'
import AuthBoundary from '@/components/AuthBoundary'
export function createRoutes(): CoRouteObject[] {
    // 生成动态路由
    const { layoutRoutes, independentRoutes } = generateRoutes()

    const rootRoute: CoRouteObject = {
        path: '/',
        root: true,
        redirect: '/dashboard',
        element: (
            <AuthBoundary>
                <Layout />
            </AuthBoundary>
        ),
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
