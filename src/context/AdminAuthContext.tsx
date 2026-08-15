import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { setAdminToken, registerAdminTokenSetter } from "../api/tokenStore";

interface AdminAuthContextType {
  adminAccessToken: string | null;
  setAdminAccessToken: (token: string | null) => void;
  isAdminLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminAccessToken, setAdminAccessToken] = useState<string | null>(
    null,
  );
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  const updateAdminAccessToken = (token: string | null) => {
    setAdminToken(token);
    setAdminAccessToken(token);
  };

  useEffect(() => {
    const refreshAdminToken = async () => {
      try {
        const res = await axiosInstance.post("/admin/admin-refreshToken");
        updateAdminAccessToken(res.data.data.accessToken);
      } catch (err) {
        updateAdminAccessToken(null);
      } finally {
        setIsAdminLoading(false);
      }
    };

    refreshAdminToken();
  }, []);

  useEffect(() => {
    registerAdminTokenSetter(updateAdminAccessToken);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminAccessToken,
        setAdminAccessToken: updateAdminAccessToken,
        isAdminLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}