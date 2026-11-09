import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Sends visitors without a session to the login page.
// The real protection is on the server (requireAdmin middleware).
export default function RequireAdmin() {
    const { session } = useAuth();
    const location = useLocation();

    if (session === null) {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
