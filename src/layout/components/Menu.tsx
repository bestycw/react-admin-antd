import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface IProps extends MenuProps {
    type?: string;
    collapsed?: boolean;
}

const Menu = observer(({ collapsed = false, ...props }: IProps) => {
    const { MenuStore, ConfigStore } = useStore();
    const { mode } = props;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        MenuStore.setSelectedKeys([currentPath]);
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
        const { effectiveLayoutMode, positions } = ConfigStore;
        const currentPath = MenuStore.selectedKeys[0];
        const parentKey = getParentKey(currentPath);

        // 如果菜单位置设置为混合模式
        if (positions.menu === 'mix') {
            // 顶部显示一级菜单，并处理选中状态
            if (mode === 'horizontal') {
                return menuItems.map(item => ({
                    key: item.key,
                    label: item.label,
                    icon: item.icon,
                    className: parentKey === item.key ? 'ant-menu-item-selected' : ''
                }));
            }
            // 侧边栏显示当前选中一级菜单的子菜单
            if (mode === 'inline') {
                const currentRoot = menuItems.find(item => {
                    if (item.key === currentPath) return true;
                    return item.children?.some(child => {
                        if (typeof child === 'string') return child === currentPath;
                        return child.key === currentPath;
                    });
                });
                return currentRoot?.children || [currentRoot];
            }
        }

        // 垂直布局（顶部导航）
        if (effectiveLayoutMode === 'vertical') {
            return mode === 'horizontal' ? menuItems : [];
        }

        // 水平布局（侧边导航）
        if (effectiveLayoutMode === 'horizontal') {
            return mode === 'inline' ? menuItems : [];
        }

        // 混合布局 - 非混合菜单模式
        if (effectiveLayoutMode === 'mix') {
            if ((mode === 'horizontal' && positions.menu === 'header') ||
                (mode === 'inline' && positions.menu === 'sidebar')) {
                return menuItems;
            }
            return [];
        }

        return menuItems;
    };

    return (
        <div className="flex-1 overflow-hidden">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                openKeys={MenuStore.openKeys}
                onOpenChange={MenuStore.setOpenKeys}
                mode={mode}
                inlineCollapsed={collapsed}
                className="menu-component !border-none"
                items={getMenuItems()}
            />
        </div>
    );
});

export default Menu;