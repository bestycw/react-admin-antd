/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from 'react'
import type { CoRouteObject, RouteConfig } from '../types/route'
import * as Icons from '@ant-design/icons'
import React from 'react'

// 常量定义
const CONFIG_FILE_REGEX = "index.config.tsx"

// 获取所有页面文件
const pages = import.meta.glob([
    '@/pages/**/index.tsx',
    '@/pages/**/*.tsx',
    '!@/pages/**/components/**',
    '!@/pages/**/*.config.ts'
], { eager: true })

// 获取配置文件
const configs: Record<string, { routeConfig?: RouteConfig }> = import.meta.glob([
    '@/pages/**/index.config.tsx'
], { eager: true })

const PagesList = import.meta.glob([
    '@/pages/**/index.tsx',
    '@/pages/**/*.tsx',
    '!@/pages/**/components/**',
    '!@/pages/**/*.config.ts'
])

// 图标映射
const iconMap = new Map(
    Object.entries(Icons)
        .filter(([key]) => key.endsWith('Outlined'))
        .map(([key, value]) => [key.replace('Outlined', '').toLowerCase(), value])
)

// 路由节点类型
interface RouteNode extends CoRouteObject {
    children?: RouteNode[]
    isFile?: boolean
}

// 路由工具函数
const routeUtils = {
    // 获取组件名称
    getComponentName(path: string): string {
        const parts = path.split('/')
        return parts[parts.length - 1] === 'index.tsx'
            ? parts[parts.length - 2]
            : parts[parts.length - 1].replace('.tsx', '')
    },

    // 生成图标
    generateIcon(iconName: string) {
        const Icon = iconMap.get(iconName.toLowerCase())
        return Icon ? React.createElement(Icon as React.ComponentType) : null
    },

    // 格式化路径
    formatRoutePath(parts: string[]): string {
        return '/' + parts
            .filter(part => part !== 'index.tsx')
            .map(part => part.replace('.tsx', ''))
            .join('/')
    },

    // 获取相对路径
    getRelativePath(fullPath: string): string[] {
        return fullPath
            .replace(/^@\/pages\//, '')
            .replace(/^\/src\/pages\//, '')
            .split('/')
    },

    // 判断是否是同级路由
    isSameLevel(fileName: string, parentName: string): boolean {
        return fileName === 'index.tsx' || fileName.replace('.tsx', '') === parentName
    }
}

// 路由配置处理函数
const routeConfigHandler = {
    // 获取组件配置
    getRouteConfig(component: any, path: string): RouteConfig {
        // 1. 优先使用组件内部配置
        if (component.routeConfig) {
            return component.routeConfig
        }

        // 2. 尝试获取目录配置文件
        const pathParts = path.split('/')
        let currentPath = ''
        
        // 从当前层级往上查找配置文件
        for (let i = pathParts.length - 1; i >= 0; i--) {
            currentPath = pathParts.slice(0, i).join('/')
            const configPath = `/src/pages/${currentPath}/${CONFIG_FILE_REGEX}`
            const dirConfig = configs[configPath]?.routeConfig

            if (dirConfig) {
                return {
                    ...dirConfig,
                    // 如果是子路由，使用自己的标题
                    title: i === pathParts.length - 1 ? dirConfig.title : 
                        routeUtils.getComponentName(path).charAt(0).toUpperCase() + 
                        routeUtils.getComponentName(path).slice(1)
                }
            }
        }

        // 3. 使用默认配置
        const name = routeUtils.getComponentName(path)
        return {
            title: name.charAt(0).toUpperCase() + name.slice(1),
            icon: routeUtils.generateIcon(name),
            layout: true,
            auth: true
        }
    },

    // 创建路由节点
    createRouteNode(path: string, config: RouteConfig): RouteNode {
        const component = lazy(() => PagesList[path]() as Promise<{ default: React.ComponentType<any> }>)
        return {
            path: routeUtils.formatRoutePath(routeUtils.getRelativePath(path)),

            element: React.createElement(component),
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
    }
}

// 路由树处理函数
const routeTreeHandler = {
    // 创建路由树
    createRouteTree(paths: string[]): RouteNode[] {
        const tree: RouteNode[] = []
        const moduleMap = new Map<string, RouteNode>()

        // 处理所有路由
        paths.forEach(path => {
            if (path.endsWith('.config.ts') || path.endsWith('.config.tsx')) return

            const parts = routeUtils.getRelativePath(path)
            const config = routeConfigHandler.getRouteConfig(pages[path], path)
            const route = routeConfigHandler.createRouteNode(path, config)

            // 处理路由层级
            this.handleRouteLevels(route, parts, tree, moduleMap)
        })

        return this.sortRoutes(tree)
    },

    // 处理路由层级
    handleRouteLevels(route: RouteNode, parts: string[], tree: RouteNode[], moduleMap: Map<string, RouteNode>) {
        const fileName = parts[parts.length - 1]
        const isFirstLevel = parts.length === 1 || 
            (parts.length === 2 && routeUtils.isSameLevel(fileName, parts[0]))

        if (isFirstLevel) {
            tree.push(route)
            return
        }

        // 处理多级路由
        // let currentPath = ''
        let currentParent: RouteNode | undefined
        
        // 逐级创建或获取父级路由
        for (let i = 0; i < parts.length - 1; i++) {
            const parentPath = parts.slice(0, i + 1).join('/')
        //   const  currentPath = parentPath

            if (!moduleMap.has(parentPath)) {
                // 尝试获取父级配置
                const configPath = `/src/pages/${parentPath}/${CONFIG_FILE_REGEX}`
                const parentConfig = configs[configPath]?.routeConfig || {
                    title: parts[i].charAt(0).toUpperCase() + parts[i].slice(1),
                    icon: routeUtils.generateIcon(parts[i])
                }

                const parentRoute: RouteNode = {
                    path: `/${parentPath}`,
                    meta: {
                        title: parentConfig.title,
                        icon: parentConfig.icon,
                        roles: parentConfig.roles,
                        sort: parentConfig.sort,
                        layout: parentConfig.layout,
                        auth: parentConfig.auth
                    },
                    hidden: parentConfig.hidden,
                    children: []
                }

                moduleMap.set(parentPath, parentRoute)

                if (i === 0) {
                    // 一级路由直接添加到树中
                    tree.push(parentRoute)
                } else if (currentParent?.children) {
                    // 将当前路由添加到父路由的子路由中
                    currentParent.children.push(parentRoute)
                }
            }

            currentParent = moduleMap.get(parentPath)
        }

        // 将当前路由添加到最后一级父路由的子路由中
        if (currentParent?.children) {
            currentParent.children.push(route)
        }
    },

    // 路由排序
    sortRoutes(routes: RouteNode[]): RouteNode[] {
        const sortedRoutes = routes
            .sort((a, b) => (a.meta?.sort || 0) - (b.meta?.sort || 0))
            .map(route => ({
                ...route,
                children: route.children ? this.sortRoutes(route.children) : undefined
            }));

        // 在排序后处理重定向
        return this.handleRedirects(sortedRoutes);
    },

    // 处理重定向
    handleRedirects(routes: RouteNode[]): RouteNode[] {
        return routes.map(route => {
            // 如果有子路由但没有 element
            if (route.children?.length && !route.element && !route.isFile) {
                const firstVisibleChild = route.children.find(child => !child.hidden);
                if (firstVisibleChild) {
                    route.redirect = firstVisibleChild.path;
                }
            }
            return route;
        });
    }
}

// 生成路由配置
export function generateRoutes(): { layoutRoutes: CoRouteObject[], independentRoutes: CoRouteObject[] } {
    const allRoutes = routeTreeHandler.createRouteTree(Object.keys(pages))
    console.log(allRoutes)
    // 分离布局路由和独立路由
    return allRoutes.reduce((acc, route) => {
        if (route.meta?.layout === false || route.meta?.layout === undefined) {
            acc.independentRoutes.push(route)
        } else {
            acc.layoutRoutes.push(route)
        }
        return acc
    }, { layoutRoutes: [], independentRoutes: [] } as { 
        layoutRoutes: CoRouteObject[], 
        independentRoutes: CoRouteObject[] 
    })
}

