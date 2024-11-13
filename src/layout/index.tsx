import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'

const { Sider } = AntLayout

const Layout = observer(() => {
  const { ConfigStore } = useStore()
  const isHorizontal = ConfigStore.layoutMode === 'horizontal'

  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {isHorizontal ? (
        <>
          <Header />
          <Content />
        </>
      ) : (
        <AntLayout>
          <Sider width={260} className="!bg-transparent">
            {/* <div className="h-full"> */}
              <Sidebar />
            {/* </div> */}
          </Sider>
          <AntLayout>
            {/* <Header /> */}
            <Content />
          </AntLayout>
        </AntLayout>
      )}
    </AntLayout>
  )
})

export default Layout