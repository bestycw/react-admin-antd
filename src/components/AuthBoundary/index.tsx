import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { Navigate } from "react-router-dom";
// import { originHomePageRouteList } from "../../router";

const AuthBoundary: React.FC<React.PropsWithChildren> = observer((props) => {
    const { children } = props;
    const { UserStore} = useStore();
    const { userInfo:{name} } = UserStore;
    // const {filterMenuListByRole} = AuthStore;
    // const {name,rolesValue=0} = getUserInfo();
    if(!name){
        //跳转回登录页
        return <Navigate to="/login" replace={true} />
    }
    // console.log(123123222)
    // filterMenuListByRole(originHomePageRouteList,rolesValue)
    //判断用户信息
    //更新menu
    return (
    <>
        {children}
    </>
    )
})

export default AuthBoundary