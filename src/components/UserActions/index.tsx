import { observer } from 'mobx-react-lite'
import HorizontalUserActions from './HorizontalUserActions'
import VerticalUserActions from './VerticalUserActions'
// import React from 'react';

interface UserActionsProps {
  mode?: 'horizontal' | 'vertical';
  collapsed?: boolean;
}

const UserActions = observer(({ mode = 'horizontal', collapsed = false }: UserActionsProps) => {
  return mode === 'horizontal' ? (
    <HorizontalUserActions />
  ) : (
    <VerticalUserActions collapsed={collapsed} />
  )
})

export default UserActions
