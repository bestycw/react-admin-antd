const roles = [
  {
    id: 1,
    name: 'admin',
    description: '系统管理员',
    permissions: ['*'],
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    name: 'user',
    description: '普通用户',
    permissions: ['view'],
    createTime: '2024-01-01 00:00:00'
  }
];

export default {
  'GET /api/roles': (req: any, res: any) => {
    const { page = 1, pageSize = 10 } = req.query;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.send({
      code: 200,
      data: {
        list: roles.slice(start, end),
        total: roles.length,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  },

  'GET /api/roles/:id': (req: any, res: any) => {
    const role = roles.find(r => r.id === Number(req.params.id));
    res.send({
      code: 200,
      data: role
    });
  }
}; 