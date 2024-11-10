import Request from '../utils/request'
import { UserInfo } from '../store/UserStore'

export interface LoginParams {
    username: string
    password: string
    captcha: string
    remember?: boolean
}

export const authService = {
    // 登录
    login(params: LoginParams) {
        const { username, password } = params
        return Request.post<UserInfo>('/api/auth/login', { username, password },{
            retry:2
        })
    }
} 