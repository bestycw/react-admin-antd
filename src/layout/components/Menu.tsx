import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';

interface IProps extends MenuProps {
    type?: string;
}

const Menu = observer((props: IProps) => {
    const { MenuStore } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

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
        <div className="w-full overflow-hidden">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                mode={props.mode || 'inline'}
                items={MenuStore.menuList}
                className="!bg-transparent !border-none"
                // overflowedIndicator={<span className="text-gray-500 dark:text-gray-400">•••</span>}
                // expandIcon={<DownOutlined className="text-xs opacity-60" />}
                // subMenuIcon={<DownOutlined className="text-xs opacity-60" />}
            />
        </div>
    );
});

export default Menu;