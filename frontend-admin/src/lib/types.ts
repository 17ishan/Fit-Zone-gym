export type Role = "USER" | "ADMIN";
export type MembershipStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type ContactStatus = "NEW" | "READ" | "ARCHIVED";

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

export interface MembershipResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId?: number | null;
  planName: string;
  priceMinor: number;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  createdAt: string;
}

export interface PaymentResponse {
  id: string;
  membershipId: string;
  userId: string;
  userName: string;
  amountMinor: number;
  status: PaymentStatus;
  method?: string | null;
  providerPaymentId?: string | null;
  createdAt: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface AllowlistResponse {
  id: number;
  email: string;
  addedBy?: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeMemberships: number;
  totalRevenueMinor: number;
  paymentsThisMonth: number;
  newContacts: number;
  membershipsByPlan: { planName: string; count: number }[];
  revenueByMonth: { month: string; totalMinor: number }[];
}
