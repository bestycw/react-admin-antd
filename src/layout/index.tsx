import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import Tab from './components/Tab'
import React, { Suspense } from 'react'
import SettingDrawer from '@/components/SettingDrawer'
// import PageLoading from '../components/PageLoading'
// import PageTransition from '../components/PageTransition'
// import { AnimatePresence } from 'framer-motion'

const Layout = observer(() => {
  // const { ConfigStore } = useStore()
  // const { layoutMode } = ConfigStore

  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />     
       <AntLayout className="bg-gray-100 dark:bg-gray-900">
        <Header style={{ marginBottom: 0 }} />         <Tab />
        <Content style={{ height: 'calc(100% - var(--header-margin-height))' }}>

          {/* <AnimatePresence mode="wait"> */}
          <Suspense>
            {/* <PageTransition> */}
            <Outlet />
            {/* </PageTransition> */}
          </Suspense>
          {/* </AnimatePresence> */}
        </Content>
      </AntLayout>
      <SettingDrawer />
    </AntLayout>
  )
})

export default Layout