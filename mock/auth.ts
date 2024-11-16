import { MockMethod } from 'vite-plugin-mock'
import { DynamicRoutes } from '../src/router'
import Mock from 'mockjs'

const { Random } = Mock

export default [
    {
        url: '/api/auth/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body
            if (username === 'admin' && password === '123456') {
                return {
                    code: 200,
                    message: 'success',
                    data: {
                        token: Random.string('lower', 32),
                        userInfo: {
                            username: 'admin',
                            roles: ['admin']
                        }
                    }
                }
            }
            return {
                code: 401,
                message: '用户名或密码错误',
                data: null
            }
        }
    },
    {
        url: '/api/auth/userInfo',
        method: 'get',
        response: ({ headers }) => {
            const token = headers['authorization']
            if (token) {
                return {
                    code: 200,
                    message: 'success',
                    data: {
                        username: 'admin',
                        roles: ['admin']
                    }
                }
            }
            return {
                code: 401,
                message: '未登录',
                data: null
            }
        }
    },
    {
        url: '/api/auth/logout',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: 'success',
                data: null
            }
        }
    },
    {
        url: '/api/auth/routes',
        method: 'get',
        response: ({ headers }) => {
            const token = headers['authorization']
            if (token) {
                // 模拟延迟
                Mock.setup({
                    timeout: '200-600'
                })
                
                // 随机决定是否返回某些路由，模拟权限控制
                const filteredRoutes = DynamicRoutes.map(route => ({
                    ...route,
                    children: route.children?.filter(() => Random.boolean())
                }))

                return {
                    code: 200,
                    message: 'success',
                    data: filteredRoutes
                }
            }
            return {
                code: 401,
                message: '未登录或token已过期',
                data: null
            }
        }
    }
] as MockMethod[] 