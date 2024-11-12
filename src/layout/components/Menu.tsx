import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface IProps extends MenuProps {
    type?: string;
}

const Menu = observer((props: IProps) => {
    const { MenuStore } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    // 初始化和路由变化时更新选中状态
    useEffect(() => {
        const currentPath = location.pathname;
        MenuStore.setSelectedKeys([currentPath]);
    }, [location.pathname]);

    const onClick: MenuProps['onClick'] = (e) => {
        const path = e.key;
        MenuStore.setSelectedKeys([path]);
        navigate(path);
    };

    return (
        // <div className="w-full overflow-hidden">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                mode={props.mode || 'inline'}
                items={MenuStore.menuList}
                // className="!bg-transparent !border-none"
            />
        // </div>
    );
});

export default Menu;