import { Avatar, Dropdown, Badge, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { UserOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import useUserActions from './BaseUserActions'
import React, { useState } from 'react'

interface VerticalUserActionsProps {
  collapsed?: boolean
}

const VerticalUserActions = observer(({ collapsed = false }: VerticalUserActionsProps) => {
  const { actionItems, userMenuItems, languageItems, handleUserMenuClick, userInfo } = useUserActions()
  const [isActionsCollapsed, setIsActionsCollapsed] = useState(false)

  const ActionButton = ({ icon, label, badge, onClick }: {
    icon: React.ReactNode
    label: string
    badge?: number
    onClick?: () => void
  }) => {
    const button = (
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
  )

  return (
    <div className="flex flex-col">
      {/* Collapse Toggle Button - 添加箭头旋转动画 */}
      <button
        onClick={() => setIsActionsCollapsed(prev => !prev)}
        className="flex items-center justify-center h-8 hover:bg-black/5 dark:hover:bg-white/5"
      >
        <span className={`
          transition-transform duration-300
          ${isActionsCollapsed ? 'rotate-0' : 'rotate-180'}
        `}>
          <DownOutlined />
        </span>
      </button>

      {/* Action Buttons - 优化过渡动画 */}
      <div className={`
        flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out
        ${isActionsCollapsed 
          ? 'max-h-0 opacity-0' 
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
                style: { minWidth: '120px' }
              }} 
              trigger={['click']} 
              placement="topRight"
              arrow={{ pointAtCenter: true }}
            >
              <div className="w-full">
                {collapsed ? (
                  <Tooltip title={'切换语言'} placement="right">
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
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                  </button>
                )}
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

      {/* User Profile - always visible */}
      <div className="mt-1 pt-2 border-t border-black/[0.02] dark:border-white/[0.02]">
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