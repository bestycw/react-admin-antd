import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, useNavigate, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense, useEffect } from 'react'
import { RemainingRoutes, StaticRoutes, DynamicRoutes } from './router'
import GlobalConfig from './config/GlobalConfig'
import { useStore } from './store'
import { CoRouteObject } from './types/route'
import React from 'react'
import PageProgress from '@/components/PageProgress'

function mergeRouteByPath(to: CoRouteObject[], from: CoRouteObject[]) {
    for (let i = 0; i < from.length; i++) {
        const fromItem = from[i];
        const index = to.findIndex((toItem) => {
            return toItem.path === fromItem.path
        })
        if (index > -1) {
            const toItem = to[index]
            if (!toItem.children) {
                toItem.children = []
            }
            if (fromItem.children ) {
                mergeRouteByPath(toItem.children, fromItem.children)
            }
        }else{
            to.push(fromItem)
        }
    }
    if(from.length===0) return to
}

const routes = [...StaticRoutes, ...RemainingRoutes]

const App = observer(() => {
    const { PermissionControl } = GlobalConfig
    const { UserStore, MenuStore } = useStore()
    const { isLogin } = UserStore
    const { ConfigStore } = useStore()

    useEffect(() => {
        if (isLogin) {
            let finalRoutes = routes
            
            if (!PermissionControl || PermissionControl === 'fontend') {
                mergeRouteByPath(routes, DynamicRoutes)
                finalRoutes = routes
            } else if (PermissionControl === 'backend') {
                // TODO: 从后端获取路由
            } else if (PermissionControl === 'both') {
                // TODO: 协同控制路由
            }
            const HomePageRoutes = finalRoutes.filter((item) => item.path === '/')[0]   

            MenuStore.routesToMenuItems(HomePageRoutes.children || [])
            MenuStore.ensureSelectedKeys()
        }
    }, [isLogin])

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
