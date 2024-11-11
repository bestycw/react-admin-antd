import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MenuItem } from '../../store/MenuStore';

interface Iprops extends MenuProps {
    type?: string;
}

const Menu = observer((props: Iprops) => {
    const { MenuStore, UserStore } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const roles = UserStore.userRoles;

    // 根据用户角色过滤菜单
    const filteredMenuList = MenuStore.filterMenuByRoles(roles);
    console.log(filteredMenuList);
    // 初始化选中的菜单项
    useEffect(() => {
        const currentPath = location.pathname;
        MenuStore.setSelectedKeys([currentPath]);
        
        // 设置展开的子菜单
        const item = MenuStore.findMenuByPath(currentPath);
        if (item) {
            const parentKeys = getParentKeys(filteredMenuList, currentPath);
            MenuStore.setOpenKeys(parentKeys);
        }
    }, [location.pathname]);

    const onClick: MenuProps['onClick'] = (e) => {
        const path = e.key;
        MenuStore.setSelectedKeys([path]);
        navigate(path);
    };

    // 获取父级菜单的 key
    const getParentKeys = (items: MenuItem[], path: string): string[] => {
        const parentKeys: string[] = [];
        const findParent = (menuItems: MenuItem[], targetPath: string, parents: string[]) => {
            for (const item of menuItems) {
                if (item.path === targetPath) {
                    parentKeys.push(...parents);
                    return true;
                }
                if (item.children) {
                    if (findParent(item.children, targetPath, [...parents, item.key])) {
                        return true;
                    }
                }
            }
            return false;
        };
        findParent(items, path, []);
        return parentKeys;
    };

    return (
        <AntMenu
            onClick={onClick}
            selectedKeys={MenuStore.selectedKeys}
            openKeys={MenuStore.openKeys}
            onOpenChange={(keys) => MenuStore.setOpenKeys(keys)}
            mode="inline"
            items={filteredMenuList}
            {...props}
        />
    );
});

export default Menu;