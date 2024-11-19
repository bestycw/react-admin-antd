import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense, } from 'react'
import routes, { mergeRoutes, StaticRoutes } from './router'
// import GlobalConfig from './config/GlobalConfig'
import { useStore } from './store'
// import { CoRouteObject, isValidPath } from './types/route.d'
import React from 'react'
import PageProgress from '@/components/PageProgress'
import { CoRouteObject } from './types/route.d'
// import { authService } from '@/services/auth'        

const App = observer(() => {
    const { UserStore, MenuStore } = useStore()
    const { ConfigStore } = useStore()
    const RootRoutes = routes.find(route => route.root)
    console.log('app init')
    // 获取后端路由
    // console.log('UserStore.isLogin', UserStore.isLogin)

    if (UserStore.isLogin) {
        const dynamicRoutes: CoRouteObject[] = UserStore.realDynamicRoutes as CoRouteObject[]
        mergeRoutes(StaticRoutes, dynamicRoutes)
        RootRoutes.children = StaticRoutes
        MenuStore.initRoutesAndMenu(routes)

    }

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
