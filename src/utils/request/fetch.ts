import { BaseRequest, BaseRequestConfig, ResponseData } from './base';

interface RequestInterceptor {
  onFulfilled?: (config: BaseRequestConfig) => BaseRequestConfig | Promise<BaseRequestConfig>;
  onRejected?: (error: any) => any;
}

interface ResponseInterceptor {
  onFulfilled?: (response: Response) => any;
  onRejected?: (error: any) => any;
}

export class FetchRequest extends BaseRequest {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config?: BaseRequestConfig) {
    super(config);
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors() {
    // 添加默认的请求拦截器
    this.interceptors.request.use(
      (config: BaseRequestConfig) => {
        if (config.token !== false) {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`
            };
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 添加默认的响应拦截器
    this.interceptors.response.use(
      async (response: Response) => {
        if (!response.ok) {
          throw new Error(response.statusText || '请求失败');
        }
        const data = await response.json() as ResponseData;
        if (data.code !== 200) {
          throw new Error(data.message || '请求失败');
        }
        return data.data;
      },
      (error) => Promise.reject(error)
    );
  }

  // 拦截器管理
  public interceptors = {
    request: {
      use: (onFulfilled?: RequestInterceptor['onFulfilled'], onRejected?: RequestInterceptor['onRejected']) => {
        this.requestInterceptors.push({ onFulfilled, onRejected });
      }
    },
    response: {
      use: (onFulfilled?: ResponseInterceptor['onFulfilled'], onRejected?: ResponseInterceptor['onRejected']) => {
        this.responseInterceptors.push({ onFulfilled, onRejected });
      }
    }
  };

  private async runRequestInterceptors(config: BaseRequestConfig): Promise<BaseRequestConfig> {
    let currentConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onFulfilled) {
        try {
          currentConfig = await interceptor.onFulfilled(currentConfig);
        } catch (error) {
          if (interceptor.onRejected) {
            throw interceptor.onRejected(error);
          }
          throw error;
        }
      }
    }
    return currentConfig;
  }

  private async runResponseInterceptors(response: Response): Promise<any> {
    let currentResponse = response;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        try {
          currentResponse = await interceptor.onFulfilled(currentResponse);
        } catch (error) {
          if (interceptor.onRejected) {
            throw interceptor.onRejected(error);
          }
          throw error;
        }
      }
    }
    return currentResponse;
  }

  private async request<T>(url: string, config: BaseRequestConfig = {}): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);

    try {
      // 应用请求拦截器
      const finalConfig = await this.runRequestInterceptors(config);

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

      // 发起请求
      const response = await fetch(this.getFullUrl(url), requestInit);
      clearTimeout(timeoutId);

      // 应用响应拦截器
      return await this.runResponseInterceptors(response);
    } catch (error) {
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
}

export default new FetchRequest();
