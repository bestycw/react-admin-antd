import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
// import React from 'react';

interface IProps extends MenuProps {
    type?: string;
    collapsed?: boolean;
}

const Menu = observer(({ collapsed = false, ...props }: IProps) => {
    const { MenuStore, ConfigStore } = useStore();
    const { mode } = props;
    const navigate = useNavigate();
    const location = useLocation();
    // console.log('Menu Init')
    // 只在路径真正改变时更新选中状态
    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath !== MenuStore.selectedKeys[0] && currentPath!=='/') {
            MenuStore.setSelectedKeys([currentPath]);
        }
    }, [location.pathname]);

    // 递归查找当前路径所在的根菜单项
    const findRootMenuItem = (items: any[], path: string): any => {
        for (const item of items) {
            // 如果当前项就是目标路径
            if (item.key === path) {
                return item;
            }
            // 检查一级子菜单
            if (item.children?.length) {
                const found = item.children.find((child: any) => {
                    if (typeof child === 'string') return child === path;
                    // 检查子项是否匹配
                    if (child.key === path) return true;
                    // 递归检查子项的子菜单
                    if (child.children?.length) {
                        return child.children.some((grandChild: any) => {
                            if (typeof grandChild === 'string') return grandChild === path;
                            return grandChild.key === path;
                        });
                    }
                    return false;
                });
                if (found) return item;
            }
        }
        return null;
    };

    // 获取父级菜单的 key
    const getParentKey = (path: string) => {
        const menuItems = MenuStore.menuList || [];
        const parent = menuItems.find(item => 
            item.children?.some(child => {
                if (typeof child === 'string') return child === path;
                if (child.children?.length) {
                    return child.children.some(grandChild => {
                        if (typeof grandChild === 'string') return grandChild === path;
                        return grandChild.key === path;
                    });
                }
                return child.key === path;
            })
        );
        return parent?.key;
    };

    const onClick: MenuProps['onClick'] = (e) => {
        const path = e.key;
        const menuItems = MenuStore.menuList || [];
        
        // 查找点击的菜单项
        const clickedItem = menuItems.find(item => item.key === path);
        
        // 如果有子菜单，选中第一个子菜单项
        if (clickedItem?.children?.length) {
            const firstChild = clickedItem.children[0];
            const firstChildPath = typeof firstChild === 'string' ? firstChild : firstChild.key;
            MenuStore.setSelectedKeys([firstChildPath]);
            navigate(firstChildPath);
        } else {
            MenuStore.setSelectedKeys([path]);
            navigate(path);
        }
    };

    // 获取菜单项
    const getMenuItems = () => {
        const menuItems = MenuStore.menuList || [];
        const currentPath = MenuStore.selectedKeys[0];
        const parentKey = getParentKey(currentPath);

        if (ConfigStore.getComponentPosition('MENU') === 'MIX') {
            if (mode === 'horizontal') {
                return menuItems.map(item => ({
                    key: item.key,
                    label: item.label,
                    icon: item.icon,
                    className: parentKey === item.key ? 'ant-menu-item-selected' : ''
                }));
            }
            if (mode === 'inline') {
                // 找到当前路径所在的根菜单项
                const currentRoot = findRootMenuItem(menuItems, currentPath);
                if (!currentRoot) return []; // 如果没找到，返回空数组

                // 返回根菜单项的所有子菜单
                return currentRoot.children || [currentRoot];
            }
        }

        // 垂直布局（顶部导航）
        if (ConfigStore.getComponentPosition('MENU')  === 'IN_HEADER') {
            return mode === 'horizontal' ? menuItems : [];
        }

        // 水平布局（侧边导航）
        if (ConfigStore.getComponentPosition('MENU')  === 'IN_SIDEBAR') {
            return mode === 'inline' ? menuItems : [];
        }

        return menuItems;
    };
    const MenuOptions = mode === 'inline' && !collapsed ? {
        openKeys: MenuStore.openKeys,
        onOpenChange: (keys: string[]) => MenuStore.setOpenKeys(keys)
    }:{}
    return (
        <div className="h-full">
            <AntMenu
                {...MenuOptions}
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                mode={mode}
                className="menu-component !border-none"
                items={getMenuItems() as ItemType<MenuItemType>[]}
            />
        </div>
    );
});

export default Menu;