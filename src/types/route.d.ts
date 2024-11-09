import { RouteObject } from "react-router-dom";
import {AuthRoles} from '../config/AuthConstant'
type RolesType = keyof typeof AuthRoles

type CoRouteObject = RouteObject & {
    meta?:{ 
        title?:string,
        icon?:string,
        roles?:RolesType[],
        rolesValue?:number
    }
    children?: CoRouteObject[]
}