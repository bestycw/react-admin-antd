import { useRoutes, useNavigate, RouteObject } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense, useEffect } from 'react'
import { RemainingRoutes, StaticRoutes, DynamicRoutes } from './router'
import GlobalConfig from './config/GlobalConfig'
import { useStore } from './store'
import { CoRouteObject } from './types/route'

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

function App() {
    const { PermissionControl } = GlobalConfig
    const { UserStore, MenuStore } = useStore()
    const { isLogin } = UserStore
    const roles = UserStore.userInfo?.roles ?? []
    const navigate = useNavigate()

    useEffect(() => {
        if (isLogin) {
            let finalRoutes = routes
            
            if (!PermissionControl || PermissionControl === 'fontend') {
                console.log('前端控制路由')
                mergeRouteByPath(routes, DynamicRoutes)
                finalRoutes = routes
            } else if (PermissionControl === 'backend') {
                console.log('后端控制路由')
                // TODO: 从后端获取路由
            } else if (PermissionControl === 'both') {
                console.log('协同控制路由')
            }
            const HomePageRoutes = finalRoutes.filter((item) => item.path === '/')[0]   

            // 更新菜单并获取第一个可用路径
            const firstPath = MenuStore.updateMenuFromRoutes(HomePageRoutes.children || [])
            console.log(firstPath)
            // 如果当前在登录页或根路径，则导航到第一个可用路径
            if (firstPath && (window.location.pathname === '/login' || window.location.pathname === '/')) {
                navigate(firstPath)
            }
        }
    }, [isLogin, MenuStore])

    return <Suspense>{useRoutes(routes as RouteObject[])}</Suspense>
}

export default App
