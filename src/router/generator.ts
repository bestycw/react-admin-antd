import { lazy } from 'react'
import type { CoRouteObject, RouteConfig } from '../types/route'
import * as Icons from '@ant-design/icons'
import React from 'react'
const CONFIG_FILE_REGEX = "index.config.tsx"
// 获取所有页面文件，排除 index.config.ts 和 components 目录
const pages = import.meta.glob(
    ['@/pages/**/index.tsx', '@/pages/**/*.tsx', '!@/pages/**/components/**', '!@/pages/**/index.config.ts'], 
    { eager: true }
)

// 获取配置文件
const configs = import.meta.glob(
    ['@/pages/**/index.config.tsx','@/pages/**/index.config.tsx' ],
    { eager: true }
)

const PagesList = import.meta.glob(['@/pages/**/index.tsx', '@/pages/**/*.tsx', '!@/pages/**/components/**', '!@/pages/**/index.config.ts'], {  })
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
    // 先尝试获取组件自身的配置
    const config = component.routeConfig || {}
    
    if (!config.title) {
        // 尝试获取目录配置
        const dirConfigPath = path.replace(/\/[^/]+$/, '/index.config.ts')
        const dirConfig = configs[dirConfigPath]?.routeConfig

        if (dirConfig) {
            return dirConfig
        }

        // 如果都没有，使用默认配置
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

// 创建路由树节点
interface RouteNode extends CoRouteObject {
    children?: RouteNode[]
    isFile?: boolean
}

// 获取目录配置
function getDirConfig(parts: string[]): RouteConfig {
    // 从当前层级往上查找配置文件
    for (let i = parts.length - 1; i >= 0; i--) {
        const configPath = `/src/pages/${parts.slice(0, i + 1).join('/')}/${CONFIG_FILE_REGEX}`
        const dirConfig = configs[configPath]?.routeConfig
        if (dirConfig) {
            return dirConfig
        }
    }

    // 如果没有找到配置，使用默认配置
    const name = parts[parts.length - 1]
    return {
        title: name.charAt(0).toUpperCase() + name.slice(1),
        icon: generateIcon(name)
    }
}

// 创建路由树
function createRouteTree(paths: string[]): RouteNode[] {
    const tree: RouteNode[] = []
    const moduleMap = new Map<string, RouteNode>()

    paths.forEach(path => {
        const parts = getRelativePath(path)
        const fileName = parts[parts.length - 1]

        // 跳过配置文件
        if (fileName === CONFIG_FILE_REGEX) {
            return
        }

        const config = getRouteConfig(pages[path], path)

        // 判断是否是同级路由
        const isSameLevel = fileName === 'index.tsx' || 
            fileName.replace('.tsx', '') === parts[parts.length - 2]
            
        // 处理文件节点
        if (parts.length === 1 || (parts.length === 2 && isSameLevel)) {
            // 一级路由
            const Comp = lazy(() => PagesList[path]())
            const route: RouteNode = {
                path: formatRoutePath(parts),
                element: React.createElement(Comp),
                meta: {
                    title: config.title,
                    icon: config.icon,
                    roles: config.roles,
                    sort: config.sort,
                    layout: config.layout,
                    auth: config.auth
                },
                hidden: config.hidden,
                isFile: true
            }
            tree.push(route)
        } else {
            // 处理多级路由
            const pathParts = parts.slice(0, -1) // 移除文件名，获取目录路径
            let currentLevel = tree
            let currentPath: string[] = []

            // 逐级创建或获取路由节点
            for (let i = 0; i < pathParts.length; i++) {
                currentPath.push(pathParts[i])
                const dirConfig = getDirConfig(currentPath)
                const routePath = `/${currentPath.join('/')}`

                let moduleRoute = moduleMap.get(routePath)
                if (!moduleRoute) {
                    moduleRoute = {
                        path: routePath,
                        meta: {
                            title: dirConfig.title,
                            icon: dirConfig.icon,
                            roles: dirConfig.roles,
                            sort: dirConfig.sort,
                            layout: dirConfig.layout,
                            auth: dirConfig.auth
                        },
                        hidden: dirConfig.hidden,
                        children: []
                    }
                    moduleMap.set(routePath, moduleRoute)
                    
                    // 只在当前层级添加路由
                    if (i === 0) {
                        tree.push(moduleRoute)
                    } else {
                        const parentPath = `/${currentPath.slice(0, -1).join('/')}`
                        const parent = moduleMap.get(parentPath)
                        if (parent && parent.children) {
                            parent.children.push(moduleRoute)
                        }
                    }
                }

                currentLevel = moduleRoute.children as RouteNode[]
            }

            // 创建文件路由
            const Comp = lazy(() => PagesList[path]())
            const fileRoute: RouteNode = {
                path: formatRoutePath(parts),
                element: React.createElement(Comp),
                meta: {
                    title: config.title,
                    icon: config.icon,
                    roles: config.roles,
                    sort: config.sort,
                    layout: config.layout,
                    auth: config.auth
                },
                hidden: config.hidden,
                isFile: true
            }

            // 如果是同级路由，添加到父级的同级
            if (isSameLevel) {
                const parentPath = `/${currentPath.slice(0, -1).join('/')}`
                const parentLevel = parentPath === '' ? tree : moduleMap.get(parentPath)?.children as RouteNode[]
                if (parentLevel) {
                    parentLevel.push(fileRoute)
                }
            } else {
                currentLevel.push(fileRoute)
            }
        }
    })

    return sortRoutes(tree)
}

// 生成路由配置
export function generateRoutes(): { layoutRoutes: CoRouteObject[], independentRoutes: CoRouteObject[] } {
    const allRoutes = createRouteTree(Object.keys(pages))
    const layoutRoutes: CoRouteObject[] = []
    const independentRoutes: CoRouteObject[] = []

    // 分离布局路由和独立路由
    allRoutes.forEach(route => {
        if (route.meta?.layout === false) {
            independentRoutes.push(route)
        } else {
            layoutRoutes.push(route)
        }
    })

    return {
        layoutRoutes,
        independentRoutes
    }
}

