export const PermissionsCode = {
    // 系统管理
    SYSTEM: {
        // 用户管理
        USER: {
            VIEW: 'system:user:view',
            ADD: 'system:user:add',
            EDIT: 'system:user:edit',
            DELETE: 'system:user:delete',
            IMPORT: 'system:user:import',
            EXPORT: 'system:user:export'
        },
        // 角色管理
        ROLE: {
            VIEW: 'system:role:view',
            ADD: 'system:role:add',
            EDIT: 'system:role:edit',
            DELETE: 'system:role:delete'
        }
    },
    // 其他模块...
} as const

export type PermissionCode = typeof Permissions[keyof typeof Permissions] 