import StorageManager from './storageManager';

/**
 * Auth 存储相关的常量
 */
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth:token',
  REFRESH_TOKEN: 'auth:refreshToken',
  TOKEN_EXPIRES: 'auth:tokenExpires',
  USER_INFO: 'auth:userInfo'
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
    const expires = expiresIn * 1000;

    StorageManager.set(AUTH_STORAGE_KEYS.TOKEN, token, { type, expires });
    StorageManager.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken, { type, expires });
    StorageManager.set(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, Date.now() + expires, { type, expires });
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
  isTokenValid(threshold = 5 * 60 * 1000) { // 默认5分钟阈值
    const token = this.getToken();
    if (!token) return false;

    const expires = StorageManager.get<number>(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, 0, { type: 'local' }) ||
                   StorageManager.get<number>(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, 0, { type: 'session' });
    
    return Date.now() + threshold < expires;
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
