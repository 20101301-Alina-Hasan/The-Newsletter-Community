import { UserContext, UserContextType } from "../../interfaces/userInterfaces";
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
// import Cookies from "js-cookie";



export const ProtectedRoutes = () => {
    const { userState } = useContext(UserContext) as UserContextType;
    // const token = Cookies.get("access_token");

    return userState.token ? <Outlet /> : <Navigate to='/signup' />
}
