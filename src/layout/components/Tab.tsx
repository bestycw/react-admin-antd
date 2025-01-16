// import React from 'react'
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
import { useTranslation } from 'react-i18next'
const Tab = observer(() => {
  const { MenuStore, ConfigStore } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  // 如果 showTabs 为 false 或没有访问标签，不渲染任何内容
  if (!ConfigStore.showTabs || MenuStore.visitedTags.length === 0) {
    return null
  }

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
    if (MenuStore.visitedTags.length <= 1) return;
    
    const currentIndex = MenuStore.visitedTags.findIndex(tag => tag.path === targetPath);
    
    // 如果关闭的是当前激活的标签页，需要先跳转到其他标签
    if (targetPath === location.pathname) {
      // 优先选择右侧标签，如果没有则选择左侧标签
      const nextTag = MenuStore.visitedTags[currentIndex + 1] || MenuStore.visitedTags[currentIndex - 1];
      if (nextTag) {
        navigate(nextTag.path);
      }
    }

    // 等待导航完成后再移除标签
    setTimeout(() => {
      MenuStore.removeTag(targetPath);
    }, 0);
  };

  // 关闭右侧标签页
  const closeRight = (currentPath: string) => {
    const currentIndex = MenuStore.visitedTags.findIndex(tag => tag.path === currentPath)
    if (currentIndex === MenuStore.visitedTags.length - 1) return;
    
    const rightTags = MenuStore.visitedTags.slice(currentIndex + 1)
    rightTags.forEach(tag => {
      MenuStore.removeTag(tag.path)
    })
    // 如果当前激活的标签在被关闭的标签中，跳转到currentPath
    if (rightTags.find(tag => tag.path === location.pathname)) {
      navigate(currentPath)
    }
  }

  // 关闭其他标签页
  const closeOthers = (currentPath: string) => {
    if (MenuStore.visitedTags.length <= 1) return;
    MenuStore.resetTags();
    const menuItem = MenuStore.findMenuByPath(currentPath);
    MenuStore.addTag({
      path: currentPath,
      title: menuItem?.label || ''
    })
    // MenuStore.visitedTags.forEach(tag => {
    //   if (tag.path !== currentPath) {
    //     MenuStore.removeTag(tag.path)
    //   }
    // })
    // 跳转到保留的标签页
    navigate(currentPath)
  }

  // 关闭所有标签页
  const closeAll = () => {
    if (MenuStore.visitedTags.length <= 1) return;
    
    const firstTag = MenuStore.visitedTags[0];
    const currentTags = [...MenuStore.visitedTags];
    
    // 先清除除第一个标签外的所有标签
    currentTags.slice(1).forEach(tag => {
      MenuStore.removeTag(tag.path);
    });

    // 如果当前不在第一个标签页，跳转到第一个标签页
    if (location.pathname !== firstTag.path) {
      navigate(firstTag.path);
    }
  };

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
  const getDropdownItems = (path: string): MenuProps['items'] => {
    const isLast = path === MenuStore.visitedTags[MenuStore.visitedTags.length - 1].path;
    const isOnly = MenuStore.visitedTags.length <= 1;

    return [
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
        disabled: isOnly,
        onClick: () => closeTag(path)
      },
      {
        key: '2',
        label: '关闭右侧标签',
        icon: <VerticalRightOutlined />,
        disabled: isLast || isOnly,
        onClick: () => closeRight(path)
      },
      {
        key: '3',
        label: '关闭其他标签',
        icon: <CloseCircleOutlined />,
        disabled: isOnly,
        onClick: () => closeOthers(path)
      },
      {
        key: '4',
        label: '关闭所有标签',
        icon: <CloseSquareOutlined />,
        disabled: isOnly,
        onClick: closeAll
      }
    ]
  }

  // 将访问的标签转换为 Tabs 需要的格式
  const items = MenuStore.visitedTags.map(tag => ({
    key: tag.path,
    label: (
      <Dropdown
        menu={{ items: getDropdownItems(tag.path) }}
        trigger={['contextMenu']}
      >
        <span className="px-1">{t(`${tag.title}`)}</span>
      </Dropdown>
    ),
    closable: MenuStore.visitedTags.length > 1
  }))

  return (
    <div className="py-2 border-b border-black/[0.1] dark:border-white/[0.1] theme-style mb-1">
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={location.pathname}
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