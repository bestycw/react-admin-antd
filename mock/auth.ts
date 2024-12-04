export default {
  'POST /api/auth/login': (req: any, res: any) => {
    const { username, password } = req.body;
    console.log('username', username);
    if (username === 'admin' && password === '123456') {
      res.send({
        code: 200,
        data: {
          token: 'mock-token-admin',
          username: 'admin'
        },
        message: '登录成功'
      });
    } else {
      res.send({
        code: 400,
        message: '用户名或密码错误'
      });
    }
  },

  'POST /api/auth/logout': (req: any, res: any) => {
    res.send({
      code: 200,
      message: '登出成功'
    });
  },

  'GET /api/auth/info': (req: any, res: any) => {
    const token = req.get('Authorization');
    if (token === 'mock-token-admin') {
      res.send({
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
      });
    } else {
      res.send({
        code: 401,
        message: '未登录或token已过期'
      });
    }
  }
}; 