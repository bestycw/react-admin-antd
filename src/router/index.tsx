/* eslint-disable react-refresh/only-export-components */
import React, { lazy } from "react";
import AuthBoundary from "../components/AuthBoundary";
import HomePage from "../layout";
import Login from "../pages/login";
import { CoRouteObject, isValidPath } from "../types/route.d";
import Forbidden from "../pages/error/403";
import NotFound from "../pages/error/404";
import { Navigate } from 'react-router-dom';
import { authService } from "../services/auth";
import { message } from "antd";
import getGlobalConfig from "../config/GlobalConfig";
// 首先定义页面路由
export const pagesRoutes = import.meta.glob(["/src/pages/**/*.tsx"], {});
export const pagesRoutesKeys = Object.keys(pagesRoutes)
const staticRoutesList: CoRouteObject[] = []
const dynamicRoutesList: CoRouteObject[] = []

// 然后定义模块
const staticModules: Record<string, any> = import.meta.glob(
    ["./modules/static/*.tsx"],
    {
        eager: true
    }
);

const dynamicModules: Record<string, any> = import.meta.glob(
    ["./modules/dynamic/*.tsx"],
    {
        eager: true
    }
);

const staticFirstPathList: string[] = []
const dynamicFirstPathList: string[] = []

function getRouteFirstPath(pathList: string[], path: string) {
    const regex = /\/([^/]+)\.tsx/;
    const match = path.match(regex);
    if (match) {
        pathList.push(match[1])
    } else {
        throw new Error('路由文件命名错误')!
    }
}

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

handleOriginRoute()

//静态路由
export const StaticRoutes: CoRouteObject[] = staticRoutesList
console.log(StaticRoutes)
//动态路由
export const DynamicRoutes: CoRouteObject[] = dynamicRoutesList

export function formatBackendRoutes(data: CoRouteObject[]) {
    if (!data || !data.length) return []

    return data.map(route => {
        const formattedRoute: CoRouteObject = { ...route }

        if (formattedRoute.path) {
            if (!isValidPath(formattedRoute.path)) {
                formattedRoute.path = `/${formattedRoute.path}`
            }
        } else {
            throw new Error('后端返回的路由中缺少path!')
        }

        const componentPath = pagesRoutesKeys.find(key => key.includes(formattedRoute.path as string))
        if (componentPath) {
            const Component = lazy(pagesRoutes[componentPath])
            formattedRoute.element = <Component />
        } else {
            console.warn(`未找到路径 ${formattedRoute.path} 对应的组件`)
        }

        if (formattedRoute.children && formattedRoute.children.length > 0) {
            formattedRoute.children = formatBackendRoutes(formattedRoute.children)
        }

        return formattedRoute
    })
}

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

export function mergeRoutes(baseRoutes: CoRouteObject[], newRoutes: CoRouteObject[]) {
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

export const fetchBackendRoutes = async () => {
    try {
        switch (getGlobalConfig('PermissionControl')) {
            case 'backend':
                {
                    const data = await authService.getDynamicRoutes()
                    localStorage.setItem('dynamicRoutes', JSON.stringify(data))
                    return data
                }
            case 'mix':

                break;
                // return [...StaticRoutes, ...DynamicRoutes]
            case 'fontend':
                return DynamicRoutes
            default:
                return DynamicRoutes
        }
    } catch (error) {
        console.error('获取动态路由失败:', error)
        message.error('获取动态路由失败')
        return null
    }
}

export default routes