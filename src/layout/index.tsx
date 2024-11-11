import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'

const { Content } = AntLayout

const Layout = observer(() => {
  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="max-w-screen-2xl mx-2 px-3">
        <Content className="w-full">
          <div className="modern-glass rounded-lg min-h-[calc(100vh-88px)] mt-3">
            <Outlet />
          </div>
        </Content>
      </div>
    </AntLayout>
  )
})

export default Layout