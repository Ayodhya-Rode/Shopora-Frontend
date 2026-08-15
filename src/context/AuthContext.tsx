import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";
import { setUserToken, registerUserTokenSetter } from "../api/tokenStore";


interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); //context is undefined for 1st time

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axiosInstance.post("/users/user-refreshToken");
        setAccessToken(res.data.data.accessToken);
      } catch (err) {
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    refreshAccessToken();
  }, []);

  // keep tokenStore in sync whenever accessToken changes
  useEffect(() => {
    setUserToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
  registerUserTokenSetter(setAccessToken);
}, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}