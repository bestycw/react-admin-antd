import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { CoRouteObject } from "@/types/route";

const AuthBoundary: React.FC<React.PropsWithChildren> = observer((props) => {
    const { children } = props;
    const { UserStore } = useStore();
    const location = useLocation();

    // 检查用户是否登录
    if (!UserStore.isLogin || !UserStore.userInfo) {
        // 未登录或无用户信息，跳转到登录页
        return <Navigate to="/auth/login" replace={true} />
    }

    // // 处理根路径重定向
    // if (location.pathname === '/') {
    //     return <Navigate to="/dashboard" replace={true} />
    // }
    // 查找当前路径对应的路由配置
    const findRouteByPath = (routes: CoRouteObject[], path: string): CoRouteObject | undefined => {
        // console.log('routes', routes,path)
        for (const route of routes) {
            if (route.path === path) {
                return route;
            }
            if (route.children) {
                const found = findRouteByPath(route.children, path);
                if (found) return found;
            }
        }
        return undefined;
    };
    // console.log('MenuStore.routeList', MenuStore.routeList)
    // if (!MenuStore.routeList.includes(location.pathname)) {
    //     return <Navigate to="/404" replace={true} />
    // } else {
    // 获取当前路由配置  //TODO: 这里需要优化，不能每次都遍历所有路由
    const currentRoute = findRouteByPath(UserStore.allRoutes, location.pathname);
    // console.log('currentRoute', UserStore.allRoutes)
    // 如果找到路由配置且有重定向属性，则进行重定向
    if (currentRoute?.redirect) {
        return <Navigate to={currentRoute.redirect} replace={true} />;
    }
    // }



    // 用户已登录且有权限，渲染子组件
    return <>{children}</>;
});

export default AuthBoundary;