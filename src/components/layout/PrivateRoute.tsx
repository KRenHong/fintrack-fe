import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("access");
  const loc = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <>{children}</>;
}
