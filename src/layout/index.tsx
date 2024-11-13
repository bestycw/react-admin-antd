import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'

// const { Sider } = AntLayout

const Layout = observer(() => {
  const { ConfigStore } = useStore()
  const isHorizontal = ConfigStore.layoutMode === 'horizontal'

  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {isHorizontal ? (
        <>
          <Header />
          <Content style={{ height: 'calc(100vh - var(--header-height))',marginTop:0 ,marginBottom:0}}>
            <Outlet />
          </Content>
        </>
      ) : (
        <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">

            <Sidebar />

          {/* </Sider> */}
          <AntLayout className="bg-gray-100 dark:bg-gray-900">
            <Content style={{ height: 'calc(100% - var(--header-margin-height))' ,marginLeft:0}}>
              <Outlet />
            </Content>
          </AntLayout>
        </AntLayout>
      )}
    </AntLayout>
  )
})

export default Layout