const users = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    status: 1,
    createTime: '2024-01-01 00:00:00',
    roles: ['admin']
  },
  {
    id: 2,
    username: 'user',
    nickname: '普通用户',
    email: 'user@example.com',
    status: 1,
    createTime: '2024-01-02 00:00:00',
    roles: ['user']
  }
];

export default {
  'GET /api/users': (req: any, res: any) => {
    const { page = 1, pageSize = 10 } = req.query;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.send({
      code: 200,
      data: {
        list: users.slice(start, end),
        total: users.length,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  },

  'GET /api/users/:id': (req: any, res: any) => {
    const user = users.find(u => u.id === Number(req.params.id));
    res.send({
      code: 200,
      data: user
    });
  }
}; 