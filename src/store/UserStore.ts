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
        runInAction(() => {
            this.allRoutes = routes
        })
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
}

export default new UserStore()