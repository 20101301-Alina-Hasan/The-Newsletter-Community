import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoutes = () => {
    const token = Cookies.get("access_token");
    return token ? <Outlet /> : <Navigate to='/auth' />
}

export default ProtectedRoutes;