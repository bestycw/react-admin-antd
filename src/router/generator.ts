import { lazy } from 'react'
import type { CoRouteObject, RouteConfig } from '../types/route'
import * as Icons from '@ant-design/icons'
import React from 'react'

// 获取所有页面文件
const pages = import.meta.glob(['@/pages/**/index.tsx', '@/pages/**/*.tsx', '!@/pages/**/components/**'], {  
    eager: true
})
const PagesList = import.meta.glob(['@/pages/**/index.tsx', '@/pages/**/*.tsx', '!@/pages/**/components/**'])

// 图标映射
const iconMap = new Map(
    Object.entries(Icons)
        .filter(([key]) => key.endsWith('Outlined'))
        .map(([key, value]) => [key.replace('Outlined', '').toLowerCase(), value])
)

// 从路径中获取组件名称
function getComponentName(path: string): string {
    const parts = path.split('/')
    // 如果是 index.tsx，使用父文件夹名称
    if (parts[parts.length - 1] === 'index.tsx') {
        return parts[parts.length - 2]
    }
    // 否则使用文件名（不含扩展名）
    return parts[parts.length - 1].replace('.tsx', '')
}

// 获取组件的路由配置
function getRouteConfig(component: any, path: string): RouteConfig {
    const config = component.routeConfig || {}
    
    if (!config.title) {
        const name = getComponentName(path)
        return {
            title: name.charAt(0).toUpperCase() + name.slice(1),
            icon: generateIcon(name),
            layout: true,
            auth: true
        }
    }

    return config
}

// 生成图标组件
function generateIcon(iconName: string) {
    const Icon = iconMap.get(iconName.toLowerCase())
    return Icon ? React.createElement(Icon) : null
}

// 处理路由路径
function formatRoutePath(parts: string[]): string {
    // 移除最后的 index.tsx
    if (parts[parts.length - 1] === 'index.tsx') {
        parts.pop()
    } else {
        // 将最后一个元素的 .tsx 去掉
        parts[parts.length - 1] = parts[parts.length - 1].replace('.tsx', '')
    }
    return '/' + parts.join('/')
}

// 从完整路径中获取相对路径部分
function getRelativePath(fullPath: string): string[] {
    // 移除开头的 @/pages/ 或 /src/pages/
    const relativePath = fullPath
        .replace(/^@\/pages\//, '')
        .replace(/^\/src\/pages\//, '')
    return relativePath.split('/')
}

// 路由排序
function sortRoutes(routes: CoRouteObject[]): CoRouteObject[] {
    return routes
        .sort((a, b) => (a.meta?.sort || 0) - (b.meta?.sort || 0))
        .map(route => ({
            ...route,
            children: route.children ? sortRoutes(route.children) : undefined
        }))
}

// 生成路由配置
export function generateRoutes(): { layoutRoutes: CoRouteObject[], independentRoutes: CoRouteObject[] } {
    const layoutRoutes: CoRouteObject[] = []
    const independentRoutes: CoRouteObject[] = []
    const moduleMap = new Map<string, CoRouteObject>()

    // 处理所有页面文件
    for (const [path, module] of Object.entries(pages)) {
        const parts = getRelativePath(path)
        const config = getRouteConfig(module, path)
        console.log('config', PagesList[path])
        // 创建路由对象
        const route: CoRouteObject = {
            path: formatRoutePath(parts),
            element: lazy(PagesList[path]),
            meta: {
                title: config.title,
                icon: config.icon,
                roles: config.roles,
                sort: config.sort,
                layout: config.layout,
                auth: config.auth
            },
            hidden: config.hidden
        }

        // 判断是否需要布局
        if (config.layout === false) {
            // 独立路由
            independentRoutes.push(route)
            continue
        }

        // 处理需要布局的路由
        const isIndexFile = parts[parts.length - 1] === 'index.tsx'
        const moduleName = parts[0] // 一级路由名称

        if (parts.length === 1 || (parts.length === 2 && isIndexFile)) {
            // 直接的一级路由
            layoutRoutes.push(route)
        } else {
            // 需要创建或获取一级路由模块
            let moduleRoute = moduleMap.get(moduleName)
            
            if (!moduleRoute) {
                moduleRoute = {
                    path: `/${moduleName}`,
                    meta: {
                        title: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
                        icon: generateIcon(moduleName)
                    },
                    children: []
                }
                moduleMap.set(moduleName, moduleRoute)
                layoutRoutes.push(moduleRoute)
            }

            // 将当前路由添加为子路由
            moduleRoute.children = moduleRoute.children || []
            moduleRoute.children.push(route)
        }
    }

    return {
        layoutRoutes: sortRoutes(layoutRoutes),
        independentRoutes
    }
}

