"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearTokens, getAccessToken, saveTokens } from "@/lib/auth";
import api from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post("/token/", { username, password });
    saveTokens(response.data.access, response.data.refresh);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
