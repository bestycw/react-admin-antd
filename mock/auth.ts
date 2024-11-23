import Mock from 'mockjs'
import { PermissionsCode } from '../src/types/permission'

const { Random } = Mock

// 拦截 axios 请求
Mock.setup({
    timeout: '1000-2000'
})

// 登录接口
Mock.mock('/api/auth/login', 'post', (options) => {
    const { username, password } = JSON.parse(options.body)
    if (username === 'admin' && password === '123456') {
        return {
            code: 200,
            message: 'success',
            data: {
                username: 'admin',
                avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                roles: ['admin'],
                accessToken: Random.string('lower', 32),
                permissions: ['*'],
                // dynamicRoutesList: []
            }
        }
    }
    if (username === 'user' && password === '123456') {
        return {
            code: 200,
            message: 'success',
            data: {
                username: 'user',
                avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                roles: ['user'],
                accessToken: Random.string('lower', 32),
                permissions: [PermissionsCode.SYSTEM.USER.VIEW],
                // dynamicRoutesList: []
            }
        }
    }
    return {
        code: 401,
        message: '用户名或密码错误',
        data: null
    }
})

// 获取用户信息
Mock.mock('/api/auth/userInfo', 'get', () => {
    return {
        code: 200,
        message: 'success',
        data: {
            username: 'admin',
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            roles: ['admin'],
            accessToken: Random.string('lower', 32),
            dynamicRoutesList: []
        }
    }
})

// 获取动态路由
Mock.mock('/api/auth/routes', 'get', () => {
    return {
        code: 200,
        message: 'success',
        data: []
    }
})

// 登出接口
Mock.mock('/api/auth/logout', 'post', () => {
    return {
        code: 200,
        message: 'success',
        data: null
    }
})

// 定义接口类型
export interface LoginParams {
    username: string
    password: string
    remember?: boolean
}

export interface LoginResult {
    username: string
    avatar?: string
    roles: string[]
    accessToken: string
    dynamicRoutesList: string[]
}

export interface ResponseData<T> {
    code: number
    message: string
    data: T
} 