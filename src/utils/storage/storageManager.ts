/**
 * 存储管理器类型定义
 */
type StorageType = 'local' | 'session'
type ExpiryTime = number | Date
interface StorageData<T> {
    value: T
    expires?: number // 过期时间戳
    timestamp: number // 存储时间戳
}

/**
 * 存储管理器
 * 提供本地存储和会话存储的统一管理
 */
class StorageManager {
    /**
     * 设置存储项
     * @param key - 存储键
     * @param value - 存储值
     * @param options - 配置项
     */
    static set<T>(
        key: string, 
        value: T, 
        options: {
            type?: StorageType
            expires?: ExpiryTime
        } = {}
    ): void {
        const { type = 'local', expires } = options
        const storage = type === 'local' ? localStorage : sessionStorage

        const data: StorageData<T> = {
            value,
            timestamp: Date.now()
        }

        // 设置过期时间
        if (expires) {
            data.expires = expires instanceof Date 
                ? expires.getTime()
                : Date.now() + expires
        }

        storage.setItem(key, JSON.stringify(data))
    }

    /**
     * 获取存储项
     * @param key - 存储键
     * @param defaultValue - 默认值
     * @param options - 配置项
     */
    static get<T>(
        key: string, 
        defaultValue: T, 
        options: {
            type?: StorageType
            removeIfExpired?: boolean
        } = {}
    ): T {
        const { type = 'local', removeIfExpired = true } = options
        const storage = type === 'local' ? localStorage : sessionStorage

        const item = storage.getItem(key)
        if (!item) return defaultValue

        try {
            const data = JSON.parse(item) as StorageData<T>

            // 检查是否过期
            if (data.expires && Date.now() > data.expires) {
                if (removeIfExpired) {
                    this.remove(key, { type })
                }
                return defaultValue
            }

            return data.value
        } catch {
            // 如果解析失败，返回原始值（向后兼容）
            return item as unknown as T
        }
    }

    /**
     * 移除存储项
     * @param key - 存储键或键数组
     * @param options - 配置项
     */
    static remove(
        key: string | string[], 
        options: { type?: StorageType } = {}
    ): void {
        const { type = 'local' } = options
        const storage = type === 'local' ? localStorage : sessionStorage

        if (Array.isArray(key)) {
            key.forEach(k => storage.removeItem(k))
        } else {
            storage.removeItem(key)
        }
    }

    /**
     * 清空存储
     * @param type - 存储类型
     */
    static clear(type: StorageType = 'local'): void {
        const storage = type === 'local' ? localStorage : sessionStorage
        storage.clear()
    }

    /**
     * 获取所有存储键
     * @param type - 存储类型
     */
    static keys(type: StorageType = 'local'): string[] {
        const storage = type === 'local' ? localStorage : sessionStorage
        return Object.keys(storage)
    }

    /**
     * 获取存储项数量
     * @param type - 存储类型
     */
    static size(type: StorageType = 'local'): number {
        const storage = type === 'local' ? localStorage : sessionStorage
        return storage.length
    }

    /**
     * 检查存储项是否存在
     * @param key - 存储键
     * @param options - 配置项
     */
    static has(
        key: string, 
        options: {
            type?: StorageType
            checkExpiry?: boolean
        } = {}
    ): boolean {
        const { type = 'local', checkExpiry = true } = options
        const storage = type === 'local' ? localStorage : sessionStorage

        const item = storage.getItem(key)
        if (!item) return false

        if (!checkExpiry) return true

        try {
            const data = JSON.parse(item) as StorageData<unknown>
            return !data.expires || Date.now() <= data.expires
        } catch {
            return true
        }
    }

    /**
     * 获取存储项的剩余有效期（毫秒）
     * @param key - 存储键
     * @param options - 配置项
     */
    static getTimeToLive(
        key: string, 
        options: { type?: StorageType } = {}
    ): number | null {
        const { type = 'local' } = options
        const storage = type === 'local' ? localStorage : sessionStorage

        const item = storage.getItem(key)
        if (!item) return null

        try {
            const data = JSON.parse(item) as StorageData<unknown>
            if (!data.expires) return null

            const ttl = data.expires - Date.now()
            return ttl > 0 ? ttl : 0
        } catch {
            return null
        }
    }

    /**
     * 更新存储项的过期时间
     * @param key - 存储键
     * @param expires - 新的过期时间
     * @param options - 配置项
     */
    static updateExpiry(
        key: string, 
        expires: ExpiryTime, 
        options: { type?: StorageType } = {}
    ): boolean {
        const { type = 'local' } = options
        const storage = type === 'local' ? localStorage : sessionStorage

        const item = storage.getItem(key)
        if (!item) return false

        try {
            const data = JSON.parse(item) as StorageData<unknown>
            data.expires = expires instanceof Date 
                ? expires.getTime() 
                : Date.now() + expires
            storage.setItem(key, JSON.stringify(data))
            return true
        } catch {
            return false
        }
    }
}

export default StorageManager