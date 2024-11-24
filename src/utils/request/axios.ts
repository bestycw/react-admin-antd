import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios'
import { message } from 'antd'
import getGlobalConfig from '@/config/GlobalConfig'

interface RequestConfig extends AxiosRequestConfig {
    loading?: boolean
    token?: boolean
    retry?: number // 重试次数
    retryDelay?: number // 重试延迟时间(ms)
}

// interface ResponseData<T> {
//     code: number
//     data: T
//     message: string
// }

class Request {
    private instance: AxiosInstance
    private pendingRequests: Map<string, () => void>

    constructor() {
        this.pendingRequests = new Map()

        this.instance = axios.create({
            baseURL: getGlobalConfig('ApiUrl'),
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.initInterceptors()
    }

    private generateRequestKey(config: InternalAxiosRequestConfig): string {
        const { method, url, params, data } = config
        return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
    }

    private addPendingRequest(config: InternalAxiosRequestConfig): void {
        const requestKey = this.generateRequestKey(config)
        config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
            if (!this.pendingRequests.has(requestKey)) {
                this.pendingRequests.set(requestKey, cancel)
            }
        })
    }

    private removePendingRequest(config: InternalAxiosRequestConfig): void {
        const requestKey = this.generateRequestKey(config)
        if (this.pendingRequests.has(requestKey)) {
            const cancel = this.pendingRequests.get(requestKey)
            if (cancel) {
                cancel()
            }
            this.pendingRequests.delete(requestKey)
        }
    }

    private async retryRequest(error: Error, config: RequestConfig): Promise<unknown> {
        const retryCount = config.retry || 0
        if (retryCount <= 0) {
            return Promise.reject(error)
        }

        const retryDelay = config.retryDelay || 1000
        let currentRetry = 0

        const retryer = async (): Promise<unknown> => {
            try {
                currentRetry++
                console.log(`重试第 ${currentRetry}/${retryCount} 次`)
                const source = axios.CancelToken.source()
                // 创新的配置，移除重试相关配置避免无限重试
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { retry: _, retryDelay: __, ...restConfig } = config
                const newConfig = { 
                    ...restConfig, 
                    cancelToken: source.token 
                }
                return await this.instance.request(newConfig)
            } catch (err) {
                if (currentRetry < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay))
                    return retryer()
                }
                throw err
            }
        }

        if (axios.isCancel(error)) {
            throw error
        }

        return retryer()
    }

    private initInterceptors(): void {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                this.removePendingRequest(config)
                this.addPendingRequest(config)

                if ((config as RequestConfig).token !== false) {
                    const token = localStorage.getItem('token')
                    if (token && config.headers) {
                        config.headers['Authorization'] = `Bearer ${token}`
                    }
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                this.removePendingRequest(response.config)

                const { code, message: msg, data } = response.data

                if (code === 200) {
                    return data
                }

                message.error(msg || '请求失败')
                return Promise.reject(new Error(msg || '请求失败'))
            },
            async (error) => {
                if (error.config) {
                    this.removePendingRequest(error.config)
                }

                if (axios.isCancel(error)) {
                    console.log('请求已取消:', error.message)
                    return Promise.reject(error)
                }

                const config = error.config as RequestConfig
                if (config?.retry && config.retry > 0) {
                    try {
                        return await this.retryRequest(error, config)
                    } catch (retryError) {
                        error = retryError
                    }
                }

                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            message.error('未授权，请重新登录')
                            break
                        case 403:
                            message.error('拒绝访问')
                            break
                        case 404:
                            message.error('请求错误，未找到该资源')
                            break
                        case 500:
                            message.error('服务器错误')
                            break
                        default:
                            message.error(`连接错误${error.response.status}`)
                    }
                } else {
                    message.error('网络连接异常，请稍后重试')
                }
                return Promise.reject(error)
            }
        )
    }

    public cancelAllRequests(): void {
        for (const cancel of this.pendingRequests.values()) {
            cancel()
        }
        this.pendingRequests.clear()
    }

    public cancelRequest(config: InternalAxiosRequestConfig): void {
        const requestKey = this.generateRequestKey(config)
        if (this.pendingRequests.has(requestKey)) {
            const cancel = this.pendingRequests.get(requestKey)
            if (cancel) {
                cancel()
            }
            this.pendingRequests.delete(requestKey)
        }
    }

    public get<T>(url: string, config?: RequestConfig): Promise<T> {
        return this.instance.get(url, config)
    }

    public post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        return this.instance.post(url, data, config)
    }

    public put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        return this.instance.put(url, data, config)
    }

    public delete<T>(url: string, config?: RequestConfig): Promise<T> {
        return this.instance.delete(url, config)
    }

    /**
     * 文件下载方法
     * @param url 下载地址
     * @param fileName 文件名（可选）
     * @param config 请求配置（可选）
     */
    public async download(
        url: string,
        fileName?: string,
        config?: RequestConfig
    ): Promise<void> {
        try {
            const response = await this.instance({
                url,
                method: 'GET',
                responseType: 'blob',
                ...config
            });

            // 获取文件名
            let downloadFileName = fileName;
            if (!downloadFileName) {
                // 尝试从响应头获取文件名
                const contentDisposition = response.headers['content-disposition'];
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (filenameMatch && filenameMatch[1]) {
                        downloadFileName = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
                    }
                }
                // 如果还是没有文件名，使用时间戳
                if (!downloadFileName) {
                    const extension = this.getFileExtension(response.headers['content-type']);
                    downloadFileName = `download_${Date.now()}${extension}`;
                }
            }

            // 创建下载链接
            const blob = new Blob([response.data], {
                type: response.headers['content-type']
            });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return Promise.resolve();
        } catch (error) {
            message.error('下载失败，请重试！');
            return Promise.reject(error);
        }
    }

    /**
     * 获取文件扩展名
     * @param mimeType MIME类型
     */
    private getFileExtension(mimeType: string): string {
        const mimeTypeMap: Record<string, string> = {
            'application/pdf': '.pdf',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-excel': '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
            'application/vnd.ms-powerpoint': '.ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'text/plain': '.txt',
            'application/zip': '.zip',
            'application/x-rar-compressed': '.rar'
        };

        return mimeTypeMap[mimeType] || '';
    }

    /**
     * 导出文件（POST方法）
     * @param url 导出地址
     * @param data 请求数据
     * @param fileName 文件名（可选）
     * @param config 请求配置（可选）
     */
    public async export(
        url: string,
        data?: unknown,
        fileName?: string,
        config?: RequestConfig
    ): Promise<void> {
        try {
            const response = await this.instance({
                url,
                method: 'POST',
                data,
                responseType: 'blob',
                ...config
            });

            // 处理文件名
            let downloadFileName = fileName;
            if (!downloadFileName) {
                const contentDisposition = response.headers['content-disposition'];
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (filenameMatch && filenameMatch[1]) {
                        downloadFileName = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
                    }
                }
                if (!downloadFileName) {
                    const extension = this.getFileExtension(response.headers['content-type']);
                    downloadFileName = `export_${Date.now()}${extension}`;
                }
            }

            // 创建下载链接
            const blob = new Blob([response.data], {
                type: response.headers['content-type']
            });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return Promise.resolve();
        } catch (error) {
            message.error('导出失败，请重试！');
            return Promise.reject(error);
        }
    }
}

export default new Request()