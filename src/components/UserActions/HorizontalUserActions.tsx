import { Avatar, Dropdown, Badge } from 'antd'
import { observer } from 'mobx-react-lite'
import { UserOutlined } from '@ant-design/icons'
import useUserActions from './BaseUserActions'
import { useLocale } from '@/hooks/useLocale'

const HorizontalUserActions = observer(() => {
  const { actionItems, userMenuItems, languageItems, handleUserMenuClick, userInfo } = useUserActions()
  const { currentLang, changeLang } = useLocale()

  // 处理语言切换
  const handleLanguageChange = ({ key }: { key: string }) => {
    changeLang(key)
  }

  return (
    <div className="flex items-center gap-2">
      {actionItems.map(item => (
        item.key === 'language' ? (
          <Dropdown 
            key={item.key} 
            menu={{ 
              items: languageItems,
              onClick: handleLanguageChange,
              selectedKeys: [currentLang]
            }} 
            trigger={['click']}
          >
            <button className="w-8 h-8 flex items-center justify-center rounded-full
              transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10">
              {item.icon}
            </button>
          </Dropdown>
        ) : (
          <button
            key={item.key}
            onClick={item.onClick}
            className="w-8 h-8 flex items-center justify-center rounded-full
              transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10"
          >
            {item.badge ? (
              <Badge count={item.badge} size="small">
                {item.icon}
              </Badge>
            ) : item.icon}
          </button>
        )
      ))}

      <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full cursor-pointer
          hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <Avatar
            size="small"
            src={userInfo.avatar}
            icon={<UserOutlined />}
            className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            {userInfo.username}
          </span>
        </div>
      </Dropdown>
    </div>
  )
})

export default HorizontalUserActions 