import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'

const { Content: AntContent } = Layout

const Content = observer(() => {
  return (
    <AntContent className="flex-1">
      <div className="mx-auto w-full max-w-screen-2xl h-[calc(100vh-var(--header-height))]">
        <div className="theme-style h-full overflow-auto mt-0" style={{height: `calc(100vh - var(--header-height))`}}>
          <div className="p-6 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </AntContent>
  )
})

export default Content 