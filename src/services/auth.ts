import { fetchRequest } from '@/utils/request';

export interface LoginParams {
  username?: string;
  password?: string;
  mobile?: string;
  verificationCode?: string;
  captcha?: string;
  qrToken?: string;
  loginType: 'account' | 'mobile' | 'qrcode';
  remember?: boolean;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  dynamicRoutesList: string[];
  avatar: string;
  status: string;
  lastLogin: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface QRCodeResponse {
  qrUrl: string;
  qrToken: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  mobile: string;
  verificationCode: string;
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

interface VerificationCodeData {
  verifyCode: string;
}

interface ResetPasswordParams {
  mobile: string;
  verificationCode: string;
  newPassword: string;
}

class AuthService {
  async login(params: LoginParams): Promise<LoginResponse> {
    const response = await fetchRequest.post<LoginResponse>('/api/auth/login', params);
    
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
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<UserInfo> {
    return await fetchRequest.get<UserInfo>('/api/auth/me');
  }

  async sendVerificationCode(mobile: string, type: 'login' | 'register' | 'reset'): Promise<ApiResponse<VerificationCodeData>> {
    return await fetchRequest.post('/api/auth/send-code', { mobile, type });
  }

  async getQRCode(): Promise<QRCodeResponse> {
    return await fetchRequest.get<QRCodeResponse>('/api/auth/qrcode');
  }

  async checkQRCodeStatus(qrToken: string): Promise<LoginResponse | { status: 'pending' | 'expired' }> {
    return await fetchRequest.get<LoginResponse | { status: 'pending' | 'expired' }>(`/api/auth/qrcode/check/${qrToken}`);
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

  async register(params: RegisterParams): Promise<void> {
    await fetchRequest.post('/api/auth/register', params);
  }

  async resetPassword(params: ResetPasswordParams): Promise<void> {
    await fetchRequest.post('/api/auth/reset-password', params);
  }

  async updateProfile(data: Partial<UserInfo>): Promise<UserInfo> {
    return await fetchRequest.put<UserInfo>('/api/auth/profile', data);
  }

  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetchRequest.upload<{ code: number; data: { url: string }; message: string }>('/api/auth/upload-avatar', formData);
    // console.log('Upload response:', response);
    return response;
  }

  async getDevices(): Promise<any[]> {
    return await fetchRequest.get('/api/auth/devices');
  }

  async revokeDevice(deviceId: string): Promise<void> {
    await fetchRequest.delete(`/api/auth/devices/${deviceId}`);
  }

  async getApiTokens(): Promise<any[]> {
    return await fetchRequest.get('/api/auth/tokens');
  }

  async createApiToken(data: any): Promise<any> {
    return await fetchRequest.post('/api/auth/tokens', data);
  }

  async revokeApiToken(tokenId: string): Promise<void> {
    await fetchRequest.delete(`/api/auth/tokens/${tokenId}`);
  }

  async updateNotificationSettings(settings: any): Promise<void> {
    await fetchRequest.put('/api/auth/notifications/settings', settings);
  }
}

export const authService = new AuthService(); 