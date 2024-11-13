import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import Tab from './components/Tab'
import React from 'react'

// const { Sider } = AntLayout

const Layout = observer(() => {
  const { ConfigStore } = useStore()
  const { layoutMode } = ConfigStore
  const component = {
    horizontal: <>
      <Header />
      <Content style={{ height: 'calc(100vh - var(--header-height) - var(--style-margin))', marginTop: 0,marginBottom: 0 }}>
        <Tab></Tab>
        <Outlet />
      </Content>
    </>,
    vertical:
      <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <AntLayout className="bg-gray-100 dark:bg-gray-900">
          <Content style={{ height: 'calc(100% - var(--header-margin-height))', marginLeft: 0 }}>
            <Tab></Tab>
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>,
    mix: <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <AntLayout className="bg-gray-100 dark:bg-gray-900">
        <Header style={{ marginLeft: 0 }} />
        <Content style={{ height: 'calc(100vh - var(--header-height) - var(--style-margin))',marginTop: 0, marginLeft: 0 }}>
          <Tab></Tab>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>,
  }
  // const isHorizontal = ConfigStore.layoutMode === 'horizontal'

  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {component[layoutMode]}
    </AntLayout>
  )
})

export default Layout