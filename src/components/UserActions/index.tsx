import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import HorizontalUserActions from './HorizontalUserActions'
import VerticalUserActions from './VerticalUserActions'

interface UserActionsProps {
  mode?: 'horizontal' | 'vertical'
}

const UserActions = observer(({ mode = 'horizontal' }: UserActionsProps) => {
  const { ConfigStore } = useStore()
  const isHorizontal = mode === 'horizontal'

  // 根据布局模式返回对应的组件
  return isHorizontal ? (
    <HorizontalUserActions />
  ) : (
    <VerticalUserActions />
  )
})

export default UserActions
