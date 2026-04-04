import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ isAuthenticated }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
