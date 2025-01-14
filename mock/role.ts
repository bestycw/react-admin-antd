import Mock from 'mockjs'

const roles = [
  {
    id: 1,
    name: 'admin',
    description: '系统管理员',
    permissions: ['*'],
    dynamicRoutesList: ['/'],
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

// 管理员的路由权限 - 拥有所有权限
const adminRoutes = ['/'];

// 用户层级的路由权限 - 按模块划分
const userRoutes = {
  // 基础模块
  basic: [
    '/dashboard',
    '/table',
    '/table/basic-table',
    '/profile',
    '/profile/settings',
    '/profile/notifications',
    '/profile/devices'
  ],
  
  // 系统管理模块
  system: [
    '/system',
    '/system/user',
    '/system/role'
  ],
  
  // 工具模块
  tools: [
    '/tools',
    '/tools/chat',
    '/tools/email'
  ],

  // 列表页模块
  list: [
    '/list',
    '/list/basic-list',
    '/list/card-list'
  ]
};

// 不同角色的默认路由组合
const roleRoutesMap = {
  admin: adminRoutes,  // 管理员拥有所有权限
  
  manager: [           // 经理级别 - 拥有系统管理和基础功能
    ...userRoutes.basic,
    ...userRoutes.system
  ],
  
  editor: [            // 编辑人员 - 拥有内容管理相关功能
    ...userRoutes.basic,
    ...userRoutes.tools,
    ...userRoutes.list
  ],
  
  user: [              // 普通用户 - 只有基础功能
    ...userRoutes.basic
  ],
  
  guest: [             // 访客 - 最小权限
    '/dashboard',
    '/profile'
  ]
};

// Add type for valid role names
type RoleType = keyof typeof roleRoutesMap;

// 修改为 GET 请求，从查询参数获取角色信息
Mock.mock(/\/api\/roles\/routes\?.*/, 'get', (options: any) => {
  const url = new URL(options.url, 'http://localhost');
  const roles = url.searchParams.get('roles')?.split(',') || [];
  console.log('Mock getRoleRoutes:', roles);

  // 如果包含 admin 角色，返回所有权限
  if (roles.includes('admin')) {
    return {
      code: 200,
      data: adminRoutes,
      message: 'success'
    };
  }

  // 合并该用户所有角色的权限
  const routes = new Set<string>();
  roles.forEach((role: string) => {
    const roleRoutes = roleRoutesMap[role as RoleType] || [];
    roleRoutes.forEach(route => routes.add(route));
  });

  return {
    code: 200,
    data: Array.from(routes),
    message: 'success'
  };
});

// 模拟获取所有角色列表
Mock.mock('/api/roles', 'get', () => {
  return {
    code: 200,
    data: [
      {
        id: 1,
        name: '管理员',
        code: 'admin',
        description: '系统管理员，拥有所有权限',
        status: 'active',
        dynamicRoutesList: ['/'],
        createdAt: '2024-01-01 00:00:00'
      },
      {
        id: 2,
        name: '普通用户',
        code: 'user',
        description: '普通用户，仅有基础权限',
        status: 'active',
        dynamicRoutesList: userRoutes,
        createdAt: '2024-01-01 00:00:00'
      },
      {
        id: 3,
        name: '访客',
        code: 'guest',
        description: '访客用户，只有查看权限',
        status: 'active',
        dynamicRoutesList: ['/dashboard'],
        createdAt: '2024-01-01 00:00:00'
      }
    ],
    message: 'success'
  };
});

// 创建角色
Mock.mock('/api/roles', 'post', (options: any) => {
  const role = JSON.parse(options.body);
  return {
    code: 200,
    data: {
      id: Mock.Random.id(),
      ...role,
      createdAt: Mock.Random.datetime()
    },
    message: '创建成功'
  };
});

// 更新角色
Mock.mock(/\/api\/roles\/\d+/, 'put', (options: any) => {
  const role = JSON.parse(options.body);
  return {
    code: 200,
    data: {
      ...role,
      updatedAt: Mock.Random.datetime()
    },
    message: '更新成功'
  };
});

// 删除角色
Mock.mock(/\/api\/roles\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功'
  };
}); 