import { UserContext, UserContextType } from "../../interfaces/userInterfaces";
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";

export const ProtectedRoutes = () => {
    const { userState } = useContext(UserContext) as UserContextType;
    return userState.token ? <Outlet /> : <Navigate to='/signup' />
}
