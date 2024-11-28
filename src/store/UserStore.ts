/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx"
import { CoRouteObject } from "../types/route.d"

export interface UserInfo {
    username: string
    avatar?: string
    roles: string[]
    email: string
    accessToken: string
    dynamicRoutesList: string[]
    permissions: string[]
}

export type ThemeStyle = 'light' | 'dark' | 'dynamic';

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
    permissions: string[] = []

    private initUserInfo() {
        const storedUserInfo = localStorage.getItem('userInfo')
        const token = localStorage.getItem('token')
        const expiresAt = localStorage.getItem('tokenExpiresAt')
        
        if (storedUserInfo && token) {
            if (expiresAt && new Date().getTime() < parseInt(expiresAt)) {
                runInAction(() => {
                    const parsedUserInfo = JSON.parse(storedUserInfo)
                    this.userInfo = parsedUserInfo
                    this.permissions = parsedUserInfo.permissions || []
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
        console.log('Setting user info:', userInfo)
        runInAction(() => {
            this.userInfo = userInfo
            this.isLogin = true
            this.permissions = userInfo.permissions || []
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
            this.permissions = []
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
        // console.log('Checking roles:', {
        //     userRoles: this.userInfo?.roles,
        //     requiredRoles: roles
        // })
        if (!roles?.length) return true // 如果没有指定角色要求，则默认有权限
        return this.userInfo?.roles?.some(userRole => 
            roles.includes(userRole)
        ) ?? false
    }

    hasAllRoles(roles: string[]): boolean {
        return this.userInfo?.roles 
            ? roles.every(role => this.userInfo?.roles.includes(role)) 
            : false
    }

    logout() {
       
        window.location.href = '/login'
        
        this.clearUserInfo()
    }

    // 根据用户角色过滤路由
    filterRoutesByRoles(routes: CoRouteObject[]): CoRouteObject[] {
        return routes.map(route => {
            const newRoute = { ...route }

            // 检查路由是否需要权限控制
            if (newRoute.meta?.roles?.length) {
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

    // 检查是否有某个权限
    hasPermission(code: string): boolean {
        // 如果权限列表包含 '*' 或为空，则拥有所有权限
        if (!this.permissions || this.permissions.includes('*') || this.permissions.length === 0) {
            return true
        }
        
        return this.permissions.includes(code)
    }
}

export default new UserStore()