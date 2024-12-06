import StorageManager from './storageManager';
import { TIME } from '@/config/constants';

/**
 * Auth 存储相关的常量
 */
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth:token',  // 访问令牌
  REFRESH_TOKEN: 'auth:refreshToken', // 刷新令牌
  TOKEN_EXPIRES: 'auth:tokenExpires', // 令牌过期时间，这个不是7天过期时间，而是无感知的刷新时间
  USER_INFO: 'auth:userInfo' // 用户信息
} as const;

/**
 * Auth 存储管理类
 */
class AuthStorage {
  /**
   * 设置认证信息
   */
  setTokenInfo(data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    remember?: boolean;
  }) {
    const { token, refreshToken, expiresIn, remember = false } = data;
    const type = remember ? 'local' : 'session';
    const expires = Date.now() + expiresIn;
    // console.log('expires:', type);
    StorageManager.set(AUTH_STORAGE_KEYS.TOKEN, token, { type });
    StorageManager.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken, { type });
    StorageManager.set(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, expires, { type });
  }

  /**
   * 获取访问令牌
   */
  getToken() {
    return StorageManager.get<string>(AUTH_STORAGE_KEYS.TOKEN, '', { type: 'local' }) ||
           StorageManager.get<string>(AUTH_STORAGE_KEYS.TOKEN, '', { type: 'session' });
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken() {
    return StorageManager.get<string>(AUTH_STORAGE_KEYS.REFRESH_TOKEN, '', { type: 'local' }) ||
           StorageManager.get<string>(AUTH_STORAGE_KEYS.REFRESH_TOKEN, '', { type: 'session' });
  }

  /**
   * 检查令牌是否有效
   */
  isTokenValid(threshold = TIME.TOKEN_REFRESH_AHEAD): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expires = this.getTokenExpires();
    if (!expires) return false;

    // 检查是否过期
    return Date.now() + threshold < expires;
  }

  getTokenExpires(): number | null {
    const expires = StorageManager.get<number>(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, 0, { type: 'local' }) ||
                   StorageManager.get<number>(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, 0, { type: 'session' });
    return expires || null;
  }

  /**
   * 获取存储类型
   */
  getStorageType(): 'local' | 'session' {
    return StorageManager.has(AUTH_STORAGE_KEYS.TOKEN, { type: 'local' }) ? 'local' : 'session';
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    ['local', 'session'].forEach(type => {
      StorageManager.remove(Object.values(AUTH_STORAGE_KEYS), { type: type as 'local' | 'session' });
    });
  }
}

export const authStorage = new AuthStorage();
export default authStorage;
