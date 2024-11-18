import React from "react";
import AuthBoundary from "../components/AuthBoundary";
import HomePage from "../layout";
import Login from "../pages/login";
import { CoRouteObject } from "../types/route";
import Forbidden from "../pages/error/403";
import NotFound from "../pages/error/404";
import { Navigate } from 'react-router-dom';
const staticRoutesList: CoRouteObject[] = []
const dynamicRoutesList: CoRouteObject[] = []
//页面路由 用来后端动态路由匹配使用
export const pagesRoutes = import.meta.glob("/src/pages/**/*.tsx");
console.log(pagesRoutes)
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

 const staticFirstPathList: string[] = []
 const dynamicFirstPathList: string[] = []
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
export const StaticRoutes: CoRouteObject[] = staticRoutesList
//动态路由
export const DynamicRoutes: CoRouteObject[] = dynamicRoutesList
//登录、错误页、根页面
const routes: CoRouteObject[] = [
    {
        path: '/',
        root: true,
        element: <AuthBoundary><HomePage /></AuthBoundary>,
        children: []
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/403',
        element: <Forbidden />,
    },
    {
        path: '/404',
        element: <NotFound />,
    },
    {
        path: '/*',
        element: <Navigate to="/404" replace />,
    }
]

export default routes