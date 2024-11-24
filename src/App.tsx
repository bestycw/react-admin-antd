import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense } from 'react'
import routes from './router/index'

import { useStore } from './store'
// import React from 'react'
import PageProgress from '@/components/PageProgress'
import { CoRouteObject } from './types/route.d'
import { runInAction } from 'mobx'
console.log('routes', routes)
const App = observer(() => {
    const { UserStore, MenuStore ,ConfigStore} = useStore()
    let renderRoutes = routes

    console.log(' app init')

    if (UserStore.isLogin) {
        if (!UserStore.hasAllRoutes) {
            renderRoutes = UserStore.filterRoutesByRoles(routes)
            const rootRoute = renderRoutes.find(route => route.root) as CoRouteObject
            runInAction(() => {
                UserStore.setAllRoutes(renderRoutes)
                MenuStore.initRoutesAndMenu(rootRoute)

            })
        } else {
            renderRoutes = UserStore.allRoutes
        }
    }


    return (
        <ConfigProvider theme={ConfigStore.themeConfig}>
            <PageProgress />
            <Suspense>
                {useRoutes(renderRoutes as RouteObject[])}
            </Suspense>
        </ConfigProvider>
    )
})

export default App
