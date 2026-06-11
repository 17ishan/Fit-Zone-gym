import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { getToken, setToken, setUnauthorizedHandler } from "@/lib/apiClient";
import type { UserResponse } from "@/lib/types";

interface AuthState {
  user: UserResponse | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
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

  // Global 401/403 handler from the API client.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  // Restore session on load.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((u) => setUser(u))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const res = await authService.adminGoogleLogin(idToken);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.adminLogin(email, password);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const res = await authService.forgotPassword(email);
    return res.message;
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    const res = await authService.resetPassword(token, newPassword);
    return res.message;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, login, forgotPassword, resetPassword, logout }}
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
