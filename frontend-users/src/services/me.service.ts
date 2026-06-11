import { api } from "@/lib/apiClient";
import type { MembershipResponse, PaymentResponse, UserResponse } from "@/lib/types";

/** Memberships belonging to the signed-in user. */
export async function getMyMemberships(): Promise<MembershipResponse[]> {
  return api.get<MembershipResponse[]>("/api/me/memberships");
}

/** Payment history for the signed-in user. */
export async function getMyPayments(): Promise<PaymentResponse[]> {
  return api.get<PaymentResponse[]>("/api/me/payments");
}

/** Update the signed-in user's own profile. Null/undefined fields are ignored by the backend. */
export async function updateMyProfile(data: {
  name?: string;
  phone?: string;
  address?: string;
  age?: number;
}): Promise<UserResponse> {
  return api.patch<UserResponse>("/api/me", data);
}
