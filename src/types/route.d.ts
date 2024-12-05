import { ReactNode } from 'react'
import { RouteObject } from 'react-router-dom'

// 确保路径以 '/' 开头的字符串类型
type PathWithSlash = `/${string}`
export interface RouteConfig {
  title?: string
  icon?: ReactNode
  layout?: boolean
  element?: ReactNode | LazyExoticComponent
  roles?: string[]
  sort?: number
  hidden?: boolean
  hiddenInMenu?: boolean
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
    hidden?: boolean
    hiddenInMenu?: boolean
  }
  children?: CoRouteObject[]
  // hidden?: boolean
}
