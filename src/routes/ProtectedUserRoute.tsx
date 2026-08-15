import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Checks if user is logged in or not
function ProtectedUserRoute({ children }: { children: ReactNode }) {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!accessToken) {
    return <Navigate to="/user-login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedUserRoute;
