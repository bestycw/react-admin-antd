import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { CoRouteObject } from "@/types/route";
import { authService } from "../../services/auth";
import { message } from "antd";

const AuthBoundary: React.FC<React.PropsWithChildren> = observer((props) => {
    const { children } = props;
    const { UserStore } = useStore();
    const location = useLocation();

    // 检查用户是否登录和token是否有效
    const isAuthenticated =  authService.isAuthenticated();
    
    if (!isAuthenticated) {
        // 未登录、无用户信息或token无效，跳转到登录页
        // message.error('登录失效，请先登录');
        return <Navigate to="/auth/login" state={{ from: location }} replace={true} />;
    }

    // 查找当前路径对应的路由配置
    const findRouteByPath = (routes: CoRouteObject[], path: string): CoRouteObject | undefined => {
        for (const route of routes) {
            if (route.path === path) return route;
            if (route.children) {
                const found = findRouteByPath(route.children, path);
                if (found) return found;
            }
        }
        return undefined;
    };

    // 获取当前路由配置
    const currentRoute = findRouteByPath(UserStore.allRoutes, location.pathname);

    // 如果找到路由配置且有重定向属性，则进行重定向
    if (currentRoute?.redirect) {
        return <Navigate to={currentRoute.redirect} replace={true} />;
    }

    // ���户已登录且有权限，渲染子组件
    return <>{children}</>;
});

export default AuthBoundary;