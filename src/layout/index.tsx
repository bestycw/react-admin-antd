import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import Header from './components/Header'
import Content from './components/Content'

const Layout = observer(() => {
  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <Content />
    </AntLayout>
  )
})

export default Layout