import Mock from 'mockjs'

const tokens = {
  admin: 'mock-token-admin',
  user: 'mock-token-user',
  guest: 'mock-token-guest'
}

Mock.mock('/api/auth/login', 'post', (options: any) => {
  const { username, password } = JSON.parse(options.body)
  console.log('Mock login:', username, password)

  const userMap = {
    admin: {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: {
        '/function/btn-permission': []  // 空数组代表拥有所有权限
      }
    },
    user: {
      id: 2,
      username: 'user',
      nickname: '普通用户',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: 'user@example.com',
      roles: ['user'],
      permissions: {
        '/function/btn-permission': ['create', 'edit']  // 指定权限
      }
    },
    guest: {
      id: 3,
      username: 'guest',
      nickname: '访客',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: 'guest@example.com',
      roles: ['guest'],
      permissions: {
        '/function/btn-permission': ['read']  // 最小权限
      }
    }
  }

  if (username in userMap && password === '123456') {
    return {
      code: 200,
      data: {
        token: tokens[username as keyof typeof tokens],
        user: userMap[username as keyof typeof userMap],
        refreshToken: `mock-refresh-token-${username}`
      },
      message: '登录成功'
    }
  }

  return {
    code: 400,
    message: '用户名或密码错误'
  }
})

Mock.mock('/api/auth/info', 'get', (options: any) => {
  const token = options.headers?.Authorization
  const userType = Object.entries(tokens).find(([_, t]) => token === `Bearer ${t}`)?.[0]
  
  if (userType) {
    const userMap = {
      admin: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'admin@example.com',
        roles: ['admin'],
        permissions: {
          '/function/btn-permission': []  // 空数组代表拥有所有权限
        }
      },
      user: {
        id: 2,
        username: 'user',
        nickname: '普通用户',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'user@example.com',
        roles: ['user'],
        permissions: {
          '/function/btn-permission': ['create', 'edit']  // 指定权限
        }
      },
      guest: {
        id: 3,
        username: 'guest',
        nickname: '访客',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'guest@example.com',
        roles: ['guest'],
        permissions: {
          '/function/btn-permission': ['read']  // 最小权限
        }
      }
    }
    
    return {
      code: 200,
      data: userMap[userType as keyof typeof userMap]
    }
  }

  return {
    code: 401,
    message: '未登录或token已过期'
  }
})

Mock.mock('/api/auth/logout', 'post', () => {
  return {
    code: 200,
    message: '登出成功'
  }
}) 