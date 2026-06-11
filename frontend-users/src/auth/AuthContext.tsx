import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api, getToken, setToken } from "@/lib/apiClient";
import type { AuthResponse, UserResponse } from "@/lib/types";

interface AuthState {
  user: UserResponse | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<UserResponse>("/api/auth/me")
      .then(setUser)
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const res = await api.post<AuthResponse>("/api/auth/google", { idToken });
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await api.post<AuthResponse>("/api/auth/login", { identifier, password });
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const res = await api.post<{ message: string }>("/api/auth/forgot-password", { email });
    return res.message;
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    const res = await api.post<{ message: string }>("/api/auth/reset-password", { token, newPassword });
    return res.message;
  }, []);

  const refreshUser = useCallback(async () => {
    const fresh = await api.get<UserResponse>("/api/auth/me");
    setUser(fresh);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, login, register, forgotPassword, resetPassword, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
