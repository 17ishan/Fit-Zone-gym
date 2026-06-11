import { supabase } from "@/lib/supabase.js";

export async function createUser(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  age?: number;
}) {
  return supabase.from("users").insert([data]).select().single();
}
