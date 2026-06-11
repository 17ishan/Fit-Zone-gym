import { api } from "@/lib/apiClient";
import type { PlanResponse } from "@/lib/types";

export interface PlanInput {
  name: string;
  priceMinor: number;
  durationMonths: number;
  features: string[];
  popular?: boolean;
  active?: boolean;
  sortOrder?: number;
}

export const plansService = {
  list: () => api.get<PlanResponse[]>("/api/admin/plans"),
  create: (body: PlanInput) => api.post<PlanResponse>("/api/admin/plans", body),
  update: (id: number, body: PlanInput) => api.patch<PlanResponse>(`/api/admin/plans/${id}`, body),
  deactivate: (id: number) => api.del<PlanResponse>(`/api/admin/plans/${id}`),
};
