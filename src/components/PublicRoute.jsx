import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="auth-page"><p>Checking your session...</p></div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoute;
