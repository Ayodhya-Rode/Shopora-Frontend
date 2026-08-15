import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

// Checks if admin is logged in or not
function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { adminAccessToken, isAdminLoading } = useAdminAuth();

  if (isAdminLoading) {
    return <p>Loading...</p>;
  }

  if (!adminAccessToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedAdminRoute;