import Mock from 'mockjs'

const tokens = {
  admin: 'mock-token-admin',
  user: 'mock-token-user',
}

Mock.mock('/api/auth/login', 'post', (options: any) => {
  const { username, password } = JSON.parse(options.body)
  console.log('Mock login:', username, password)

  if (username === 'admin' && password === '123456') {
    return {
      code: 200,
      data: {
        token: tokens.admin,
        user:{
          id: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          email: 'admin@example.com',
          roles: ['admin'],
          permissions: ['*']
        },
        refreshToken: 'mock-refresh-token-admin',
        
        // username: 'admin'
      },
      message: '登录成功'
    }
  }
  if (username === 'user' && password === '123456') {
    return {
      code: 200,
      data: {
        token: tokens.admin,
        user:{
          id: 2,
          username: 'user',
          nickname: '普通用户',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          email: 'user@example.com',
          roles: ['user'],
          permissions: ['*'],
          dynamicRoutesList: ['/dashboard']
        },
        refreshToken: 'mock-refresh-token-admin',
        
        // username: 'admin'
      },
      message: '登录成功'
    }
  }
  return {
    code: 400,
    message: '用户名或密码错误'
  }
})

Mock.mock('/api/auth/logout', 'post', () => {
  return {
    code: 200,
    message: '登出成功'
  }
})

Mock.mock('/api/auth/info', 'get', (options: any) => {
  const token = options.headers?.Authorization
  if (token === `Bearer ${tokens.admin}`) {
    return {
      code: 200,
      data: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'admin@example.com',
        roles: ['admin'],
        permissions: ['*']
      }
    }
  }
  return {
    code: 401,
    message: '未登录或token已过期'
  }
}) 