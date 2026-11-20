import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-page"><p>Checking admin permissions...</p></div>;
  }

  if (!user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
