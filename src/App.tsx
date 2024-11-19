import { ConfigProvider, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense } from 'react'
import routes, { mergeRoutes, StaticRoutes } from './router'

import { useStore } from './store'
import React from 'react'
import PageProgress from '@/components/PageProgress'
import { CoRouteObject } from './types/route.d'
// import { authService } from '@/services/auth'        

const App = observer(() => {
    const { UserStore, MenuStore } = useStore()
    const { ConfigStore } = useStore()
    let renderRoutes: CoRouteObject[] = routes
    const RootRoutes = renderRoutes.find(route => route.root)
    console.log(' app init')

    if (UserStore.isLogin) {
        if (!UserStore.isInitDynamicRoutes) {
           return(
            <div>
                <Spin />
            </div>
           )
        }
        if (!UserStore.hasAllRoutes) {
            const dynamicRoutes: CoRouteObject[] = UserStore.realDynamicRoutes as CoRouteObject[]
            // console.log('dynamicRoutes', dynamicRoutes)
            mergeRoutes(StaticRoutes, dynamicRoutes)
            if (RootRoutes) {
                RootRoutes.children = StaticRoutes
                MenuStore.initRoutesAndMenu(routes)
            }
            UserStore.setAllRoutes(routes)
            // return null
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
