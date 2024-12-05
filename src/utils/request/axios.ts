import { BaseRequest, BaseRequestConfig } from './base';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { message } from 'antd';
import { ErrorCode, handleErrorMessage } from '@/utils/request/errorCode';
import authStorage from '../storage/authStorage';
import { TIME } from '@/config/constants';
import { authService } from '@/services/auth';

export class AxiosRequest extends BaseRequest {
  private instance: AxiosInstance;

  constructor(config?: BaseRequestConfig) {
    super(config);
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.defaultConfig.timeout,
      headers: this.defaultConfig.headers
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config: any) => {
        // const {  ...axiosConfig } = config;
        // if (token !== false) {
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
        // }
        return {...config,headers};
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.config.responseType === 'blob') {
          return response;
        }
        if (response.data.code !== ErrorCode.SUCCESS) {
          return Promise.reject(new Error(response.data.message || handleErrorMessage(response.data.code)));
        }
        return response.data;
      },
      (error) => this.handleError(error)
    );
  }

  private toAxiosConfig(config?: BaseRequestConfig): AxiosRequestConfig {
    if (!config) return {};
    const { onUploadProgress, onDownloadProgress, ...rest } = config;
    return {
      ...rest,
      onUploadProgress: onUploadProgress && ((e: AxiosProgressEvent) => {
        const total = e.total || 0;
        onUploadProgress(total ? e.loaded / total : 0);
      }),
      onDownloadProgress: onDownloadProgress && ((e: AxiosProgressEvent) => {
        const total = e.total || 0;
        onDownloadProgress(total ? e.loaded / total : 0);
      })
    };
  }

  // 发送请求
  private async request<T>(config: AxiosRequestConfig & { retry?: number, retryDelay?: number, loading?: boolean }): Promise<T> {
    const { retry, retryDelay, loading, ...axiosConfig } = config;
    // console.log('axiosConfig', axiosConfig);
    const endProgress = this.handleProgress(loading);
      // 处理超时
      const controller = new AbortController();
      const timeout = config.timeout || this.defaultConfig.timeout;
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      // console.log('timeoutId', timeout);
      const finalConfig = {
        ...axiosConfig,
        signal: controller.signal
      };
    try {
      if (retry && retry > 0) {
        return await this.retryRequest(async () => {
          const { data } = await this.instance.request<T>(finalConfig);
          clearTimeout(timeoutId);

          return data;
        }, retry, retryDelay);
      }

      const { data } = await this.instance.request<T>(finalConfig);
      clearTimeout(timeoutId);

      return data;
    } catch (error) {
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }

  // GET 请求
  async get<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>({
      ...this.toAxiosConfig(config),
      method: 'GET',
      url
    });
  }

  // POST 请求
  async post<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>({
      ...this.toAxiosConfig(config),
      method: 'POST',
      url,
      data
    });
  }

  // PUT 请求
  async put<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>({
      ...this.toAxiosConfig(config),
      method: 'PUT',
      url,
      data
    });
  }

  // DELETE 请求
  async delete<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    return this.request<T>({
      ...this.toAxiosConfig(config),
      method: 'DELETE',
      url
    });
  }

  // 上传文件
  async upload<T>(url: string, file: File | Blob | FormData, config?: BaseRequestConfig): Promise<T> {
    let formData: FormData;
    
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }
    // console.log('formData', this.toAxiosConfig(config));
    // return this.instance.post(url,formData)
    return this.request<T>({
      // ...this.toAxiosConfig(config),
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    });
  }

  // 下载文件
  async download(url: string, fileName?: string, config?: BaseRequestConfig): Promise<void> {
    const response = await this.request<Blob>({
      ...this.toAxiosConfig(config),
      method: 'GET',
      url,
      responseType: 'blob'
    });

    // 处理下载
    const blob = new Blob([response], { type: 'application/octet-stream' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  protected handleError(error: any) {
    if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求已取消或超时'));
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

export default new AxiosRequest();