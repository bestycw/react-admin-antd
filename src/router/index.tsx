

import AuthBoundary from "../components/AuthBoundary";
import HomePage from "../layout";
import Login from "../pages/Login";
import { CoRouteObject } from "../types/route";
const staticRoutesList: CoRouteObject[] = []
const dynamicRoutesList: CoRouteObject[] = []
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const staticModules: Record<string, any> = import.meta.glob(
    ["./modules/static/*.tsx"],
    {
        eager: true
    }
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicModules: Record<string, any> = import.meta.glob(
    ["./modules/dynamic/*.tsx"],
    {
        eager: true
    }
);

export const staticFirstPathList: string[] = []
export const dynamicFirstPathList: string[] = []
function handleOriginRoute() {
    //静态路由处理
    Object.keys(staticModules).forEach(key => {
        getRouteFirstPath(staticFirstPathList, key)
        staticRoutesList.push(staticModules[key].default);
    });
    //动态路由处理
    Object.keys(dynamicModules).forEach(key => {
        getRouteFirstPath(dynamicFirstPathList, key)
        dynamicRoutesList.push(dynamicModules[key].default);
    });

}

function getRouteFirstPath(pathList: string[], path: string) {
    const regex = /\/([^/]+)\.tsx/;
    const match = path.match(regex);
    if (match) {
        pathList.push(match[1])
    } else {
        throw new Error('路由文件命名错误')!
    }

}
handleOriginRoute()
//静态路由
export const StaticRoutes: CoRouteObject[] = [
    {
        path: '/',
        element: <AuthBoundary><HomePage /></AuthBoundary>,
        children: staticRoutesList
    }
]
//动态路由
export const DynamicRoutes: CoRouteObject[] = [
    {
        path: '/',
        element: <AuthBoundary><HomePage /></AuthBoundary>,
        children: dynamicRoutesList
    }
]
//登录、错误页
export const RemainingRoutes: CoRouteObject[] = [
    {
        path: '/login',
        element: <Login />,
    },
]

