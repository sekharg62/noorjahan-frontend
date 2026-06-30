"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AUTH_SESSION_CLEARED_EVENT,
  clearAuthSession,
  customerStorage,
} from "@/lib/auth-storage";
import { tokenStorage } from "@/lib/auth-storage";
import type { Customer } from "@/types";

interface AuthContextValue {
  customer: Customer | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((token: string, nextCustomer: Customer) => {
    tokenStorage.set(token);
    customerStorage.set(nextCustomer);
    setCustomer(nextCustomer);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setCustomer(null);
  }, []);

  useEffect(() => {
    setCustomer(customerStorage.get());
    setLoading(false);

    const handleSessionCleared = () => setCustomer(null);
    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
    return () =>
      window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: Boolean(customer && tokenStorage.get()),
      loading,
      login,
      logout,
    }),
    [customer, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
