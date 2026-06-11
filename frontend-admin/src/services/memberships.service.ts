import { api } from "@/lib/apiClient";
import type { MembershipResponse, MembershipStatus, PageResponse } from "@/lib/types";

export const membershipsService = {
  list: (page = 0, status?: MembershipStatus) =>
    api.get<PageResponse<MembershipResponse>>(
      `/api/admin/memberships?page=${page}&size=20${status ? `&status=${status}` : ""}`
    ),
  update: (id: string, body: Partial<{ status: MembershipStatus; planId: number }>) =>
    api.patch<MembershipResponse>(`/api/admin/memberships/${id}`, body),
  remove: (id: string) => api.del<void>(`/api/admin/memberships/${id}`),
};
