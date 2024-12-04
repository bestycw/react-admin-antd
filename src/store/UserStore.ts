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
        if (!roles?.length) return true;
        return this.userInfo?.roles?.some(userRole => 
            roles.includes(userRole)
        ) ?? false;
    }

    hasAllRoles(roles: string[]): boolean {
        return this.userInfo?.roles 
            ? roles.every(role => this.userInfo?.roles.includes(role)) 
            : false
    }
    // 根据用户角色过滤路由
    filterRoutesByRoles(routes: CoRouteObject[]): CoRouteObject[] {
        return routes.map(route => {
            const newRoute = {...route};
            // console.log('newRoute', newRoute)
            // 如果是根路由或者 layout 为 false，则保留
            // console.log('newRoute', newRoute,newRoute.meta?.layout === false,route.root === true)
            if (newRoute.meta?.layout === false) {
                return newRoute;
            }
            
            // 1. 首先检查用户角色权限
            if (newRoute.meta?.roles?.length) {
                if (!this.hasAnyRole(newRoute.meta.roles)) {
                    newRoute.meta = newRoute.meta || {};
                    newRoute.meta.hidden = true;
                }
            }
            // 2. 然后检查动态路由权限
            if (!newRoute.meta?.hidden && newRoute.path && !newRoute.root) {  
                const dynamicRoutes = this.userInfo?.dynamicRoutesList || [];
                // console.log('dynamicRoutes', dynamicRoutes)
                // 如果是 layout=false 的路由，跳过动态路由检查
                const needCheckDynamicRoute = newRoute.meta?.layout !== false;
                const hasPermission = !needCheckDynamicRoute || 
                                    dynamicRoutes.includes('*') || 
                                    dynamicRoutes.includes(newRoute.path);

             
                if (!hasPermission) {
                    newRoute.meta = newRoute.meta || {};
                    newRoute.meta.hidden = true;
                }
            }

            // 递归处理子路由
            if (newRoute.children) {
                newRoute.children = this.filterRoutesByRoles(newRoute.children);
                
                // 修改子路由处理逻辑：
                // 1. 如果当前路由是根路由，即使所有子路由都被隐藏也不隐藏自己
                // 2. 如果不是根路由且所有子路由都被隐藏，则隐藏自己
                if (!route.root && 
                    newRoute.children.every((child: CoRouteObject) => child.meta?.hidden) && 
                    newRoute.meta?.layout !== false) {
                    newRoute.meta = newRoute.meta || {};
                    newRoute.meta.hidden = true;
                }
            }
   
            return newRoute;
        }).filter(route => {
            // 根路由和 layout=false 的路由始终保留
            if (!route.root || route.meta?.layout === false) {
                return true;
            }
            // 其他路由根据 hidden 属性过滤
            return !route.meta?.hidden;
        });
    }



    // 检查是否有指定权限
    hasPermission(permission: string): boolean {
        return this.userInfo?.permissions?.includes(permission) ?? false;
    }

    // 检查是否有任一权限
    hasAnyPermission(permissions: string[]): boolean {
        if (!permissions?.length) return true;
        return permissions.some(permission => this.hasPermission(permission));
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