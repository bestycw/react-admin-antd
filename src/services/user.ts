import { fetchRequest } from '@/utils/request';

export interface UserType {
  id: number;
  username: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface CreateUserParams {
  username: string;
  password: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive';
}

export interface UpdateUserParams extends Omit<CreateUserParams, 'password'> {
  password?: string;
}

// 模拟数据
const mockUsers: UserType[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    roles: ['admin'],
    status: 'active',
    lastLogin: '2024-01-01 00:00:00',
  },
  {
    id: 2,  
    username: 'user',
    email: 'user@example.com',
    roles: ['user'],
    status: 'active',
    lastLogin: '2024-01-01 00:00:00',
  },
];

interface UserListResponse {
  code: number;
  data: {
    list: UserType[];
    total: number;
    current: number;
    pageSize: number;
  };
}

// 获取用户列表
export async function getUsers(params?: {
  current?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  status?: string;
  role?: string;
}): Promise<any> {
//   const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//   console.log('Request token:', token);
  
  return fetchRequest.get<any>('/api/users', { 
    params,
    // headers: {
    //   'Authorization': `Bearer ${token}`
    // }
  });
}

// 获取用户详情
export async function getUser(id: number): Promise<{ data: UserType }> {
  // return request.get<{ data: UserType }>(`/api/users/${id}`);
  const user = mockUsers.find(u => u.id === id);
  if (!user) {
    return Promise.reject(new Error('用户不存在'));
  }
  return Promise.resolve({ data: user });
}

// 创建用户
export async function createUser(data: CreateUserParams): Promise<{ data: UserType }> {
  console.log('Creating user with data:', data);
  return fetchRequest.post<{ data: UserType }>('/api/users', data);
}

// 更新用户
export async function updateUser(id: number, data: UpdateUserParams): Promise<{ data: UserType }> {
  // 修改为实际的 API 调用
  return fetchRequest.put<{ data: UserType }>(`/api/users/${id}`, data);
}

// 删除用户
export async function deleteUser(id: number): Promise<{ data: null }> {
  // 修改为实际的 API 调用
  return fetchRequest.delete<{ data: null }>(`/api/users/${id}`);
}

// 重置密码
export async function resetUserPassword(id: number): Promise<{ data: null }> {
  // 修改为实际的 API 调用
  return fetchRequest.post<{ data: null }>(`/api/users/${id}/reset-password`);
}
