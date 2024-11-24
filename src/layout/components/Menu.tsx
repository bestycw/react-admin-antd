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

    // 只在路径真正改变时更新选中状态
    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath !== MenuStore.selectedKeys[0] && currentPath!=='/') {
            MenuStore.setSelectedKeys([currentPath]);
        }
    }, [location.pathname]);

    // 获取父级菜单的 key
    const getParentKey = (path: string) => {
        const menuItems = MenuStore.menuList || [];
        const parent = menuItems.find(item => 
            item.children?.some(child => {
                if (typeof child === 'string') return child === path;
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
                const currentRoot = menuItems.find(item => {
                    if (item.key === currentPath) return true;
                    return item.children?.some(child => {
                        if (typeof child === 'string') return child === currentPath;
                        return child.key === currentPath;
                    });
                });
                return (currentRoot?.children || [currentRoot]).filter(Boolean);
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
    // console.log(mode,collapsed)
    // console.log(MenuStore.selectedKeys)
    return (
        <div className="h-full">
            <AntMenu
                {...MenuOptions}
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                // openKeys={ MenuStore.openKeys}
                // onOpenChange={(keys) => MenuStore.openKeys = keys}
                mode={mode}
                inlineCollapsed={collapsed}
                className="menu-component !border-none"
                items={getMenuItems() as ItemType<MenuItemType>[]}
            />
        </div>
    );
});

export default Menu;