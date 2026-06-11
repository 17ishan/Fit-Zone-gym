import { api } from "@/lib/apiClient";
import type { AllowlistResponse } from "@/lib/types";

export const allowlistService = {
  list: () => api.get<AllowlistResponse[]>("/api/admin/allowlist"),
  add: (email: string) => api.post<AllowlistResponse>("/api/admin/allowlist", { email }),
  remove: (id: number) => api.del<void>(`/api/admin/allowlist/${id}`),
};
