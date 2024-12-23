import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../../contexts/userContext";

export const ProtectedRoutes = () => {
    const { userState } = useUserContext();
    return userState.token ? <Outlet /> : <Navigate to='/signup' />
}
