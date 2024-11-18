import { makeAutoObservable } from "mobx"
import { CoRouteObject } from '../types/route'

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
        this.initState()
    }
    finalRoutes: CoRouteObject[] = []
    menuList: MenuItem[] = []
    selectedKeys: string[] = []
    visitedTags: TagItem[] = []
    showTabs: boolean = true
    openKeys: string[] = []

    private initState() {
        const storedShowTabs = localStorage.getItem('showTabs')
        if (storedShowTabs !== null) {
            this.showTabs = JSON.parse(storedShowTabs)
        }
    }

    toggleTabs() {
        this.showTabs = !this.showTabs
        localStorage.setItem('showTabs', JSON.stringify(this.showTabs))
    }

    setShowTabs(show: boolean) {
        this.showTabs = show
        localStorage.setItem('showTabs', JSON.stringify(show))
    }

    setMenuList(menuList: MenuItem[]) {
        this.menuList = menuList
        if (this.selectedKeys.length === 0) {
            this.ensureSelectedKeys()
        }
    }

    ensureSelectedKeys() {
        console.log(this.selectedKeys)
        if(this.selectedKeys.length > 0) {
            const currentMenu = this.findMenuByPath(this.selectedKeys[0])
            console.log(currentMenu)
            if (currentMenu?.label) {
                this.addTag({
                    path: this.selectedKeys[0],
                    title: currentMenu.label
                })
            }
        }else if (this.selectedKeys.length === 0 && this.menuList.length > 0) {
            const firstPath = this.findFirstAvailablePath(this.menuList)
            if (firstPath) {
                this.setSelectedKeys([firstPath])
                const firstMenu = this.findMenuByPath(firstPath)
                if (firstMenu?.label) {
                    this.addTag({
                        path: firstPath,
                        title: firstMenu.label
                    })
                }
            }
        }
    }

    private findFirstAvailablePath(items: MenuItem[]): string | null {
        for (const item of items) {
            if (item.path && !item.hidden) {
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

    setSelectedKeys(selectedKeys: string[]) {
        this.selectedKeys = selectedKeys
        const currentMenu = this.findMenuByPath(selectedKeys[0])
        if (currentMenu?.label) {
            this.addTag({
                path: selectedKeys[0],
                title: currentMenu.label
            })
            this.setOpenKeys(selectedKeys[0])
        }
    }

    setOpenKeys(path: string) {
        const parentKeys = this.findParentKeys(path)
        this.openKeys = parentKeys
    }

    private findParentKeys(path: string): string[] {
        const keys: string[] = []
        const find = (items: MenuItem[], parent?: MenuItem) => {
            for (const item of items) {
                if (item.path === path && parent?.key) {
                    keys.push(parent.key)
                }
                if (item.children) {
                    find(item.children, item)
                    if (keys.length > 0 && parent?.key) {
                        keys.push(parent.key)
                    }
                }
            }
        }
        find(this.menuList)
        return [...new Set(keys)]
    }

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

    filterMenuByRoles(roles: string[]): MenuItem[] {
        const filter = (items: MenuItem[]): MenuItem[] => {
            return items.filter(item => {
                if (!item.roles || item.roles.length === 0) {
                    return true
                }
                const hasPermission = item.roles.some(role => roles.includes(role))
                
                if (hasPermission && item.children) {
                    item.children = filter(item.children)
                }
                
                return hasPermission
            })
        }
        return filter(this.menuList)
    }

    resetMenuState() {
        this.selectedKeys = []
        this.visitedTags = []
        this.openKeys = []
        this.ensureSelectedKeys()
    }

    routesToMenuItems(routes: CoRouteObject[]): MenuItem[] {
        const menuItems = routes
            .filter(route => !route.hidden)
            .map(route => ({
                key: route.path || '',
                label: route.meta?.title || '',
                icon: route.meta?.icon,
                path: route.path,
                roles: route.meta?.roles,
                children: route.children ? this.routesToMenuItems(route.children) : undefined
            }))
            .filter(item => item.label)
        
        // this.setMenuList(menuItems)
        // console.log(menuItems)  
        return menuItems
    }

    addTag(tag: TagItem) {
        if (!this.visitedTags.find(t => t.path === tag.path)) {
            this.visitedTags.push(tag)
        }
        // console.log(this.visitedTags)
    }

    removeTag(path: string) {
        const index = this.visitedTags.findIndex(tag => tag.path === path)
        if (index > -1) {
            this.visitedTags.splice(index, 1)
            if (path === this.selectedKeys[0] && this.visitedTags.length > 0) {
                const lastTag = this.visitedTags[this.visitedTags.length - 1]
                this.setSelectedKeys([lastTag.path])
            }
            if (this.visitedTags.length === 0) {
                this.ensureSelectedKeys()
            }
        }
    }
    setFinalRoutes(routes: CoRouteObject[]) {
        this.finalRoutes = routes
    }
    initRoutesAndMenu() {
        const rootRoute = this.finalRoutes.find(route => route.root)
        if (rootRoute?.children) {
            const menu =    this.routesToMenuItems(rootRoute.children)
            this.setMenuList(menu)
        }
    }
}

export default new MenuStore()
