/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx"
import { CoRouteObject } from "../types/route.d"
import { authService } from '@/services/auth'
import type { UserInfo as AuthUserInfo } from '@/services/auth'
import type { NotificationSetting } from '@/types/notification'

interface UserInfo extends AuthUserInfo {
  accessToken: string;
}

interface Device {
  id: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface ApiToken {
  id: string;
  name: string;
  token: string;
  permissions: string[];
  expiresAt: string;
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
}

// export type ThemeStyle = 'light' | 'dark' | 'dynamic';

class UserStore {
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.initUserInfo()
    }

    userInfo: UserInfo | null = null;
    // isLogin = false;
    dynamicRoutes: CoRouteObject[] = [];
    allRoutes: CoRouteObject[] = [];
    permissions: string[] = [];
    devices: Device[] = [];
    notificationSettings: NotificationSetting[] = [
        { type: 'system', email: true, browser: true, mobile: false },
        { type: 'security', email: true, browser: true, mobile: true },
        { type: 'activity', email: false, browser: true, mobile: false }
    ];
    notificationMode: 'all' | 'important' | 'none' = 'all';
    apiTokens: ApiToken[] = [];

    private initUserInfo() {
        const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                runInAction(() => {
                    this.setUserInfo(parsedUserInfo);
                    this.permissions = parsedUserInfo?.permissions || [];
                });
            } catch (error) {
                console.error('Failed to parse stored user info:', error);
                this.clearUserInfo();
            }
        }
    }

    // async getDynamicRoutes() {
    //     try {
    //         const backRoutes = await fetchBackendRoutes()
    //         if (backRoutes) {
    //             // 缓存动态路由
    //             localStorage.setItem('dynamicRoutes', JSON.stringify(backRoutes))
    //         }
    //         return backRoutes
    //     } catch (error) {
    //         console.error('Failed to get dynamic routes:', error)
    //         throw error
    //     }
    // }

    setDynamicRoutes(routes: CoRouteObject[]) {
        runInAction(() => {
            this.dynamicRoutes = routes
            // this.isInitDynamicRoutes = true
        })
    }

    setUserInfo(userInfo: UserInfo, remember?: boolean) {
        runInAction(() => {
            this.userInfo = userInfo;
            // this.isLogin = true;
            
            // 存储用户信息
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem('userInfo', JSON.stringify(userInfo));
        });
    }

    clearUserInfo() {
        runInAction(() => {
            this.userInfo = {
                id: '',
                username: '',
                email: '',
                avatar: '',
                roles: [],
                permissions: [],
                status: '',
                lastLogin: '',
                accessToken: '',
                dynamicRoutesList: []
            };
            this.dynamicRoutes = [];
            // this.allRoutes = [];
            // this.isLogin = false;
            // this.isInitDynamicRoutes = false;
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            sessionStorage.removeItem('userInfo');
        });
    }

    setAllRoutes(routes: CoRouteObject[]) {
            this.allRoutes = routes
    }
  
    get hasAllRoutes() {
        return this.allRoutes.length > 0
    }

    get routeList(): string[] {
        return this.allRoutes.map(route => route.path || '')
    }
    get userName(): string {
        return this.userInfo?.username ?? ''
    }

    get userRoles(): string[] {
        return this.userInfo?.roles ?? []
    }

    hasRole(role: string): boolean {
        return this.userInfo?.roles?.includes(role) ?? false
    }

    hasAnyRole(roles: string[]): boolean {
        // console.log('Checking roles:', {
        //     userRoles: this.userInfo?.roles,
        //     requiredRoles: roles
        // })
        if (!roles?.length) return true // 如果没有指定角色要求，则默认有权限
        return this.userInfo?.roles?.some(userRole => 
            roles.includes(userRole)
        ) ?? false
    }

    hasAllRoles(roles: string[]): boolean {
        return this.userInfo?.roles 
            ? roles.every(role => this.userInfo?.roles.includes(role)) 
            : false
    }
    // 根据用户角色过滤路由
    filterRoutesByRoles(routes: CoRouteObject[]): CoRouteObject[] {
        return routes.map(route => {
            const newRoute = { ...route }

            // 检查路由是否需要权限控制
            if (newRoute.meta?.roles?.length) {
                if (!this.hasAnyRole(newRoute.meta.roles)) {
                    newRoute.meta = newRoute.meta || {};
                    newRoute.meta.hidden = true;
                }
            }

            // 递归处理子路由
            if (newRoute.children) {
                newRoute.children = this.filterRoutesByRoles(newRoute.children)
                
                // 如果所有子路由都被隐藏，则也隐藏父路由
                if (newRoute.children.every(child => child.meta?.hidden)) {
                    newRoute.meta = newRoute.meta || {};
                    newRoute.meta.hidden = true;
                }
            }

            return newRoute
        }).filter(route => {
            // 过滤掉不需要显示的路由
            if (route.meta?.hidden) {
                return false;
            }

            // 如果是根路由或没有子路由，直接返回
            if (route.root || !route.children) {
                return true
            }

            // 如果有子路由，确保至少有一个可见的子路由
            return route.children.some(child => !child.meta?.hidden);
        })
    }

    // 检查是否有某个权限
    hasPermission(code: string): boolean {
        // 如果权限列表包含 '*' 或为空，则拥有所有权限
        if (!this.permissions || this.permissions.includes('*') || this.permissions.length === 0) {
            return true
        }
        
        return this.permissions.includes(code)
    }

    async updateProfile(data: Partial<UserInfo>) {
        const response = await authService.updateProfile(data);
 
        runInAction(() => {
            if (this.userInfo) {
                // 只更新响应中包含的字段
                const updatedUserInfo = {
                    ...this.userInfo,
                    ...response,
                    // 保持这些字段不变
                    username: this.userInfo.username,
                    roles: this.userInfo.roles,
                    permissions: this.userInfo.permissions,
                    dynamicRoutesList: this.userInfo.dynamicRoutesList,
                    accessToken: this.userInfo.accessToken
                };

                this.userInfo = updatedUserInfo;
                // 更新本地存储
                const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
                storage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            }
        });
    }

    async updateAvatar(avatarUrl: string) {
        runInAction(() => {
            if (this.userInfo) {
                this.userInfo.avatar = avatarUrl;
            }
        });
    }

    // Profile management methods
    changePassword = async (oldPassword: string, newPassword: string) => {
        await authService.changePassword(oldPassword, newPassword);
    };

    // Device management
    fetchDevices = async () => {
        // TODO: Implement API endpoint
        // Mock data for now
        this.devices = [
            {
                id: '1',
                browser: 'Chrome',
                os: 'Windows',
                ip: '192.168.1.1',
                location: 'Beijing, China',
                lastActive: new Date().toISOString(),
                current: true
            },
            {
                id: '2',
                browser: 'Safari',
                os: 'iOS',
                ip: '192.168.1.2',
                location: 'Shanghai, China',
                lastActive: new Date().toISOString(),
                current: false
            }
        ];
    };

    revokeDevice = async (deviceId: string) => {
        // TODO: Implement API endpoint
        this.devices = this.devices.filter(device => device.id !== deviceId);
    };

    // Notification settings
    updateNotificationSetting = (type: string, channel: string, value: boolean) => {
        this.notificationSettings = this.notificationSettings.map(setting => {
            if (setting.type === type) {
                return { ...setting, [channel]: value };
            }
            return setting;
        });
    };

    setNotificationMode = (mode: 'all' | 'important' | 'none') => {
        this.notificationMode = mode;
    };

    // API token management
    fetchApiTokens = async () => {
        // TODO: Implement API endpoint
        // Mock data for now
        this.apiTokens = [
            {
                id: '1',
                name: 'Development Token',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                permissions: ['read', 'write'],
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                lastUsed: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                status: 'active'
            }
        ];
    };

    createApiToken = async (data: any) => {
        // TODO: Implement API endpoint
        const newToken = {
            id: Math.random().toString(),
            ...data,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            status: 'active' as const
        };
        this.apiTokens.push(newToken);
        return newToken;
    };

    revokeApiToken = async (tokenId: string) => {
        // TODO: Implement API endpoint
        this.apiTokens = this.apiTokens.map(token => {
            if (token.id === tokenId) {
                return { ...token, status: 'revoked' as const };
            }
            return token;
        });
    };
}

export default new UserStore()