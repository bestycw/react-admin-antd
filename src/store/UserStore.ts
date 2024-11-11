/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from "mobx"

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

    private initUserInfo() {
        const storedUserInfo = localStorage.getItem('userInfo')
        const token = localStorage.getItem('token')
        const expiresAt = localStorage.getItem('tokenExpiresAt')

        if (storedUserInfo && token) {
            if (expiresAt && new Date().getTime() < parseInt(expiresAt)) {
                this.userInfo = JSON.parse(storedUserInfo)
                this.isLogin = true
            } else {
                this.clearUserInfo()
            }
        }
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