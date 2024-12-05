import Mock from 'mockjs'

const roles = [
  {
    id: 1,
    name: 'admin',
    description: '系统管理员',
    permissions: ['*'],
    dynamicRoutesList: ['*'],
    createTime: '2024-01-01 00:00:00',
    status: 1,
    sort: 1
  },
  {
    id: 2,
    name: 'user',
    description: '普通用户',
    permissions: ['view'],
    dynamicRoutesList: ['dashboard', 'profile'],
    createTime: '2024-01-01 00:00:00',
    status: 1,
    sort: 2
  }
]
Mock.setup({
  timeout: '100-500'  // 设置随机响应时间，更真实
}) 
Mock.mock(/\/api\/roles(\?.*)?$/, 'get', (options: any) => {
  const url = new URL(options.url, 'http://localhost')
  const page = Number(url.searchParams.get('page')) || 1
  const pageSize = Number(url.searchParams.get('pageSize')) || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    data: roles.slice(start, end), // 直接返回数组，不包装在 list 中
    total: roles.length,
    page,
    pageSize
  }
})

Mock.mock(/\/api\/roles\/\d+/, 'get', (options: any) => {
  const id = parseInt(options.url.match(/\/api\/roles\/(\d+)/)[1])
  const role = roles.find(r => r.id === id)
  
  return {
    code: 200,
    data: role
  }
})

// 添加创建角色接口
Mock.mock('/api/roles', 'post', (options: any) => {
  const role = JSON.parse(options.body)
  const newRole = {
    ...role,
    id: roles.length + 1,
    createTime: Mock.Random.datetime(),
    status: 1
  }
  roles.push(newRole)
  
  return {
    code: 200,
    message: '创建成功',
    data: newRole
  }
})

// 添加更新角色接口
Mock.mock(/\/api\/roles\/\d+/, 'put', (options: any) => {
  const id = parseInt(options.url.match(/\/api\/roles\/(\d+)/)[1])
  const updateData = JSON.parse(options.body)
  const index = roles.findIndex(r => r.id === id)
  
  if (index > -1) {
    roles[index] = { ...roles[index], ...updateData }
    return {
      code: 200,
      message: '更新成功',
      data: roles[index]
    }
  }
  
  return {
    code: 404,
    message: '角色不存在'
  }
})

// 添加删除角色接口
Mock.mock(/\/api\/roles\/\d+/, 'delete', (options: any) => {
  const id = parseInt(options.url.match(/\/api\/roles\/(\d+)/)[1])
  const index = roles.findIndex(r => r.id === id)
  
  if (index > -1) {
    roles.splice(index, 1)
    return {
      code: 200,
      message: '删除成功'
    }
  }
  
  return {
    code: 404,
    message: '角色不存在'
  }
}) 