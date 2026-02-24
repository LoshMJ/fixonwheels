import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}