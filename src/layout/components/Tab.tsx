import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

const Tab = observer(() => {
  const { MenuStore } = useStore()
  const navigate = useNavigate()

  // 处理标签页切换
  const onChange = (key: string) => {
    navigate(key)
  }

  // 处理标签页关闭
  const onEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      MenuStore.removeTag(targetKey)
    }
  }

  // 将访问的标签转换为 Tabs 需要的格式
  const items = MenuStore.visitedTags.map(tag => ({
    key: tag.path,
    label: tag.title,
    closable: MenuStore.visitedTags.length > 1
  }))

  return (
    <div className="py-1 border-b border-black/[0.1] dark:border-white/[0.1]">
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