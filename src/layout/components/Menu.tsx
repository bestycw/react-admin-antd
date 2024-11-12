import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeContainer } from '@/components/ThemeContainer';

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
        // <ThemeContainer className="menu-container">
            <AntMenu
                onClick={onClick}
                selectedKeys={MenuStore.selectedKeys}
                mode={props.mode || 'inline'}
                items={MenuStore.menuList}
                theme={ConfigStore.isDarkMode ? 'dark' : 'light'}
                className="menu-component !justify-start"
                {...props}
            />
        // </ThemeContainer>
    );
});

export default Menu;