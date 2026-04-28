import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseUrl = rawUrl.startsWith("https://") ? rawUrl : "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export function supabaseConfigured(): boolean {
  return rawUrl.startsWith("https://") && !rawUrl.includes("placeholder");
}
