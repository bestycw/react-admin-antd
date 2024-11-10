import Mock from 'mockjs'

Mock.setup({
    timeout: '300-600'
})

// 模拟用户数据
const users = [
    {
        username: 'admin',
        password: '123456',
        token: 'admin-token',
        roles: ['admin'],
        rolesValue: 0,
        name: '管理员'
    },
    {
        username: 'user',
        password: '123456',
        token: 'user-token',
        roles: ['user'],
        rolesValue: 1,
        name: '普通用户'
    }
]

// Mock登录接口
Mock.mock('/api/auth/login', 'post', (options: { body: string }) => {
    const { username, password } = JSON.parse(options.body)
    
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
        return {
            code: 200,
            message: '登录成功',
            data: {
                accessToken: user.token,
                name: user.name,
                roles: user.roles,
                rolesValue: user.rolesValue
            }
        }
    }
    
    return {
        code: 401,
        message: '用户名或密码错误',
        data: null
    }
}) 