// src/components/auth/PublicOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "../../utils/auth";

export default function PublicOnlyRoute() {
  const session = getSession();

  if (session?.token) {
    const roleHome =
      session.role === "technician"
        ? "/technician"
        : session.role === "admin"
        ? "/admin"
        : "/";
    return <Navigate to={roleHome} replace />;
  }

  return <Outlet />;
}