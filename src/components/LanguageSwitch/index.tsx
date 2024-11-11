import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    i18n.changeLanguage(key);
    localStorage.setItem('language', key);
  };

  const items: MenuProps['items'] = [
    {
      key: 'zh',
      label: '简体中文',
    },
    {
      key: 'en',
      label: 'English',
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        selectedKeys: [i18n.language],
      }}
      placement="bottomRight"
    >
      <GlobalOutlined 
        className="text-slate-300 text-xl cursor-pointer hover:text-blue-400 transition-colors duration-200" 
      />
    </Dropdown>
  );
};

export default LanguageSwitch; 