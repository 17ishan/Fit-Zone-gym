import { api } from "@/lib/apiClient";
import type { AuthResponse, UserResponse } from "@/lib/types";

interface MessageResponse {
  message: string;
}

export const authService = {
  adminGoogleLogin: (idToken: string) =>
    api.post<AuthResponse>("/api/auth/admin/google", { idToken }),
  adminLogin: (email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/admin/login", { identifier: email, password }),
  forgotPassword: (email: string) =>
    api.post<MessageResponse>("/api/auth/admin/forgot-password", { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post<MessageResponse>("/api/auth/reset-password", { token, newPassword }),
  me: () => api.get<UserResponse>("/api/auth/me"),
};
