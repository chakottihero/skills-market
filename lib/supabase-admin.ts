import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawUrl.startsWith("https://") ? rawUrl : "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Check SUPABASE_SERVICE_ROLE_KEY (server-only, never build-time inlined)
// instead of NEXT_PUBLIC_* vars which get inlined as "" when unset at build time.
export function supabaseConfigured(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return key.length > 10 && key !== "placeholder";
}
