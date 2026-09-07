"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService, AuthUser } from "@/services/authService";
import { api } from "@/services/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuthToken = useCallback((t: string | null) => {
    if (t) {
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      localStorage.setItem("nexushub_token", t);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("nexushub_token");
    }
    setToken(t);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("nexushub_token");
    if (storedToken) {
      setAuthToken(storedToken);
      authService
        .getMe()
        .then((u) => setUser(u))
        .catch(() => setAuthToken(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [setAuthToken]);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    setAuthToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: { name: string; email: string; password: string; phone?: string }) => {
    const data = await authService.register(formData);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin: user?.role === "ADMIN", login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      token: null,
      isLoading: false,
      isAdmin: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
    };
  }
  return ctx;
};
