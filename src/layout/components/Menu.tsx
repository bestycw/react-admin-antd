import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import React from 'react';

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
        if (currentPath !== MenuStore.selectedKeys[0]) {
            MenuStore.setSelectedKeys([currentPath]);
        }
    }, [location.pathname]);

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

        // 垂直布局（侧边导航）
        if (mode === 'inline' && ConfigStore.showSidebarMenu) {
            return menuItems;
        }

        // 水平布局（顶部导航）
        if (mode === 'horizontal' && ConfigStore.showHeaderMenu) {
            return menuItems;
        }

        // 混合布局
        if (ConfigStore.currentLayoutMode === 'MIX') {
            if (mode === 'horizontal') {
                // 顶部显示一级菜单
                return menuItems.map(item => ({
                    key: item.key,
                    label: item.label,
                    icon: item.icon
                }));
            }
            if (mode === 'inline') {
                // 侧边栏显示当前选中一级菜单的子菜单
                const currentRoot = menuItems.find(item => 
                    currentPath.startsWith(item.key)
                );
                return currentRoot?.children || [];
            }
        }

        return [];
    };
    // const MenuOptions = {
    //     onClick,
    //     selectedKeys: MenuStore.selectedKeys,
    //     openKeys: mode === 'inline' ? MenuStore.openKeys : [],
    //     onOpenChange: (keys: string[]) => MenuStore.openKeys = keys,
    // }
    return (
        <div className="flex-1 overflow-hidden">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                openKeys={mode === 'inline' ? MenuStore.openKeys : []}
                onOpenChange={(keys) => MenuStore.openKeys = keys}
                mode={mode}
                inlineCollapsed={collapsed}
                className="menu-component !border-none"
                items={getMenuItems()}
            />
        </div>
    );
});

export default Menu;