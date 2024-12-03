import { fetchRequest } from '@/utils/request';

export interface RoleType {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  permissions: string[];
  createdAt: string;
}

export interface CreateRoleParams {
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  permissions: string[];
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