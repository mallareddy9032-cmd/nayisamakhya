import { type SupabaseClient } from "@supabase/supabase-js";
import {
  isSupabaseEnvReady,
  supabase,
} from "@/lib/supabaseClient";

export function isSupabaseConfigured(): boolean {
  return isSupabaseEnvReady();
}

/**
 * Server-safe anon client. Returns null when env is missing (local static fallback).
 * Reuses the shared `supabase` singleton from `@/lib/supabaseClient` to avoid
 * conflicting duplicate clients.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return supabase;
}
