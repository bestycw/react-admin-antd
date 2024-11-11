import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios'
import { message } from 'antd'
import GlobalConfig from '../config/GlobalConfig'
const { ApiUrl } = GlobalConfig

interface RequestConfig extends AxiosRequestConfig {
    loading?: boolean
    token?: boolean
    retry?: number // 重试次数
    retryDelay?: number // 重试延迟时间(ms)
}

interface ResponseData<T> {
    code: number
    data: T
    message: string
}

class Request {
    private instance: AxiosInstance
    private pendingRequests: Map<string, () => void>

    constructor() {
        this.pendingRequests = new Map()

        this.instance = axios.create({
            baseURL: ApiUrl,
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
                // 创建新的配置，移除重试相关配置避免无限重试
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
            (response: AxiosResponse<ResponseData<unknown>>) => {
                this.removePendingRequest(response.config)

                const { code, message: msg, data } = response.data

                if (code === 200) {
                    return Promise.resolve(data)
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
}

export default new Request()