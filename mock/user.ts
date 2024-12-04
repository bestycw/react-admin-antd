import Mock from 'mockjs'

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
]

Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options: any) => {
  const url = new URL(options.url, 'http://localhost')
  const page = Number(url.searchParams.get('page')) || 1
  const pageSize = Number(url.searchParams.get('pageSize')) || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    data: {
      list: users.slice(start, end),
      total: users.length,
      page,
      pageSize
    }
  }
})

Mock.mock(/\/api\/users\/\d+/, 'get', (options: any) => {
  const id = parseInt(options.url.match(/\/api\/users\/(\d+)/)[1])
  const user = users.find(u => u.id === id)
  
  return {
    code: 200,
    data: user
  }
}) 