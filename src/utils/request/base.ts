import { message } from 'antd';
import NProgress from '../nprogress';
import { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { REQUEST } from '@/config/constants';

export interface BaseRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers?: Record<string, string>;
  baseURL?: string;
  url?: string;
  method?: string;
  body?: any;
  timeout?: number;
  token?: boolean;
  loading?: boolean;
  retry?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheTime?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  signal?: AbortSignal;
}

export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

export abstract class BaseRequest {
  protected baseURL: string;
  protected defaultConfig: BaseRequestConfig = {
    timeout: REQUEST.TIMEOUT,
    retry: REQUEST.MAX_RETRIES,
    retryDelay: REQUEST.RETRY_DELAY
  };
  protected cache = new Map<string, { data: any; timestamp: number }>();

  constructor(config: BaseRequestConfig = {}) {
    this.baseURL = import.meta.env.VITE_USE_MOCK === 'true' ? '' : import.meta.env.VITE_API_URL;
    this.defaultConfig = {
      timeout: REQUEST.TIMEOUT,
      loading: true,
      ...config
    };
  }

  protected getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseURL}${path}`;
  }

  protected handleProgress(loading?: boolean) {
    if (loading !== false) NProgress.start();
    return () => {
      if (loading !== false) NProgress.done();
    };
  }

  protected handleError(error: any) {
    if (error.name === 'AbortError') {
      message.error('请求已取消');
    } else if (!window.navigator.onLine) {
      message.error('网络连接已断开，请检查网络');
    } else {
      message.error(error.message || '请求失败');
    }
    return Promise.reject(error);
  }

  protected async retryRequest<T>(
    request: () => Promise<T>,
    retryCount: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (retryCount <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return this.retryRequest(request, retryCount - 1, retryDelay);
    }
  }

  protected getCacheKey(url: string, method: string, body?: any): string {
    return `${method}-${url}-${JSON.stringify(body || {})}`;
  }

  protected isCacheValid(timestamp: number, cacheTime: number): boolean {
    return Date.now() - timestamp < cacheTime;
  }

  abstract get<T>(url: string, config?: BaseRequestConfig): Promise<T>;
  abstract post<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T>;
  abstract upload<T>(url: string, file: File | Blob | FormData, config?: BaseRequestConfig): Promise<T>;
  abstract download(url: string, fileName?: string, config?: BaseRequestConfig): Promise<void>;
}

export class Interceptor<T> {
  private handlers: Array<{
    onFulfilled?: (value: T) => T | Promise<T>;
    onRejected?: (error: any) => any;
  }> = [];

  use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any) {
    this.handlers.push({
      onFulfilled,
      onRejected
    });
  }

  getHandlers() {
    return this.handlers;
  }
} 