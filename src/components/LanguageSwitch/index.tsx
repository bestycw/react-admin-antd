import { GlobalOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation()

  const items: MenuProps['items'] = [
    {
      key: 'zh-CN',
      label: t('common.language.zh'),
    },
    {
      key: 'en-US',
      label: t('common.language.en'),
    }
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    i18n.changeLanguage(key)
    localStorage.setItem('language', key)
  }

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        selectedKeys: [i18n.language]
      }}
      trigger={['click']}
    >
      <button className="w-10 h-10 flex items-center justify-center rounded-full
        modern-glass text-gray-600 dark:text-gray-300">
        <GlobalOutlined className="text-xl" />
      </button>
    </Dropdown>
  )
}

export default LanguageSwitch 