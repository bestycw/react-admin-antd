const GlobalConfig = {
    PermissionControl:'backend',//fontend backend mix
    AdminName:'CoffeeAdmin',
    ApiUrl:'/'
}

const getGlobalConfig = (key: keyof typeof GlobalConfig) => {
    return GlobalConfig[key]
}
export default getGlobalConfig