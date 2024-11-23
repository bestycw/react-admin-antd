import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'

interface PermissionProps {
    code: string | string[]  // 权限码，支持单个或多个
    mode?: 'some' | 'every'  // 权限匹配模式：满足一个或满足所有
    children: React.ReactNode
    fallback?: React.ReactNode  // 无权限时的替代内容
}

const Permission: React.FC<PermissionProps> = observer(({
    code,
    mode = 'some',
    children,
    fallback = null
}) => {
    const { UserStore } = useStore()
    const codes = Array.isArray(code) ? code : [code]
    
    // 检查权限
    const hasPermission = mode === 'some'
        ? codes.some(c => UserStore.hasPermission(c))
        : codes.every(c => UserStore.hasPermission(c))

    return hasPermission ? <>{children}</> : <>{fallback}</>
})

export default Permission 