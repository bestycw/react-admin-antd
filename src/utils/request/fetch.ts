import { BaseRequest, BaseRequestConfig, Interceptor } from './base';
import { authService } from '../../services/auth';
import { authStorage } from '@/utils/storage/authStorage';
import { TIME } from '@/config/constants';
import { ErrorCode, handleErrorMessage } from '@/utils/request/errorCode';
import { message } from 'antd';

export class FetchRequest extends BaseRequest {
  public interceptors = {
    request: new Interceptor<BaseRequestConfig>(),
    response: new Interceptor<Response>()
  };

  constructor(config?: BaseRequestConfig) {
    super(config);

    // 添加默认的请求拦截器
    this.interceptors.request.use(
      async (config: BaseRequestConfig) => {
        const token = authStorage.getToken();
        const headers = { ...(config.headers || {}) };
        
        if (token) {
          // 检查 token 是否即将过期
          if (!authStorage.isTokenValid(TIME.TOKEN_REFRESH_AHEAD)) {
            try {
              await authService.refreshToken();
              // 获取新的 token
              const newToken = authStorage.getToken();
              if (newToken) {
                headers['Authorization'] = `Bearer ${newToken}`;
              }
            } catch (error) {
              console.error('Token refresh failed in interceptor:', error);
            }
          } else {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return {
          ...config,
          headers
        };
      },
      (error) => {
        // console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // 添加默认的响应拦截器
    this.interceptors.response.use(
      async (response: Response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        // 处理二进制文件响应
        if (contentType?.includes('application/octet-stream') || 
            contentType?.includes('application/pdf') ||
            contentType?.includes('image/') ||
            contentType?.includes('video/') ||
            contentType?.includes('audio/')) {
          return response.blob();
        }

        // 处理 JSON 响应
        const data = await response.json();
        console.log('Response data:', data);

        if (data.code !== 200) {
          throw new Error(data.message || '请求失败');
        }

        return data.data;
      },
      (error) => {
        console.error('Response interceptor error:', error);
        return Promise.reject(error);
      }
    );
  }

  private async runRequestInterceptors(config: BaseRequestConfig): Promise<BaseRequestConfig> {
    let currentConfig = { ...config };
    
    // 获取所有请求拦截器
    const handlers = (this.interceptors.request as Interceptor<BaseRequestConfig>).getHandlers();
    
    // 按顺序执行所有请求拦截器
    for (const handler of handlers) {
      try {
        if (handler.onFulfilled) {
          currentConfig = await handler.onFulfilled(currentConfig);
          // console.log('After request interceptor:', currentConfig);
        }
      } catch (error) {
        if (handler.onRejected) {
          currentConfig = await handler.onRejected(error);
        } else {
          throw error;
        }
      }
    }
    
    return currentConfig;
  }

  private async runResponseInterceptors(response: Response): Promise<any> {
    let currentResponse = response;
    
    // 获取所有响应拦截器
    const handlers = (this.interceptors.response as Interceptor<Response>).getHandlers();
    
    // 按顺序执行所有响应拦截器
    for (const handler of handlers) {
      try {
        if (handler.onFulfilled) {
          if (!response.ok) {
            throw new Error(handleErrorMessage(response.status));
          }
          currentResponse = await handler.onFulfilled(currentResponse);
        }
      } catch (error) {
        if (handler.onRejected) {
          currentResponse = await handler.onRejected(error);
        } else {
          throw error;
        }
      }
    }
    
    return currentResponse;
  }

  private async request<T>(url: string, config: BaseRequestConfig = {}): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);

    try {
      const { retry, retryDelay, ...restConfig } = config;
      
      // 应用请求拦截器
      const finalConfig = await this.runRequestInterceptors(restConfig);

      // 处理超时
      const controller = new AbortController();
      const timeout = finalConfig.timeout || this.defaultConfig.timeout;
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // 构建请求选项
      const requestInit: RequestInit = {
        ...finalConfig,
        headers: {
          ...this.defaultConfig.headers,
          ...finalConfig.headers
        },
        signal: controller.signal
      };
      // console.log('requestInit', requestInit);
      // 如果设置了重试，使用重试逻辑
      if (retry && retry > 0) {
        return await this.retryRequest(
          async () => {
            const response = await fetch(this.getFullUrl(url), requestInit);
            clearTimeout(timeoutId);
            return this.runResponseInterceptors(response);
          },
          retry,
          retryDelay
        );
      }

      // 发起请求
      const response = await fetch(this.getFullUrl(url), requestInit);
      clearTimeout(timeoutId);

      // 应用响应拦截器
      return await this.runResponseInterceptors(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }

  async get<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  }

  async put<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  }

  async delete<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  async upload<T>(url: string, file: File | Blob | FormData, config?: BaseRequestConfig): Promise<T> {
    let formData: FormData;
    
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }

    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    });
  }

  async download(url: string, fileName?: string, config?: BaseRequestConfig): Promise<void> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      const finalConfig = await this.runRequestInterceptors(config || {});
      
      const response = await fetch(this.getFullUrl(url), {
        ...finalConfig,
        headers: {
          ...this.defaultConfig.headers,
          ...finalConfig.headers
        }
      });

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
        console.log(contentLength, receivedLength)
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
      this.handleError(error);
    } finally {
      endProgress();
    }
  }

  private getFileNameFromResponse(response: Response): string {
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches?.[1]) {
        return decodeURIComponent(matches[1].replace(/['"]/g, ''));
      }
    }
    return '';
  }

  // 重试机制

  // 流式请求方法
  async stream<T>(url: string, config?: BaseRequestConfig & {
    onMessage?: (data: T) => void;
    onError?: (error: any) => void;
    onComplete?: () => void;
    signal?: AbortSignal;
  }): Promise<void> {
    try {
      const response = await fetch(this.baseURL + url, {
        ...config,
        headers: {
          ...this.defaultConfig.headers,
          ...config?.headers,
          'Accept': 'text/event-stream',
        },
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            this.processStreamChunk(buffer, config);
          }
          config?.onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          this.processStreamChunk(line, config);
        }
      }
    } catch (error) {
      config?.onError?.(error);
      throw error;
    }
  }

  private processStreamChunk(chunk: string, config?: any) {
    if (chunk.startsWith('data: ')) {
      try {
        const data = JSON.parse(chunk.slice(6));
        config?.onMessage?.(data);
      } catch (error) {
        config?.onError?.(error);
      }
    }
  }

  protected handleError(error: any) {
    if (error.name === 'AbortError') {
      return Promise.reject(new Error('请求超时'));
    }
    
    if (error.response) {
      const status = error.response.status;
      message.error(handleErrorMessage(status));
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
}

export default new FetchRequest();
