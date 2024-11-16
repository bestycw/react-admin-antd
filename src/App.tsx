import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense, useEffect } from 'react'
import { RemainingRoutes, StaticRoutes, DynamicRoutes } from './router'
import GlobalConfig from './config/GlobalConfig'
import { useStore } from './store'
import { CoRouteObject } from './types/route'
import React from 'react'
import PageProgress from '@/components/PageProgress'
import { authService } from '@/services/auth'
import { message } from 'antd'

// 合并路由方法
function mergeRoutes(baseRoutes: CoRouteObject[], newRoutes: CoRouteObject[]) {
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

const App = observer(() => {
    const { PermissionControl } = GlobalConfig
    const { UserStore, MenuStore } = useStore()
    const { ConfigStore } = useStore()

    // 初始化路由和菜单
    const initRoutesAndMenu = (routes: CoRouteObject[]) => {
        const homeRoute = routes.find(route => route.path === '/')
        if (homeRoute?.children) {
            MenuStore.routesToMenuItems(homeRoute.children)
            MenuStore.ensureSelectedKeys()
        }
    }

    // 获取后端路由
    const fetchBackendRoutes = async () => {
        try {
            const { data } = await authService.getDynamicRoutes()
            console.log('后端路由', data)
            if (data) {
                const routes = [...StaticRoutes, ...RemainingRoutes]
                mergeRoutes(routes, data)
                initRoutesAndMenu(routes)
            }
        } catch (error) {
            console.error('获取动态路由失败:', error)
            message.error('获取动态路由失败')
        }
    }

    useEffect(() => {
        if (!UserStore.isLogin) return

        const routes = [...StaticRoutes, ...RemainingRoutes]

        switch (PermissionControl) {
            case 'backend':
                fetchBackendRoutes()
                break

            case 'both':
                fetchBackendRoutes().then(() => {
                    mergeRoutes(routes, DynamicRoutes)
                    initRoutesAndMenu(routes)
                })
                break

            case 'fontend':
            default:
                mergeRoutes(routes, DynamicRoutes)
                initRoutesAndMenu(routes)
                break
        }
    }, [UserStore.isLogin, PermissionControl])

    return (
        <ConfigProvider theme={ConfigStore.themeConfig}>
            <PageProgress />
            <Suspense>
                {useRoutes([...StaticRoutes, ...RemainingRoutes] as RouteObject[])}
            </Suspense>
        </ConfigProvider>
    )
})

export default App
