import { supabase } from "@/lib/supabase.js";

export async function createPayment(data: {
  user_id: string;
  membership_id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  payment_id?: string;
}) {
  return supabase.from("payments").insert([data]);
}


