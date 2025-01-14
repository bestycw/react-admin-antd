import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useLocation } from 'react-router-dom'

interface PermissionProps {
    permissions?: string | string[]     // 权限码，支持单个或多个
    roles?: string | string[]           // 角色码，支持单个或多个
    mode?: 'some' | 'every'            // 权限匹配模式：满足一个或满足所有
    children: React.ReactNode
    fallback?: React.ReactNode         // 无权限时的替代内容
}

const Permission: React.FC<PermissionProps> = observer(({
    permissions,
    roles,
    mode = 'some',
    children,
    fallback = null
}) => {
    const { UserStore } = useStore()
    const location = useLocation()
    
    // 如果用户是管理员，直接显示
    if (UserStore.hasRole('admin')) {
        return <>{children}</>
    }

    // 检查角色权限
    let hasRole = true
    if (roles) {
        const roleList = Array.isArray(roles) ? roles : [roles]
        hasRole = mode === 'some'
            ? UserStore.hasAnyRole(roleList)
            : UserStore.hasAllRoles(roleList)
    }

    // 检查操作权限
    let hasOperationPermission = true
    if (permissions) {
        const permissionList = Array.isArray(permissions) ? permissions : [permissions]
        hasOperationPermission = mode === 'some'
            ? UserStore.hasAnyPermission(location.pathname, permissionList)
            : permissionList.every(p => UserStore.hasPermission(location.pathname, p))
    }
    console.log('hasRole', hasRole)
    console.log('hasOperationPermission', hasOperationPermission)
    return (hasRole && hasOperationPermission) ? <>{children}</> : <>{fallback}</>
})

export default Permission 