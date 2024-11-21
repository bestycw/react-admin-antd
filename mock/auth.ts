// import { DynamicRoutes } from '../src/router'
import Mock from 'mockjs'

const { Random } = Mock

// 拦截 axios 请求
Mock.setup({
  timeout: '200-600'
})

// 登录接口
Mock.mock('/api/auth/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
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
})

// 获取用户信息
Mock.mock('/api/auth/userInfo', 'get', (options) => {
//   const token = options.headers?.Authorization
//   if (token) {
    return {
      code: 200,
      message: 'success',
      data: {
        username: 'admin',
        roles: ['admin']
      }
    }
//   }
//   return {
//     code: 401,
//     message: '未登录',
//     data: null
//   }
})

// 获取动态路由
Mock.mock('/api/auth/routes', 'get', (options) => {
//   const token = options.headers?.Authorization
//   console.log('token', token)
//   if (token) {
    return {
      code: 200,
      message: 'success',
      data: []
    }
//   }
//   return {
//     code: 401,
//     message: '未登录或token已过期',
//     data: null
//   }
})

// 登出接口
Mock.mock('/api/auth/logout', 'post', () => {
  return {
    code: 200,
    message: 'success',
    data: null
  }
}) 