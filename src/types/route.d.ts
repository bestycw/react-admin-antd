import { ReactNode } from 'react'
import { RouteObject } from 'react-router-dom'

// 确保路径以 '/' 开头的字符串类型
type PathWithSlash = `/${string}`
export interface RouteConfig {
  title?: string
  icon?: ReactNode
  layout?: boolean
  auth?: boolean
  roles?: string[]
  sort?: number
  hidden?: boolean
  hiddenMenu?: boolean
  // 可以添加更多配置项
}
// 扩展 RouteObject 类型，使 path 必须以 '/' 开头
export interface CoRouteObject extends Omit<RouteObject, 'path'> {
  path?: string
  root?: boolean
  redirect?: string
  meta?: {
    title?: string
    icon?: React.ReactNode
    roles?: string[]
    sort?: number
    layout?: boolean
    auth?: boolean
    hiddenMenu?: boolean
  }
  children?: CoRouteObject[]
  hidden?: boolean
}

// 用于验证路径格式的类型守卫
export function isValidPath(path: string): path is PathWithSlash {
  return path.startsWith('/') || path === '/'
}

// 用于创建路由配置的辅助函数
export function createRoute(route: CoRouteObject): CoRouteObject {
  if (route.path && !isValidPath(route.path)) {
    throw new Error(`Invalid route path: ${route.path}. Path must start with '/'`)
  }
  return route
} 