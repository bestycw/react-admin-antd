import { makeAutoObservable, runInAction } from "mobx"
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
    // dynamicRoutes: CoRouteObject[] = []
    
    menuList: MenuItem[] = []
    routeList: string[] = []
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
        runInAction(() => {
            this.menuList = menuList
        })

    }

    ensureSelectedKeys() {
        if (this.selectedKeys.length > 0) {
            const currentMenu = this.findMenuByPath(this.selectedKeys[0])
            // console.log(currentMenu)
            if (currentMenu?.label) {
                this.addTag({
                    path: this.selectedKeys[0],
                    title: currentMenu.label
                })
            }
        } else if (this.selectedKeys.length === 0 && this.menuList.length > 0) {
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
        // console.log(selectedKeys)
        runInAction(() => {
            if (this.selectedKeys[0] !== selectedKeys[0] ) {
                this.selectedKeys = selectedKeys;
                const currentMenu = this.findMenuByPath(selectedKeys[0]);
                if (currentMenu?.label) {
                    this.addTag({
                        path: selectedKeys[0],
                        title: currentMenu.label
                    });
                    this.setOpenKeys(selectedKeys[0]);
                }
            }
        });
    }

    setOpenKeys(path: string | string[]) {
        // runInAction(() => {
            const parentKeys = typeof path === 'string' ? this.findParentKeys(path) : path
            this.openKeys = parentKeys
        // })
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

    resetMenuState() {
        this.selectedKeys = []
        this.visitedTags = []
        this.openKeys = []
        this.ensureSelectedKeys()
    }

    routesToMenuItems(routes: CoRouteObject[]): MenuItem[] {
        const menu =  routes
            .filter(route => !route.meta?.hidden)
            .map(route => {
                this.routeList.push(route.path || '')
                return {
                    key: route.path || '',
                    label: route.meta?.title || '',
                    icon: route.meta?.icon,
                    path: route.path,
                    hidden: route.meta?.hiddenInMenu,
                    children: route.children && route.children.length > 0 
                        ? this.routesToMenuItems(route.children) 
                        : undefined
                }
            })
            .filter(item => item.label && !item.hidden);
        return menu
    }

    addTag(tag: TagItem) {
        if (!this.visitedTags.find(t => t.path === tag.path)) {
            this.visitedTags.push(tag)
        }
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
    
    initRoutesAndMenu(rootRoute: CoRouteObject) {
            if (rootRoute?.children) {
                const menu = this.routesToMenuItems(rootRoute.children)
                this.setMenuList(menu)
            }

    }

    // 添加清空所有标签的方法
    resetTags() {
        this.visitedTags = [];
    }
}

export default new MenuStore()
