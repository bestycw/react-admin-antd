import getGlobalConfig from '@/config/GlobalConfig';
import { message } from 'antd';
import NProgress from '../nprogress';

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
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: RequestConfig = {}) {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.defaultConfig = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      useCache: false,
      cacheTime: 5 * 60 * 1000,
      ...config
    };

    // 添加默认请求拦截器
    this.addRequestInterceptor(async (config) => {
      // 添加 token
      if (config.token !== false) {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
          };
        }
      }
      return config;
    });

    // 添加默认响应拦截器
    this.addResponseInterceptor(async (response) => {
      if (response.status === 401) {
        // 处理未授权
        message.error('请重新登录');
        // 可以在这里处理登出逻辑
        window.location.href = '/login';
        throw new Error('未登录或登录已过期');
      }
      return response;
    });

    // 添加默认错误拦截器
    this.addErrorInterceptor((error) => {
      if (error.name === 'AbortError') {
        message.error('请求已取消');
      } else if (!window.navigator.onLine) {
        message.error('网络连接已断开，请检查网���');
      } else {
        message.error(error.message || '请求失败');
      }
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

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    
    // 确保 baseURL 和 url 之间只有一个斜杠
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const path = url.startsWith('/') ? url : `/${url}`;
    
    console.log('Full URL:', `${baseURL}${path}`);
    return `${baseURL}${path}`;
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

  private async runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let currentConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig);
    }
    return currentConfig;
  }

  private async runResponseInterceptors(response: Response): Promise<Response> {
    let currentResponse = response;
    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor(currentResponse);
    }
    return currentResponse;
  }

  private async runErrorInterceptors(error: any): Promise<any> {
    let currentError = error;
    for (const interceptor of this.errorInterceptors) {
      try {
        currentError = await interceptor(currentError);
      } catch (e) {
        currentError = e;
      }
    }
    return Promise.reject(currentError);
  }

  private async request<T>(url: string, config: RequestConfig): Promise<T> {
    try {
      if (config.retry && config.retry > 0) {
        return await this.retryRequest<T>(url, config, config.retry, config.retryDelay);
      }

      // 运行请求拦截器
      const finalConfig = await this.runRequestInterceptors(config);
      const fullUrl = this.getFullUrl(url);

      console.log('Request:', {
        url: fullUrl,
        method: finalConfig.method,
        headers: finalConfig.headers,
        body: finalConfig.body
      });

      // ���加超时控制
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('请求超时'));
        }, finalConfig.timeout || this.defaultConfig.timeout);
      });

      // 发起请求
      const fetchPromise = fetch(fullUrl, finalConfig);

      // 添加进度条支持
      if (config.loading !== false) {
        NProgress.start();
      }

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (config.loading !== false) {
        NProgress.done();
      }

      console.log('Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
      });

      // 运行响应拦截器
      const interceptedResponse = await this.runResponseInterceptors(response);

      if (!interceptedResponse.ok) {
        throw new Error(`HTTP error! status: ${interceptedResponse.status}`);
      }

      const data = await interceptedResponse.json() as ResponseData<T>;
      
      if (data.code !== 200) {
        throw new Error(data.message || '请求失败');
      }

      return data.data;
    } catch (error) {
      if (config.loading !== false) {
        NProgress.done();
      }
      return this.runErrorInterceptors(error);
    }
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

  // 添加下载方法
  public async download(url: string, fileName?: string, config?: RequestConfig): Promise<void> {
    const fullUrl = this.getFullUrl(url);
    const mergedConfig = this.mergeConfig(config || {});

    try {
      const response = await fetch(fullUrl, mergedConfig);
      if (!response.ok) throw new Error('Download failed');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const contentLength = Number(response.headers.get('Content-Length')) || 0;
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

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
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      message.error('下载失败');
      throw error;
    }
  }

  // 修改上传方法中的进度监控部分
  public async upload<T>(url: string, file: File | Blob | FormData, config?: RequestConfig): Promise<T> {
    let formData: FormData;
    
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }

    const uploadConfig: RequestConfig = {
      ...config,
      method: 'POST',
      body: formData
    };

    if (config?.onUploadProgress) {
      // 简化进度监控逻辑
      const totalSize = file instanceof File || file instanceof Blob ? file.size : 0;
      if (totalSize > 0) {
        uploadConfig.onUploadProgress = (progress) => {
          config.onUploadProgress?.(progress);
        };
      }
    }

    return this.post(url, formData, uploadConfig);
  }

  // 添加重试功能
  private async retryRequest<T>(
    url: string, 
    config: RequestConfig, 
    retryCount: number = 3, 
    retryDelay: number = 1000
  ): Promise<T> {
    try {
      return await this.request<T>(url, config);
    } catch (error) {
      if (retryCount <= 0) throw error;

      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return this.retryRequest(url, config, retryCount - 1, retryDelay);
    }
  }

  // 添加缓存支持
  private cache = new Map<string, { data: any; timestamp: number }>();

  private getCacheKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}-${url}-${JSON.stringify(config.body || {})}`;
  }

  private isCacheValid(timestamp: number, cacheTime: number): boolean {
    return Date.now() - timestamp < cacheTime;
  }
}

export default new FetchRequest();
