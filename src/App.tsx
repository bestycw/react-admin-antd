import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import routes, { StaticRoutes, DynamicRoutes, pagesRoutes } from './router'
import GlobalConfig from './config/GlobalConfig'
import { useStore } from './store'
import { CoRouteObject, isValidPath } from './types/route.d'
import React from 'react'
import PageProgress from '@/components/PageProgress'
import { authService } from '@/services/auth'
import { message } from 'antd'

// 合并路由方法
function mergeRoutes(baseRoutes: CoRouteObject[], newRoutes: CoRouteObject[]) {
   console.log('mergeRoutes', baseRoutes, newRoutes)
    newRoutes.forEach(newRoute => {
        const existingRoute = baseRoutes.find(route => route.path === newRoute.path)
        if (existingRoute) {
            if (newRoute.children) {
                existingRoute.children = existingRoute.children || []
                mergeRoutes(existingRoute.children, newRoute.children)
            }
        } else {
            baseRoutes.push(newRoute)
        }
    })
}
const pagesRoutesKeys = Object.keys(pagesRoutes)
function formatBackendRoutes(data: CoRouteObject[]) {
    if (!data || !data.length) return []

    data.forEach(route => {
        // 1. 将后端返回的路由中的path处理成以/开头的字符串
        if (route.path) {
            if (!isValidPath(route.path)) {
                route.path = `/${route.path}`
            } else {
                route.path = `${route.path}`
            }

        } else {
            throw new Error('后端返回的路由中缺少path!')
        }

        // 2. 为后端返回路由增加element
        const index = pagesRoutesKeys.findIndex(ev => ev.includes(route.path as string))
        const Component = lazy(pagesRoutes[pagesRoutesKeys[index]]);
        route.element = <Component />

        // 3. 如果有子路由，递归处理
        if (route.children && route.children.length > 0) {
            formatBackendRoutes(route.children)
        }
    })
    return data
}
function formatRoutes(routes: CoRouteObject[]) {
    
    routes.forEach(route => {
        if (!route.redirect && route.children && route.children.length > 0) {
            route.redirect = route.children[0].path
        }
    })
}
const App = observer(() => {
    const { PermissionControl } = GlobalConfig
    const { UserStore, MenuStore } = useStore()
    const { ConfigStore } = useStore()
    // console.log('app init')
    // 初始化路由和菜单

    const RootRoutes = routes.find(route => route.root)
    useEffect(() => {
        console.log('app init')
    }, [])
    // 获取后端路由
    const fetchBackendRoutes = async () => {
        try {
            const data = await authService.getDynamicRoutes()
            console.log('后端路由', data)
            //处理后端提供的路由，符合动态路由格式 TODO 
            const backRoutes = formatBackendRoutes(data)
            console.log('后端路由', backRoutes)

            // const { data } = result
            if (backRoutes) {
                mergeRoutes(StaticRoutes, backRoutes)

                RootRoutes.children = StaticRoutes
                // initRoutesAndMenu(routes)
            }
        } catch (error) {
            console.error('获取动态路由失败:', error)
            message.error('获取动态路由失败')
        }
    }
    useLayoutEffect(() => {
    if (UserStore.isLogin) {
        switch (PermissionControl) {
            case 'backend':
                fetchBackendRoutes()
                break

            case 'both':
                fetchBackendRoutes().then(() => {
                    mergeRoutes(StaticRoutes, DynamicRoutes)
                    // initRoutesAndMenu(routes)
                })
                break

            case 'fontend':
            default:
                mergeRoutes(StaticRoutes, DynamicRoutes)

                RootRoutes.children = StaticRoutes
                // initRoutesAndMenu(routes)
                break
        }
        //
        // 处理最终的routes，增加redirect等属性

        //MenuStore缓存最终的routes
        formatRoutes(routes)
        MenuStore.setFinalRoutes(routes)

    }
    }, [UserStore.isLogin,routes])
    // console.log(routes[0].children)
    return (
        <ConfigProvider theme={ConfigStore.themeConfig}>
            <PageProgress />
            <Suspense>
                {useRoutes(routes as RouteObject[])}
            </Suspense>
        </ConfigProvider>
    )
})

export default App
