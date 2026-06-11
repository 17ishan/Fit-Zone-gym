export type Role = "USER" | "ADMIN";

export interface UserResponse {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  age?: number | null;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

export interface PlanResponse {
  id: number;
  name: string;
  priceMinor: number;
  durationMonths: number;
  features: string[];
  popular: boolean;
  active: boolean;
  sortOrder: number;
}

export type MembershipStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface MembershipResponse {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  planId?: number | null;
  planName: string;
  priceMinor: number;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  createdAt?: string;
}

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface PaymentResponse {
  id: string;
  membershipId: string;
  userId: string;
  userName?: string;
  amountMinor: number;
  status: PaymentStatus;
  method?: string | null;
  providerPaymentId?: string | null;
  createdAt: string;
}
