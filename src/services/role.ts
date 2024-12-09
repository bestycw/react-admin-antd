import  request  from '@/utils/request';

export interface RoleType {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  dynamicRoutesList: string[];
  createdAt: string;
}

export interface CreateRoleParams {
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  dynamicRoutesList: string[];
}

// 获取角色列表
export const getRoles = () => {
  return request.get<RoleType[]>('/api/roles');
};

// 创建角色
export const createRole = (data: CreateRoleParams) => {
  return request.post<RoleType>('/api/roles', data);
};

// 更新角色
export const updateRole = (id: string, data: Partial<RoleType>) => {
  return request.put(`/api/roles/${id}`, data);
};

// 删除角色
export const deleteRole = (id: string) => {
  return request.delete(`/api/roles/${id}`);
};

// 获取角色的动态路由
export const getRoleRoutes = async (roles: string[]): Promise<string[]> => {
  const response = await request.get<string[]>(`/api/roles/routes?roles=${roles.join(',')}`);
  return response;
}; 
