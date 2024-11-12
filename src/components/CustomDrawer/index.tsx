import React, { useEffect } from 'react'
import { useStore } from '@/store'
import { CloseOutlined } from '@ant-design/icons'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import './styles.scss'

interface CustomDrawerProps {
  title?: React.ReactNode
  children?: React.ReactNode
  open: boolean
  onClose: () => void
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  title,
  children,
  open,
  onClose,
}) => {
  const { ConfigStore } = useStore()
  const isMac = ConfigStore.themeStyle === 'mac'
  const isDark = ConfigStore.isDarkMode

  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // 处理滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return createPortal(
    <CSSTransition
      in={open}
      timeout={300}
      classNames="drawer"
      unmountOnExit
    >
      <div className="fixed inset-0 z-50">
        {/* 遮罩层 */}
        <div 
          className={`
            absolute inset-0
            ${isMac
              ? isDark
                ? 'bg-black/40 backdrop-blur-sm'
                : 'bg-black/20 backdrop-blur-sm'
              : isDark
                ? 'bg-black/60'
                : 'bg-black/40'
            }
          `}
          onClick={onClose}
        />

        {/* 抽屉内容 */}
        <div 
          className={classNames(
            'fixed top-0 right-0 h-full w-80',
            isMac ? [
              'backdrop-blur-xl',
              isDark
                ? 'bg-[rgba(28,28,32,0.85)]'
                : 'bg-white/80',
            ] : [
              isDark
                ? 'bg-gray-900'
                : 'bg-white'
            ]
          )}
        >
          {/* 头部 */}
          <div className={classNames(
            'flex items-center justify-between px-4 h-14',
            isMac ? [
              isDark
                ? 'border-b border-white/10'
                : 'border-b border-black/5'
            ] : [
              isDark
                ? 'border-b border-gray-800'
                : 'border-b border-gray-200'
            ]
          )}>
            <h3 className={classNames(
              'text-base font-medium',
              isDark ? 'text-gray-200' : 'text-gray-800'
            )}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={classNames(
                'p-1.5 rounded-full transition-colors',
                isMac ? [
                  isDark
                    ? 'hover:bg-white/10'
                    : 'hover:bg-black/5'
                ] : [
                  isDark
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-100'
                ],
                isDark ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.body
  )
}

export default CustomDrawer 