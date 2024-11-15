import { makeAutoObservable } from "mobx"
import { CoRouteObject } from '../types/route'
// import { MenuProps } from 'antd'

export interface MenuItem {
    key: string
    label: string
    icon?: React.ReactNode
    path?: string
    children?: MenuItem[]
    roles?: string[]
    hidden?: boolean
}

interface TagItem {
    path: string
    title: string
}

class MenuStore {
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.initMenuState()
    }

    // 菜单列表
    menuList: CoRouteObject[] = []

    // 当前选中的菜单项
    selectedKeys: string[] = []

    // 展开的子菜单
    openKeys: string[] = []

    // 菜单是否折叠
    collapsed = false

    // 访问过的标签
    visitedTags: TagItem[] = []

    // 初始化菜单状态
    private initMenuState() {
        // 从本地存储恢复菜单状态
        const storedOpenKeys = localStorage.getItem('menuOpenKeys')
        const storedCollapsed = localStorage.getItem('menuCollapsed')

        if (storedOpenKeys) {
            this.openKeys = JSON.parse(storedOpenKeys)
        }

        if (storedCollapsed) {
            this.collapsed = JSON.parse(storedCollapsed)
        }
    }

    // 设置菜单列表
    setMenuList(menuList: CoRouteObject[]) {
        this.menuList = menuList
    }

    // 设置选中的菜单项
    setSelectedKeys(selectedKeys: string[]) {
        this.selectedKeys = selectedKeys
        // 从 menuList 中查找对应的菜单项
        const currentMenu = this.findMenuByPath(selectedKeys[0])
        if (currentMenu?.label) {
            this.addTag({
                path: selectedKeys[0],
                title: currentMenu.label
            })
        }
    }

    // 设置展开的子菜单
    setOpenKeys(openKeys: string[]) {
        this.openKeys = openKeys
        localStorage.setItem('menuOpenKeys', JSON.stringify(openKeys))
    }

    // 切换菜单折叠状态
    toggleCollapsed() {
        this.collapsed = !this.collapsed
        localStorage.setItem('menuCollapsed', JSON.stringify(this.collapsed))
    }

    // 设置菜单折叠状态
    setCollapsed(collapsed: boolean) {
        this.collapsed = collapsed
        localStorage.setItem('menuCollapsed', JSON.stringify(collapsed))
    }

    // 根据路径查找菜单项
    findMenuByPath(path: string): MenuItem | undefined {
        const find = (items: MenuItem[]): MenuItem | undefined => {
            for (const item of items) {
                if (item.path === path) {
                    return item
                }
                if (item.children) {
                    const found = find(item.children)
                    if (found) return found
                }
            }
        }
        return find(this.menuList)
    }

    // 根据角色过滤菜单
    filterMenuByRoles(roles: string[]): MenuItem[] {
        const filter = (items: MenuItem[]): MenuItem[] => {
            return items.filter(item => {
                // 如果没有设置roles，则所有角色都可访问
                if (!item.roles || item.roles.length === 0) {
                    return true
                }
                // 检查角色是否有权限
                const hasPermission = item.roles.some(role => roles.includes(role))
                
                if (hasPermission && item.children) {
                    item.children = filter(item.children)
                }
                
                return hasPermission
            })
        }
        // console.log(this.menuList)
        return filter(this.menuList)
    }

    // 获取面包屑
    getBreadcrumbs(path: string): MenuItem[] {
        const breadcrumbs: MenuItem[] = []
        
        const find = (items: MenuItem[], parent?: MenuItem) => {
            for (const item of items) {
                if (item.path === path) {
                    if (parent) {
                        breadcrumbs.push(parent)
                    }
                    breadcrumbs.push(item)
                    return true
                }
                if (item.children && find(item.children, item)) {
                    return true
                }
            }
            return false
        }

        find(this.menuList)
        return breadcrumbs
    }

    // 重置菜单状态
    resetMenuState() {
        this.selectedKeys = []
        this.openKeys = []
        this.collapsed = false
        localStorage.removeItem('menuOpenKeys')
        localStorage.removeItem('menuCollapsed')
    }

    // 将路由转换为菜单项
    routesToMenuItems(routes: CoRouteObject[]): MenuItem[] {
        return routes
            .filter(route => !route.hidden) // 过滤掉隐藏的路由
            .map(route => ({
                key: route.path || '',
                label: route.meta?.title || '',
                icon: route.meta?.icon,
                path: route.path,
                roles: route.meta?.roles,
                children: route.children ? this.routesToMenuItems(route.children) : undefined
            }))
            .filter(item => item.label) // 过滤掉没有标题的项
    }

    // 根据路由更新菜单
    updateMenuFromRoutes(routes: CoRouteObject[]) {
        const menuItems = this.routesToMenuItems(routes)
        console.log(routes)
        this.setMenuList(menuItems)
        
        // 如果没有选中的菜单项，选择第一个可用的菜单项
        if (this.selectedKeys.length === 0 && menuItems.length > 0) {
            const firstPath = this.findFirstAvailablePath(menuItems)
            if (firstPath) {
                this.setSelectedKeys([firstPath])
                return firstPath // 返回第一个可用路径用于导航
            }
        }
        return null
    }

    // 查找第一个可用的路径
    private findFirstAvailablePath(items: MenuItem[]): string | null {
        for (const item of items) {
            if (item.path) {
                return item.path
            }
            if (item.children) {
                const childPath = this.findFirstAvailablePath(item.children)
                if (childPath) {
                    return childPath
                }
            }
        }
        return null
    }

    // 添加访问标签
    addTag(tag: TagItem) {
        if (!this.visitedTags.find(t => t.path === tag.path)) {
            this.visitedTags.push(tag)
        }
    }

    // 移除访问标签
    removeTag(path: string) {
        const index = this.visitedTags.findIndex(tag => tag.path === path)
        if (index > -1) {
            this.visitedTags.splice(index, 1)
            // 如果关闭的是当前标签，则跳转到最后一个标签
            if (path === this.selectedKeys[0] && this.visitedTags.length > 0) {
                const lastTag = this.visitedTags[this.visitedTags.length - 1]
                this.setSelectedKeys([lastTag.path])
            }
        }
    }

    // 根据路径查找路由
    private findRouteByPath(path: string): CoRouteObject | undefined {
        const find = (routes: CoRouteObject[]): CoRouteObject | undefined => {
            for (const route of routes) {
                if (route.path === path) return route
                if (route.children) {
                    const found = find(route.children)
                    if (found) return found
                }
            }
        }
        return find(this.menuList)
    }
}

export default new MenuStore()
