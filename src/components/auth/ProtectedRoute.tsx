// src/components/auth/ProtectedRoute.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession } from "../../utils/auth";
import type { UserRole } from "../../utils/auth";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]; // If undefined → any authenticated user allowed
  redirectTo?: string;       // Default redirect if not authenticated
};

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const session = getSession();
  const location = useLocation();

  /**
   * 1️⃣ If no session OR no token → redirect to login
   */
  if (!session || !session.token) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  /**
   * 2️⃣ If role restriction exists AND user role not allowed
   * Redirect to their proper dashboard
   */
  if (
    allowedRoles &&
    !allowedRoles.includes(session.role)
  ) {
    const roleHomeMap: Record<UserRole, string> = {
      customer: "/",
      technician: "/technician",
      admin: "/admin",
    };

    return (
      <Navigate
        to={roleHomeMap[session.role]}
        replace
      />
    );
  }

  /**
   * 3️⃣ Authorized → Render child route
   */
  return <Outlet />;
}