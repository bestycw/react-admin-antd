import { GlobalOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useLocale } from '@/hooks/useLocale'

const LanguageSwitch = () => {
  const { currentLang, changeLang, t } = useLocale()

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
    changeLang(key)
  }

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        selectedKeys: [currentLang]
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