import { api } from "@/lib/apiClient";

/** Public: persist a contact-form submission (visible in the admin inbox). */
export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await api.post("/api/public/contact", data);
}
