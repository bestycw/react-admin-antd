import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import { useStore } from '@/store'
import Header from './components/Header'

const { Content } = AntLayout

const Layout = observer(() => {
  const { ConfigStore } = useStore()

  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="mx-2 w-full max-w-screen-2xl px-3">
        <Content className={`${ConfigStore.themeStyle === 'mac' ? 'mac-content' : 'sharp-content'} mt-3`}>
          <div className={`${ConfigStore.themeStyle === 'mac' ? 'mac-glass' : 'sharp-glass'} min-h-[calc(100vh-88px)]`}>
            <Outlet />
          </div>
        </Content>
      </div>
    </AntLayout>
  )
})

export default Layout