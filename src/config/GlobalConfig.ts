const GlobalConfig = {
    PermissionControl:'backend',//fontend backend both
    AdminName:'CoffeeAdmin',
    ApiUrl:'/'
}

const getGlobalConfig = (key: keyof typeof GlobalConfig) => {
    return GlobalConfig[key]
}
export default getGlobalConfig