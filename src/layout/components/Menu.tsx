import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// import { EllipsisOutlined } from '@ant-design/icons';

interface IProps extends MenuProps {
    type?: string;
    collapsed?: boolean;
}

const Menu = observer(({ collapsed = false, ...props }: IProps) => {
    const { MenuStore } = useStore();
    const {mode}=props
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        MenuStore.setSelectedKeys([currentPath]);
    }, [location.pathname]);

    const onClick: MenuProps['onClick'] = (e) => {
        const path = e.key;
        console.log(e)
        MenuStore.setSelectedKeys([path]);
        navigate(path);
    };

    return (
        <div className="flex-1 overflow-hidden">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                mode={mode}
                inlineCollapsed={collapsed}
                className="menu-component !border-none"
                items={MenuStore.menuList}
                // className="menu-component border-none"
                // overflowedIndicator={<EllipsisOutlined className="text-lg" />}
            />
        </div>
    );
});

export default Menu;