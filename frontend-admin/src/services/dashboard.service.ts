import { api } from "@/lib/apiClient";
import type { DashboardStats } from "@/lib/types";

export const dashboardService = {
  stats: () => api.get<DashboardStats>("/api/admin/dashboard/stats"),
};
