import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { setSellerToken, registerSellerTokenSetter } from "../api/tokenStore";

interface SellerAuthContextType {
  sellerAccessToken: string | null;
  setSellerAccessToken: (token: string | null) => void;
  isSellerLoading: boolean;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(
  undefined,
);

export function SellerAuthProvider({ children }: { children: ReactNode }) {
  const [sellerAccessToken, setSellerAccessToken] = useState<string | null>(
    null,
  );
  const [isSellerLoading, setIsSellerLoading] = useState(true);

  // Updates the axios tokenStore synchronously and React state together,
  // so requests fired right after login/refresh always see the latest token.
  const updateSellerAccessToken = (token: string | null) => {
    setSellerToken(token);
    setSellerAccessToken(token);
  };

  useEffect(() => {
    const refreshSellerToken = async () => {
      try {
        const res = await axiosInstance.post("/seller/seller-refreshToken");
        updateSellerAccessToken(res.data.data.accessToken);
      } catch (err) {
        updateSellerAccessToken(null);
      } finally {
        setIsSellerLoading(false);
      }
    };

    refreshSellerToken();
  }, []);

  useEffect(() => {
    registerSellerTokenSetter(updateSellerAccessToken);
  }, []);

  return (
    <SellerAuthContext.Provider
      value={{
        sellerAccessToken,
        setSellerAccessToken: updateSellerAccessToken,
        isSellerLoading,
      }}
    >
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  const context = useContext(SellerAuthContext);
  if (!context) {
    throw new Error("useSellerAuth must be used within SellerAuthProvider");
  }
  return context;
}