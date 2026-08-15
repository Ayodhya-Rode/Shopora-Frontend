import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSellerAuth } from "../context/SellerAuthContext";

//Checks if seller is logged in or not
function ProtectedSellerRoute({ children }: { children: ReactNode }) {
  const { sellerAccessToken, isSellerLoading } = useSellerAuth();

  if (isSellerLoading) {
    return <p>Loading...</p>;
  }

  if (!sellerAccessToken) {
    return <Navigate to="/seller-login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedSellerRoute;