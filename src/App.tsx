import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRoutes, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense } from 'react'
import routes from './router'
import { useStore } from './store'
import { CoRouteObject } from './types/route.d'
import { runInAction } from 'mobx'
import { authService } from "./services/auth";
import { deepClone } from './utils/json'
const App = observer(() => {
    const { UserStore, MenuStore, ConfigStore } = useStore()
    let renderRoutes = routes
    if (authService.isAuthenticated()) {
        //TODO 需要优化，不能每次都重新过滤路由, 应该在用户信息更新时过滤
        renderRoutes = UserStore.filterRoutesByRoles(deepClone(routes))
        const rootRoute = renderRoutes.find(route => route.root) as CoRouteObject
        runInAction(() => {
                UserStore.setAllRoutes(renderRoutes)
                MenuStore.initRoutesAndMenu(rootRoute)
            })

    }
    return (
        <ConfigProvider theme={ConfigStore.themeConfig}>
            {/* <PageProgress /> */}
            <Suspense>
                {useRoutes(renderRoutes as RouteObject[])}
            </Suspense>
        </ConfigProvider>
    )
})

export default App
