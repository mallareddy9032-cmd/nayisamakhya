/**
 * Shared Supabase clients for NayiSamakhya Admin Portal + API routes.
 *
 * - `supabase` — browser/anon singleton (NEXT_PUBLIC_* env)
 * - `getSupabaseAdmin` — service-role for desk / webhook mutations (RLS bypass)
 *
 * Prefer `getSupabase()` from `@/lib/supabase/client` on the server when you need
 * a null-safe anon client (returns null when env is missing → mock/local fallback).
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * createClient throws if url/key are empty (breaks `next build` page collection).
 * Keep brief env fallbacks above; only the constructor uses inert placeholders.
 * Callers must check `isSupabaseEnvReady()` / `getSupabase()` before querying.
 */
const clientUrl = supabaseUrl.trim() || "https://placeholder.supabase.co";
const clientKey = supabaseAnonKey.trim() || "public-anon-key";

const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  if (init?.signal) {
    if (init.signal.aborted) controller.abort();
    else
      init.signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
  }
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeout),
  );
};

/** Anon-key singleton — safe to import from client components. */
export const supabase = createClient(clientUrl, clientKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: fetchWithTimeout },
});

/** True when public URL + anon key look configured (not placeholder). */
export function isSupabaseEnvReady(): boolean {
  const url = supabaseUrl.trim();
  const key = supabaseAnonKey.trim();
  return Boolean(url && key && !url.includes("YOUR_PROJECT"));
}

export {
  getSupabaseAdmin,
  getSupabaseAdmin as getSupabaseAdminClient,
} from "@/lib/supabase/admin";
