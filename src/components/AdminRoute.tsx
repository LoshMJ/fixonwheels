import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const isAdmin = localStorage.getItem("isAdmin");

  if (isAdmin !== "true") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}