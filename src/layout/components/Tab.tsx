import React from 'react'
import { Tabs, Dropdown } from 'antd'
import type { TabsProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import {
  CloseOutlined,
  CloseCircleOutlined,
  VerticalRightOutlined,
  CloseSquareOutlined,
  ReloadOutlined
} from '@ant-design/icons'

const Tab = observer(() => {
  const { MenuStore } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  // 处理标签页切换
  const onChange = (key: string) => {
    navigate(key)
  }

  // 处理标签页关闭
  const onEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      closeTag(targetKey)
    }
  }

  // 关闭单个标签页
  const closeTag = (targetPath: string) => {
    // 如果关闭的是当前激活的标签页，需要跳转到前一个标签
    if (targetPath === MenuStore.selectedKeys[0]) {
      const currentIndex = MenuStore.visitedTags.findIndex(tag => tag.path === targetPath)
      const nextTag = MenuStore.visitedTags[currentIndex - 1] || MenuStore.visitedTags[currentIndex + 1]
      if (nextTag) {
        navigate(nextTag.path)
      }
    }
    MenuStore.removeTag(targetPath)
  }

  // 关闭右侧标签页
  const closeRight = (currentPath: string) => {
    const currentIndex = MenuStore.visitedTags.findIndex(tag => tag.path === currentPath)
    const rightTags = MenuStore.visitedTags.slice(currentIndex + 1)
    rightTags.forEach(tag => {
      MenuStore.removeTag(tag.path)
    })
    // 如果当前激活的标签在被关闭的标签中，跳转到currentPath
    if (rightTags.find(tag => tag.path === MenuStore.selectedKeys[0])) {
      navigate(currentPath)
    }
  }

  // 关闭其他标签页
  const closeOthers = (currentPath: string) => {
    MenuStore.visitedTags.forEach(tag => {
      if (tag.path !== currentPath) {
        MenuStore.removeTag(tag.path)
      }
    })
    // 跳转到保留的标签页
    navigate(currentPath)
  }

  // 关闭所有标签页
  const closeAll = () => {
    const firstTag = MenuStore.visitedTags[0]
    MenuStore.visitedTags.forEach(tag => {
      MenuStore.removeTag(tag.path)
    })
    // 保留并跳转到第一个标签
    if (firstTag) {
      MenuStore.addTag(firstTag)
      navigate(firstTag.path)
    }
  }

  // 重新加载当前页面
  const reloadPage = (path: string) => {
    // 如果是当前页面才重新加载
    if (path === location.pathname) {
      // 先跳转到空页面，然后再跳回来，触发重新加载
      navigate('/redirect', { replace: true })
      setTimeout(() => {
        navigate(path, { replace: true })
      }, 10)
    }
  }

  // 右键菜单项
  const getDropdownItems = (path: string): MenuProps['items'] => [
    {
      key: '0',
      label: '重新加载',
      icon: <ReloadOutlined />,
      onClick: () => reloadPage(path)
    },
    { type: 'divider' },
    {
      key: '1',
      label: '关闭当前标签',
      icon: <CloseOutlined />,
      disabled: MenuStore.visitedTags.length <= 1,
      onClick: () => closeTag(path)
    },
    {
      key: '2',
      label: '关闭右侧标签',
      icon: <VerticalRightOutlined />,
      disabled: path === MenuStore.visitedTags[MenuStore.visitedTags.length - 1].path,
      onClick: () => closeRight(path)
    },
    {
      key: '3',
      label: '关闭其他标签',
      icon: <CloseCircleOutlined />,
      disabled: MenuStore.visitedTags.length <= 1,
      onClick: () => closeOthers(path)
    },
    {
      key: '4',
      label: '关闭所有标签',
      icon: <CloseSquareOutlined />,
      disabled: MenuStore.visitedTags.length <= 1,
      onClick: closeAll
    }
  ]

  // 将访问的标签转换为 Tabs 需要的格式
  const items = MenuStore.visitedTags.map(tag => ({
    key: tag.path,
    label: (
      <Dropdown
        menu={{ items: getDropdownItems(tag.path) }}
        trigger={['contextMenu']}
      >
        <span>{tag.title}</span>
      </Dropdown>
    ),
    closable: MenuStore.visitedTags.length > 1
  }))

  return (
    <div className="py-1 border-b border-black/[0.1] dark:border-white/[0.1] theme-style mb-0">
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={MenuStore.selectedKeys[0]}
        onChange={onChange}
        onEdit={onEdit}
        items={items}
        className="user-select-none px-4"
        tabBarStyle={{
          margin: 0,
          background: 'transparent',
          borderBottom: 'none'
        }}
      />
    </div>
  )
})

export default Tab 