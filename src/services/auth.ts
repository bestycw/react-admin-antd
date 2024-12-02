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
  refreshToken: string;
  expiresIn: number;
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

interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  private refreshTokenTimeout?: NodeJS.Timeout;

  private startRefreshTokenTimer(expiresIn: number) {
    this.stopRefreshTokenTimer();
    const timeout = (expiresIn - 300) * 1000;
    if (timeout > 0) {
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (!refreshToken) return;

      const response = await fetchRequest.post<TokenInfo>('/api/auth/refresh-token', { refreshToken });
      console.log('response', response);
      if (!response.token || !response.refreshToken || !response.expiresIn) {
        throw new Error('Invalid token response');
      }

      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('token', response.token);
      storage.setItem('refreshToken', response.refreshToken);
      storage.setItem('tokenExpires', String(Date.now() + response.expiresIn * 1000));

      this.startRefreshTokenTimer(response.expiresIn);
    } catch (error:any) {
      console.error('Token refresh failed:', error);
      if (error.response?.status === 401) {
        this.logout();
        window.location.href = '/auth/login';
      }
    }
  }

  async login(params: LoginParams): Promise<LoginResponse> {
    try {
      const response = await fetchRequest.post<LoginResponse>('/api/auth/login', params);
      // console.log('Login response:', response);

      if (!response || !response.token || !response.refreshToken) {
        console.error('Invalid login response structure:', response);
        throw new Error('登录响应格式错误');
      }

      const storage = params.remember ? localStorage : sessionStorage;
      storage.setItem('token', response.token);
      storage.setItem('refreshToken', response.refreshToken);
      storage.setItem('tokenExpires', String(Date.now() + response.expiresIn * 1000));

      this.startRefreshTokenTimer(response.expiresIn);
      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response) {
        throw new Error(error.response.message || '登录失败');
      }
      throw error;
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  async logout(): Promise<void> {
    try {
      await fetchRequest.post('/api/auth/logout');
    } finally {
      this.stopRefreshTokenTimer();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpires');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('tokenExpires');
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