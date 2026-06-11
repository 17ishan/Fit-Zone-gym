import { api } from "@/lib/apiClient";
import type { PageResponse, PaymentResponse, PaymentStatus } from "@/lib/types";

export const paymentsService = {
  list: (page = 0, status?: PaymentStatus) =>
    api.get<PageResponse<PaymentResponse>>(
      `/api/admin/payments?page=${page}&size=20${status ? `&status=${status}` : ""}`
    ),
  update: (id: string, body: Partial<{ status: PaymentStatus; method: string }>) =>
    api.patch<PaymentResponse>(`/api/admin/payments/${id}`, body),
  remove: (id: string) => api.del<void>(`/api/admin/payments/${id}`),
};
