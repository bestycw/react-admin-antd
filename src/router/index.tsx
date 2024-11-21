import { generateRoutes } from './generator'
import { CoRouteObject } from '../types/route.d'
// import { lazy } from 'react'
import React from 'react'
import Layout from '../layout'

// 基础布局
// const BasicLayout = lazy(() => import('../layout'))

// 生成路由配置
export  function createRoutes(): CoRouteObject[] {
    // 生成动态路由
    const { layoutRoutes, independentRoutes } =  generateRoutes()
    console.log('routes init',layoutRoutes,independentRoutes)
    const rootRoute: CoRouteObject = {
        path: '/',
        root: true,
        element: <Layout></Layout>,
        children: layoutRoutes
    }
    // 创建根路由
    // const rootRoute: CoRouteObject = {
    //     path: '/',
    //     element: <BasicLayout />,
    //     root: true,
    //     children: dynamicRoutes
    // }

    // // 添加其他基础路由
    const routes: CoRouteObject[] = [
        rootRoute,
        ...independentRoutes
    ]    
    // console.log(routes)

    return routes
}

export default await createRoutes()
