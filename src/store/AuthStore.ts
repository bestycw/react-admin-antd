import { makeAutoObservable } from "mobx"
import { CoRouteObject } from "../types/route"
// import {AuthRoles} from '../config/AuthConstant'
class Auth {
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }
    menuList: CoRouteObject[] = []
    isLogin: boolean = false
    filterMenuListByRole(routes: CoRouteObject[],userRolesValue:number=0, roles?: string[]) {
        if (!roles || roles.length === 0) this.menuList = routes
        console.log(routes)
        // 根据角色过滤菜单
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i]
            const { rolesValue = 0} = route.meta
            if(rolesValue>=userRolesValue){
                console.log('具备权限')
            }
        }
    }
    setIsLogin(isLogin: boolean) {
        this.isLogin = isLogin
    }
}
const āuthStore = new Auth()
export default āuthStore