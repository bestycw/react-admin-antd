import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import Tab from './components/Tab'
import  { Suspense } from 'react'
import SettingDrawer from '@/components/SettingDrawer'
import PageTransition from '@/components/PageTransition'
// import { Spin } from 'antd'
import GlobalSearch from '../components/GlobalSearch'
import Loading from '@/components/Loading'

const Layout = observer(() => {
  console.log('layout init')
  // const { MenuStore } = useStore()

  return (
    <AntLayout className="min-h-screen bg-gradient bg-gradient-animated" style={{ background:'var(--layout-bg)'}}>
      <Sidebar />     
      <AntLayout className="h-screen bg-transparent">
        <Header style={{ marginBottom: 0 }} />        
        <Tab />
        <Content>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loading></Loading>
            </div>
          }>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </Suspense>
        </Content>
      </AntLayout>
      <SettingDrawer />
      <GlobalSearch />
    </AntLayout>
  )
})

export default Layout