import { api } from "@/lib/apiClient";
import type { PageResponse, UserResponse } from "@/lib/types";

export const usersService = {
  list: (page = 0, q = "") =>
    api.get<PageResponse<UserResponse>>(
      `/api/admin/users?page=${page}&size=20${q ? `&q=${encodeURIComponent(q)}` : ""}`
    ),
  update: (id: string, body: Partial<Pick<UserResponse, "name" | "phone" | "address" | "age">>) =>
    api.patch<UserResponse>(`/api/admin/users/${id}`, body),
  remove: (id: string) => api.del<void>(`/api/admin/users/${id}`),
  promote: (id: string) => api.post<UserResponse>(`/api/admin/users/${id}/promote`),
  demote: (id: string) => api.post<UserResponse>(`/api/admin/users/${id}/demote`),
};
