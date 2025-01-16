import { Avatar, Dropdown, Badge, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import useUserActions from './BaseUserActions'
import React, { useRef } from 'react'
import { useStore } from '../../store'
import { useLocale } from '@/hooks/useLocale'

interface VerticalUserActionsProps {
  collapsed?: boolean
}

const VerticalUserActions = observer(({ collapsed = false }: VerticalUserActionsProps) => {
  const { actionItems, userMenuItems, languageItems, handleUserMenuClick, userInfo } = useUserActions()
  const containerRef = useRef<HTMLDivElement>(null)
  const { ConfigStore } = useStore()
  const isActionsCollapsed = ConfigStore.isActionsCollapsed
  const { currentLang, changeLang, t } = useLocale()

  // 处理语言切换
  const handleLanguageChange = ({ key }: { key: string }) => {
    changeLang(key)
  }

  const ActionButton = ({ icon, label, badge, onClick, component }: {
    icon?: React.ReactNode
    label: string
    badge?: number
    onClick?: () => void
    component?: React.ReactNode
  }) => {
    const button = (
      <button 
        className={`
          flex items-center h-9 rounded-lg transition-all duration-200
          hover:bg-black/5 dark:hover:bg-white/5 w-full
          ${collapsed 
            ? 'justify-center px-0'
            : 'px-3 gap-3'
          }
        `}
        onClick={onClick}
      >
        <div className={`
          flex items-center justify-center
          ${collapsed ? 'w-16' : 'w-5'}
        `}>
          {component || (badge ? (
            <Badge count={badge} size="small">
              {icon}
            </Badge>
          ) : icon)}
        </div>
        {!collapsed && (
          <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        )}
      </button>
    )

    return collapsed ? (
      <Tooltip title={label} placement="right">
        {button}
      </Tooltip>
    ) : button
  }

  const UserButton = (
    <div className={`
      flex items-center h-9 cursor-pointer transition-colors
      hover:bg-black/5 dark:hover:bg-white/5
      ${collapsed 
        ? 'justify-center px-0'
        : 'gap-3 mx-2 px-2 rounded-lg'
      }
    `}>
      <div className={`
        flex items-center justify-center
        auto
      `}>
        <Avatar 
          size={24}
          src={userInfo.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500"
        />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {userInfo.username}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {userInfo.email}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div 
      ref={containerRef}
      className={`
        flex flex-col
        transition-[width] duration-200
      `}
    >
      {/* Collapse Toggle Button */}
      <Tooltip title={isActionsCollapsed ? t('common.actions.expand') : t('common.actions.collapse')}>
        <button
          onClick={() => ConfigStore.toggleActionsCollapsed(!ConfigStore.isActionsCollapsed)}
          className="flex items-center justify-center h-8 hover:bg-black/5 dark:hover:bg-white/5 w-full"
        >
          <span className={`
            transition-transform duration-300
            ${isActionsCollapsed ? 'rotate-0' : 'rotate-180'}
          `}>
            <DownOutlined />
          </span>
        </button>
      </Tooltip>

      {/* Action Buttons */}
      <div className={`
        flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out w-full
        ${isActionsCollapsed 
          ? 'max-h-0 opacity-0 pointer-events-none' 
          : 'max-h-[500px] opacity-100'
        }
        ${collapsed ? 'px-2' : 'px-2'}
        gap-0.5
      `}>
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
              placement={collapsed ? 'topRight' : 'bottom'}
              arrow={{ pointAtCenter: true }}
            >
              <div className="w-full">
                {collapsed ? (
                  <Tooltip title={t('common.languageSwitch')} placement="right">
                    <button 
                      className="flex items-center h-9 rounded-lg transition-all duration-200
                        hover:bg-black/5 dark:hover:bg-white/5 w-full justify-center px-2"
                    >
                      <div className="flex items-center justify-center w-5">
                        {item.icon}
                      </div>
                    </button>
                  </Tooltip>
                ) : (
                  <button 
                    className="flex items-center h-9 rounded-lg transition-all duration-200
                      hover:bg-black/5 dark:hover:bg-white/5 w-full px-3 gap-3"
                  >
                    <div className="flex items-center justify-center w-5">
                      {item.icon}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t('common.languageSwitch')}
                    </span>
                  </button>
                )}
              </div>
            </Dropdown>
          ) : (
            <ActionButton
              key={item.key}
              icon={item.icon}
              label={t(`common.${item.key}`)}
              badge={item.badge}
              onClick={item.onClick}
            />
          )
        ))}
      </div>

      {/* User Profile */}
      <div className="mt-1 pt-2 border-t border-black/[0.06] dark:border-white/[0.06] w-full">
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          trigger={['click']}
          placement="topRight"
          overlayStyle={{ minWidth: '160px' }}
        >
          {collapsed ? (
            <Tooltip title={userInfo.username} placement="right">
              {UserButton}
            </Tooltip>
          ) : UserButton}
        </Dropdown>
      </div>
    </div>
  )
})

export default VerticalUserActions 