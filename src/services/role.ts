import { fetchRequest } from '@/utils/request';

export interface RoleType {
  id: number;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleParams {
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  status: 'active' | 'inactive';
}

// 获取角色列表
export async function getRoles() {
  return fetchRequest.get<RoleType[]>('/api/roles');
}

// 创建角色
export async function createRole(data: CreateRoleParams) {
  return fetchRequest.post<RoleType>('/api/roles', data);
}

// 更新角色
export async function updateRole(id: number, data: Partial<CreateRoleParams>) {
  return fetchRequest.put<RoleType>(`/api/roles/${id}`, data);
}

// 删除角色
export async function deleteRole(id: number) {
  return fetchRequest.delete(`/api/roles/${id}`);
} 