import { fetchRequest } from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  remember?: boolean;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  status: string;
  lastLogin: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

class AuthService {
  async login(params: LoginParams): Promise<LoginResponse> {
    const response = await fetchRequest.post<LoginResponse>('/api/auth/login', params);
    
    // 保存 token 到 localStorage 或 sessionStorage
    if (params.remember) {
      localStorage.setItem('token', response.token);
    } else {
      sessionStorage.setItem('token', response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await fetchRequest.post('/api/auth/logout');
    } finally {
      // 无论请求是否成功，都清除本地存储的 token
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<UserInfo> {
    const response = await fetchRequest.get<UserInfo>('/api/auth/me');
    return response;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await fetchRequest.post('/api/auth/change-password', {
      oldPassword,
      newPassword
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 