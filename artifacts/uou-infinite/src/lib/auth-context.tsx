import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@workspace/api-client-react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { getAuthToken, clearAuthToken, getGodModeUser, clearGodModeUser } from "./auth";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const token = getAuthToken();
  const [godUser, setGodUser] = useState<User | null>(() => {
    const g = getGodModeUser();
    return g ? (g as unknown as User) : null;
  });

  const isPublicRoute =
    location.startsWith("/verify/") ||
    location === "/" ||
    location === "/login" ||
    location === "/register" ||
    location === "/onboarding";

  const { data: apiUser, isLoading } = useGetMe({
    query: {
      enabled: !!token && !godUser,
      retry: false,
      queryKey: getGetMeQueryKey(),
    },
  });

  const user = godUser ?? (apiUser || null);
  const loading = godUser ? false : isLoading;

  useEffect(() => {
    const g = getGodModeUser();
    if (g) setGodUser(g as unknown as User);
  }, [location]);

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      setLocation("/login");
    }
  }, [user, loading, location, setLocation, isPublicRoute]);

  const logout = () => {
    clearAuthToken();
    clearGodModeUser();
    setGodUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user: user || null, token, isLoading: loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
