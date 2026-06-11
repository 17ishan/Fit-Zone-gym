import { api } from "@/lib/apiClient";
import type { MembershipResponse, PlanResponse } from "@/lib/types";

/** Public: fetch the active membership plans (admin-managed, from the backend). */
export async function getPlans(): Promise<PlanResponse[]> {
  return api.get<PlanResponse[]>("/api/public/plans");
}

/**
 * Authenticated purchase. The signed-in user's identity (email/name) comes from
 * the auth token; the backend creates the user+membership+payment atomically.
 * Throws ApiError(401) if the caller is not signed in.
 */
export async function createMembershipPurchase(params: {
  planId: number;
  customerData: { name: string; email: string; phone: string; address: string; age: string };
  paymentMethod?: string;
}): Promise<MembershipResponse> {
  const { planId, customerData, paymentMethod } = params;
  return api.post<MembershipResponse>("/api/memberships", {
    planId,
    name: customerData.name,
    phone: customerData.phone,
    address: customerData.address,
    age: customerData.age ? parseInt(customerData.age, 10) : undefined,
    paymentMethod: paymentMethod ?? "demo",
  });
}
