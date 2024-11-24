import Request from '../utils/request'
import { UserInfo } from '../store/UserStore'
import { CoRouteObject } from '../types/route'

export interface LoginParams {
    username: string
    password: string
    captcha: string
    remember?: boolean
}

export interface LoginResult {
    token: string
    userInfo: UserInfo
}

export const authService = {
    // 登录
    login(params: LoginParams){
        const { username, password } = params
        return Request.post<UserInfo>('/api/auth/login', { username, password }, {
            retry: 2
        })
    },

    // 获取动态路由
    getDynamicRoutes() {
        return Request.get<CoRouteObject[]>('/api/auth/routes', {
            retry: 1,
            headers: {
                // 确保请求带上 token
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    },

    // 获取用户信息
    getUserInfo() {
        return Request.get<UserInfo>('/api/auth/userInfo', {
            retry: 1,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    },

    // 登出
    logout() {
        return Request.post('/api/auth/logout')
    }
} 