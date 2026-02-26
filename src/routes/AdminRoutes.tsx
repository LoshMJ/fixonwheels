import { Navigate, Outlet, useLocation } from "react-router-dom";

function getAuth() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

export default function AdminRoutes() {
  const { token, user } = getAuth();
  const location = useLocation();

  // not logged in -> admin login
  if (!token) return <Navigate to="/admin/login" replace state={{ from: location }} />;

  // logged in but not admin -> home
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}