import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloseOutlined } from '@ant-design/icons'
import { CSSTransition } from 'react-transition-group'

interface CustomDrawerProps {
  title?: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const CustomDrawer = ({ title, open, onClose, children }: CustomDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

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
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* 背景遮罩 */}
      <CSSTransition
        in={open}
        timeout={300}
        classNames="drawer-overlay"
        nodeRef={overlayRef}
        unmountOnExit
      >
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      </CSSTransition>

      {/* 抽屉内容 */}
      <CSSTransition
        in={open}
        timeout={300}
        classNames="drawer"
        nodeRef={drawerRef}
        unmountOnExit
      >
        <div 
          ref={drawerRef}
          className="absolute top-0 right-0 h-full w-[360px] p-4"
        >
          <div className="h-full modern-glass rounded-lg overflow-hidden">
            {/* 抽屉头部 */}
            <div className="px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <CloseOutlined className="text-gray-600 dark:text-gray-400 text-lg" />
              </button>
            </div>

            {/* 抽屉内容 */}
            <div className="px-6 pb-6">
              {children}
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>,
    document.body
  )
}

export default CustomDrawer 