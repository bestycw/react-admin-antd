import request from '@/utils/request';
import { authStorage } from '@/utils/storage/authStorage';
import { TIME } from '@/config/constants';
import UserStore from '@/store/UserStore';
import { getRoleRoutes } from './role';
// import { request } from 'node:https';

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
  private isRefreshing: boolean = false;

  private startRefreshTokenTimer(expiresIn: number) {
    this.stopRefreshTokenTimer();
    const timeout = expiresIn - TIME.TOKEN_REFRESH_AHEAD;
    console.log('Next token refresh in:', timeout / 1000, 'seconds');
    if (timeout <= 0 || timeout >= TIME.TOKEN_EXPIRE) {

      console.warn('Invalid refresh timeout:', timeout);
      // this.logout()
      return;
    }
    this.refreshTokenTimeout = setTimeout(() => {
   
      this.refreshToken();
    }, Math.max(timeout, 100));
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        this.stopRefreshTokenTimer();
        authStorage.clearAuth();
        return;
      }
      if (this.isRefreshing) {
        return;
      }
      this.isRefreshing = true;

      const response = await request.post<TokenInfo>('/api/auth/refresh-token', { refreshToken });
      
      if (!response?.token || !response?.refreshToken) {
        throw new Error('Invalid token response');
      }

      authStorage.setTokenInfo({
        token: response.token,
        refreshToken: response.refreshToken,
        expiresIn: TIME.TOKEN_EXPIRE,
        remember: authStorage.getStorageType() === 'local'
      });

      this.startRefreshTokenTimer(TIME.TOKEN_EXPIRE);
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.stopRefreshTokenTimer();
      authStorage.clearAuth();
    } finally {
      this.isRefreshing = false;
    }
  }

  async login(params: LoginParams): Promise<LoginResponse> {
    try {
      const response = await request.post<LoginResponse>('/api/auth/login', params);

      if (!response?.token || !response?.refreshToken) {
        throw new Error('登录响应格式错误');
      }
      // console.log('login response:', response);
      authStorage.setTokenInfo({
        token: response.token,
        refreshToken: response.refreshToken,
        expiresIn: TIME.TOKEN_EXPIRE,
        remember: params.remember
      });
      const dynamicRoutesList = await getRoleRoutes(response.user.roles);
      console.log('dynamicRoutesList:', dynamicRoutesList);
      response.user.dynamicRoutesList = dynamicRoutesList;

      this.startRefreshTokenTimer(TIME.TOKEN_EXPIRE);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      // this.refreshTokenTimeout = undefined;
    }
  }

  async logout(): Promise<void> {
    try {
      await request.post('/api/auth/logout');
    } finally {
      // this.stopRefreshTokenTimer();
      // 清除所有认证相关存储
      authStorage.clearAuth();  
      // UserStore.clearUserInfo();
    }
  }

  async getCurrentUser(): Promise<UserInfo> {
    return await request.get<UserInfo>('/api/auth/me');
  }

  async sendVerificationCode(mobile: string, type: 'login' | 'register' | 'reset'): Promise<ApiResponse<VerificationCodeData>> {
    return await request.post('/api/auth/send-code', { mobile, type });
  }

  async getQRCode(): Promise<QRCodeResponse> {
    return await request.get<QRCodeResponse>('/api/auth/qrcode');
  }

  async checkQRCodeStatus(qrToken: string): Promise<LoginResponse | { status: 'pending' | 'expired' }> {
    return await request.get<LoginResponse | { status: 'pending' | 'expired' }>(`/api/auth/qrcode/check/${qrToken}`);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await request.post('/api/auth/change-password', {
      oldPassword,
      newPassword
    });
  }

  getToken(): string | null {
    return authStorage.getToken() ||
           authStorage.getToken() ||
           null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return authStorage.isTokenValid(TIME.TOKEN_REFRESH_AHEAD);
  }

  async register(params: RegisterParams): Promise<void> {
    await request.post('/api/auth/register', params);
  }

  async resetPassword(params: ResetPasswordParams): Promise<void> {
    await request.post('/api/auth/reset-password', params);
  }

  async updateProfile(data: Partial<UserInfo>): Promise<UserInfo> {
    return await request.put<UserInfo>('/api/auth/profile', data);
  }

  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await request.upload<{ code: number; data: { url: string }; message: string }>('/api/auth/upload-avatar', formData);
    // console.log('Upload response:', response);
    return response;
  }

  async getDevices(): Promise<any[]> {
    return await request.get('/api/auth/devices');
  }

  async revokeDevice(deviceId: string): Promise<void> {
    await request.delete(`/api/auth/devices/${deviceId}`);
  }

  async getApiTokens(): Promise<any[]> {
    return await request.get('/api/auth/tokens');
  }

  async createApiToken(data: any): Promise<any> {
    return await request.post('/api/auth/tokens', data);
  }

  async revokeApiToken(tokenId: string): Promise<void> {
    await request.delete(`/api/auth/tokens/${tokenId}`);
  }

  async updateNotificationSettings(settings: any): Promise<void> {
    await request.put('/api/auth/notifications/settings', settings);
  }
}

export const authService = new AuthService(); 