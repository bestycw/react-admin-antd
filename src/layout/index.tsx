import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'

const { Content } = AntLayout

const Layout = observer(() => {
  return (
    <AntLayout className="min-h-screen">
      <Header />
      <Content className="p-6">
        <Outlet />
      </Content>
    </AntLayout>
  )
})

export default Layout