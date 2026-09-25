import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminCached: SupabaseClient | null = null;

/** Public project URL — safe fallback when Production env is missing/malformed. */
const DEFAULT_SUPABASE_URL = "https://pvhnwoukpccgeoqdsevm.supabase.co";

function resolveSupabaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (raw && !raw.includes("YOUR_PROJECT")) {
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return raw.replace(/\/$/, "");
      }
    } catch {
      // fall through to default
    }
  }
  return DEFAULT_SUPABASE_URL;
}

/** Service-role client for webhook + moderation mutations. Returns null if unset. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return null;
  if (adminCached) return adminCached;

  const url = resolveSupabaseUrl();
  if (!url) return null;

  try {
    adminCached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return adminCached;
  } catch (err) {
    console.error("getSupabaseAdmin: createClient failed", err);
    return null;
  }
}
