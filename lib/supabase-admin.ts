import { createClient } from "@supabase/supabase-js";

// SUPABASE_URL (server-only, never inlined) takes priority over
// NEXT_PUBLIC_SUPABASE_URL which gets inlined to "" when unset at build time.
const rawUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";
const supabaseUrl = rawUrl.startsWith("https://") ? rawUrl : "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  global: {
    fetch: (url, options) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});

export function supabaseConfigured(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return key.length > 10 && key !== "placeholder";
}
