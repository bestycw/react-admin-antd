import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { CSSProperties, ReactNode } from 'react'

interface ContentProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const { Content: AntContent } = Layout

const Content = observer(({ className, style, children }: ContentProps) => {
  return (
    <AntContent className={`flex flex-1 ${className || ''}` }>
      <div 
        className="mx-auto w-full max-w-screen-2xl" 
       
      >
        <div className="theme-style h-full overflow-auto"  style={style}>
          {children}
        </div>
      </div>
    </AntContent>
  )
})

export default Content 