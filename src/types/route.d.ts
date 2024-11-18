import { RouteObject } from 'react-router-dom'

// 确保路径以 '/' 开头的字符串类型
type PathWithSlash = `/${string}`

// 扩展 RouteObject 类型，使 path 必须以 '/' 开头
export interface CoRouteObject extends Omit<RouteObject, 'path'> {
  path?: PathWithSlash
  root?: boolean
  redirect?: string
  meta?: {
    title?: string
    icon?: React.ReactNode
    roles?: string[]
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