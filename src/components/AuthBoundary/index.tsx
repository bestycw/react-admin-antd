import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { Navigate,useLocation } from "react-router-dom";
import React from "react";

const AuthBoundary: React.FC<React.PropsWithChildren> = observer((props) => {
    const { children } = props;
    const { UserStore } = useStore();
    const location = useLocation();
    // 检查用户是否登录
    if (!UserStore.isLogin || !UserStore.userInfo) {
        // 未登录或无用户信息，跳转到登录页
        return <Navigate to="/login" replace={true} />
    }
    if(location.pathname === '/'){
        return <Navigate to="/dashboard" replace={true} />
    }
    // TODO: 如果需要根据角色过滤菜单，可以在这里添加
    // if (AuthStore.filterMenuListByRole) {
    //     AuthStore.filterMenuListByRole(originHomePageRouteList, rolesValue);
    // }

    // 用户已登录且有权限，渲染子组件
    return <>{children}</>;
});

export default AuthBoundary;