import { Avatar, Dropdown, Badge } from 'antd'
import { observer } from 'mobx-react-lite'
import { UserOutlined } from '@ant-design/icons'
import useUserActions from './BaseUserActions'
import React from 'react'

interface VerticalUserActionsProps {
  collapsed?: boolean
}

const VerticalUserActions = observer(({ collapsed = false }: VerticalUserActionsProps) => {
  const { actionItems, userMenuItems, languageItems, handleUserMenuClick, userInfo } = useUserActions()

  const ActionButton = ({ icon, label, badge, onClick }: {
    icon: React.ReactNode
    label: string
    badge?: number
    onClick?: () => void
  }) => (
    <button 
      className={`
        flex items-center h-9 rounded-lg transition-all duration-200
        hover:bg-black/5 dark:hover:bg-white/5 w-full
        ${collapsed ? 'justify-center px-2' : 'px-3 gap-3'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-5">
        {badge ? (
          <Badge count={badge} size="small">
            {icon}
          </Badge>
        ) : icon}
      </div>
      {!collapsed && (
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      )}
    </button>
  )

  return (
    <div className="flex flex-col">
      {/* Action Buttons */}
      <div className={`
        flex flex-col items-center
        ${collapsed ? 'px-2' : 'px-2'}
        gap-0.5
      `}>
        {actionItems.map(item => (
          item.key === 'language' ? (
            <Dropdown 
              key={item.key} 
              menu={{ items: languageItems }} 
              trigger={['click']} 
              placement="topRight"
              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            >
              <div className="w-full">
                <ActionButton 
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                />
              </div>
            </Dropdown>
          ) : (
            <ActionButton
              key={item.key}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              onClick={item.onClick}
            />
          )
        ))}
      </div>

      {/* User Profile */}
      <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          trigger={['click']}
          placement="topRight"
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        >
          <div className={`
            flex items-center h-9 cursor-pointer transition-colors
            hover:bg-black/5 dark:hover:bg-white/5
            ${collapsed 
              ? 'justify-center px-2' 
              : 'gap-3 mx-2 px-2 rounded-lg'
            }
          `}>
            <Avatar 
              size={24}
              src={userInfo.avatar}
              icon={<UserOutlined />}
              className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500"
            />
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
        </Dropdown>
      </div>
    </div>
  )
})

export default VerticalUserActions 