import React, { useEffect } from 'react'
import { useStore } from '@/store'
import { CloseOutlined } from '@ant-design/icons'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
// import { ThemeContainer } from '@/components/ThemeContainer'
// import classNames from 'classnames'
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
            ${isDark ? 'bg-black/60' : 'bg-black/40'}
          `}
          onClick={onClose}
        />

        {/* 抽屉容器 */}
        <div className="fixed top-0 right-0 h-full w-80">
          <div className="theme-style h-full">
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 h-14">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors
                  hover:bg-black/5 dark:hover:bg-white/10
                  text-gray-500 dark:text-gray-400"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
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