import { api } from "@/lib/apiClient";
import type { ContactResponse, ContactStatus, PageResponse } from "@/lib/types";

export const contactsService = {
  list: (page = 0, status?: ContactStatus) =>
    api.get<PageResponse<ContactResponse>>(
      `/api/admin/contacts?page=${page}&size=20${status ? `&status=${status}` : ""}`
    ),
  update: (id: string, status: ContactStatus) =>
    api.patch<ContactResponse>(`/api/admin/contacts/${id}`, { status }),
  remove: (id: string) => api.del<void>(`/api/admin/contacts/${id}`),
};
