
import { useRoutes } from 'react-router-dom'
import './App.css'
import './index.css'
import { Suspense } from 'react'
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
  const { AuthStore, UserStore } = useStore();
  const { isLogin } = AuthStore
  const { userInfo: { roles } } = UserStore
  console.log(roles)
  //处理动态路由
  if (isLogin) {
    if (!PermissionControl || PermissionControl === 'fontend') {
      console.log('前端控制路由')
      mergeRouteByPath(routes, DynamicRoutes)
    } else if (PermissionControl === 'backend') {
      //根据角色信息从后端获取路由列表
      //同一化处理
      console.log('后端控制路由')
    } else if (PermissionControl === 'both') {
      console.log('协同控制路由')
    }
  }


  console.log('app render')


  return (
    <Suspense >{useRoutes(routes)}</Suspense>
  )
}

export default App
