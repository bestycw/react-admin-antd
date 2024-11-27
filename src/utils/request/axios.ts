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
        if (response.config.responseType === 'blob') {
          return response;
        }
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
        const total = e.total || 0;
        onUploadProgress(total ? e.loaded / total : 0);
      }),
      onDownloadProgress: onDownloadProgress && ((e: AxiosProgressEvent) => {
        const total = e.total || 0;
        onDownloadProgress(total ? e.loaded / total : 0);
      })
    };
  }

  async get<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);
    // console.log('get config:', config);
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

  async put<T>(url: string, data?: any, config?: BaseRequestConfig): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      return await this.instance.put(url, data, this.toAxiosConfig(config));
    } catch (error) {
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }

  async delete<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      return await this.instance.delete(url, this.toAxiosConfig(config));
    } catch (error) {
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }

  async upload<T>(url: string, file: File | Blob | FormData, config?: BaseRequestConfig): Promise<T> {
    let formData: FormData;
    // console.log('upload file:', file);
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }

    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      },
      onUploadProgress: config?.onUploadProgress
    };

    return this.post<T>(url, formData, uploadConfig);
  }

  async download(url: string, fileName?: string, config?: BaseRequestConfig): Promise<void> {
    const endProgress = this.handleProgress(config?.loading);
    try {
      const response = await this.instance.get(url, {
        ...this.toAxiosConfig(config),
        responseType: 'blob',
        validateStatus: (status) => status === 200
      });

      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = JSON.parse(reader.result as string);
            throw new Error(result.message || '下载失败');
          } catch (e) {
            throw new Error('下载失败');
          }
        };
        reader.readAsText(response.data);
        return;
      }

      const blob = new Blob([response.data], {
        type: contentType || 'application/octet-stream'
      });
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

  private getFileNameFromResponse(response: AxiosResponse): string {
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.includes('filename=')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches?.[1]) {
        return decodeURIComponent(matches[1].replace(/['"]/g, ''));
      }
    }
    return '';
  }

  // 发送请求
  async request<T = any>(config: AxiosRequestConfig & { retry?: number, retryDelay?: number }): Promise<T> {
    const { retry, retryDelay, ...axiosConfig } = config;
    console.log('axiosConfig:', axiosConfig);
    if (retry && retry > 0) {
      return this.retryRequest(async () => {
        try {
          return await this.instance.request(axiosConfig);
        } catch (error) {
          console.error('Request failed:', error);
          throw error;
        }
      }, retry, retryDelay);
    }
    
    return this.instance.request(axiosConfig);
  }
}

export default new AxiosRequest();