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
    const { MenuStore, ConfigStore } = useStore();
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
        <div className="w-full">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                mode={props.mode || 'inline'}
                items={MenuStore.menuList}
                theme={ConfigStore.isDarkMode ? 'dark' : 'light'}
                className={`
                    menu-component
                    ${props.mode === 'horizontal' ? 'border-0' : ''}
                    !justify-start
                `}
                {...props}
            />
        </div>
    );
});

export default Menu;