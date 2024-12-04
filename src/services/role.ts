import { fetchRequest } from '@/utils/request';

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
  return fetchRequest.get<RoleType[]>('/api/roles');
};

// 创建角色
export const createRole = (data: CreateRoleParams) => {
  return fetchRequest.post<RoleType>('/api/roles', data);
};

// 更新角色
export const updateRole = (id: string, data: Partial<RoleType>) => {
  return fetchRequest.put(`/api/roles/${id}`, data);
};

// 删除角色
export const deleteRole = (id: string) => {
  return fetchRequest.delete(`/api/roles/${id}`);
};

// 获取角色的动态路由
export const getRoleRoutes = async (roleCodes: string[]): Promise<string[]> => {
  // 如果角色数组中包含 admin，直接返回 ['*']
  if (roleCodes.includes('admin')) {
    return ['*'];
  }
  // 将角色数组转换为逗号分隔的字符串
  const roleCodesStr = roleCodes.join(',');
  const response = await fetchRequest.get<string[]>(`/api/roles/routes/${roleCodesStr}`);
  return response;
}; 
