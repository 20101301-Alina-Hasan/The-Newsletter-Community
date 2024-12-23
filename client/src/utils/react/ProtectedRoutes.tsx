import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../../contexts/userContext";

export const ProtectedRoutes = () => {
    const { userState } = useUserContext();
    const token = userState.token || localStorage.getItem('access_token');

    return token ? <Outlet /> : <Navigate to='/signup' />
}
