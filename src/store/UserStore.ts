/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable } from "mobx"

class User{
    constructor(){
        makeAutoObservable(this, {}, {autoBind: true})
    }
    userInfo:{
        name?:string,
        roles?:string[],
        routePath?:string[],
        // rolesValue?:number
    } = {} 
    setUserInfo(user: any){
        this.userInfo = user
    }
}
const userStore = new User()
export default userStore