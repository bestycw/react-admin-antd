import { BaseRequest, BaseRequestConfig, ResponseData } from './base';

export class FetchRequest extends BaseRequest {
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
      body: formData
    });
  }

  async download(url: string, fileName?: string, config?: BaseRequestConfig): Promise<void> {
    const fullUrl = this.getFullUrl(url);
    const endProgress = this.handleProgress(config?.loading);

    try {
      const response = await fetch(fullUrl, config);
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
      this.handleError(error);
    } finally {
      endProgress();
    }
  }

  private async request<T>(url: string, config?: BaseRequestConfig): Promise<T> {
    const endProgress = this.handleProgress(config?.loading);

    try {
      if (config?.retry && config?.retry > 0) {
        return await this.retryRequest(
          () => this.request<T>(url, { ...config, retry: 0 }),
          config.retry,
          config.retryDelay
        );
      }

      const fullUrl = this.getFullUrl(url);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), config?.timeout || this.defaultConfig.timeout);
      });

      const fetchPromise = fetch(fullUrl, {
        ...config,
        headers: {
          ...this.defaultConfig.headers,
          ...config?.headers,
          ...(config?.token !== false && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json() as ResponseData<T>;
      if (data.code !== 200) throw new Error(data.message || '请求失败');

      return data.data;
    } catch (error) {
      return this.handleError(error);
    } finally {
      endProgress();
    }
  }
}

export default new FetchRequest();
