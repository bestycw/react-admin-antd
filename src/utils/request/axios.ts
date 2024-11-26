import { BaseRequest, BaseRequestConfig, ResponseData } from './base';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosProgressEvent } from 'axios';

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
      (config: any) => {
        const { token, ...axiosConfig } = config;
        if (token !== false) {
          const tokenValue = localStorage.getItem('token');
          if (tokenValue) {
            axiosConfig.headers.Authorization = `Bearer ${tokenValue}`;
          }
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        if (response.data.code !== 200) {
          return Promise.reject(new Error(response.data.message || '请求失败'));
        }
        return response.data.data;
      },
      (error) => Promise.reject(error)
    );
  }

  private toAxiosConfig(config?: BaseRequestConfig): AxiosRequestConfig {
    if (!config) return {};
    const { onUploadProgress, onDownloadProgress, ...rest } = config;
    return {
      ...rest,
      onUploadProgress: onUploadProgress && ((e: AxiosProgressEvent) => {
        onUploadProgress(e.loaded / (e.total || 1));
      }),
      onDownloadProgress: onDownloadProgress && ((e: AxiosProgressEvent) => {
        onDownloadProgress(e.loaded / (e.total || 1));
      })
    };
  }

  async get<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      return await this.instance.get(url, this.toAxiosConfig(config));
    } catch (error) {
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }

  async post<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      return await this.instance.post(url, data, this.toAxiosConfig(config));
    } catch (error) {
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }

  async upload<T>(url: string, file: File | Blob | FormData, config?: BaseRequestConfig): Promise<T> {
    let formData: FormData;
    
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }

    return this.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    });
  }

  async download(url: string, fileName?: string, config?: BaseRequestConfig): Promise<void> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      const response = await this.instance.get(url, this.toAxiosConfig({
        ...config,
        responseType: 'blob'
      }));

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'download';
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
}

export default new AxiosRequest();