import { generateRoutes } from './generator'
import { CoRouteObject } from '../types/route.d'
import Layout from '../layout'
import { Navigate, Routes, useLocation } from 'react-router-dom'
import AuthBoundary from '@/components/AuthBoundary'
// import Dashboard from '@/pages/dashboard'
// import System from '@/pages/system'
// import User from '@/pages/system/user'
import { lazy } from 'react'
const User= lazy(() => import('@/pages/system/user'))
const Dashboard = lazy(() => import('@/pages/dashboard/dashboard'))
// 生成路由配置
export function createRoutes(): CoRouteObject[] {
    // 生成动态路由
    const { layoutRoutes, independentRoutes } = generateRoutes()

    const rootRoute: CoRouteObject = {
        path: '/',
        root: true,
        redirect: '/dashboard',
        element:
            <AuthBoundary>
                <Layout />
            </AuthBoundary>,
        children: [
            ...layoutRoutes
        ]
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

export const Router: React.FC = () => {
    const location = useLocation();

    return (

            <Routes location={location} key={location.pathname}>
                {/* ... 现有路由配置保持不变 */}
            </Routes>
  
    );
};

export default createRoutes()
