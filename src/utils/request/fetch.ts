import getGlobalConfig from '@/config/GlobalConfig';
import { message } from 'antd';

interface RequestConfig extends Omit<RequestInit, 'cache'> {
  baseURL?: string;
  url?: string;
  timeout?: number;
  token?: boolean;
  loading?: boolean;
  retry?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheTime?: number;
  onUploadProgress?: (progress: number) => void;
  onDownloadProgress?: (progress: number) => void;
}

interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 请求拦截器
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
// 响应拦截器
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
// 错误拦截器
type ErrorInterceptor = (error: any) => any;

class FetchRequest {
  private baseURL: string;
  private defaultConfig: RequestConfig;
  private controller: AbortController;
  private requestQueue: Set<string> = new Set();  // 请求队列
  private cache: Map<string, { data: any; timestamp: number }> = new Map();  // 缓存
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor( config: RequestConfig = {}) {
    this.baseURL = getGlobalConfig('ApiUrl');
    this.defaultConfig = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      useCache: false,
      cacheTime: 5 * 60 * 1000,  // 默认缓存5分钟
      ...config
    };
    this.controller = new AbortController();

    // 添加默认请求拦截器
    this.addRequestInterceptor(async (config) => {
      // 添加 loading 状态
      if (config.loading !== false) {
        // 可以在这里添加全局 loading
        // loading.show()
      }

      // 添加时间戳防止缓存
      const timestamp = new Date().getTime();
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}_t=${timestamp}`;

      return config;
    });

    // 添加默认响应拦截器
    this.addResponseInterceptor(async (response) => {
      // 处理响应状态
      if (response.status === 401) {
        // 未登录或 token 过期
        message.error('请重新登录');
        // 可以在这里处理登出逻辑
        window.location.href = '/login';
        throw new Error('未登录或登录已过期');
      }

      if (response.status === 403) {
        message.error('没有权限访问');
        throw new Error('没有权限访问');
      }

      if (response.status >= 500) {
        message.error('服务器错误，请稍后重试');
        throw new Error('服务器错误');
      }

      return response;
    });

    // 添加默认错误拦截器
    this.addErrorInterceptor((error) => {
      // 关闭 loading
      // loading.hide()

      if (error.name === 'AbortError') {
        message.error('请求已取消');
        return Promise.reject(new Error('请求已取消'));
      }

      // 超时错误
      if (error.message.includes('timeout')) {
        message.error('请求超时，请重试');
        return Promise.reject(new Error('请求超时'));
      }

      // 网络错误
      if (!window.navigator.onLine) {
        message.error('网络连接已断开，请检查网络');
        return Promise.reject(new Error('网络连接已断开'));
      }

      // 其他错误
      message.error(error.message || '请求失败');
      return Promise.reject(error);
    });
  }

  // 添加请求拦截器
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // 添加错误拦截器
  public addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  private async request<T>(url: string, config: RequestConfig): Promise<T> {
    const mergedConfig = this.mergeConfig(config);
    const fullUrl = this.getFullUrl(url);
    const cacheKey = this.getCacheKey(fullUrl, mergedConfig);

    try {
      // 检查缓存
      if (mergedConfig.useCache) {
        const cachedData = this.getCache<T>(cacheKey);
        if (cachedData) return cachedData;
      }

      // 检查请求队列
      if (this.requestQueue.has(cacheKey)) {
        throw new Error('重复的请求已被取消');
      }
      this.requestQueue.add(cacheKey);

      // 应用请求拦截器
      let finalConfig = mergedConfig;
      for (const interceptor of this.requestInterceptors) {
        finalConfig = await interceptor(finalConfig);
      }

      // 超时处理
      const timeoutPromise = this.timeout(finalConfig.timeout);
      const fetchPromise = this.performFetch<T>(fullUrl, finalConfig);

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // 缓存响应
      if (mergedConfig.useCache) {
        this.setCache(cacheKey, response, mergedConfig.cacheTime);
      }

      return response;
    } catch (error) {
      // 应用错误拦截器
      let processedError = error;
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }

      // 重试处理
      if (mergedConfig.retry && mergedConfig.retry > 0) {
        return this.retryRequest<T>(url, {
          ...mergedConfig,
          retry: mergedConfig.retry - 1
        });
      }

      throw this.handleError(processedError);
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  private async performFetch<T>(url: string, config: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      ...config,
      signal: this.controller.signal,
      headers: this.getHeaders(config)
    });

    // 处理下载进度
    if (config.onDownloadProgress && response.body) {
      const contentLength = Number(response.headers.get('Content-Length')) || 0;
      const reader = response.body.getReader();
      let receivedLength = 0;

      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            receivedLength += value.length;
            controller.enqueue(value);
            if (config.onDownloadProgress) {
              config.onDownloadProgress(contentLength ? receivedLength / contentLength : 0);
            }
          }
          controller.close();
        }
      });

      const newResponse = new Response(stream, response);
      
      // 应用响应拦截器
      let finalResponse = newResponse;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor(finalResponse);
      }

      if (!finalResponse.ok) {
        throw new Error(`HTTP error! status: ${finalResponse.status}`);
      }

      const data = await finalResponse.json() as ResponseData<T>;
      
      if (data.code !== 200) {
        message.error(data.message || '请求失败');
        throw new Error(data.message || '请求失败');
      }

      return data.data;
    }

    // 应用响应拦截器
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }

    if (!finalResponse.ok) {
      throw new Error(`HTTP error! status: ${finalResponse.status}`);
    }

    const data = await finalResponse.json() as ResponseData<T>;
    
    if (data.code !== 200) {
      message.error(data.message || '请求失败');
      throw new Error(data.message || '请求失败');
    }

    return data.data;
  }

  // 缓存相关方法
  private getCacheKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}-${url}-${JSON.stringify(config.body)}`;
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, timestamp } = cached;
    const now = Date.now();
    if (now - timestamp > (this.defaultConfig.cacheTime || 0)) {
      this.cache.delete(key);
      return null;
    }

