/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx"
import { CoRouteObject } from "../types/route.d"
import getGlobalConfig from "../config/GlobalConfig"
import {  DynamicRoutes, fetchBackendRoutes, formatBackendRoutes, } from "../router"
export interface UserInfo {
    username: string
    avatar?: string
    roles: string[]
    accessToken: string
    rolesValue: number
}
class UserStore {
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.initUserInfo()
    }

    userInfo: UserInfo | null = null
    isLogin = false
    dynamicRoutes: CoRouteObject[] = []
    finalRoutes: CoRouteObject[] = []
    private initUserInfo() {
        const storedUserInfo = localStorage.getItem('userInfo')
        const token = localStorage.getItem('token')
        const expiresAt = localStorage.getItem('tokenExpiresAt')
        const dynamicRoutes = localStorage.getItem('dynamicRoutes')
        if (storedUserInfo && token) {
            if (expiresAt && new Date().getTime() < parseInt(expiresAt)) {
                this.userInfo = JSON.parse(storedUserInfo)
                this.isLogin = true
                if (dynamicRoutes) {
                    this.dynamicRoutes = JSON.parse(dynamicRoutes)
                }
            } else {
                this.clearUserInfo()
            }
        }
    }
   async  setDynamicRoutes() {
        const backRoutes = await fetchBackendRoutes() as CoRouteObject[]
        // localStorage.setItem('dynamicRoutes', JSON.stringify(backRoutes))
        this.dynamicRoutes = backRoutes
    }
    setUserInfo(userInfo: UserInfo, remember = false) {
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
    }

    clearUserInfo() {
        this.userInfo = null
        this.isLogin = false
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('tokenExpiresAt')
        sessionStorage.removeItem('userInfo')
        localStorage.removeItem('dynamicRoutes')
    }

    logout() {
        this.clearUserInfo()
        window.location.href = '/login'
    }

    hasRole(role: string): boolean {
        return this.userInfo?.roles?.includes(role) ?? false
    }

    hasAnyRole(roles: string[]): boolean {
        return this.userInfo?.roles?.some(role => roles.includes(role)) ?? false
    }

    hasAllRoles(roles: string[]): boolean {
        return this.userInfo?.roles ? roles.every(role => this.userInfo?.roles.includes(role)) : false
    }

    get realDynamicRoutes() {
        if(getGlobalConfig('PermissionControl') === 'backend'){
            return formatBackendRoutes(this.dynamicRoutes)
        }
        if(getGlobalConfig('PermissionControl') === 'fontend'){
            return  DynamicRoutes
        }
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

    get isAdmin(): boolean {
        return this.hasRole('admin')
    }
}

export default new UserStore()