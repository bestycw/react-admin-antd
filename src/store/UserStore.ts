/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx"
import { CoRouteObject } from "../types/route.d"
import getGlobalConfig from "../config/GlobalConfig"
import { fetchBackendRoutes, formatBackendRoutes } from "../router/old_index"

export interface UserInfo {
    username: string
    avatar?: string
    roles: string[]
    accessToken: string
    dynamicRoutesList: string[]
}

class UserStore {
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.initUserInfo()
    }

    userInfo: UserInfo | null = null
    isLogin = false
    dynamicRoutes: CoRouteObject[] = []
    allRoutes: CoRouteObject[] = []
    isInitDynamicRoutes = false

    private initUserInfo() {
        const storedUserInfo = localStorage.getItem('userInfo')
        const token = localStorage.getItem('token')
        const expiresAt = localStorage.getItem('tokenExpiresAt')
        
        if (storedUserInfo && token) {
            if (expiresAt && new Date().getTime() < parseInt(expiresAt)) {
                runInAction(() => {
                    this.userInfo = JSON.parse(storedUserInfo)
                    this.isLogin = true
                    // 从缓存加载动态路由
                    const cachedRoutes = localStorage.getItem('dynamicRoutes')
                    if (cachedRoutes) {
                        this.dynamicRoutes = JSON.parse(cachedRoutes)
                        this.isInitDynamicRoutes = true
                    }
                })
            } else {
                this.clearUserInfo()
            }
        }
    }

    // async getDynamicRoutes() {
    //     try {
    //         const backRoutes = await fetchBackendRoutes()
    //         if (backRoutes) {
    //             // 缓存动态路由
    //             localStorage.setItem('dynamicRoutes', JSON.stringify(backRoutes))
    //         }
    //         return backRoutes
    //     } catch (error) {
    //         console.error('Failed to get dynamic routes:', error)
    //         throw error
    //     }
    // }

    setDynamicRoutes(routes: CoRouteObject[]) {
        runInAction(() => {
            this.dynamicRoutes = routes
            this.isInitDynamicRoutes = true
        })
    }

    setUserInfo(userInfo: UserInfo, remember = false) {
        runInAction(() => {
            this.userInfo = userInfo
            this.isLogin = true
            localStorage.setItem('token', userInfo.accessToken)

            if (remember) {
                const expiresAt = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                localStorage.setItem('tokenExpiresAt', expiresAt.toString())
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
            } else {
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            }
        })
    }

    clearUserInfo() {
        runInAction(() => {
            this.userInfo = null
            this.isLogin = false
            this.isInitDynamicRoutes = false
            this.dynamicRoutes = []
            this.allRoutes = []
        })
        
        // 清除所有相关存储
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('tokenExpiresAt')
        localStorage.removeItem('dynamicRoutes')
        sessionStorage.removeItem('userInfo')
    }

    setAllRoutes(routes: CoRouteObject[]) {
        // runInAction(() => {
            this.allRoutes = routes
        // })
    }

    // get realDynamicRoutes() {
    //     if (!this.dynamicRoutes.length) return []
        
    //     return getGlobalConfig('PermissionControl') === 'backend' 
    //         ? formatBackendRoutes(this.dynamicRoutes)
    //         : this.dynamicRoutes
    // }

    get hasAllRoutes() {
        return this.allRoutes.length > 0
    }

    get userRoleValue(): number {
        return this.userInfo?.rolesValue ?? -1
    }

    get userName(): string {
        return this.userInfo?.username ?? ''
    }

    get userRoles(): string[] {
        return this.userInfo?.roles ?? []
    }

    hasRole(role: string): boolean {
        return this.userInfo?.roles?.includes(role) ?? false
    }

    hasAnyRole(roles: string[]): boolean {
        return this.userInfo?.roles?.some(role => roles.includes(role)) ?? false
    }

    hasAllRoles(roles: string[]): boolean {
        return this.userInfo?.roles 
            ? roles.every(role => this.userInfo?.roles.includes(role)) 
            : false
    }

    logout() {
        this.clearUserInfo()
        window.location.href = '/login'
    }

    // 根据用户角色过滤路由
    filterRoutesByRoles(routes: CoRouteObject[]): CoRouteObject[] {
        return routes.map(route => {
            // 创建新的路由对象，避免修改原对象
            const newRoute = { ...route }

            // 检查路由是否需要权限控制
            if (newRoute.meta?.roles?.length) {
                // 如果用户没有该路由所需的任何角色，则隐藏该路由
                if (!this.hasAnyRole(newRoute.meta.roles)) {
                    newRoute.hidden = true
                }
            }

            // 递归处理子路由
            if (newRoute.children) {
                newRoute.children = this.filterRoutesByRoles(newRoute.children)
                
                // 如果所有子路由都被隐藏，则也隐藏父路由
                if (newRoute.children.every(child => child.hidden)) {
                    newRoute.hidden = true
                }
            }

            return newRoute
        }).filter(route => {
            // 过滤掉不需要显示的路由
            if (route.hidden) {
                return false
            }

            // 如果是根路由或没有子路由，直接返回
            if (route.root || !route.children) {
                return true
            }

            // 如果有子路由，确保至少有一个可见的子路由
            return route.children.some(child => !child.hidden)
        })
    }
}

export default new UserStore()