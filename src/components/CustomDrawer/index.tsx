import React, { useEffect } from 'react'
import { useStore } from '@/store'
import { CloseOutlined } from '@ant-design/icons'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import './styles.scss'

interface CustomDrawerProps {
  title?: React.ReactNode
  children?: React.ReactNode
  open: boolean
  onClose: () => void
  width?: number | string
  placement?: 'left' | 'right'
  showClose?: boolean
  showMask?: boolean
  maskClosable?: boolean
  className?: string
  style?: React.CSSProperties
  maskStyle?: React.CSSProperties
  bodyStyle?: React.CSSProperties
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  title,
  children,
  open,
  onClose,
  width = 280,
  placement = 'right',
  showClose = true,
  showMask = true,
  maskClosable = true,
  className = '',
  style,
  maskStyle,
  bodyStyle,
}) => {
  const { ConfigStore } = useStore()
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
        {showMask && (
          <div 
            className={`
              absolute inset-0 backdrop:blur-md
              ${isDark ? 'bg-black/60' : 'bg-black/40'}
              transition-opacity duration-300
            `}
            style={maskStyle}
            onClick={maskClosable ? onClose : undefined}
          />
        )}

        {/* 抽屉容器 */}
        <div 
          className={`
            fixed top-0 h-full
            ${placement === 'left' ? 'left-0' : 'right-0'}
            ${className}
          `}
          style={{
            width,
            height: `calc(100vh - var(--header-margin-height))`,
            ...style
          }}
        >
          <div className="theme-style h-full" style={bodyStyle}>
            {/* 头部 */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-4 h-14">
                {title && (
                  <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {title}
                  </h3>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors
                      hover:bg-black/5 dark:hover:bg-white/10
                      text-gray-500 dark:text-gray-400"
                  >
                    <CloseOutlined className="text-lg" />
                  </button>
                )}
              </div>
            )}

            {/* 内容区域 */}
            <div 
              className={`
                overflow-y-auto
                ${(title || showClose) ? 'h-[calc(100%-3.5rem)]' : 'h-full'}
              `}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.body
  )
}

export default CustomDrawer 