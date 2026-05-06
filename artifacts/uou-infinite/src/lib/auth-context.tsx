import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@workspace/api-client-react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { getAuthToken, clearAuthToken } from "./auth";
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
  const isPublicRoute =
    location.startsWith("/verify/") ||
    location === "/" ||
    location === "/login" ||
    location === "/register";

  const { data: user, isLoading } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
      queryKey: getGetMeQueryKey(),
    },
  });

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      setLocation("/login");
    }
  }, [user, isLoading, location, setLocation, isPublicRoute]);

  const logout = () => {
    clearAuthToken();
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user: user || null, token, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
