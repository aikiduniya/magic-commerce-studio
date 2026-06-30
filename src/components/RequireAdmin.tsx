import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { currentAdmin } = useAdminAuth();
  const location = useLocation();
  if (!currentAdmin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
