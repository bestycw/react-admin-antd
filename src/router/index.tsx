import { generateRoutes } from './generator'
import { CoRouteObject } from '../types/route.d'
import Layout from '../layout'
import { Navigate, Routes, useLocation } from 'react-router-dom'
import AuthBoundary from '@/components/AuthBoundary'
import { AnimatePresence } from 'framer-motion'
// import WaterfallPage from '@/pages/function/waterfall/waterfall';

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

export const Router: React.FC = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* ... 现有路由配置保持不变 */}
            </Routes>
        </AnimatePresence>
    );
};

export default createRoutes()