    return data as T;
  }

  private setCache<T>(key: string, data: T, time?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    if (time) {
      setTimeout(() => this.cache.delete(key), time);
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private timeout(delay: number = 10000): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        this.controller.abort();
        reject(new Error(`Request timeout after ${delay}ms`));
      }, delay);
    });
  }

  private async retryRequest<T>(url: string, config: RequestConfig): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
    return this.request<T>(url, config);
  }

  private mergeConfig(config: RequestConfig): RequestConfig {
    return {
      ...this.defaultConfig,
      ...config,
      headers: {
        ...this.defaultConfig.headers,
        ...config.headers
      }
    };
  }

  private getFullUrl(url: string): string {
    return url.startsWith('http') ? url : `${this.baseURL}${url}`;
  }

  private getHeaders(config: RequestConfig): HeadersInit {
    const headers = new Headers(config.headers);

    if (config.token !== false) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  private handleError(error: any): never {
    if (error.name === 'AbortError') {
      throw new Error('请求已取消');
    }

    if (error instanceof Response) {
      switch (error.status) {
        case 401:
          message.error('未授权，请重新登录');
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求错误，未找到该资源');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(`连接错误${error.status}`);
      }
    } else {
      message.error('网络连接异常，请稍后重试');
    }

    throw error;
  }

  public cancelRequest(): void {
    this.controller.abort();
    this.controller = new AbortController();
  }

  public async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  public async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  public async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  // 文件下载
  public async download(url: string, fileName?: string, config?: RequestConfig): Promise<void> {
    try {
      const response = await fetch(this.getFullUrl(url), {
        ...this.mergeConfig(config || {}),
        headers: this.getHeaders(config || {}),
      });

      if (!response.ok) throw new Error('Download failed');
      if (!response.body) throw new Error('No response body');

      const contentLength = Number(response.headers.get('Content-Length')) || 0;
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (config?.onDownloadProgress) {
          config.onDownloadProgress(contentLength ? receivedLength / contentLength : 0);
        }
      }

      const blob = new Blob(chunks);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || this.getFileNameFromResponse(response) || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      message.error('下载失败');
      throw error;
    }
  }

  private getFileNameFromResponse(response: Response): string {
    const disposition = response.headers.get('content-disposition');
    if (!disposition) return '';
    
    const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (!filenameMatch) return '';
    
    return decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
  }
}

export default new FetchRequest(import.meta.env.VITE_API_URL);
