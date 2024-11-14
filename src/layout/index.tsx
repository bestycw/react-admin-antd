import { Layout as AntLayout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import Tab from './components/Tab'
import React from 'react'
import SettingDrawer from '@/components/SettingDrawer'

// const { Sider } = AntLayout

const Layout = observer(() => {
  const { ConfigStore } = useStore()
  const { layoutMode } = ConfigStore
  const styles = {
    horizontal: { height: 'calc(100vh  - var(--header-margin-height))' },
    vertical: { height: 'calc(100% - var(--header-margin-height))'},
    mix: { height: 'calc(100vh - var(--header-height) - var(--style-margin))' }

  }
  // const isHorizontal = ConfigStore.layoutMode === 'horizontal'
  console.log(layoutMode)
  return (
    <AntLayout className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {layoutMode !== 'vertical' && <Sidebar />}
      <AntLayout className="bg-gray-100 dark:bg-gray-900">
        {layoutMode !== 'horizontal' ? <Header style={{marginBottom: 0}}/> : null}
        <Content style={styles[layoutMode]}>
          <Tab></Tab>
          <Outlet />
        </Content>
      </AntLayout>
      <SettingDrawer />
    </AntLayout>
  )
})

export default Layout