import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import Tab from './components/Tab'
import React, { Suspense } from 'react'
import SettingDrawer from '@/components/SettingDrawer'
import PageTransition from '@/components/PageTransition'
import { Spin } from 'antd'
import { useStore } from '../store'

const Layout = observer(() => {
  const { MenuStore } = useStore()
  MenuStore.initRoutesAndMenu()
  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />     
      <AntLayout className="bg-gray-100 dark:bg-gray-900 h-screen">
        <Header style={{ marginBottom: 0 }} />        
        <Tab />
        <Content>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Spin size="large" />
            </div>
          }>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </Suspense>
        </Content>
      </AntLayout>
      <SettingDrawer />
    </AntLayout>
  )
})

export default Layout